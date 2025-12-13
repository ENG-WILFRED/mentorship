import React from 'react';
import { prisma } from '../../../../lib/prisma';
import SermonPageClient from './client';

type Params = { params: { id: string } };

export default async function SermonPageServer({ params }: Params) {
  // `params` may be a Promise in some Next versions — unwrap before use
  // See: https://nextjs.org/docs/messages/sync-dynamic-apis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolvedParams: any = await params;
  const id = Number(resolvedParams.id ?? params.id);

  if (Number.isNaN(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-white">Sermon not found</h1>
          <p className="mt-2 text-slate-400">Invalid sermon identifier.</p>
        </div>
      </div>
    );
  }

  try {
    const sermon = await prisma.sermon.findUnique({
      where: { id },
      include: { comments: true, reactions: true },
    });

    if (!sermon) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-bold text-white">Sermon not found</h1>
            <p className="mt-2 text-slate-400">The requested sermon could not be located.</p>
          </div>
        </div>
      );
    }

    // Get user from request headers (passed by auth middleware or client session)
    // For now, we'll pass null and let the client handle it
    const user = {
      id: null,
      email: null,
      isLoggedIn: false,
    };

    // Fetch other sermons by the same author (exclude current)
    let moreSermons: { id: number; title: string; youtubeId?: string | null; videoUrl?: string | null; createdAt: Date }[] = [];
    if (sermon.author) {
      moreSermons = await prisma.sermon.findMany({
        where: {
          author: sermon.author,
          NOT: { id },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { id: true, title: true, youtubeId: true, videoUrl: true, createdAt: true },
      });
    }

    return <SermonPageClient sermon={sermon} user={user} moreSermons={moreSermons} />;
  } catch (err) {
    console.error('Error fetching sermon:', err);
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className=" text-center">
          <h1 className="text-3xl font-bold text-white">Error loading sermon</h1>
          <p className="mt-2 text-slate-400">An error occurred. Check the server logs.</p>
        </div>
      </div>
    );
  }
}

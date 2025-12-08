
"use client";
import React, { useState } from 'react';
import { useToast } from '../../../../components/Toast';
import Reactions from '../../../../components/sermon/Reactions';
import Comments from '../../../../components/sermon/Comments';

interface SermonData {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  youtubeId: string | null;
  author: string | null;
  topic: string | null;
  createdAt: Date;
  comments: { id: number; message: string; userId: number | null; createdAt: Date }[];
  reactions: { id: number; emoji: string; userId: number | null }[];
}

interface User {
  id: number;
  email: string;
  isLoggedIn: boolean;
}

interface SermonPageClientProps {
  sermon: SermonData;
  user: User;
}

interface MoreSermon {
  id: number;
  title: string;
  youtubeId?: string | null;
  videoUrl?: string | null;
  createdAt: Date;
}

interface SermonPageClientPropsExtended extends SermonPageClientProps {
  moreSermons?: MoreSermon[];
}

export default function SermonPageClient({ sermon, user, moreSermons = [] }: SermonPageClientPropsExtended) {
  const toast = useToast();
  const [comments, setComments] = useState<string[]>(
    sermon.comments.map((c) => c.message) || []
  );
  const [newComment, setNewComment] = useState('');
  const reactionsList = ['👍', '❤️', '🔥', '😂', '🎉', '🙏'];

  const reactionCounts = sermon.reactions.reduce(
    (acc, r) => ({ ...acc, [r.emoji]: (acc[r.emoji] || 0) + 1 }),
    {} as Record<string, number>
  );

  const handleCommentChange = (text: string) => setNewComment(text);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // optimistic UI
      setComments((c) => [...c, newComment]);
      setNewComment('');
      // persist
      fetch('/api/sermons/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sermonId: sermon.id, userId: user.id, message: newComment }),
      })
        .then(async (r) => {
          if (!r.ok) throw new Error('Failed to post comment');
          toast('Comment posted', 'success');
          return r.json();
        })
        .catch((err) => {
          console.error(err);
          toast('Could not post comment', 'error');
        });
    }
  };

  const handleReaction = (emoji: string) => {
    // optimistic UI: we could update locally but we'll call API and show toast
    fetch('/api/sermons/reaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sermonId: sermon.id, userId: user.id, emoji }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to toggle reaction');
        const data = await r.json();
        // TODO: update local reaction counts from data.counts
        toast('Reaction updated', 'success');
      })
      .catch((err) => {
        console.error(err);
        toast('Could not update reaction', 'error');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950 py-12 px-4">
      {/* Hero */}
      <div className="mb-8 w-full px-6">
        <div className="inline-block px-3 py-1 mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-semibold text-white">
          Sermon
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{sermon.title}</h1>
        <p className="text-sm text-slate-300">By {sermon.author || 'Unknown author'} • {sermon.createdAt ? new Date(sermon.createdAt).toLocaleDateString() : ''}</p>
      </div>

      {/* Main grid: video left, all other sections right */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start px-6">
        {/* Left: Video */}
        <div className="lg:col-span-2">
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-75 group-hover:opacity-100 blur transition duration-500" />
            <div className="relative bg-black rounded-3xl overflow-hidden">
              {sermon.videoUrl ? (
                <video src={sermon.videoUrl} controls className="w-full aspect-video object-cover rounded-3xl" />
              ) : sermon.youtubeId ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    title={`YouTube Sermon ${sermon.id}`}
                    src={`https://www.youtube.com/embed/${sermon.youtubeId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-xl text-slate-400">No video available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Optionally show a brief description under the video on smaller screens */}
          <div className="block lg:hidden glass-effect rounded-2xl p-4"> 
            <h3 className="text-lg font-bold text-white">About</h3>
            <p className="text-slate-300 mt-2">{sermon.description || 'No description provided.'}</p>
          </div>
        </div>

        {/* Right: rest sections */}
        <div className="lg:col-span-1 space-y-6">
          {/* About */}
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">About</h3>
            <p className="text-slate-300 text-sm">{sermon.description || 'No description provided.'}</p>
            <div className="mt-3">
              {sermon.topic && <span className="inline-flex items-center px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-semibold border border-indigo-500/30">{sermon.topic}</span>}
            </div>
          </div>

          {/* Reactions */}
          <div className="glass-effect rounded-2xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">Reactions</h3>
            <Reactions reactions={reactionCounts} onReaction={handleReaction} user={user} reactionsList={reactionsList} />
          </div>

          {/* Comments */}
          <div className="glass-effect rounded-2xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">Discussion • {comments.length}</h3>
            <Comments comments={comments} newComment={newComment} onCommentChange={handleCommentChange} onSubmitComment={handleSubmitComment} user={user} />
          </div>

          {/* Transcript */}
          <div className="glass-effect rounded-2xl p-4">
            <h3 className="text-lg font-bold text-white mb-2">Transcript</h3>
            <p className="text-slate-400 text-sm">Transcript will appear here when available.</p>
          </div>

          {/* More sermons by author */}
          <div className="glass-effect rounded-2xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">More from {sermon.author || 'this author'}</h3>
            {moreSermons && moreSermons.length > 0 ? (
              <ul className="space-y-3">
                {moreSermons.map((s) => (
                  <li key={s.id} className="flex items-center justify-between bg-slate-800/40 p-3 rounded-lg hover:bg-slate-800/60 transition">
                    <div>
                      <a href={`/mentor/sermons/${s.id}`} className="text-white font-semibold">{s.title}</a>
                      <div className="text-slate-400 text-xs">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</div>
                    </div>
                    <div className="text-2xl">🎙️</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">No other sermons for that author.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .glass-effect {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
      `}</style>
    </div>
  );
}

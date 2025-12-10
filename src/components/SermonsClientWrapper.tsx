"use client";

import React from 'react';
import SermonsClient from './SermonsClient';
import { getSession } from '@/lib/session';

interface Props {
  initialSermons: any[];
  uploadAction?: any;
  addCommentAction?: any;
  toggleReactionAction?: any;
}

export default function SermonsClientWrapper({ initialSermons, uploadAction, addCommentAction, toggleReactionAction }: Props) {
  const session = getSession();

  const user = {
    email: session.email ?? '',
    id: (session.userId ?? 0) as number,
    isLoggedIn: !!session.accessToken,
    role: session.role ?? 'guest',
  };

  return (
    <SermonsClient
      initialSermons={initialSermons}
      user={user}
      uploadAction={uploadAction}
      addCommentAction={addCommentAction}
      toggleReactionAction={toggleReactionAction}
    />
  );
}

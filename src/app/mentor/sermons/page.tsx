import { getSermons, createSermonFromForm, addComment, toggleReaction } from '@/actions/sermons';
import SermonsClient from '@/components/SermonsClient';

export default async function SermonsPage() {
  const sermons = await getSermons();

  // Simulated auth object for now — replace with real auth if available
  const user = { email: 'user@email.com', id: 1, isLoggedIn: true, role: 'ADMIN' };

  return (
    <SermonsClient
      initialSermons={sermons}
      user={user}
      uploadAction={createSermonFromForm}
      addCommentAction={addComment}
      toggleReactionAction={toggleReaction}
    />
  );
}
import { getSermons, createSermonFromForm, addComment, toggleReaction } from '@/actions/sermons';
import SermonsClientWrapper from '@/components/SermonsClientWrapper';

export default async function SermonsPage() {
  const sermons = await getSermons();

  // Render a client wrapper which will read session from localStorage
  return (
    <SermonsClientWrapper
      initialSermons={sermons}
      uploadAction={createSermonFromForm}
      addCommentAction={addComment}
      toggleReactionAction={toggleReaction}
    />
  );
}
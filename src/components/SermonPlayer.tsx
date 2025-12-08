import React from 'react';

export default function SermonPlayer({ youtubeId }: { youtubeId: string }) {
  if (!youtubeId) return null;
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
      <iframe
        title="Sermon player"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}

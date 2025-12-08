// components/gallery/ImageGrid.tsx
import { motion } from 'framer-motion';
import MediaCard from './MediaCard';
import { ImageItem } from './data';

interface ImageGridProps {
  images: ImageItem[];
  onImageClick: (image: ImageItem) => void;
}

export default function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {images.map((image) => (
        <MediaCard
          key={image.id}
          type="image"
          title={image.title}
          category={image.category}
          tags={image.tags}
          createdAt={image.createdAt}
          thumbnail={image.img}
          onClick={() => onImageClick(image)}
        />
      ))}
    </motion.div>
  );
}
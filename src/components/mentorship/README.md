# Mentorship Project

This project is a mentorship gallery application that allows users to explore and upload media items, including images and videos, with various filtering and sorting options.

## Project Structure

The project is organized as follows:

```
mentorship
├── src
│   ├── components
│   │   └── gallery
│   │       ├── index.ts
│   │       ├── Gallery.tsx
│   │       ├── GalleryItem.tsx
│   │       ├── Lightbox.tsx
│   │       ├── VideoPlayer.tsx
│   │       ├── UploadModal.tsx
│   │       ├── useGallery.ts
│   │       └── types.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Features

- **Gallery Page**: The main container for displaying media items with state management for filters, pagination, and modals.
- **Filters**: Users can filter items by category, tags, and sort order.
- **Search Functionality**: A search bar to find items by title or tags.
- **Image and Video Grids**: Separate grids for displaying images and videos, with modals for viewing and playing media.
- **Upload Media**: Users can upload their own media files through a dedicated modal.
- **Responsive Design**: The gallery is designed to be responsive and user-friendly across devices.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd mentorship
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type safety and better development experience.
- **Framer Motion**: For animations and transitions.
- **Next.js**: For server-side rendering and routing.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
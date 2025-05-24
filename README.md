# Dragfolio

A modern drag-and-drop portfolio builder that allows users to create beautiful, customizable portfolios without writing a single line of code.

![Dragfolio Banner](https://via.placeholder.com/1200x400?text=Dragfolio)

## 🚀 Features

- **Intuitive Drag-and-Drop Editor**: Build your portfolio by simply dragging and dropping components
- **Responsive Design**: Preview your portfolio in desktop, tablet, and mobile views
- **Customizable Themes**: Personalize colors, fonts, and layouts to match your style
- **Rich Component Library**: Choose from various section types (About, Projects, Skills, Resume, etc.)
- **Live Preview**: See changes in real-time as you build
- **Export Options**: Download as HTML/ZIP or deploy to a custom subdomain
- **Template Library**: Start with professionally designed templates for different professions

## 🛠️ Tech Stack

### Frontend
- React.js
- Material UI (UI components)
- React DnD (Drag-and-drop functionality)
- Framer Motion (Animations)
- TypeScript

### Backend
- Node.js + Express.js
- MongoDB (Database)
- JWT + bcrypt (Authentication)
- Cloudinary (Image storage)

## 📋 Project Structure

```
dragfolio/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/
│       ├── components/     # React components
│       │   ├── blocks/     # Portfolio section blocks
│       │   ├── editor/     # Editor components
│       │   ├── layout/     # Layout components
│       │   └── ui/         # UI components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── store/          # State management
│       └── types/          # TypeScript type definitions
├── server/                 # Backend Node.js application
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
└── shared/                 # Shared code between client and server
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dragfolio.git
   cd dragfolio
   ```

2. Install dependencies for the entire project:
   ```bash
   # Install dependencies for both client and server from the root directory
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3001
   SESSION_SECRET=your_session_secret
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   DATABASE_URL=your_mongodb_connection_string
   # Optional: Add your Cloudinary credentials
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

### Running the Application

1. Start both the client and server with a single command from the root directory:
   ```bash
   npm run dev
   ```

   This will start:
   - The backend server on http://localhost:3001
   - The frontend client on http://localhost:5173 (or the next available port)

2. Open your browser and navigate to the frontend URL shown in the terminal (typically http://localhost:5173)

### MongoDB Setup

1. Create a MongoDB Atlas account if you don't have one: https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster and get your connection string
3. Replace `your_mongodb_connection_string` in the `.env` file with your actual MongoDB connection string

### Template Management

The application comes with 10 pre-configured professional templates for various fields including developers, designers, photographers, students, freelancers, writers, artists, musicians, teachers, and entrepreneurs.

#### Adding New Templates

You can add new templates to the application by modifying the `server/routes/template.ts` file or by creating a dedicated script in the `server/scripts` directory.

1. **Direct Addition to Template Routes**:
   - Open `server/routes/template.ts`
   - Add a new template object to the `templates` array following the existing template structure
   - Each template should include:
     - Unique ID
     - Name and description
     - Category (developer, designer, student, freelancer, photographer, etc.)
     - Thumbnail URL
     - Sections array with appropriate content
     - Theme configuration

2. **Using a Script**:
   - Create a new script in the `server/scripts` directory (e.g., `add-custom-templates.ts`)
   - Use the Mongoose Template model to create and save new templates
   - Run the script with: `npx tsx server/scripts/add-custom-templates.ts`

#### Template Structure Example

```typescript
{
  id: 'unique-id',
  name: 'Template Name',
  description: 'Template description',
  category: 'category-name',  // One of: developer, designer, student, freelancer, photographer
  thumbnail: 'https://example.com/thumbnail.jpg',
  sections: [
    {
      id: generateId(),
      type: 'about',  // Section type (about, projects, skills, resume, testimonials, blog, contact)
      title: 'About Me',
      content: {
        headline: 'Your Profession',
        bio: 'Your bio description',
        image: 'https://example.com/profile.jpg'
      },
      order: 0,
      layout: 'full'  // Layout type (full, half, two-columns)
    },
    // Add more sections as needed
  ],
  theme: {
    mode: 'light',  // light or dark
    primaryColor: '#3490dc',
    secondaryColor: '#ffed4a',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px'
  },
  isFeatured: false,
  isPublic: true
}
```

## 🧪 Testing

### Unit Tests
```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

### End-to-End Tests
```bash
# Run Cypress tests
cd client
npm run cypress:open
```

## 🔧 Development Workflow

1. **Editor Components**: The editor is composed of several key components:
   - `EditorSidebar`: Contains the component library and section list
   - `EditorCanvas`: Main editing area where sections are rendered
   - `PropertiesPanel`: Edit properties of selected blocks
   - `ThemeCustomizer`: Customize theme settings
   - `LivePreview`: Preview the portfolio in different device sizes

2. **Block Components**: Each section type has its own component:
   - `AboutBlock`: About Me section
   - `ProjectsBlock`: Projects showcase
   - `SkillsBlock`: Skills display
   - `ContactBlock`: Contact information
   - And more...

3. **Drag-and-Drop**: Implemented using React DnD with:
   - `DraggableItem`: Items that can be dragged from the sidebar
   - `DropZone`: Areas where items can be dropped
   - `Canvas`: Main drop target for blocks

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Material UI](https://mui.com/) for the UI components
- [React DnD](https://react-dnd.github.io/react-dnd/) for drag-and-drop functionality
- [Framer Motion](https://www.framer.com/motion/) for animations

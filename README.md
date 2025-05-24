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

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dragfolio.git
   cd dragfolio
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dragfolio
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Create a `.env` file in the client directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

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

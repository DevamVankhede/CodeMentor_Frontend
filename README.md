# CodeMentor AI

AI-powered coding platform with interactive learning, code analysis, and personalized roadmaps.

## 🚀 Features

- **AI Code Editor** - Analyze, refactor, and improve code with Gemini AI
- **Learning Roadmaps** - AI-generated personalized learning paths
- **Coding Games** - Interactive challenges (Bug Hunt, Code Completion, etc.)
- **Collaboration Hub** - Real-time code collaboration
- **Profile & Progress** - Track your learning journey

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- .NET 8.0
- Entity Framework Core
- SQL Server / PostgreSQL

**AI:**
- Google Gemini 2.5 Pro

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- .NET 8.0 SDK (for backend)
- Gemini API key

## 🏃 Quick Start

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/codementor-ai.git
cd codementor-ai
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` and add your keys:
\`\`\`env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
\`\`\`

### 4. Run development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Docker Deployment

\`\`\`bash
# Build image
docker build -t codementor-ai .

# Run container
docker run -p 3000:3000 \\
  -e NEXT_PUBLIC_GEMINI_API_KEY=your_key \\
  -e NEXT_PUBLIC_API_URL=https://your-backend.com \\
  codementor-ai
\`\`\`

## 📁 Project Structure

\`\`\`
codementor-ai/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── explore/      # Explore page
│   │   ├── games/        # Games page
│   │   └── ...
│   ├── components/       # React components
│   │   ├── editor/       # Code editor components
│   │   ├── games/        # Game components
│   │   ├── ui/           # UI components
│   │   └── ...
│   ├── lib/              # Utilities and services
│   │   ├── gemini.ts     # Gemini AI service
│   │   ├── roadmapGenerator.ts
│   │   └── ...
│   └── contexts/         # React contexts
├── public/               # Static files
├── .env.local           # Environment variables
├── Dockerfile           # Docker configuration
└── package.json         # Dependencies
\`\`\`

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXT_PUBLIC_GEMINI_API_KEY\` | Google Gemini API key | Yes |
| \`NEXT_PUBLIC_API_URL\` | Backend API URL | Yes |
| \`NEXT_PUBLIC_APP_URL\` | Frontend URL | Yes |
| \`JWT_SECRET\` | JWT secret for auth | Yes |
| \`DATABASE_URL\` | Database connection | Optional |

## 🧪 Testing

\`\`\`bash
# Run linter
npm run lint

# Type check
npm run type-check

# Build test
npm run build
\`\`\`

## 📚 API Documentation

### Frontend API Routes

- \`POST /api/roadmap/generate\` - Generate AI roadmap
- \`GET /api/backend/test\` - Test backend connectivity
- \`GET /api/test-gemini\` - Test Gemini API
- \`POST /api/ai/*\` - AI code analysis endpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Open an issue on GitHub
- Contact: your-email@example.com

## 🙏 Acknowledgments

- Google Gemini AI for powering the AI features
- Next.js team for the amazing framework
- All contributors and users

---

**Made with ❤️ by Your Team**

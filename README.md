# Women's Day Safety Quiz

A React-based interactive quiz application celebrating International Women's Day 2026.

## Features

- Interactive safety quiz with 100 questions across 5 rounds
- Leaderboard with scoring system
- Admin panel for managing responses
- Excel export functionality
- Responsive design for mobile and desktop
- Company branding with ConsultTrans and Sutherland logos

## Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps to Deploy

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/womens-safety-quiz.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Create React App
     - **Root Directory**: `./` (leave as default)
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   - Click "Deploy"

3. **Your app will be live!**
   - Vercel will provide a URL like `your-app-name.vercel.app`
   - The API endpoints will be available at `/api/*`

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## API Endpoints

- `GET /api/leaderboard` - Get all leaderboard entries
- `POST /api/leaderboard` - Submit quiz results
- `DELETE /api/leaderboard` - Clear all responses
- `DELETE /api/leaderboard/[id]` - Delete specific response
- `POST /api/leaderboard/delete-multiple` - Delete multiple responses

## Technologies Used

- React 18
- Express.js (Vercel serverless functions)
- XLSX for Excel export
- Responsive CSS
- SVG logos for branding

## Admin Access

Access the admin panel by clicking "Login to Admin Dashboard" and use password: `admin123`

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Navigate to the project directory
cd "Woman's Day/quiz-react"

# Install dependencies
npm install

# Start development server
npm start
```
The app will open at `http://localhost:3000` (or next available port).

### Build for Production
```bash
npm run build
```

## 📊 Browser Testing

Tested on:
- **Mobile**: iPhone SE, iPhone 12, Samsung Galaxy S21, Pixel 5
- **Tablet**: iPad Air, Samsung Galaxy Tab S7
- **Desktop**: Windows 10/11, macOS Monterey
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🔧 Admin Features

- **Password Protection**: Secure admin access (password: 'admin123')
- **Data Export**: Excel file generation with user responses
- **Selective Clearing**: Remove specific user data
- **Real-time Updates**: Live leaderboard updates
- **Response Management**: View and manage all quiz submissions

## 📄 Collecting Responses

Currently the answers are stored in localStorage and can be exported via the admin panel. You can replace the `submitResults` function in `src/App.js` with a POST request to a backend server or [Formspree](https://formspree.io/) to capture submissions.

For example, to send to Formspree:
```js
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

## 🚀 Deploying to Vercel

1. Commit the project to a Git repository (GitHub/GitLab/Bitbucket).
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Select the `quiz-react` folder if needed and set the framework preset to **Create React App**.
4. Vercel will detect the build command (`npm run build`) and the output directory (`build`).
5. After deployment, your quiz will be live at the provided Vercel URL.

You can configure environment variables or serverless functions in Vercel to handle form submissions securely.

## 🛠️ Technical Implementation

### CSS Architecture
- **Mobile-First**: Progressive enhancement approach
- **CSS Custom Properties**: Consistent theming
- **Media Queries**: Strategic breakpoints for different devices
- **Feature Queries**: Modern CSS feature detection

### Performance Optimizations
- **Lazy Loading**: Components load as needed
- **Bundle Splitting**: Optimized JavaScript chunks
- **Caching**: Service worker for offline functionality
- **Touch Optimization**: Hardware-accelerated animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

For questions or issues, please create an issue in the repository.

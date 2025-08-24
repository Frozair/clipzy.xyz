# Clipzy Landing Page

A modern, responsive landing page for Clipzy - a stream clip management app designed for Twitch creators.

## 🚀 Features

- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Built-in dark/light theme support
- **Form Integration**: Formspark integration for waitlist signups
- **Analytics**: Vercel Analytics integration
- **Modern UI**: Built with Tailwind CSS and React
- **Performance**: Optimized with Vite build tool

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Forms**: Formspark
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd clipzy.xyz
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🔧 Configuration

### Environment Variables
- No environment variables required for basic functionality
- Formspark endpoint is configured in the component

### Tailwind CSS
- Custom color palette defined in `tailwind.config.js`
- Dark mode support enabled
- Custom animations and keyframes included

## 📱 Components

- **WaitlistLanding**: Main landing page component
- **PhonePreview**: Interactive phone mockup
- **PlatformBadges**: Platform availability indicators
- **WaitlistForm**: Email signup form with validation

## 🎨 Customization

### Colors
The app uses a custom color palette defined in Tailwind config:
- Primary: Fuchsia and Sky gradients
- Neutral: Custom neutral scale
- Accent: Twitch purple (#9146FF)

### Typography
- Primary font: Inter (system fallback)
- Responsive text sizing
- Proper heading hierarchy

## 🚀 Deployment

This project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Vercel Analytics will be automatically enabled

## 📊 Analytics

Vercel Analytics is integrated and will track:
- Page views
- User interactions
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support or questions, please open an issue in the repository.


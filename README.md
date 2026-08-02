# Clipzy Landing Page

A modern, responsive landing page for Clipzy - a stream clip management app designed for Twitch creators.

## 🚀 Features

- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Built-in dark/light theme support
- **Waitlist Flow**: Formspark capture with Resend welcome emails
- **Analytics**: Vercel Analytics integration
- **Modern UI**: Built with Tailwind CSS and React
- **Performance**: Optimized with Vite build tool

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Forms**: Formspark + Resend via Vercel Functions
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

Copy `.env.example` to `.env.local` for local testing, and set the same values in Vercel Production before deploying.

Required:

```bash
FORMSPARK_FORM_ID=
RESEND_API_KEY=
RESEND_WAITLIST_SEGMENT_ID=
WAITLIST_WELCOME_FROM_EMAIL=
```

Recommended:

```bash
WAITLIST_WELCOME_FROM_NAME=Clipzy
WAITLIST_WELCOME_REPLY_TO_EMAIL=
```

Optional:

```bash
FORMSPARK_ACTION_URL=
```

`FORMSPARK_ACTION_URL` can be used when you want to provide a full Formspark endpoint instead of letting the API route build `https://submit-form.com/{FORMSPARK_FORM_ID}`.

### Waitlist Backend

The waitlist form submits to `/api/waitlist`, not directly to provider APIs from the browser.

In production this route runs as a Vercel Function. Plain `npm run dev` previews the Vite frontend only; use Vercel's local dev tooling when you need to exercise `/api/waitlist` against real env vars before deployment.

Flow:

1. The frontend validates the email and captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referrer`, and `landingPath`.
2. `/api/waitlist` validates the email server-side.
3. The API route saves the signup to Formspark.
4. Only after Formspark succeeds, the API route adds the signup to Resend Contacts and, when configured, the Clipzy waitlist segment.
5. The API route sends the branded Resend welcome email.
6. If either Resend action fails, the signup still succeeds because Formspark already saved it.

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
2. Create a Formspark form and set `FORMSPARK_FORM_ID`
3. Verify your sending domain in Resend and set `RESEND_API_KEY`
4. Create a Resend segment named `Clipzy Waitlist` and set `RESEND_WAITLIST_SEGMENT_ID` to its ID
5. Set `WAITLIST_WELCOME_FROM_EMAIL=hi@clipzy.xyz`
6. Set `WAITLIST_WELCOME_FROM_NAME=Clipzy` and `WAITLIST_WELCOME_REPLY_TO_EMAIL=hi@clipzy.xyz`
7. In Cloudflare Email Routing, verify `apps.frozair@gmail.com` as a destination and route `hi@clipzy.xyz` to it
8. Redeploy after env vars are configured
9. Import existing waitlist emails from Formspark into the same Resend segment before sending the first update
10. Send future updates as Resend Broadcasts to the segment, with Resend's unsubscribe footer enabled
11. Vercel Analytics will be automatically enabled

### Production Smoke Test

Use an incognito/private browser with a unique email and a test URL like:

```text
https://clipzy.xyz/?utm_source=test&utm_medium=manual&utm_campaign=waitlist_smoke_test&utm_content=button_a&utm_term=creator
```

Confirm:

- Empty and invalid email states validate correctly
- A valid signup shows the success state
- Formspark receives the submission
- Formspark includes UTM fields, referrer, and landing path
- Resend Contacts contains the signup in the Clipzy waitlist segment
- Resend logs a sent welcome email
- The welcome email arrives in the signup inbox
- Reply-to routes to the intended inbox through Cloudflare Email Routing
- Vercel function logs do not show Formspark or Resend errors

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

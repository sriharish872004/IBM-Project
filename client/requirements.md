## Packages
framer-motion | Page transitions and UI animations
recharts | Analytics charts for dashboard
lucide-react | Icons (already in base but ensuring version)
date-fns | Date formatting

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["'Merriweather'", "serif"],
  body: ["'Inter'", "sans-serif"],
}

API Integration:
- Uses Replit Auth for authentication
- Backend provides /api/schemes, /api/applications, /api/surveys
- AI endpoints: /api/schemes/recommend, /api/applications/:id/verify

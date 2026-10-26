# Verified project research

Source inspection date: 2026-10-25. These findings describe the public default-branch source; deployed behavior has not been tested.

## DietTracker

- Repository: https://github.com/SanjayPanwar73/DietTracker
- Inspected tree SHA: `7c07fa28c61101a1cec680f73211c86b0e85e7a2`.
- Purpose: personal nutrition and activity tracking with meal logging, calorie targets, charts, and AI-assisted meal planning and weekly insights.
- Verified frontend: React 18, Vite 6, React Router, Tailwind CSS 3, Axios, Chart.js/react-chartjs-2, jsPDF, Lucide React.
- Verified backend: Node.js, Express 4, MongoDB/Mongoose, bcryptjs, JWT, Multer, Google APIs, Axios.
- Features confirmed in source: email/password authentication; user profiles; BMR/activity/goal-derived calorie targets; authenticated food records; CalorieNinjas nutrition lookup; per-meal and macro charts; history; AI Indian meal plans with dietary/region/ingredient preferences; downloadable PDF recipes; weekly aggregate charts and AI commentary.
- Implemented integration: Google Fit OAuth and daily steps/calories/distance/active-minute aggregation, with MongoDB cache for past dates and fallback cache on upstream errors. Its live availability was not verified.
- Engineering decision supported by source: a React dashboard consumes separate Express API routes; protected nutrition and profile records are scoped to the JWT user. Historical fitness responses are cached so old dates can be served without another upstream request.
- AI provider actually used by current meal-plan, weekly-insight, and food-estimate routes: OpenRouter (`openrouter/free`). Installed Gemini/Anthropic dependencies and frontend Gemini wording do not establish that those providers are active.
- Photo caveat: `Photofoodrouter.js` accepts a photo upload but never includes the image bytes in the model request. It estimates from `foodName`; do not claim verified computer vision or image recognition.
- No repository screenshot set found. The only raster asset in the recursive tree is `frontend/src/assets/dt.jpg`; its role has not been visually verified. No verified public frontend demo found; API configuration defaults to localhost with `VITE_API_URL` override.

Evidence:

- https://github.com/SanjayPanwar73/DietTracker/blob/main/frontend/package.json
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/package.json
- https://github.com/SanjayPanwar73/DietTracker/blob/main/frontend/src/App.jsx
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/controllers/authController.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/middlewares/Authenticate.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/controllers/profileController.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/controllers/foodController.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/frontend/src/pages/DashBoard.jsx
- https://github.com/SanjayPanwar73/DietTracker/blob/main/frontend/src/pages/WeeklyInsights.jsx
- https://github.com/SanjayPanwar73/DietTracker/blob/main/frontend/src/pages/MealPlanner.jsx
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/routes/mealPlanRouter.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/routes/insightsRouter.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/routes/Photofoodrouter.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/backend/routes/Fitnessrouter.js
- https://github.com/SanjayPanwar73/DietTracker/blob/main/frontend/src/config/api.js

## SnapTrip

- Repository: https://github.com/SanjayPanwar73/SnapTrip
- Inspected tree SHA: `5918e52a2f10694708ce0c7d9f57c3f0b7dfeefa`.
- Purpose: a travel accommodation discovery and listing management application inspired by rental marketplaces.
- Verified frontend: server-rendered EJS with ejs-mate, HTML/CSS, Bootstrap 5, browser JavaScript, Leaflet/OpenStreetMap. It is not a React application; neither the package manifest nor source tree contains a React frontend.
- Verified backend: Node.js, Express 4, MongoDB/Mongoose, Passport local strategy, bcrypt, express-session with connect-mongo, Multer disk uploads, Joi review validation.
- Features confirmed in mounted routes and controllers: account signup/login/logout; accommodation listings; create/read/update/delete listing flows; category and keyword search; price filters and sorting; favorites; reviews and ratings; contact/feedback/newsletter routes. Source includes a Leaflet map presentation using listing geometry.
- Engineering decision supported by source: EJS templates render listing queries on the server, with session-based Passport authentication persisted in MongoDB, and Multer handling uploaded listing images on local disk.
- Cloudinary is a dependency and has configuration/unused controller code, but the mounted `routes/listing.js` uses `multerDiskConfig.js` and `/uploads/...` URLs. Do not describe Cloudinary as the verified active upload implementation.
- Booking caveat: `controllers/users.js` explicitly renders an empty bookings array and says it can be extended with a booking model. Do not claim functioning booking checkout, reservations, or payment processing.
- Authorization caveat: mounted listing edit/update/delete routes require login but do not call the available `isOwner` middleware. Avoid claiming verified owner-only protection or production-grade security.
- Screenshots: no dedicated screenshot folder or README screenshots found in the recursive tree. `uploads/` contains listing image assets, which must not be presented as UI screenshots.
- README advertises https://snaptrip-1.onrender.com . Web open on 2026-10-25 returned inaccessible; a working live demo was not verified. Keep this as an unverified candidate rather than a working-demo CTA.
- README JWT/API claims disagree with actual source: current app uses Passport sessions and HTML routes, not the described JWT `/api/...` endpoints.

Evidence:

- https://github.com/SanjayPanwar73/SnapTrip/blob/main/package.json
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/app.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/views/layouts/boilerplate.ejs
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/routes/listing.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/multerDiskConfig.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/controllers/users.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/routes/review.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/controllers/reviews.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/middleware.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/public/js/map.js
- https://github.com/SanjayPanwar73/SnapTrip/blob/main/README.md

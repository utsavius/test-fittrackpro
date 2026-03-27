# Walkthrough - FitTrack Pro

FitTrack Pro is now a fully functional, high-fidelity fitness application built according to the provided PRD. It features a premium "FitTrack Dark" design system with deep charcoal tones, electric lime highlights, and a focus on AI-driven personalization.

## Core Features

### 1. AI Recommendation Engine
Powered by a recovery-aware algorithm (`src/lib/workoutEngine.ts`), the app provides a personalized **Daily Pick** for your workout. It considers:
- **Muscle Recovery**: Implements the 48–72 hour recovery model.
- **Progressive Overload**: Adjusts intensity based on past sessions.
- **Custom Shuffling**: Tap the refresh icon on the home screen for an alternative plan.

### 2. Interactive Workout Logger
The [Log Workout](file:///Users/utsavraghuvanshi/.gemini/antigravity/scratch/src/app/log/page.tsx) screen allows for seamless session entry:
- **Rapid Adding**: Quick exercise selection from the 500+ library.
- **Unit Management**: Record LBS and REPS with clear completion tracking.
- **Persistence**: Workouts are saved locally to provide immediate feedback in the stats dashboard.

### 3. Performance Dashboard
A comprehensive view of your fitness journey using **Recharts**:
- **Volume Trend**: Area charts visualize total load lifted over time.
- **Strength Projections**: Line charts track 1RM (One-Rep Max) estimates.
- **Recovery Heatmap**: Visual bars indicate muscle group freshness.

### 4. Exercise Library
A searchable database ([Library Page](file:///Users/utsavraghuvanshi/.gemini/antigravity/scratch/src/app/library/page.tsx)) providing:
- Step-by-step instructions.
- Difficulty and Equipment tags.
- Primary muscle group categorization.

## Design Aesthetics
- **Theme**: FitTrack Dark (`#000000` / `#D4FF00`).
- **Typography**: Outfit (Modern, high-energy sans-serif).
- **Interactions**: Framer Motion powered slide-up animations and glassmorphism cards.

## How to Run
The development server is currently running at **http://localhost:3000**.
```bash
npm run dev
```

> [!TIP]
> Try "shuffling" your recommendation on the Home Screen to see the AI engine actively selecting different focus areas (Push, Pull, or Legs) based on your workout logic!

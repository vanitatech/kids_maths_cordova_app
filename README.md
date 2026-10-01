# Kids Cordova Maths App

A mobile-first mathematics learning application for young children, built with Apache Cordova and vanilla JavaScript. The app helps children build confidence with core numeracy skills such as counting, addition, subtraction, and worksheet practice, while tracking progress across lessons and unlocking mascots as they advance.

This project is designed to showcase practical front-end development skills, data-driven UX, and cross-platform mobile app structure in a portfolio-friendly format.

## Project overview

The Maths App is an educational game-style app where learners:

- progress through a series of maths lessons
- complete activities based on counting, addition, and subtraction
- practice with worksheet activities
- earn points and unlock mascots
- revisit previous lessons and monitor learning progress

The application uses a local database to store lesson content, activity definitions, and user progress so the learning experience feels persistent and personalized.

## Why I built this project

This project was created to explore:

- mobile app development with Apache Cordova
- front-end logic for interactive educational experiences
- local persistence and data seeding for app content
- user progression systems and gamified engagement
- building a full-featured product experience with a simple but scalable architecture

It is a strong example of a full-stack-like front-end project where product thinking, UI behavior, and data modeling all work together.

## Features

- Multi-lesson maths progression system
- Activity types including counting, addition, subtraction, and worksheets
- Progress tracking for completed lessons and current learning state
- Point system for engagement and reward feedback
- Mascot unlock and selection system
- Local database seeding for curriculum content
- Cross-platform packaging via Cordova
- Lightweight, dependency-based front-end architecture using ES modules

## Tech stack

- JavaScript (ES modules)
- Apache Cordova
- Dexie.js for IndexedDB access
- HTML/CSS for the mobile UI
- Local asset-based content structure

## Architecture

The app follows a lightweight MVC-style structure:

- Models manage data access and state
- Views render UI updates
- Controllers coordinate app logic and user flows
- Database seeding populates lessons and activities on first run

This keeps the project easy to navigate while showing modular design patterns and separation of responsibilities.

## Project structure

```text
.
├── config.xml
├── package.json
├── www/
│   ├── css/
│   ├── data/
│   ├── img/
│   ├── js/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── models/
│   │   ├── services/
│   │   ├── views/
│   │   └── index.js
│   └── index.html
├── typings/
└── README.md
```

## How it works

On app startup, the application:

1. waits for the Cordova device ready event
2. seeds the local database if it is empty
3. loads the current lesson and related activities
4. shows user progress and points
5. renders the active mascot and lesson content
6. lets the learner interact with the activity flow

This makes the app feel dynamic while maintaining a simple data model for educational content.

## Getting started

### Prerequisites

- Node.js and npm
- Apache Cordova CLI
- Android/iOS/browser platform tooling if you want to run on device/emulator

### Installation

```bash
npm install
```

### Run in a browser

```bash
npx cordova platform add browser
npx cordova run browser
```

### Build for a platform

```bash
npx cordova build android
```

or

```bash
npx cordova build ios
```

## Current status

This project is a working prototype / learning-focused application demonstrating a complete educational app flow. It is a strong portfolio project for software engineering roles, particularly for:

- front-end development
- mobile app development
- user experience design in product settings
- data-driven application logic
- practical JavaScript architecture

## Strengths for a portfolio

- demonstrates product thinking and user-centered design
- shows real-world application flow beyond basic CRUD
- includes gamification and learning progression patterns
- uses an actual local database and persistent state
- reflects cross-platform mobile app development experience

## Potential improvements

This project could be extended with:

- automated tests
- a more advanced analytics dashboard
- audio feedback and sound effects
- accessibility improvements for children
- drag-and-drop activities
- teacher/parent progress export
- stronger error handling and validation
- deployment pipeline and CI/CD

## License

This project is licensed under the Apache License 2.0.

## Author

Vanita Applebee
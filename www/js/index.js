import Seeder from './database/seeder.js';
import AppController from './controllers/appController.js';
import UserProgressController from './controllers/userProgressController.js';
import LessonController from './controllers/lessonController.js';
import MascotController from './controllers/mascotController.js';
import LessonActivityController from './controllers/lessonActivityController.js';

// Wait for the deviceready event before using any of Cordova's device APIs
document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
    // Cordova is now initialized
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    // Seed database if empty
    await Seeder.seedDatabase();

    // User Progress
    UserProgressController.showLessonsCompleted();
    UserProgressController.showPoints();

    // Show app
    AppController.show();

    // Mascots
    MascotController.showCurrent();

    // Lesson View
    LessonController.showCurrent();
    LessonActivityController.showAllCurrent();

    // TODO: Activity view
    // ... onclick

    // Mascots library view
    MascotController.showAll();

    // Make controllers globally accessible
    window.AppController = AppController;
    window.LessonController = LessonController;
    window.LessonActivityController = LessonActivityController;
}

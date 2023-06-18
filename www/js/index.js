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
    // Make the AppController globally accessible
    window.AppController = AppController;

    // Mascots
    MascotController.showCurrent();

    // TODO: Only show lesson on lesson-view
    // TODO: Lesson View
    LessonController.showCurrent();
    LessonActivityController.showAllCurrent();

    // TODO: Activity view
    // ...

    // TODO: Only show mascots list on mascot-library-view
    // TODO: Mascots library view
    MascotController.showAll();
}

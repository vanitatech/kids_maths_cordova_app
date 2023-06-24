import Seeder from './database/seeder.js';
import AppController from './controllers/appController.js';
import UserProgressController from './controllers/userProgressController.js';
import LessonController from './controllers/lessonController.js';
import MascotController from './controllers/mascotController.js';
import LessonActivityController from './controllers/lessonActivityController.js';
import AdditionActivityController from './controllers/additionActivityController.js';

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

    // Mascots
    await MascotController.showCurrent();

    // Lesson View
    await LessonController.showCurrent();

    // Mascots library view
    await MascotController.showAll();

    // Show app
    AppController.show();

    // Make controllers globally accessible
    window.AppController = AppController;
    window.LessonController = LessonController;
    window.LessonActivityController = LessonActivityController;
    window.AdditionActivityController = AdditionActivityController;
    // TODO: other activity controllers
}

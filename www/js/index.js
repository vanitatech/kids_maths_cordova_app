import Seeder from './database/seeder.js';
import AppController from './controllers/appController.js';
import UserProgressController from './controllers/userProgressController.js';
import LessonController from './controllers/lessonController.js';
import MascotController from './controllers/mascotController.js';
import LessonActivityController from './controllers/lessonActivityController.js';
import AdditionActivityController from './controllers/additionActivityController.js';
import { startWhenReady } from './services/startup.js';

// Wait for the deviceready event before using any of Cordova's device APIs
startWhenReady(document, Boolean(window.cordova), onDeviceReady, (error) => {
    console.error('Maths Kids startup failed:', error);
    document.getElementById('app').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('startup-error').hidden = false;
});

async function onDeviceReady() {
    // Cordova is now initialised
    if (window.cordova) {
        console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    }

    window.AppController = AppController;
    window.LessonController = LessonController;
    window.LessonActivityController = LessonActivityController;
    window.AdditionActivityController = AdditionActivityController;
    window.MascotController = MascotController;

    // Seed database if empty
    await Seeder.seedDatabase();

    // User Progress
    await UserProgressController.showLessonsCompleted();
    UserProgressController.showPoints();

    // Mascots
    await MascotController.showCurrent();

    // Lesson View
    await LessonController.showCurrent();

    // Mascots library view
    await MascotController.showAll();

    // Show app
    AppController.show();

}

import Seeder from './database/seeder.js';
import UserProgressController from './controllers/userProgressController.js';
import LessonController from './controllers/lessonController.js';
import MascotController from './controllers/mascotController.js';

// Wait for the deviceready event before using any of Cordova's device APIs
document.addEventListener('deviceready', onDeviceReady, false);

async function onDeviceReady() {
    // Cordova is now initialized
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    // Initialise Database
    await Seeder.seedDatabase();

    // User Progress
    UserProgressController.showLessonsCompleted();
    UserProgressController.showPoints();

    // TODO: Lessons
    LessonController.showCurrentLesson();

    // Mascots
    MascotController.showMascots();
}

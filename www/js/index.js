import Seeder from './database/seeder.js';
import AppController from './controllers/appController.js';
import UserProgressController from './controllers/userProgressController.js';
import LessonController from './controllers/lessonController.js';
import MascotController from './controllers/mascotController.js';
import LessonActivityController from './controllers/lessonActivityController.js';
import { bindActions, actionId } from './services/actions.js';
import { startWhenReady } from './services/startup.js';
import { validateProgress } from './services/progressStorage.js';
import db from './database/database.js';

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

    // Seed database if empty
    await Seeder.seedDatabase();
    validateProgress(localStorage,
        await db.lessons.toCollection().primaryKeys(),
        await db.mascots.toCollection().primaryKeys(),
        await db.lessonActivities.toCollection().primaryKeys());

    // User Progress
    await UserProgressController.showLessonsCompleted();
    UserProgressController.showPoints();

    // Mascots
    await MascotController.showCurrent();

    // Lesson View
    await LessonController.showCurrent();

    // Mascots library view
    await MascotController.showAll();

    bindActions(document.getElementById('app'), {
        'view-lesson': () => AppController.showView('lesson'),
        'view-mascots': () => AppController.showView('mascot-library'),
        'open-reset': () => AppController.showReset(),
        'cancel-reset': () => AppController.cancelReset(),
        'confirm-reset': () => AppController.confirmReset(),
        'next-lesson': () => LessonController.showNext(),
        activity: button => LessonActivityController.show(actionId(button)),
        'choose-card': button => LessonActivityController.chooseCard(button),
        'check-answer': () => LessonActivityController.checkAnswer(),
        'unlock-mascot': button => MascotController.unlock(actionId(button)),
    }, error => {
        console.error('Maths Kids action failed:', error);
        AppController.show();
        document.getElementById('app-feedback').textContent =
            'That action could not finish. Reload the app before trying again. Your progress has not been reset.';
    });

    // Show app
    AppController.show();

}

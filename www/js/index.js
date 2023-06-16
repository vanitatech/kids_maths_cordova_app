import Seeder from './database/seeder';

import lessonsData from '../data/lessons.json';
import lessonActivitiesData from '../data/lesson_activities.json';
import additionActivitiesData from '../data/activities_addition.json';
import subtractionActivitiesData from '../data/activities_subtraction.json';
import countingActivitiesData from '../data/activities_counting.json';
import mascotsData from '../data/mascots.json';

import LessonController from './controllers/lessonController';
import MascotController from './controllers/mascotController';

// Wait for the deviceready event before using any of Cordova's device APIs
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    initDB();

    // TODO: Initialise the local storage data (user progress and daily target)

    // TODO: Lessons
    // const lessonController = Object.create(LessonController);
    // lessonController.populateLessons();

    // Mascots
    const mascotController = Object.create(MascotController);
    mascotController.populateMascots();
}

function initDB() {
    // Initiliase database
    Seeder.seedTableIfEmpty('lessons', lessonsData);
    Seeder.seedTableIfEmpty('additionActivities', additionActivitiesData);
    Seeder.seedTableIfEmpty('subtractionActivities', subtractionActivitiesData);
    Seeder.seedTableIfEmpty('countingActivities', countingActivitiesData);
    Seeder.seedTableIfEmpty('lessonActivities', lessonActivitiesData);
    Seeder.seedTableIfEmpty('lessonWorksheet', lessonsData);
    Seeder.seedTableIfEmpty('mascots', mascotsData);
}

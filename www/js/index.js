import Seeder from './database/seeder.js';

import lessonsData from '../data/lessons.json' assert { type: "json" };
import lessonActivitiesData from '../data/lesson_activities.json' assert { type: "json" };
import additionActivitiesData from '../data/activities_addition.json' assert { type: "json" };
import subtractionActivitiesData from '../data/activities_subtraction.json' assert { type: "json" };
import countingActivitiesData from '../data/activities_counting.json' assert { type: "json" };
import mascotsData from '../data/mascots.json' assert { type: "json" };

import LessonController from './controllers/lessonController.js';
import MascotController from './controllers/mascotController.js';

// Wait for the deviceready event before using any of Cordova's device APIs
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

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

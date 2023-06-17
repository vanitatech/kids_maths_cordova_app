import Seeder from './database/seeder.js';

import lessonsData from '../data/lessons.json' assert { type: "json" };
import lessonActivitiesData from '../data/lesson_activities.json' assert { type: "json" };
import additionActivitiesData from '../data/activities_addition.json' assert { type: "json" };
import subtractionActivitiesData from '../data/activities_subtraction.json' assert { type: "json" };
import countingActivitiesData from '../data/activities_counting.json' assert { type: "json" };
import mascotsData from '../data/mascots.json' assert { type: "json" };

import UserProgressController from './controllers/userProgressController.js';
import LessonController from './controllers/lessonController.js';
import MascotController from './controllers/mascotController.js';

// Wait for the deviceready event before using any of Cordova's device APIs
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    initDB();

    // User Progress
    UserProgressController.showLessonsCompleted();
    UserProgressController.showPoints();

    // TODO: Lessons
    // LessonController.showLessons();

    // Mascots
    MascotController.showMascots();
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

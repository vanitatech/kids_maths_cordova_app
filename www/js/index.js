// Imports
import lessonsData from '../data/lessons.json';
import lessonActivitiesData from '../data/lesson_activities.json';
import additionActivitiesData from '../data/activities_addition.json';
import subtractionActivitiesData from '../data/activities_subtraction.json';
import countingActivitiesData from '../data/activities_counting.json';
import mascotsData from '../data/mascots.json';

// Wait for the deviceready event before using any of Cordova's device APIs
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    initIDB();
}

function initIDB() {
    // Declare indexedDB database
    var db = new Dexie("mathsappdb");

    // Declare tables 
    db.version(1).stores({
        lessons: "id",
        additionActivities: "id",
        subtractionActivities: "id",
        countingActivities: "id",
        lessonActivities: "id, lessonId",
        lessonWorksheet: "id, lessonId",
        mascots: "id",
    });

    // Function to insert data into a table only if empty
    function insertIfEmpty(tableName, data) {
        return db.table(tableName).count()
            .then(count => {
                if (count === 0) {
                    return db.table(tableName).bulkAdd(data);
                }
            });
    }

    // Insert data (if not already)
    insertIfEmpty("lessons", lessonsData);
    insertIfEmpty("lessonActivities", lessonActivitiesData);
    insertIfEmpty("additionActivities", additionActivitiesData);
    insertIfEmpty("subtractionActivities", subtractionActivitiesData);
    insertIfEmpty("countingActivities", countingActivitiesData);
    insertIfEmpty("mascots", mascotsData);
}

import Dexie from 'dexie';

const databaseName = "mathsappdb";
const databaseVersion = 1;

// Declare database
const db = new Dexie(databaseName);
db.version(databaseVersion).stores({
  lessons: "id",
  additionActivities: "id",
  subtractionActivities: "id",
  countingActivities: "id",
  lessonActivities: "id, lessonId",
  lessonWorksheet: "id, lessonId",
  mascots: "id",
});

export { db, databaseVersion };
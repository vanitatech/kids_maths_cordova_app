import Dexie from '../lib/dexie.mjs';

const databaseName = "mathsappdb";
const databaseVersion = 1;

// Declare database
const db = new Dexie(databaseName);
db.version(databaseVersion).stores({
  lessons: "id",
  additionActivities: "id",
  subtractionActivities: "id",
  countingActivities: "id",
  worksheetActivities: "id",
  lessonActivities: "id, lessonId",
  mascots: "id",
});

export default db;
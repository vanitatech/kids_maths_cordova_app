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
  lessonActivities: "id, lesson_id",
  // TODO: // lessonWorksheet: "id, lesson_id",
  mascots: "id",
});

export default db;
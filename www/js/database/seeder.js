import db from './database.js';
import activitiesAdditionData from '../../data/activities_addition.js';
import activitiesCountingData from '../../data/activities_counting.js';
import activitiesSubtractionData from '../../data/activities_subtraction.js';
import activitiesWorksheetData from '../../data/activities_worksheet.js';
import lessonActivitiesData from '../../data/lesson_activities.js';
import lessonsData from '../../data/lessons.js';
import mascotsData from '../../data/mascots.js';

const Seeder = {
  seedDatabase: async function () {
    try {
      // Seed database
      await seedTableIfEmpty('lessons', lessonsData);
      await seedTableIfEmpty('additionActivities', activitiesAdditionData);
      await seedTableIfEmpty('subtractionActivities', activitiesSubtractionData);
      await seedTableIfEmpty('countingActivities', activitiesCountingData);
      await seedTableIfEmpty('worksheetActivities', activitiesWorksheetData);
      await seedTableIfEmpty('lessonActivities', lessonActivitiesData);
      await seedTableIfEmpty('mascots', mascotsData);
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

async function seedTableIfEmpty(tableName, data) {
  const count = await db.table(tableName).count();
  if (count === 0) {
    try {
      db.table(tableName).bulkAdd(data);
    } catch (error) {
      console.error('Error inserting data:', error);
    };
  }
}

export default Seeder;
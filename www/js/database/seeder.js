import db from './database.js';
import { seedIfEmpty } from '../services/startup.js';
import activitiesAdditionData from '../../data/activities_addition.js';
import activitiesCountingData from '../../data/activities_counting.js';
import activitiesSubtractionData from '../../data/activities_subtraction.js';
import activitiesWorksheetData from '../../data/activities_worksheet.js';
import lessonActivitiesData from '../../data/lesson_activities.js';
import lessonsData from '../../data/lessons.js';
import mascotsData from '../../data/mascots.js';

const Seeder = {
  seedDatabase: async function () {
      // Seed database
      await seedTableIfEmpty('lessons', lessonsData);
      await seedTableIfEmpty('additionActivities', activitiesAdditionData);
      await seedTableIfEmpty('subtractionActivities', activitiesSubtractionData);
      await seedTableIfEmpty('countingActivities', activitiesCountingData);
      await seedTableIfEmpty('worksheetActivities', activitiesWorksheetData);
      await seedTableIfEmpty('lessonActivities', lessonActivitiesData);
      await seedTableIfEmpty('mascots', mascotsData);
  }
};

async function seedTableIfEmpty(tableName, data) {
  await seedIfEmpty(db.table(tableName), data);
}

export default Seeder;
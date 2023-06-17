import db from './database.js';

const Seeder = {
  seedDatabase: async function () {
    try {
      // Fetch JSON data
      const lessonsData = await fetchJSON('../data/lessons.json');
      const lessonActivitiesData = await fetchJSON('../data/lesson_activities.json');
      const additionActivitiesData = await fetchJSON('../data/activities_addition.json');
      const subtractionActivitiesData = await fetchJSON('../data/activities_subtraction.json');
      const countingActivitiesData = await fetchJSON('../data/activities_counting.json');
      const mascotsData = await fetchJSON('../data/mascots.json');

      // Seed database
      await seedTableIfEmpty('lessons', lessonsData);
      await seedTableIfEmpty('additionActivities', additionActivitiesData);
      await seedTableIfEmpty('subtractionActivities', subtractionActivitiesData);
      await seedTableIfEmpty('countingActivities', countingActivitiesData);
      await seedTableIfEmpty('lessonActivities', lessonActivitiesData);
      // TODO: // await seedTableIfEmpty('lessonWorksheet', );
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

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch JSON data: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export default Seeder;
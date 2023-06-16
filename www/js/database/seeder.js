import { db } from './database.js';

const Seeder = {
  seedTableIfEmpty: function (tableName, data) {
    db.table(tableName).count().then(function (count) {
      if (count === 0) {
        db.table(tableName).bulkAdd(data)
          .then(function () {
            console.log('Data inserted:', data);
          })
          .catch(function (error) {
            console.error('Error inserting data:', error);
          });
      }
    });
  }
};

export default Seeder;
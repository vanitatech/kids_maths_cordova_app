import db from '../database/database.js';

const CountingActivityModel = {
  get: function (id) {
    return db.countingActivities.where('id').equals(id).first();
  }
}

export default CountingActivityModel;
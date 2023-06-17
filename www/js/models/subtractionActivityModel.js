import db from '../database/database.js';

const SubtractionActivityModel = {
  get: function (id) {
    return db.subtractionActivities.where('id').equals(id).first();
  }
}

export default SubtractionActivityModel;
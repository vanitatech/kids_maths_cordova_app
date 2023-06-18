import db from '../database/database.js';

const WorksheetActivityModel = {
  get: function (id) {
    return db.worksheetActivities.where('id').equals(id).first();
  }
}

export default WorksheetActivityModel;
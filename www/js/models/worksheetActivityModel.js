import db from '../database/database.js';

const WorksheetActivityModel = {
  get: function (id) {
    return db.worksheetActivities.get(parseInt(id));
  }
}

export default WorksheetActivityModel;
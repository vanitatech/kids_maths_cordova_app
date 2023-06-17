import db from '../database/database.js';

const AdditionActivityModel = {
  get: function (id) {
    return db.additionActivities.where('id').equals(id).first();
  }
}

export default AdditionActivityModel;
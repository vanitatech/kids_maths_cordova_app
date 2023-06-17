import db from '../database/database.js';

const MascotModel = {
  get: function (id) {
    return db.mascots.where('id').equals(id).first();
  },
  getAll: function () {
    return db.mascots.toArray();
  }
}

export default MascotModel;
import db from '../database/database.js';

const MascotModel = {
  get: function (id) {
    return db.mascots.get(parseInt(id));
  },
  getAll: function () {
    return db.mascots.toArray();
  },
  update: function (mascot) {
    const updated = db.mascots.put(mascot);
    return updated;
  }
}

export default MascotModel;
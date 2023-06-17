import { db } from '../database/database.js';

const MascotModel = {
  getAll: function () {
    return db.mascots.toArray();
  }
}

export default MascotModel;
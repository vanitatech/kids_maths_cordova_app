import { db } from '../database/database.js';

const MascotModel = {
  getAll() {
    return db.mascots.toArray();
  }
}

export default MascotModel;
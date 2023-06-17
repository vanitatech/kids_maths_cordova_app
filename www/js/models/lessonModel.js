import { db } from '../database/database.js';

const LessonModel = {
  getAll: function () {
    return db.lessons.toArray();
  },
  get: function (id) {
    return db.lessons.where('id').equals(id).first();
  }
}

export default LessonModel;
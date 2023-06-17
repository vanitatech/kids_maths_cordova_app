import { db } from '../database/database.js';

const LessonModel = {
  getAll: function () {
    return db.lessons.toArray();
  }
}

export default LessonModel;
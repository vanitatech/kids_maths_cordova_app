import { db } from './database/database.js';

const LessonModel = {
  getAll() {
    return db.lessons.toArray();
  }
}

export default LessonModel;
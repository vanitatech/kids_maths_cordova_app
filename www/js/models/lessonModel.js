import db from '../database/database.js';

const LessonModel = {
  getTotal: function () {
    return db.lessons.count();
  },
  getAll: function () {
    return db.lessons.toArray();
  },
  get: function (id) {
    return db.lessons.get(parseInt(id));
  }
}

export default LessonModel;
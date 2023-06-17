import db from '../database/database.js';

const LessonActivityModel = {
  get: function (id) {
    return db.lessonActivities.where('id').equals(id).first();
  },
  getAll: function () {
    return db.lessonActivities.toArray();
  },
  getByLesson: function (lessonId) {
    return db.lessonActivities.where('lesson_id').equals(lessonId).toArray();
  }
}

export default LessonActivityModel;
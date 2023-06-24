import db from '../database/database.js';

const LessonActivityModel = {
  get: function (id) {
    return db.lessonActivities.get(parseInt(id));
  },
  getAll: function () {
    return db.lessonActivities.toArray();
  },
  getByLesson: function (lessonId) {
    return db.lessonActivities.where('lessonId').equals(lessonId).toArray();
  },
  update: function (lessonActivity) {
    const updated = db.lessonActivities.put(lessonActivity);
    return updated;
  }
}

export default LessonActivityModel;
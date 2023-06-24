import db from '../database/database.js';

const QuestionModel = {
  get: function (id) {
    return db.questions.get(parseInt(id));
  },
  getAll: function () {
    return db.questions.toArray();
  },
  getTotal: function () {
    return db.questions.count();
  },
  insertAll: function (questions) {
    const inserted = db.questions.bulkAdd(questions);
    return inserted;
  },
  update: function (question) {
    const updated = db.questions.put(question);
    return updated;
  },
  updateAll: function (questions) {
    const updated = db.questions.bulkPut(questions);
    return updated;
  },
  deleteAll: function () {
    const deleted = db.questions.clear();
    return deleted;
  }
}

export default QuestionModel;
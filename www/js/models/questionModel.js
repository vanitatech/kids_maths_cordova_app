import db from '../database/database.js';

const QuestionModel = {
  get: function (id) {
    return db.questions.where('id').equals(id).first();
  },
  getAll: function () {
    return db.questions.toArray();
  },
  insertAll: function (questions) {
    db.questions.bulkAdd(questions);
  },
  update: function (question) {
    db.questions.put(question);
  },
  updateAll: function (questions) {
    db.questions.bulkPut(questions);
  },
  deleteAll: function () {
    return db.questions.clear();
  }
}

export default QuestionModel;
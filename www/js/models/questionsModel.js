const QuestionsModel = {
  getQuestions: function () {
    return localStorage.getItem('questions') ? JSON.parse(localStorage.getItem('questions')) : [];
  },
  getCurrentQuestionIndex: function () {
    return localStorage.getItem('currentQuestionIndex') ?? 0;
  },
  setQuestions: function (questions) {
    localStorage.setItem('questions', JSON.stringify(questions));
  },
  setCurrentQuestionIndex: function (index) {
    localStorage.setItem('currentQuestionIndex', index);
  },
  removeQuestions: function () {
    localStorage.removeItem('questions');
  },
  removeCurrentQuestionIndex: function () {
    localStorage.removeItem('currentQuestionIndex');
  }
}

export default QuestionsModel;
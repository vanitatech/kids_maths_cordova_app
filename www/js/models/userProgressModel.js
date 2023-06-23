const UserProgressModel = {
  // Accessors
  getPointsAwarded: function () {
    return localStorage.getItem('userProgress.pointsAwarded') ?? 0;
  },
  getPointsRedeeded: function () {
    return localStorage.getItem('userProgress.pointsRedeemed') ?? 0;
  },
  getCurrentMascot: function () {
    return localStorage.getItem('userProgress.currentMascot') ?? 1;
  },
  getLessonsCompleted: function () {
    return localStorage.getItem('userProgress.lessonsCompleted') ?? 0;
  },
  getCurrentLessonId: function () {
    return parseInt(this.getLessonsCompleted()) + 1;
  },
  getNextLessonId: function () {
    return parseInt(this.getCurrentLessonId()) + 1;
  },
  getCurrentQuestionId: function () {
    return localStorage.getItem('userProgress.currentQuestionId') ?? 0;
  },
  getNextQuestionId: function () {
    return parseInt(this.getCurrentQuestionId()) + 1;
  },
  getCurrentQuestionAttempts: function () {
    return localStorage.getItem('userProgress.currentQuestionAttempts') ?? 0;
  },
  getCurrentActivityType: function () {
    return localStorage.getItem('userProgress.currentActivityType') ?? null;
  },
  // Mutators
  setPointsAwarded: function (points) {
    localStorage.setItem('userProgress.pointsAwarded', points);
  },
  setPointsRedeemed: function (points) {
    localStorage.setItem('userProgress.pointsRedeemed', points);
  },
  setCurrentMascot: function (mascotId) {
    localStorage.setItem('userProgress.currentMascot', mascotId);
  },
  setLessonsCompleted: function (count) {
    localStorage.setItem('userProgress.lessonsCompleted', count);
  },
  setCurrentQuestionId: function (id) {
    localStorage.setItem('userProgress.currentQuestionId', id);
  },
  setCurrentQuestionAttempts: function (count) {
    localStorage.setItem('userProgress.currentQuestionAttempts', count);
  },
  setCurrentActivityType: function (type) {
    localStorage.setItem('userProgress.currentActivityType', type);
  },
  incrementCurrentQuestionsAttempts: function () {
    let count = this.getCurrentQuestionsAttempts();
    count++;
    this.setCurrentQuestionAttempts(count);
  }
}

export default UserProgressModel;
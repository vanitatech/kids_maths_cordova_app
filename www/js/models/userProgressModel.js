const UserProgressModel = {
  // Accessors
  getPointsAwarded: function () {
    return parseInt(localStorage.getItem('userProgress.pointsAwarded') ?? 0);
  },
  getPointsRedeeded: function () {
    return parseInt(localStorage.getItem('userProgress.pointsRedeemed') ?? 0);
  },
  getPointsRemaining: function () {
    return parseInt(this.getPointsAwarded()) - parseInt(this.getPointsRedeeded());
  },
  getCurrentMascot: function () {
    return parseInt(localStorage.getItem('userProgress.currentMascot') ?? 1);
  },
  getLessonsCompleted: function () {
    return parseInt(localStorage.getItem('userProgress.lessonsCompleted') ?? 0);
  },
  getCurrentLessonId: function () {
    return parseInt(this.getLessonsCompleted()) + 1;
  },
  getNextLessonId: function () {
    return parseInt(this.getCurrentLessonId()) + 1;
  },
  getCurrentLessonActivityId: function () {
    return parseInt(localStorage.getItem('userProgress.currentActivityId') ?? 0);
  },
  getCurrentQuestionId: function () {
    return parseInt(localStorage.getItem('userProgress.currentQuestionId') ?? 0);
  },
  getNextQuestionId: function () {
    return parseInt(this.getCurrentQuestionId()) + 1;
  },
  getCurrentQuestionAttempts: function () {
    return parseInt(localStorage.getItem('userProgress.currentQuestionAttempts') ?? 0);
  },
  getCurrentActivityType: function () {
    return localStorage.getItem('userProgress.currentActivityType') ?? null;
  },
  getCurrentObjectImage: function () {
    return localStorage.getItem('userProgress.currentObjectImage') ?? null;
  },
  // Mutators
  setPointsAwarded: function (points) {
    localStorage.setItem('userProgress.pointsAwarded', points);
  },
  incrementPointsAwarded: function (newPoints) {
    const currentPoints = parseInt(this.getPointsAwarded());
    const updatedPoints = currentPoints + parseInt(newPoints);
    this.setPointsAwarded(updatedPoints);
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
  setCurrentLessonActivityId: function (id) {
    localStorage.setItem('userProgress.currentActivityId', id);
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
  incrementCurrentQuestionAttempts: function () {
    let count = this.getCurrentQuestionAttempts();
    count++;
    this.setCurrentQuestionAttempts(count);
  },
  setCurrentObjectImage: function (image) {
    localStorage.setItem('userProgress.currentObjectImage', image);
  }
}

export default UserProgressModel;
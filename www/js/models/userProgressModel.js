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
  }
}

export default UserProgressModel;
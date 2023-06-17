const DailyTargetModel = {
  // Accessors
  getNumberOfLessons: function () {
    localStorage.getItem('dailyTarget.numberOfLessons') ?? 0;
  },
  getPointsToAward: function () {
    localStorage.getItem('dailyTarget.pointsToAward') ?? 0;
  },
  isTargetMet: function () {
    localStorage.getItem('dailyTarget.targetMet') ?? false;
  },
  isPointsAwarded: function () {
    localStorage.getItem('dailyTarget.pointsAwarded') ?? false;
  },
  isNotificationSent: function () {
    localStorage.getItem('dailyTarget.notificationSent') ?? false;
  },
  // Mutators
  setNumberOfLessons: function (number) {
    localStorage.setItem('dailyTarget.numberOfLessons', number);
  },
  setPointsToAward: function (points) {
    localStorage.setItem('dailyTarget.pointsToAward', points);
  },
  setTargetMet: function (met) {
    localStorage.setItem('dailyTarget.targetMet', met);
  },
  setPointsAwarded: function (awarded) {
    localStorage.setItem('dailyTarget.pointsAwarded', awarded);
  },
  setNotificationSent: function (sent) {
    localStorage.setItem('dailyTarget.notificationSent', sent);
  },
}

export default DailyTargetModel;
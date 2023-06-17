import UserProgressModel from "../models/userProgressModel.js";
import UserProgressView from "../views/userProgressView.js";
import LessonModel from "../models/lessonModel.js";

const UserProgressController = {
  showLessonsCompleted: function () {
    const completedLessons = UserProgressModel.getLessonsCompleted();
    LessonModel.getAll().then(lessons => {
      const totalLessons = lessons.length;
      UserProgressView.renderProgressBar(completedLessons, totalLessons);
    });
  },
  showPoints: function () {
    const pointsAwarded = UserProgressModel.getPointsAwarded();
    const pointsRedeemed = UserProgressModel.getPointsRedeeded();
    const pointsRemaining = pointsAwarded - pointsRedeemed;
    UserProgressView.renderProgressStars(pointsRemaining);
  }
}

export default UserProgressController;
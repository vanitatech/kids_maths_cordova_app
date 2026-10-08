import UserProgressModel from "../models/userProgressModel.js";
import UserProgressView from "../views/userProgressView.js";
import LessonModel from "../models/lessonModel.js";

const UserProgressController = {
  showLessonsCompleted: async function () {
      const completedLessons = UserProgressModel.getLessonsCompleted();
      const totalLessons = await LessonModel.getTotal();
      UserProgressView.renderProgressBar(completedLessons, totalLessons);
  },
  showPoints: function () {
    const pointsAwarded = UserProgressModel.getPointsAwarded();
    const pointsRedeemed = UserProgressModel.getPointsRedeemed();
    const pointsRemaining = pointsAwarded - pointsRedeemed;
    UserProgressView.renderProgressStars(pointsRemaining);
  }
}

export default UserProgressController;
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
  }
}

export default UserProgressController;
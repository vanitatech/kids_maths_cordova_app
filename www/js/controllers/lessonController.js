import LessonModel from "../models/lessonModel.js";
import LessonView from "../views/lessonView.js";
import UserProgressModel from "../models/userProgressModel.js";

const LessonController = {
  showCurrentLesson: function () {
    const completedLessons = UserProgressModel.getLessonsCompleted();
    const currentLessonId = parseInt(completedLessons) + 1;

    LessonModel.get(currentLessonId).then(lessons => {
      LessonView.renderList(lessons);
    });
  }
}

export default LessonController;
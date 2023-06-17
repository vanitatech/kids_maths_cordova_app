import LessonModel from "../models/lessonModel.js";
import LessonView from "../views/lessonView.js";
import UserProgressModel from "../models/userProgressModel.js";

const LessonController = {
  showCurrentLesson: async function () {
    try {
      const completedLessons = UserProgressModel.getLessonsCompleted();
      const currentLessonId = parseInt(completedLessons) + 1;
      const currentLesson = await LessonModel.get(currentLessonId);
      LessonView.renderCurrentLessonNumber(currentLesson.id);

      const nextLessonId = parseInt(currentLesson.id) + 1;
      const totalLessons = await LessonModel.getTotal();

      if (nextLessonId <= totalLessons) {
        const nextLesson = await LessonModel.get(nextLessonId);
        LessonView.renderNextLessonButton(nextLesson.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export default LessonController;
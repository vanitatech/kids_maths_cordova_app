import LessonModel from "../models/lessonModel.js";
import LessonView from "../views/lessonView.js";
import UserProgressModel from "../models/userProgressModel.js";

const LessonController = {
  showCurrent: async function () {
    try {
      const currentLessonId = UserProgressModel.getCurrentLessonId();
      const currentLesson = await LessonModel.get(currentLessonId);

      // Curreny lesson number
      LessonView.renderCurrentLessonNumber(currentLesson.id);

      // Next lesson button
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
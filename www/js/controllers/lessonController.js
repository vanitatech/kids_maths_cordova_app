import LessonModel from "../models/lessonModel.js";
import LessonView from "../views/lessonView.js";
import UserProgressModel from "../models/userProgressModel.js";
import AppController from "./appController.js";

const LessonController = {
  showCurrent: async function () {
    try {
      const currentLessonId = UserProgressModel.getCurrentLessonId();
      const currentLesson = await LessonModel.get(currentLessonId);

      // Curreny lesson number
      LessonView.renderCurrentLessonNumber(currentLesson.id);

      // Next lesson button
      const nextLessonId = UserProgressModel.getNextLessonId();
      const totalLessons = await LessonModel.getTotal();
      if (nextLessonId <= totalLessons) {
        const nextLesson = await LessonModel.get(nextLessonId);
        LessonView.renderNextLessonButton(nextLesson.id);
      }

      AppController.showView('lesson');
    } catch (error) {
      console.error('Error:', error);
    }
  },
  showNext: async function () {
    try {
      // TODO
      const nextLessonId = UserProgressModel.getNextLessonId();

    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export default LessonController;
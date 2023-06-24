import LessonModel from "../models/lessonModel.js";
import LessonView from "../views/lessonView.js";
import UserProgressModel from "../models/userProgressModel.js";
import AppController from "./appController.js";
import LessonActivityController from "./lessonActivityController.js";

const LessonController = {
  show: async function (id) {
    console.log('id', id);
    const lesson = await LessonModel.get(id);
    console.log('lesson', lesson);

    // Curreny lesson number
    LessonView.renderCurrentLessonNumber(lesson.id);

    // Show lesson activities
    await LessonActivityController.showAllCurrent();

    // Check if all activities completed, enable next-lesson button
    const activitiesCompleted = await LessonActivityController.checkAllCompleted(lesson.id);

    // Next lesson button
    const nextLessonId = UserProgressModel.getNextLessonId();
    const totalLessons = await LessonModel.getTotal();
    if (nextLessonId <= totalLessons) {
      const nextLesson = await LessonModel.get(nextLessonId);
      LessonView.renderNextLessonButton(nextLesson.id, activitiesCompleted);
    }

    AppController.showView('lesson');
  },
  showCurrent: async function () {
    const currentLessonId = UserProgressModel.getCurrentLessonId();
    this.show(currentLessonId);
  },
  showNext: async function () {
    const nextLessonId = UserProgressModel.getNextLessonId();
    UserProgressModel.setCurrentLessonId(nextLessonId);
    this.show(nextLessonId);
  }
}

export default LessonController;
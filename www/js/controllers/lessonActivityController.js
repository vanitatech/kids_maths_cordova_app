import LessonActivityModel from "../models/lessonActivityModel.js";
import LessonActivityView from "../views/lessonActivityView.js";
import UserProgressModel from "../models/userProgressModel.js";

const LessonActivityController = {
  showAllCurrent: async function () {
    try {
      const currentLessonId = UserProgressModel.getCurrentLessonId();
      const activities = await LessonActivityModel.getByLesson(currentLessonId);
      LessonActivityView.renderList(activities);
    } catch (error) {
      console.error('Error:', error);
    }
  },
  show: async function (id) {
    const lessonActivity = await LessonActivityModel.get(id);

    // Populate activity view

    // Show activity view

  }
}

export default LessonActivityController;
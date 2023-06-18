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
  }
}

export default LessonActivityController;
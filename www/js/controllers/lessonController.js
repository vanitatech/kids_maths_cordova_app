import LessonModel from "../models/lessonModel.js";
import LessonView from "../views/lessonView.js";

const LessonController = {
  showLessons: function () {
    LessonModel.getAll().then(lessons => {
      LessonView.renderList(lessons);
    });
  }
}

export default LessonController;
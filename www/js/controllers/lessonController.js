import LessonModel from "../models/lessonModel.js";
import LessonView from "../views/lessonView.js";

const LessonController = {
  populateLessons: function () {
    LessonModel.getAll().then(lessons => {
      LessonView.display(lessons);
    });
  }
}

export default LessonController;
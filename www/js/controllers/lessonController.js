import LessonModel from "../models/lessonModel";
import LessonView from "../views/lessonView";

const LessonController = {
  populateLessons: function () {
    LessonModel.getAll().then(lessons => {
      LessonView.display(lessons);
    });
  }
}

export default LessonController;
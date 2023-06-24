import UserProgressModel from "../models/userProgressModel.js";
import LessonActivityView from "./lessonActivityView.js";

const CountingActivityView = {
  render: function (question, changeImg) {
    let objectImg;
    if (changeImg) {
      objectImg = LessonActivityView.getObjectImg();
      UserProgressModel.setCurrentObjectImage(objectImg);
    } else {
      objectImg = UserProgressModel.getCurrentObjectImage();
    }
    const totalImg = LessonActivityView.getImagesHtml(question.total, objectImg);
    const optionsHtml = LessonActivityView.getOptionsHtml(question.options);

    const activityHtml = `
      <table id="activity-table">
        <tr class="total">
          <td class="total-number activity-number">
            <div class="card-slot active" data-number="${question.total}">
              <span class="placeholder">?</span>
            </div>
          </td>
          <td class="total-img activity-img">${totalImg}</td>
        </tr>
      </table>
      <ul class="options">${optionsHtml}</ul>
      `;

    document.getElementById('activity-content').innerHTML = activityHtml;
  }
}

export default CountingActivityView;
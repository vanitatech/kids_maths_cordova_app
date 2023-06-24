import UserProgressModel from "../models/userProgressModel.js";
import LessonActivityView from "./lessonActivityView.js";

const SubtractionActivityView = {
  render: function (question, changeImg) {
    let objectImg;
    if (changeImg) {
      objectImg = LessonActivityView.getObjectImg();
      UserProgressModel.setCurrentObjectImage(objectImg);
    } else {
      objectImg = UserProgressModel.getCurrentObjectImage();
    }
    const minuendImg = LessonActivityView.getImagesHtml(question.minuend, objectImg);
    const subtrahendImg = LessonActivityView.getImagesHtml(question.subtrahend, objectImg);
    const totalImg = LessonActivityView.getImagesHtml(question.total, objectImg);
    const optionsHtml = LessonActivityView.getOptionsHtml(question.options);

    const activityHtml = `
      <table id="activity-table">
        <tr class="minuend">
          <td></td>
          <td class="minuend-number activity-number">
            <div class="card-slot active" data-number="${question.minuend}">
              <span class="placeholder">?</span>
            </div>
          </td>
          <td class="minuend-img activity-img">${minuendImg}</td>
        </tr>
        <tr class="subtrahend">
          <td class="activity-operator"><img src="img/minus.svg"></td>
          <td class="subtrahend-number activity-number">
            <div class="card-slot" data-number="${question.subtrahend}"></div>
          </td>
          <td class="subtrahend-img activity-img">${subtrahendImg}</td>
        </tr>
        <tr>
          <td></td>
          <td colspan="2">
            <div class="activity-equals"></div>
            <div class="activity-equals"></div>
          </td>
        </tr>
        <tr class="total">
          <td></td>
          <td class="total-number activity-number">
            <div class="card-slot" data-number="${question.total}"></div>
          </td>
          <td class="total-img activity-img">${totalImg}</td>
        </tr>
      </table>
      <ul class="options">${optionsHtml}</ul>
      `;

    document.getElementById('activity-content').innerHTML = activityHtml;
  }
}

export default SubtractionActivityView;
import LessonActivityView from "./lessonActivityView.js";

const AdditionActivityView = {
  render: function (question) {
    const objectImg = LessonActivityView.getObjectImg();
    const augendImg = LessonActivityView.getImagesHtml(question.augend, objectImg);
    const addendImg = LessonActivityView.getImagesHtml(question.addend, objectImg);
    const totalImg = LessonActivityView.getImagesHtml(question.total, objectImg);
    const optionsHtml = LessonActivityView.getOptionsHtml(question.options);

    const activityHtml = `
      <table id="activity-table">
        <tr class="augend">
          <td></td>
          <td class="augend-number activity-number">
            <div class="card-holder" data-number="${question.augend}"></div>
          </td>
          <td class="augend-img activity-img">${augendImg}</td>
        </tr>
        <tr class="addend">
          <td class="activity-operator"><img src="img/plus.svg"></td>
          <td class="addend-number activity-number">
            <div class="card-holder" data-number="${question.addend}"></div>
          </td>
          <td class="addend-img activity-img">${addendImg}</td>
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
            <div class="card-holder" data-number="${question.total}"></div>
          </td>
          <td class="total-img activity-img">${totalImg}</td>
        </tr>
      </table>
      <ul class="options">${optionsHtml}</ul>
      `;

    document.getElementById('activity-content').innerHTML = activityHtml;
  }
}

export default AdditionActivityView;
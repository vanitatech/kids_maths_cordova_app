import LessonActivityView from "./lessonActivityView.js";

const AdditionActivityView = {
  render: function (augend, addend, total, options) {
    const objectImg = LessonActivityView.getObjectImg();
    const augendImg = LessonActivityView.getImagesHtml(augend, objectImg);
    const addendImg = LessonActivityView.getImagesHtml(addend, objectImg);
    const totalImg = LessonActivityView.getImagesHtml(total, objectImg);
    const optionsHtml = LessonActivityView.getOptionsHtml(options);

    const activityHtml = `
      <table id="activity-table">
        <tr class="augend">
          <td></td>
          <td class="augend-number activity-number">
            <div class="card-holder" data-number="${augend}"></div>
          </td>
          <td class="augend-img activity-img">${augendImg}</td>
        </tr>
        <tr class="addend">
          <td class="activity-operator"><img src="img/plus.svg"></td>
          <td class="addend-number activity-number">
            <div class="card-holder" data-number="${addend}"></div>
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
            <div class="card-holder" data-number="${total}"></div>
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
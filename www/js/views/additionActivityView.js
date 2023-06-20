const AdditionActivityView = {
  render: function (augend, addend, total, options) {
    const objectImg = this.getObjectImg();
    const augendImg = this.getImagesHtml(augend, objectImg);
    const addendImg = this.getImagesHtml(addend, objectImg);
    const totalImg = this.getImagesHtml(total, objectImg);
    const optionsHtml = this.getOptionsHtml(options);

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
  },
  getObjectImg: function () {
    const images = [
      'aeroplace.svg',
      'ambulance.svg',
      'balloon.svg',
      'banana.svg',
      'basketball.svg',
      'bike.svg',
      'candy.svg',
      'car.svg',
      'cookie.svg',
      'crown.svg',
      'crown2.svg',
      'cupcake.svg',
      'diamond.svg',
      'flower.svg',
      'gem.svg',
      'hamburger.svg',
      'helicopter.svg',
      'pineapple.svg',
      'rocket.svg',
      'sailboat.svg',
      'school-bus.svg',
      'strawberry.svg',
      'tomato.svg'
    ];

    const random = Math.floor(Math.random() * images.length);
    return images[random];
  },
  getImagesHtml: function (number, img) {
    let html = '';
    for (let x = 0; x < number; x++) {
      html += `<img src="img/objects/${img}">`;
    }
    return '<div>' + html + '</div>';
  },
  getOptionsHtml: function (options) {
    let html = '';
    options.forEach(function (number) {
      html += `<li><div class="card" data-number="${number}">${number}</div></li>`;
    });
    return html;
  }
}

export default AdditionActivityView;
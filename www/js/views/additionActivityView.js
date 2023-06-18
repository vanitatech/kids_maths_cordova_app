const AdditionActivityView = {
  render: function (augend, addend, total, options) {
    const objectImg = this.getObjectImg();
    const augendImg = this.getImagesHtml(augend, objectImg);
    const addendImg = this.getImagesHtml(addend, objectImg);
    const totalImg = this.getImagesHtml(total, objectImg);
    const optionsHtml = this.getOptionsHtml(options);

    const activityHtml = `
      <table>
        <tr class="augend">
          <td></td>
          <td class="augend-number" data-number="${augend}"></td>
          <td class="augend-img">${augendImg}</td>
        </tr>
        <tr class="addend">
          <td><img src="img/minus.svg"></td>
          <td class="addend-number" data-number="${addend}"></td>
          <td class="addend-img">${addendImg}</td>
        </tr>
        <tr class="total">
          <td></td>
          <td class="total-number" data-number="${total}"></td>
          <td class="total-img">${totalImg}</td>
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
    return html;
  },
  getOptionsHtml: function (options) {
    let html = '';
    options.forEach(function (number) {
      html += `<li>${number}</li>`;
    });
    return html;
  }
}

export default AdditionActivityView;
const MascotView = {
  renderList: function (mascots, currentMascotId) {
    const mascotList = document.getElementById('mascots-list');
    mascotList.innerHTML = '';

    mascots.forEach(function (mascot) {
      const mascotItem = document.createElement('div');
      let mascotItemHtml = `<img class="mascot-item-img" src="img/mascots/${mascot.img}">`;

      if (!mascot.unlocked) {
        mascotItem.setAttribute('data-locked', '');
        mascotItemHtml += `
        <div class="mascot-cost">
          <img src="img/star-yellow.svg">
          <span>${mascot.cost}</span>
        </div>`;
      }

      if (mascot.id == currentMascotId) {
        mascotItem.setAttribute('data-active', '');
      }

      mascotItem.setAttribute('class', 'mascot-item');
      mascotItem.setAttribute('onclick', `MascotController.unlock(${mascot.id})`);

      mascotItem.innerHTML = mascotItemHtml;
      mascotList.appendChild(mascotItem);
    });
  },
  renderMascot: function (mascot) {
    const mascotImgContainers = document.querySelectorAll('.mascot-img-container');
    mascotImgContainers.forEach(function (container) {
      container.innerHTML = `<img src="img/mascots/${mascot.img}">`;
    });
  }
}

export default MascotView;
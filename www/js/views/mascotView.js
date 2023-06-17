const MascotView = {
  // TODO
  renderList: function (mascots) {
    let mascotList = document.getElementById('mascots-list');
    mascotList.innerHTML = '';

    mascots.forEach(function (mascot) {
      var listItem = document.createElement('li');
      listItem.textContent = mascot.name;
      mascotList.appendChild(listItem);
    });
  },
  renderMascot: function (mascot) {
    let mascotImgContainers = document.querySelectorAll('.mascot-img-container');
    mascotImgContainers.forEach(function (container) {
      container.innerHTML = `<img src="img/mascots/${mascot.img}">`;
    });
  }
}

export default MascotView;
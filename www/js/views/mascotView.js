const MascotView = {
  // TODO
  renderList: function (mascots) {
    let mascotList = document.getElementById('mascot-list');
    mascotList.innerHTML = '';

    mascots.forEach(function (mascot) {
      var listItem = document.createElement('li');
      listItem.textContent = mascot.name;
      mascotList.appendChild(listItem);
    });
  }
}

export default MascotView;
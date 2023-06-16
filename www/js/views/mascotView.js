const MascotView = {
  // TODO
  display: function (mascots) {
    let mascotList = document.getElementById('mascot-list');
    console.log(mascotList);
    mascotList.innerHTML = '';

    mascots.forEach(function (mascot) {
      var listItem = document.createElement('li');
      listItem.textContent = mascot.name;
      mascotList.appendChild(listItem);
    });
  }
}

export default MascotView;
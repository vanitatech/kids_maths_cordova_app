const AppView = {
  showLoader: function () {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('app').style.display = 'none';
  },
  removeLoader: function () {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  },
  showView: function (targetView) {
    this.showLoader();

    document.querySelectorAll('.app-view').forEach(function (appViewElement) {
      const view = appViewElement.getAttribute('data-view');
      if (view == targetView) {
        appViewElement.setAttribute('data-active', '');
      } else {
        appViewElement.removeAttribute('data-active');
      }
    });

    this.removeLoader();
  },
  activateViewButton: function (targetView) {
    document.querySelectorAll('.show-view-button').forEach(function (buttonElement) {
      const buttonView = buttonElement.getAttribute('data-target-view');
      if (buttonView == targetView) {
        buttonElement.classList.add('active');
      } else {
        buttonElement.classList.remove('active');
      }
    });
  },
  disableViewButtons: function () {
    document.querySelectorAll('.show-view-button').forEach(function (buttonElement) {
      buttonElement.classList.remove('active');
    });
  }
}

export default AppView;
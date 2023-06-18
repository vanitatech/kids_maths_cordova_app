const AppView = {
  removeLoader: function () {
    document.getElementById('loading').remove();
    document.getElementById('app').style.display = 'block';
  },
  showView: function (button) {
    const targetView = button.getAttribute('data-target-view');

    document.querySelectorAll('.app-view').forEach(function (appViewElement) {
      const view = appViewElement.getAttribute('data-view');
      if (view == targetView) {
        appViewElement.setAttribute('data-active', '');
      } else {
        appViewElement.removeAttribute('data-active');
      }
    });

    document.querySelectorAll('.show-view-button').forEach(function (buttonElement) {
      const buttonView = buttonElement.getAttribute('data-target-view');
      if (buttonView == targetView) {
        buttonElement.classList.add('active');
      } else {
        buttonElement.classList.remove('active');
      }
    });
  }
}

export default AppView;
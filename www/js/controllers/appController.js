import AppView from "../views/appView.js";

const AppController = {
  show: function () {
    AppView.removeLoader();
  },
  showView: function (button) {
    const view = button.getAttribute('data-target-view');
    AppView.showView(view);
    AppView.activateViewButton(view)
  }
}

export default AppController;
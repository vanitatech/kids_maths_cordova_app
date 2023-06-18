import AppView from "../views/appView.js";

const AppController = {
  show: function () {
    AppView.removeLoader();
  },
  showView: function (button) {
    AppView.showView(button);
  }
}

export default AppController;
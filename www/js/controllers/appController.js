import AppView from "../views/appView.js";

const AppController = {
  show: function () {
    AppView.removeLoader();
  },
  showView: function (view) {
    AppView.showView(view);
    AppView.activateViewButton(view);
  },
}

export default AppController;
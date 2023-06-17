import MascotModel from "../models/mascotModel.js";
import MascotView from "../views/mascotView.js";

const MascotController = {
  showMascots: function () {
    MascotModel.getAll().then(mascots => {
      MascotView.renderList(mascots);
    });
  }
}

export default MascotController;
import MascotModel from "../models/mascotModel.js";
import MascotView from "../views/mascotView.js";

const MascotController = {
  populateMascots: function () {
    MascotModel.getAll().then(mascots => {
      MascotView.display(mascots);
    });
  }
}

export default MascotController;
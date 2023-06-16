import MascotModel from "../models/mascotModel";
import MascotView from "../views/mascotView";

const MascotController = {
  populateMascots: function () {
    MascotModel.getAll().then(mascots => {
      MascotView.display(mascots);
    });
  }
}

export default MascotController;
import MascotModel from "../models/mascotModel.js";
import MascotView from "../views/mascotView.js";

const MascotController = {
  showMascots: async function () {
    try {
      const mascots = await MascotModel.getAll();
      MascotView.renderList(mascots);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export default MascotController;
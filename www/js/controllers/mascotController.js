import MascotModel from "../models/mascotModel.js";
import MascotView from "../views/mascotView.js";
import UserProgressModel from "../models/userProgressModel.js";

const MascotController = {
  showMascots: async function () {
    try {
      const mascots = await MascotModel.getAll();
      MascotView.renderList(mascots);
    } catch (error) {
      console.error('Error:', error);
    }
  },
  showMascot: async function () {
    try {
      const currentMascotId = UserProgressModel.getCurrentMascot();
      const mascot = await MascotModel.get(currentMascotId);
      MascotView.renderMascot(mascot);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

export default MascotController;
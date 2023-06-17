import MascotModel from "../models/mascotModel.js";
import MascotView from "../views/mascotView.js";
import UserProgressModel from "../models/userProgressModel.js";

const MascotController = {
  showAll: async function () {
    try {
      const currentMascotId = UserProgressModel.getCurrentMascot();
      const mascots = await MascotModel.getAll();
      MascotView.renderList(mascots, currentMascotId);
    } catch (error) {
      console.error('Error:', error);
    }
  },
  showCurrent: async function () {
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
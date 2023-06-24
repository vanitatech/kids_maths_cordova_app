import MascotModel from "../models/mascotModel.js";
import MascotView from "../views/mascotView.js";
import UserProgressModel from "../models/userProgressModel.js";
import UserProgressView from "../views/userProgressView.js";

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
  },
  unlock: async function (id) {
    let viewChanged = false;
    const mascot = await MascotModel.get(id);
    const remainingPoints = UserProgressModel.getPointsRemaining();

    if (mascot.unlocked) {
      const currentMascot = UserProgressModel.getCurrentMascot();

      if (currentMascot != mascot.id) {
        UserProgressModel.setCurrentMascot(mascot.id);
        viewChanged = true;
      }
    } else {
      // If user can afford mascot
      if (remainingPoints >= parseInt(mascot.cost)) {

        // Unlock mascot
        mascot.unlocked = true;
        await MascotModel.update(mascot);

        // Redeem user points
        UserProgressModel.incrementPointsRedeemed(mascot.cost);
        UserProgressView.renderProgressStars();
        viewChanged = true;
      }
    }

    if (viewChanged) {
      this.showAll();
      this.showCurrent();
    }
  }
}

export default MascotController;
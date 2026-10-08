import MascotModel from "../models/mascotModel.js";
import MascotView from "../views/mascotView.js";
import UserProgressModel from "../models/userProgressModel.js";
import UserProgressView from "../views/userProgressView.js";
import UserProgressController from "./userProgressController.js";
import AppView from "../views/appView.js";

const MascotController = {
  showAll: async function () {
      const currentMascotId = UserProgressModel.getCurrentMascot();
      const mascots = await MascotModel.getAll();
      MascotView.renderList(mascots, currentMascotId);
  },
  showCurrent: async function () {
      const currentMascotId = UserProgressModel.getCurrentMascot();
      const mascot = await MascotModel.get(currentMascotId);
      MascotView.renderMascot(mascot);
  },
  unlock: async function (id) {
    let viewChanged = false;
    const mascot = await MascotModel.get(id);
    const remainingPoints = UserProgressModel.getPointsRemaining();

    if (!mascot.unlocked) {
      // If user can afford mascot
      const cost = parseInt(mascot.cost);
      if (remainingPoints >= cost) {

        // Unlock mascot
        mascot.unlocked = true;
        await MascotModel.update(mascot);

        // Redeem user points
        UserProgressModel.incrementPointsRedeemed(cost);
        UserProgressController.showPoints();
        viewChanged = true;
      }
    }

    if (mascot.unlocked) {
      const currentMascot = UserProgressModel.getCurrentMascot();

      if (currentMascot != mascot.id) {
        UserProgressModel.setCurrentMascot(mascot.id);
        viewChanged = true;
      }
    }

    if (viewChanged) {
      AppView.showLoader();
      await this.showAll();
      await this.showCurrent();
      AppView.removeLoader();
    }
  }
}

export default MascotController;
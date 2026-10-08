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
      } else {
        document.getElementById('app-feedback').textContent =
          `You need ${cost} stars to unlock ${mascot.name}. You have ${remainingPoints}.`;
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
      document.getElementById('app-feedback').textContent = `${mascot.name} is your selected friend.`;
      document.querySelector('.mascot-item[aria-pressed="true"]')?.focus();
    }
  }
}

export default MascotController;
import AppView from "../views/appView.js";
import AdditionActivityModel from "../models/additionActivityModel.js";
import AdditionActivityView from "../views/additionActivityView.js";

const AdditionActivityController = {
  show: async function (id) {
    const activity = await AdditionActivityModel.get(id); // {id: 1, augendMin: 1, augendMax: 9, addend: 1}


    AppView.showView('activity');
  }
}

export default AdditionActivityController;
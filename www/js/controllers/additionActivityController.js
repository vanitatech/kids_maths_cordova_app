import AppView from "../views/appView.js";
import AdditionActivityModel from "../models/additionActivityModel.js";
import AdditionActivityView from "../views/additionActivityView.js";
import LessonActivityView from "../views/lessonActivityView.js";

const AdditionActivityController = {
  show: async function (id) {
    const activity = await AdditionActivityModel.get(id); // {id: 1, augendMin: 1, augendMax: 9, addend: 1}

    LessonActivityView.renderMascotSpeech('Addition', 'plus-circle.svg');

    const augend = this.getAugend(activity.augendMin, activity.augendMax);
    const total = augend + parseInt(activity.addend);
    const options = this.getOptions(activity.augendMin, augend, activity.addend, total);
    AdditionActivityView.render(augend, activity.addend, total, options);

    // Score (stars)
    LessonActivityView.renderScore([]);

    AppView.showView('activity');
  },
  getAugend: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  getOptions: function (min, augend, addend, total) {
    // Generate three random numbers
    const randomNumbers = [];
    for (let i = min; i < total; i++) {
      const randomNumber = Math.floor(Math.random() * (total - min + 1)) + min;
      randomNumbers.push(randomNumber);
    }

    // Combine the random numbers with augend, addend, and total
    let numberArray = [augend, addend, total, ...randomNumbers];

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    return shuffleArray(numberArray);
  }
}

export default AdditionActivityController;
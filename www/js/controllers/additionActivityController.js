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
  getOptions: function (minimum, augend, addend, total) {
    let numberArray = [augend, addend, total];

    // Generate unique random numbers
    while (numberArray.length < 5) {
      let randomNumber = Math.floor(Math.random() * (total - minimum + 1)) + minimum;
      if (!numberArray.includes(randomNumber)) {
        numberArray.push(randomNumber);
      }
    }

    // Shuffle the array randomly
    for (let i = numberArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numberArray[i], numberArray[j]] = [numberArray[j], numberArray[i]];
    }

    return numberArray;
  }
}

export default AdditionActivityController;
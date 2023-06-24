import AdditionActivityModel from "../models/additionActivityModel.js";
import Helpers from "../services/helpers.js";

const AdditionActivityController = {
  createQuestions: async function (id) {
    const activity = await AdditionActivityModel.get(id); // {id, augendMin, augendMax, addend}
    let questions = [];

    for (let x = 0; x < 5; x++) {
      let augend = this.getAugend(activity.augendMin, activity.augendMax, questions);
      let total = augend + parseInt(activity.addend);

      questions.push({
        "id": x,
        "augend": augend,
        "addend": activity.addend,
        "total": total,
        "options": this.getOptions(activity.augendMin, augend, activity.addend, total),
        "completed": false
      });
    }

    return questions;
  },
  getAugend: function (min, max, questions) {
    min = parseInt(min);
    max = parseInt(max);

    const augend = Math.floor(Math.random() * (max - min + 1) + min);

    // Check augend is not already used in another question
    let augendUnique = true;
    questions.forEach(function (question) {
      if (question.augend == augend) {
        augendUnique = false;
      }
    });

    // Only return augend if unique
    if (augendUnique) {
      return augend;
    } else {
      return this.getAugend(min, max, questions);
    }
  },
  getOptions: function (minimum, augend, addend, total) {
    // Create array of numbers
    let numbers = Helpers.arrayRange(minimum, parseInt(total) + 1);
    let options = [augend, addend, total];

    // Filter to remove augend, addend, and total
    numbers = numbers.filter(val => !options.includes(val));

    // Add two of the numbers to the options
    options = Helpers.combineArrays(options, numbers, 2);

    // Shuffle numbers
    Helpers.shuffleArray(options);

    return options;
  }
}

export default AdditionActivityController;
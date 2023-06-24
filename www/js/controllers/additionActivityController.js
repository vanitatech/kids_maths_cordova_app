import AdditionActivityModel from "../models/additionActivityModel.js";
import Helpers from "../services/helpers.js";

const AdditionActivityController = {
  createQuestions: async function (id) {
    const activity = await AdditionActivityModel.get(id); // {id, augendMin, augendMax, addend}
    let questions = [];

    for (let x = 0; x < 5; x++) {
      let augend = this.getAugend(activity.augendMin, activity.augendMax);
      let total = augend + parseInt(activity.addend);

      questions.push({
        "id": x,
        "augend": augend,
        "addend": activity.addend,
        "total": total,
        "options": this.getOptions(activity.augendMin, augend, activity.addend, total),
        "completed": false,
        // "correct": null
      });
    }

    return questions;
  },
  getAugend: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  getOptions: function (minimum, augend, addend, total) {
    // Create array of numbers
    let numbers = this.arrayRange(minimum, parseInt(total) + 1);
    let options = [augend, addend, total];

    // Filter to remove augend, addend, and total
    numbers = numbers.filter(val => !options.includes(val));

    // Add two of the numbers to the options
    options = Helpers.combineArrays(options, numbers, 2);

    // Shuffle numbers
    Helpers.shuffleArray(options);

    console.log('options', options);

    return options;
  },
  arrayRange: function (start, stop) {
    return Array.from(Array(stop - start + 1).keys(), i => i + start);
  }
}

export default AdditionActivityController;
import SubtractionActivityModel from "../models/subtractionActivityModel.js";

const SubtractionActivityController = {
  createQuestions: async function (id) {
    const activity = await SubtractionActivityModel.get(id); // {id, minuendMin, minuendMax, subtrahend}
    let questions = [];

    for (let x = 0; x < 5; x++) {
      let minuend = this.getAugend(activity.minuendMin, activity.minuendMax);
      let total = minuend - parseInt(activity.subtrahend);

      questions.push({
        "id": x,
        "minuend": minuend,
        "subtrahend": activity.subtrahend,
        "total": total,
        "options": this.getOptions(activity.minuendMin, minuend, activity.subtrahend, total),
        "completed": false,
        // "correct": null
      });
    }

    return questions;
  },
  getMinuend: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  getOptions: function (minimum, minuend, subtrahend, total) {
    // Create array of numbers
    let numbers = this.arrayRange(minimum, parseInt(total) + 1);
    let options = [minuend, subtrahend, total];

    // Filter to remove minuend, subtrahend, and total
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

export default SubtractionActivityController;
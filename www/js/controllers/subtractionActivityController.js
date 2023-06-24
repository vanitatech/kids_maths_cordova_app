import SubtractionActivityModel from "../models/subtractionActivityModel";

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
    let numbers = this.arrayRange(minimum, total);
    let options = [minuend, subtrahend, total];

    // Filter to remove minuend, subtrahend, and total
    const numbersFiltered = numbers.filter(function (e) {
      return options.indexOf(e) > -1;
    });

    // Add two of the numbers to the options
    for (let x = 0; x < 2; x++) {
      // Get random index value
      const randomIndex = Math.floor(Math.random() * numbersFiltered.length);
      // Get random item
      options.push(numbersFiltered[randomIndex]);
    }

    return options;
  },
  arrayRange: function (start, stop) {
    return Array.from(Array(stop - start + 1).keys(), i => i + start);
  }
}

export default SubtractionActivityController;
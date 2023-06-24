import CountingActivityModel from "../models/countingActivityModel.js";
import Helpers from "../services/helpers.js";

const CountingActivityController = {
  createQuestions: async function (id) {
    const activity = await CountingActivityModel.get(id); // {id, min, max}
    let questions = [];

    for (let x = 0; x < 5; x++) {
      let total = this.getTotal(activity.min, activity.max, questions);

      questions.push({
        "id": x,
        "total": total,
        "options": this.getOptions(activity.min, total, activity.max),
        "completed": false
      });
    }

    return questions;
  },
  getTotal: function (min, max, questions) {
    min = parseInt(min);
    max = parseInt(max);

    const total = Math.floor(Math.random() * (max - min + 1) + min);

    // Check total is not already used in another question
    let totalUnique = true;
    questions.forEach(function (question) {
      if (question.total == total) {
        totalUnique = false;
      }
    });

    // Only return total if unique
    if (totalUnique) {
      return total;
    } else {
      return this.getTotal(min, max, questions);
    }
  },
  getOptions: function (minimum, total, maximum) {
    // Create array of numbers
    let numbers = Helpers.arrayRange(minimum, maximum);
    let options = [total];

    // Filter to remove total, addend, and total
    numbers = numbers.filter(val => !options.includes(val));

    // Add two of the numbers to the options
    options = Helpers.combineArrays(options, numbers, 2);

    // Shuffle numbers
    Helpers.shuffleArray(options);

    return options;
  }
}

export default CountingActivityController;
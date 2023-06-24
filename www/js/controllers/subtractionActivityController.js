import SubtractionActivityModel from "../models/subtractionActivityModel.js";
import Helpers from "../services/helpers.js";

const SubtractionActivityController = {
  createQuestions: async function (id) {
    const activity = await SubtractionActivityModel.get(id); // {id, minuendMin, minuendMax, subtrahend}
    let questions = [];

    for (let x = 0; x < 5; x++) {
      let minuend = this.getMinuend(activity.minuendMin, activity.minuendMax, questions);
      let total = minuend - parseInt(activity.subtrahend);

      questions.push({
        "id": x,
        "minuend": minuend,
        "subtrahend": activity.subtrahend,
        "total": total,
        "options": this.getOptions(activity.minuendMin, minuend, activity.subtrahend, total),
        "completed": false
      });
    }

    return questions;
  },
  getMinuend: function (min, max, questions) {
    min = parseInt(min);
    max = parseInt(max);

    const minuend = Math.floor(Math.random() * (max - min + 1) + min);

    // Check minuend is not already used in another question
    let minuendUnique = true;
    questions.forEach(function (question) {
      if (question.minuend == minuend) {
        minuendUnique = false;
      }
    });

    // Only return minuend if unique
    if (minuendUnique) {
      return minuend;
    } else {
      return this.getMinuend(min, max, questions);
    }
  },
  getOptions: function (minimum, minuend, subtrahend, total) {
    // Create array of numbers
    let numbers = Helpers.arrayRange(minimum, parseInt(total) + 1);
    let options = [minuend, subtrahend, total];

    // Filter to remove minuend, subtrahend, and total
    numbers = numbers.filter(val => !options.includes(val));

    // Add two of the numbers to the options
    options = Helpers.combineArrays(options, numbers, 2);

    // Shuffle numbers
    Helpers.shuffleArray(options);

    return options;
  }
}

export default SubtractionActivityController;
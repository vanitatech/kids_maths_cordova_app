import AppView from "../views/appView.js";
import AdditionActivityModel from "../models/additionActivityModel.js";
import AdditionActivityView from "../views/additionActivityView.js";
import LessonActivityView from "../views/lessonActivityView.js";
import QuestionModel from "../models/questionModel.js";
import LessonActivityController from "./lessonActivityController.js";

const AdditionActivityController = {
  createQuestions: async function () {
    const activity = await AdditionActivityModel.get(id); // {id: 1, augendMin: 1, augendMax: 9, addend: 1}
    let questions = [];

    for (let x = 0; x < 5; x++) {
      let augend = this.getAugend(activity.augendMin, activity.augendMax);
      let total = augend + parseInt(activity.addend);

      questions.push({
        "id": x,
        "augend": augend,
        "addend": addend,
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
    let numbers = this.arrayRange(minimum, total);
    let options = [augend, addend, total];

    // Filter to remove augend, addend, and total
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

export default AdditionActivityController;
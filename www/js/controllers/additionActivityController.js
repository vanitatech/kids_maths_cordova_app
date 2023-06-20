import AppView from "../views/appView.js";
import AdditionActivityModel from "../models/additionActivityModel.js";
import AdditionActivityView from "../views/additionActivityView.js";
import LessonActivityView from "../views/lessonActivityView.js";
import QuestionsModel from "../models/questionsModel.js";

const AdditionActivityController = {
  show: async function (id) {
    const activity = await AdditionActivityModel.get(id); // {id: 1, augendMin: 1, augendMax: 9, addend: 1}

    LessonActivityView.renderMascotSpeech('Addition', 'plus-circle.svg');

    const questions = this.getQuestions(activity.augendMin, activity.augendMax, activity.addend);
    QuestionsModel.setQuestions(questions);
    QuestionsModel.setCurrentQuestionIndex(0);

    console.log(questions);

    AdditionActivityView.render(questions[0]);

    // TODO: function to render next question, etc.

    // // TODO: Score (stars)
    // LessonActivityView.renderScore(questions);

    AppView.showView('activity');
    AppView.disableViewButtons();
  },
  getQuestions: function (augendMin, augendMax, addend) {
    let questions = [];

    for (let x = 0; x < 5; x++) {
      let augend = this.getAugend(augendMin, augendMax);
      let total = augend + parseInt(addend);

      questions.push({
        "augend": augend,
        "addend": addend,
        "total": total,
        "options": this.getOptions(augendMin, augend, addend, total)
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
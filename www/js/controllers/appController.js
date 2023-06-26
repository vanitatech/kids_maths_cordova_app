import AppView from "../views/appView.js";
import db from '../database/database.js';

const AppController = {
  show: function () {
    AppView.removeLoader();
  },
  showView: function (view) {
    AppView.showView(view);
    AppView.activateViewButton(view);
  },
  showReset: function () {
    // Generate random numbers between 5 and 12
    const number1 = Math.floor(Math.random() * 8) + 5;
    const number2 = Math.floor(Math.random() * 8) + 5;

    // Calculate the correct answer
    const correctAnswer = number1 * number2;

    AppView.showReset(number1, number2, correctAnswer);
  },
  confirmReset: async function () {
    const answerElement = document.getElementById('reset-answer');
    const correctAnswer = answerElement.getAttribute('data-answer');
    const userAnswer = answerElement.value;

    if (userAnswer == correctAnswer) {
      this.resetAppData();
    }
  },
  cancelReset: function () {
    AppView.hideReset();
  },
  resetAppData: async function () {
    await db.delete();
    localStorage.clear();
    location.reload();
  }
}

export default AppController;
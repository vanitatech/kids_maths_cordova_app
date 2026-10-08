import AppView from "../views/appView.js";
import db from '../database/database.js';
import { resetMathsData, isResetAnswerCorrect } from '../services/progressStorage.js';

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

    if (!document.getElementById('reset-acknowledge').checked) {
      AppView.showResetError('Confirm that you want to erase Maths Kids progress on this device.');
      return;
    }
    if (!isResetAnswerCorrect(userAnswer, correctAnswer)) {
      AppView.showResetError('That answer is not correct. Please try again or cancel.');
      return;
    }
    const button = document.getElementById('reset-confirm');
    if (button.disabled) return;
    button.disabled = true;
    try {
      await this.resetAppData();
    } catch (error) {
      console.error('Maths Kids reset failed:', error);
      AppView.showResetError('Reset could not finish. Reload the app before trying again.');
    } finally {
      button.disabled = false;
    }
  },
  cancelReset: function () {
    AppView.hideReset();
  },
  resetAppData: async function () {
    await resetMathsData(db, localStorage, () => location.reload());
  }
}

export default AppController;
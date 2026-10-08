import AppView from "../views/appView.js";
import LessonActivityModel from "../models/lessonActivityModel.js";
import LessonActivityView from "../views/lessonActivityView.js";
import LessonController from "./lessonController.js";
import UserProgressController from "./userProgressController.js";
import UserProgressModel from "../models/userProgressModel.js";
import QuestionModel from "../models/questionModel.js";
import AdditionActivityController from "./additionActivityController.js";
import AdditionActivityView from "../views/additionActivityView.js";
import SubtractionActivityController from "./subtractionActivityController.js";
import SubtractionActivityView from "../views/subtractionActivityView.js";
import CountingActivityController from "./countingActivityController.js";
import CountingActivityView from "../views/countingActivityView.js";
import WorksheetActivityController from "./worksheetActivityController.js";

const LessonActivityController = {
  showAllCurrent: async function () {
      const currentLessonId = UserProgressModel.getCurrentLessonId();
      const activities = await LessonActivityModel.getByLesson(currentLessonId);
      LessonActivityView.renderList(activities);
  },
  show: async function (id) {
    const lessonActivity = await LessonActivityModel.get(id);

    if (lessonActivity.activityType == 'worksheet') {
      await WorksheetActivityController.download(lessonActivity.activityId);
      // Mark as complete
      if (!lessonActivity.completed) {
        lessonActivity.completed = true;
        await LessonActivityModel.update(lessonActivity);

        // Award once, even when a worksheet is downloaded again.
        UserProgressModel.incrementPointsAwarded(5);
      }
      UserProgressController.showPoints();

      // Re-render the lesson view
      await LessonController.showCurrent();
      document.getElementById('app-feedback').textContent = 'Worksheet requested. You can download it again without earning extra stars.';
    } else {
      UserProgressModel.setCurrentLessonActivityId(id);
      UserProgressModel.setCurrentActivityType(lessonActivity.activityType);

      // Create questions
      const questions = await this.createQuestions(lessonActivity.activityType, lessonActivity.activityId);
      await QuestionModel.deleteAll();
      await QuestionModel.insertAll(questions);

      // Show question and view
      LessonActivityView.renderMascotSpeech(lessonActivity.activityType);
      await LessonActivityController.showQuestion(lessonActivity.activityType, 0, 0, true);
      AppView.showView('activity');
      AppView.disableViewButtons();
      document.getElementById('app-feedback').textContent = 'Choose a number for each question mark.';
      document.querySelector('.options button')?.focus();
    }
  },
  createQuestions: async function (activityType, id) {
    switch (activityType) {
      case 'addition':
        return await AdditionActivityController.createQuestions(id);
      case 'counting':
        return await CountingActivityController.createQuestions(id);
      case 'subtraction':
        return await SubtractionActivityController.createQuestions(id);
    }
  },
  showQuestion: async function (activityType, id, attempts, changeImg) {
    UserProgressModel.setCurrentQuestionAttempts(attempts);
    UserProgressModel.setCurrentQuestionId(id);
    const questions = await QuestionModel.getAll();

    switch (activityType) {
      case 'addition':
        AdditionActivityView.render(questions[id], changeImg);
        break;
      case 'counting':
        CountingActivityView.render(questions[id], changeImg);
        break;
      case 'subtraction':
        SubtractionActivityView.render(questions[id], changeImg);
        break;
    }

    LessonActivityView.renderScore(questions);
  },
  resetQuestion: async function () {
    const activityType = UserProgressModel.getCurrentActivityType();
    const questionId = UserProgressModel.getCurrentQuestionId()
    const questionAttempts = UserProgressModel.getCurrentQuestionAttempts();
    await this.showQuestion(activityType, questionId, questionAttempts, false);
  },
  showNextStep: async function () {
    const activityType = UserProgressModel.getCurrentActivityType();
    const nextQuestionId = UserProgressModel.getNextQuestionId();
    const totalQuestions = await QuestionModel.getTotal();

    if (nextQuestionId < totalQuestions) {
      // Show next question
      await this.showQuestion(activityType, nextQuestionId, 0, true);
      document.querySelector('.options button')?.focus();
    } else {
      // Mark activity complete
      const lessonActivityId = UserProgressModel.getCurrentLessonActivityId();
      const lessonActivity = await LessonActivityModel.get(lessonActivityId);
      lessonActivity.completed = true;
      await LessonActivityModel.update(lessonActivity);

      // Persist points
      let points = 0;
      const questions = await QuestionModel.getAll();
      questions.forEach(function (question) {
        if (question.correct) {
          points++;
        }
      });
      UserProgressModel.incrementPointsAwarded(points);

      // Empty questions
      await QuestionModel.deleteAll();

      // Re-render points
      UserProgressController.showPoints();

      // Re-render lesson view
      await LessonController.showCurrent();
      document.getElementById('app-feedback').textContent = `Activity complete. You earned ${points} stars.`;
      document.querySelector('#activities-list button:not(:disabled)')?.focus();
    }
  },
  chooseCard: function (cardContainer) {
    const card = cardContainer.querySelector('.card');
    if (card) {
      // Move card to active card slot
      const activeCardSlot = document.querySelector('.card-slot.active');
      activeCardSlot.innerHTML = '';
      activeCardSlot.appendChild(card.cloneNode(true));
      card.remove();
      cardContainer.disabled = true;

      // Find the index of the active card slot, as compared to all card slots
      let activeCardSlotIndex = 0;
      const cardSlots = document.querySelectorAll('.card-slot');
      for (let x = 0; x < cardSlots.length; x++) {
        if (cardSlots[x].classList.contains('active')) {
          activeCardSlotIndex = x;
        }
      }

      // Remove active class from current card slot
      activeCardSlot.classList.remove('active');

      // Make the next card slot active
      const nextCardSlotIndex = activeCardSlotIndex + 1;
      if (nextCardSlotIndex < cardSlots.length) {
        cardSlots[nextCardSlotIndex].classList.add('active');
        cardSlots[nextCardSlotIndex].innerHTML = '<span class="placeholder">?</span>';
        document.querySelector('.options button:not(:disabled)')?.focus();
      } else {
        LessonActivityView.hideOptions();
        LessonActivityView.renderCheckAnswerButton();
      }
    }
  },
  checkAnswer: async function () {
    LessonActivityView.removeCheckAnswerButton();
    UserProgressModel.incrementCurrentQuestionAttempts();

    // Check if correct cards are in correct slots
    let correct = true;
    const cardSlots = document.querySelectorAll('.card-slot');
    cardSlots.forEach(function (cardSlot) {
      const card = cardSlot.querySelector('.card');
      if (cardSlot.getAttribute('data-number') !== card.getAttribute('data-number')) {
        correct = false;
      }
    });

    if (correct) {
      await LessonActivityView.renderQuestionResponse('success');

      // Mark question correct
      await this.markQuestion(true);

      // Show next step
      await this.showNextStep();

    } else {
      await LessonActivityView.renderQuestionResponse('failure',
        UserProgressModel.getCurrentQuestionAttempts() < 2
          ? 'Not quite right. Count the objects and try again.'
          : 'Keep practising. Moving to the next question.');

      if (UserProgressModel.getCurrentQuestionAttempts() < 2) {
        // Reset question
        await this.resetQuestion();
        document.querySelector('.options button')?.focus();

      } else {
        // Mark question incorrect
        await this.markQuestion(false);

        // Show next step
        document.getElementById('app-feedback').textContent = 'Keep practising. Moving to the next question.';
        await this.showNextStep();
      }
    }
  },
  markQuestion: async function (correct) {
    const currentQuestionId = UserProgressModel.getCurrentQuestionId();
    let question = await QuestionModel.get(currentQuestionId);
    question.completed = true;
    question.correct = correct;
    await QuestionModel.update(question);
  },
  checkAllCompleted: async function (lessonId) {
    const activities = await LessonActivityModel.getByLesson(lessonId);

    let completed = true;

    activities.forEach(function (activity) {
      if (!activity.completed) {
        completed = false;
      }
    });

    return completed;
  }
}

export default LessonActivityController;
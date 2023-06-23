import LessonActivityModel from "../models/lessonActivityModel.js";
import LessonActivityView from "../views/lessonActivityView.js";
import UserProgressModel from "../models/userProgressModel.js";
import AdditionActivityController from "./additionActivityController.js";
import AdditionActivityView from "../views/additionActivityView.js";
import QuestionModel from "../models/questionModel.js";

const LessonActivityController = {
  showAllCurrent: async function () {
    try {
      const currentLessonId = UserProgressModel.getCurrentLessonId();
      const activities = await LessonActivityModel.getByLesson(currentLessonId);
      LessonActivityView.renderList(activities);
    } catch (error) {
      console.error('Error:', error);
    }
  },
  show: async function (id) {
    const lessonActivity = LessonActivityModel.get(id);

    UserProgressModel.setCurrentActivityType(lessonActivity.activityType);

    let activityController;
    let activityView;
    switch (lessonActivity.activityType) {
      case 'addition':
        activityController = AdditionActivityController;
        activityView = AdditionActivityView;
        break;
      // case 'counting':
      //   activityController = CountingActivityController;
      //   activityView = CountingActivityView;
      //   break;
      // case 'subtraction':
      //   activityController = SubtractionActivityController;
      //   activityView = SubtractionActivityView;
      //   break;
    }

    // Create questions
    const questions = activityController.createQuestions();
    await QuestionModel.deleteAll();
    await QuestionModel.insertAll(questions);

    // Show question and view
    LessonActivityView.renderMascotSpeech(lessonActivity.activityType);
    LessonActivityController.showQuestion(activityView, 0);
    AppView.showView('activity');
    AppView.disableViewButtons();
  },
  showQuestion: async function (activityView, id) {
    UserProgressModel.setCurrentQuestionAttempts(0);
    UserProgressModel.setCurrentQuestionId(id);
    const questions = await QuestionModel.getAll();
    activityView.render(questions[id]);
    LessonActivityView.renderScore(questions);
  },
  showNext: async function () {
    const activityType = UserProgressModel.getCurrentActivityType();
    const nextQuestionId = UserProgressModel.getNextQuestionId();
    const totalQuestions = await QuestionModel.getTotal();

    if (nextQuestionId < totalQuestions) {
      // Show next question
      this.showQuestion(activityType, nextQuestionId);
    } else {
      // TODO: Return to Lesson view

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
      } else {
        LessonActivityView.hideOptions();
        LessonActivityView.renderCheckAnswerButton();
      }
    }
  },
  checkAnswer: async function () {
    LessonActivityView.removeCheckAnswerButton();
    UserProgressModel.incrementCurrentQuestionsAttempts();

    let correct = true;

    // Check if correct cards are in correct slots
    const cardSlots = document.querySelectorAll('.card-slot');
    cardSlots.forEach(function (cardSlot) {
      const card = cardSlot.querySelector('.card');
      if (cardSlot.getAttribute('data-number') !== card.getAttribute('data-number')) {
        correct = false;
      }
    });


    if (correct) {
      await LessonActivityView.renderQuestionResponse('success');

      // TODO: Award green star

      // Show next step
      this.showNext();

    } else {
      await LessonActivityView.renderQuestionResponse('failure');

      if (UserProgressModel.getCurrentQuestionsAttempts() < 2) {
        // TODO: Reset question

      } else {
        // TODO: Award red star

        // Show next step
        this.showNext();
      }
    }

    console.log('ready');
  }
}

export default LessonActivityController;
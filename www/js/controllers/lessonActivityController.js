import LessonActivityModel from "../models/lessonActivityModel.js";
import LessonActivityView from "../views/lessonActivityView.js";
import UserProgressModel from "../models/userProgressModel.js";
import AdditionActivityController from "./additionActivityController.js";
import AdditionActivityView from "../views/additionActivityView.js";
import QuestionModel from "../models/questionModel.js";
import LessonController from "./lessonController.js";

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

    UserProgressModel.setCurrentLessonActivityId(id);
    UserProgressModel.setCurrentActivityType(lessonActivity.activityType);

    let activityController;
    switch (lessonActivity.activityType) {
      case 'addition':
        activityController = AdditionActivityController;
        break;
      // case 'counting':
      //   activityController = CountingActivityController;
      //   break;
      // case 'subtraction':
      //   activityController = SubtractionActivityController;
      //   break;
    }

    // Create questions
    const questions = activityController.createQuestions();
    await QuestionModel.deleteAll();
    await QuestionModel.insertAll(questions);

    // Show question and view
    LessonActivityView.renderMascotSpeech(lessonActivity.activityType);
    LessonActivityController.showQuestion(lessonActivity.activityType, 0, 0);
    AppView.showView('activity');
    AppView.disableViewButtons();
  },
  showQuestion: async function (activityType, id, attempts) {
    let activityView;
    switch (activityType) {
      case 'addition':
        activityView = AdditionActivityView;
        break;
      // case 'counting':
      //   activityView = CountingActivityView;
      //   break;
      // case 'subtraction':
      //   activityView = SubtractionActivityView;
      //   break;
    }

    UserProgressModel.setCurrentQuestionAttempts(attempts);
    UserProgressModel.setCurrentQuestionId(id);
    const questions = await QuestionModel.getAll();
    activityView.render(questions[id]);
    LessonActivityView.renderScore(questions);
  },
  resetQuestion: async function () {
    const activityType = UserProgressModel.getCurrentActivityType();
    const questionId = UserProgressModel.getCurrentQuestionId()
    const questionAttempts = UserProgressModel.getCurrentQuestionAttempts();
    this.showQuestion(activityType, questionId, questionAttempts);
  },
  showNextStep: async function () {
    const activityType = UserProgressModel.getCurrentActivityType();
    const nextQuestionId = UserProgressModel.getNextQuestionId();
    const totalQuestions = await QuestionModel.getTotal();

    if (nextQuestionId < totalQuestions) {
      // Show next question
      this.showQuestion(activityType, nextQuestionId);
    } else {
      // TODO: Finish Activity 
      // Mark activity complete
      const lessonActivityId = UserProgressModel.getCurrentLessonActivityId();
      const lessonActivity = LessonActivityModel.get(lessonActivityId);
      lessonActivity.completed = true;
      LessonActivityModel.update(lessonActivity);

      // Persist points
      let points = 0;
      const questions = QuestionModel.getAll();
      questions.forEach(function (question) {
        if (question.correct) {
          points++;
        }
      });
      UserProgressModel.incrementPointsAwarded(points);

      // Empty questions
      QuestionModel.deleteAll();

      // Re-render lesson view
      LessonController.showCurrent();
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
      this.markQuestion(true);

      // Show next step
      this.showNextStep();

    } else {
      await LessonActivityView.renderQuestionResponse('failure');

      if (UserProgressModel.getCurrentQuestionAttempts() < 2) {
        // Reset question
        this.resetQuestion();

      } else {
        // Mark question incorrect
        this.markQuestion(false);

        // Show next step
        this.showNextStep();
      }
    }
  },
  markQuestion: async function (correct) {
    const currentQuestionId = UserProgressModel.getCurrentQuestionId();
    let question = QuestionModel.get(currentQuestionId);
    question.completed = true;
    question.correct = correct;
    QuestionModel.update(question);
  }
}

export default LessonActivityController;
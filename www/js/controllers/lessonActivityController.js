import LessonActivityModel from "../models/lessonActivityModel.js";
import LessonActivityView from "../views/lessonActivityView.js";
import UserProgressModel from "../models/userProgressModel.js";

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
      // TODO: Award star
      // TODO: Show next question
    } else {
      await LessonActivityView.renderQuestionResponse('failure');
      // TODO: Reset question
    }

    console.log('ready');
  }
}

export default LessonActivityController;
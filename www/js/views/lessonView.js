const LessonView = {
  renderCurrentLessonNumber: function (number) {
    // Update lesson number
    document.getElementById('current-lesson-number').innerHTML = number;
  },
  renderNextLessonButton: function (number, enabled) {
    // Prepare button HTML
    const nextLessonButtonHtml = `
    <button id="next-lesson-button" onclick="LessonController.showNext()" ${enabled ? '' : 'disabled'}>
        <span>Next Lesson</span>
        <span id="next-lesson-number" class="lesson-number">${number}</span>
        <img src="img/thick-arrow-right-long.svg">
    </button>`;

    // Update the DOM
    document.getElementById('next-lesson-button-container').innerHTML = nextLessonButtonHtml;
  }
}

export default LessonView;
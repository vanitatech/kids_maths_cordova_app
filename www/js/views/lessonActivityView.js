const LessonActivityView = {
  renderList: function (activities) {
    const activitiesListElement = document.getElementById('activities-list');
    activitiesListElement.innerHTML = '';

    activities.forEach(activity => {
      const activityItem = document.createElement('button');
      activityItem.type = 'button';
      activityItem.setAttribute('class', `activity-item activity-type-${activity.activityType}`);
      activityItem.setAttribute('onclick', `LessonActivityController.show(${activity.id})`);

      if (activity.completed) {
        activityItem.classList.add('completed');
        activityItem.setAttribute('data-completed', '');
      }

      const activityType = this.formatType(activity.activityType);
      activityItem.setAttribute('aria-label', `${activityType}${activity.completed ? ', completed' : ''}`);

      let activityItemHtml = `
        <div class="activity-checkbox"></div>
        <div class="activity-type">${activityType}</div>
        `;

      const activityIcon = this.getActivityIcon(activity.activityType);
      if (activityIcon) {
        activityItemHtml += `<img src="img/${activityIcon}" alt="">`;
      }

      activityItem.innerHTML = activityItemHtml;
      activitiesListElement.appendChild(activityItem);
    });
  },
  renderMascotSpeech: function (type) {
    let img = '';
    switch (type) {
      case 'addition':
        img = 'plus-circle.svg';
        break;
      case 'counting':
        img = 'numbers-circle.svg';
        break;
      case 'subtraction':
        img = 'minus-circle.svg';
        break;
    }

    document.getElementById('activity-type').innerHTML = type;
    document.getElementById('activity-icon').innerHTML = `<img src="img/${img}" alt="">`;
  },
  renderScore: function (questions) {
    const activityProgress = document.getElementById('activity-progress-stars');
    activityProgress.innerHTML = '';

    questions.forEach(function (question, index) {
      let imgElement = document.createElement('img');

      if (question.completed) {
        if (question.correct) {
          imgElement.setAttribute('src', 'img/star-yellow.svg');
        } else {
          imgElement.setAttribute('src', 'img/star-red.svg');
        }
      } else {
        imgElement.setAttribute('src', 'img/star-grey-hollow.svg');
      }
      imgElement.alt = `Question ${index + 1}: ${question.completed ? (question.correct ? 'correct' : 'completed without a star') : 'not completed'}`;

      activityProgress.appendChild(imgElement);
    });
  },
  formatType: function (type) {
    // Capatilize first letter
    return type.charAt(0).toUpperCase() + type.slice(1);
  },
  getActivityIcon: function (activityType) {
    switch (activityType) {
      case 'addition':
        return 'plus-circle.svg';
      case 'counting':
        return 'numbers-circle.svg';
      case 'subtraction':
        return 'minus-circle.svg';
      case 'worksheet':
        return 'printer.svg';
      default:
        return '';
    }
  },
  getObjectImg: function () {
    const images = [
      'aeroplane.svg',
      'ambulance.svg',
      'balloon.svg',
      'banana.svg',
      'basketball.svg',
      'bike.svg',
      'candy.svg',
      'car.svg',
      'cookie.svg',
      'crown.svg',
      'crown2.svg',
      'cupcake.svg',
      'diamond.svg',
      'flower.svg',
      'gem.svg',
      'hamburger.svg',
      'helicopter.svg',
      'pineapple.svg',
      'rocket.svg',
      'sailboat.svg',
      'school-bus.svg',
      'strawberry.svg',
      'tomato.svg'
    ];

    const random = Math.floor(Math.random() * images.length);
    return images[random];
  },
  getImagesHtml: function (number, img) {
    let html = '';
    for (let x = 0; x < number; x++) {
      html += `<img src="img/objects/${img}" alt="">`;
    }
    return `<div role="img" aria-label="${number} objects">` + html + '</div>';
  },
  getOptionsHtml: function (options) {
    let html = '';
    options.forEach(function (number) {
      html += `<li><button type="button" class="card-container" aria-label="Choose ${number}" onclick="LessonActivityController.chooseCard(this)">
                <div class="card" data-number="${number}">${number}</div>
              </button></li>`;
    });
    return html;
  },
  hideOptions: function () {
    document.querySelector('#activity-content .options').style.display = 'none';
  },
  renderCheckAnswerButton: function () {
    const checkAnswerButton = document.createElement('button');
    checkAnswerButton.setAttribute('id', 'check-answer-button');
    checkAnswerButton.setAttribute('onclick', 'LessonActivityController.checkAnswer()');
    checkAnswerButton.innerHTML = '<span>Check Answer</span><img src="img/thick-arrow-right-long-white.svg" alt="">';
    document.getElementById('activity-content').appendChild(checkAnswerButton);
    checkAnswerButton.focus();
  },
  removeCheckAnswerButton: function () {
    document.getElementById('check-answer-button').remove();
  },
  renderQuestionResponse: async function (type, message) {
    const questionResponse = document.createElement('img');
    questionResponse.setAttribute('id', 'question-response');

    if (type == 'success') {
      questionResponse.setAttribute('src', 'img/happy-2.svg');
      questionResponse.alt = 'Correct answer';
    } else if (type == 'failure') {
      questionResponse.setAttribute('src', 'img/sad-2.svg');
      questionResponse.alt = 'Not quite right';
    }
    document.getElementById('app-feedback').textContent =
      message || (type === 'success' ? 'Well done! That is correct.' : 'Not quite right. Count the objects and try again.');

    // Show for 2 seconds
    document.getElementById('activity-content').appendChild(questionResponse);
    await this.delay(2000);
    document.getElementById('question-response').remove();
  },
  renderPopup: function (type) {
    const popup = document.createElement('div');
    popup.setAttribute('id', 'activity-popup');
    popup.setAttribute('data-type', type);
  },
  delay: function (milliseconds) {
    return new Promise(response => setTimeout(response, milliseconds));
  }
}

export default LessonActivityView;

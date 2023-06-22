const LessonActivityView = {
  renderList: function (activities) {
    const activitiesListElement = document.getElementById('activities-list');
    activitiesListElement.innerHTML = '';

    activities.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.setAttribute('class', `activity-item activity-type-${activity.activityType}`);
      const activityController = this.getActivityController(activity.activityType);
      activityItem.setAttribute('onclick', `${activityController}.show(${activity.activityId})`);

      if (activity.completed) {
        activityItem.setAttribute('data-completed', '');
      }

      // Capatilize first letter
      const activityType = activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)

      let activityItemHtml = `
        <div class="activity-checkbox"></div>
        <div class="activity-type">${activityType}</div>
        `;

      const activityIcon = this.getActivityIcon(activity.activityType);
      if (activityIcon) {
        activityItemHtml += `<img src="img/${activityIcon}">`;
      }

      activityItem.innerHTML = activityItemHtml;
      activitiesListElement.appendChild(activityItem);
    });
  },
  renderMascotSpeech: function (type, img) {
    document.getElementById('activity-type').innerHTML = type;
    document.getElementById('activity-icon').innerHTML = `<img src="img/${img}">`;
  },
  renderScore: function (questions) {
    const activityProgress = document.getElementById('activity-progress-stars');
    activityProgress.innerHTML = '';

    questions.forEach(function (question) {
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

      activityProgress.appendChild(imgElement);
    });
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
  getActivityController: function (activityType) {
    switch (activityType) {
      case 'addition':
        return 'AdditionActivityController';
      case 'counting':
        return 'CountingActivityController';
      case 'subtraction':
        return 'SubtractionActivityController';
      case 'worksheet':
        return 'WorksheetActivityController';
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
      html += `<img src="img/objects/${img}">`;
    }
    return '<div>' + html + '</div>';
  },
  getOptionsHtml: function (options) {
    let html = '';
    options.forEach(function (number) {
      html += `<li class="card-container" onclick="LessonActivityController.chooseCard(this)">
                <div class="card" data-number="${number}">${number}</div>
              </li>`;
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
    checkAnswerButton.innerHTML = '<span>Check Answer</span><img src="img/thick-arrow-right-long.svg">';
    document.getElementById('activity-content').appendChild(checkAnswerButton);
  },
  renderQuestionResponse: async function (type) {
    const questionResponse = document.createElement('img');
    questionResponse.setAttribute('id', 'question-response');

    if (type == 'success') {
      questionResponse.setAttribute('src', 'img/happy.svg');
    } else if (type == 'failure') {
      questionResponse.setAttribute('src', 'img/sad.svg');
    }

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




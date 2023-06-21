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
      html += `<li class="card-origin">
                <div class="card" data-number="${number}">
                  <div class="card-inner">${number}</div>
                </div>
              </li>`;
    });
    return html;
  },
  enableDraggableCards: function () {
    /* ---- Drag and Drop Functionality for cards ---- */

  }
}

export default LessonActivityView;




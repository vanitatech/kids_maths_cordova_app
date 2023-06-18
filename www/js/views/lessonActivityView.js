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
  }
}

export default LessonActivityView;
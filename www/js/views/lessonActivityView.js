const LessonActivityView = {
  renderList: function (activities) {
    const activitiesListElement = document.getElementById('activities-list');
    activitiesListElement.innerHTML = '';

    activities.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.setAttribute('data-id', activity.activityId);
      activityItem.setAttribute('class', 'activity-item activity-type-' + activity.activityType);

      if (activity.completed) {
        activityItem.setAttribute('data-completed', '');
      }

      let activityItemHtml = `
        <div class="activity-checkbox"></div>
        <div class="activity-type">${activity.activityType}</div>
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
        return '';
      case 'subtraction':
        return 'minus-circle.svg';
      default:
        return '';
    }
  }
}

export default LessonActivityView;
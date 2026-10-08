const UserProgressView = {
  renderProgressBar: function (progressCount, totalCount) {
    // Calculate progress as a percentage
    const progressPercentage = (progressCount / totalCount) * 100;

    // Update the progress bar width
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    const progress = document.getElementById('progress-background');
    progress.setAttribute('aria-valuemax', totalCount);
    progress.setAttribute('aria-valuenow', progressCount);
    progress.setAttribute('aria-valuetext', `${progressCount} of ${totalCount} lessons completed`);

    // Update numbers
    document.getElementById('progress-numbers-count').innerHTML = progressCount;
    document.getElementById('progress-numbers-total').innerHTML = totalCount;
  },
  renderProgressStars: function (count) {
    // Update progress stars
    document.getElementById('progress-stars-amount').innerHTML = count;
    document.getElementById('progress-stars-button').setAttribute('aria-label',
      `Mascot friends, ${count} stars available`);
  }
}

export default UserProgressView;
const UserProgressView = {
  renderProgressBar: function (progressCount, totalCount) {
    // Calculate progress as a percentage
    const progressPercentage = (progressCount / totalCount) * 100;

    // Update the progress bar width
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;

    // Update numbers
    document.getElementById('progress-numbers-count').innerHTML = progressCount;
    document.getElementById('progress-numbers-total').innerHTML = totalCount;
  },
  renderProgressStars: function (count) {
    // Update progress stars
    document.getElementById('progress-stars-amount').innerHTML = count;
  }
}

export default UserProgressView;
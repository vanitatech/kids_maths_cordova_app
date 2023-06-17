const UserProgressView = {
  renderProgressBar: function (progressCount, totalCount) {
    const progressBarElement = document.getElementById('progress-bar');
    // Calculate progress as a percentage
    const progressPercentage = (progressCount / totalCount) * 100;
    // Update the progress bar width
    progressBarElement.style.width = `${progressPercentage}%`;
  }
}

export default UserProgressView;
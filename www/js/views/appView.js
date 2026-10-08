function handleResetKeyboard(event) {
  if (event.key === 'Escape') {
    AppView.hideReset();
    event.preventDefault();
  } else if (event.key === 'Tab') {
    const controls = [...document.querySelectorAll('#reset-check button, #reset-check input')]
      .filter(control => !control.disabled);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  }
}

const AppView = {
  showLoader: function () {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('app').style.display = 'none';
  },
  removeLoader: function () {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('app').style.display = 'block';
  },
  showView: function (targetView) {
    this.showLoader();

    document.querySelectorAll('.app-view').forEach(function (appViewElement) {
      const view = appViewElement.getAttribute('data-view');
      if (view == targetView) {
        appViewElement.setAttribute('data-active', '');
      } else {
        appViewElement.removeAttribute('data-active');
      }
    });

    this.removeLoader();
  },
  activateViewButton: function (targetView) {
    document.querySelectorAll('.show-view-button').forEach(function (buttonElement) {
      const buttonView = buttonElement.getAttribute('data-target-view');
      if (buttonView == targetView) {
        buttonElement.classList.add('active');
      } else {
        buttonElement.classList.remove('active');
      }
    });
  },
  disableViewButtons: function () {
    document.querySelectorAll('.show-view-button').forEach(function (buttonElement) {
      buttonElement.classList.remove('active');
    });
  },
  showReset: function (number1, number2, correctAnswer) {
    document.getElementById('reset-question').innerHTML = `${number1} x ${number2} =`;
    document.getElementById('reset-answer').setAttribute('data-answer', correctAnswer);
    document.getElementById('reset-answer').value = '';
    document.getElementById('reset-acknowledge').checked = false;
    this.showResetError('');
    document.getElementById('reset-check-cover').style.display = 'flex';
    document.getElementById('header').inert = true;
    document.querySelectorAll('.app-view').forEach(view => { view.inert = true; });
    document.addEventListener('keydown', handleResetKeyboard);
    document.getElementById('reset-answer').focus();
  },
  showResetError: function (message) {
    document.getElementById('reset-error').textContent = message;
  },
  hideReset: function () {
    document.getElementById('reset-check-cover').style.display = 'none';
    document.getElementById('header').inert = false;
    document.querySelectorAll('.app-view').forEach(view => { view.inert = false; });
    document.removeEventListener('keydown', handleResetKeyboard);
    document.getElementById('reset-open').focus();
  }
}

export default AppView;
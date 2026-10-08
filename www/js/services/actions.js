export function actionId(button) {
  const raw = button.dataset.id;
  const id = Number(raw);
  if (!/^[1-9]\d*$/.test(raw) || !Number.isSafeInteger(id)) {
    throw new Error('Invalid Maths Kids action identifier.');
  }
  return id;
}

export function bindActions(root, actions, onError) {
  let busy = false;
  root.addEventListener('click', async event => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled || busy) return;
    let pending = false;
    try {
      const action = button.dataset.action;
      if (!Object.prototype.hasOwnProperty.call(actions, action)) {
        throw new Error('Unknown Maths Kids action.');
      }
      busy = true;
      const result = actions[action](button);
      if (result && typeof result.then === 'function') {
        pending = true;
        button.disabled = true;
        await result;
      }
    } catch (error) {
      onError(error);
    } finally {
      if (pending && button.isConnected) button.disabled = false;
      busy = false;
    }
  });
}

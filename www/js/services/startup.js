export function startWhenReady(document, isCordova, initialize, reportError) {
  let started = false;
  const start = async () => {
    if (started) return;
    started = true;
    try {
      await initialize();
    } catch (error) {
      reportError(error);
    }
  };
  if (isCordova) {
    document.addEventListener('deviceready', start, { once: true });
  } else {
    void start();
  }
}

export async function seedIfEmpty(table, data) {
  if (await table.count() === 0) {
    await table.bulkAdd(data);
  }
}

export function worksheetUrl(filename, baseUrl) {
  if (!/^[A-Za-z0-9_-]+\.pdf$/i.test(filename)) {
    throw new Error('Invalid worksheet filename.');
  }
  return new URL(`worksheets/${filename}`, baseUrl).href;
}

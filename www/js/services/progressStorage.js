import { objectImageUrl } from './objectImages.js';

const progressFields = {
  pointsAwarded: 0,
  pointsRedeemed: 0,
  currentMascot: 1,
  currentLessonId: 1,
  currentActivityId: 0,
  currentQuestionId: 0,
  currentQuestionAttempts: 0,
};

export const mathsStorageKeys = [
  ...Object.keys(progressFields).map(field => `userProgress.${field}`),
  'userProgress.currentActivityType',
  'userProgress.currentObjectImage',
  'dailyTarget.numberOfLessons',
  'dailyTarget.pointsToAward',
  'dailyTarget.targetMet',
  'dailyTarget.pointsAwarded',
  'dailyTarget.notificationSent',
];

export function validateProgress(storage, lessonIds, mascotIds, activityIds) {
  const values = {};
  for (const [field, fallback] of Object.entries(progressFields)) {
    const raw = storage.getItem(`userProgress.${field}`);
    const value = raw === null ? fallback : Number(raw);
    if ((raw !== null && !/^\d+$/.test(raw)) || !Number.isSafeInteger(value) || value < 0) {
      throw new Error(`Saved Maths Kids progress is invalid: ${field}.`);
    }
    values[field] = value;
  }
  if (!lessonIds.includes(values.currentLessonId)
    || !mascotIds.includes(values.currentMascot)
    || (values.currentActivityId !== 0 && !activityIds.includes(values.currentActivityId))
    || values.currentQuestionId > 4
    || values.pointsRedeemed > values.pointsAwarded) {
    throw new Error('Saved Maths Kids progress does not match the available lessons or rewards.');
  }
  const type = storage.getItem('userProgress.currentActivityType');
  if (type !== null && !['counting', 'addition', 'subtraction', 'worksheet'].includes(type)) {
    throw new Error('Saved Maths Kids activity type is invalid.');
  }
  const image = storage.getItem('userProgress.currentObjectImage');
  if (image !== null) objectImageUrl(image);
}

export async function resetMathsData(database, storage, reload) {
  await database.delete();
  for (const key of mathsStorageKeys) {
    storage.removeItem(key);
  }
  reload();
}

export function isResetAnswerCorrect(answer, expected) {
  return /^\d+$/.test(answer) && /^\d+$/.test(expected)
    && Number(answer) === Number(expected);
}

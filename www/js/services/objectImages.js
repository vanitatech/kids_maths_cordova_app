export const objectImages = [
  'aeroplane.svg', 'ambulance.svg', 'balloon.svg', 'banana.svg',
  'basketball.svg', 'bike.svg', 'candy.svg', 'car.svg', 'cookie.svg',
  'crown.svg', 'crown2.svg', 'cupcake.svg', 'diamond.svg', 'flower.svg',
  'gem.svg', 'hamburger.svg', 'helicopter.svg', 'pineapple.svg',
  'rocket.svg', 'sailboat.svg', 'school-bus.svg', 'strawberry.svg', 'tomato.svg',
];

export function objectImageUrl(image) {
  if (!objectImages.includes(image)) {
    throw new Error('Saved Maths Kids object image is invalid.');
  }
  return `img/objects/${image}`;
}

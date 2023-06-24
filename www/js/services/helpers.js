const Helpers = {
  shuffleArray: function (array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  },
  combineArrays: function (array1, array2, amountToAdd) {
    for (let x = 0; x < amountToAdd && x < array2.length; x++) {
      // Get random index value
      const randomIndex = Math.floor(Math.random() * array2.length);
      // Get random item
      array1.push(array2[randomIndex]);
    }

    return array1;
  },
  arrayRange: function (start, stop) {
    return Array.from(Array(stop - start + 1).keys(), i => i + start);
  }
}

export default Helpers;
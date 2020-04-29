export default function sortByReference(array) {
  return array.sort((a, b) => {
    const refA = a.reference;
    const refB = b.reference;

    if (refA < refB) {
      return -1;
    }

    if (refA > refB) {
      return 1;
    }

    return 0;
  });
}

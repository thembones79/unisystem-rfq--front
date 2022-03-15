// helper function to use in Array.sort() function to sort array of objects via key
// usage:  arrayOfObjects.sort(by("keyName"))  OR  arrayOfObjects.sort(by("keyName", "desc"))

export const by = <T extends object, K extends keyof T>(
  key: K,
  order: "asc" | "desc" = "asc"
) => {
  return function innerSort(a: T, b: T) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    let left: T[K] | string = a[key];
    let right: T[K] | string = b[key];

    left = typeof left === "string" ? left.toUpperCase() : left;
    right = typeof right === "string" ? right.toUpperCase() : right;

    let comparison = 0;
    if (left > right) {
      comparison = 1;
    } else if (left < right) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
};

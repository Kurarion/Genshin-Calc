export function keysEqual(origin: any, target: any) {
  if (
    (origin == undefined && target != undefined) ||
    (origin != undefined && target == undefined)
  ) {
    return false;
  }
  if (origin == undefined && target == undefined) {
    return true;
  }
  let result = true;
  for (let i of ['switchOnSet', 'sliderNumMap']) {
    if (
      (origin[i] == undefined && target[i] != undefined) ||
      (origin[i] != undefined && target[i] == undefined)
    ) {
      result = false;
      continue;
    }
    if (origin[i] == undefined && target[i] == undefined) {
      continue;
    }
    const keys1 = Object.keys(origin[i]),
      keys2 = Object.keys(target[i]);
    if (result && keys1.length != keys2.length) {
      result = false;
    }
    if (result && keys1.every((key) => !keys2.includes(key))) {
      result = false;
    }
    if (
      i == 'switchOnSet' &&
      result &&
      keys2.every((key) => {
        if (target[i][key] === true && origin[i][key] === false) {
          return true;
        }
        return false;
      })
    ) {
      result = false;
    }
  }

  return result;
}

export function colorElement(element, color) {
  element.style.fill = color;
}

export function colorElements(elements, color) {
  elements.forEach((element) => {
    element.style.fill = color;
  });
}

export function hideElements(elements) {
  elements.forEach((element) => {
    element.style.display = "none";
  });
}

export function showElements(elements) {
  elements.forEach((element) => {
    element.style.display = "inline";
  });
}

export function getFormattedTime(time) {
  return `${time < 10 ? "0" : ""}${time}`;
}
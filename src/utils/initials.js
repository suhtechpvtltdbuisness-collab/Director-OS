export function initials(name) {
  return name.split(" ").map((x) => x[0]).join("");
}

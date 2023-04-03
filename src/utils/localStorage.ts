function setLocalStorage(name: string, value: string) {
  localStorage.setItem(name, value);
}
function getLocalStorage(name: string) {
  return localStorage.getItem(name);
}
function eraseLocalStorage(name: string) {
  localStorage.removeItem("myCat");
}

export { setLocalStorage, getLocalStorage, eraseLocalStorage };

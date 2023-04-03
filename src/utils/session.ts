function setSession(name: string, value: string, days: number = 7) {
  sessionStorage.setItem(name, value);
}
function getSession(name: string) {
  if (sessionStorage.getItem(name)) return sessionStorage.getItem(name);
  return null;
}

export { setSession, getSession };

const disposableDomains = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "trashmail.com",
  "yopmail.com",
  "guerrillamail.com",
  "maildrop.cc",
  "dispostable.com",
  "getnada.com"
]);

function isEmailValid(email) {
  if (!email || typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  return /^\S+@\S+\.\S+$/.test(normalized);
}

function isDisposableEmail(email) {
  if (!email || typeof email !== "string") return false;
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return disposableDomains.has(domain);
}

function isStrongPassword(password) {
  if (!password || typeof password !== "string") return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

module.exports = {
  isEmailValid,
  isDisposableEmail,
  isStrongPassword
};
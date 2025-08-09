export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePasswordStrength(password: string) {
  const lengthValid = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const valid = lengthValid && hasUpper && hasLower && hasNumber && hasSpecial;

  let label = "Weak";
  let color = "text-red-500";
  if (valid) {
    label = "Strong";
    color = "text-green-500";
  } else if (lengthValid && (hasUpper || hasLower || hasNumber)) {
    label = "Medium";
    color = "text-yellow-500";
  }

  return { valid, label, color };
}

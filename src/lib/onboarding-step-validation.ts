const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidFirstNameStep(firstName: string): boolean {
  return firstName.trim().length >= 2;
}

export function isValidEmailStep(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidAgeStep(age: string, min: number, max: number): boolean {
  if (!age.trim()) return false;
  const value = Number(age);
  return Number.isInteger(value) && value >= min && value <= max;
}

export function isValidHourlyRateStep(hourlyRate: string): boolean {
  if (!hourlyRate.trim()) return false;
  const value = Number(hourlyRate);
  return Number.isFinite(value) && value >= 5 && value <= 200;
}

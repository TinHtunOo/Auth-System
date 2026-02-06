export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface RegistrationData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export function isValidEmail(email: string): boolean {
  if (!email || email.trim() === "") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  if (!password) return false;

  const length = password.length;
  if (length < 8 || length > 128) return false;
  else return true;
}

export function isValidName(name: string | undefined): boolean {
  if (name === undefined) return true;

  const length = name.trim().length;
  return length >= 1 && length <= 100;
}

export function validateRegistration(data: RegistrationData): ValidationResult {
  const errors: string[] = [];
  if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!isValidPassword(data.password)) {
    if (!data.password) {
      errors.push("Password is required");
    } else if (data.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    } else if (data.password.length > 128) {
      errors.push("Password must be less than 128 characters");
    }
  }

  if (!isValidName(data.name)) {
    errors.push("Name must be between 1 and 100 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateLogin(data: LoginData): ValidationResult {
  const errors: string[] = [];

  if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!isValidPassword(data.password)) {
    if (!data.password) {
      errors.push("Password is required");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Form validation utilities for Ethiopian context

export const validators = {
  // Ethiopian phone: starts with 09 or 07, followed by 8 digits (total 10)
  phone: (value: string): string | null => {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned) return "Phone number is required";
    if (!/^(09|07)\d{8}$/.test(cleaned)) {
      return "Phone must start with 09 or 07 and have 10 digits (e.g., 0911234567)";
    }
    return null;
  },

  // Email must contain @
  email: (value: string): string | null => {
    if (!value) return "Email is required";
    if (!value.includes("@")) return "Email must contain @";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  // Name: at least 4 characters, letters and spaces only
  name: (value: string): string | null => {
    if (!value) return "Name is required";
    if (value.length < 4) return "Name must be at least 4 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return "Name can only contain letters and spaces";
    }
    return null;
  },

  // Badge: 5 characters minimum
  badge: (value: string): string | null => {
    if (!value) return "Badge number is required";
    if (value.length < 5) return "Badge must be at least 5 characters";
    return null;
  },

  // Required field
  required: (value: string, fieldName: string = "This field"): string | null => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    return null;
  },

  // Password: at least 6 characters
  password: (value: string): string | null => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  },

  // Confirm password
  confirmPassword: (password: string, confirm: string): string | null => {
    if (!confirm) return "Please confirm your password";
    if (password !== confirm) return "Passwords do not match";
    return null;
  },
};

// Validate entire form
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([field, validator]) => {
    const error = validator(data[field]);
    if (error) errors[field] = error;
  });

  return errors;
}

// Format Ethiopian phone for display
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

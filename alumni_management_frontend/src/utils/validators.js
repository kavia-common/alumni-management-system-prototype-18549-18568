export function required(value, label = "This field") {
  if (value == null || String(value).trim() === "") return `${label} is required`;
  return null;
}
export function minLen(value, len, label = "This field") {
  if (!value || String(value).length < len) return `${label} must be at least ${len} characters`;
  return null;
}
export function email(value, label = "Email") {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value || !re.test(String(value).toLowerCase())) return `${label} is invalid`;
  return null;
}
export function combine(...validators) {
  return (value, label) => {
    for (const v of validators) {
      const err = v(value, label);
      if (err) return err;
    }
    return null;
  };
}

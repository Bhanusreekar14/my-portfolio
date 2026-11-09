/**
 * Lightweight class name concatenation utility.
 * Supports strings, arrays, objects, and falsy values without external dependencies.
 */
export function cn(...inputs) {
  const classes = []

  for (let i = 0; i < inputs.length; i++) {
    const arg = inputs[i]
    if (!arg) continue

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(String(arg))
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cn(...arg)
        if (inner) classes.push(inner)
      }
    } else if (typeof arg === "object") {
      for (const key in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(" ")
}

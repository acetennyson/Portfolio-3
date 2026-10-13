export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Field = keyof ContactInput;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** One rule per field: [min length, max length, extra pattern, error text]. */
const RULES: Record<Field, { min: number; max: number; pattern?: RegExp; error: string }> = {
  name: { min: 2, max: 80, error: "Name must be 2 to 80 characters." },
  email: { min: 5, max: 160, pattern: EMAIL, error: "Enter a valid email address." },
  subject: { min: 3, max: 120, error: "Subject must be 3 to 120 characters." },
  message: { min: 10, max: 5000, error: "Message must be 10 to 5000 characters." },
};

// Header injection guard: names, emails and subjects must stay on one line.
const SINGLE_LINE: Field[] = ["name", "email", "subject"];
const hasLineBreak = (s: string) => /[\r\n]/.test(s);

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateContact(raw: unknown): {
  data: ContactInput;
  errors: Partial<Record<Field, string>>;
} {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const data = Object.fromEntries(
    (Object.keys(RULES) as Field[]).map((f) => [f, clean(src[f])])
  ) as unknown as ContactInput;

  const errors = Object.fromEntries(
    (Object.keys(RULES) as Field[])
      .filter((f) => {
        const { min, max, pattern } = RULES[f];
        const v = data[f];
        const lengthOk = v.length >= min && v.length <= max;
        const patternOk = !pattern || pattern.test(v);
        const lineOk = !SINGLE_LINE.includes(f) || !hasLineBreak(v);
        return !(lengthOk && patternOk && lineOk);
      })
      .map((f) => [f, RULES[f].error])
  ) as Partial<Record<Field, string>>;

  return { data, errors };
}

import z from "zod";

const signUpSchema = z.object({
  name: z.string().min(4, "Name must be of atleast 4 letters").trim(),
  email: z
    .email({
      pattern: z.regexes.html5Email,
      message: "Please enter a valid email address",
    })
    .trim(),
  password: z
    .string()
    .min(8, "Password must be of atleast 8 characters")
    .trim(),
});

const loginSchema = z.object({
  email: z
    .email({
      pattern: z.regexes.html5Email,
      message: "Please enter a valid email address",
    })
    .trim(),
  password: z
    .string()
    .min(8, "Password must be of atleast 8 characters")
    .trim(),
});

export { signUpSchema, loginSchema };

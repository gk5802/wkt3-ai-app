"use server";

export async function handleAuth(formData: {
  email: string;
  password: string;
  isLogin: boolean;
}) {
  const { email, password, isLogin } = formData;

  // Simulate DB check
  if (!email || !password) {
    return { success: false, message: "Missing credentials" };
  }

  // Simulate login/register logic
  if (isLogin) {
    console.log(`Logging in user: ${email}`);
    return { success: true, message: "Login successful" };
  } else {
    console.log(`Registering user: ${email}`);
    return { success: true, message: "Registration successful" };
  }
}

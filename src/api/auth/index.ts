import { action, json, redirect } from "@solidjs/router";
import { createAccount, login, validateLogin, validateSignin } from "./auth";
import { setAuth } from "../session";

export const loginAction = action(async (formData: FormData) => {
  "use server";
  let email = String(formData.get("email") || "");
  let password = String(formData.get("password") || "");

  let errors = validateLogin(email, password);
  if (errors) {
    return json({ ok: false, errors }, { status: 400 });
  }

  let userId = await login(email, password);
  if (userId === false) {
    return json(
      {
        ok: false,
        errors: { email: undefined, password: "Invalid credentials" },
      },
      { status: 400 }
    );
  }

  await setAuth(userId);
  return redirect("/home");
}, "login");

export const signupAction = action(async (formData: FormData) => {
  "use server";
  let email = String(formData.get("email") || "");
  let password = String(formData.get("password") || "");

  let errors = await validateSignin(email, password);
  if (errors) {
    console.log(errors);
    return json({ ok: false, errors }, { status: 400 });
  }

  let user = await createAccount(email, password);
  await setAuth(user.id);
  return redirect("/home");
}, "signup");

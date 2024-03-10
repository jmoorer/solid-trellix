import { action, cache, json, redirect } from "@solidjs/router";
import { createAccount, login, validateLogin, validateSignin } from "./auth";
import { getUserId, logout, setAuth } from "../session";
import { getRequestEvent } from "solid-js/web";

export const authCheck = cache(async () => {
  "use server";
  let auth = await getUserId();
  const request = getRequestEvent()?.request;
  if (auth && request && new URL(request.url).pathname === "/") {
    throw redirect("/home");
  }
  return auth;
}, "auth");

export const logoutAction = action(async (formData: FormData) => {
  "use server";
  await logout();
  return redirect("/");
}, "signup");

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
  try {
    await setAuth(userId);
    return redirect("/home");
  } catch (err) {
    console.log(err);
  }
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
  try {
    let user = await createAccount(email, password);
    await setAuth(user.id);
    return redirect("/home");
  } catch (error) {
    console.log("Failed to sign up", { email, password });
    console.error(error);
  }
}, "signup");

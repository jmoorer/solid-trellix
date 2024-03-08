import { A, action, json, redirect, useSubmission } from "@solidjs/router";
import { Component } from "solid-js";
import { login } from "~/api/auth";
import { setAuth } from "~/api/session";
import { validateLogin } from "~/api/validate";
import { Button } from "~/components/button";
import { Input, Label } from "~/components/input";

const loginAction = action(async (formData: FormData) => {
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

const LoginPage: Component<{}> = (props) => {
  const submission = useSubmission(loginAction);
  return (
    <div class="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          id="login-header"
          class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Log in
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form action={loginAction} class="space-y-6" method="post">
            <div>
              <Label for="email">
                Email address{" "}
                {submission.result?.errors?.email && (
                  <span id="email-error" class="text-brand-red">
                    {submission.result.errors.email}
                  </span>
                )}
              </Label>
              <Input
                autofocus
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                aria-describedby={
                  submission.result?.errors?.email
                    ? "email-error"
                    : "login-header"
                }
                required
              />
            </div>

            <div>
              <Label for="password">
                Password{" "}
                {submission.result?.errors?.password && (
                  <span id="password-error" class="text-brand-red">
                    {submission.result.errors.password}
                  </span>
                )}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                aria-describedby="password-error"
                required
              />
            </div>

            <div>
              <Button type="submit">Sign in</Button>
            </div>
            <div class="text-sm text-slate-500">
              Don't have an account?{" "}
              <A class="underline" href="/signup">
                Sign up
              </A>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

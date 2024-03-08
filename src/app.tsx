import { Link, MetaProvider, Title } from "@solidjs/meta";
import {
  A,
  RouteSectionProps,
  Router,
  action,
  cache,
  createAsync,
  redirect,
} from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Component, Show, Suspense } from "solid-js";
import "./app.css";
import { LoginIcon, LogoutIcon } from "./icons/icon";
import { getRequestEvent } from "solid-js/web";
import { getUserId, logout } from "./api/session";

const authCheck = cache(async () => {
  "use server";
  let auth = await getUserId();
  const request = getRequestEvent()?.request;
  if (auth && request && new URL(request.url).pathname === "/") {
    throw redirect("/home");
  }
  return auth;
}, "auth");

const logoutAction = action(async (formData: FormData) => {
  "use server";
  await logout();
  return redirect("/");
}, "signup");

export default function App() {
  return (
    <Router
      rootLoad={() => authCheck()}
      root={(props) => (
        <Suspense>
          <Layout {...props} />
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

const Layout: Component<RouteSectionProps> = (props) => {
  const userId = createAsync(() => authCheck(), { deferStream: false });
  return (
    <MetaProvider>
      <Title>SolidStart - Basic</Title>
      <div class="h-screen bg-slate-100 text-slate-900">
        <div class="h-full flex flex-col min-h-0">
          <div class="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border">
            <A href="/home" class="block leading-3 w-1/3">
              <div class="font-black text-2xl text-white">Trellix</div>
              <div class="text-slate-500">a Solid Demo</div>
            </A>
            <div class="flex items-center gap-6">
              <IconLink
                href="https://www.youtube.com/watch?v=RTHzZVbTl6c&list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&pp=gAQBiAQB"
                icon="/images/yt_icon_mono_dark.png"
                label="Videos"
              />
              <IconLink
                href="https://github.com/remix-run/example-trellix"
                label="Source"
                icon="/images/github-mark-white.png"
              />
              <IconLink
                href="https://start.solidjs.com"
                icon="/images/apple-touch-icon.png"
                label="Docs"
              />
            </div>
            <div class="w-1/3 flex justify-end">
              <Show
                when={userId()}
                fallback={
                  <A href="/login" class="block text-center">
                    <LoginIcon />
                    <br />
                    <span class="text-slate-500 text-xs uppercase font-bold">
                      Log in
                    </span>
                  </A>
                }
              >
                <form method="post" action={logoutAction}>
                  <button class="block text-center">
                    <LogoutIcon />
                    <br />
                    <span class="text-slate-500 text-xs uppercase font-bold">
                      Log out
                    </span>
                  </button>
                </form>
              </Show>
            </div>
          </div>

          <div class="flex-grow min-h-0 h-full">
            <Suspense>{props.children}</Suspense>
          </div>
        </div>
      </div>
    </MetaProvider>
  );
};

function IconLink({
  icon,
  href,
  label,
}: {
  icon: string;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      class="text-slate-500 text-xs uppercase font-bold text-center"
    >
      <img src={icon} aria-hidden class="inline-block h-8" />
      <span class="block mt-2">{label}</span>
    </a>
  );
}

import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import Counter from "~/components/Counter";

export default function Index() {
  return (
    <>
      <Title>Trellix, a Solid Demo</Title>
      <div class="h-full flex flex-col items-center pt-20 bg-slate-900">
        <img src="/images/logo.svg" class="h-40 w-96" />
        <div class="space-y-4 max-w-md text-lg text-slate-300">
          <p>
            This is a demo app to show off the features of Solid Start and is
            based on videos by the Remix Team published on{" "}
            <a
              href="https://www.youtube.com/watch?v=RTHzZVbTl6c&list=PLXoynULbYuED9b2k5LS44v9TQjfXifwNu&pp=gAQBiAQB"
              class="underline"
            >
              YouTube
            </a>
            .
          </p>
          <p>
            It's a recreation of the popular drag and drop interface in{" "}
            <a href="https://trello.com" class="underline">
              Trello
            </a>
            and other similar apps.
          </p>
          <p>If you want to play around, click sign up!</p>
        </div>
        <div class="flex w-full justify-evenly max-w-md mt-8 rounded-3xl p-10 bg-slate-800">
          <A
            href="/signup"
            class="text-xl font-medium text-brand-aqua underline"
          >
            Sign up
          </A>
          <div class="h-full border-r border-slate-500" />
          <A
            href="/login"
            class="text-xl font-medium text-brand-aqua underline"
          >
            Login
          </A>
        </div>
      </div>
    </>
  );
}

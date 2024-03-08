import { Component, JSX } from "solid-js";

export let Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  return (
    <button
      {...props}
      class="flex w-full justify-center rounded-md bg-brand-blue px-1 py-1 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
    />
  );
};

import { Component, JSX, createUniqueId } from "solid-js";

export let Input: Component<JSX.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      {...props}
      class="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-blue sm:text-sm sm:leading-6"
    />
  );
};

export let Label: Component<JSX.LabelHTMLAttributes<HTMLLabelElement>> = (
  props
) => {
  return (
    <label
      {...props}
      class="block text-sm font-medium leading-6 text-gray-900"
    />
  );
};

export let LabeledInput: Component<
  JSX.InputHTMLAttributes<HTMLInputElement> & {
    label: JSX.Element;
    id?: string;
  }
> = ({ id, label, ...props }) => {
  let uid = createUniqueId();
  id = id ?? uid;
  return (
    <>
      <Label for={id}>{label}</Label>
      <div class="mt-2">
        <Input {...props} id={id} />
      </div>
    </>
  );
};

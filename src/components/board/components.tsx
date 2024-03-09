import { Action, useSubmission } from "@solidjs/router";
import { Component, JSX, ParentComponent, Show, createSignal } from "solid-js";

export const SaveButton: Component<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  return (
    <button
      tabIndex={0}
      {...props}
      class="text-sm rounded-lg text-left p-2 font-medium text-white bg-brand-blue"
    />
  );
};

export const CancelButton: Component<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  return (
    <button
      type="button"
      tabIndex={0}
      {...props}
      class="text-sm rounded-lg text-left p-2 font-medium hover:bg-slate-200 focus:bg-slate-200"
    />
  );
};

export const EditableText: ParentComponent<{
  fieldName: string;
  value: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName: string;
  buttonLabel: string;
  action: Action<[form: FormData], void>;
}> = (props) => {
  // let fetcher = useFetcher();
  const submission = useSubmission(props.action);
  let [edit, setEdit] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;
  let buttonRef: HTMLButtonElement | undefined;

  // optimistic update
  const currentValue = () => {
    if (submission.input) {
      const [form] = submission.input;
      if (form.has("name")) {
        return String(form.get("name"));
      }
    }

    return props.value;
  };

  return (
    <Show
      when={edit()}
      fallback={
        <button
          aria-label={props.buttonLabel}
          type="button"
          ref={buttonRef}
          onClick={() => {
            setEdit(true);

            inputRef?.select();
          }}
          class={props.buttonClassName}
        >
          {currentValue() || <span class="text-slate-400 italic">Edit</span>}
        </button>
      }
    >
      <form
        action={props.action}
        method="post"
        onSubmit={() => {
          setTimeout(() => {
            setEdit(false);
            buttonRef?.focus();
          });
        }}
      >
        {props.children}
        <input
          required
          ref={inputRef}
          type="text"
          aria-label={props.inputLabel}
          name={props.fieldName}
          value={currentValue()}
          class={props.inputClassName}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setEdit(false);

              buttonRef?.focus();
            }
          }}
          onBlur={(event) => {
            if (
              inputRef?.value !== props.value &&
              inputRef?.value.trim() !== ""
            ) {
              event.currentTarget.form?.requestSubmit();
            }
            setEdit(false);
          }}
        />
      </form>
    </Show>
  );
};

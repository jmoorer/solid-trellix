import { Component, ParentComponent, Show, createSignal } from "solid-js";
import { useSubmission, Action } from "@solidjs/router";

export const EditableText: ParentComponent<{
  fieldName: string;
  value: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName: string;
  buttonLabel: string;
  action: Action<[id: string, form: FormData], void>;
  id: string;
}> = (props) => {
  // let fetcher = useFetcher();
  const submission = useSubmission(props.action, ([_id]) => _id === props.id);
  let [edit, setEdit] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;
  let buttonRef: HTMLButtonElement | undefined;

  // optimistic update
  const currentValue = () => {
    if (submission.input) {
      const [_, form] = submission.input;
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
        action={props.action.with(props.id)}
        method="post"
        onSubmit={() => {
          setTimeout(() => {
            setEdit(false);
            buttonRef?.focus();
          });
        }}
      >
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

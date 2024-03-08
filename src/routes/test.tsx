import { action, A, useSubmission } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { EditableText } from "~/components/EditableText";

const createBoardAction = action(async (id, formData: FormData) => {
  "use server";
  await new Promise<void>((res) => setTimeout(res, 2000));
}, "createBoard");
const test: Component<{}> = (props) => {
  const submission = useSubmission(createBoardAction);
  let buttonRef: HTMLButtonElement | undefined;
  let formRef: HTMLFormElement | undefined;

  return (
    <div>
      Go
      {/* <EditableText
        action={createBoardAction}
        value={""}
        fieldName="name"
        inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
        buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
        buttonLabel={`Edit board  name`}
        inputLabel="Edit board name"
      ></EditableText> */}
      <Show when={submission.pending}>Sending...</Show>
      <form ref={formRef} action={createBoardAction.with(7)} method="post">
        <button ref={buttonRef} type="submit">
          Send
        </button>

        <input
          onBlur={(event) => {
            // if (inputRef?.value !== value && inputRef?.value.trim() !== "") {
            event.target.form?.requestSubmit();
            // }
            // setEdit(false);
            // buttonRef?.click();
            // formRef?.requestSubmit();
          }}
        />
      </form>
    </div>
  );
};

export default test;

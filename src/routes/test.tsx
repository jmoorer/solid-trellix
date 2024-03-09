import { action, A, useSubmission, useSubmissions } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { EditableText } from "~/components/board/components";

const createBoardAction = action(async (formData: FormData) => {
  "use server";
  console.log("printing form data");
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }
  console.log("end form data");
  await new Promise<void>((res) => setTimeout(res, 2000));
}, "createBoard");
const test: Component<{}> = (props) => {
  const id = 8;
  const formAction = createBoardAction; //.with(id);
  const submission = useSubmissions(formAction);
  let buttonRef: HTMLButtonElement | undefined;
  let formRef: HTMLFormElement | undefined;

  return (
    <div>
      Go
      <EditableText
        action={createBoardAction}
        value={""}
        fieldName="name"
        inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
        buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
        buttonLabel={`Edit board  name`}
        inputLabel="Edit board name"
      >
        <input type="hidden" name="id" value={9} />
      </EditableText>
      <Show when={submission.pending}>Sending...</Show>
      {/* <form ref={formRef} action={formAction} method="post">
        <button ref={buttonRef} type="submit">
          Send
        </button>
        <input name="id" value={9} />
        <input
          name="name"
          onBlur={(event) => {
            // if (inputRef?.value !== value && inputRef?.value.trim() !== "") {
            event.target.form?.requestSubmit();
            // }
            // setEdit(false);
            // buttonRef?.click();
            // formRef?.requestSubmit();
          }}
        />
      </form> */}
    </div>
  );
};

export default test;

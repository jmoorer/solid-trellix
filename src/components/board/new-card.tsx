import invariant from "tiny-invariant";
import { SaveButton, CancelButton } from "./components";
import { ItemMutationFields, INTENTS } from "~/types";
import { assertIsNode } from "~/utils";
import { createItemAction } from "~/api/board";
import { useParams } from "@solidjs/router";

export function NewCard(props: {
  columnId: string;
  nextOrder: number;
  onComplete: () => void;
  onAddCard: () => void;
}) {
  let textAreaRef: HTMLTextAreaElement | undefined;
  let buttonRef: HTMLButtonElement | undefined;
  let inputIdRef: HTMLInputElement | undefined;

  const params = useParams();
  const boardId = () => Number(params.id);

  return (
    <form
      action={createItemAction.with(boardId())}
      method="post"
      class="px-2 py-1 border-t-2 border-b-2 border-transparent"
      onSubmit={() => {
        invariant(textAreaRef);
        invariant(inputIdRef, "missing id ref");
        setTimeout(() => {
          textAreaRef.value = "";
          inputIdRef.value = crypto.randomUUID();
        });
        props.onAddCard();
      }}
      onBlur={(event) => {
        assertIsNode(event.relatedTarget);
        if (!event.currentTarget.contains(event.relatedTarget)) {
          props.onComplete();
        }
      }}
    >
      <input
        ref={inputIdRef}
        type="hidden"
        name="id"
        value={crypto.randomUUID()}
      />
      <input
        type="hidden"
        name={ItemMutationFields.columnId.name}
        value={props.columnId}
      />
      <input
        type="hidden"
        name={ItemMutationFields.order.name}
        value={props.nextOrder}
      />

      <textarea
        autofocus
        required
        ref={textAreaRef}
        name={ItemMutationFields.title.name}
        placeholder="Enter a title for this card"
        class="outline-none shadow text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            invariant(buttonRef, "expected button ref");
            buttonRef.click();
          }
          if (event.key === "Escape") {
            props.onComplete();
          }
        }}
        onChange={(event) => {
          let el = event.currentTarget;
          el.style.height = el.scrollHeight + "px";
        }}
      />
      <div class="flex justify-between">
        <SaveButton ref={buttonRef}>Save Card</SaveButton>
        <CancelButton onClick={props.onComplete}>Cancel</CancelButton>
      </div>
    </form>
  );
}

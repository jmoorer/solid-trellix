import invariant from "tiny-invariant";
import { Icon } from "~/icons/icon";

import { CancelButton, SaveButton } from "./components";
import { Show, createSignal } from "solid-js";
import { INTENTS } from "~/types";
import { createColumnAction } from "~/api/board";
import { assertIsNode } from "~/utils";

export function NewColumn({
  boardId,
  onAdd,
  editInitially,
}: {
  boardId: number;
  onAdd: () => void;
  editInitially: boolean;
}) {
  let [editing, setEditing] = createSignal(editInitially);
  let inputRef: HTMLInputElement | undefined;

  let inputIdRef: HTMLInputElement | undefined;
  return (
    <Show
      when={editing()}
      fallback={
        <button
          onClick={() => {
            setTimeout(() => {
              setEditing(true);
            });
            onAdd();
          }}
          aria-label="Add new column"
          class="flex-shrink-0 flex justify-center h-16 w-16 bg-black hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-xl"
        >
          <Icon name="plus" size="xl" />
        </button>
      }
    >
      <form
        action={createColumnAction.with(boardId)}
        method="post"
        class="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-80 border rounded-xl shadow bg-slate-100"
        onSubmit={() => {
          onAdd();
          invariant(inputRef, "missing input ref");
          invariant(inputIdRef, "missing id ref");
          setTimeout(() => {
            inputRef.value = "";
            inputIdRef.value = crypto.randomUUID();
          });
          return true;
        }}
        onBlur={(event) => {
          assertIsNode(event.relatedTarget);
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setEditing(false);
          }
        }}
      >
        <input type="hidden" name="boardId" value={boardId} />
        <input
          ref={inputIdRef}
          type="hidden"
          name="id"
          value={crypto.randomUUID()}
        />
        <input
          autofocus
          required
          ref={inputRef}
          type="text"
          name="name"
          class="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
        />
        <div class="flex justify-between">
          <SaveButton>Save Column</SaveButton>
          <CancelButton onClick={() => setEditing(false)}>Cancel</CancelButton>
        </div>
      </form>
    </Show>
  );
}

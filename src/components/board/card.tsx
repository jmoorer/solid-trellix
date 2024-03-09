import { useSubmission } from "@solidjs/router";
import { Show, createSignal } from "solid-js";
import invariant from "tiny-invariant";
import { deleteCardAction, deleteItemAction } from "~/api/board";

import { Icon } from "~/icons/icon";
import { CONTENT_TYPES, ItemMutation, INTENTS } from "~/types";
import { deleteItem } from "../../api/board/board";

interface CardProps {
  title: string;
  content: string | null;
  id: string;
  columnId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
}

export function Card({
  title,
  content,
  id,
  columnId,
  order,
  nextOrder,
  previousOrder,
}: CardProps) {
  const deleteSubmission = useSubmission(
    deleteItemAction,
    ([_id]) => _id === id
  );
  let [acceptDrop, setAcceptDrop] = createSignal<"none" | "top" | "bottom">(
    "none"
  );

  let isDeleting = () => deleteSubmission.pending || deleteSubmission.result;

  return (
    <Show when={!isDeleting()}>
      <li
        onDragOver={(event) => {
          invariant(event.dataTransfer);
          if (event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
            event.preventDefault();
            event.stopPropagation();
            let rect = event.currentTarget.getBoundingClientRect();
            let midpoint = (rect.top + rect.bottom) / 2;
            setAcceptDrop(event.clientY <= midpoint ? "top" : "bottom");
          }
        }}
        onDragLeave={() => {
          setAcceptDrop("none");
        }}
        onDrop={(event) => {
          event.stopPropagation();
          invariant(event.dataTransfer);
          let transfer = JSON.parse(
            event.dataTransfer.getData(CONTENT_TYPES.card)
          );
          invariant(transfer.id, "missing cardId");
          invariant(transfer.title, "missing title");

          let droppedOrder = acceptDrop() === "top" ? previousOrder : nextOrder;
          let moveOrder = (droppedOrder + order) / 2;

          let mutation: ItemMutation = {
            order: moveOrder,
            columnId: columnId,
            id: transfer.id,
            title: transfer.title,
          };

          //   submit(
          //     { ...mutation, intent: INTENTS.moveItem },
          //     {
          //       method: "post",
          //       navigate: false,
          //       fetcherKey: `card:${transfer.id}`,
          //     }
          //   );

          setAcceptDrop("none");
        }}
        class={
          "border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 border-t-transparent border-b-transparent "
        }
        classList={{
          "border-t-brand-red border-b-transparent": acceptDrop() === "top",
          "border-b-brand-red border-t-transparent": acceptDrop() === "bottom",
        }}
      >
        <div
          draggable
          class="bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative"
          onDragStart={(event) => {
            invariant(event.dataTransfer);
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData(
              CONTENT_TYPES.card,
              JSON.stringify({ id, title })
            );
          }}
        >
          <h3>{title}</h3>
          <div class="mt-2">{content || <>&nbsp;</>}</div>
          <form action={deleteItemAction.with(id)} method="post">
            <button
              aria-label="Delete card"
              class="absolute top-4 right-4 hover:text-brand-red"
              type="submit"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <Icon name="trash" />
            </button>
          </form>
        </div>
      </li>
    </Show>
  );
}

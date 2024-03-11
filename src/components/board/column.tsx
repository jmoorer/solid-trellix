import invariant from "tiny-invariant";

import { Icon } from "~/icons/icon";

import { NewCard } from "./new-card";

import { Card } from "./card";
import { EditableText } from "./components";
import { RenderedItem, CONTENT_TYPES, ItemMutation, INTENTS } from "~/types";
import { For, Index, Show, createSignal } from "solid-js";
import {
  deleteItemAction,
  moveItemAction,
  updateColumnAction,
} from "~/api/board";
import { useSubmissions, useParams, useAction } from "@solidjs/router";

interface ColumnProps {
  name: string;
  columnId: string;
  items: RenderedItem[];
}

export function Column(props: ColumnProps) {
  let [acceptDrop, setAcceptDrop] = createSignal(false);
  let [edit, setEdit] = createSignal(false);
  let listRef: HTMLUListElement | undefined;

  function scrollList() {
    invariant(listRef);
    listRef.scrollTop = listRef.scrollHeight;
  }
  const sortedItems = () => props.items.sort((a, b) => a.order - b.order);

  const params = useParams();
  const boardId = () => Number(params.id);
  const moveItem = useAction(moveItemAction);

  return (
    <div
      class={
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100 "
      }
      classList={{
        "outline outline-2 outline-brand-red": acceptDrop(),
      }}
      onDragOver={(event) => {
        if (
          props.items.length === 0 &&
          event.dataTransfer?.types.includes(CONTENT_TYPES.card)
        ) {
          event.preventDefault();
          setAcceptDrop(true);
        }
      }}
      onDragLeave={() => {
        setAcceptDrop(false);
      }}
      onDrop={(event) => {
        invariant(event.dataTransfer);
        let transfer = JSON.parse(
          event.dataTransfer?.getData(CONTENT_TYPES.card)
        );
        invariant(transfer.id, "missing transfer.id");
        invariant(transfer.title, "missing transfer.title");

        let mutation: ItemMutation = {
          order: 1,
          columnId: props.columnId,
          id: transfer.id,
          title: transfer.title,
        };
        moveItem(boardId(), mutation);

        setAcceptDrop(false);
      }}
    >
      <div class="p-2">
        <EditableText
          action={updateColumnAction}
          fieldName="name"
          value={props.name}
          inputLabel="Edit column name"
          buttonLabel={`Edit column "${props.name}" name`}
          inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
          buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
        >
          <input type="hidden" name="intent" value={INTENTS.updateColumn} />
          <input type="hidden" name="columnId" value={props.columnId} />
        </EditableText>
      </div>

      <ul ref={listRef} class="flex-grow overflow-auto">
        <For each={sortedItems()}>
          {(item, idx) => {
            const items = sortedItems();
            const previousOrder = props.items[idx() - 1]
              ? props.items[idx() - 1].order
              : 0;
            const nextOrder = items[idx() + 1]
              ? items[idx() + 1].order
              : item.order + 1;

            return (
              <Card
                title={item.title}
                content={item.content}
                id={item.id}
                order={item.order}
                columnId={props.columnId}
                previousOrder={previousOrder}
                nextOrder={nextOrder}
              />
            );
          }}
        </For>
      </ul>
      <Show
        when={edit()}
        fallback={
          <div class="p-2">
            <button
              type="button"
              onClick={() => {
                setEdit(true);
                setTimeout(() => scrollList());
              }}
              class="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
            >
              <Icon name="plus" /> Add a card
            </button>
          </div>
        }
      >
        <NewCard
          columnId={props.columnId}
          nextOrder={
            props.items.length === 0
              ? 1
              : props.items[props.items.length - 1].order + 1
          }
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      </Show>
    </div>
  );
}

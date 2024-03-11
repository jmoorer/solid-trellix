import {
  RouteDefinition,
  RouteSectionProps,
  createAsync,
  createAsyncStore,
  useSubmissions,
} from "@solidjs/router";
import { Component, For, Index, Show, createEffect } from "solid-js";
import invariant from "tiny-invariant";
import {
  createColumnAction,
  createItemAction,
  getBoard,
  moveItemAction,
  updateBoardNameAction,
} from "~/api/board";
import { EditableText } from "~/components/board/components";
import { Column } from "~/components/board/column";
import { NewColumn } from "~/components/board/new-column";
import { printFormData } from "~/utils";
import { RenderedItem } from "~/types";

export const route = {
  load({ params }) {
    getBoard(+params.id);
  },
} satisfies RouteDefinition;

type Column =
  | { id: string; name: string; order: number; boardId: number }
  | { name: string; id: string };
type ColumnWithItems = Column & {
  items: {
    id: string;
    title: string;
    content: string | null;
    order: number;
    columnId: string;
    boardId: number;
  }[];
};
const Board: Component<RouteSectionProps> = (props) => {
  const board = createAsyncStore(() => getBoard(+props.params.id));
  let scrollContainerRef: HTMLDivElement | undefined;
  function scrollRight() {
    invariant(scrollContainerRef, "no scroll container");
    scrollContainerRef.scrollLeft = scrollContainerRef.scrollWidth;
  }
  let pendingItems = usePendingItems();
  const addingColumns = usePendingColumns();

  return (
    <Show when={board()}>
      {(board) => {
        const columns = () => {
          let itemsById = new Map(board().items.map((item) => [item.id, item]));

          for (let pendingItem of pendingItems()) {
            let item = itemsById.get(pendingItem.id);
            let merged = item
              ? { ...item, ...pendingItem }
              : { ...pendingItem, boardId: board().id };
            itemsById.set(pendingItem.id, merged);
          }
          let columns = new Map<string, ColumnWithItems>();
          for (let column of [...board().columns, ...addingColumns()]) {
            columns.set(column.id, { ...column, items: [] });
          }
          for (let item of itemsById.values()) {
            let columnId = item.columnId;
            let column = columns.get(columnId);
            invariant(column, "missing column");
            column.items.push(item);
          }
          return [...columns.values()];
        };

        return (
          <div
            class="h-full min-h-0 flex flex-col overflow-x-scroll"
            ref={scrollContainerRef}
            style={{ background: board().color }}
          >
            <h1>
              <EditableText
                action={updateBoardNameAction}
                value={board().name}
                fieldName="name"
                inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
                buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
                buttonLabel={`Edit board "${board().name}" name`}
                inputLabel="Edit board name"
              >
                <input name="id" value={board().id} type="hidden" />
              </EditableText>
            </h1>

            <div class="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
              <Index each={columns()}>
                {(col) => (
                  <Column
                    name={col().name}
                    columnId={col().id}
                    items={col().items}
                  />
                )}
              </Index>

              <NewColumn
                boardId={board().id}
                onAdd={scrollRight}
                editInitially={board().columns.length === 0}
              />

              {/* trolling you to add some extra margin to the right of the container with a whole dang div */}
              <div data-lol class="w-8 h-1 flex-shrink-0" />
            </div>
          </div>
        );
      }}
    </Show>
  );
};

function usePendingColumns() {
  const subs = useSubmissions(createColumnAction);
  return () => {
    return [...subs].map(({ input: [_, formData] }) => {
      let name = String(formData.get("name"));
      let id = String(formData.get("id"));
      return { name, id };
    });
  };
}

function usePendingItems() {
  const pendingCreate = useSubmissions(createItemAction);
  const pendingMove = useSubmissions(moveItemAction);
  return () => [
    ...Array.from(pendingCreate).map(({ input: [, formData] }) => {
      let columnId = String(formData.get("columnId"));
      let title = String(formData.get("title"));
      let id = String(formData.get("id"));
      let order = Number(formData.get("order"));
      let item: RenderedItem = { title, id, order, columnId, content: null };
      return item;
    }),
    ...Array.from(pendingMove).map<RenderedItem>(({ input: [, data] }) => ({
      ...data,
      content: null,
    })),
  ];
}
export default Board;

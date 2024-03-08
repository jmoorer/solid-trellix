import {
  RouteDefinition,
  RouteSectionProps,
  action,
  cache,
  createAsync,
} from "@solidjs/router";
import { Component, Show } from "solid-js";
import { requireUserId } from "~/api/session";
import invariant from "tiny-invariant";
import { notFound } from "~/http/bad-request";
import { getBoardData, updateBoardName } from "~/api/board";
import { EditableText } from "~/components/EditableText";

const getBoard = cache(async (_id: string) => {
  "use server";
  let accountId = await requireUserId();

  invariant(_id, "Missing board ID");
  let id = Number(_id);

  let board = await getBoardData(id, accountId);
  if (!board) throw notFound();

  return board;
}, "getBoard");

const updateBoardNameAction = action(async (id: string, formData: FormData) => {
  "use server";
  try {
    let accountId = await requireUserId();
    let boardId = Number(id || "");
    let name = String(formData.get("name") || "");
    invariant(name, "Missing name");
    invariant(boardId, "Missing boardId");
    await updateBoardName(boardId, name, accountId);
  } catch (error) {
    console.log(error, "=>", formData.get("id"));
  }
}, "updateBoardName");

export const route = {
  load({ params }) {
    getBoard(params.id);
  },
} satisfies RouteDefinition;

const Board: Component<RouteSectionProps> = (props) => {
  const board = createAsync(() => getBoard(props.params.id));
  let scrollContainerRef: HTMLDivElement | undefined;
  function scrollRight() {
    invariant(scrollContainerRef, "no scroll container");
    scrollContainerRef.scrollLeft = scrollContainerRef.scrollWidth;
  }
  return (
    <Show when={board()}>
      {(board) => (
        <div
          class="h-full min-h-0 flex flex-col overflow-x-scroll"
          ref={scrollContainerRef}
          style={{ background: board().color }}
        >
          <h1>
            <EditableText
              id={`${board().id}`}
              action={updateBoardNameAction}
              value={board().name}
              fieldName="name"
              inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
              buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
              buttonLabel={`Edit board "${board().name}" name`}
              inputLabel="Edit board name"
            />
          </h1>

          <div class="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
            {/* {[...columns.values()].map((col) => {
              return (
                <Column
                  key={col.id}
                  name={col.name}
                  columnId={col.id}
                  items={col.items}
                />
              );
            })} */}

            {/* <NewColumn
                          boardId={board.id}
                          onAdd={scrollRight}
                          editInitially={board.columns.length === 0}
                      /> */}

            {/* trolling you to add some extra margin to the right of the container with a whole dang div */}
            <div data-lol class="w-8 h-1 flex-shrink-0" />
          </div>
        </div>
      )}
    </Show>
  );
};

export default Board;

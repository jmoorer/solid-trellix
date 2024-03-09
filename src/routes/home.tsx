import {
  A,
  RouteDefinition,
  createAsync,
  createAsyncStore,
  useSubmission,
} from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { createBoardAction, deleteBoardAction, getBoards } from "~/api/board";
import { Button } from "~/components/button";
import { Label, LabeledInput } from "~/components/input";
import { Icon } from "~/icons/icon";

export const route = {
  load({ params }) {
    getBoards();
  },
} satisfies RouteDefinition;

const Home: Component<{}> = (props) => {
  return (
    <div class="h-full">
      <NewBoard />
      <Boards />
    </div>
  );
};

function Boards() {
  let boards = createAsyncStore(() => getBoards(), { deferStream: true });
  return (
    <div class="p-8">
      <h2 class="font-bold mb-2 text-xl">Boards</h2>
      <nav class="flex flex-wrap gap-8">
        <For each={boards()}>
          {(board) => (
            <Board name={board.name} id={board.id} color={board.color} />
          )}
        </For>
      </nav>
    </div>
  );
}

function Board({
  name,
  id,
  color,
}: {
  name: string;
  id: number;
  color: string;
}) {
  const submission = useSubmission(deleteBoardAction, ([_id]) => _id === id);
  let isDeleting = () => submission.pending || submission.result;
  return (
    <Show when={!isDeleting()}>
      <div class="relative">
        <a
          href={`/board/${id}`}
          class="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white "
          style={{ "border-color": color }}
        >
          <div class="font-bold">{name}</div>
        </a>
        <form action={deleteBoardAction.with(id)} method="post">
          <button
            aria-label="Delete board"
            class="absolute top-4 right-4 hover:text-brand-red"
            type="submit"
            onClick={(event) => {
              event.stopPropagation();
              return false;
            }}
          >
            <Icon name="trash" />
          </button>
        </form>
      </div>
    </Show>
  );
}

function NewBoard() {
  let submission = useSubmission(createBoardAction);
  let isCreating = () => submission.pending;

  return (
    <form action={createBoardAction} method="post" class="p-8 max-w-md">
      <input type="hidden" name="intent" value="createBoard" />
      <div>
        <h2 class="font-bold mb-2 text-xl">New Board</h2>
        <LabeledInput label="Name" name="name" type="text" required />
      </div>

      <div class="mt-4 flex items-center gap-4">
        <div class="flex items-center gap-1">
          <Label for="board-color">Color</Label>
          <input
            id="board-color"
            name="color"
            type="color"
            value="#cbd5e1"
            class="bg-transparent"
          />
        </div>

        <Button type="submit">
          <Show when={isCreating()} fallback="Create">
            {"Creating..."}
          </Show>
        </Button>
      </div>
    </form>
  );
}
export default Home;

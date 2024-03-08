import {
  A,
  action,
  cache,
  createAsync,
  redirect,
  revalidate,
  useSubmission,
} from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { createBoard, getHomeData } from "~/api/board-list";
import { getUserId, requireUserId } from "~/api/session";
import { Button } from "~/components/button";
import { Label, LabeledInput } from "~/components/input";
import { badRequest } from "~/http/bad-request";
import { Icon } from "~/icons/icon";

const getBoards = cache(async () => {
  "use server";
  let userId = await requireUserId();
  let boards = await getHomeData(userId);
  return boards;
}, "boards");
const deleteBoard = action(async () => {}, "deleteBoard");

const createBoardAction = action(async (formData: FormData) => {
  "use server";
  let accountId = await requireUserId();
  let name = String(formData.get("name") || "");
  let color = String(formData.get("color") || "");
  if (!name) throw badRequest("Bad request");
  let board = await createBoard(accountId, name, color);
  revalidate(getBoards.key);
  return redirect(`/board/${board.id}`);
}, "createBoard");

const Home: Component<{}> = (props) => {
  return (
    <div class="h-full">
      <NewBoard />
      <Boards />
    </div>
  );
};

function Boards() {
  let boards = createAsync(() => getBoards(), { deferStream: true });
  return (
    <div class="p-8">
      <h2 class="font-bold mb-2 text-xl">Boards</h2>
      <nav class="flex flex-wrap gap-8">
        <For each={boards() ?? []}>
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
  // let fetcher = useFetcher();
  const submission = useSubmission(deleteBoard);
  let isDeleting = submission.pending;
  return isDeleting ? null : (
    <A
      href={`/board/${id}`}
      class="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
      style={{ "border-color": color }}
    >
      <div class="font-bold">{name}</div>
      <form method="post">
        <input type="hidden" name="boardId" value={id} />
        <button
          aria-label="Delete board"
          class="absolute top-4 right-4 hover:text-brand-red"
          type="submit"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Icon name="trash" />
        </button>
      </form>
    </A>
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

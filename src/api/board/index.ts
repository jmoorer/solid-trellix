import { action, cache, redirect, revalidate } from "@solidjs/router";
import { badRequest, notFound } from "~/http/bad-request";
import { requireAuth } from "../session";
import {
  createBoard,
  createColumn,
  deleteBoard,
  deleteItem,
  getBoardData,
  getHomeData,
  updateBoardName,
  updateColumnName,
  upsertItem,
} from "./board";
import invariant from "tiny-invariant";
import { ItemMutation, ItemMutationFields } from "~/types";

export const getBoards = cache(async () => {
  "use server";
  let userId = await requireAuth();
  let boards = await getHomeData(userId);
  return boards;
}, "boards");

export const deleteBoardAction = action(async (boardId: number) => {
  "use server";
  let accountId = await requireAuth();
  if (!boardId) throw badRequest("Missing boardId");
  await deleteBoard(Number(boardId), accountId);
  return { ok: true };
}, "deleteBoard");

export const createBoardAction = action(async (formData: FormData) => {
  "use server";
  let accountId = await requireAuth();
  let name = String(formData.get("name") || "");
  let color = String(formData.get("color") || "");
  if (!name) throw badRequest("Bad request");
  let board = await createBoard(accountId, name, color);
  revalidate(getBoards.key);
  return redirect(`/board/${board.id}`);
}, "createBoard");

export const getBoard = cache(async (id: number) => {
  "use server";
  let accountId = await requireAuth();

  invariant(id, "Missing board ID");

  let board = await getBoardData(id, accountId);
  if (!board) throw notFound();

  return board;
}, "getBoard");

export const updateBoardNameAction = action(async (formData: FormData) => {
  "use server";
  try {
    let accountId = await requireAuth();
    let boardId = Number(formData.get("id") || "");
    let name = String(formData.get("name") || "");
    invariant(name, "Missing name");
    invariant(boardId, "Missing boardId");
    await updateBoardName(boardId, name, accountId);
  } catch (error) {
    console.log(error, "=>", formData.get("id"));
  }
}, "updateBoardName");

export const deleteCardAction = action(
  async (id: string, formData: FormData) => {
    "use server";
    // try {
    //   let accountId = await requireAuth();
    //   let boardId = Number(id || "");
    //   let name = String(formData.get("name") || "");
    //   invariant(name, "Missing name");
    //   invariant(boardId, "Missing boardId");
    //   await updateBoardName(boardId, name, accountId);
    // } catch (error) {
    //   console.log(error, "=>", formData.get("id"));
    // }
  },
  "updateBoardName"
);

export const updateColumnAction = action(async (formData: FormData) => {
  "use server";
  let accountId = await requireAuth();
  let { name, columnId } = Object.fromEntries(formData);
  if (!name || !columnId) throw badRequest("Missing name or columnId");
  await updateColumnName(String(columnId), String(name), accountId);
});

export const createColumnAction = action(
  async (boardId: number, formData: FormData) => {
    "use server";
    try {
      let accountId = await requireAuth();
      let { name, id } = Object.fromEntries(formData);
      invariant(boardId, "Missing boardId");
      invariant(name, "Missing name");
      invariant(id, "Missing id");
      await createColumn(boardId, String(name), String(id), accountId);
    } catch (error) {
      console.log({ error });
    }
  }
);

export const createItemAction = action(
  async (boardId: number, formData: FormData) => {
    "use server";
    try {
      invariant(boardId, "Missing boardId");
      let accountId = await requireAuth();
      let mutation = parseItemMutation(formData);
      await upsertItem({ ...mutation, boardId }, accountId);
    } catch (error) {
      console.log({ error });
    }
  }
);
export const moveItemAction = action(
  async (boardId: number, formData: FormData) => {
    "use server";
    let accountId = await requireAuth();
    let mutation = parseItemMutation(formData);
    await upsertItem({ ...mutation, boardId }, accountId);
  }
);

export const deleteItemAction = action(
  async (itemId: string, formData: FormData) => {
    "use server";
    try {
      let accountId = await requireAuth();
      console.log({ itemId });
      await deleteItem(itemId, accountId);
    } catch (error) {
      console.log(error);
    }
  }
);

function parseItemMutation(formData: FormData): ItemMutation {
  let id = ItemMutationFields.id.type(formData.get("id"));
  invariant(id, "Missing item id");

  let columnId = ItemMutationFields.columnId.type(formData.get("columnId"));
  invariant(columnId, "Missing column id");

  let order = ItemMutationFields.order.type(formData.get("order"));
  invariant(typeof order === "number", "Missing order");

  let title = ItemMutationFields.title.type(formData.get("title"));
  invariant(title, "Missing title");

  return { id, columnId, order, title };
}

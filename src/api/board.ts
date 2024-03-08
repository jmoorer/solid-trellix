"use server";

import { prisma } from "~/db/prisma";

export function deleteCard(id: string, accountId: string) {
  return prisma.item.delete({ where: { id, Board: { accountId } } });
}

export async function getBoardData(boardId: number, accountId: string) {
  return prisma.board.findUnique({
    where: {
      id: boardId,
      accountId: accountId,
    },
    include: {
      items: true,
      columns: { orderBy: { order: "asc" } },
    },
  });
}

export async function updateBoardName(
  boardId: number,
  name: string,
  accountId: string
) {
  return prisma.board.update({
    where: { id: boardId, accountId: accountId },
    data: { name },
  });
}

"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";

type User = {
  uid?: string;
};
export function getSession() {
  return useSession<User>({
    password:
      process.env.SESSION_SECRET ??
      "zb9c0/GcaU8EewcGj4IIp09iHjfpGiFyS325m2PPLyEBL6V0FJLTlZfioeNndUfa",
  });
}

export async function getUserId() {
  const session = await getSession();
  const userId = session.data.uid;
  if (!userId) return null;
  return userId;
}

export async function requireUserId() {
  let userId = await getUserId();
  if (!userId) {
    await logout();
    throw redirect("/login");
  }
  return userId;
}
export async function logout() {
  const session = await getSession();
  await session.update((d) => (d.uid = undefined));
}

export async function setAuth(userId: string): Promise<any> {
  const session = await getSession();
  await session.update((user) => ((user.uid = userId), user));
}

"use server";
import { action, json, redirect } from "@solidjs/router";
import crypto from "crypto";
import { prisma } from "~/db/prisma";
import { setAuth } from "../session";

export async function login(email: string, password: string) {
  try {
    let user = await prisma.account.findUnique({
      where: { email: email },
      include: { Password: true },
    });

    if (!user || !user.Password) {
      return false;
    }

    let hash = crypto
      .pbkdf2Sync(password, user.Password.salt, 1000, 64, "sha256")
      .toString("hex");

    if (hash !== user.Password.hash) {
      return false;
    }

    return user.id;
  } catch (error) {
    console.log("login error", error);
    return false;
  }
}

export function validateLogin(email: string, password: string) {
  let errors: { email?: string; password?: string } = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return Object.keys(errors).length ? errors : null;
}

export async function validateSignin(email: string, password: string) {
  let errors: { email?: string; password?: string } = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (!errors.email && (await accountExists(email))) {
    errors.email = "An account with this email already exists.";
  }

  return Object.keys(errors).length ? errors : null;
}

export async function accountExists(email: string) {
  let account = await prisma.account.findUnique({
    where: { email: email },
    select: { id: true },
  });

  return Boolean(account);
}

export async function createAccount(email: string, password: string) {
  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha256")
    .toString("hex");

  return prisma.account.create({
    data: {
      email: email,
      Password: { create: { hash, salt } },
    },
  });
}

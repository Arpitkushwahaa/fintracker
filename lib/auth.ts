// lib/auth.ts
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function getAuthUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  // Try to find the user in the database using Clerk ID
  let user = await db.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  // If not found, create the user
  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        image: clerkUser.imageUrl,
      },
    });
  }

  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

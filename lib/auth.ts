import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
  };
}

export async function requireAuth() {
  const user = await getAuthUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

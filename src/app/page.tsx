import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HomeSignIn } from "@/components/HomeSignIn";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/auth/continue");
  }

  return <HomeSignIn />;
}

import Header from "@/components/layout/Header";
import Main from "@/components/home/Main";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth(); 

  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <>
      <div className="home">
        <Header />
        <Main />
      </div>
    </>
  );
}

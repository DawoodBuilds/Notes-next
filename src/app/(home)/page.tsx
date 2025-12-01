import Header from "@/components/layout/Header";
import Main from "@/components/home/Main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recap.ai",
};

export default function Home() {
  return (
    <>
      <div className="home">
        <Header />
        <Main />
      </div>
    </>
  );
}

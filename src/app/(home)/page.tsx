import Title from "@/components/providers/TitleProviderWrapper";
import Header from "@/components/layout/Header";
import Main from "@/components/home/Main";

export default function Home() {
  return (
    <>
      <Title>FlashNotes</Title>
      <div className="home">
        <Header />
        <Main />
      </div>
    </>
  );
}

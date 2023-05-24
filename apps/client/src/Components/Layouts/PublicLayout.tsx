import { Nav } from "../Nav";

interface PublicProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicProps) => {
  return (
    <main className="h-screen flex flex-col gap-4">
      <Nav />
      <section className="container mx-auto h-[calc(100vh_-_80px)] overflow-y-scroll">
        {children}
      </section>
    </main>
  );
};

export default PublicLayout;

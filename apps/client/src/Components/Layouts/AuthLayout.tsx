interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
};

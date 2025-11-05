import { getServerSession } from "@/lib/auth/utils";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  return children;
}

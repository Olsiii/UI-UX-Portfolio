import { redirect } from "next/navigation";
import { adminReady, isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="adm-login">
      <div className="adm-card">
        <h1>Admin</h1>
        {adminReady() ? (
          <LoginForm />
        ) : (
          <p className="adm-note">
            The admin login isn&apos;t set up yet. Add <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> (8+ characters) to the
            environment variables, then redeploy. See the README.
          </p>
        )}
      </div>
    </main>
  );
}

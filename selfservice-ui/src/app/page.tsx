import { SessionProvider } from "@ory/elements-react/client";
import { getLogoutFlow, getServerSession } from "@ory/nextjs/app";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession();
  const traits = session?.identity?.traits as {
    email: string;
    username: string;
    phone: string;
  };
  return (
    <SessionProvider session={session}>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          {/* <Image src={OryLogo as string} alt="Ory Logo" width={160} /> */}
          <h1 className="font-bold text-xl">Ory Next.js App Router Example</h1>
          {!session && (
            <div className="flex items-center gap-2 bg-white rounded-sm border flex-col w-60 p-3">
              <Link
                className="underline block w-full"
                href="/auth/registration"
              >
                Registration
              </Link>
              <Link className="underline block w-full" href="/auth/login">
                Login
              </Link>
              <Link className="underline block w-full" href="/auth/recovery">
                Account Recovery
              </Link>
              <Link
                className="underline block w-full"
                href="/auth/verification"
              >
                Account Verification
              </Link>
            </div>
          )}
          {session && (
            <div className="flex items-center gap-2 bg-white rounded-sm border flex-col w-60 p-3">
              <h2 className="w-full">
                Hi, {traits.email ?? traits.username ?? traits.phone}!
              </h2>
              <Link className="underline block w-full" href="/settings">
                Settings
              </Link>
              <LogoutLink />
            </div>
          )}
          <div className="flex gap-2 text-sm">
            <a
              href="https://github.com/ory/elements/tree/master/examples/nextjs-pages-router"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              App Router Example
            </a>
            <a
              href="https://github.com/ory/elements/tree/master/examples/nextjs-pages-router"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Page Router Example
            </a>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}

async function LogoutLink() {
  const flow = await getLogoutFlow({});

  const baseUrl = process.env["NEXT_PUBLIC_ORY_SDK_URL"] ?? "";
  const logoutUrl = new URL(
    "self-service/logout?token=" + flow.logout_token,
    baseUrl
  );

  return (
    // <Link className="underline block w-full" href={flow.logout_url}>
    //   Logout
    // </Link>
    //https://auth.next-invoice.katipwork.com/api/public/self-service/logout?token=ory_lo_s6YGyZfGLochWInrrXLSaU6zs1u5ZZUK
    <Link className="underline block w-full" href={logoutUrl}>
      Logout
    </Link>
  );
}

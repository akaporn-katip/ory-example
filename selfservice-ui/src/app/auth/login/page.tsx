import { getLoginFlow, OryPageParams } from "@ory/nextjs/app";
import config from "@/ory.config";
import { Login } from "@ory/elements-react/theme";
import { headers } from "next/headers";

function getEnv(name: string): string | undefined {
  return process.env[`NEXT_PUBLIC_${name}`] || process.env[name];
}

export function isProduction() {
  const env = getEnv("VERCEL_ENV") || getEnv("NODE_ENV") || "";
  return ["production", "prod"].indexOf(env) > -1;
}

export async function getCookieHeader() {
  const h = await headers();
  return h.get("cookie") ?? undefined;
}

export async function getPublicUrl() {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

export default async function LoginPage(props: OryPageParams) {
  console.log("params", await props.searchParams);
  console.log(
    "__NEXT_PRIVATE_ORIGIN",
    process.env["__NEXT_PRIVATE_ORIGIN"]?.replace(/\/$/, "")
  );
  console.log("VERCEL_ENV", getEnv("VERCEL_ENV"));
  console.log("ORY_SDK_URL", getEnv("ORY_SDK_URL"));
  console.log("isProduction", isProduction());
  console.log("NODE_ENV", getEnv("NODE_ENV"));
  console.log("getPublicUrl", await getPublicUrl());
  const flow = await getLoginFlow(config, props.searchParams);
  if (!flow) {
    return null;
  }

  // return <div>login page</div>
  return (
    <Login
      flow={flow}
      config={config}
      components={{
        Card: {},
      }}
    />
  );
}

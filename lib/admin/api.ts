import "server-only";
import { NextResponse } from "next/server";

/** Belt-and-suspenders: these routes only exist in dev, but refuse anyway. */
export function devGuard(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Admin API is not available" }, { status: 403 });
  }
  return null;
}

export function ok(data: unknown): NextResponse {
  return NextResponse.json(data);
}

export function fail(error: unknown, status = 400): NextResponse {
  const message = error instanceof Error ? error.message : String(error);
  return NextResponse.json({ error: message }, { status });
}

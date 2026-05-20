import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  if (status !== "1") {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/premium/failed`,
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/premium/success`,
  );
}

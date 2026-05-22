import { NextResponse } from "next/server";
import crypto from "crypto";
import { sortedObj } from "@/lib/utils/helpers";
import { activatePremium } from "@/lib/payment/activate-premium";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  const secureHash = params["vnp_SecureHash"];
  delete params["vnp_SecureHash"];
  delete params["vnp_SecureHashType"];

  const secretKey = process.env.VNPAY_HASH_SECRET!;
  const sorted = sortedObj(params);
  const signData = new URLSearchParams(sorted).toString();
  const expectedHash = crypto
    .createHmac("sha512", secretKey)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  if (expectedHash !== secureHash) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/subscription/failed`,
    );
  }

  if (params["vnp_ResponseCode"] === "00") {
    const userId = params["vnp_OrderInfo"];
    await activatePremium(userId);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/subscription/failed`,
  );
}

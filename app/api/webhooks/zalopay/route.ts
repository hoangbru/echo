import { NextResponse } from "next/server";
import crypto from "crypto";
import { zalopay } from "@/lib/payment/zalopay";
import { activatePremium } from "@/lib/payment/activate-premium";

export async function POST(req: Request) {
  const body = await req.json();
  const { data, mac } = body;

  const expectedMac = crypto
    .createHmac("sha256", zalopay.key2)
    .update(data)
    .digest("hex");

  if (expectedMac !== mac) {
    return NextResponse.json({
      return_code: -1,
      return_message: "Invalid MAC",
    });
  }

  const parsed = JSON.parse(data);

  if (parsed.app_user) {
    await activatePremium(parsed.app_user);
  }

  return NextResponse.json({ return_code: 1, return_message: "success" });
}

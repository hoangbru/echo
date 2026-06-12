import { NextResponse } from "next/server";
import crypto from "crypto";
import moment from "moment";

import { stripe } from "@/lib/payment/stripe";
import { authorizeApi } from "@/lib/session";
import { UserRole } from "@/types";
import { zalopay } from "@/lib/payment/zalopay";
import { sortedObj } from "@/lib/utils/helpers";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { provider } = await req.json();
    const auth = await authorizeApi([UserRole.USER, UserRole.ARTIST]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient();
    const userId = auth.user?.id;
    const itemName = "Echo Pro (1 Tháng)";
    const description = `Echo - Thanh toan goi Pro`;
    const amount = 39000;

    switch (provider) {
      case "stripe": {
        let customerId = auth.user.stripe_customer_id;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: auth.user.email,
            metadata: { userId },
          });
          customerId = customer.id;

          await supabase
            .from("user")
            .update({ stripe_customer_id: customerId })
            .eq("id", userId);
        }

        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ["card"],
          line_items: [
            {
              price: process.env.STRIPE_PRICE_ID!,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/failed`,
          metadata: { userId },
        });

        return NextResponse.json({ url: session.url });
      }

      case "vnpay": {
        const tmnCode = process.env.VNPAY_TMN_CODE!;
        const secretKey = process.env.VNPAY_HASH_SECRET!;
        const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");

        const vnp_Params: Record<string, any> = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: tmnCode,
          vnp_Locale: "vn",
          vnp_CurrCode: "VND",
          vnp_TxnRef: moment(date).format("DDHHmmss"),
          vnp_OrderInfo: userId,
          vnp_OrderType: "billpayment",
          vnp_Amount: amount * 100,
          vnp_ReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/vnpay`,
          vnp_IpAddr: "127.0.0.1",
          vnp_CreateDate: createDate,
          vnp_BankCode: 'NCB'
        };

        const sortedParams = sortedObj(vnp_Params);
        const signData = new URLSearchParams(sortedParams).toString();
        const signed = crypto
          .createHmac("sha512", secretKey)
          .update(Buffer.from(signData, "utf-8"))
          .digest("hex");

        vnp_Params["vnp_SecureHash"] = signed;
        const paymentUrl =
          vnpUrl + "?" + new URLSearchParams(vnp_Params).toString();

        return NextResponse.json({ checkoutUrl: paymentUrl });
      }

      case "zalopay": {
        const pad = (n: number) => n.toString().padStart(2, "0");
        const now = new Date();
        const datePrefix = `${now.getFullYear().toString().slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;

        const embed_data = {
          redirecturl: `${process.env.NEXT_PUBLIC_APP_URL}/api/zalopay/return`,
        };
        const items = [
          { item_name: itemName, item_price: amount, item_quantity: 1 },
        ];

        const trans: Record<string, any> = {
          app_id: parseInt(zalopay.app_id),
          app_trans_id: `${datePrefix}_${Date.now()}`,
          app_user: userId,
          app_time: Date.now(),
          amount,
          item: JSON.stringify(items),
          description,
          embed_data: JSON.stringify(embed_data),
          callback_url: `${process.env.API_URL}/api/webhooks/zalopay`,
          mac: "",
        };

        const dataStr = [
          zalopay.app_id,
          trans.app_trans_id,
          trans.app_user,
          trans.amount,
          trans.app_time,
          trans.embed_data,
          trans.item,
        ].join("|");

        trans.mac = crypto
          .createHmac("sha256", zalopay.key1)
          .update(dataStr)
          .digest("hex");

        const response = await fetch(zalopay.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trans),
        });
        const result = await response.json();

        if (result.return_code === 1) {
          return NextResponse.json({ checkoutUrl: result.order_url });
        }

        console.error("[ZALOPAY_ERROR_CHECKOUT]:", result.sub_return_message);
        return NextResponse.json(
          { error: result.return_message },
          { status: 400 },
        );
      }

      default:
        return NextResponse.json(
          { error: "Phương thức hiện tại không được hỗ trợ" },
          { status: 400 },
        );
    }
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi hệ thống" },
      { status: 500 },
    );
  }
}

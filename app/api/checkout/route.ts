import { NextResponse } from "next/server";
import crypto from "crypto";
import moment from "moment";

import { stripe } from "@/lib/payment/stripe";
import { authorizeApi } from "@/lib/session";
import { UserRole } from "@/types";
import { zalopay } from "@/lib/payment/zalopay";

export async function POST(req: Request) {
  try {
    const { provider } = await req.json();
console.log(provider)
    const auth = await authorizeApi([UserRole.USER]);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const userId = auth.user?.id;
    const itemName = "Echo Pro Subscription (1 Tháng)";
    const description = "Echo - Thanh toan goi Pro";
    const amount = 39000;

    if (!auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    switch (provider) {
      case "stripe":
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card", "link"],
          line_items: [
            {
              price_data: {
                currency: "vnd",
                product_data: {
                  name: itemName,
                  description,
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment", // Hoặc 'subscription' nếu cấu hình gói định kỳ
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/premium/failed`,

          metadata: {
            userId: auth.user.id,
          },
        });
        return NextResponse.json({ url: session.url });

      case "zalopay":
        const embed_data = {
          redirecturl: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success`,
        };
        const items = [
          { item_name: itemName, item_price: amount, item_quantity: 1 },
        ];

        const trans = {
          app_id: zalopay.app_id,
          app_user: userId,
          app_trans_id: `ECHO_${Date.now()}`,
          app_time: Date.now(),
          amount: amount,
          item: JSON.stringify(items),
          embed_data: JSON.stringify(embed_data),
          description,
          mac: "",
        };

        const dataStr =
          zalopay.app_id +
          "|" +
          trans.app_trans_id +
          "|" +
          trans.app_user +
          "|" +
          trans.amount +
          "|" +
          trans.app_time +
          "|" +
          trans.embed_data +
          "|" +
          trans.item;
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
        } else {
          return NextResponse.json(
            { error: result.return_message },
            { status: 400 },
          );
        }

      case "vnpay":
        const tmnCode = process.env.VNPAY_TMN_CODE!;
        const secretKey = process.env.VNPAY_HASH_SECRET!;
        const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

        const date = new Date();
        const createDate = moment(date).format("YYYYMMDDHHmmss");

        const vnp_Params: any = {
          vnp_Version: "2.1.0",
          vnp_Command: "pay",
          vnp_TmnCode: tmnCode,
          vnp_Locale: "vn",
          vnp_CurrCode: "VND",
          vnp_TxnRef: moment(date).format("DDHHmmss"),
          vnp_OrderInfo: description,
          vnp_OrderType: "billpayment",
          vnp_Amount: 39000 * 100,
          vnp_ReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/premium/success`,
          vnp_IpAddr: "127.0.0.1",
          vnp_CreateDate: createDate,
        };

        const sortedParams = Object.keys(vnp_Params)
          .sort()
          .reduce((obj: any, key: string) => {
            obj[key] = vnp_Params[key];
            return obj;
          }, {});

        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac
          .update(Buffer.from(signData, "utf-8"))
          .digest("hex");

        vnp_Params["vnp_SecureHash"] = signed;
        const paymentUrl =
          vnpUrl + "?" + new URLSearchParams(vnp_Params).toString();

        return NextResponse.json({ checkoutUrl: paymentUrl });

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

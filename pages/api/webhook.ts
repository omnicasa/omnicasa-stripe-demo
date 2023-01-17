export const config = {
  api: {
    bodyParser: false,
  },
};

import { buffer } from "micro";

import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const webhookSecret = process.env.WEBHOOK_SECRET as string;
const teamsWebHookURL = process.env.TEAMS_WEBHOOK_URL as string;

async function sendToTeams(message: string, obj: Object) {
  await fetch(teamsWebHookURL, {
    method: "POST",
    body: JSON.stringify({
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: "0072C6", // light blue
      summary: "Summary description",
      sections: [
        {
          activityTitle: message,
          text: JSON.stringify(obj),
        },
      ],
    }),
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as any;

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log(event.data.object);
          sendToTeams("PaymentIntent was successful!", paymentIntent);
          console.log("PaymentIntent was successful!");
          break;
        case "payment_method.attached":
          const paymentMethod = event.data.object;
          sendToTeams(
            "PaymentMethod was attached to a Customer!",
            paymentMethod
          );
          break;
        default:
          sendToTeams(`Unhandled event type ${event.type}`, {});
      }
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
  res.end("done");
};

export default handler;

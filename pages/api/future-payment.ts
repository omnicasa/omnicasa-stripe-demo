const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const customerId = req.query.customer_id as string;
  if (req.method === "POST") {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["sepa_debit", "bancontact"],
    });

    res.json({ client_secret: setupIntent.client_secret });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

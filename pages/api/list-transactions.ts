import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res
        .status(401)
        .json({ message: "Protected endpoint. You must be logged in." });
      return;
    }

    const transactions = await stripe.paymentIntents.list({
      limit: 100,
    });
    res.json({ transactions: transactions.data });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

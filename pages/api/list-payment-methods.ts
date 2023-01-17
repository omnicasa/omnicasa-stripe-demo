import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res
      .status(401)
      .json({ message: "Protected endpoint. You must be logged in." });
    return;
  }

  if (req.method === "POST") {
    const { customerId } = req.body;

    let paymentMethods;

    try {
      paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "sepa_debit",
      });
      res.json({ paymentMethods: paymentMethods.data });
    } catch (err: any) {
      res.status(500).json({ message: "Error retrieving payment methods." });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

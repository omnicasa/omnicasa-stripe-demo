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

  // not dealing with 100+ customers for now
  const customers = await stripe.customers.list({
    limit: 100,
  });

  res.json({ customers: customers.data });
}

import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {

    res.json({ message: 'ok' })
    return

    if (req.method === 'POST') {
        try {
            const customer = await stripe.customers.search({ query: 'metadata["zohoId"]:"abcd"', limit: 1 });

            console.log({ customer: customer.data, mtd: customer.data.metadata });

            res.end()
        }
        catch (err) {
            console.log(err);
            res.end()
        }
    }
}
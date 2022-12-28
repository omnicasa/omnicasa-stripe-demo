import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        try {
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        price: 'price_1MI2X7KHRmqqHHXl7ZXAd5FF',
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
                automatic_tax: { enabled: false },
            });
            res.redirect(303, session.url);
        } catch (err: any) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        console.log('nope')

        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
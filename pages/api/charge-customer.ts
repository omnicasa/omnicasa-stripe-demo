import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from './auth/[...nextauth]'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ message: "You must be logged in." });
        return;
      }
      
    if (req.method === 'POST') {
        try {
            const { customerId, paymentMethodId, amount } = req.body
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'eur',
                customer: customerId,
                payment_method: paymentMethodId,
                off_session: true,
                confirm: true,
                payment_method_types: ['sepa_debit', 'bancontact'],
                statement_descriptor: 'omnicasa'
            });
            res.json({ intent: paymentIntent });
        } catch (err: any) {
            console.log('Error code is: ', err.code);
            const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
            console.log('PI retrieved: ', paymentIntentRetrieved.id);
        }
    }
}
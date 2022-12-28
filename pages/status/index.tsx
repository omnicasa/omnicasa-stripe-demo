import { GetServerSideProps } from "next"

type SSRProps = {
    redirectStatus: string
    query: any
}

import React, { useState, useEffect } from 'react';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { StripeWrapper } from "../../components/stripe/wrapper";
import { useRouter } from "next/router";
import { Button } from "../../components/button";
import { UiWrapper } from "../../components/uiWrapper";

type StatusProps = {
    clientSecret: string
    onCharge: () => void
}

const PaymentStatus = ({ clientSecret, onCharge }: StatusProps) => {
    const stripe = useStripe();
    const [message, setMessage] = useState('');
    const [jsx, setJsx] = useState(<></>)

    useEffect(() => {
        if (!stripe) {
            return;
        }

        stripe
            .retrieveSetupIntent(clientSecret)
            .then(({ setupIntent }) => {
                // Inspect the SetupIntent `status` to indicate the status of the payment
                // to your customer.
                //
                // Some payment methods will [immediately succeed or fail][0] upon
                // confirmation, while others will first enter a `processing` state.
                //
                // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
                switch (setupIntent?.status) {
                    case 'succeeded':
                        setMessage('Success! Your payment method has been saved.');
                        setJsx(<Button onClick={onCharge} className="mt-4">Charge this customer</Button>)
                        break;

                    case 'processing':
                        setMessage("Processing payment details. We'll update you when processing is complete.");
                        break;

                    case 'requires_payment_method':
                        // Redirect your user back to your payment page to attempt collecting
                        // payment again
                        setMessage('Failed to process payment details. Please try another payment method.');
                        break;
                }
            });
    }, [stripe]);


    return <><p>{message}</p>{jsx}</>
};


const Success = ({ query }: SSRProps) => {
    const router = useRouter()

    function onCharge() {
        router.push('/charge-customer?customer_id=' + query.customer_id)
    }

    return (
        <StripeWrapper>
            <UiWrapper>
                <PaymentStatus clientSecret={query.setup_intent_client_secret} onCharge={onCharge} />
            </UiWrapper>
        </StripeWrapper>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query } = ctx

    return {
        props: {
            query
        },
    }
}



export default Success
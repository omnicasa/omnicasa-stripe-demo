import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

type Props = {
    clientSecret?: string
    children: React.ReactNode
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const StripeWrapper = ({ clientSecret, children }: Props) => {
    const options: StripeElementsOptions = {
        clientSecret: clientSecret,
        // appearance: {
        //     variables: {
        //         borderRadius: '0.5rem',
        //         colorText: 'rgb(148 163 184 / var(--tw-text-opacity))',
        //     },
        //     rules: {
        //         '.Input': {
        //             border: 'none',
        //             boxShadow: '0 0 #0000, var(--tw-ring-shadow), 0 0 #0000'
        //         }
        //     }
        // }
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    )
}

export { StripeWrapper }
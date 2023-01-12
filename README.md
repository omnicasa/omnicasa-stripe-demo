This is a simple NextJS app that uses the Stripe API to automatically charge customers.

To use it:

1. Create a customer in Stripe
2. Paste the customer's ID
3. Click on "add bank account" and enter the details and authorize us. The bank details are now saved.
4. Now click on "charge customer" and you can charge the card.

This project requires an `.env.local` file which requires the following details

```
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
TEAMS_WEBHOOK_URL=""
WEBHOOK_SECRET=""
NEXTAUTH_SECRET=""
```

Note that the `NEXTAUTH_SECRET` can be found in Omnicasa's password mananger

## Installation

1. Clone the project
2. Enter the details in the `.env.local` file
3. Install the dependencies with `npm i`
4. Run `npm run dev` to run the project.

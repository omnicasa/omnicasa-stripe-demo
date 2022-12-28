import Head from "next/head"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { Button } from "../components/button"
import { UiWrapper } from "../components/uiWrapper"

export default function HomePage() {
  const [customerId, setCustomerID] = useState('')

  const router = useRouter()

  const isValidCustomerId = useMemo(() => {
    return customerId.length > 0 && customerId.startsWith('cus_')
  }, [customerId])

  function onBankAccountClick() {
    router.push(`/recurring-payment?customer_id=${customerId}`)
  }

  function onChargeCardClick() {
    router.push(`/charge-customer?customer_id=${customerId}`)
  }

  return (
    <>
      <Head>
        <title>Omnicasa Recurring Payments</title>
      </Head>
      <UiWrapper>
        <h1 className="text-4xl font-bold mb-2 text-slate-900">Omnicasa Recurring Payments</h1>
        <p className="text-slate-700">This is a demo of the Omnicasa Recurring Payments API.</p>

        <form className="mt-4" onSubmit={e => e.preventDefault()}>
          <label className="font-medium text-slate-700 block mb-2" htmlFor="customerId">Customer ID</label>
          <input id="customerId" onChange={e => setCustomerID(e.target.value)} className="flex items-center w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400" />
          <div className="flex gap-2">
            <Button disabled={!isValidCustomerId} className="mt-4" onClick={onBankAccountClick}>Add new bank account</Button>
            <Button disabled={!isValidCustomerId} className="mt-4" onClick={onChargeCardClick}>Charge customer</Button>
          </div>
        </form>
      </UiWrapper>
    </>
  )
}
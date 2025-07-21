import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { router } from './Pages/Routes'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const queryClient = new QueryClient()
const stripePromise = loadStripe('pk_test_51PNCFyEPhxEoR7aayPKRAIsWy0P7QgMqNC6uBEAnqSptC8MZ8hkdOTgDMXVH05C4s6u3Xw1YMuScrHOgkUV1JjYV00U30ZPWtf')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} />
        <Toaster />
      </Elements>
    </QueryClientProvider>
  </StrictMode>
)

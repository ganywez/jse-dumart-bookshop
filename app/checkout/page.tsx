"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/data"

type Step = "shipping" | "payment" | "confirm"
type PaymentMethod = "mpesa" | "cod"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [step, setStep] = useState<Step>("shipping")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa")
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone || "")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [mpesaPromptSent, setMpesaPromptSent] = useState(false)

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4" suppressHydrationWarning>
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-[var(--navy)]/10 flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-lock text-4xl text-[var(--navy)]"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to proceed with checkout.</p>
          <button 
            onClick={() => router.push('/login?redirect=/checkout')}
            className="bg-[var(--navy)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--teal)] transition-all inline-flex items-center gap-2 w-full justify-center"
          >
            <i className="fa-solid fa-sign-in-alt"></i>
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4" suppressHydrationWarning>
        <div className="text-center max-w-md">
          <i className="fa-solid fa-shopping-cart text-5xl text-muted-foreground/30 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
          <Link 
            href="/shop"
            className="bg-[var(--navy)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--teal)] transition-all inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const [shipping, setShipping] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "Nairobi",
    area: "",
    notes: "",
  })

  const deliveryFee = totalPrice >= 3000 ? 0 : 200
  const grandTotal = totalPrice + deliveryFee

  const updateShipping = (field: string, value: string) =>
    setShipping((prev) => ({ ...prev, [field]: value }))

  const handleMpesaPayment = async () => {
    setIsProcessing(true)
    // Show paybill details to user - they will send payment manually
    setMpesaPromptSent(true)
    
    // Complete order immediately with paybill pending status
    await new Promise((r) => setTimeout(r, 1000))
    
    setIsProcessing(false)
    setOrderPlaced(true)
    clearCart()
  }

  const handleCODPayment = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsProcessing(false)
    setOrderPlaced(true)
    clearCart()
  }

  const handlePlaceOrder = () => {
    if (paymentMethod === "mpesa") {
      handleMpesaPayment()
    } else {
      handleCODPayment()
    }
  }

  // ===== ORDER SUCCESS =====
  if (orderPlaced) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="animate-fade-in-up w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--green)]/10">
            <i className="fa-solid fa-circle-check text-5xl text-[var(--green)]"></i>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Order Placed Successfully!</h1>
          <p className="mb-2 text-muted-foreground">
            Thank you for shopping with JSEdumart.
          </p>
          <p className="mb-1 text-sm text-muted-foreground">
            Order #{`JSE${Date.now().toString().slice(-6)}`}
          </p>
          {paymentMethod === "mpesa" && (
            <div className="mx-auto mt-4 max-w-xs rounded-xl border border-[var(--green)]/30 bg-[var(--green)]/5 p-4">
              <i className="fa-solid fa-mobile-screen-button mb-2 text-2xl text-[var(--green)]"></i>
              <p className="text-sm font-medium text-foreground">M-Pesa Payment Pending</p>
              <p className="text-xs text-muted-foreground">
                KSh {grandTotal.toLocaleString()} received from {mpesaPhone}
              </p>
            </div>
          )}
          {paymentMethod === "cod" && (
            <div className="mx-auto mt-4 max-w-xs rounded-xl border border-[var(--yellow)]/30 bg-[var(--yellow)]/5 p-4">
              <svg className="mb-2 h-8 w-8 text-[var(--yellow)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V6h14v14zm-5.04-6.71l-2.75 3.54-2.59-2.59-1.41 1.41L6.5 17l4.25-5.29 2.96 3.83 1.41-1.41-1.12-1.46z" />
              </svg>
              <p className="text-sm font-medium text-foreground">Cash on Delivery</p>
              <p className="text-xs text-muted-foreground">
                Please have KSh {grandTotal.toLocaleString()} ready at delivery
              </p>
            </div>
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            A confirmation has been sent to <span className="font-medium text-foreground">{shipping.email}</span>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--teal)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Continue Shopping
            </Link>
            <a
              href={`https://wa.me/254704454556?text=${encodeURIComponent(`Hi JSEdumart! I just placed an order and would like to track it.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
            >
              <svg className="h-4 w-4 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.869 1.171l-.346.194-3.57-.374.76 2.77-.179.286a9.874 9.874 0 001.515 5.031h.001a9.926 9.926 0 005.313 3.116l.552.105 3.635.363-.375-3.548.202-.32c.553-.894.867-1.965.867-3.113 0-5.335-4.343-9.67-9.681-9.67z"/>
              </svg>
              Track via WhatsApp
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ===== EMPTY CART =====
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20">
        <div className="animate-fade-in-up text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <svg className="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Nothing to Checkout</h1>
          <p className="mb-8 text-sm text-muted-foreground">Add some items to your cart first.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--teal)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  const stepIcons = {
    shipping: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM9 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20 8H4V4h16v4zm-11 11H3V9h6v10z"/>
      </svg>
    ),
    payment: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8H4V4h16m0 12H4v-6h16m0 8H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2z"/>
      </svg>
    ),
    confirm: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    ),
  }

  const steps: { key: Step; label: string }[] = [
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
    { key: "confirm", label: "Confirm" },
  ]

  const stepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Breadcrumb */}
        <nav className="animate-fade-in mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-[var(--teal)]">Home</Link>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/cart" className="transition-colors hover:text-[var(--teal)]">Cart</Link>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-foreground">Checkout</span>
        </nav>

        {/* Step Progress */}
        <div className="animate-fade-in-up mb-8">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                      i <= stepIndex
                        ? "bg-[var(--navy)] text-white shadow-lg shadow-[var(--navy)]/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < stepIndex ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    ) : (
                      stepIcons[s.key]
                    )}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${i <= stepIndex ? "text-[var(--navy)]" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-3 mb-5 h-0.5 w-12 rounded-full transition-all duration-500 sm:w-20 md:w-28 ${
                    i < stepIndex ? "bg-[var(--navy)]" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <div className="flex-1">
            {/* ===== STEP 1: SHIPPING ===== */}
            {step === "shipping" && (
              <div className="animate-fade-in-up rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                  <svg className="h-5 w-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM9 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20 8H4V4h16v4zm-11 11H3V9h6v10z"/>
                  </svg>
                  Shipping Details
                </h2>

                {!isAuthenticated && (
                  <div className="mb-6 flex items-center gap-3 rounded-xl bg-[var(--teal)]/5 p-4">
                    <svg className="h-5 w-5 shrink-0 text-[var(--teal)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/auth/signin" className="font-semibold text-[var(--teal)] hover:underline">Sign in</Link>{" "}
                      for faster checkout.
                    </p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="shFirst" className="mb-1.5 block text-sm font-medium text-foreground">First Name</label>
                    <input
                      id="shFirst"
                      type="text"
                      value={shipping.firstName}
                      onChange={(e) => updateShipping("firstName", e.target.value)}
                      placeholder="John"
                      className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="shLast" className="mb-1.5 block text-sm font-medium text-foreground">Last Name</label>
                    <input
                      id="shLast"
                      type="text"
                      value={shipping.lastName}
                      onChange={(e) => updateShipping("lastName", e.target.value)}
                      placeholder="Doe"
                      className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="shEmail" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input
                        id="shEmail"
                        type="email"
                        value={shipping.email}
                        onChange={(e) => updateShipping("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="shPhone" className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <input
                        id="shPhone"
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) => updateShipping("phone", e.target.value)}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                        required
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="shAddress" className="mb-1.5 block text-sm font-medium text-foreground">Delivery Address</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        id="shAddress"
                        type="text"
                        value={shipping.address}
                        onChange={(e) => updateShipping("address", e.target.value)}
                        placeholder="Street address, building, apartment"
                        className="w-full rounded-lg border border-border bg-white py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="shCity" className="mb-1.5 block text-sm font-medium text-foreground">City</label>
                    <select
                      id="shCity"
                      value={shipping.city}
                      onChange={(e) => updateShipping("city", e.target.value)}
                      className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                    >
                      <option>Nairobi</option>
                      <option>Mombasa</option>
                      <option>Kisumu</option>
                      <option>Nakuru</option>
                      <option>Eldoret</option>
                      <option>Thika</option>
                      <option>Nyeri</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="shArea" className="mb-1.5 block text-sm font-medium text-foreground">Area / Estate</label>
                    <input
                      id="shArea"
                      type="text"
                      value={shipping.area}
                      onChange={(e) => updateShipping("area", e.target.value)}
                      placeholder="e.g. Westlands, Dagoretti"
                      className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="shNotes" className="mb-1.5 block text-sm font-medium text-foreground">Order Notes (optional)</label>
                    <textarea
                      id="shNotes"
                      value={shipping.notes}
                      onChange={(e) => updateShipping("notes", e.target.value)}
                      placeholder="Special instructions for delivery..."
                      rows={3}
                      className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep("payment")}
                  disabled={!shipping.firstName || !shipping.lastName || !shipping.email || !shipping.phone || !shipping.address}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--navy)] py-4 text-sm font-semibold text-white transition-all hover:bg-[var(--teal)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Payment
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ===== STEP 2: PAYMENT ===== */}
            {step === "payment" && (
              <div className="animate-fade-in-up rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                  <svg className="h-5 w-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 8H4V4h16m0 12H4v-6h16m0 8H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2z"/>
                  </svg>
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* M-Pesa */}
                  <button
                    onClick={() => setPaymentMethod("mpesa")}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                      paymentMethod === "mpesa"
                        ? "border-[#4caf50] bg-[#4caf50]/5 shadow-md"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod === "mpesa" ? "bg-[#4caf50] text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">M-Pesa</span>
                        <span className="rounded bg-[#4caf50] px-2 py-0.5 text-[9px] font-bold uppercase text-white">Recommended</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Pay instantly via Safaricom M-Pesa STK Push
                      </p>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "mpesa" ? "border-[#4caf50] bg-[#4caf50]" : "border-muted-foreground/30"
                    }`}>
                      {paymentMethod === "mpesa" && <i className="fa-solid fa-check text-xs text-white"></i>}
                    </div>
                  </button>

                  {/* COD */}
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                      paymentMethod === "cod"
                        ? "border-[var(--yellow)] bg-[var(--yellow)]/5 shadow-md"
                        : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      paymentMethod === "cod" ? "bg-[var(--yellow)] text-[var(--navy)]" : "bg-muted text-muted-foreground"
                    }`}>
                      <i className="fa-solid fa-hand-holding-dollar text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-foreground">Cash on Delivery</span>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Pay when your order is delivered to you
                      </p>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      paymentMethod === "cod" ? "border-[var(--yellow)] bg-[var(--yellow)]" : "border-muted-foreground/30"
                    }`}>
                      {paymentMethod === "cod" && <i className="fa-solid fa-check text-xs text-[var(--navy)]"></i>}
                    </div>
                  </button>
                </div>

                {/* M-Pesa Paybill Details */}
                {paymentMethod === "mpesa" && (
                  <div className="mt-6 animate-fade-in rounded-xl border border-[#4caf50]/20 bg-[#4caf50]/5 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4caf50]">
                        <i className="fa-brands fa-m text-white font-bold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">M-Pesa Paybill Payment</p>
                        <p className="text-xs text-muted-foreground">Use your M-Pesa to pay via paybill</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-lg bg-white p-4 border border-[#4caf50]/20">
                        <p className="text-xs text-muted-foreground mb-1">Business/Till Number</p>
                        <p className="text-2xl font-bold text-[#4caf50]">7815771</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 border border-[#4caf50]/20">
                        <p className="text-xs text-muted-foreground mb-1">Amount to Pay</p>
                        <p className="text-2xl font-bold text-foreground">{formatPrice(grandTotal)}</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 border border-[#4caf50]/20">
                        <p className="text-xs text-muted-foreground mb-1">Your Order Reference</p>
                        <p className="text-lg font-mono font-bold text-[var(--teal)]">JSE{Date.now().toString().slice(-6)}</p>
                      </div>
                    </div>
                    <div className="mt-4 bg-[#4caf50]/10 rounded-lg p-3 border-l-4 border-[#4caf50]">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground block mb-1">Payment Steps:</strong>
                        1. Open M-Pesa on your phone<br/>
                        2. Go to Lipa Na M-Pesa → Paybill<br/>
                        3. Enter Business No: <strong>7815771</strong><br/>
                        4. Enter Account Ref: <strong>JSE{Date.now().toString().slice(-6)}</strong><br/>
                        5. Enter Amount: <strong>{formatPrice(grandTotal)}</strong><br/>
                        6. Enter your M-Pesa PIN and confirm
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setStep("shipping")}
                    className="flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-muted"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={paymentMethod === "mpesa" && !mpesaPhone}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--navy)] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[var(--teal)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Review Order
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* ===== STEP 3: CONFIRM ===== */}
            {step === "confirm" && (
              <div className="animate-fade-in-up space-y-6">
                {/* Shipping Summary */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-bold text-foreground">
                      <svg className="h-5 w-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM9 18.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20 8H4V4h16v4zm-11 11H3V9h6v10z"/>
                      </svg>
                      Delivery Details
                    </h3>
                    <button onClick={() => setStep("shipping")} className="text-xs font-medium text-[var(--teal)] hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p className="text-muted-foreground">Name: <span className="font-medium text-foreground">{shipping.firstName} {shipping.lastName}</span></p>
                    <p className="text-muted-foreground">Phone: <span className="font-medium text-foreground">{shipping.phone}</span></p>
                    <p className="text-muted-foreground">Email: <span className="font-medium text-foreground">{shipping.email}</span></p>
                    <p className="text-muted-foreground">City: <span className="font-medium text-foreground">{shipping.city}{shipping.area ? `, ${shipping.area}` : ""}</span></p>
                    <p className="text-muted-foreground sm:col-span-2">Address: <span className="font-medium text-foreground">{shipping.address}</span></p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-bold text-foreground">
                      <svg className="h-5 w-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 8H4V4h16m0 12H4v-6h16m0 8H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2z"/>
                      </svg>
                      Payment Method
                    </h3>
                    <button onClick={() => setStep("payment")} className="text-xs font-medium text-[var(--teal)] hover:underline">
                      Edit
                    </button>
                  </div>
                  {paymentMethod === "mpesa" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4caf50]">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">M-Pesa</p>
                        <p className="text-xs text-muted-foreground">STK Push to {mpesaPhone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--yellow)]">
                        <svg className="h-5 w-5 text-[var(--navy)]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Summary */}
                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                    <svg className="h-5 w-5 text-[var(--teal)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16V8c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-16 0V8h14v8H5z"/>
                    </svg>
                    Order Items ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-[var(--navy)]">
                          {formatPrice((item.product.sale_price ?? item.product.price) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-muted"
                  >
                    <i className="fa-solid fa-arrow-left text-xs" />
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--green)] py-4 text-sm font-bold text-white transition-all hover:bg-[var(--green)]/90 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      mpesaPromptSent ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin" />
                          Waiting for M-Pesa confirmation...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-spinner fa-spin" />
                          {paymentMethod === "mpesa" ? "Sending STK Push..." : "Placing Order..."}
                        </>
                      )
                    ) : (
                      <>
                        <i className="fa-solid fa-lock text-xs" />
                        Place Order - {formatPrice(grandTotal)}
                      </>
                    )}
                  </button>
                </div>

                {isProcessing && paymentMethod === "mpesa" && mpesaPromptSent && (
                  <div className="animate-fade-in rounded-xl border border-[#4caf50]/20 bg-[#4caf50]/5 p-4 text-center">
                    <i className="fa-solid fa-mobile-screen-button mb-2 text-3xl text-[#4caf50]" />
                    <p className="text-sm font-semibold text-foreground">Check Your Phone</p>
                    <p className="text-xs text-muted-foreground">
                      Enter your M-Pesa PIN on the prompt sent to {mpesaPhone}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Order Summary</h3>
              <div className="mb-4 max-h-48 space-y-2 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <span className="flex-1 truncate text-muted-foreground">
                      {item.product.name} <span className="text-xs">x{item.quantity}</span>
                    </span>
                    <span className="ml-2 shrink-0 font-medium text-foreground">
                      {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "font-medium text-[var(--green)]" : "text-foreground"}>
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-[var(--navy)]">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

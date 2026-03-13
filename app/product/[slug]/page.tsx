"use client"

import { use, useState } from "react"
import Link from "next/link"
import { products, formatPrice, categories } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import { ProductCard } from "@/components/product-card"

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = products.find((p) => p.slug === slug)
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "reviews">("desc")

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <i className="fa-solid fa-book-open mb-4 text-6xl text-muted-foreground/30" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">Product Not Found</h1>
        <p className="mb-6 text-muted-foreground">The product you are looking for does not exist.</p>
        <Link href="/shop" className="rounded-lg bg-[var(--navy)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--teal)]">
          Browse Products
        </Link>
      </div>
    )
  }

  const categoryName = categories.find((c) => c.slug === product.category)?.name || product.category
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    addToCart(product, qty)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const whatsappMsg = encodeURIComponent(
    `Hi JSEdumart! I'm interested in: ${product.name} (${formatPrice(product.salePrice ?? product.price)}). Is it available?`
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-[var(--teal)]">Home</Link>
          <i className="fa-solid fa-chevron-right text-[8px]" />
          <Link href="/shop" className="hover:text-[var(--teal)]">Shop</Link>
          <i className="fa-solid fa-chevron-right text-[8px]" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-[var(--teal)]">{categoryName}</Link>
          <i className="fa-solid fa-chevron-right text-[8px]" />
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Main product */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-sm">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              {product.discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-[var(--orange)] px-3 py-1 text-xs font-bold text-white">
                  -{product.discount}% OFF
                </span>
              )}
              {product.newArrival && (
                <span className="absolute right-4 top-4 rounded-full bg-[var(--green)] px-3 py-1 text-xs font-bold text-white">
                  NEW ARRIVAL
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:w-1/2">
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">
              {product.brand}
            </span>
            <h1 className="mb-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`fa-solid fa-star text-sm ${i < Math.floor(product.rating) ? "text-[var(--yellow)]" : "text-border"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-[var(--navy)]">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-[var(--green)]/10 px-3 py-1 text-xs font-semibold text-[var(--green)]">
                    Save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
            </div>

            <p className="mb-6 leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Stock */}
            <div className="mb-6 flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-sm font-medium ${product.inStock ? "text-[var(--green)]" : "text-destructive"}`}>
                <i className={`fa-solid ${product.inStock ? "fa-circle-check" : "fa-circle-xmark"}`} />
                {product.inStock ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-muted"
                  aria-label="Decrease quantity"
                >
                  <i className="fa-solid fa-minus text-xs" />
                </button>
                <span className="flex h-11 w-12 items-center justify-center border-x border-border text-sm font-semibold text-foreground">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  <i className="fa-solid fa-plus text-xs" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isAdded}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
                  isAdded ? "bg-[var(--green)] text-white" : "bg-[var(--navy)] text-white hover:bg-[var(--teal)]"
                }`}
              >
                <i className={`fa-solid ${isAdded ? "fa-check" : "fa-cart-plus"}`} />
                {isAdded ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            {/* Share / WhatsApp */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/254704454556?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[#25d366] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:scale-105"
              >
                <i className="fa-brands fa-whatsapp" />
                Enquire on WhatsApp
              </a>
              <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted">
                <i className="fa-solid fa-share-nodes" />
                Share
              </button>
            </div>

            {/* SKU & Tags */}
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">SKU:</span> {product.sku}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/shop?q=${tag}`}
                    className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-[var(--teal)]/10 hover:text-[var(--teal)]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex gap-1 border-b border-border">
            {(["desc", "info", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-[var(--teal)] text-[var(--navy)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "desc" ? "Description" : tab === "info" ? "Additional Info" : `Reviews (${product.reviewCount})`}
              </button>
            ))}
          </div>

          <div className="rounded-b-xl border border-t-0 border-border bg-white p-6">
            {activeTab === "desc" && (
              <div className="animate-fade-in space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>{product.description}</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Brand: {product.brand}</li>
                  <li>Category: {categoryName}</li>
                  <li>SKU: {product.sku}</li>
                  <li>{product.inStock ? "Available for immediate dispatch" : "Currently out of stock"}</li>
                </ul>
              </div>
            )}
            {activeTab === "info" && (
              <div className="animate-fade-in">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Brand", product.brand],
                      ["Category", categoryName],
                      ["SKU", product.sku],
                      ["Availability", product.inStock ? "In Stock" : "Out of Stock"],
                      ["Rating", `${product.rating}/5 (${product.reviewCount} reviews)`],
                    ].map(([label, value]) => (
                      <tr key={label} className="border-b border-border">
                        <td className="py-3 pr-4 font-medium text-foreground">{label}</td>
                        <td className="py-3 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="animate-fade-in space-y-4 text-sm text-muted-foreground">
                <p>Customer reviews coming soon! Be the first to review this product.</p>
                <button className="rounded-lg bg-[var(--navy)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--teal)]">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-foreground">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

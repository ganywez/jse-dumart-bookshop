// JSEdumart Bookstore - Kenyan Market Product Data

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  subcategory: string
  brand: string
  description: string
  price: number
  salePrice: number | null
  discount: number
  inStock: boolean
  stockQuantity: number
  sku: string
  image: string
  rating: number
  reviewCount: number
  tags: string[]
  featured: boolean
  trending: boolean
  newArrival: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  count: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  avatar: string
}

// Real stationery products for JSEdumart
export const products: Product[] = [
  {
    id: "ST001",
    name: "Crayons Veda",
    slug: "crayons-veda",
    category: "stationery",
    subcategory: "crayons",
    brand: "Veda",
    description: "Pack of smooth, brightly colored Veda crayons perfect for school coloring.",
    price: 80,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 200,
    sku: "CRV-001",
    image: "https://source.unsplash.com/400x500/?crayons",
    rating: 4.5,
    reviewCount: 12,
    tags: ["crayons", "veda", "coloring", "school"],
    featured: true,
    trending: true,
    newArrival: false,
  },
  {
    id: "ST002",
    name: "Crayons Veda (Large Pack)",
    slug: "crayons-veda-large-pack",
    category: "stationery",
    subcategory: "crayons",
    brand: "Veda",
    description: "Large pack of Veda crayons offering more shades for art and school projects.",
    price: 100,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 150,
    sku: "CRV-002",
    image: "https://source.unsplash.com/400x500/?crayons,box",
    rating: 4.6,
    reviewCount: 8,
    tags: ["crayons", "veda", "large", "art"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST003",
    name: "Ream Paper",
    slug: "ream-paper",
    category: "stationery",
    subcategory: "paper",
    brand: "Generic",
    description: "High-quality A4 ream paper suitable for printers and photocopiers.",
    price: 750,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 100,
    sku: "RP-003",
    image: "https://source.unsplash.com/400x500/?paper,ream",
    rating: 4.2,
    reviewCount: 20,
    tags: ["paper", "ream", "A4", "office"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST004",
    name: "Mathematical Tables",
    slug: "mathematical-tables",
    category: "stationery",
    subcategory: "learning-aids",
    brand: "Generic",
    description: "Durable set of printed mathematical tables for quick reference.",
    price: 250,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 120,
    sku: "MT-004",
    image: "https://source.unsplash.com/400x500/?mathematics,table",
    rating: 4.1,
    reviewCount: 5,
    tags: ["math", "tables", "reference"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST005",
    name: "Office Glue",
    slug: "office-glue",
    category: "stationery",
    subcategory: "adhesive",
    brand: "Generic",
    description: "Clear office glue ideal for paper, crafts, and everyday use.",
    price: 50,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 250,
    sku: "OG-005",
    image: "https://source.unsplash.com/400x500/?glue",
    rating: 4.0,
    reviewCount: 14,
    tags: ["glue","office","adhesive"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST006",
    name: "Pens",
    slug: "pens",
    category: "stationery",
    subcategory: "writing-instruments",
    brand: "Generic",
    description: "Smooth-writing ballpoint pens sold individually.",
    price: 10,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 500,
    sku: "PN-006",
    image: "https://source.unsplash.com/400x500/?pen",
    rating: 4.3,
    reviewCount: 30,
    tags: ["pen","ballpoint","writing"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST007",
    name: "Luminous Paper",
    slug: "luminous-paper",
    category: "stationery",
    subcategory: "paper",
    brand: "Generic",
    description: "Bright luminous paper perfect for signs and crafts.",
    price: 50,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 180,
    sku: "LP-007",
    image: "https://source.unsplash.com/400x500/?glowing,paper",
    rating: 4.0,
    reviewCount: 7,
    tags: ["paper","luminous","craft"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST008",
    name: "Sound and Read",
    slug: "sound-and-read",
    category: "stationery",
    subcategory: "learning-aids",
    brand: "Generic",
    description: "Interactive sound and read flip book for beginners.",
    price: 250,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 60,
    sku: "SR-008",
    image: "https://source.unsplash.com/400x500/?book,children",
    rating: 4.2,
    reviewCount: 9,
    tags: ["sound","read","learning"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST009",
    name: "Water Colour",
    slug: "water-colour",
    category: "stationery",
    subcategory: "paints",
    brand: "Generic",
    description: "Set of water colour paints suitable for school art projects.",
    price: 80,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 100,
    sku: "WC-009",
    image: "https://source.unsplash.com/400x500/?watercolor",
    rating: 4.1,
    reviewCount: 15,
    tags: ["watercolor","paint","art"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST010",
    name: "Sharpeners",
    slug: "sharpeners",
    category: "stationery",
    subcategory: "sharpeners",
    brand: "Generic",
    description: "Compact pencil sharpeners for classroom use.",
    price: 10,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 400,
    sku: "SP-010",
    image: "https://source.unsplash.com/400x500/?sharpener",
    rating: 4.0,
    reviewCount: 22,
    tags: ["sharpener","pencil","school"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST011",
    name: "Erasers",
    slug: "erasers",
    category: "stationery",
    subcategory: "erasers",
    brand: "Generic",
    description: "Soft erasers that cleanly remove pencil marks.",
    price: 10,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 450,
    sku: "ER-011",
    image: "https://source.unsplash.com/400x500/?eraser",
    rating: 4.1,
    reviewCount: 28,
    tags: ["eraser","pencil","school"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST012",
    name: "Manila Paper",
    slug: "manila-paper",
    category: "stationery",
    subcategory: "paper",
    brand: "Generic",
    description: "Lightweight manila paper ideal for craft projects.",
    price: 20,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 250,
    sku: "MP-012",
    image: "https://source.unsplash.com/400x500/?manila,paper",
    rating: 4.0,
    reviewCount: 10,
    tags: ["manila","paper","craft"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST013",
    name: "Helix Oxford Mathematical Set",
    slug: "helix-oxford-mathematical-set",
    category: "stationery",
    subcategory: "geometry-sets",
    brand: "Helix",
    description: "Helix Oxford mathematical set with compass, rulers and protractor.",
    price: 350,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 120,
    sku: "HX-013",
    image: "https://source.unsplash.com/400x500/?geometry,set",
    rating: 4.3,
    reviewCount: 18,
    tags: ["math","geometry","helix"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST014",
    name: "Spring File",
    slug: "spring-file",
    category: "stationery",
    subcategory: "files",
    brand: "Generic",
    description: "Compact spring file for holding loose documents securely.",
    price: 50,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 300,
    sku: "SF-014",
    image: "https://source.unsplash.com/400x500/?file",
    rating: 4.0,
    reviewCount: 25,
    tags: ["file","spring","stationery"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST015",
    name: "Cellotape",
    slug: "cellotape",
    category: "stationery",
    subcategory: "adhesive",
    brand: "Generic",
    description: "Clear cellotape roll for everyday sticking needs.",
    price: 50,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 320,
    sku: "CT-015",
    image: "https://source.unsplash.com/400x500/?tape",
    rating: 4.2,
    reviewCount: 19,
    tags: ["tape","cellotape","adhesive"],
    featured: false,
    trending: false,
    newArrival: false,
  },
  {
    id: "ST016",
    name: "HB Pencils",
    slug: "hb-pencils",
    category: "stationery",
    subcategory: "pencils",
    brand: "Generic",
    description: "Pack of HB pencils suitable for writing and drawing.",
    price: 180,
    salePrice: null,
    discount: 0,
    inStock: true,
    stockQuantity: 210,
    sku: "HB-016",
    image: "https://source.unsplash.com/400x500/?pencils",
    rating: 4.5,
    reviewCount: 40,
    tags: ["pencil","HB","writing"],
    featured: false,
    trending: false,
    newArrival: false,
  },
]

export const categories: Category[] = [
  {
    id: "stationery",
    name: "Stationery",
    slug: "stationery",
    icon: "fa-pencil-alt",
    description: "Genuine stationery items available at JSEdumart",
    count: 16,
  },
]

export const testimonials: Testimonial[] = [
  {
    name: "Mary Wanjiku",
    role: "Parent, Nairobi",
    text: "JSEdumart has been a lifesaver for back-to-school shopping. The prices are unbeatable and delivery to Westlands was fast!",
    rating: 5,
    avatar: "MW",
  },
  {
    name: "James Odhiambo",
    role: "Teacher, Kisumu",
    text: "I order all my teaching supplies from JSEdumart. The quality of the Kasuku counter books and KLB textbooks is excellent.",
    rating: 5,
    avatar: "JO",
  },
  {
    name: "Fatma Hassan",
    role: "Student, Mombasa",
    text: "Got my KCSE revision papers and Casio calculator delivered right to my door. Great prices compared to local shops!",
    rating: 4,
    avatar: "FH",
  },
  {
    name: "Peter Kamau",
    role: "School Administrator, Nakuru",
    text: "We buy in bulk for the whole school. JSEdumart always offers the best bulk discounts and their M-Pesa payment is seamless.",
    rating: 5,
    avatar: "PK",
  },
  {
    name: "Grace Njeri",
    role: "Art Teacher, Thika",
    text: "The Faber-Castell colour pencils and Pelikan watercolors are always original. My students love the quality of art supplies from JSEdumart.",
    rating: 5,
    avatar: "GN",
  },
]

export const flashDeals = products.filter((p) => p.discount >= 18)
export const featuredProducts = products.filter((p) => p.featured)
export const trendingProducts = products.filter((p) => p.trending)
export const newArrivals = products.filter((p) => p.newArrival)

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  )
}

export function formatPrice(amount: number): string {
  return `KSh ${amount.toLocaleString()}`
}

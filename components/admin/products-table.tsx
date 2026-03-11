'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/supabase/products'
import { Button } from '@/components/ui/button'

interface ProductsTableProps {
  products: Product[]
  onDelete?: (id: string) => void
}

export function ProductsTable({ products, onDelete }: ProductsTableProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Product</th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">Category</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-900">Price</th>
            <th className="px-6 py-3 text-right font-semibold text-gray-900">Stock</th>
            <th className="px-6 py-3 text-center font-semibold text-gray-900">Featured</th>
            <th className="px-6 py-3 text-center font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-700">{product.category}</td>
              <td className="px-6 py-4 text-right">
                <span className="font-medium text-gray-900">KES {product.price.toFixed(2)}</span>
                {product.sale_price && (
                  <p className="text-xs text-red-600">Sale: KES {product.sale_price.toFixed(2)}</p>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <span className={product.in_stock ? 'text-green-600' : 'text-red-600'}>
                  {product.stock_quantity}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {product.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                    ★
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {hoveredId === product.id && (
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

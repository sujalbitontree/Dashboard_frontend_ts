'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import NextImage from 'next/image'
import api from '@/services/api'
import { Product } from '@/types/productsSchema'
import './productDetail.css'
import { AxiosError } from 'axios'
import ProductPage from '@/components/Products/Products'
import ProductSkeleton from '@/components/skeleton/ProductSkeleton'

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      setLoading(true)
      try {
        const res = await api.get(`/products/${id}`)

        const data = res.data?.product || res.data
        const actualProduct = data.rows?.[0] || data

        if (actualProduct) {
          setProduct(actualProduct)
          console.log(
            `product.discountPercentage`,
            actualProduct.discount_percentage
          )
        } else {
          setError(true)
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 401)
          return
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading){
    console.log(`skeleton`);
    return <ProductSkeleton />}
  if (error || !product)
    return <div className="detail-error">Product not found</div>

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => router.back()}>
        ← Back to Shop
      </button>

      <div className="detail-grid">
        <div className="detail-image-section">
          <NextImage
            src={product.thumbnail}
            alt={product.title}
            width={550}
            height={450}
            className="main-detail-image"
            priority
          />
        </div>

        <div className="detail-info-section">
          <div className="detail-header">
            <span className="detail-brand-tag">brand : {product.brand}</span>
            <span className="detail-rating">rating : {product.rating}</span>
          </div>

          <h1 className="detail-title">{product.title}</h1>
          <p className="detail-category">
            Category: <strong>{product.category}</strong>
          </p>

          <div className="detail-price-row">
            <span className="detail-price">${product.price}</span>
            {product.discount_percentage ? (
              <span className="detail-discount">
                -{product.discount_percentage}% OFF
              </span>
            ) : null}
          </div>

          <div className="detail-stock-info">
            <span
              className={`stock-status ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}
            >
              {product.quantity > 0
                ? `In Stock (${product.quantity} units)`
                : 'Out of Stock'}
            </span>
          </div>

          <p className="detail-description">{product.description}</p>
        </div>
      </div>
    </div>
  )
}

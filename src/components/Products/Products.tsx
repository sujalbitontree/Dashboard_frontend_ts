'use client'

import { useEffect, useState } from 'react'
import './products.css'
import { Product } from '@/types/productsSchema'
import api from '@/services/api'
import NextImage from 'next/image'
import Link from 'next/link'
import { AxiosError } from 'axios'

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(1)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6',
        ...(search && { search }),
        ...(category && { category }),
        ...(brand && { brand }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      })

      const res = await api.get(`/products?${params.toString()}`)
      setProducts(res.data.data)
      console.log(`res.data.data`, res.data.data)

      setCategories((prev) => {
      const newCats = res.data.data.map((p: Product) => p.category).filter(Boolean)
      const combined = [...prev, ...newCats]
      return Array.from(new Set(combined)) 
    })
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 400)
    return () => clearTimeout(timer)
  }, [search, category, brand, minPrice, maxPrice, page])

  useEffect(() => {
    const loadInitialCategories = async () => {
      try {
        const res = await api.get('/products')
        const allData = res.data.data || res.data.rows || []

        const unique: string[] = Array.from(
          new Set(allData.map((p: Product) => p.category))
        ).filter(Boolean) as string[]

        setCategories(unique)
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 401)
          return
      }
    }

    loadInitialCategories()
  }, [])

  useEffect(()=>{
    window.scrollTo({top:0,behavior:'smooth'})
  })

  return (
    <div className="product-container">
      <div className="filter-grid">
        <div className="input-group">
          <label>Search Title</label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. Headphones"
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <div className="input-group">
          <label>Category</label>
          <select
            className="input-field"
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Brand</label>
          <input
            className="input-field"
            type="text"
            placeholder="Brand name"
            onChange={(e) => {
              setBrand(e.target.value)
              setPage(1)
            }}
           
          />
        </div>

        <div className="input-group">
          <label>Min Price</label>
          <input
            className="input-field"
            type="number"
            onChange={(e) => {
              setMinPrice(e.target.value)
              setPage(1)
            }}
            onKeyDown={(e)=>{
                if(['e','E','+','-','.'].includes(e.key)){
                  e.preventDefault()
                }
              }}
          />
        </div>

        <div className="input-group">
          <label>Max Price</label>
          <input
            className="input-field"
            type="number"
            onChange={(e) => {
              setMaxPrice(e.target.value)
              setPage(1)
            }}
             onKeyDown={(e)=>{
                if(['e','E','+','-','.'].includes(e.key)){
                  e.preventDefault()
                }
              }}
          />
        </div>
      </div>

      {products.length === 0 ? (
        <p>No Such a products found!...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link href={`products/${product.id}`} className="product-link">
                <div className="image-wrapper">
                  <NextImage
                    src={product.thumbnail}
                    alt={product.title}
                    width={400}
                    height={300}
                    className="product-thumbnail"
                    priority={product.id <= 2}
                  />
                </div>
              </Link>
              <div className="product-details">
                <span className="product-brand">{product.brand}</span>
                <h3 className="product-title">{product.title}</h3>
                <div className="discount">
                  <p className="product-price">${product.price}</p>
                  <small className="product-discount">
                    -{product.discount_percentage}% OFF
                  </small>
                </div>
                <small className="rating">
                  <span className="yellow-star">🌟</span>
                  <span className="product-rating">{product.rating}</span>
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination-container">
        <button
          className="nav-button"
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          {' '}
          Previous{' '}
        </button>

        <span>Page {page}</span>

        <button
          className="nav-button"
          onClick={() => setPage((p) => p + 1)}
          disabled={products.length < 6 || loading}
        >
          {' '}
          Next{' '}
        </button>
      </div>
    </div>
  )
}

const ProductSkeleton = () => {
  return (
    <div className="detail-container">
      <div className="detail-grid skeleton">
        <div className="detail-image-section">
          <div className="skeleton-image shimmer" />
        </div>

        <div className="detail-info-section">
          <div className="skeleton-line short shimmer" />
          <div className="skeleton-line medium shimmer" />
          <div className="skeleton-line long shimmer" />
          <div className="skeleton-line medium shimmer" />
          <div className="skeleton-line short shimmer" />
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton

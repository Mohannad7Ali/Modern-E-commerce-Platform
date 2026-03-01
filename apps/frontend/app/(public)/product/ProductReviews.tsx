'use client'
import { useState } from 'react'
import { useCreateReviewMutation, useDeleteReviewMutation } from '@/store/apis/ReviewApi'
import { Star, MessageSquare, User, Clock, ThumbsUp, Trash2, AlertCircle, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useGetMeQuery } from '@/store/apis/UserApi'
import { GetSingleProductQuery } from '@/gql/generated/graphql'
type ReviewType = NonNullable<GetSingleProductQuery['product']>['reviews'][0]
interface ProductReviewsProps {
  reviews: ReviewType[]
  productId: string
}
type Rating = 1 | 2 | 3 | 4 | 5
const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, productId }) => {
  const { data } = useGetMeQuery(undefined)
  const userId = data?.user?.id
  const [rating, setRating] = useState<Rating>(5)
  const [comment, setComment] = useState('')
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({})

  const [createReview, { isLoading: isSubmitting, error }] = useCreateReviewMutation()
  const [deleteReview] = useDeleteReviewMutation()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createReview({
        productId,
        userId,
        rating,
        comment,
      }).unwrap()
      setRating(5)
      setComment('')
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap()
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} size={16} className={`${index < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
    ))
  }

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }
  // smart function to know each rating percentage to show in the rating distribution bars
  const getRatingDistribution = () => {
    if (!reviews || reviews.length === 0) return null
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })
    const total = reviews.length
    return distribution
      .map(count => ({
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .reverse()
  }

  const ratingDistribution = getRatingDistribution()
  const averageRating = reviews?.length
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (isSubmitting) {
    return (
      <div className="my-12 flex items-center justify-center space-x-3 text-center">
        <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
        <span className="text-sm text-gray-600">Submitting your review...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-12 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
        <AlertCircle className="mr-2" size={20} />
        <span className="text-sm">Error loading reviews. Please try again later.</span>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-3">
        <h2 className="flex items-center text-xl font-semibold text-gray-800 sm:text-2xl">
          <MessageSquare className="mr-2 text-indigo-600" size={20} />
          Customer Reviews
        </h2>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} for this product
        </p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="mb-6 flex flex-col items-center gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:gap-6 sm:p-6">
          <div className="text-center">
            <div className="text-3xl font-semibold text-gray-800 sm:text-4xl">{averageRating}</div>
            <div className="mt-1 flex justify-center">{renderStars(Math.round(Number(averageRating)))}</div>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm">Based on {reviews.length} reviews</p>
          </div>
          <div className="w-full flex-1">
            {ratingDistribution?.map((data, idx) => (
              <div key={idx} className="mb-2 flex items-center text-xs sm:text-sm">
                <div className="w-12 text-right text-gray-700">{5 - idx} stars</div>
                <div className="ml-2 flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-2 w-10 text-gray-600">{data.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {userId ? (
        <div className="mb-6 rounded-lg border border-gray-100 bg-white p-4 sm:p-6">
          <h3 className="mb-3 flex items-center text-base font-semibold text-gray-800 sm:text-lg">
            <ThumbsUp className="mr-2 text-indigo-600" size={18} />
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">Your Rating</label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setRating((index + 1) as Rating)}
                      className={`transition-transform duration-150 focus:outline-none ${
                        index < rating ? 'scale-110' : ''
                      }`}
                    >
                      <Star
                        size={20}
                        className={`${index < rating ? 'fill-indigo-500 text-indigo-500' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  {rating} - {ratingLabels[rating]}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="Share your experience with this product..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700 sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} className="mr-2" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6 flex items-center rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-xs text-indigo-600 sm:text-sm">
          <AlertCircle size={16} className="mr-2" />
          Please log in to write a review.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="mb-3 flex items-center text-base font-semibold text-gray-800 sm:text-lg">
          <User className="mr-2 text-indigo-600" size={18} />
          Customer Feedback
        </h3>
        {reviews.length === 0 ? (
          <div className="rounded-lg bg-gray-50 py-8 text-center">
            <MessageSquare size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-xs text-gray-600 sm:text-sm">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
                    {review?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">{review?.user?.name || 'Anonymous'}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {(data?.user?.role === 'ADMIN' || userId === review?.user?.id) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="rounded-full p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete review"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600 sm:text-sm">
                  {expandedReviews[review.id] || (review.comment?.length || 0) <= 200
                    ? review.comment
                    : `${review.comment?.slice(0, 200)}...`}
                  {(review.comment?.length || 0) > 200 && (
                    <button
                      onClick={() => toggleReviewExpansion(review.id)}
                      className="ml-2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {expandedReviews[review.id] ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ProductReviews

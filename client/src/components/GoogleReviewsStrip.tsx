import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import type { Testimonial } from "@shared/schema";

function LoadingSkeleton() {
  return (
    <section className="py-6 bg-white border-b border-gray-100" data-testid="google-reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3" data-testid="google-reviews-header">
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-label="Google" data-testid="google-logo">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-lg font-semibold text-gray-800">Google Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <p className="text-xs text-gray-500">Loading reviews...</p>
        </div>
      </div>
    </section>
  );
}

export default function GoogleReviewsStrip() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
    : 5;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (testimonials.length === 0) {
    return null;
  }

  const displayTestimonials = testimonials.slice(0, 4);

  return (
    <section className="py-6 bg-white border-b border-gray-100" data-testid="google-reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3" data-testid="google-reviews-header">
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-label="Google" data-testid="google-logo">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-lg font-semibold text-gray-800">Google Reviews</span>
          </div>
          
          <div className="flex items-center gap-2" data-testid="google-rating-summary">
            <div className="flex items-center gap-1" data-testid="rating-stars">
              {renderStars(averageRating)}
            </div>
            <span className="text-2xl font-bold text-gray-900" data-testid="rating-value">{averageRating.toFixed(1)}</span>
            <span className="text-gray-600" data-testid="review-count">({testimonials.length} reviews)</span>
          </div>

          <p className="text-xs text-gray-500">Rating based on Google reviews</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full">
            {displayTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                data-testid={`review-card-${testimonial.id}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{testimonial.name}</p>
                    {testimonial.location && (
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm line-clamp-3">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

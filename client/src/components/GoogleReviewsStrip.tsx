import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Testimonial } from "@shared/schema";

function LoadingSkeleton() {
  return (
    <section className="py-3 bg-white border-b border-gray-100" data-testid="google-reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2" data-testid="google-reviews-header">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Google" data-testid="google-logo">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Google Reviews</span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
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

  const renderStars = (rating: number, size: string = "w-3 h-3") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
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

  return (
    <section className="py-3 bg-white border-b border-gray-100" data-testid="google-reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="flex items-center gap-2" data-testid="google-reviews-header">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Google" data-testid="google-logo">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Google Reviews</span>
          </div>
          <div className="flex items-center gap-1" data-testid="google-rating-summary">
            <div className="flex items-center gap-0.5" data-testid="rating-stars">
              {renderStars(averageRating)}
            </div>
            <span className="text-sm font-semibold text-gray-900 ml-1" data-testid="rating-value">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500" data-testid="review-count">({testimonials.length})</span>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <div className="flex animate-scroll gap-3">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-44">
                <Card 
                  className="h-full bg-gray-50 border border-gray-100 shadow-sm"
                  data-testid={`review-card-${testimonial.id}`}
                >
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Quote className="w-2 h-2 text-gray-400" />
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-2 h-2 ${
                              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs leading-tight mb-1 italic overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      "{testimonial.content}"
                    </p>
                    <p className="text-xs font-medium text-gray-800 truncate">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

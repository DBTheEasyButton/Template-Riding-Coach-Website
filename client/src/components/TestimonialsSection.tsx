import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import type { Testimonial } from "@shared/schema";
import StructuredData from "@/components/StructuredData";

interface TestimonialsSectionProps {
  title?: string;
}

export default function TestimonialsSection({ title }: TestimonialsSectionProps) {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const [hoveredTestimonial, setHoveredTestimonial] = useState<Testimonial | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  // Calculate average rating for aggregate review schema
  const averageRating = testimonials.length > 0 
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length 
    : 5;

  // Create structured data for aggregate reviews
  const reviewsStructuredData = testimonials.length > 0 ? {
    "@type": "Product",
    "name": "Dan Bizzarro Method Coaching Services",
    "description": "Professional eventing coaching services including private lessons, show-jumping clinics, and virtual riding lessons",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.slice(0, 10).map(testimonial => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": testimonial.content
    }))
  } : null;

  const handleTestimonialHover = (testimonial: Testimonial, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setHoveredTestimonial(testimonial);
  };

  const handleTestimonialLeave = () => {
    setHoveredTestimonial(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-2 h-2 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      {reviewsStructuredData && <StructuredData type="Product" data={reviewsStructuredData} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-navy mb-6">
              {title}
            </h2>
            <div className="w-24 h-1 bg-orange mx-auto"></div>
          </div>
        )}
        <div className="relative max-w-6xl mx-auto overflow-hidden">
          <div className="flex animate-scroll gap-4">
            {/* Duplicate testimonials for seamless infinite scroll */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="flex-shrink-0 w-48">
                <Card 
                  className="h-full bg-white backdrop-blur-sm border border-gray-200 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md"
                  onMouseEnter={(e) => handleTestimonialHover(testimonial, e)}
                  onMouseLeave={handleTestimonialLeave}
                >
                  <CardContent className="p-2 flex flex-col justify-between h-full">
                    <div className="mb-2">
                      <Quote className="w-3 h-3 text-navy mb-1 opacity-50" />
                      <p className="text-gray-700 leading-tight text-xs mb-2 italic overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center mb-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs truncate leading-tight">
                        {testimonial.name}
                      </h4>
                      {testimonial.location && (
                        <p className="text-gray-600 text-xs truncate leading-tight">
                          {testimonial.location}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg">
            Join hundreds of satisfied riders who have transformed their equestrian journey
          </p>
        </div>
      </div>

      {/* Fixed position expanded testimonial overlay */}
      {hoveredTestimonial && (
        <div 
          className="fixed z-[9999] pointer-events-none transition-all duration-300"
          style={{
            left: `${Math.max(20, Math.min(hoverPosition.x - 160, window.innerWidth - 340))}px`,
            top: `${Math.max(20, Math.min(hoverPosition.y - 100, window.innerHeight - 200))}px`
          }}
        >
          <Card className="w-80 bg-white border-2 border-orange-300 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={hoveredTestimonial.imageUrl || undefined} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                    {hoveredTestimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{hoveredTestimonial.name}</h3>
                  {hoveredTestimonial.location && (
                    <p className="text-sm text-gray-600">{hoveredTestimonial.location}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {renderStars(hoveredTestimonial.rating)}
              </div>
              
              <blockquote className="text-gray-700 italic leading-relaxed">
                "{hoveredTestimonial.content}"
              </blockquote>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
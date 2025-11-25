import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@shared/schema";

interface ServiceTestimonial {
  name: string;
  content: string;
  rating: number;
}

interface TestimonialStripProps {
  maxItems?: number;
  className?: string;
  customTestimonials?: ServiceTestimonial[];
}

export default function TestimonialStrip({ maxItems = 3, className = "", customTestimonials }: TestimonialStripProps) {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    enabled: !customTestimonials,
  });

  const displayTestimonials = customTestimonials 
    ? customTestimonials.slice(0, maxItems)
    : testimonials.slice(0, maxItems);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  if ((!customTestimonials && isLoading) || displayTestimonials.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex">{renderStars(5)}</div>
          <span className="text-sm text-gray-600 font-medium">Trusted by riders across the WORLD</span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {displayTestimonials.map((testimonial, index) => (
            <div 
              key={customTestimonials ? index : (testimonial as Testimonial).id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-2">
                <Quote className="w-3 h-3 text-orange flex-shrink-0 mt-0.5 opacity-60" />
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-xs text-gray-700 italic leading-relaxed"
                  >
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-navy truncate">
                      {testimonial.name}
                    </span>
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

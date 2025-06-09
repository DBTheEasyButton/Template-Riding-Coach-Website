import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const [api, setApi] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTestimonial, setHoveredTestimonial] = useState<Testimonial | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) return;

    const startAutoScroll = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(() => {
        if (!hoveredTestimonial) {
          api.scrollNext();
        }
      }, 2000);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, hoveredTestimonial]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
              What Our Riders Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the transformative experiences of riders who have embraced the Dan Bizzarro Method
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-2 h-2 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100 overflow-visible">
      <div className="container mx-auto px-4 overflow-visible">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
            What Dan's pupils say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the transformative experiences of riders who have embraced the Dan Bizzarro Method
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto overflow-visible py-20">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full overflow-visible"
          >
            <CarouselContent className="-ml-1 md:-ml-2 overflow-visible">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-1 md:pl-2 basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <div className="relative">
                    {/* Normal card */}
                    <Card 
                      className="h-full bg-white/80 backdrop-blur-sm border border-orange-200 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md"
                      onMouseEnter={(e) => handleTestimonialHover(testimonial, e)}
                      onMouseLeave={handleTestimonialLeave}
                    >
                      <CardContent className="p-2 flex flex-col justify-between h-full">
                        <div className="mb-2">
                          <Quote className="w-3 h-3 text-orange-500 mb-1 opacity-50" />
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
                        
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage 
                              src={testimonial.imageUrl || undefined} 
                              alt={testimonial.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-orange-500 text-white font-semibold text-xs">
                              {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-xs truncate">
                              {testimonial.name}
                            </h4>
                            {testimonial.location && (
                              <p className="text-gray-600 text-xs truncate">
                                {testimonial.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-orange-200 text-orange-600 hover:text-orange-700 w-6 h-6" />
            <CarouselNext className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-orange-200 text-orange-600 hover:text-orange-700 w-6 h-6" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
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
              <div className="mb-4">
                <Quote className="w-4 h-4 text-orange-500 mb-3 opacity-70" />
                <p className="text-gray-700 leading-relaxed text-xs mb-4 italic">
                  "{hoveredTestimonial.content}"
                </p>
                <div className="flex items-center mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < hoveredTestimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={hoveredTestimonial.imageUrl || undefined} 
                    alt={hoveredTestimonial.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-orange-500 text-white font-semibold text-xs">
                    {hoveredTestimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {hoveredTestimonial.name}
                  </h4>
                  {hoveredTestimonial.location && (
                    <p className="text-gray-600 text-xs">
                      {hoveredTestimonial.location}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
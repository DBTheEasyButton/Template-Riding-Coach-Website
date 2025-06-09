import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

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
        className={`w-3 h-3 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
            What Dan's pupils say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the transformative experiences of riders who have embraced the Dan Bizzarro Method
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                  <Card className="h-full bg-white/80 backdrop-blur-sm border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                      <div className="mb-3">
                        <Quote className="w-5 h-5 text-orange-500 mb-2 opacity-50" />
                        <p className="text-gray-700 leading-relaxed text-sm mb-3 italic">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center mb-2">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage 
                            src={testimonial.imageUrl || undefined} 
                            alt={testimonial.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-orange-500 text-white font-semibold text-xs">
                            {testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {testimonial.name}
                          </h4>
                          {testimonial.location && (
                            <p className="text-gray-600 text-xs">
                              {testimonial.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-orange-200 text-orange-600 hover:text-orange-700" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-orange-200 text-orange-600 hover:text-orange-700" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            Join hundreds of satisfied riders who have transformed their equestrian journey
          </p>
        </div>
      </div>
    </section>
  );
}
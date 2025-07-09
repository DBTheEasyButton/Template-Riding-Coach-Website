import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { News } from "@shared/schema";
import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { Calendar, ArrowRight } from "lucide-react";

export default function NewsPage() {
  const [, setLocation] = useLocation();
  
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(dateObj);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleArticleClick = (article: News) => {
    setLocation(`/news/${article.slug || article.id}`);
  };

  return (
    <>
      <SEOHead 
        title="Latest News & Updates - Dan Bizzarro Method"
        description="Stay updated with Dan Bizzarro's latest competitions, training insights, and equestrian journey. Get the newest updates from the world of eventing."
        keywords="Dan Bizzarro news, eventing updates, horse training blog, equestrian news, competition results"
        canonical="https://danbizzarromethod.com/news"
      />
      
      <StructuredData 
        type="website"
        data={{
          name: "Dan Bizzarro Method News",
          description: "Latest news and updates from Dan Bizzarro's eventing world",
          url: "https://danbizzarromethod.com/news"
        }}
      />

      <div className="min-h-screen bg-white">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-playfair font-bold text-navy mb-6">Latest News</h1>
              <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
              <p className="text-xl text-dark max-w-3xl mx-auto">
                Stay updated with Dan's latest competitions, training insights, and equestrian journey
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
                <p className="text-gray-600">Loading news articles...</p>
              </div>
            )}

            {/* News Grid */}
            {!isLoading && news.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article) => (
                  <article 
                    key={article.id} 
                    className="bg-gradient-to-br from-cream to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <OptimizedImage 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="p-6">
                      <div className="flex items-center text-sm text-medium mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <h2 className="text-xl font-playfair font-bold text-navy mb-3">{article.title}</h2>
                      <p className="text-dark mb-4">{article.excerpt}</p>
                      <button className="text-orange hover:text-orange/80 font-medium flex items-center transition-colors duration-200">
                        Read More <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* No News State */}
            {!isLoading && news.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">No news articles available</h2>
                <p className="text-gray-500">Check back soon for the latest updates!</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
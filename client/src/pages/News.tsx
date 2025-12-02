import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import type { News as NewsType } from "@shared/schema";
import { Calendar, ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useLocation } from "wouter";
import { getSEOConfig, getCanonicalUrl } from "@shared/seoConfig";
import { getBreadcrumbsFromPath, createBreadcrumbSchema } from "@shared/schemaHelpers";

export default function News() {
  const seoConfig = getSEOConfig('/blog');
  const breadcrumbs = getBreadcrumbsFromPath('/blog', seoConfig.h1);
  const schemas = [createBreadcrumbSchema(breadcrumbs)];

  const [, setLocation] = useLocation();
  const { data: news = [], isLoading } = useQuery<NewsType[]>({
    queryKey: ['/api/news'],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredArticle = news[0];
  const otherArticles = news.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={getCanonicalUrl(seoConfig.canonicalPath)}
        schemas={schemas}
      />
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[300px] sm:min-h-[300px] bg-gradient-to-r from-blue-600 to-blue-500 mt-14 sm:mt-16 flex">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex-1 flex items-center justify-center text-center px-4 py-12 sm:py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
              Training Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Expert tips and insights to improve your riding
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="space-y-8">
              {/* Featured Article Skeleton */}
              <div className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="md:grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-300 h-96"></div>
                  <div className="p-8 space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
              
              {/* Grid Skeleton */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div className="bg-gray-300 h-48"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredArticle && (
                <div 
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 mb-12 cursor-pointer"
                  onClick={() => setLocation(`/blog/${featuredArticle.slug || featuredArticle.id}`)}
                  data-testid="featured-article"
                >
                  <div className="md:grid md:grid-cols-2 gap-8">
                    <OptimizedImage 
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-96 object-cover object-center"
                      loading="eager"
                    />
                    <div className="p-8 flex flex-col justify-center">
                      <div className="inline-block mb-4">
                        <span className="bg-orange text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Featured Article
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(featuredArticle.publishedAt)}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-4">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-lg text-dark mb-6 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                      <button className="text-orange hover:text-orange/80 font-semibold flex items-center text-lg transition-colors duration-200">
                        Read Full Article <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Articles Grid */}
              {otherArticles.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherArticles.map((article) => (
                    <article 
                      key={article.id} 
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                      onClick={() => setLocation(`/blog/${article.slug || article.id}`)}
                      data-testid={`news-article-${article.id}`}
                    >
                      <OptimizedImage 
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <h3 className="text-xl font-playfair font-bold text-navy mb-3">
                          {article.title}
                        </h3>
                        <p className="text-dark mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <button className="text-orange hover:text-orange/80 font-medium flex items-center transition-colors duration-200">
                          Read More <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {news.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No blog posts available at this time.</p>
                  <p className="text-gray-500 mt-2">Check back soon for new articles!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

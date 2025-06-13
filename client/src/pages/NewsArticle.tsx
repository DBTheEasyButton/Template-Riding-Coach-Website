import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import type { News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Mail } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function NewsArticle() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [showSocialShare, setShowSocialShare] = useState(false);
  
  const { data: news = [] } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  // Find article by ID or slug
  const article = news.find(n => 
    n.id.toString() === params.id || 
    n.slug === params.id
  );

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for could not be found.</p>
          <Button onClick={() => setLocation('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = `${window.location.origin}/news/${article.slug || article.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="mb-8 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSocialShare(true)}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-800 leading-relaxed space-y-6"
            style={{ whiteSpace: 'pre-line' }}
          >
            {article.content}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Published on {formatDate(article.publishedAt)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Share:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                className="flex items-center gap-1"
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                className="flex items-center gap-1"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Check out this article: ${shareUrl}`)}`, '_blank')}
                className="flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </footer>

        {/* Related Articles */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news
              .filter(n => n.id !== article.id)
              .slice(0, 2)
              .map((relatedArticle) => (
                <div 
                  key={relatedArticle.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/news/${relatedArticle.slug || relatedArticle.id}`)}
                >
                  <OptimizedImage
                    src={relatedArticle.image}
                    alt={relatedArticle.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(relatedArticle.publishedAt)}
                      </span>
                      <Button variant="link" size="sm" className="p-0">
                        Read More →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </article>

      {/* Social Share Modal */}
      {showSocialShare && (
        <SocialShare
          isOpen={showSocialShare}
          onClose={() => setShowSocialShare(false)}
          title={article.title}
          url={shareUrl}
          description={article.excerpt}
        />
      )}
      
      <Footer />
    </div>
  );
}
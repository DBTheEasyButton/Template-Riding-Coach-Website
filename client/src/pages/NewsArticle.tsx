import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useEffect, useMemo } from "react";
import type { News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Facebook, Twitter, Mail } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

function InlineCTA() {
  const [, setLocation] = useLocation();
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg py-2 px-3 my-6 shadow-md">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button 
          size="sm"
          variant="secondary"
          className="bg-white text-blue-700 hover:bg-blue-50 text-xs px-3 py-1 h-7"
          onClick={() => setLocation('/#clinics')}
        >
          Book a Clinic
        </Button>
        <Button 
          size="sm"
          variant="secondary"
          className="bg-white text-blue-700 hover:bg-blue-50 text-xs px-3 py-1 h-7"
          onClick={() => setLocation('/coaching/private-lessons')}
        >
          Book an Individual Lesson
        </Button>
        <Button 
          size="sm"
          variant="secondary"
          className="bg-white text-blue-700 hover:bg-blue-50 text-xs px-3 py-1 h-7"
          onClick={() => setLocation('/coaching/remote')}
        >
          Book a Virtual Lesson
        </Button>
      </div>
    </div>
  );
}

export default function NewsArticle() {
  const params = useParams();
  const [, setLocation] = useLocation();
  
  const { data: news = [] } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  // Scroll to top when component mounts or article changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.id]);

  // Find article by ID or slug
  const article = news.find(n => 
    n.id.toString() === params.id || 
    n.slug === params.id
  );

  // Parse markdown-style content to HTML
  const formattedContent = useMemo(() => {
    if (!article?.content) return '';
    
    let html = article.content
      // Convert **bold** to <strong>
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Convert --- to horizontal rule
      .replace(/^---$/gm, '<hr class="my-8 border-gray-300" />')
      // Convert bullet points
      .replace(/^• (.+)$/gm, '<li class="ml-4">$1</li>')
      // Wrap consecutive <li> in <ul>
      .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc pl-6 my-4 space-y-2">$&</ul>')
      // Convert line breaks to paragraphs
      .split('\n\n')
      .map(para => {
        if (para.startsWith('<ul') || para.startsWith('<hr') || para.trim() === '') {
          return para;
        }
        return `<p class="mb-4">${para.replace(/\n/g, '<br />')}</p>`;
      })
      .join('');
    
    return html;
  }, [article?.content]);

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

  const shareUrl = `${window.location.origin}/blog/${article.slug || article.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/blog')}
          className="mb-8 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article Content */}
          <article className="flex-1 max-w-4xl">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(article.publishedAt)}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <Facebook className="w-4 h-4" />
                    Share
                  </Button>
                </div>
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

            {/* Article Content with inline CTAs */}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed [&_strong]:font-bold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2">
              {(() => {
                const paragraphs = formattedContent.split('</p>');
                const midPoint = Math.floor(paragraphs.length / 2);
                const firstHalf = paragraphs.slice(0, midPoint).join('</p>') + (midPoint > 0 ? '</p>' : '');
                const secondHalf = paragraphs.slice(midPoint).join('</p>');
                
                return (
                  <>
                    <div dangerouslySetInnerHTML={{ __html: firstHalf }} />
                    {paragraphs.length > 4 && <InlineCTA />}
                    <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
                    <InlineCTA />
                  </>
                );
              })()}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news
                  .filter(n => n.id !== article.id)
                  .slice(0, 2)
                  .map((relatedArticle) => (
                    <div 
                      key={relatedArticle.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setLocation(`/blog/${relatedArticle.slug || relatedArticle.id}`)}
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
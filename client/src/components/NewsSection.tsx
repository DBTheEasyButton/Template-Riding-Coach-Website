import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

export default function NewsSection() {
  const { data: news = [] } = useQuery<News[]>({
    queryKey: ['/api/news'],
  });

  const latestNews = news.slice(0, 3);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const defaultNews = [
    {
      id: 1,
      title: "Badminton Preparation Underway",
      excerpt: "Dan and Castello Primo are putting the finishing touches on their preparation for this year's Badminton Horse Trials, with final training sessions showing promising form...",
      image: "https://www.dbeventing.co.uk/wp-content/uploads/2023/04/dan-bizzarro-badminton-prep.jpg",
      publishedAt: "2024-03-25",
      slug: "badminton-preparation-underway"
    },
    {
      id: 2,
      title: "New Training Facility Opens",
      excerpt: "The new state-of-the-art training facility in Tuscany officially opened this week, featuring world-class amenities for both horse and rider development...",
      image: "https://www.dbeventing.co.uk/wp-content/uploads/2023/03/training-facility-tuscany.jpg",
      publishedAt: "2024-03-20",
      slug: "new-training-facility-opens"
    },
    {
      id: 3,
      title: "Awarded Rider of the Year",
      excerpt: "Dan has been honored with the prestigious International Eventing Rider of the Year award for his outstanding performances throughout the 2023 season...",
      image: "https://www.dbeventing.co.uk/wp-content/uploads/2023/12/dan-bizzarro-award-ceremony.jpg",
      publishedAt: "2024-03-15",
      slug: "awarded-rider-of-the-year"
    }
  ];

  const newsToDisplay = latestNews.length > 0 ? latestNews : defaultNews;

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-navy mb-6">Latest News</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-dark max-w-3xl mx-auto">
            Stay updated with Dan's latest competitions, training insights, and equestrian journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsToDisplay.map((article, index) => (
            <article key={article.id || index} className="bg-gradient-to-br from-cream to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
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
                <h3 className="text-xl font-playfair font-bold text-navy mb-3">{article.title}</h3>
                <p className="text-dark mb-4">{article.excerpt}</p>
                <button className="text-orange hover:text-orange/80 font-medium flex items-center transition-colors duration-200">
                  Read More <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-navy hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
}

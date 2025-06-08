import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { TrainingVideo } from "@shared/schema";
import { Play, Clock, Eye, Crown, Filter } from "lucide-react";

export default function TrainingVideosSection() {
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videos = [] } = useQuery<TrainingVideo[]>({
    queryKey: ['/api/training-videos', activeCategory === 'all' ? undefined : activeCategory],
    queryFn: () => {
      const url = activeCategory === 'all' ? '/api/training-videos' : `/api/training-videos?category=${activeCategory}`;
      return fetch(url).then(res => res.json());
    }
  });

  const viewCountMutation = useMutation({
    mutationFn: async (videoId: number) => {
      return await apiRequest('POST', `/api/training-videos/${videoId}/view`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/training-videos'] });
    },
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dressage': return '🎯';
      case 'jumping': return '🏆';
      case 'cross-country': return '🌲';
      case 'general': return '🎓';
      default: return '🐎';
    }
  };

  const handleVideoPlay = (video: TrainingVideo) => {
    setSelectedVideo(video);
    setIsVideoOpen(true);
    viewCountMutation.mutate(video.id);
  };

  const categories = [
    { id: 'all', label: 'All Videos', icon: '📚' },
    { id: 'dressage', label: 'Dressage', icon: '🎯' },
    { id: 'jumping', label: 'Show Jumping', icon: '🏆' },
    { id: 'cross-country', label: 'Cross-Country', icon: '🌲' },
    { id: 'general', label: 'General', icon: '🎓' }
  ];

  const filteredVideos = videos.filter(video => 
    activeCategory === 'all' || video.category === activeCategory
  );

  return (
    <section id="training-videos" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-forest mb-6">Training Videos</h2>
          <div className="w-24 h-1 bg-italian-red mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from Olympic-level expertise with our comprehensive video training library
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`${
                  activeCategory === category.id 
                    ? 'bg-forest hover:bg-green-800 text-white' 
                    : 'border-forest text-forest hover:bg-forest hover:text-white'
                } transition-all duration-300`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleVideoPlay(video)}>
              <div className="relative group">
                <img 
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className={getLevelColor(video.level)}>
                    {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
                  </Badge>
                </div>
                {video.isPremium && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-400 text-yellow-900">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {formatDuration(video.duration)}
                </div>
                <div className="absolute bottom-4 left-4 text-2xl">
                  {getCategoryIcon(video.category)}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg font-playfair text-forest line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="text-gray-600 line-clamp-3">{video.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{video.viewCount} views</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No videos available in this category yet.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-forest to-green-800 text-white rounded-2xl p-8">
            <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-playfair font-bold mb-4">Unlock Premium Content</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Get access to advanced training techniques, exclusive masterclasses, and personalized video feedback with our premium membership.
            </p>
            <Button 
              className="bg-italian-red hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>

        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-playfair text-forest">
                {selectedVideo?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedVideo && (
              <div className="space-y-4">
                <div className="aspect-video">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Badge className={getLevelColor(selectedVideo.level)}>
                      {selectedVideo.level.charAt(0).toUpperCase() + selectedVideo.level.slice(1)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{selectedVideo.viewCount} views</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatDuration(selectedVideo.duration)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
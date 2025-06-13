import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { News } from "@shared/schema";

interface FacebookShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: News;
}

export function FacebookShareModal({ isOpen, onClose, article }: FacebookShareModalProps) {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const articleUrl = `${baseUrl}/news/${article.slug || article.id}`;
  
  const [customMessage, setCustomMessage] = useState(
    `${article.title}\n\n${article.excerpt}\n\nRead more: ${articleUrl}\n\n#DanBizzarroMethod #Eventing #Horses`
  );
  
  const [postUrl, setPostUrl] = useState(articleUrl);

  const generateFacebookUrl = () => {
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedMessage = encodeURIComponent(customMessage);
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
  };

  const shareToFacebook = () => {
    const facebookUrl = generateFacebookUrl();
    window.open(facebookUrl, '_blank', 'width=600,height=500,scrollbars=yes,resizable=yes');
    
    toast({ 
      title: "Facebook opened", 
      description: "Your post is ready to share on Facebook" 
    });
    
    onClose();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      toast({ 
        title: "Copied to clipboard", 
        description: "Post content copied for manual sharing" 
      });
    } catch (error) {
      toast({ 
        title: "Failed to copy", 
        description: "Please copy the text manually",
        variant: "destructive" 
      });
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast({ 
        title: "URL copied", 
        description: "Article URL copied to clipboard" 
      });
    } catch (error) {
      toast({ 
        title: "Failed to copy URL", 
        description: "Please copy the URL manually",
        variant: "destructive" 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            Share to Facebook
          </DialogTitle>
          <DialogDescription>
            Customize your Facebook post before sharing
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Article Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex gap-4">
              {article.image && (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <Label htmlFor="message">Post Message</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              placeholder="Customize your Facebook post message..."
              className="mt-1"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {customMessage.length} characters
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy Text
              </Button>
            </div>
          </div>

          {/* Article URL */}
          <div>
            <Label htmlFor="url">Article URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrlToClipboard}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </Button>
            </div>
          </div>

          {/* Hashtag Suggestions */}
          <div>
            <Label>Suggested Hashtags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['#DanBizzarroMethod', '#Eventing', '#Horses', '#Equestrian', '#Training', '#Competition'].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomMessage(prev => prev.includes(tag) ? prev : `${prev} ${tag}`)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={shareToFacebook}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Share on Facebook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
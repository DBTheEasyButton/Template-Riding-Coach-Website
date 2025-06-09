import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Share2, Facebook, Instagram, Linkedin, Link, Copy } from "lucide-react";
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiWhatsapp } from "react-icons/si";
import type { ClinicWithSessions } from "@shared/schema";

interface SocialShareProps {
  clinic: ClinicWithSessions;
}

export default function SocialShare({ clinic }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();

  // Format clinic date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Generate clinic URL (assuming it will be accessible on the main site)
  const clinicUrl = `${window.location.origin}/clinics/${clinic.id}`;
  const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(clinic.location)}`;
  const imageUrl = clinic.image?.startsWith('http') ? clinic.image : `${window.location.origin}${clinic.image}`;

  // Generate price display for social sharing
  const getPriceDisplay = () => {
    if (clinic.hasMultipleSessions && clinic.sessions && clinic.sessions.length > 0) {
      const minPrice = Math.min(...clinic.sessions.map(s => s.price));
      return `from £${(minPrice / 100).toFixed(2)}`;
    } else if (clinic.price > 0) {
      return `£${(clinic.price / 100).toFixed(2)}`;
    } else {
      return 'Price TBA';
    }
  };

  // Generate participant count display
  const getParticipantDisplay = () => {
    if (clinic.hasMultipleSessions) {
      const totalMaxParticipants = (clinic.showJumpingMaxParticipants || 12) + (clinic.crossCountryMaxParticipants || 12);
      return `Limited to ${totalMaxParticipants} participants`;
    } else {
      return `Limited to ${clinic.maxParticipants} participants`;
    }
  };

  // Default sharing message
  const defaultMessage = `🐎 Join Dan Bizzarro's ${clinic.title}!

📅 ${formatDate(clinic.date)}
📍 ${clinic.location}
🗺️ Directions: ${mapsUrl}
💰 ${getPriceDisplay()}
👥 ${getParticipantDisplay()}

${clinic.description}

Register now: ${clinicUrl}

#Equestrian #EventRiding #DanBizzarro #HorseTraining`;

  const shareMessage = customMessage || defaultMessage;

  // Social media sharing functions
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(clinicUrl)}&quote=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(clinicUrl)}&summary=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const shareToWhatsAppBusiness = () => {
    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we copy the message
    copyToClipboard();
    toast({
      title: "Message copied!",
      description: "Post copied to clipboard. Open Instagram and paste your message.",
    });
  };

  const shareWithNativeAPI = async () => {
    if (navigator.share) {
      try {
        // Create a blob from the image for native sharing
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${clinic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`, { type: blob.type });
        
        await navigator.share({
          title: clinic.title,
          text: shareMessage,
          url: clinicUrl,
          files: [file]
        });
      } catch (error) {
        // Fallback to text-only sharing if image sharing fails
        try {
          await navigator.share({
            title: clinic.title,
            text: shareMessage,
            url: clinicUrl
          });
        } catch (fallbackError) {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "You can now paste this message anywhere.",
      });
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(clinicUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Clinic link copied to clipboard.",
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share "{clinic.title}"</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Preview</h4>
            {clinic.image && (
              <div className="mb-3">
                <img 
                  src={imageUrl} 
                  alt={clinic.title}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
            <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {shareMessage}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="customMessage">Customize Message (Optional)</Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your custom message here..."
              rows={4}
            />
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-4">
            <h4 className="font-semibold">Share on Social Media</h4>
            
            {/* Native Share Button (shows image when supported) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <Button onClick={shareWithNativeAPI} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white mb-3">
                <Share2 className="w-4 h-4 mr-2" />
                Share with Image
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={shareToFacebook} className="bg-blue-600 hover:bg-blue-700 text-white">
                <SiFacebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              
              <Button onClick={shareToTwitter} className="bg-sky-500 hover:bg-sky-600 text-white">
                <SiX className="w-4 h-4 mr-2" />
                X (Twitter)
              </Button>
              
              <Button onClick={shareToLinkedIn} className="bg-blue-700 hover:bg-blue-800 text-white">
                <SiLinkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button onClick={shareToWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
                <SiWhatsapp className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              
              <Button onClick={shareToWhatsAppBusiness} className="bg-green-700 hover:bg-green-800 text-white">
                <SiWhatsapp className="w-4 h-4 mr-2" />
                WhatsApp Web
              </Button>
              
              <Button onClick={shareToInstagram} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <SiInstagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Message
              </Button>
            </div>
          </div>

          {/* Direct Link Sharing */}
          <div className="space-y-2">
            <Label>Direct Link</Label>
            <div className="flex gap-2">
              <Input value={clinicUrl} readOnly className="flex-1" />
              <Button onClick={copyLink} variant="outline">
                <Link className="w-4 h-4 mr-1" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
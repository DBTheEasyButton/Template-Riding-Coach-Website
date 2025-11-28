
export class FacebookService {
  private appId = process.env.FACEBOOK_APP_ID;
  private appSecret = process.env.FACEBOOK_APP_SECRET;
  private pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  private apiVersion = 'v19.0';
  private simulationMode = process.env.SIMULATE_FACEBOOK_POSTS === 'true';

  async postClinic(clinicData: {
    title: string;
    description: string;
    date: Date;
    location: string;
    googleMapsLink?: string;
    imageUrl: string;
    price: number;
    maxParticipants: number;
    currentParticipants: number;
  }): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      if (this.simulationMode) {
        console.log('\n📱 [FACEBOOK SIMULATION MODE]');
        console.log(`Would post to Facebook: ${clinicData.title}`);
        console.log(`Date: ${clinicData.date.toLocaleDateString('en-GB')}`);
        console.log(`Location: ${clinicData.location}`);
        console.log(`Price: €${(clinicData.price / 100).toFixed(2)}`);
        console.log(`Capacity: ${clinicData.currentParticipants}/${clinicData.maxParticipants}`);
        if (clinicData.googleMapsLink) console.log(`Maps: ${clinicData.googleMapsLink}`);
        console.log('✓ Simulation complete - no actual post created\n');
        return { success: true, postId: 'SIMULATED_POST_ID' };
      }

      if (!this.pageAccessToken) {
        console.log('Facebook Page Access Token not configured, skipping Facebook post');
        return { success: false, error: 'Token not configured' };
      }

      const dateStr = clinicData.date.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const spotsLeft = clinicData.maxParticipants - clinicData.currentParticipants;
      const spotsText = spotsLeft > 0 ? `Only ${spotsLeft} spots available!` : 'This clinic is full';

      const bookingLink = `https://danbizzarromethod.com/coaching/clinics?utm_source=facebook&utm_medium=social&utm_campaign=clinic-${clinicData.title.toLowerCase().replace(/\s+/g, '-')}`;

      const message = `🐴 ${clinicData.title}\n\n📅 ${dateStr}\n📍 ${clinicData.location}\n\n${spotsText}\n\n💷 €${(clinicData.price / 100).toFixed(2)}\n\n${clinicData.description}\n\n✨ Ready to improve your riding? Book your spot now!\n\n${bookingLink}`;

      const payload = {
        message,
        link: bookingLink,
        published: true,
        access_token: this.pageAccessToken
      };

      if (clinicData.imageUrl) {
        const imagePayload = {
          ...payload,
          picture: clinicData.imageUrl
        };
        return await this.makeGraphAPIRequest('feed', imagePayload);
      }

      return await this.makeGraphAPIRequest('feed', payload);
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async makeGraphAPIRequest(
    endpoint: string,
    payload: Record<string, any>
  ): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
      const response = await fetch(`https://graph.facebook.com/${this.apiVersion}/me/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = (data as any).error?.message || 'Unknown Facebook API error';
        console.error('Facebook API error:', errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('Successfully posted to Facebook:', (data as any).id);
      return { success: true, postId: (data as any).id };
    } catch (error) {
      console.error('Facebook API request error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Request failed' };
    }
  }
}

export const facebookService = new FacebookService();

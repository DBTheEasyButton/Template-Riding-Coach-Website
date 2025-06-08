import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/schema";
import { Calendar, Star, Trophy, Medal } from "lucide-react";

export default function ScheduleSection() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const upcomingEvents = events.filter(e => e.type === 'upcoming').slice(0, 3);
  const recentEvents = events.filter(e => e.type === 'completed').slice(0, 3);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  const getResultIcon = (result: string) => {
    if (result?.includes('1st')) return <Trophy className="w-4 h-4" />;
    if (result?.includes('2nd')) return <Medal className="w-4 h-4" />;
    if (result?.includes('3rd')) return <Star className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getResultColor = (result: string) => {
    if (result?.includes('1st')) return 'bg-yellow-400 text-forest';
    if (result?.includes('2nd')) return 'bg-gray-300 text-forest';
    if (result?.includes('3rd')) return 'bg-amber-500 text-forest';
    return 'bg-forest text-white';
  };

  return (
    <section id="schedule" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-navy mb-6">Competition Schedule</h2>
          <div className="w-24 h-1 bg-orange mx-auto mb-8"></div>
          <p className="text-xl text-dark max-w-3xl mx-auto">
            Follow Dan's journey through the world's most prestigious equestrian competitions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-cream to-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            <h3 className="text-2xl font-playfair font-bold text-navy mb-6">Upcoming Events</h3>
            <div className="space-y-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => {
                  const dateInfo = formatDate(event.date.toString());
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
                      <div className="bg-orange text-white rounded-lg p-2 text-center min-w-[60px]">
                        <div className="text-lg font-bold">{dateInfo.day}</div>
                        <div className="text-xs">{dateInfo.month}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-navy">{event.title}</h4>
                        <p className="text-medium text-sm">{event.location} • {event.level}</p>
                        {event.horse && (
                          <div className="flex items-center mt-2 text-xs text-orange">
                            <i className="fas fa-horse mr-1"></i>
                            <span>Riding: {event.horse}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="bg-italian-red text-white rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-lg font-bold">15</div>
                      <div className="text-xs">APR</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-forest">Badminton Horse Trials</h4>
                      <p className="text-gray-600 text-sm">Badminton, England • CCI5*-L</p>
                      <div className="flex items-center mt-2 text-xs text-italian-red">
                        <i className="fas fa-horse mr-1"></i>
                        <span>Riding: Castello Primo</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="bg-italian-red text-white rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-lg font-bold">28</div>
                      <div className="text-xs">APR</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-forest">Kentucky Three-Day Event</h4>
                      <p className="text-gray-600 text-sm">Lexington, USA • CCI5*-L</p>
                      <div className="flex items-center mt-2 text-xs text-italian-red">
                        <i className="fas fa-horse mr-1"></i>
                        <span>Riding: Venetian Dream</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-forest to-green-800 text-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-playfair font-bold mb-6">Recent Results</h3>
            <div className="space-y-6">
              {recentEvents.length > 0 ? (
                recentEvents.map((event, index) => {
                  const dateInfo = formatDate(event.date.toString());
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl">
                      <div className={`${getResultColor(event.result || '')} rounded-lg p-2 text-center min-w-[60px]`}>
                        <div className="text-lg font-bold">{event.result?.split(' ')[0] || '1st'}</div>
                        <div className="text-xs">{dateInfo.month}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-green-100 text-sm">{event.location}</p>
                        <div className="flex items-center mt-2 text-xs text-yellow-400">
                          {getResultIcon(event.result || '')}
                          <span className="ml-1">{event.result} - {event.horse}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl">
                    <div className="bg-yellow-400 text-forest rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-lg font-bold">1st</div>
                      <div className="text-xs">MAR</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Adelaide CCI4*-L</h4>
                      <p className="text-green-100 text-sm">Adelaide, Australia</p>
                      <div className="flex items-center mt-2 text-xs text-yellow-400">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>1st Place - Tuscan Thunder</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-xl">
                    <div className="bg-gray-300 text-forest rounded-lg p-2 text-center min-w-[60px]">
                      <div className="text-lg font-bold">3rd</div>
                      <div className="text-xs">FEB</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Pau CCI4*-L</h4>
                      <p className="text-green-100 text-sm">Pau, France</p>
                      <div className="flex items-center mt-2 text-xs text-gray-300">
                        <Medal className="w-4 h-4 mr-1" />
                        <span>3rd Place - Castello Primo</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

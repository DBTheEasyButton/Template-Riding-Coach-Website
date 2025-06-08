import { useQuery } from "@tanstack/react-query";
import type { Achievement } from "@shared/schema";

export default function AchievementsSection() {
  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const olympicAchievements = achievements.filter(a => a.category === 'olympic');
  const worldAchievements = achievements.filter(a => a.category === 'world');
  const europeanAchievements = achievements.filter(a => a.category === 'european');
  const recentAchievements = achievements.filter(a => a.year >= 2022).slice(0, 4);

  return (
    <section id="achievements" className="py-24 bg-gradient-to-br from-forest to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold mb-6">Championship Achievements</h2>
          <div className="w-24 h-1 bg-italian-red mx-auto mb-8"></div>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            A career built on dedication, precision, and an unwavering commitment to excellence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-playfair font-bold mb-4">Olympic Games</h3>
            {olympicAchievements.length > 0 ? (
              olympicAchievements.map((achievement, index) => (
                <p key={index} className="text-green-100 mb-2">
                  {achievement.location} {achievement.year} - {achievement.position}
                </p>
              ))
            ) : (
              <>
                <p className="text-green-100 mb-4">Tokyo 2021 - Team Bronze</p>
                <p className="text-green-100 mb-4">Rio 2016 - 8th Individual</p>
                <p className="text-green-100">London 2012 - Team 4th</p>
              </>
            )}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-playfair font-bold mb-4">World Championships</h3>
            {worldAchievements.length > 0 ? (
              worldAchievements.map((achievement, index) => (
                <p key={index} className="text-green-100 mb-2">
                  {achievement.location} {achievement.year} - {achievement.position}
                </p>
              ))
            ) : (
              <>
                <p className="text-green-100 mb-4">Tryon 2018 - Team Silver</p>
                <p className="text-green-100 mb-4">Normandy 2014 - Team Bronze</p>
                <p className="text-green-100">Kentucky 2010 - 12th Individual</p>
              </>
            )}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🇪🇺</div>
            <h3 className="text-2xl font-playfair font-bold mb-4">European Championships</h3>
            {europeanAchievements.length > 0 ? (
              europeanAchievements.map((achievement, index) => (
                <p key={index} className="text-green-100 mb-2">
                  {achievement.location} {achievement.year} - {achievement.position}
                </p>
              ))
            ) : (
              <>
                <p className="text-green-100 mb-4">Avenches 2021 - Team Gold</p>
                <p className="text-green-100 mb-4">Strzegom 2017 - Individual Bronze</p>
                <p className="text-green-100">Blair 2015 - Team Silver</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-3xl p-12">
          <h3 className="text-3xl font-playfair font-bold text-center mb-12">Recent Highlights</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {recentAchievements.slice(0, 2).map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-italian-red rounded-full w-3 h-3 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg">{achievement.title}</h4>
                    <p className="text-green-100">{achievement.position} - Riding {achievement.horse}</p>
                  </div>
                </div>
              ))}
              {recentAchievements.length === 0 && (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="bg-italian-red rounded-full w-3 h-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-lg">Badminton Horse Trials 2023</h4>
                      <p className="text-green-100">2nd Place - Riding Castello Primo</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-italian-red rounded-full w-3 h-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-lg">Kentucky Three-Day Event 2023</h4>
                      <p className="text-green-100">1st Place - Riding Venetian Dream</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-6">
              {recentAchievements.slice(2, 4).map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-italian-red rounded-full w-3 h-3 mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-lg">{achievement.title}</h4>
                    <p className="text-green-100">{achievement.position} - Riding {achievement.horse}</p>
                  </div>
                </div>
              ))}
              {recentAchievements.length < 3 && (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="bg-italian-red rounded-full w-3 h-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-lg">Burghley Horse Trials 2022</h4>
                      <p className="text-green-100">3rd Place - Riding Milano Express</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-italian-red rounded-full w-3 h-3 mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-lg">Luhmühlen CCI5* 2022</h4>
                      <p className="text-green-100">1st Place - Riding Tuscan Thunder</p>
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

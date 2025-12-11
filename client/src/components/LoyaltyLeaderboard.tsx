import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Award, Calendar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LeaderboardEntry {
  rank: number;
  firstName: string;
  lastInitial: string;
  points: number;
}

export default function LoyaltyLeaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/loyalty/leaderboard', { limit: 10 }],
  });

  const getNextResetDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Next reset is June 30 or December 31
    if (month < 5) {
      // Before June, next reset is June 30
      return new Date(year, 5, 30);
    } else if (month < 11) {
      // Between June and November, next reset is December 31
      return new Date(year, 11, 31);
    } else {
      // December, next reset is June 30 next year
      return new Date(year + 1, 5, 30);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  const nextReset = getNextResetDate();
  const daysUntilReset = Math.ceil((nextReset.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-2 border-blue-200 shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">
            Points Leaderboard
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Top 5 riders earn prizes at the end of each period!
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-blue-200">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            Next Reset: <span className="text-blue-600">{formatDate(nextReset)}</span>
          </span>
          <span className="text-xs text-gray-500">
            ({daysUntilReset} days)
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : leaderboard && leaderboard.length > 0 ? (
        <div className="space-y-2" data-testid="leaderboard-list">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              data-testid={`leaderboard-entry-${entry.rank}`}
              className={`flex items-center justify-between rounded-lg border-2 transition-all ${getRankBgColor(entry.rank)} ${entry.rank <= 3 ? 'p-4' : 'p-2'}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : (
                    <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
                      {entry.rank}
                    </span>
                  )}
                </div>
                <div>
                  <span className={`font-bold text-gray-900 ${entry.rank <= 3 ? 'text-lg' : 'text-sm'}`}>
                    {entry.firstName} {entry.lastInitial}.
                  </span>
                  <p className={`text-gray-600 ${entry.rank <= 3 ? 'text-xs' : 'text-[10px]'}`}>Rank #{entry.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-blue-600 ${entry.rank <= 3 ? 'text-2xl' : 'text-lg'}`} data-testid={`points-${entry.rank}`}>
                  {entry.points}
                </div>
                {entry.rank <= 3 && <p className="text-xs text-gray-600">points</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No leaderboard data yet. Be the first to earn points!</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">How to Earn Points:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>10 points</strong> for each clinic entry</li>
          <li>• <strong>20 bonus points</strong> when a new rider uses your referral code</li>
          <li>• Earn a <strong>20% discount code</strong> every 50 points (50, 100, 150, etc.)</li>
        </ul>
      </div>
    </Card>
  );
}

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { 
  Users, 
  Calendar, 
  Mail, 
  TrendingUp, 
  DollarSign, 
  UserCheck,
  MessageSquare,
  Star,
  Clock,
  Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

interface AnalyticsData {
  totalSubscribers: number;
  totalClinics: number;
  totalRegistrations: number;
  totalRevenue: number;
  monthlyRegistrations: { month: string; count: number; revenue: number }[];
  clinicsByLevel: { level: string; count: number }[];
  subscriberGrowth: { month: string; subscribers: number }[];
  contactsByType: { type: string; count: number }[];
  loyaltyTiers: { tier: string; count: number }[];
  audioCourse: {
    totalPurchases: number;
    totalRevenue: number;
    monthlyData: { month: string; count: number; revenue: number }[];
  };
}

const COLORS = ['#f97316', '#1e40af', '#059669', '#dc2626', '#7c3aed', '#ea580c'];

export default function AdminAnalytics() {
  const [showTotal, setShowTotal] = useState(true);
  const [showClinics, setShowClinics] = useState(true);
  const [showAudioCourse, setShowAudioCourse] = useState(true);

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/admin/analytics'],
  });

  const { data: recentActivity } = useQuery<any[]>({
    queryKey: ['/api/admin/recent-activity'],
  });

  const combinedRevenueData = useMemo(() => {
    if (!analytics) return [];
    
    const clinicData = analytics.monthlyRegistrations || [];
    const audioData = analytics.audioCourse?.monthlyData || [];
    
    return clinicData.map((clinic, index) => {
      const audioMonth = audioData[index] || { revenue: 0 };
      const clinicRevenue = clinic.revenue / 100;
      const audioRevenue = audioMonth.revenue / 100;
      return {
        month: clinic.month,
        clinicRevenue,
        audioRevenue,
        totalRevenue: clinicRevenue + audioRevenue
      };
    });
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Analytics Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Track your business performance and growth</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalSubscribers || 0}</div>
              <p className="text-xs text-muted-foreground">Email newsletter subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clinics</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalClinics || 0}</div>
              <p className="text-xs text-muted-foreground">Available for registration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalRegistrations || 0}</div>
              <p className="text-xs text-muted-foreground">Clinic participants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clinic Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{((analytics?.totalRevenue || 0) / 100).toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">From clinic registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audio Course Sales</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.audioCourse?.totalPurchases || 0}</div>
              <p className="text-xs text-muted-foreground">£{((analytics?.audioCourse?.totalRevenue || 0) / 100).toFixed(0)} revenue</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="registrations" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
            <TabsTrigger value="registrations" className="text-xs sm:text-sm py-2">Registrations</TabsTrigger>
            <TabsTrigger value="audiocourse" className="text-xs sm:text-sm py-2">Audio Course</TabsTrigger>
            <TabsTrigger value="subscribers" className="text-xs sm:text-sm py-2">Subscribers</TabsTrigger>
            <TabsTrigger value="clinics" className="text-xs sm:text-sm py-2">Clinics</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm py-2">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Registration Trends</CardTitle>
                  <CardDescription>Clinic registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.monthlyRegistrations || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue breakdown by source</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showTotal" 
                        checked={showTotal} 
                        onCheckedChange={(checked) => setShowTotal(checked === true)}
                      />
                      <Label htmlFor="showTotal" className="text-sm font-medium flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-black"></span>
                        Total Revenue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showClinics" 
                        checked={showClinics} 
                        onCheckedChange={(checked) => setShowClinics(checked === true)}
                      />
                      <Label htmlFor="showClinics" className="text-sm font-medium flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                        Clinic Revenue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showAudioCourse" 
                        checked={showAudioCourse} 
                        onCheckedChange={(checked) => setShowAudioCourse(checked === true)}
                      />
                      <Label htmlFor="showAudioCourse" className="text-sm font-medium flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        Audio Course Revenue
                      </Label>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={combinedRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `£${value}`} />
                      <Tooltip formatter={(value: number) => [`£${value.toFixed(0)}`, '']} />
                      <Legend />
                      {showTotal && (
                        <Line 
                          type="monotone" 
                          dataKey="totalRevenue" 
                          name="Total Revenue"
                          stroke="#000000" 
                          strokeWidth={3} 
                        />
                      )}
                      {showClinics && (
                        <Line 
                          type="monotone" 
                          dataKey="clinicRevenue" 
                          name="Clinic Revenue"
                          stroke="#2563eb" 
                          strokeWidth={2} 
                        />
                      )}
                      {showAudioCourse && (
                        <Line 
                          type="monotone" 
                          dataKey="audioRevenue" 
                          name="Audio Course Revenue"
                          stroke="#eab308" 
                          strokeWidth={2} 
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audiocourse" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audio Course Sales Trends</CardTitle>
                  <CardDescription>Monthly purchases of Strong to Soft & Light audio course</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.audioCourse?.monthlyData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#7c3aed" name="Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audio Course Revenue</CardTitle>
                  <CardDescription>Monthly revenue from audio course sales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.audioCourse?.monthlyData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`£${(value / 100).toFixed(0)}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Audio Course Summary</CardTitle>
                <CardDescription>Last 6 months performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">{analytics?.audioCourse?.totalPurchases || 0}</div>
                    <div className="text-sm text-purple-600">Total Sales</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">£{((analytics?.audioCourse?.totalRevenue || 0) / 100).toFixed(0)}</div>
                    <div className="text-sm text-purple-600">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">
                      £{analytics?.audioCourse?.totalPurchases ? ((analytics.audioCourse.totalRevenue / analytics.audioCourse.totalPurchases) / 100).toFixed(0) : 0}
                    </div>
                    <div className="text-sm text-purple-600">Avg. Order Value</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">
                      {((analytics?.audioCourse?.monthlyData || []).reduce((sum, m) => sum + m.count, 0) / 6).toFixed(1)}
                    </div>
                    <div className="text-sm text-purple-600">Avg. Monthly Sales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscriber Growth</CardTitle>
                  <CardDescription>Newsletter subscriber growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.subscriberGrowth || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="subscribers" stroke="#059669" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loyalty Program Tiers</CardTitle>
                  <CardDescription>Distribution of loyalty program members</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.loyaltyTiers || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ tier, percent }) => `${tier} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {(analytics?.loyaltyTiers || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clinics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clinics by Experience Level</CardTitle>
                <CardDescription>Distribution of clinic difficulty levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.clinicsByLevel || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#7c3aed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions on your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'registration' && <UserCheck className="h-5 w-5 text-green-600" />}
                        {activity.type === 'contact' && <MessageSquare className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'subscription' && <Mail className="h-5 w-5 text-orange-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">No recent activity data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
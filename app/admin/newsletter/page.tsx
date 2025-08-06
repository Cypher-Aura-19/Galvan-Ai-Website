"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/components/theme-provider';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Send, 
  Plus, 
  Eye, 
  Calendar,
  BarChart3,
  UserPlus,
  MailOpen,
  MousePointer
} from 'lucide-react';
import { NewsletterStats, NewsletterSubscriber, EmailCampaign } from '@/lib/types/newsletter';

export default function AdminNewsletterPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    subject: '',
    content: '',
    htmlContent: '',
    status: 'draft' as const,
    scheduledAt: ''
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, subscribersRes, campaignsRes] = await Promise.all([
        fetch('/api/newsletter/stats'),
        fetch('/api/newsletter/subscribers'),
        fetch('/api/newsletter/campaigns')
      ]);

      const statsData = await statsRes.json();
      const subscribersData = await subscribersRes.json();
      const campaignsData = await campaignsRes.json();

      setStats(statsData.stats);
      setSubscribers(subscribersData.subscribers || []);
      setCampaigns(campaignsData.campaigns || []);
    } catch (error) {
      console.error('Failed to load newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('subject', newCampaign.subject);
      formData.append('content', newCampaign.content);
      formData.append('htmlContent', newCampaign.htmlContent);
      formData.append('status', newCampaign.status);
      formData.append('scheduledAt', newCampaign.scheduledAt);

      const response = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowCreateCampaign(false);
        setNewCampaign({ subject: '', content: '', htmlContent: '', status: 'draft', scheduledAt: '' });
        loadData();
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to send campaign:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Newsletter Dashboard</h1>
          <Button 
            onClick={() => setShowCreateCampaign(true)}
            className={`${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                +{stats?.newSubscribersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Emails Sent
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.emailsSentThisMonth || 0}</div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                This month
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Open Rate
              </CardTitle>
              <MailOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((stats?.averageOpenRate || 0) * 100).toFixed(1)}%</div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Average
              </p>
            </CardContent>
          </Card>

          <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Click Rate
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((stats?.averageClickRate || 0) * 100).toFixed(1)}%</div>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Subscribers and Campaigns */}
        <Tabs defaultValue="subscribers" className="space-y-4">
          <TabsList className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="space-y-4">
            <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle>Recent Subscribers</CardTitle>
                <CardDescription>
                  Latest newsletter subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscribers.slice(0, 10).map((subscriber) => (
                    <div key={subscriber._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{subscriber.email}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {subscriber.firstName} {subscriber.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </p>
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle>Email Campaigns</CardTitle>
                <CardDescription>
                  Manage your email campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{campaign.subject}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {campaign.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            campaign.status === 'sent' ? 'default' :
                            campaign.status === 'sending' ? 'secondary' :
                            campaign.status === 'draft' ? 'outline' : 'destructive'
                          }>
                            {campaign.status}
                          </Badge>
                          {campaign.sentAt && (
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Sent: {new Date(campaign.sentAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendCampaign(campaign._id!)}
                            className={`${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Campaign Modal */}
        {showCreateCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className={`w-full max-w-2xl mx-4 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle>Create New Campaign</CardTitle>
                <CardDescription>
                  Create a new email campaign to send to your subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject
                    </label>
                    <Input
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                      placeholder="Enter email subject"
                      required
                      className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Content
                    </label>
                    <Textarea
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                      placeholder="Enter email content"
                      rows={6}
                      required
                      className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <Select
                      value={newCampaign.status}
                      onValueChange={(value: any) => setNewCampaign({ ...newCampaign, status: value })}
                    >
                      <SelectTrigger className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newCampaign.status === 'scheduled' && (
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Schedule Date
                      </label>
                      <Input
                        type="datetime-local"
                        value={newCampaign.scheduledAt}
                        onChange={(e) => setNewCampaign({ ...newCampaign, scheduledAt: e.target.value })}
                        required
                        className={`${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateCampaign(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                    >
                      Create Campaign
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 
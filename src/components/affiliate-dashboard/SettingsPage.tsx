import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Bell,
  Moon,
  Globe,
  Camera,
  Save,
  Smartphone,
  Key,
  Fingerprint,
  AlertTriangle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

export function SettingsPage() {
  const{data:session } = useSession()
  const user = session?.user
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    firstName: user?.name || 'Alex',
    email: user?.email || 'alex.johnson@email.com',
    phone: '+61 412 345 678',
    bio: 'Digital marketer and affiliate partner based in Brisbane.',
  });
  const [notifications, setNotifications] = useState({
    emailConversions: true,
    emailPayouts: true,
    emailUpdates: false,
    pushConversions: true,
    pushPayouts: true,
    weeklyReport: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: false,
    loginAlerts: true,
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your account and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="mt-6 space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="gradient-primary text-white text-2xl">
                        {profile.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Profile Photo</h4>
                    <p className="text-sm text-slate-500">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input 
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Bio</Label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="mt-6 space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-500" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">New Conversions</p>
                        <p className="text-sm text-slate-500">Get notified when someone converts</p>
                      </div>
                      <Switch 
                        checked={notifications.emailConversions}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailConversions: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Payout Updates</p>
                        <p className="text-sm text-slate-500">Notifications about your payouts</p>
                      </div>
                      <Switch 
                        checked={notifications.emailPayouts}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailPayouts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Product Updates</p>
                        <p className="text-sm text-slate-500">News about Taskoria features</p>
                      </div>
                      <Switch 
                        checked={notifications.emailUpdates}
                        onCheckedChange={(checked) => setNotifications({...notifications, emailUpdates: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Push Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Conversion Alerts</p>
                        <p className="text-sm text-slate-500">Real-time conversion notifications</p>
                      </div>
                      <Switch 
                        checked={notifications.pushConversions}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushConversions: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Payout Alerts</p>
                        <p className="text-sm text-slate-500">Get notified when payout is processed</p>
                      </div>
                      <Switch 
                        checked={notifications.pushPayouts}
                        onCheckedChange={(checked) => setNotifications({...notifications, pushPayouts: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Reports</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Weekly Summary</p>
                      <p className="text-sm text-slate-500">Receive weekly performance report</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="mt-6 space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-500" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input type="password" placeholder="••••••••" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input type="password" placeholder="••••••••" className="pl-10" />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Update Password
                  </Button>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Authenticator App</p>
                        <p className="text-sm text-slate-500">Use Google Authenticator or similar</p>
                      </div>
                    </div>
                    <Switch 
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Biometric Login</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <Fingerprint className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Fingerprint / Face ID</p>
                        <p className="text-sm text-slate-500">Quick and secure mobile login</p>
                      </div>
                    </div>
                    <Switch 
                      checked={security.biometric}
                      onCheckedChange={(checked) => setSecurity({...security, biometric: checked})}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Login Alerts</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">New Device Alerts</p>
                      <p className="text-sm text-slate-500">Get notified of logins from new devices</p>
                    </div>
                    <Switch 
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => setSecurity({...security, loginAlerts: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-700 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Delete Account</p>
                    <p className="text-sm text-red-600">This action cannot be undone</p>
                  </div>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="mt-6 space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-500" />
                  Regional Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="en">English</option>
                      <option value="en-AU">English (Australian)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="AUD">Australian Dollar (AUD)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Australia/Brisbane">Brisbane (AEST)</option>
                      <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                      <option value="Australia/Melbourne">Melbourne (AEST/AEDT)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Moon className="w-5 h-5 mr-2 text-blue-500" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Dark Mode</p>
                    <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  );
}

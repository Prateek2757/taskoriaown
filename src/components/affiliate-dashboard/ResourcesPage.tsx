import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Search,
  Download,
  FileText,
  Mail,
  CheckCircle,
  Sparkles,
  FileImage,
  Layout,
  Copy,
  ChevronRight,
  Play,
} from 'lucide-react';
import { resources } from '@/lib/mockData';

const resourceIcons: Record<string, any> = {
  banner: FileImage,
  template: Layout,
  video: Play,
  document: FileText,
  email: Mail,
};

const commissionRules = [
  {
    tier: 'Bronze',
    rate: '10%',
    minEarnings: '$0',
    benefits: ['Basic support', 'Standard commission rates', '7-day cookie'],
  },
  {
    tier: 'Silver',
    rate: '12%',
    minEarnings: '$5,000',
    benefits: ['Priority support', 'Higher commission rates', 'Early access to features', '14-day cookie'],
  },
  {
    tier: 'Gold',
    rate: '15%',
    minEarnings: '$20,000',
    benefits: ['Dedicated account manager', 'Premium commission rates', 'Exclusive promotions', 'API access', '30-day cookie'],
  },
  {
    tier: 'Platinum',
    rate: '20%',
    minEarnings: '$50,000',
    benefits: ['VIP support', 'Maximum commission rates', 'Custom campaigns', 'Full API access', 'Co-marketing opportunities', '60-day cookie'],
  },
];

const emailTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    description: 'Introduction email for new referrals',
    subject: 'Welcome to Taskoria - Get things done!',
  },
  {
    id: '2',
    name: 'Service Provider Invite',
    description: 'Invite tradespeople to join as providers',
    subject: 'Grow your business with Taskoria',
  },
  {
    id: '3',
    name: 'Special Promotion',
    description: 'Promotional email for seasonal offers',
    subject: 'Limited time: Special offers on Taskoria',
  },
];

export function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || resource.type === activeTab || 
                      (activeTab === 'guidelines' && resource.category === 'Branding');
    return matchesSearch && matchesTab;
  });

  const handleDownload = (resourceName: string) => {
    toast.success(`Downloading ${resourceName}...`);
  };

  const handleCopyTemplate = (templateId: string, templateName: string) => {
    setCopiedTemplate(templateId);
    toast.success(`${templateName} copied to clipboard!`);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resource Center</h2>
          <p className="text-slate-500">Marketing materials and tools to boost your referrals</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Commission Tiers */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
            Commission Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {commissionRules.map((rule, index) => (
              <div 
                key={rule.tier} 
                className={`p-4 rounded-xl border-2 ${
                  index === 1 ? 'border-blue-500 bg-blue-50' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900">{rule.tier}</h4>
                  {index === 1 && (
                    <Badge className="bg-blue-500 text-white">Current</Badge>
                  )}
                </div>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-slate-900">{rule.rate}</span>
                  <span className="text-sm text-slate-500 ml-1">commission</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Min. earnings: {rule.minEarnings}</p>
                <ul className="space-y-1">
                  {rule.benefits.map((benefit, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="banner">Banners</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
          <TabsTrigger value="email">Emails</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="guidelines">Brand Guidelines</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {activeTab === 'email' ? (
            // Email Templates
            <div className="space-y-4">
              {emailTemplates.map((template) => (
                <Card key={template.id} className="border-0 shadow-card">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{template.name}</h4>
                          <p className="text-sm text-slate-500">{template.description}</p>
                          <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-600">
                              <span className="font-medium">Subject:</span> {template.subject}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyTemplate(template.id, template.name)}
                      >
                        {copiedTemplate === template.id ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Other Resources Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => {
                const Icon = resourceIcons[resource.type] || FileText;
                return (
                  <Card key={resource.id} className="border-0 shadow-card hover:shadow-card-hover transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          resource.type === 'banner' ? 'bg-purple-100' :
                          resource.type === 'template' ? 'bg-blue-100' :
                          resource.type === 'video' ? 'bg-red-100' :
                          resource.type === 'email' ? 'bg-green-100' : 'bg-slate-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            resource.type === 'banner' ? 'text-purple-600' :
                            resource.type === 'template' ? 'text-blue-600' :
                            resource.type === 'video' ? 'text-red-600' :
                            resource.type === 'email' ? 'text-green-600' : 'text-slate-600'
                          }`} />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-slate-900 mb-1">{resource.title}</h4>
                      <p className="text-sm text-slate-500 mb-4">{resource.description}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleDownload(resource.title)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredResources.length === 0 && activeTab !== 'email' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
              <p className="text-slate-500">Try adjusting your search</p>
            </div>
          )}
        </div>
      </Tabs>

      {/* Brand Guidelines CTA */}
      <Card className="border-0 shadow-card gradient-primary text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Need Custom Assets?</h3>
              <p className="text-blue-100">Contact our team for personalized marketing materials</p>
            </div>
            <Button variant="secondary" className="mt-4 md:mt-0 bg-white text-blue-600 hover:bg-blue-50">
              Request Assets
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

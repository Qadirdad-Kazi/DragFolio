import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, LayoutTemplate, Settings, BarChart, FileText, HelpCircle, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  // Mock stats
  const stats = {
    users: 1248,
    portfolios: 3567,
    templates: 24,
    visits: 15890
  };

  // Admin menu items
  const menuItems = [
    {
      title: 'Template Management',
      description: 'Create and manage portfolio templates',
      icon: <LayoutTemplate size={24} />,
      path: '/admin/templates',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: <Users size={24} />,
      path: '/admin/users',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: 'Site Settings',
      description: 'Configure global site settings',
      icon: <Settings size={24} />,
      path: '/admin/settings',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Analytics',
      description: 'View site usage and performance metrics',
      icon: <BarChart size={24} />,
      path: '/admin/analytics',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      title: 'Content Management',
      description: 'Manage blog posts and site content',
      icon: <FileText size={24} />,
      path: '/admin/content',
      color: 'bg-pink-100 text-pink-700'
    },
    {
      title: 'Help Center',
      description: 'Manage FAQs and support resources',
      icon: <HelpCircle size={24} />,
      path: '/admin/help',
      color: 'bg-yellow-100 text-yellow-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your Dragfolio platform</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="mr-4 text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-blue-100 mr-4">
                  <Users size={24} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold">{stats.users.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-green-100 mr-4">
                  <FileText size={24} className="text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Portfolios</p>
                  <h3 className="text-2xl font-bold">{stats.portfolios.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-purple-100 mr-4">
                  <LayoutTemplate size={24} className="text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Templates</p>
                  <h3 className="text-2xl font-bold">{stats.templates.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-orange-100 mr-4">
                  <BarChart size={24} className="text-orange-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Visits</p>
                  <h3 className="text-2xl font-bold">{stats.visits.toLocaleString()}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center">
                  <div className={`p-2 rounded-md ${item.color} mr-4`}>
                    {item.icon}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(item.path)}
                >
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => navigate('/admin/templates/new')}>
              Create New Template
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Go to User Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              View Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

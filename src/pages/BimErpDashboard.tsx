import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, ShoppingCart, Activity, AlertTriangle, BarChart3 } from "lucide-react";

export default function BimErpDashboard() {
  const { user } = useAuth();
  
  const sampleBids = [
    { id: "#001", project: "Project Alpha", value: "$10,000", status: "Pending" },
    { id: "#002", project: "Project Beta", value: "$8,500", status: "Accepted" },
  ];
  
  // Role-specific dashboard stats
  const getRoleSpecificStats = () => {
    switch (user?.roles[0]) {
      case UserRole.ADMIN:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard 
              title="Total Users" 
              value="124" 
              description="Active platform users" 
              icon={<Users className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Projects" 
              value="48" 
              description="Active construction projects" 
              icon={<Building className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Marketplace" 
              value="$2.4M" 
              description="Monthly transaction volume" 
              icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="System Health" 
              value="98.2%" 
              description="Platform uptime" 
              icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        );
      
      case UserRole.CONTRACTOR:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard 
              title="Active Projects" 
              value="8" 
              description="Projects in progress" 
              icon={<Building className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Pending Bids" 
              value="12" 
              description="Awaiting response" 
              icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Work Orders" 
              value="24" 
              description="Scheduled tasks" 
              icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        );
      
      case UserRole.SUPPLIER:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard 
              title="Open RFQs" 
              value="16" 
              description="Available to bid" 
              icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Active Orders" 
              value="7" 
              description="In fulfillment" 
              icon={<Building className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Revenue" 
              value="$342K" 
              description="Last 30 days" 
              icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        );
      
      case UserRole.FIELD_ENGINEER:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard 
              title="Assigned Tasks" 
              value="9" 
              description="Pending completion" 
              icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Monitored Structures" 
              value="14" 
              description="Under supervision" 
              icon={<Building className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Alerts" 
              value="3" 
              description="Require attention" 
              icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        );
      
      case UserRole.COMPLIANCE_OFFICER:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard 
              title="Compliance Checks" 
              value="32" 
              description="Completed this month" 
              icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Warranty Tracking" 
              value="47" 
              description="Active warranties" 
              icon={<Building className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Compliance Issues" 
              value="5" 
              description="Need resolution" 
              icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        );
      
      case UserRole.CUSTOMER:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard 
              title="My Projects" 
              value="3" 
              description="In progress" 
              icon={<Building className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Open Bids" 
              value="2" 
              description="Awaiting responses" 
              icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Structure Health" 
              value="Good" 
              description="Overall status" 
              icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        );
      
      default:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <DashboardCard 
              title="Projects" 
              value="--" 
              description="No data available" 
              icon={<Building className="h-4 w-4 text-muted-foreground" />} 
            />
            <DashboardCard 
              title="Activity" 
              value="--" 
              description="No data available" 
              icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
            />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your BIM ERP dashboard today
        </p>
      </div>

      {getRoleSpecificStats()}

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="structural">Structural</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>
                Integrated view of all BIM ERP modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total Users</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">124</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">150</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Active Projects</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">48</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">50</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Marketplace Volume</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2.4M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2.5M</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Platform Uptime</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">98.2%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Activity</CardTitle>
              <CardDescription>
                Recent bids, projects, and transactions
              </CardDescription>
            </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sampleBids.map((bid) => (
                        <tr key={bid.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bid.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bid.project}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bid.value}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bid.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="crm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CRM Insights</CardTitle>
              <CardDescription>
                Sales pipeline and customer relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total Leads</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">120</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">150</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Conversion Rate</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">30%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">35%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Opportunities</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">50</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Win Rate</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">25%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="structural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Structural Health</CardTitle>
              <CardDescription>
                Building monitoring and compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Inspections Completed</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">50</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">60</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Critical Issues</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Compliance Rate</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">100%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maintenance Overdue</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Dashboard card component
interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function DashboardCard({ title, value, description, icon }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

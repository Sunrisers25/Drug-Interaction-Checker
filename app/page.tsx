"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, Filter, BarChart3, Users, ShoppingCart, FileText, LogOut, Camera } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { MedicineManager } from "@/components/medicine-manager"
import { StockAlerts } from "@/components/stock-alerts"
import { QuickStats } from "@/components/quick-stats"
import { DrugInteractionChecker } from "@/components/drug-interaction-checker"
import { PatientManager } from "@/components/patient-manager"
import { SalesBilling } from "@/components/sales-billing"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { SecuritySettings } from "@/components/security-settings"
import CameraDetection from "@/components/camera-detection"
import { toast } from "@/hooks/use-toast"

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string } | null>(null)

  const handleLogin = (credentials: { username: string; password: string }) => {
    setIsAuthenticated(true)
    setUser({ username: credentials.username })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setActiveTab("dashboard")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">PharmaCare Pro</h1>
                <p className="text-sm text-muted-foreground">Pharmacy Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                System Online
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="medicines" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Medicines
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <QuickStats />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <StockAlerts />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">Medicine added: Paracetamol 500mg</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">Low stock alert: Aspirin</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Sale completed: $45.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medicines" className="space-y-6">
            <MedicineManager />
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <DrugInteractionChecker />
          </TabsContent>

          <TabsContent value="camera" className="space-y-6">
            <CameraDetection />
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <PatientManager />
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <SalesBilling />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

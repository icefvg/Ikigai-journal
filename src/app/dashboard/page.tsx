"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity,
  Plus,
  Search,
  Filter,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await import("@/lib/firebase").then(({ logoutUser }) => logoutUser())
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Mock data for demonstration
  const portfolioStats = {
    totalValue: 125430.50,
    dailyPnl: 2340.30,
    dailyPnlPercent: 1.9,
    totalTrades: 342,
    winRate: 68.5,
    sharpeRatio: 2.34
  }

  const recentTrades = [
    {
      id: 1,
      symbol: "AAPL",
      direction: "buy",
      quantity: 100,
      entryPrice: 175.50,
      exitPrice: 178.25,
      pnl: 275.00,
      status: "closed",
      date: "2024-01-15"
    },
    {
      id: 2,
      symbol: "TSLA",
      direction: "sell",
      quantity: 50,
      entryPrice: 245.00,
      exitPrice: 238.50,
      pnl: 325.00,
      status: "closed",
      date: "2024-01-14"
    },
    {
      id: 3,
      symbol: "NVDA",
      direction: "buy",
      quantity: 75,
      entryPrice: 520.00,
      exitPrice: null,
      pnl: -1200.00,
      status: "open",
      date: "2024-01-13"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-card border-r z-40 lg:translate-x-0"
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">i</span>
            </div>
            <span className="font-bold text-xl">ikigai Journal</span>
          </div>
          
          <nav className="space-y-2">
            {[
              { icon: BarChart3, label: "Dashboard", active: true },
              { icon: Activity, label: "Trades" },
              { icon: PieChart, label: "Portfolio" },
              { icon: TrendingUp, label: "Analytics" },
              { icon: Calendar, label: "Calendar" },
              { icon: Settings, label: "Settings" }
            ].map((item, index) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium hidden md:block">
                  {user.email?.split('@')[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Portfolio Value",
                value: `$${portfolioStats.totalValue.toLocaleString()}`,
                change: portfolioStats.dailyPnl,
                changePercent: portfolioStats.dailyPnlPercent,
                icon: DollarSign,
                color: "text-green-600"
              },
              {
                title: "Total Trades",
                value: portfolioStats.totalTrades.toString(),
                change: null,
                changePercent: null,
                icon: Activity,
                color: "text-blue-600"
              },
              {
                title: "Win Rate",
                value: `${portfolioStats.winRate}%`,
                change: null,
                changePercent: null,
                icon: TrendingUp,
                color: "text-green-600"
              },
              {
                title: "Sharpe Ratio",
                value: portfolioStats.sharpeRatio.toString(),
                change: null,
                changePercent: null,
                icon: BarChart3,
                color: "text-purple-600"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        {stat.change && (
                          <div className="flex items-center space-x-1 mt-1">
                            <TrendingUp className={`h-4 w-4 ${stat.color}`} />
                            <span className={`text-sm ${stat.color}`}>
                              +${stat.change.toLocaleString()} (+{stat.changePercent}%)
                            </span>
                          </div>
                        )}
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trades">Recent Trades</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Distribution</CardTitle>
                    <CardDescription>Asset allocation across your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Stocks", value: 65, color: "bg-blue-500" },
                        { name: "Crypto", value: 20, color: "bg-green-500" },
                        { name: "Forex", value: 10, color: "bg-yellow-500" },
                        { name: "Options", value: 5, color: "bg-purple-500" }
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Trade
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      View Trade Calendar
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter Trades
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trades" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                  <CardDescription>Your latest trading activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            trade.direction === "buy" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}>
                            {trade.direction === "buy" ? 
                              <TrendingUp className="h-5 w-5" /> : 
                              <TrendingDown className="h-5 w-5" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{trade.symbol}</p>
                            <p className="text-sm text-muted-foreground">{trade.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toLocaleString()}
                          </p>
                          <Badge variant={trade.status === "open" ? "default" : "secondary"}>
                            {trade.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { metric: "Total Return", value: "+24.5%", status: "positive" },
                        { metric: "Max Drawdown", value: "-8.2%", status: "negative" },
                        { metric: "Profit Factor", value: "2.34", status: "positive" },
                        { metric: "Average Trade", value: "+$127.50", status: "positive" }
                      ].map((item) => (
                        <div key={item.metric} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.metric}</span>
                          <span className={`text-sm font-medium ${
                            item.status === "positive" ? "text-green-600" : "text-red-600"
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                    <CardDescription>Risk metrics and exposure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { metric: "Portfolio Beta", value: "1.05" },
                        { metric: "Value at Risk (95%)", value: "-$2,340" },
                        { metric: "Sharpe Ratio", value: "2.34" },
                        { metric: "Sortino Ratio", value: "2.89" }
                      ].map((item) => (
                        <div key={item.metric} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.metric}</span>
                          <span className="text-sm font-medium text-blue-600">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Your trading performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">Performance chart will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Activity,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Percent,
  Clock,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface PerformanceMetric {
  name: string
  value: string
  change: string
  status: "positive" | "negative" | "neutral"
  description: string
}

interface TradeStat {
  period: string
  trades: number
  winRate: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  sharpeRatio: number
  maxDrawdown: number
}

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("1m")
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  // Mock performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    {
      name: "Total Return",
      value: "+27.4%",
      change: "+2.3%",
      status: "positive",
      description: "Overall portfolio performance"
    },
    {
      name: "Win Rate",
      value: "68.5%",
      change: "+1.2%",
      status: "positive",
      description: "Percentage of profitable trades"
    },
    {
      name: "Profit Factor",
      value: "2.34",
      change: "+0.15",
      status: "positive",
      description: "Ratio of gross profits to losses"
    },
    {
      name: "Sharpe Ratio",
      value: "2.18",
      change: "-0.08",
      status: "negative",
      description: "Risk-adjusted return measure"
    },
    {
      name: "Max Drawdown",
      value: "-8.2%",
      change: "-0.5%",
      status: "negative",
      description: "Maximum peak to trough decline"
    },
    {
      name: "Average Trade",
      value: "+$127.50",
      change: "+$12.30",
      status: "positive",
      description: "Average profit per trade"
    }
  ]

  // Mock trade statistics by period
  const tradeStats: TradeStat[] = [
    {
      period: "This Week",
      trades: 12,
      winRate: 75.0,
      avgWin: 245.50,
      avgLoss: -125.25,
      profitFactor: 2.95,
      sharpeRatio: 2.85,
      maxDrawdown: -3.2
    },
    {
      period: "This Month",
      trades: 48,
      winRate: 68.5,
      avgWin: 198.75,
      avgLoss: -142.30,
      profitFactor: 2.34,
      sharpeRatio: 2.18,
      maxDrawdown: -8.2
    },
    {
      period: "This Quarter",
      trades: 142,
      winRate: 65.2,
      avgWin: 185.40,
      avgLoss: -155.80,
      profitFactor: 1.98,
      sharpeRatio: 1.95,
      maxDrawdown: -12.5
    },
    {
      period: "This Year",
      trades: 342,
      winRate: 68.5,
      avgWin: 175.25,
      avgLoss: -138.90,
      profitFactor: 2.34,
      sharpeRatio: 2.18,
      maxDrawdown: -15.8
    }
  ]

  // Mock asset class performance
  const assetClassPerformance = [
    { name: "Stocks", return: 22.5, trades: 245, winRate: 70.2, color: "bg-blue-500" },
    { name: "Crypto", return: 45.8, trades: 67, winRate: 62.5, color: "bg-green-500" },
    { name: "Forex", return: 8.2, trades: 18, winRate: 55.6, color: "bg-yellow-500" },
    { name: "Options", return: 15.7, trades: 12, winRate: 58.3, color: "bg-purple-500" }
  ]

  // Mock strategy performance
  const strategyPerformance = [
    { name: "Momentum Breakout", trades: 89, winRate: 72.5, return: 28.4, sharpe: 2.45 },
    { name: "Mean Reversion", trades: 156, winRate: 65.8, return: 18.2, sharpe: 1.85 },
    { name: "Trend Following", trades: 67, winRate: 70.1, return: 32.1, sharpe: 2.65 },
    { name: "Breakout", trades: 30, winRate: 60.0, return: 12.8, sharpe: 1.45 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive": return "text-green-600"
      case "negative": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "positive": return TrendingUp
      case "negative": return TrendingDown
      default: return Activity
    }
  }

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
              { icon: BarChart3, label: "Dashboard" },
              { icon: TrendingUp, label: "Trades" },
              { icon: PieChart, label: "Portfolio" },
              { icon: Activity, label: "Analytics", active: true },
              { icon: Target, label: "Reports" },
              { icon: Calendar, label: "Settings" }
            ].map((item) => (
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
        </div>
      </motion.div>

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
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <h1 className="text-2xl font-bold">Analytics</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1w">1 Week</SelectItem>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {performanceMetrics.slice(0, 3).map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.name}
                        </p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {(() => {
                            const Icon = getStatusIcon(metric.status)
                            return <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                          })()}
                          <span className={`text-sm ${getStatusColor(metric.status)}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="assets">Asset Classes</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Detailed performance analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {performanceMetrics.map((metric) => (
                        <div key={metric.name} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{metric.name}</span>
                              {(() => {
                                const Icon = getStatusIcon(metric.status)
                                return <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                              })()}
                            </div>
                            <p className="text-sm text-muted-foreground">{metric.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{metric.value}</div>
                            <div className={`text-sm ${getStatusColor(metric.status)}`}>
                              {metric.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Period Comparison</CardTitle>
                    <CardDescription>Performance across different time periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tradeStats.map((stat) => (
                        <div key={stat.period} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">{stat.period}</h4>
                            <Badge variant={stat.winRate > 65 ? "default" : "secondary"}>
                              {stat.winRate.toFixed(1)}% Win Rate
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Trades:</span>
                              <span className="font-medium ml-1">{stat.trades}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Profit Factor:</span>
                              <span className="font-medium ml-1">{stat.profitFactor}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Win:</span>
                              <span className="text-green-600 font-medium ml-1">
                                +${stat.avgWin.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Avg Loss:</span>
                              <span className="text-red-600 font-medium ml-1">
                                ${stat.avgLoss.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sharpe:</span>
                              <span className="font-medium ml-1">{stat.sharpeRatio}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Max DD:</span>
                              <span className="text-red-600 font-medium ml-1">
                                {stat.maxDrawdown.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategy Performance</CardTitle>
                  <CardDescription>Analysis of your trading strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategyPerformance.map((strategy) => (
                      <div key={strategy.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{strategy.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={strategy.winRate > 65 ? "default" : "secondary"}>
                              {strategy.winRate.toFixed(1)}% Win Rate
                            </Badge>
                            <Badge variant="outline">
                              {strategy.trades} trades
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Return</div>
                            <div className={`font-semibold ${strategy.return > 20 ? "text-green-600" : "text-blue-600"}`}>
                              +{strategy.return}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Win Rate</div>
                            <div className="font-semibold">{strategy.winRate.toFixed(1)}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                            <div className={`font-semibold ${strategy.sharpe > 2 ? "text-green-600" : "text-yellow-600"}`}>
                              {strategy.sharpe}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Strategy Efficiency</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.min((strategy.winRate / 80) * 100, 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={Math.min((strategy.winRate / 80) * 100, 100)} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Class Performance</CardTitle>
                    <CardDescription>Performance breakdown by asset class</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assetClassPerformance.map((asset) => (
                        <div key={asset.name} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded-full ${asset.color}`} />
                              <h4 className="font-semibold">{asset.name}</h4>
                            </div>
                            <Badge className={asset.return > 20 ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}>
                              +{asset.return}%
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Trades:</span>
                              <span className="font-medium ml-1">{asset.trades}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Win Rate:</span>
                              <span className="font-medium ml-1">{asset.winRate.toFixed(1)}%</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Performance</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.min((asset.return / 50) * 100, 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={Math.min((asset.return / 50) * 100, 100)} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>Current portfolio allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Stocks", value: 65, allocation: "$81,530", color: "bg-blue-500" },
                        { name: "Crypto", value: 22.5, allocation: "$28,222", color: "bg-green-500" },
                        { name: "Forex", value: 7.5, allocation: "$9,407", color: "bg-yellow-500" },
                        { name: "Options", value: 5, allocation: "$6,272", color: "bg-purple-500" }
                      ].map((item) => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{item.value}%</span>
                              <div className="text-xs text-muted-foreground">{item.allocation}</div>
                            </div>
                          </div>
                          <Progress value={item.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Metrics</CardTitle>
                    <CardDescription>Key risk indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { metric: "Value at Risk (95%)", value: "-$2,340", description: "Maximum expected loss over 1 day", status: "moderate" },
                        { metric: "Beta", value: "1.05", description: "Market correlation", status: "low" },
                        { metric: "Sortino Ratio", value: "2.89", description: "Downside risk-adjusted return", status: "good" },
                        { metric: "Calmar Ratio", value: "3.42", description: "Return vs maximum drawdown", status: "good" },
                        { metric: "Portfolio VaR", value: "-$8,750", description: "Weekly portfolio VaR", status: "moderate" },
                        { metric: "Expected Shortfall", value: "-$4,120", description: "Average loss beyond VaR", status: "moderate" }
                      ].map((risk) => (
                        <div key={risk.metric} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{risk.metric}</span>
                              {risk.status === "good" && <Award className="h-4 w-4 text-green-600" />}
                              {risk.status === "moderate" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                              {risk.status === "low" && <Activity className="h-4 w-4 text-blue-600" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{risk.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{risk.value}</div>
                            <Badge variant="outline" className={
                              risk.status === "good" ? "border-green-600 text-green-600" :
                              risk.status === "moderate" ? "border-yellow-600 text-yellow-600" :
                              "border-blue-600 text-blue-600"
                            }>
                              {risk.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Drawdown Analysis</CardTitle>
                    <CardDescription>Historical drawdown periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { period: "Jan 2024", drawdown: -3.2, duration: "5 days", recovery: "2 days" },
                        { period: "Dec 2023", drawdown: -8.2, duration: "12 days", recovery: "8 days" },
                        { period: "Oct 2023", drawdown: -5.8, duration: "7 days", recovery: "5 days" },
                        { period: "Aug 2023", drawdown: -12.5, duration: "21 days", recovery: "15 days" },
                        { period: "Jun 2023", drawdown: -6.9, duration: "9 days", recovery: "6 days" }
                      ].map((dd) => (
                        <div key={dd.period} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{dd.period}</h4>
                            <Badge className="text-red-600 bg-red-100">
                              {dd.drawdown}%
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="font-medium ml-1">{dd.duration}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Recovery:</span>
                              <span className="font-medium ml-1">{dd.recovery}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Severity</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.min((Math.abs(dd.drawdown) / 20) * 100, 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={Math.min((Math.abs(dd.drawdown) / 20) * 100, 100)} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
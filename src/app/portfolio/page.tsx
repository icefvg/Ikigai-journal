"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus,
  Search,
  Settings,
  BarChart3,
  Wallet,
  Activity,
  Target,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Account {
  id: string
  name: string
  broker: string
  accountType: string
  currency: string
  initialBalance: number
  currentBalance: number
  isActive: boolean
  createdAt: string
}

interface Portfolio {
  id: string
  name: string
  description?: string
  initialValue: number
  currentValue: number
  targetReturn?: number
  maxDrawdown?: number
  isActive: boolean
  createdAt: string
  accountId?: string
}

interface Position {
  id: string
  symbol: string
  assetClass: string
  quantity: number
  entryPrice: number
  currentPrice: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  weight: number
}

export default function PortfolioPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showAddPortfolio, setShowAddPortfolio] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  // Mock accounts data
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      name: "Primary Trading Account",
      broker: "Interactive Brokers",
      accountType: "margin",
      currency: "USD",
      initialBalance: 100000,
      currentBalance: 125430.50,
      isActive: true,
      createdAt: "2023-01-15"
    },
    {
      id: "2",
      name: "Crypto Trading",
      broker: "Binance",
      accountType: "cash",
      currency: "USD",
      initialBalance: 25000,
      currentBalance: 31250.75,
      isActive: true,
      createdAt: "2023-06-20"
    }
  ])

  // Mock portfolios data
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: "1",
      name: "Growth Portfolio",
      description: "High-growth stocks and crypto",
      initialValue: 75000,
      currentValue: 95420.25,
      targetReturn: 25,
      maxDrawdown: 15,
      isActive: true,
      createdAt: "2023-01-15",
      accountId: "1"
    },
    {
      id: "2",
      name: "Conservative Portfolio",
      description: "Blue-chip stocks and bonds",
      initialValue: 50000,
      currentValue: 61260.00,
      targetReturn: 12,
      maxDrawdown: 8,
      isActive: true,
      createdAt: "2023-03-10"
    }
  ])

  // Mock positions data
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      symbol: "AAPL",
      assetClass: "stock",
      quantity: 100,
      entryPrice: 175.50,
      currentPrice: 182.25,
      unrealizedPnl: 675.00,
      unrealizedPnlPercent: 3.85,
      weight: 15.2
    },
    {
      id: "2",
      symbol: "TSLA",
      assetClass: "stock",
      quantity: 50,
      entryPrice: 245.00,
      currentPrice: 238.50,
      unrealizedPnl: -325.00,
      unrealizedPnlPercent: -2.65,
      weight: 8.7
    },
    {
      id: "3",
      symbol: "BTC",
      assetClass: "crypto",
      quantity: 0.5,
      entryPrice: 45000,
      currentPrice: 48250,
      unrealizedPnl: 1625.00,
      unrealizedPnlPercent: 7.22,
      weight: 22.5
    },
    {
      id: "4",
      symbol: "NVDA",
      assetClass: "stock",
      quantity: 75,
      entryPrice: 520.00,
      currentPrice: 545.00,
      unrealizedPnl: 1875.00,
      unrealizedPnlPercent: 4.81,
      weight: 18.9
    }
  ])

  // New account form state
  const [newAccount, setNewAccount] = useState({
    name: "",
    broker: "",
    accountType: "",
    currency: "USD",
    initialBalance: ""
  })

  // New portfolio form state
  const [newPortfolio, setNewPortfolio] = useState({
    name: "",
    description: "",
    initialValue: "",
    targetReturn: "",
    maxDrawdown: ""
  })

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

  const totalPortfolioValue = accounts.reduce((sum, account) => sum + account.currentBalance, 0)
  const totalUnrealizedPnl = positions.reduce((sum, position) => sum + position.unrealizedPnl, 0)
  const totalReturn = ((totalPortfolioValue - accounts.reduce((sum, account) => sum + account.initialBalance, 0)) / accounts.reduce((sum, account) => sum + account.initialBalance, 0)) * 100

  const handleAddAccount = () => {
    const account: Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      broker: newAccount.broker,
      accountType: newAccount.accountType,
      currency: newAccount.currency,
      initialBalance: parseFloat(newAccount.initialBalance),
      currentBalance: parseFloat(newAccount.initialBalance),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setAccounts([...accounts, account])
    setShowAddAccount(false)
    setNewAccount({
      name: "",
      broker: "",
      accountType: "",
      currency: "USD",
      initialBalance: ""
    })
    toast.success("Account added successfully!")
  }

  const handleAddPortfolio = () => {
    const portfolio: Portfolio = {
      id: Date.now().toString(),
      name: newPortfolio.name,
      description: newPortfolio.description,
      initialValue: parseFloat(newPortfolio.initialValue),
      currentValue: parseFloat(newPortfolio.initialValue),
      targetReturn: newPortfolio.targetReturn ? parseFloat(newPortfolio.targetReturn) : undefined,
      maxDrawdown: newPortfolio.maxDrawdown ? parseFloat(newPortfolio.maxDrawdown) : undefined,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setPortfolios([...portfolios, portfolio])
    setShowAddPortfolio(false)
    setNewPortfolio({
      name: "",
      description: "",
      initialValue: "",
      targetReturn: "",
      maxDrawdown: ""
    })
    toast.success("Portfolio added successfully!")
  }

  const getAssetClassColor = (assetClass: string) => {
    switch (assetClass) {
      case "stock": return "bg-blue-100 text-blue-600"
      case "crypto": return "bg-green-100 text-green-600"
      case "forex": return "bg-yellow-100 text-yellow-600"
      case "options": return "bg-purple-100 text-purple-600"
      case "futures": return "bg-red-100 text-red-600"
      default: return "bg-gray-100 text-gray-600"
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
              { icon: PieChart, label: "Portfolio", active: true },
              { icon: Activity, label: "Analytics" },
              { icon: Target, label: "Reports" },
              { icon: Settings, label: "Settings" }
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
              <h1 className="text-2xl font-bold">Portfolio</h1>
            </div>
            
            <div className="flex items-center space-x-4">
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
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Value",
                value: `$${totalPortfolioValue.toLocaleString()}`,
                change: totalReturn,
                icon: DollarSign,
                color: totalReturn >= 0 ? "text-green-600" : "text-red-600"
              },
              {
                title: "Unrealized P&L",
                value: `${totalUnrealizedPnl >= 0 ? "+" : ""}$${totalUnrealizedPnl.toLocaleString()}`,
                change: null,
                icon: TrendingUp,
                color: totalUnrealizedPnl >= 0 ? "text-green-600" : "text-red-600"
              },
              {
                title: "Total Accounts",
                value: accounts.length.toString(),
                change: null,
                icon: Wallet,
                color: "text-blue-600"
              },
              {
                title: "Active Positions",
                value: positions.length.toString(),
                change: null,
                icon: Activity,
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
                        {stat.change !== null && (
                          <div className="flex items-center space-x-1 mt-1">
                            {stat.change >= 0 ? 
                              <TrendingUp className={`h-4 w-4 ${stat.color}`} /> : 
                              <TrendingDown className={`h-4 w-4 ${stat.color}`} />
                            }
                            <span className={`text-sm ${stat.color}`}>
                              {stat.change >= 0 ? "+" : ""}{stat.change.toFixed(2)}%
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
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>Distribution across asset classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Stocks", value: 65, color: "bg-blue-500" },
                        { name: "Crypto", value: 22.5, color: "bg-green-500" },
                        { name: "Forex", value: 7.5, color: "bg-yellow-500" },
                        { name: "Options", value: 5, color: "bg-purple-500" }
                      ].map((item) => (
                        <div key={item.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{item.value}%</span>
                          </div>
                          <Progress value={item.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>Key portfolio metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { metric: "Total Return", value: "+27.2%", status: "positive" },
                        { metric: "Daily P&L", value: "+$1,240.50", status: "positive" },
                        { metric: "Win Rate", value: "68.5%", status: "positive" },
                        { metric: "Max Drawdown", value: "-8.2%", status: "negative" }
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
              </div>
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trading Accounts</h2>
                <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Account</DialogTitle>
                      <DialogDescription>
                        Connect a new trading account to track
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          placeholder="Primary Trading Account"
                          value={newAccount.name}
                          onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="broker">Broker</Label>
                        <Select value={newAccount.broker} onValueChange={(value) => setNewAccount({...newAccount, broker: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select broker" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="interactive_brokers">Interactive Brokers</SelectItem>
                            <SelectItem value="td_ameritrade">TD Ameritrade</SelectItem>
                            <SelectItem value="fidelity">Fidelity</SelectItem>
                            <SelectItem value="binance">Binance</SelectItem>
                            <SelectItem value="coinbase">Coinbase</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountType">Account Type</Label>
                        <Select value={newAccount.accountType} onValueChange={(value) => setNewAccount({...newAccount, accountType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="margin">Margin</SelectItem>
                            <SelectItem value="retirement">Retirement</SelectItem>
                            <SelectItem value="demo">Demo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="initialBalance">Initial Balance</Label>
                        <Input
                          id="initialBalance"
                          type="number"
                          placeholder="10000"
                          value={newAccount.initialBalance}
                          onChange={(e) => setNewAccount({...newAccount, initialBalance: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddAccount(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAccount}>
                        Add Account
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {accounts.map((account) => (
                  <Card key={account.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{account.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{account.broker}</Badge>
                            <Badge variant="secondary">{account.accountType}</Badge>
                            <Badge className={account.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}>
                              {account.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${account.currentBalance.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {account.currency}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Initial Balance</div>
                          <div className="font-medium">${account.initialBalance.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Return</div>
                          <div className={`font-medium ${
                            ((account.currentBalance - account.initialBalance) / account.initialBalance) >= 0 
                              ? "text-green-600" : "text-red-600"
                          }`}>
                            {(((account.currentBalance - account.initialBalance) / account.initialBalance) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolios" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Investment Portfolios</h2>
                <Dialog open={showAddPortfolio} onOpenChange={setShowAddPortfolio}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Portfolio
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Portfolio</DialogTitle>
                      <DialogDescription>
                        Set up a new investment portfolio
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="portfolioName">Portfolio Name</Label>
                        <Input
                          id="portfolioName"
                          placeholder="Growth Portfolio"
                          value={newPortfolio.name}
                          onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          placeholder="High-growth stocks and crypto"
                          value={newPortfolio.description}
                          onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="initialValue">Initial Value</Label>
                        <Input
                          id="initialValue"
                          type="number"
                          placeholder="50000"
                          value={newPortfolio.initialValue}
                          onChange={(e) => setNewPortfolio({...newPortfolio, initialValue: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="targetReturn">Target Return %</Label>
                          <Input
                            id="targetReturn"
                            type="number"
                            placeholder="25"
                            value={newPortfolio.targetReturn}
                            onChange={(e) => setNewPortfolio({...newPortfolio, targetReturn: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxDrawdown">Max Drawdown %</Label>
                          <Input
                            id="maxDrawdown"
                            type="number"
                            placeholder="15"
                            value={newPortfolio.maxDrawdown}
                            onChange={(e) => setNewPortfolio({...newPortfolio, maxDrawdown: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddPortfolio(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPortfolio}>
                        Create Portfolio
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {portfolios.map((portfolio) => {
                  const returnPercent = ((portfolio.currentValue - portfolio.initialValue) / portfolio.initialValue) * 100
                  return (
                    <Card key={portfolio.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{portfolio.name}</h3>
                            {portfolio.description && (
                              <p className="text-sm text-muted-foreground mt-1">{portfolio.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={portfolio.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}>
                                {portfolio.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {portfolio.targetReturn && (
                                <Badge variant="outline">Target: {portfolio.targetReturn}%</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">${portfolio.currentValue.toLocaleString()}</div>
                            <div className={`text-sm font-medium ${returnPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {returnPercent >= 0 ? "+" : ""}{returnPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Initial Value</div>
                            <div className="font-medium">${portfolio.initialValue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Current Value</div>
                            <div className="font-medium">${portfolio.currentValue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">P&L</div>
                            <div className={`font-medium ${returnPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {returnPercent >= 0 ? "+" : ""}${(portfolio.currentValue - portfolio.initialValue).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        {portfolio.targetReturn && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Progress to Target</span>
                              <span className="text-sm text-muted-foreground">{Math.min(returnPercent, portfolio.targetReturn).toFixed(1)}% / {portfolio.targetReturn}%</span>
                            </div>
                            <Progress value={Math.min((returnPercent / portfolio.targetReturn) * 100, 100)} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="positions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Positions</CardTitle>
                  <CardDescription>All open positions across your accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <motion.div
                        key={position.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{position.symbol}</h3>
                                <Badge variant="outline" className={getAssetClassColor(position.assetClass)}>
                                  {position.assetClass}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <span>{position.quantity} shares</span>
                                <span>@ ${position.entryPrice}</span>
                                <span>→ ${position.currentPrice}</span>
                                <span>• {position.weight}% of portfolio</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className={`font-semibold ${position.unrealizedPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {position.unrealizedPnl >= 0 ? "+" : ""}${position.unrealizedPnl.toLocaleString()}
                              </div>
                              <div className={`text-sm ${position.unrealizedPnlPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {position.unrealizedPnlPercent >= 0 ? "+" : ""}{position.unrealizedPnlPercent.toFixed(2)}%
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
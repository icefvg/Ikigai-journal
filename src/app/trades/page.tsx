"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Trade {
  id: string
  symbol: string
  assetClass: string
  direction: "buy" | "sell"
  quantity: number
  entryPrice: number
  exitPrice?: number
  entryDate: string
  exitDate?: string
  status: "open" | "closed" | "partial"
  entryReason: string
  exitReason?: string
  strategy?: string
  notes?: string
  commission: number
  slippage: number
  tags?: string
  unrealizedPnl?: number
  realizedPnl?: number
}

export default function TradesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddTrade, setShowAddTrade] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { user, loading } = useAuth()
  const router = useRouter()

  // Mock trades data
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: "1",
      symbol: "AAPL",
      assetClass: "stock",
      direction: "buy",
      quantity: 100,
      entryPrice: 175.50,
      exitPrice: 178.25,
      entryDate: "2024-01-15",
      exitDate: "2024-01-16",
      status: "closed",
      entryReason: "technical",
      exitReason: "profit_target",
      strategy: "Momentum Breakout",
      notes: "Strong breakout above resistance with high volume",
      commission: 1.00,
      slippage: 0.25,
      realizedPnl: 275.00
    },
    {
      id: "2",
      symbol: "TSLA",
      assetClass: "stock",
      direction: "sell",
      quantity: 50,
      entryPrice: 245.00,
      exitPrice: 238.50,
      entryDate: "2024-01-14",
      exitDate: "2024-01-15",
      status: "closed",
      entryReason: "technical",
      exitReason: "stop_loss",
      strategy: "Mean Reversion",
      notes: "Overbought conditions on RSI",
      commission: 0.75,
      slippage: 0.50,
      realizedPnl: 325.00
    },
    {
      id: "3",
      symbol: "NVDA",
      assetClass: "stock",
      direction: "buy",
      quantity: 75,
      entryPrice: 520.00,
      entryDate: "2024-01-13",
      status: "open",
      entryReason: "fundamental",
      strategy: "Growth Investing",
      notes: "Strong earnings report and guidance",
      commission: 1.25,
      slippage: 0.75,
      unrealizedPnl: -1200.00
    }
  ])

  // New trade form state
  const [newTrade, setNewTrade] = useState({
    symbol: "",
    assetClass: "",
    direction: "buy",
    quantity: "",
    entryPrice: "",
    exitPrice: "",
    entryDate: "",
    exitDate: "",
    status: "open",
    entryReason: "",
    exitReason: "",
    strategy: "",
    notes: "",
    commission: "0",
    slippage: "0",
    tags: ""
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

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.strategy?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || trade.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleAddTrade = () => {
    const trade: Trade = {
      id: Date.now().toString(),
      symbol: newTrade.symbol,
      assetClass: newTrade.assetClass,
      direction: newTrade.direction as "buy" | "sell",
      quantity: parseFloat(newTrade.quantity),
      entryPrice: parseFloat(newTrade.entryPrice),
      exitPrice: newTrade.exitPrice ? parseFloat(newTrade.exitPrice) : undefined,
      entryDate: newTrade.entryDate,
      exitDate: newTrade.exitDate || undefined,
      status: newTrade.status as "open" | "closed" | "partial",
      entryReason: newTrade.entryReason,
      exitReason: newTrade.exitReason || undefined,
      strategy: newTrade.strategy || undefined,
      notes: newTrade.notes || undefined,
      commission: parseFloat(newTrade.commission),
      slippage: parseFloat(newTrade.slippage),
      tags: newTrade.tags || undefined
    }

    setTrades([...trades, trade])
    setShowAddTrade(false)
    setNewTrade({
      symbol: "",
      assetClass: "",
      direction: "buy",
      quantity: "",
      entryPrice: "",
      exitPrice: "",
      entryDate: "",
      exitDate: "",
      status: "open",
      entryReason: "",
      exitReason: "",
      strategy: "",
      notes: "",
      commission: "0",
      slippage: "0",
      tags: ""
    })
    toast.success("Trade added successfully!")
  }

  const handleDeleteTrade = (id: string) => {
    setTrades(trades.filter(trade => trade.id !== id))
    toast.success("Trade deleted successfully!")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-600"
      case "closed": return "bg-green-100 text-green-600"
      case "partial": return "bg-yellow-100 text-yellow-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  const getDirectionColor = (direction: string) => {
    return direction === "buy" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
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
              { icon: TrendingUp, label: "Trades", active: true },
              { icon: DollarSign, label: "Portfolio" },
              { icon: Calendar, label: "Analytics" },
              { icon: Filter, label: "Reports" },
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
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <h1 className="text-2xl font-bold">Trades</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search trades..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={showAddTrade} onOpenChange={setShowAddTrade}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Trade
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Trade</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new trade
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                          id="symbol"
                          placeholder="AAPL"
                          value={newTrade.symbol}
                          onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assetClass">Asset Class</Label>
                        <Select value={newTrade.assetClass} onValueChange={(value) => setNewTrade({...newTrade, assetClass: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stock">Stock</SelectItem>
                            <SelectItem value="forex">Forex</SelectItem>
                            <SelectItem value="crypto">Crypto</SelectItem>
                            <SelectItem value="options">Options</SelectItem>
                            <SelectItem value="futures">Futures</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direction">Direction</Label>
                        <Select value={newTrade.direction} onValueChange={(value) => setNewTrade({...newTrade, direction: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buy">Buy</SelectItem>
                            <SelectItem value="sell">Sell</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="100"
                          value={newTrade.quantity}
                          onChange={(e) => setNewTrade({...newTrade, quantity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entryPrice">Entry Price</Label>
                        <Input
                          id="entryPrice"
                          type="number"
                          step="0.01"
                          placeholder="175.50"
                          value={newTrade.entryPrice}
                          onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exitPrice">Exit Price (optional)</Label>
                        <Input
                          id="exitPrice"
                          type="number"
                          step="0.01"
                          placeholder="178.25"
                          value={newTrade.exitPrice}
                          onChange={(e) => setNewTrade({...newTrade, exitPrice: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entryDate">Entry Date</Label>
                        <Input
                          id="entryDate"
                          type="date"
                          value={newTrade.entryDate}
                          onChange={(e) => setNewTrade({...newTrade, entryDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exitDate">Exit Date (optional)</Label>
                        <Input
                          id="exitDate"
                          type="date"
                          value={newTrade.exitDate}
                          onChange={(e) => setNewTrade({...newTrade, exitDate: e.target.value})}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={newTrade.status} onValueChange={(value) => setNewTrade({...newTrade, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="entryReason">Entry Reason</Label>
                        <Select value={newTrade.entryReason} onValueChange={(value) => setNewTrade({...newTrade, entryReason: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fundamental">Fundamental</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                            <SelectItem value="news_driven">News Driven</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exitReason">Exit Reason (optional)</Label>
                        <Input
                          id="exitReason"
                          placeholder="Profit target"
                          value={newTrade.exitReason}
                          onChange={(e) => setNewTrade({...newTrade, exitReason: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="strategy">Strategy (optional)</Label>
                        <Input
                          id="strategy"
                          placeholder="Momentum Breakout"
                          value={newTrade.strategy}
                          onChange={(e) => setNewTrade({...newTrade, strategy: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="commission">Commission</Label>
                        <Input
                          id="commission"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newTrade.commission}
                          onChange={(e) => setNewTrade({...newTrade, commission: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slippage">Slippage</Label>
                        <Input
                          id="slippage"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newTrade.slippage}
                          onChange={(e) => setNewTrade({...newTrade, slippage: e.target.value})}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Trade Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes about this trade..."
                        value={newTrade.notes}
                        onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="breakout, momentum, technical"
                        value={newTrade.tags}
                        onChange={(e) => setNewTrade({...newTrade, tags: e.target.value})}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddTrade(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTrade}>
                    Add Trade
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Trades Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Trades</CardTitle>
              <CardDescription>
                {filteredTrades.length} trades found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTrades.map((trade) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDirectionColor(trade.direction)}`}>
                          {trade.direction === "buy" ? 
                            <TrendingUp className="h-5 w-5" /> : 
                            <TrendingDown className="h-5 w-5" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{trade.symbol}</h3>
                            <Badge variant="outline">{trade.assetClass}</Badge>
                            <Badge className={getStatusColor(trade.status)}>
                              {trade.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>{trade.quantity} @ ${trade.entryPrice}</span>
                            {trade.exitPrice && <span>→ ${trade.exitPrice}</span>}
                            <span>{trade.entryDate}</span>
                            {trade.strategy && <span>• {trade.strategy}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`font-semibold ${(trade.realizedPnl || trade.unrealizedPnl || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {(trade.realizedPnl || trade.unrealizedPnl || 0) >= 0 ? "+" : ""}
                            ${(trade.realizedPnl || trade.unrealizedPnl || 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {trade.realizedPnl ? "Realized" : "Unrealized"}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTrade(trade.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {trade.notes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded text-sm">
                        {trade.notes}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
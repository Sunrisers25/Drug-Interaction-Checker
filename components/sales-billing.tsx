"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  ShoppingCart,
  Receipt,
  Trash2,
  Calculator,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  Package,
  Printer,
  Download,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  medicineId: string
  name: string
  price: number
  quantity: number
  discount: number
  total: number
}

interface Sale {
  id: string
  date: string
  time: string
  customerId?: string
  customerName?: string
  items: CartItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: "cash" | "card" | "insurance"
  status: "completed" | "pending" | "refunded"
  cashier: string
}

interface Medicine {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

const sampleMedicines: Medicine[] = [
  { id: "1", name: "Paracetamol 500mg", price: 0.5, stock: 150, category: "Analgesic" },
  { id: "2", name: "Aspirin 75mg", price: 0.25, stock: 25, category: "Antiplatelet" },
  { id: "3", name: "Amoxicillin 250mg", price: 1.2, stock: 80, category: "Antibiotic" },
  { id: "4", name: "Lisinopril 10mg", price: 0.8, stock: 60, category: "ACE Inhibitor" },
  { id: "5", name: "Metformin 500mg", price: 0.6, stock: 90, category: "Antidiabetic" },
]

const sampleSales: Sale[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "14:30",
    customerName: "John Smith",
    items: [
      {
        id: "1",
        medicineId: "1",
        name: "Paracetamol 500mg",
        price: 0.5,
        quantity: 2,
        discount: 0,
        total: 1.0,
      },
      {
        id: "2",
        medicineId: "4",
        name: "Lisinopril 10mg",
        price: 0.8,
        quantity: 1,
        discount: 0,
        total: 0.8,
      },
    ],
    subtotal: 1.8,
    tax: 0.18,
    discount: 0,
    total: 1.98,
    paymentMethod: "card",
    status: "completed",
    cashier: "Sarah Johnson",
  },
  {
    id: "2",
    date: "2024-01-15",
    time: "15:45",
    items: [
      {
        id: "3",
        medicineId: "3",
        name: "Amoxicillin 250mg",
        price: 1.2,
        quantity: 1,
        discount: 0.1,
        total: 1.1,
      },
    ],
    subtotal: 1.1,
    tax: 0.11,
    discount: 0.1,
    total: 1.11,
    paymentMethod: "cash",
    status: "completed",
    cashier: "Mike Wilson",
  },
]

export function SalesBilling() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [sales, setSales] = useState<Sale[]>(sampleSales)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "insurance">("cash")
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [currentSale, setCurrentSale] = useState<Sale | null>(null)
  const [activeTab, setActiveTab] = useState("pos")
  const { toast } = useToast()

  const filteredMedicines = sampleMedicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find((item) => item.medicineId === medicine.id)

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.medicineId === medicine.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price - item.discount,
            }
          : item,
      )
      setCart(updatedCart)
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        medicineId: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        discount: 0,
        total: medicine.price,
      }
      setCart([...cart, newItem])
    }

    toast({
      title: "Added to cart",
      description: `${medicine.name} added to cart`,
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const updatedCart = cart.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity,
            total: quantity * item.price - item.discount,
          }
        : item,
    )
    setCart(updatedCart)
  }

  const updateDiscount = (itemId: string, discount: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId
        ? {
            ...item,
            discount,
            total: item.quantity * item.price - discount,
          }
        : item,
    )
    setCart(updatedCart)
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1 // 10% tax
    const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0)
    const total = subtotal + tax

    return { subtotal, tax, totalDiscount, total }
  }

  const processSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      })
      return
    }

    const { subtotal, tax, totalDiscount, total } = calculateTotals()
    const now = new Date()

    const sale: Sale = {
      id: Date.now().toString(),
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0].substring(0, 5),
      customerName: selectedCustomer || undefined,
      items: [...cart],
      subtotal,
      tax,
      discount: totalDiscount,
      total,
      paymentMethod,
      status: "completed",
      cashier: "Current User",
    }

    setSales([sale, ...sales])
    setCurrentSale(sale)
    setCart([])
    setSelectedCustomer("")
    setIsReceiptOpen(true)

    toast({
      title: "Sale completed",
      description: `Sale processed successfully. Total: $${total.toFixed(2)}`,
    })
  }

  const printReceipt = (sale: Sale) => {
    if (typeof window === "undefined") return

    // In a real application, this would integrate with a printer
    const receiptContent = `
PHARMACARE PRO
Receipt #${sale.id}
Date: ${sale.date} ${sale.time}
${sale.customerName ? `Customer: ${sale.customerName}` : ""}
Cashier: ${sale.cashier}

${sale.items
  .map(
    (item) =>
      `${item.name}
Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}
${item.discount > 0 ? `Discount: -$${item.discount.toFixed(2)}` : ""}
Total: $${item.total.toFixed(2)}`,
  )
  .join("\n\n")}

Subtotal: $${sale.subtotal.toFixed(2)}
Tax (10%): $${sale.tax.toFixed(2)}
Total Discount: -$${sale.discount.toFixed(2)}
TOTAL: $${sale.total.toFixed(2)}

Payment: ${sale.paymentMethod.toUpperCase()}
Status: ${sale.status.toUpperCase()}

Thank you for your business!
    `

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${sale.id}</title>
            <style>
              body { font-family: monospace; font-size: 12px; margin: 20px; }
              .receipt { max-width: 300px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <pre>${receiptContent}</pre>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const exportToPDF = (type: string, data?: Sale) => {
    if (typeof window === "undefined") return

    let content = ""
    let filename = ""
    const timestamp = new Date().toISOString().split("T")[0]

    if (type === "receipt" && data) {
      content = generateReceiptPDF(data)
      filename = `receipt-${data.id}-${timestamp}.pdf`
    } else if (type === "sales-report") {
      content = generateSalesReportPDF()
      filename = `sales-report-${timestamp}.pdf`
    }

    // Create PDF content as HTML for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                line-height: 1.4;
              }
              .header { 
                text-align: center; 
                border-bottom: 2px solid #333; 
                padding-bottom: 10px; 
                margin-bottom: 20px; 
              }
              .section { 
                margin-bottom: 20px; 
              }
              .table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px; 
              }
              .table th, .table td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              .table th { 
                background-color: #f5f5f5; 
                font-weight: bold; 
              }
              .total { 
                font-weight: bold; 
                font-size: 1.2em; 
              }
              .footer { 
                text-align: center; 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 1px solid #ddd; 
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${content}
            <div class="no-print" style="margin-top: 20px;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print PDF</button>
              <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const generateReceiptPDF = (sale: Sale) => {
    return `
      <div class="header">
        <h1>PHARMACARE PRO</h1>
        <h2>RECEIPT</h2>
        <p>Receipt #${sale.id}</p>
      </div>
      
      <div class="section">
        <p><strong>Date:</strong> ${sale.date} ${sale.time}</p>
        ${sale.customerName ? `<p><strong>Customer:</strong> ${sale.customerName}</p>` : ""}
        <p><strong>Cashier:</strong> ${sale.cashier}</p>
        <p><strong>Payment Method:</strong> ${sale.paymentMethod.toUpperCase()}</p>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${sale.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${item.discount.toFixed(2)}</td>
              <td>$${item.total.toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="section">
        <p><strong>Subtotal:</strong> $${sale.subtotal.toFixed(2)}</p>
        <p><strong>Tax (10%):</strong> $${sale.tax.toFixed(2)}</p>
        <p><strong>Total Discount:</strong> -$${sale.discount.toFixed(2)}</p>
        <p class="total"><strong>TOTAL: $${sale.total.toFixed(2)}</strong></p>
      </div>

      <div class="footer">
        <p>Thank you for your business!</p>
        <p>Status: ${sale.status.toUpperCase()}</p>
      </div>
    `
  }

  const generateSalesReportPDF = () => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalTransactions = sales.length
    const averageOrderValue = totalRevenue / totalTransactions

    return `
      <div class="header">
        <h1>PHARMACARE PRO</h1>
        <h2>SALES REPORT</h2>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h3>Summary</h3>
        <p><strong>Total Revenue:</strong> $${totalRevenue.toFixed(2)}</p>
        <p><strong>Total Transactions:</strong> ${totalTransactions}</p>
        <p><strong>Average Order Value:</strong> $${averageOrderValue.toFixed(2)}</p>
      </div>

      <div class="section">
        <h3>Recent Transactions</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${sales
              .slice(0, 20)
              .map(
                (sale) => `
              <tr>
                <td>#${sale.id}</td>
                <td>${sale.date} ${sale.time}</td>
                <td>${sale.customerName || "Walk-in"}</td>
                <td>${sale.items.length} items</td>
                <td>$${sale.total.toFixed(2)}</td>
                <td>${sale.paymentMethod}</td>
                <td>${sale.status}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Report generated by PharmaCare Pro System</p>
      </div>
    `
  }

  const { subtotal, tax, totalDiscount, total } = calculateTotals()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Sales & Billing</h2>
          <p className="text-muted-foreground">Process sales and manage transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Today: $2,847.50
          </Badge>
          <Button variant="outline" onClick={() => exportToPDF("sales-report")}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Point of Sale
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Sales History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Product Search & Selection */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Product Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {filteredMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
                        onClick={() => addToCart(medicine)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{medicine.name}</h4>
                            <Badge variant="outline">${medicine.price.toFixed(2)}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Stock: {medicine.stock}</span>
                            <span>{medicine.category}</span>
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground ml-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart & Checkout */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.length > 0 ? (
                    <>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Discount ($)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.discount}
                                  onChange={(e) => updateDiscount(item.id, Number.parseFloat(e.target.value) || 0)}
                                  className="h-8"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>
                                ${item.price.toFixed(2)} x {item.quantity}
                              </span>
                              <span className="font-medium">${item.total.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax (10%):</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        {totalDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span>-${totalDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                      <p>Cart is empty</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {cart.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Checkout
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Customer (Optional)</Label>
                      <Input
                        placeholder="Customer name"
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={processSale} className="w-full" size="lg">
                      <Calculator className="h-4 w-4 mr-2" />
                      Process Sale - ${total.toFixed(2)}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Sales History ({sales.length})
              </CardTitle>
              <CardDescription>Recent transactions and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">#{sale.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {sale.date} {sale.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        {sale.customerName ? (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {sale.customerName}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Walk-in</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {sale.items.length} items
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sale.status === "completed"
                              ? "default"
                              : sale.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => printReceipt(sale)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => exportToPDF("receipt", sale)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Receipt #{currentSale?.id}
            </DialogTitle>
            <DialogDescription>Transaction completed successfully</DialogDescription>
          </DialogHeader>

          {currentSale && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="font-semibold">PHARMACARE PRO</h3>
                <p className="text-sm text-muted-foreground">
                  {currentSale.date} {currentSale.time}
                </p>
                {currentSale.customerName && <p className="text-sm">Customer: {currentSale.customerName}</p>}
              </div>

              <div className="space-y-2">
                {currentSale.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {item.quantity} x ${item.price.toFixed(2)}
                        {item.discount > 0 && ` (-$${item.discount.toFixed(2)})`}
                      </p>
                    </div>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${currentSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${currentSale.tax.toFixed(2)}</span>
                </div>
                {currentSale.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${currentSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>${currentSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>Payment: {currentSale.paymentMethod.toUpperCase()}</p>
                <p>Cashier: {currentSale.cashier}</p>
                <p className="mt-2">Thank you for your business!</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => printReceipt(currentSale)} className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => exportToPDF("receipt", currentSale)} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button onClick={() => setIsReceiptOpen(false)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

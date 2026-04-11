"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  FileText,
  BarChart3,
  Activity,
} from "lucide-react"

const salesData = [
  { month: "Jan", revenue: 12400, transactions: 156, profit: 3720 },
  { month: "Feb", revenue: 13200, transactions: 168, profit: 3960 },
  { month: "Mar", revenue: 11800, transactions: 142, profit: 3540 },
  { month: "Apr", revenue: 14600, transactions: 189, profit: 4380 },
  { month: "May", revenue: 15200, transactions: 201, profit: 4560 },
  { month: "Jun", revenue: 16800, transactions: 224, profit: 5040 },
  { month: "Jul", revenue: 18200, transactions: 245, profit: 5460 },
  { month: "Aug", revenue: 17600, transactions: 238, profit: 5280 },
  { month: "Sep", revenue: 19400, transactions: 267, profit: 5820 },
  { month: "Oct", revenue: 20800, transactions: 289, profit: 6240 },
  { month: "Nov", revenue: 22200, transactions: 312, profit: 6660 },
  { month: "Dec", revenue: 24600, transactions: 345, profit: 7380 },
]

const topMedicines = [
  { name: "Paracetamol 500mg", sales: 1245, revenue: 622.5, category: "Analgesic", margin: 50 },
  { name: "Metformin 500mg", sales: 1156, revenue: 693.6, category: "Antidiabetic", margin: 45 },
  { name: "Lisinopril 10mg", sales: 987, revenue: 789.6, category: "ACE Inhibitor", margin: 60 },
  { name: "Aspirin 75mg", sales: 876, revenue: 219.0, category: "Antiplatelet", margin: 40 },
  { name: "Atorvastatin 20mg", sales: 756, revenue: 1134.0, category: "Statin", margin: 65 },
  { name: "Amoxicillin 250mg", sales: 634, revenue: 760.8, category: "Antibiotic", margin: 55 },
  { name: "Omeprazole 20mg", sales: 589, revenue: 530.1, category: "PPI", margin: 48 },
  { name: "Amlodipine 5mg", sales: 523, revenue: 366.1, category: "CCB", margin: 52 },
]

const categoryData = [
  { name: "Cardiovascular", value: 32, color: "#FF6B6B", count: 156 }, // Bright red
  { name: "Analgesics", value: 28, color: "#4ECDC4", count: 134 }, // Turquoise
  { name: "Antibiotics", value: 22, color: "#45B7D1", count: 98 }, // Sky blue
  { name: "Diabetes", value: 18, color: "#96CEB4", count: 87 }, // Mint green
  { name: "Gastrointestinal", value: 15, color: "#FFEAA7", count: 76 }, // Sunny yellow
  { name: "Respiratory", value: 12, color: "#DDA0DD", count: 54 }, // Plum purple
  { name: "Mental Health", value: 8, color: "#98D8C8", count: 43 }, // Seafoam
  { name: "Hormonal", value: 6, color: "#F7DC6F", count: 32 }, // Golden yellow
  { name: "Others", value: 9, color: "#BB8FCE", count: 45 }, // Lavender
]

const dailySalesData = [
  { day: "Mon", sales: 2400, customers: 32, prescriptions: 28 },
  { day: "Tue", sales: 2800, customers: 38, prescriptions: 34 },
  { day: "Wed", sales: 3200, customers: 42, prescriptions: 39 },
  { day: "Thu", sales: 2900, customers: 35, prescriptions: 31 },
  { day: "Fri", sales: 3800, customers: 48, prescriptions: 45 },
  { day: "Sat", sales: 4200, customers: 52, prescriptions: 48 },
  { day: "Sun", sales: 3600, customers: 45, prescriptions: 41 },
]

const stockAlertData = [
  { category: "Critical (0-10)", count: 5, color: "#ef4444" },
  { category: "Low (11-30)", count: 18, color: "#f59e0b" },
  { category: "Moderate (31-50)", count: 32, color: "#eab308" },
  { category: "Good (51+)", count: 145, color: "#22c55e" },
]

const supplierPerformance = [
  { name: "MedSupply Co.", reliability: 95, costEfficiency: 88, deliveryTime: 2.1 },
  { name: "PharmaCorp", reliability: 92, costEfficiency: 91, deliveryTime: 1.8 },
  { name: "BioMed Ltd.", reliability: 89, costEfficiency: 85, deliveryTime: 2.5 },
  { name: "CardioMed Inc.", reliability: 96, costEfficiency: 87, deliveryTime: 1.9 },
  { name: "DiabetesCare Ltd.", reliability: 93, costEfficiency: 89, deliveryTime: 2.2 },
]

const monthlyTrends = [
  { month: "Jan", prescriptions: 245, otc: 156, consultations: 89 },
  { month: "Feb", prescriptions: 268, otc: 172, consultations: 95 },
  { month: "Mar", prescriptions: 234, otc: 148, consultations: 82 },
  { month: "Apr", prescriptions: 289, otc: 189, consultations: 108 },
  { month: "May", prescriptions: 312, otc: 201, consultations: 115 },
  { month: "Jun", prescriptions: 334, otc: 224, consultations: 128 },
]

const drugInteractionData = [
  { severity: "Severe", count: 12, resolved: 10 },
  { severity: "Moderate", count: 45, resolved: 38 },
  { severity: "Minor", count: 78, resolved: 72 },
  { severity: "Contraindicated", count: 3, resolved: 3 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("12months")
  const [activeTab, setActiveTab] = useState("overview")

  const currentMonth = salesData[salesData.length - 1]
  const previousMonth = salesData[salesData.length - 2]
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100
  const transactionGrowth =
    ((currentMonth.transactions - previousMonth.transactions) / previousMonth.transactions) * 100

  const exportToPDF = (type: string) => {
    if (typeof window === "undefined") return

    const timestamp = new Date().toISOString().split("T")[0]
    let content = ""
    let filename = ""

    switch (type) {
      case "sales":
        content = generateSalesAnalyticsPDF()
        filename = `sales-analytics-${timestamp}.pdf`
        break
      case "inventory":
        content = generateInventoryAnalyticsPDF()
        filename = `inventory-analytics-${timestamp}.pdf`
        break
      case "patients":
        content = generatePatientAnalyticsPDF()
        filename = `patient-analytics-${timestamp}.pdf`
        break
      case "interactions":
        content = generateInteractionAnalyticsPDF()
        filename = `safety-analytics-${timestamp}.pdf`
        break
      case "comprehensive":
        content = generateComprehensiveAnalyticsPDF()
        filename = `comprehensive-analytics-${timestamp}.pdf`
        break
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
                color: #333;
              }
              .header { 
                text-align: center; 
                border-bottom: 2px solid #333; 
                padding-bottom: 15px; 
                margin-bottom: 25px; 
              }
              .section { 
                margin-bottom: 25px; 
                page-break-inside: avoid;
              }
              .table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 20px; 
              }
              .table th, .table td { 
                border: 1px solid #ddd; 
                padding: 10px; 
                text-align: left; 
              }
              .table th { 
                background-color: #f8f9fa; 
                font-weight: bold; 
              }
              .metric-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
              }
              .metric-card {
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 8px;
                background-color: #f8f9fa;
              }
              .metric-value {
                font-size: 1.5em;
                font-weight: bold;
                color: #007bff;
              }
              .chart-placeholder {
                border: 2px dashed #ddd;
                padding: 40px;
                text-align: center;
                margin: 20px 0;
                background-color: #f8f9fa;
              }
              .footer { 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 20px; 
                border-top: 1px solid #ddd; 
                font-size: 0.9em;
                color: #666;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
                .section { page-break-inside: avoid; }
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

  const generateSalesAnalyticsPDF = () => {
    const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0)
    const totalTransactions = salesData.reduce((sum, item) => sum + item.transactions, 0)
    const averageOrderValue = totalRevenue / totalTransactions

    return `
      <div class="header">
        <h1>PHARMACARE PRO</h1>
        <h2>SALES ANALYTICS REPORT</h2>
        <p>Period: ${timeRange} | Generated: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h3>Key Performance Indicators</h3>
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">$${totalRevenue.toLocaleString()}</div>
            <div>Total Revenue</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${totalTransactions.toLocaleString()}</div>
            <div>Total Transactions</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">$${averageOrderValue.toFixed(2)}</div>
            <div>Average Order Value</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${revenueGrowth.toFixed(1)}%</div>
            <div>Revenue Growth</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Monthly Sales Performance</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Transactions</th>
              <th>Profit</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            ${salesData
              .map(
                (item, index) => `
              <tr>
                <td>${item.month}</td>
                <td>$${item.revenue.toLocaleString()}</td>
                <td>${item.transactions}</td>
                <td>$${item.profit.toLocaleString()}</td>
                <td>${
                  index > 0
                    ? (((item.revenue - salesData[index - 1].revenue) / salesData[index - 1].revenue) * 100).toFixed(
                        1,
                      ) + "%"
                    : "N/A"
                }</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Top Performing Medicines</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Units Sold</th>
              <th>Revenue</th>
              <th>Margin</th>
            </tr>
          </thead>
          <tbody>
            ${topMedicines
              .slice(0, 10)
              .map(
                (medicine) => `
              <tr>
                <td>${medicine.name}</td>
                <td>${medicine.category}</td>
                <td>${medicine.sales}</td>
                <td>$${medicine.revenue.toFixed(2)}</td>
                <td>${medicine.margin}%</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="chart-placeholder">
        <h4>Sales Trend Chart</h4>
        <p>Visual representation of monthly sales performance would appear here</p>
      </div>

      <div class="footer">
        <p>Report generated by PharmaCare Pro Analytics System</p>
        <p>For internal use only - Contains confidential business information</p>
      </div>
    `
  }

  const generateInventoryAnalyticsPDF = () => {
    const totalItems = categoryData.reduce((sum, item) => sum + item.count, 0)
    const criticalItems = stockAlertData.find((item) => item.category.includes("Critical"))?.count || 0
    const lowStockItems = stockAlertData.find((item) => item.category.includes("Low"))?.count || 0

    return `
      <div class="header">
        <h1>PHARMACARE PRO</h1>
        <h2>INVENTORY ANALYTICS REPORT</h2>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h3>Inventory Overview</h3>
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">${totalItems}</div>
            <div>Total Items</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${criticalItems}</div>
            <div>Critical Stock Items</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${lowStockItems}</div>
            <div>Low Stock Items</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${categoryData.length}</div>
            <div>Categories</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Stock by Category</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Stock Count</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${categoryData
              .map(
                (category) => `
              <tr>
                <td>${category.name}</td>
                <td>${category.count}</td>
                <td>${category.value}%</td>
                <td>${category.count > 50 ? "Good" : category.count > 20 ? "Moderate" : "Low"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Stock Alert Summary</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Alert Level</th>
              <th>Item Count</th>
              <th>Action Required</th>
            </tr>
          </thead>
          <tbody>
            ${stockAlertData
              .map(
                (alert) => `
              <tr>
                <td>${alert.category}</td>
                <td>${alert.count}</td>
                <td>${
                  alert.category.includes("Critical")
                    ? "Immediate Reorder"
                    : alert.category.includes("Low")
                      ? "Schedule Reorder"
                      : "Monitor"
                }</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Report generated by PharmaCare Pro Inventory System</p>
      </div>
    `
  }

  const generatePatientAnalyticsPDF = () => {
    return `
      <div class="header">
        <h1>PHARMACARE PRO</h1>
        <h2>PATIENT ANALYTICS REPORT</h2>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h3>Patient Metrics</h3>
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">1,247</div>
            <div>Total Patients</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">89</div>
            <div>New Patients</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">78%</div>
            <div>Retention Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">$45.60</div>
            <div>Avg Visit Value</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Patient Activity Summary</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current Month</th>
              <th>Previous Month</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Visits</td>
              <td>2,456</td>
              <td>2,198</td>
              <td>+11.7%</td>
            </tr>
            <tr>
              <td>Prescription Fills</td>
              <td>1,834</td>
              <td>1,672</td>
              <td>+9.7%</td>
            </tr>
            <tr>
              <td>Consultations</td>
              <td>456</td>
              <td>423</td>
              <td>+7.8%</td>
            </tr>
            <tr>
              <td>Average Wait Time</td>
              <td>8.2 min</td>
              <td>9.1 min</td>
              <td>-9.9%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Report generated by PharmaCare Pro Patient Management System</p>
      </div>
    `
  }

  const generateInteractionAnalyticsPDF = () => {
    const totalInteractions = drugInteractionData.reduce((sum, item) => sum + item.count, 0)
    const resolvedInteractions = drugInteractionData.reduce((sum, item) => sum + item.resolved, 0)
    const resolutionRate = ((resolvedInteractions / totalInteractions) * 100).toFixed(1)

    return `
      <div class="header">
        <h1>PHARMACARE PRO</h1>
        <h2>DRUG INTERACTION SAFETY REPORT</h2>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h3>Safety Metrics</h3>
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">${totalInteractions}</div>
            <div>Total Interactions</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${resolvedInteractions}</div>
            <div>Resolved Cases</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${resolutionRate}%</div>
            <div>Resolution Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">4.2 min</div>
            <div>Avg Response Time</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Interaction Breakdown by Severity</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Severity Level</th>
              <th>Total Cases</th>
              <th>Resolved</th>
              <th>Pending</th>
              <th>Resolution Rate</th>
            </tr>
          </thead>
          <tbody>
            ${drugInteractionData
              .map(
                (interaction) => `
              <tr>
                <td>${interaction.severity}</td>
                <td>${interaction.count}</td>
                <td>${interaction.resolved}</td>
                <td>${interaction.count - interaction.resolved}</td>
                <td>${((interaction.resolved / interaction.count) * 100).toFixed(1)}%</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Safety Recommendations</h3>
        <ul>
          <li>Continue monitoring severe interactions with immediate response protocols</li>
          <li>Implement additional training for moderate interaction management</li>
          <li>Review contraindicated medication combinations quarterly</li>
          <li>Maintain current response time standards for patient safety</li>
        </ul>
      </div>

      <div class="footer">
        <p>Report generated by PharmaCare Pro Safety Monitoring System</p>
        <p>This report contains sensitive patient safety information - Handle with care</p>
      </div>
    `
  }

  const generateComprehensiveAnalyticsPDF = () => {
    return `
      <div class="header">
        <h1>PHARMACARE PRO</h1>
        <h2>COMPREHENSIVE ANALYTICS REPORT</h2>
        <p>Period: ${timeRange} | Generated: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h3>Executive Summary</h3>
        <p>This comprehensive report provides a complete overview of pharmacy operations, including sales performance, inventory management, patient analytics, and safety monitoring.</p>
      </div>

      ${generateSalesAnalyticsPDF().split('<div class="header">')[1].split('<div class="footer">')[0]}
      ${generateInventoryAnalyticsPDF().split('<div class="header">')[1].split('<div class="footer">')[0]}
      ${generatePatientAnalyticsPDF().split('<div class="header">')[1].split('<div class="footer">')[0]}
      ${generateInteractionAnalyticsPDF().split('<div class="header">')[1].split('<div class="footer">')[0]}

      <div class="footer">
        <p>Comprehensive Report generated by PharmaCare Pro Analytics System</p>
        <p>This document contains confidential business and patient information</p>
      </div>
    `
  }

  const exportReport = (type: string) => {
    const timestamp = new Date().toISOString().split("T")[0]

    if (type === "sales") {
      const csvContent = [
        ["Month", "Revenue", "Transactions", "Profit"],
        ...salesData.map((item) => [item.month, item.revenue, item.transactions, item.profit]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      downloadCSV(csvContent, `sales-report-${timestamp}.csv`)
    } else if (type === "inventory") {
      const csvContent = [
        ["Category", "Stock Count", "Percentage"],
        ...categoryData.map((item) => [item.name, item.count, item.value]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      downloadCSV(csvContent, `inventory-report-${timestamp}.csv`)
    } else if (type === "patients") {
      const csvContent = [
        ["Metric", "Value"],
        ["Total Patients", "1,247"],
        ["New Patients", "89"],
        ["Repeat Customers", "78%"],
        ["Average Visit Value", "$45.60"],
      ]
        .map((row) => row.join(","))
        .join("\n")

      downloadCSV(csvContent, `patient-report-${timestamp}.csv`)
    } else if (type === "interactions") {
      const csvContent = [
        ["Severity", "Count", "Resolved"],
        ...drugInteractionData.map((item) => [item.severity, item.count, item.resolved]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      downloadCSV(csvContent, `safety-report-${timestamp}.csv`)
    } else if (type === "comprehensive") {
      generateComprehensiveReport(timestamp)
    }
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateComprehensiveReport = (timestamp: string) => {
    const reportData = {
      generatedAt: new Date().toLocaleString(),
      timeRange: timeRange,
      summary: {
        totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
        totalTransactions: salesData.reduce((sum, item) => sum + item.transactions, 0),
        averageOrderValue:
          salesData.reduce((sum, item) => sum + item.revenue, 0) /
          salesData.reduce((sum, item) => sum + item.transactions, 0),
        topSellingCategory: categoryData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name,
      },
      salesData: salesData,
      topMedicines: topMedicines,
      categoryBreakdown: categoryData,
      stockAlerts: stockAlertData,
      drugInteractions: drugInteractionData,
    }

    const jsonContent = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `comprehensive-report-${timestamp}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive insights into pharmacy operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportToPDF("comprehensive")}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sales Analytics
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Reports
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patient Analytics
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Drug Interactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentMonth.revenue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />+{revenueGrowth.toFixed(1)}% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentMonth.transactions}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />+{transactionGrowth.toFixed(1)}% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />5 critical items
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across medicine categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Supplier Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Analysis</CardTitle>
              <CardDescription>Reliability, cost efficiency, and delivery performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={supplierPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Reliability" dataKey="reliability" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Radar
                    name="Cost Efficiency"
                    dataKey="costEfficiency"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Sales Performance</CardTitle>
                  <CardDescription>Sales and customer traffic by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="#82ca9d"
                        name="Customers"
                        dot={{ fill: "#82ca9d", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#82ca9d", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="prescriptions"
                        stroke="#ffc658"
                        name="Prescriptions"
                        dot={{ fill: "#ffc658", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#ffc658", strokeWidth: 2 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Medicines</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMedicines.slice(0, 6).map((medicine, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{medicine.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {medicine.category}
                          </Badge>
                          <span>{medicine.sales} units</span>
                          <span>{medicine.margin}% margin</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${medicine.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medicine Profitability Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Medicine Profitability Analysis</CardTitle>
              <CardDescription>Sales volume vs profit margin for top medicines</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={topMedicines}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sales" name="Sales Volume" />
                  <YAxis dataKey="margin" name="Profit Margin %" />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    formatter={(value, name) => [
                      name === "sales" ? `${value} units` : `${value}%`,
                      name === "sales" ? "Sales Volume" : "Profit Margin",
                    ]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.name || ""}
                  />
                  <Scatter dataKey="margin" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trend Analysis</CardTitle>
              <CardDescription>Monthly sales, transactions, and profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    name="Revenue ($)"
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#82ca9d"
                    name="Transactions"
                    dot={{ fill: "#82ca9d", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#82ca9d", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#ffc658"
                    name="Profit ($)"
                    dot={{ fill: "#ffc658", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#ffc658", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Level Distribution</CardTitle>
                <CardDescription>Current inventory status across all medicines</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stockAlertData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, count }) => `${name}: ${count}`}
                    >
                      {stockAlertData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Inventory Levels</CardTitle>
                <CardDescription>Stock count by medicine category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} items`, "Stock Count"]} />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Customer retention rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Visit Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45.60</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>Age distribution of active patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>Patient demographic charts will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">138</div>
                <p className="text-xs text-muted-foreground">Detected this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Severe Cases</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">Successfully managed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2m</div>
                <p className="text-xs text-muted-foreground">Minutes to resolution</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interaction Severity Distribution</CardTitle>
                <CardDescription>Breakdown of drug interactions by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={drugInteractionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="severity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Total Cases" />
                    <Bar dataKey="resolved" fill="#82ca9d" name="Resolved Cases" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Interaction Trends</CardTitle>
                <CardDescription>Prescription safety metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="prescriptions"
                      stroke="#8884d8"
                      name="Prescriptions"
                      dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="consultations"
                      stroke="#82ca9d"
                      name="Consultations"
                      dot={{ fill: "#82ca9d", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#82ca9d", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Drug Interaction Network</CardTitle>
              <CardDescription>Most common drug combinations requiring monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                <p>Interactive drug interaction network visualization</p>
                <p className="text-sm">Shows relationships between commonly prescribed medications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Reports
          </CardTitle>
          <CardDescription>Generate detailed PDF reports for analysis and compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" onClick={() => exportToPDF("sales")} className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Sales Report (PDF)
            </Button>
            <Button variant="outline" onClick={() => exportToPDF("inventory")} className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Inventory Report (PDF)
            </Button>
            <Button variant="outline" onClick={() => exportToPDF("patients")} className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Patient Report (PDF)
            </Button>
            <Button variant="outline" onClick={() => exportToPDF("interactions")} className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Safety Report (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Medicines",
    value: "1,247",
    description: "+12% from last month",
    icon: Package,
    trend: "up",
  },
  {
    title: "Low Stock Items",
    value: "23",
    description: "Requires attention",
    icon: AlertTriangle,
    trend: "warning",
  },
  {
    title: "Daily Sales",
    value: "$2,847",
    description: "+8% from yesterday",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Active Patients",
    value: "456",
    description: "+5% this week",
    icon: TrendingUp,
    trend: "up",
  },
]

export function QuickStats() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon
              className={`h-4 w-4 ${stat.trend === "warning" ? "text-yellow-500" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.trend === "up"
                  ? "text-green-600"
                  : stat.trend === "warning"
                    ? "text-yellow-600"
                    : "text-muted-foreground"
              }`}
            >
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, Clock } from "lucide-react"

const stockAlerts = [
  {
    id: "1",
    medicine: "Aspirin 75mg",
    type: "low_stock",
    current: 25,
    minimum: 30,
    severity: "warning",
  },
  {
    id: "2",
    medicine: "Amoxicillin 250mg",
    type: "expiring",
    expiryDate: "2024-03-20",
    daysLeft: 45,
    severity: "error",
  },
  {
    id: "3",
    medicine: "Vitamin D3",
    type: "out_of_stock",
    current: 0,
    severity: "error",
  },
]

export function StockAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Stock Alerts
        </CardTitle>
        <CardDescription>Critical inventory notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stockAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {alert.type === "low_stock" && <Package className="h-4 w-4 text-yellow-500" />}
                {alert.type === "expiring" && <Clock className="h-4 w-4 text-orange-500" />}
                {alert.type === "out_of_stock" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                <div>
                  <p className="font-medium text-sm">{alert.medicine}</p>
                  <p className="text-xs text-muted-foreground">
                    {alert.type === "low_stock" && `Stock: ${alert.current}/${alert.minimum}`}
                    {alert.type === "expiring" && `Expires in ${alert.daysLeft} days`}
                    {alert.type === "out_of_stock" && "Out of stock"}
                  </p>
                </div>
              </div>
              <Badge variant={alert.severity === "error" ? "destructive" : "secondary"}>
                {alert.type === "low_stock" && "Low Stock"}
                {alert.type === "expiring" && "Expiring"}
                {alert.type === "out_of_stock" && "Out of Stock"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

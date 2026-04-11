"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, AlertTriangle, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Medicine {
  id: string
  name: string
  category: string
  batchNumber: string
  expiryDate: string
  quantity: number
  price: number
  supplier: string
  minStock: number
}

const sampleMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Analgesic",
    batchNumber: "PCM001",
    expiryDate: "2025-12-31",
    quantity: 150,
    price: 0.5,
    supplier: "MedSupply Co.",
    minStock: 50,
  },
  {
    id: "2",
    name: "Aspirin 75mg",
    category: "Antiplatelet",
    batchNumber: "ASP002",
    expiryDate: "2025-06-15",
    quantity: 25,
    price: 0.25,
    supplier: "PharmaCorp",
    minStock: 30,
  },
  {
    id: "3",
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    batchNumber: "AMX003",
    expiryDate: "2024-03-20",
    quantity: 80,
    price: 1.2,
    supplier: "BioMed Ltd.",
    minStock: 40,
  },
  {
    id: "4",
    name: "Lisinopril 10mg",
    category: "ACE Inhibitor",
    batchNumber: "LIS004",
    expiryDate: "2025-08-30",
    quantity: 120,
    price: 0.8,
    supplier: "CardioMed Inc.",
    minStock: 35,
  },
  {
    id: "5",
    name: "Metformin 500mg",
    category: "Antidiabetic",
    batchNumber: "MET005",
    expiryDate: "2025-11-15",
    quantity: 200,
    price: 0.6,
    supplier: "DiabetesCare Ltd.",
    minStock: 60,
  },
  {
    id: "6",
    name: "Atorvastatin 20mg",
    category: "Statin",
    batchNumber: "ATO006",
    expiryDate: "2025-09-22",
    quantity: 90,
    price: 1.5,
    supplier: "CholesterolCare",
    minStock: 30,
  },
  {
    id: "7",
    name: "Omeprazole 20mg",
    category: "Proton Pump Inhibitor",
    batchNumber: "OME007",
    expiryDate: "2025-07-10",
    quantity: 75,
    price: 0.9,
    supplier: "GastroCare",
    minStock: 25,
  },
  {
    id: "8",
    name: "Amlodipine 5mg",
    category: "Calcium Channel Blocker",
    batchNumber: "AML008",
    expiryDate: "2025-10-05",
    quantity: 110,
    price: 0.7,
    supplier: "CardioMed Inc.",
    minStock: 40,
  },
  {
    id: "9",
    name: "Warfarin 5mg",
    category: "Anticoagulant",
    batchNumber: "WAR009",
    expiryDate: "2025-04-18",
    quantity: 45,
    price: 1.1,
    supplier: "BloodCare Pharma",
    minStock: 20,
  },
  {
    id: "10",
    name: "Levothyroxine 50mcg",
    category: "Thyroid Hormone",
    batchNumber: "LEV010",
    expiryDate: "2025-12-01",
    quantity: 85,
    price: 0.4,
    supplier: "EndoCare",
    minStock: 30,
  },
  {
    id: "11",
    name: "Sertraline 50mg",
    category: "Antidepressant",
    batchNumber: "SER011",
    expiryDate: "2025-05-25",
    quantity: 60,
    price: 2.1,
    supplier: "MentalHealth Pharma",
    minStock: 25,
  },
  {
    id: "12",
    name: "Albuterol Inhaler",
    category: "Bronchodilator",
    batchNumber: "ALB012",
    expiryDate: "2025-03-14",
    quantity: 35,
    price: 15.5,
    supplier: "RespiratoryCare",
    minStock: 15,
  },
  {
    id: "13",
    name: "Prednisone 10mg",
    category: "Corticosteroid",
    batchNumber: "PRE013",
    expiryDate: "2025-08-08",
    quantity: 95,
    price: 0.3,
    supplier: "InflammaCare",
    minStock: 35,
  },
  {
    id: "14",
    name: "Gabapentin 300mg",
    category: "Anticonvulsant",
    batchNumber: "GAB014",
    expiryDate: "2025-06-30",
    quantity: 70,
    price: 1.8,
    supplier: "NeuroCare",
    minStock: 25,
  },
  {
    id: "15",
    name: "Hydrochlorothiazide 25mg",
    category: "Diuretic",
    batchNumber: "HCT015",
    expiryDate: "2025-09-12",
    quantity: 130,
    price: 0.5,
    supplier: "CardioMed Inc.",
    minStock: 45,
  },
  {
    id: "16",
    name: "Losartan 50mg",
    category: "ARB",
    batchNumber: "LOS016",
    expiryDate: "2025-11-28",
    quantity: 105,
    price: 0.9,
    supplier: "CardioMed Inc.",
    minStock: 35,
  },
  {
    id: "17",
    name: "Clopidogrel 75mg",
    category: "Antiplatelet",
    batchNumber: "CLO017",
    expiryDate: "2025-07-22",
    quantity: 55,
    price: 2.5,
    supplier: "BloodCare Pharma",
    minStock: 20,
  },
  {
    id: "18",
    name: "Pantoprazole 40mg",
    category: "Proton Pump Inhibitor",
    batchNumber: "PAN018",
    expiryDate: "2025-10-15",
    quantity: 80,
    price: 1.0,
    supplier: "GastroCare",
    minStock: 30,
  },
  {
    id: "19",
    name: "Furosemide 40mg",
    category: "Diuretic",
    batchNumber: "FUR019",
    expiryDate: "2025-04-05",
    quantity: 65,
    price: 0.4,
    supplier: "CardioMed Inc.",
    minStock: 25,
  },
  {
    id: "20",
    name: "Insulin Glargine",
    category: "Insulin",
    batchNumber: "INS020",
    expiryDate: "2025-02-28",
    quantity: 25,
    price: 45.0,
    supplier: "DiabetesCare Ltd.",
    minStock: 10,
  },
]

export function MedicineManager() {
  const [medicines, setMedicines] = useState<Medicine[]>(sampleMedicines)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)
  const { toast } = useToast()

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    batchNumber: "",
    expiryDate: "",
    quantity: 0,
    price: 0,
    supplier: "",
    minStock: 0,
  })

  const categories = [
    "Analgesic",
    "Antibiotic",
    "Antiplatelet",
    "Antacid",
    "Vitamin",
    "ACE Inhibitor",
    "Antidiabetic",
    "Statin",
    "Proton Pump Inhibitor",
    "Calcium Channel Blocker",
    "Anticoagulant",
    "Thyroid Hormone",
    "Antidepressant",
    "Bronchodilator",
    "Corticosteroid",
    "Anticonvulsant",
    "Diuretic",
    "ARB",
    "Insulin",
    "Other",
  ]

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const medicine: Medicine = {
      id: Date.now().toString(),
      ...newMedicine,
    }

    setMedicines([...medicines, medicine])
    setNewMedicine({
      name: "",
      category: "",
      batchNumber: "",
      expiryDate: "",
      quantity: 0,
      price: 0,
      supplier: "",
      minStock: 0,
    })
    setIsAddDialogOpen(false)
    toast({
      title: "Success",
      description: "Medicine added successfully",
    })
  }

  const handleDeleteMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id))
    toast({
      title: "Success",
      description: "Medicine deleted successfully",
    })
  }

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.quantity === 0) return { status: "Out of Stock", color: "destructive" }
    if (medicine.quantity <= medicine.minStock) return { status: "Low Stock", color: "secondary" }
    return { status: "In Stock", color: "default" }
  }

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0
  }

  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Medicine & Stock Management</h2>
          <p className="text-muted-foreground">Manage your pharmacy inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
              <DialogDescription>Enter the details for the new medicine</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newMedicine.category}
                  onValueChange={(value) => setNewMedicine({ ...newMedicine, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    value={newMedicine.batchNumber}
                    onChange={(e) => setNewMedicine({ ...newMedicine, batchNumber: e.target.value })}
                    placeholder="e.g., PCM001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newMedicine.quantity}
                    onChange={(e) => setNewMedicine({ ...newMedicine, quantity: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newMedicine.price}
                    onChange={(e) => setNewMedicine({ ...newMedicine, price: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={newMedicine.supplier}
                  onChange={(e) => setNewMedicine({ ...newMedicine, supplier: e.target.value })}
                  placeholder="e.g., MedSupply Co."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newMedicine.minStock}
                  onChange={(e) => setNewMedicine({ ...newMedicine, minStock: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleAddMedicine} className="w-full">
                Add Medicine
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines or batch numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medicine Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Medicine Inventory ({filteredMedicines.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((medicine) => {
                const stockStatus = getStockStatus(medicine)
                return (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>{medicine.batchNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {medicine.expiryDate}
                        {isExpired(medicine.expiryDate) && (
                          <Badge variant="destructive" className="text-xs">
                            Expired
                          </Badge>
                        )}
                        {isExpiringSoon(medicine.expiryDate) && !isExpired(medicine.expiryDate) && (
                          <Badge variant="secondary" className="text-xs">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {medicine.quantity}
                        {medicine.quantity <= medicine.minStock && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>${medicine.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.color as any}>{stockStatus.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMedicine(medicine.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

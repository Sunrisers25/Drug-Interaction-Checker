"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Edit,
  Eye,
  FileText,
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  User,
  Heart,
  Users,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  phone: string
  email: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  allergies: string[]
  medicalConditions: string[]
  insuranceProvider?: string
  insuranceNumber?: string
  registrationDate: string
}

interface Prescription {
  id: string
  patientId: string
  date: string
  prescribedBy: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }[]
  notes: string
  status: "active" | "completed" | "cancelled"
}

const samplePatients: Patient[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1985-03-15",
    gender: "male",
    phone: "+1-555-0123",
    email: "john.smith@email.com",
    address: "123 Main St, City, State 12345",
    emergencyContact: "Jane Smith",
    emergencyPhone: "+1-555-0124",
    allergies: ["Penicillin", "Shellfish"],
    medicalConditions: ["Hypertension", "Type 2 Diabetes"],
    insuranceProvider: "HealthCare Plus",
    insuranceNumber: "HC123456789",
    registrationDate: "2023-01-15",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1992-07-22",
    gender: "female",
    phone: "+1-555-0125",
    email: "sarah.johnson@email.com",
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: "Mike Johnson",
    emergencyPhone: "+1-555-0126",
    allergies: ["Latex"],
    medicalConditions: ["Asthma"],
    insuranceProvider: "MediCare Pro",
    insuranceNumber: "MP987654321",
    registrationDate: "2023-02-20",
  },
]

const samplePrescriptions: Prescription[] = [
  {
    id: "1",
    patientId: "1",
    date: "2024-01-15",
    prescribedBy: "Dr. Williams",
    medications: [
      {
        name: "Lisinopril 10mg",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take with food",
      },
      {
        name: "Metformin 500mg",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with meals",
      },
    ],
    notes: "Monitor blood pressure and glucose levels",
    status: "active",
  },
  {
    id: "2",
    patientId: "2",
    date: "2024-01-10",
    prescribedBy: "Dr. Brown",
    medications: [
      {
        name: "Albuterol Inhaler",
        dosage: "90mcg",
        frequency: "As needed",
        duration: "30 days",
        instructions: "Use for shortness of breath",
      },
    ],
    notes: "Patient education provided on proper inhaler technique",
    status: "active",
  },
]

export function PatientManager() {
  const [patients, setPatients] = useState<Patient[]>(samplePatients)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(samplePrescriptions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [isViewPatientOpen, setIsViewPatientOpen] = useState(false)
  const [activeView, setActiveView] = useState("list")
  const { toast } = useToast()

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female" | "other",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    medicalConditions: "",
    insuranceProvider: "",
    insuranceNumber: "",
  })

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPatientAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getPatientPrescriptions = (patientId: string) => {
    return prescriptions.filter((p) => p.patientId === patientId)
  }

  const handleAddPatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const patient: Patient = {
      id: Date.now().toString(),
      ...newPatient,
      allergies: newPatient.allergies ? newPatient.allergies.split(",").map((a) => a.trim()) : [],
      medicalConditions: newPatient.medicalConditions
        ? newPatient.medicalConditions.split(",").map((c) => c.trim())
        : [],
      registrationDate: new Date().toISOString().split("T")[0],
    }

    setPatients([...patients, patient])
    setNewPatient({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      allergies: "",
      medicalConditions: "",
      insuranceProvider: "",
      insuranceNumber: "",
    })
    setIsAddPatientOpen(false)
    toast({
      title: "Success",
      description: "Patient added successfully",
    })
  }

  const viewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsViewPatientOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Patient Management</h2>
          <p className="text-muted-foreground">Manage patient records and prescription history</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>Enter patient information and medical details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newPatient.firstName}
                      onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newPatient.lastName}
                      onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={newPatient.dateOfBirth}
                      onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={newPatient.gender}
                      onValueChange={(value: any) => setNewPatient({ ...newPatient, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      placeholder="+1-555-0123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                      placeholder="john@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    placeholder="123 Main St, City, State 12345"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={newPatient.emergencyContact}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyContact: e.target.value })}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={newPatient.emergencyPhone}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyPhone: e.target.value })}
                      placeholder="+1-555-0124"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                  <Input
                    id="allergies"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    placeholder="Penicillin, Shellfish"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">Medical Conditions (comma-separated)</Label>
                  <Input
                    id="conditions"
                    value={newPatient.medicalConditions}
                    onChange={(e) => setNewPatient({ ...newPatient, medicalConditions: e.target.value })}
                    placeholder="Hypertension, Diabetes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance Provider</Label>
                    <Input
                      id="insurance"
                      value={newPatient.insuranceProvider}
                      onChange={(e) => setNewPatient({ ...newPatient, insuranceProvider: e.target.value })}
                      placeholder="HealthCare Plus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceNumber">Insurance Number</Label>
                    <Input
                      id="insuranceNumber"
                      value={newPatient.insuranceNumber}
                      onChange={(e) => setNewPatient({ ...newPatient, insuranceNumber: e.target.value })}
                      placeholder="HC123456789"
                    />
                  </div>
                </div>

                <Button onClick={handleAddPatient} className="w-full">
                  Add Patient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Records ({filteredPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead>Allergies</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => {
                const patientPrescriptions = getPatientPrescriptions(patient.id)
                const lastVisit =
                  patientPrescriptions.length > 0
                    ? patientPrescriptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                        .date
                    : "No visits"

                return (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{patient.gender}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getPatientAge(patient.dateOfBirth)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalConditions.slice(0, 2).map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                        {patient.medicalConditions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.medicalConditions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies.slice(0, 2).map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                        {patient.allergies.length > 2 && (
                          <Badge variant="destructive" className="text-xs">
                            +{patient.allergies.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {lastVisit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => viewPatient(patient)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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

      {/* Patient Details Dialog */}
      <Dialog open={isViewPatientOpen} onOpenChange={setIsViewPatientOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedPatient?.firstName} {selectedPatient?.lastName}
            </DialogTitle>
            <DialogDescription>
              Patient ID: {selectedPatient?.id} • Age:{" "}
              {selectedPatient ? getPatientAge(selectedPatient.dateOfBirth) : 0}
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Patient Details</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="history">Medical History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {selectedPatient.dateOfBirth} ({getPatientAge(selectedPatient.dateOfBirth)} years old)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedPatient.phone}</span>
                      </div>
                      {selectedPatient.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedPatient.email}</span>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <p>{selectedPatient.address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedPatient.emergencyContact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedPatient.emergencyPhone}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Allergies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive">
                            {allergy}
                          </Badge>
                        ))}
                        {selectedPatient.allergies.length === 0 && (
                          <p className="text-muted-foreground">No known allergies</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-4 w-4 text-blue-500" />
                        Medical Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.medicalConditions.map((condition, index) => (
                          <Badge key={index} variant="outline">
                            {condition}
                          </Badge>
                        ))}
                        {selectedPatient.medicalConditions.length === 0 && (
                          <p className="text-muted-foreground">No medical conditions recorded</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4">
                <div className="space-y-4">
                  {getPatientPrescriptions(selectedPatient.id).map((prescription) => (
                    <Card key={prescription.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Prescription - {prescription.date}</CardTitle>
                          <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
                            {prescription.status}
                          </Badge>
                        </div>
                        <CardDescription>Prescribed by {prescription.prescribedBy}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {prescription.medications.map((med, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{med.name}</h4>
                                <Badge variant="outline">{med.dosage}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <span className="font-medium">Frequency:</span> {med.frequency}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span> {med.duration}
                                </div>
                              </div>
                              {med.instructions && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  <span className="font-medium">Instructions:</span> {med.instructions}
                                </p>
                              )}
                            </div>
                          ))}
                          {prescription.notes && (
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                              <p className="text-sm">
                                <span className="font-medium">Notes:</span> {prescription.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {getPatientPrescriptions(selectedPatient.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <p>No prescriptions found for this patient</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4" />
                      <p>Medical history timeline will be available soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

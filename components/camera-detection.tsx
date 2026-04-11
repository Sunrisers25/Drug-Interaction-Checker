"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Camera, CameraOff, Users, Package, AlertTriangle, User, Pill, Target } from "lucide-react"

interface DetectedObject {
  id: string
  type: "person" | "medicine" | "object"
  label: string
  confidence: number
  bbox: { x: number; y: number; width: number; height: number }
  timestamp: number
}

interface DetectedPerson {
  id: string
  name?: string
  bbox: { x: number; y: number; width: number; height: number }
  confidence: number
  isSelected: boolean
}

interface MedicineInfo {
  name: string
  barcode?: string
  dosage?: string
  manufacturer?: string
  expiryDate?: string
  interactions?: string[]
}

interface DetectedMedicine {
  name: string
  barcode?: string
  dosage?: string
  manufacturer?: string
  expiryDate?: string
  interactions?: Array<{
    drug: string
    severity: "minor" | "moderate" | "major" | "contraindicated"
    description: string
    clinicalEffects: string[]
  }>
}

const drugInteractions = [
  {
    id: "1",
    drug1: "Aspirin",
    drug2: "Warfarin",
    severity: "major" as const,
    description: "Increased risk of bleeding due to additive anticoagulant effects",
    clinicalEffects: ["Increased bleeding risk", "Prolonged clotting time", "Bruising", "GI bleeding"],
  },
  {
    id: "2",
    drug1: "Simvastatin",
    drug2: "Digoxin",
    severity: "moderate" as const,
    description: "Simvastatin may increase digoxin levels through P-glycoprotein inhibition",
    clinicalEffects: ["Nausea", "Arrhythmias", "Visual disturbances", "Confusion"],
  },
  {
    id: "3",
    drug1: "Omeprazole",
    drug2: "Phenytoin",
    severity: "moderate" as const,
    description: "Omeprazole may increase phenytoin levels through CYP2C19 inhibition",
    clinicalEffects: ["Ataxia", "Confusion", "Nystagmus", "Drowsiness"],
  },
  {
    id: "4",
    drug1: "Lisinopril",
    drug2: "Metformin",
    severity: "minor" as const,
    description: "ACE inhibitors may enhance the hypoglycemic effect of metformin",
    clinicalEffects: ["Enhanced glucose lowering", "Potential hypoglycemia"],
  },
]

export default function CameraDetection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isActive, setIsActive] = useState(false)
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [detectedPersons, setDetectedPersons] = useState<DetectedPerson[]>([])
  const [selectedPerson, setSelectedPerson] = useState<DetectedPerson | null>(null)
  const [scannedMedicine, setScannedMedicine] = useState<DetectedMedicine | null>(null)
  const [showPersonSelection, setShowPersonSelection] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [detectionMode, setDetectionMode] = useState<"general" | "medicine" | "person">("general")
  const [currentMedications, setCurrentMedications] = useState<string[]>(["Warfarin", "Digoxin"]) // Sample current meds

  const medicineDatabase: Record<string, MedicineInfo & { interactions?: string[] }> = {
    "123456789": {
      name: "Aspirin 100mg",
      dosage: "100mg",
      manufacturer: "PharmaCorp",
      expiryDate: "2025-12-31",
      interactions: ["Warfarin", "Ibuprofen"],
    },
    "987654321": {
      name: "Metformin 500mg",
      dosage: "500mg",
      manufacturer: "DiabetesCare",
      expiryDate: "2026-06-15",
      interactions: ["Insulin", "Alcohol"],
    },
    "456789123": {
      name: "Lisinopril 10mg",
      dosage: "10mg",
      manufacturer: "HeartMeds",
      expiryDate: "2025-09-30",
      interactions: ["Potassium supplements", "NSAIDs"],
    },
  }

  const checkDrugInteractions = (
    newMedicine: string,
  ): Array<{
    drug: string
    severity: "minor" | "moderate" | "major" | "contraindicated"
    description: string
    clinicalEffects: string[]
  }> => {
    const interactions: Array<{
      drug: string
      severity: "minor" | "moderate" | "major" | "contraindicated"
      description: string
      clinicalEffects: string[]
    }> = []

    currentMedications.forEach((currentMed) => {
      const interaction = drugInteractions.find(
        (int) =>
          (int.drug1.toLowerCase().includes(newMedicine.toLowerCase()) &&
            int.drug2.toLowerCase().includes(currentMed.toLowerCase())) ||
          (int.drug1.toLowerCase().includes(currentMed.toLowerCase()) &&
            int.drug2.toLowerCase().includes(newMedicine.toLowerCase())),
      )

      if (interaction) {
        interactions.push({
          drug: currentMed,
          severity: interaction.severity,
          description: interaction.description,
          clinicalEffects: interaction.clinicalEffects,
        })
      }
    })

    return interactions
  }

  const startCamera = async () => {
    try {
      console.log("[v0] Starting camera...")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Changed from "environment" to "user" for front camera which is more reliable
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false, // Explicitly disable audio to avoid additional permission requests
      })

      if (videoRef.current) {
        console.log("[v0] Setting video stream...")
        videoRef.current.srcObject = stream
        streamRef.current = stream

        videoRef.current.setAttribute("playsinline", "true")
        videoRef.current.setAttribute("autoplay", "true")
        videoRef.current.setAttribute("muted", "true")

        videoRef.current.addEventListener("loadedmetadata", async () => {
          console.log("[v0] Video metadata loaded")
          if (videoRef.current && canvasRef.current) {
            try {
              const playPromise = videoRef.current.play()
              if (playPromise !== undefined) {
                await playPromise
              }
              console.log("[v0] Video playing successfully")

              // Set canvas size to match video
              const videoWidth = videoRef.current.videoWidth || 640
              const videoHeight = videoRef.current.videoHeight || 480

              canvasRef.current.width = videoWidth
              canvasRef.current.height = videoHeight

              console.log("[v0] Canvas sized:", videoWidth, "x", videoHeight)
              setIsActive(true)
              startDetection()
            } catch (playError) {
              console.error("[v0] Video play error:", playError)
              setIsActive(true)
              toast({
                title: "Camera Ready",
                description: "Camera is ready. Click on the video if it doesn't start automatically.",
              })
            }
          }
        })

        videoRef.current.addEventListener("click", async () => {
          if (videoRef.current && videoRef.current.paused) {
            try {
              await videoRef.current.play()
              console.log("[v0] Video started after user click")
            } catch (error) {
              console.error("[v0] Manual play failed:", error)
            }
          }
        })

        toast({
          title: "Camera Started",
          description: "Object detection is now active",
        })
      }
    } catch (error) {
      console.error("[v0] Camera access error:", error)

      let errorMessage = "Unable to access camera. "
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage += "Please allow camera permissions and refresh the page."
        } else if (error.name === "NotFoundError") {
          errorMessage += "No camera found on this device."
        } else if (error.name === "NotReadableError") {
          errorMessage += "Camera is already in use by another application."
        } else {
          errorMessage += "Please check your camera settings."
        }
      }

      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsActive(false)
    setDetectedObjects([])
    setDetectedPersons([])
    setSelectedPerson(null)
    setScannedMedicine(null)
    toast({
      title: "Camera Stopped",
      description: "Object detection has been disabled",
    })
  }

  const startDetection = useCallback(() => {
    const detectObjects = () => {
      if (!isActive || !videoRef.current) return

      // Simulate object detection
      const simulateDetection = () => {
        const objects: DetectedObject[] = []
        const persons: DetectedPerson[] = []

        // Simulate person detection
        if (detectionMode === "general" || detectionMode === "person") {
          // Simulate person detection
          const personCount = Math.floor(Math.random() * 3) + 1
          for (let i = 0; i < personCount; i++) {
            const person: DetectedPerson = {
              id: `person_${i}`,
              name: `Person ${i + 1}`,
              bbox: {
                x: Math.random() * 300,
                y: Math.random() * 200,
                width: 100 + Math.random() * 50,
                height: 150 + Math.random() * 50,
              },
              confidence: 0.8 + Math.random() * 0.2,
              isSelected: false,
            }
            persons.push(person)

            objects.push({
              id: person.id,
              type: "person",
              label: person.name || "Person",
              confidence: person.confidence,
              bbox: person.bbox,
              timestamp: Date.now(),
            })
          }

          if (persons.length > 1 && !selectedPerson && !showPersonSelection) {
            setShowPersonSelection(true)
            setDetectedPersons(persons)
            // Don't proceed with medicine detection until person is selected
            return
          }
        }

        if (
          (detectionMode === "general" || detectionMode === "medicine") &&
          (detectedPersons.length <= 1 || selectedPerson)
        ) {
          // Simulate medicine detection
          if (Math.random() > 0.7) {
            const barcodes = Object.keys(medicineDatabase)
            const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)]
            const medicine = medicineDatabase[randomBarcode]

            const interactions = checkDrugInteractions(medicine.name)

            const detectedMedicine: DetectedMedicine = {
              name: medicine.name,
              dosage: medicine.dosage,
              manufacturer: medicine.manufacturer,
              expiryDate: medicine.expiryDate,
              interactions: interactions,
            }

            objects.push({
              id: `medicine_${randomBarcode}`,
              type: "medicine",
              label: medicine.name,
              confidence: 0.9 + Math.random() * 0.1,
              bbox: {
                x: Math.random() * 200,
                y: Math.random() * 150,
                width: 80 + Math.random() * 40,
                height: 30 + Math.random() * 20,
              },
              timestamp: Date.now(),
            })

            setScannedMedicine(detectedMedicine)

            if (interactions.length > 0) {
              const severityColors = {
                minor: "amber",
                moderate: "orange",
                major: "red",
                contraindicated: "red",
              }
              const highestSeverity = interactions.reduce((prev, curr) =>
                ["contraindicated", "major", "moderate", "minor"].indexOf(curr.severity) <
                ["contraindicated", "major", "moderate", "minor"].indexOf(prev.severity)
                  ? curr
                  : prev,
              )

              toast({
                title: "⚠️ Drug Interaction Detected!",
                description: `${medicine.name} may interact with ${interactions.map((i) => i.drug).join(", ")}`,
                variant:
                  highestSeverity.severity === "major" || highestSeverity.severity === "contraindicated"
                    ? "destructive"
                    : "default",
              })
            } else {
              toast({
                title: "✅ Medicine Detected",
                description: `Found: ${medicine.name} - No interactions detected`,
              })
            }
          }
        }

        // Simulate other objects
        if (detectionMode === "general") {
          const objectTypes = ["bottle", "box", "tablet", "syringe", "thermometer"]
          const randomType = objectTypes[Math.floor(Math.random() * objectTypes.length)]

          if (Math.random() > 0.6) {
            objects.push({
              id: `object_${Date.now()}`,
              type: "object",
              label: randomType,
              confidence: 0.7 + Math.random() * 0.2,
              bbox: {
                x: Math.random() * 250,
                y: Math.random() * 180,
                width: 60 + Math.random() * 30,
                height: 40 + Math.random() * 20,
              },
              timestamp: Date.now(),
            })
          }
        }

        setDetectedObjects(objects)
        if (persons.length > 0) {
          setDetectedPersons(persons)
        }
      }

      simulateDetection()
    }

    const interval = setInterval(detectObjects, 2000)
    return () => clearInterval(interval)
  }, [isActive, detectionMode, selectedPerson, showPersonSelection, detectedPersons.length, currentMedications])

  useEffect(() => {
    if (isActive) {
      const cleanup = startDetection()
      return cleanup
    }
  }, [isActive, startDetection])

  const selectPerson = (person: DetectedPerson) => {
    setSelectedPerson(person)
    setDetectedPersons((prev) => prev.map((p) => ({ ...p, isSelected: p.id === person.id })))
    setShowPersonSelection(false)
    toast({
      title: "Person Selected",
      description: `Now focusing on ${person.name}. Starting medicine scan...`,
    })
    setTimeout(() => {
      startDetection()
    }, 1000)
  }

  const drawDetections = () => {
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw bounding boxes
    detectedObjects.forEach((obj) => {
      ctx.strokeStyle = obj.type === "person" ? "#10b981" : obj.type === "medicine" ? "#f59e0b" : "#6366f1"
      ctx.lineWidth = 2
      ctx.strokeRect(obj.bbox.x, obj.bbox.y, obj.bbox.width, obj.bbox.height)

      // Draw label
      ctx.fillStyle = ctx.strokeStyle
      ctx.font = "14px sans-serif"
      ctx.fillText(`${obj.label} (${Math.round(obj.confidence * 100)}%)`, obj.bbox.x, obj.bbox.y - 5)
    })

    // Highlight selected person
    if (selectedPerson) {
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 3
      ctx.strokeRect(
        selectedPerson.bbox.x,
        selectedPerson.bbox.y,
        selectedPerson.bbox.width,
        selectedPerson.bbox.height,
      )
    }
  }

  useEffect(() => {
    drawDetections()
  }, [detectedObjects, selectedPerson])

  const getDetectionStats = () => {
    const persons = detectedObjects.filter((obj) => obj.type === "person").length
    const medicines = detectedObjects.filter((obj) => obj.type === "medicine").length
    const objects = detectedObjects.filter((obj) => obj.type === "object").length
    return { persons, medicines, objects }
  }

  const stats = getDetectionStats()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Smart Camera Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={isActive ? stopCamera : startCamera}
              variant={isActive ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isActive ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              {isActive ? "Stop Camera" : "Start Camera"}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Detection Mode:</span>
              <select
                value={detectionMode}
                onChange={(e) => setDetectionMode(e.target.value as any)}
                className="px-3 py-1 border rounded-md text-sm"
                disabled={!isActive}
              >
                <option value="general">General Detection</option>
                <option value="person">Person Focus</option>
                <option value="medicine">Medicine Focus</option>
              </select>
            </div>
          </div>

          {/* Camera Preview */}
          <div className="relative aspect-video bg-black min-h-[400px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover cursor-pointer"
              style={{ minHeight: "400px" }}
              onLoadedData={() => console.log("[v0] Video data loaded")}
              onCanPlay={() => console.log("[v0] Video can play")}
              onPlay={() => console.log("[v0] Video started playing")}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ minHeight: "400px" }}
            />

            {scannedMedicine && scannedMedicine.interactions && scannedMedicine.interactions.length > 0 && (
              <div className="absolute top-4 right-4 max-w-sm bg-red-900/95 text-white p-4 rounded-lg border-2 border-red-500 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
                  <span className="font-bold text-red-200">DRUG INTERACTION ALERT</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-red-100">{scannedMedicine.name}</div>
                  {scannedMedicine.interactions.map((interaction, index) => (
                    <div key={index} className="bg-red-800/50 p-2 rounded border border-red-600">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-200">vs {interaction.drug}</span>
                        <Badge
                          variant="destructive"
                          className={`text-xs ${
                            interaction.severity === "major" || interaction.severity === "contraindicated"
                              ? "bg-red-600 animate-pulse"
                              : interaction.severity === "moderate"
                                ? "bg-orange-600"
                                : "bg-yellow-600"
                          }`}
                        >
                          {interaction.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-red-100 mb-1">{interaction.description}</p>
                      <div className="text-xs text-red-200">
                        Effects: {interaction.clinicalEffects.slice(0, 2).join(", ")}
                        {interaction.clinicalEffects.length > 2 && "..."}
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-red-300 mt-2 font-medium">⚠️ Consult pharmacist immediately</div>
                </div>
              </div>
            )}

            {scannedMedicine && (!scannedMedicine.interactions || scannedMedicine.interactions.length === 0) && (
              <div className="absolute top-4 right-4 max-w-sm bg-green-900/95 text-white p-4 rounded-lg border-2 border-green-500 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-5 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-green-900 text-xs font-bold">✓</span>
                  </div>
                  <span className="font-bold text-green-200">MEDICATION SAFE</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-semibold text-green-100">{scannedMedicine.name}</div>
                  <div className="bg-green-800/50 p-2 rounded border border-green-600">
                    <p className="text-xs text-green-100">No interactions detected with current medications</p>
                    <div className="text-xs text-green-200 mt-1">
                      Dosage: {scannedMedicine.dosage} | Expires: {scannedMedicine.expiryDate}
                    </div>
                  </div>
                  <div className="text-xs text-green-300 font-medium">✅ Safe to administer</div>
                </div>
              </div>
            )}

            {(!videoRef.current || videoRef.current.paused || videoRef.current.readyState < 2) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-center p-4">
                <div>
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {!videoRef.current?.srcObject ? "Click 'Start Camera' to begin" : "Loading camera preview..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedPerson && (
                  <div className="flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-sm">
                    <Target className="h-3 w-3" />
                    Focusing on {selectedPerson.name}
                  </div>
                )}
                {showPersonSelection && (
                  <div className="flex items-center gap-2 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                    <Users className="h-3 w-3" />
                    Select person to continue
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {detectionMode.charAt(0).toUpperCase() + detectionMode.slice(1)} Mode
                </div>
              </div>
            </div>
          </div>

          {/* Detection Indicators */}
          <div className="absolute top-16 left-4 space-y-2">
            {stats.persons > 0 && (
              <div className="flex items-center gap-2 bg-green-600/90 text-white px-3 py-1 rounded-full text-sm">
                <Users className="h-3 w-3" />
                {stats.persons} person{stats.persons !== 1 ? "s" : ""}
              </div>
            )}
            {stats.medicines > 0 && (
              <div className="flex items-center gap-2 bg-amber-600/90 text-white px-3 py-1 rounded-full text-sm">
                <Pill className="h-3 w-3" />
                {stats.medicines} medicine{stats.medicines !== 1 ? "s" : ""}
              </div>
            )}
            {stats.objects > 0 && (
              <div className="flex items-center gap-2 bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm">
                <Package className="h-3 w-3" />
                {stats.objects} object{stats.objects !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detection Statistics */}
      {isActive && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.persons}</div>
              <div className="text-sm text-muted-foreground">Persons</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Pill className="h-6 w-6 mx-auto mb-2 text-amber-600" />
              <div className="text-2xl font-bold">{stats.medicines}</div>
              <div className="text-sm text-muted-foreground">Medicines</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.objects}</div>
              <div className="text-sm text-muted-foreground">Objects</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detection Results */}
      {isActive && detectedObjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({detectedObjects.length})</TabsTrigger>
                <TabsTrigger value="persons">Persons ({stats.persons})</TabsTrigger>
                <TabsTrigger value="medicines">Medicines ({stats.medicines})</TabsTrigger>
                <TabsTrigger value="objects">Objects ({stats.objects})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-2">
                {detectedObjects.map((obj) => (
                  <div key={obj.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {obj.type === "person" && <User className="h-4 w-4 text-green-600" />}
                      {obj.type === "medicine" && <Pill className="h-4 w-4 text-amber-600" />}
                      {obj.type === "object" && <Package className="h-4 w-4 text-blue-600" />}
                      <div>
                        <div className="font-medium">{obj.label}</div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {Math.round(obj.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{obj.type}</Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="persons">
                {detectedPersons.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {Math.round(person.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {person.isSelected && <Badge variant="destructive">Selected</Badge>}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => selectPerson(person)}
                        disabled={person.isSelected}
                      >
                        Focus
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="medicines">
                {detectedObjects
                  .filter((obj) => obj.type === "medicine")
                  .map((obj) => (
                    <div key={obj.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Pill className="h-4 w-4 text-amber-600" />
                        <div className="font-medium">{obj.label}</div>
                        <Badge variant="outline">Medicine</Badge>
                      </div>
                      {scannedMedicine && (
                        <div className="ml-7 space-y-1 text-sm text-muted-foreground">
                          <div>Dosage: {scannedMedicine.dosage}</div>
                          <div>Manufacturer: {scannedMedicine.manufacturer}</div>
                          <div>Expires: {scannedMedicine.expiryDate}</div>
                          {scannedMedicine.interactions && scannedMedicine.interactions.length > 0 && (
                            <div className="flex items-center gap-1 text-amber-600">
                              <AlertTriangle className="h-3 w-3" />
                              Interactions: {scannedMedicine.interactions.map((i) => i.drug).join(", ")}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="objects">
                {detectedObjects
                  .filter((obj) => obj.type === "object")
                  .map((obj) => (
                    <div key={obj.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">{obj.label}</div>
                          <div className="text-sm text-muted-foreground">
                            Confidence: {Math.round(obj.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">Object</Badge>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Person Selection Dialog */}
      <Dialog open={showPersonSelection} onOpenChange={setShowPersonSelection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Multiple Persons Detected</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Multiple people have been detected. Please select which person you'd like to focus on before proceeding
              with medicine scanning:
            </p>
            <div className="space-y-2">
              {detectedPersons.map((person) => (
                <Button
                  key={person.id}
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/10"
                  onClick={() => selectPerson(person)}
                >
                  <User className="h-4 w-4 mr-2" />
                  {person.name} (Confidence: {Math.round(person.confidence * 100)}%)
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {scannedMedicine && scannedMedicine.interactions && scannedMedicine.interactions.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-2">
              <div>
                <strong>⚠️ CRITICAL: Drug Interaction Detected!</strong>
              </div>
              <div>
                <strong>{scannedMedicine.name}</strong> may have dangerous interactions with your current medications:
              </div>
              {scannedMedicine.interactions.map((interaction, index) => (
                <div key={index} className="ml-4 p-2 bg-red-100 rounded border border-red-300">
                  <div className="font-semibold text-red-900">
                    {interaction.drug} ({interaction.severity.toUpperCase()} severity)
                  </div>
                  <div className="text-sm text-red-700">{interaction.description}</div>
                  <div className="text-xs text-red-600 mt-1">
                    Possible effects: {interaction.clinicalEffects.join(", ")}
                  </div>
                </div>
              ))}
              <div className="font-bold text-red-900 mt-2">
                🚨 DO NOT ADMINISTER - Consult pharmacist or physician immediately
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

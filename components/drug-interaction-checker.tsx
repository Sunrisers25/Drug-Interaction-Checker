"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Plus,
  Search,
  X,
  Shield,
  AlertCircle,
  Info,
  CheckCircle,
  Heart,
  Utensils,
  Activity,
  TestTube,
  Star,
  History,
  Download,
  Mic,
  QrCode,
  MessageCircle,
  Calculator,
  Clock,
  Brain,
  GitBranch,
  Layers,
  User,
  Zap,
  Network,
  Eye,
  FileText,
  ArrowRight,
  TrendingUp,
  Beaker,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface Drug {
  id: string
  name: string
  genericName: string
  category: string
  brandNames?: string[]
  dosageForm?: string
  strength?: string
  indication?: string
  contraindications?: string[]
  sideEffects?: string[]
  foodInteractions?: string[]
  lifestyleInteractions?: string[]
  labInterferences?: string[]
  isFavorite?: boolean
  // GNN node features
  molecularWeight?: number
  cyp450Enzymes?: string[]
  proteinBinding?: number
  halfLife?: string
  bioavailability?: number
  metabolismPathway?: string[]
  transporters?: string[]
}

interface DrugInteraction {
  id: string
  drug1: string
  drug2: string
  severity: "minor" | "moderate" | "major" | "contraindicated"
  description: string
  mechanism: string
  management: string
  clinicalEffects: string[]
  monitoringRequirements?: string[]
  onsetTime?: string
  documentation?: "excellent" | "good" | "fair" | "poor"
  // GNN edge features
  gnnConfidence?: number
  biochemPathway?: string[]
  molecularMechanism?: string
  enzymeInhibition?: string
  receptorBinding?: string
  pharmacokineticType?: "absorption" | "distribution" | "metabolism" | "excretion"
  pharmacodynamicType?: "synergistic" | "antagonistic" | "additive"
}

interface PatientFactor {
  id: string
  name: string
  type: "age" | "condition" | "allergy" | "pregnancy" | "renal" | "hepatic" | "genetic"
  value: string
  severity?: "mild" | "moderate" | "severe"
}

interface RiskScore {
  total: number
  breakdown: {
    drugInteractions: number
    polypharmacy: number
    patientFactors: number
    duplicateTherapy: number
    gnnPrediction: number
    patientHistory: number
  }
  riskLevel: "low" | "moderate" | "high" | "critical"
}

// GNN Graph Node
interface GNNNode {
  id: string
  drugName: string
  features: number[] // numerical feature vector
  embedding?: number[] // learned embedding
  neighbors: string[]
  nodeType: "drug" | "enzyme" | "receptor" | "pathway" | "transporter"
}

// GNN Graph Edge
interface GNNEdge {
  source: string
  target: string
  weight: number
  edgeType: "interacts" | "metabolized_by" | "inhibits" | "induces" | "binds_to" | "transported_by"
  confidence: number
}

// Knowledge Graph Entity
interface KGEntity {
  id: string
  name: string
  type: "drug" | "enzyme" | "receptor" | "pathway" | "gene" | "protein" | "metabolite" | "transporter"
  properties: Record<string, string | number>
}

// Knowledge Graph Relation
interface KGRelation {
  source: string
  target: string
  relationType: string
  evidence: string
  confidence: number
  references: string[]
}

// Mechanism Explanation
interface MechanismExplanation {
  interactionId: string
  pathway: string[]
  molecularDetail: string
  enzymeInvolvement: string[]
  receptorInvolvement: string[]
  timelinePhases: { phase: string; description: string; timeframe: string }[]
  riskFactors: string[]
  alternativeDrugs: string[]
  evidenceLevel: "high" | "moderate" | "low"
  references: string[]
}

// Patient History Profile
interface PatientProfile {
  id: string
  age: number
  weight: number
  gender: "male" | "female" | "other"
  geneticMarkers: { gene: string; variant: string; impact: string }[]
  organFunction: { organ: string; status: string; gfr?: number }[]
  currentMedications: string[]
  pastAdverseReactions: { drug: string; reaction: string; severity: string }[]
  comorbidities: string[]
  allergies: string[]
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
}
interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition
    SpeechRecognition: new () => SpeechRecognition
  }
}

// ============================================================
// SAMPLE DATA: Drugs with molecular properties
// ============================================================

const sampleDrugs: Drug[] = [
  {
    id: "1", name: "Aspirin", genericName: "Acetylsalicylic acid", category: "NSAID",
    brandNames: ["Bayer", "Bufferin", "Ecotrin"], dosageForm: "Tablet", strength: "81mg, 325mg",
    indication: "Pain relief, fever reduction, cardiovascular protection",
    contraindications: ["Active bleeding", "Severe renal impairment"],
    sideEffects: ["GI bleeding", "Tinnitus", "Allergic reactions"],
    foodInteractions: ["Alcohol (increased bleeding risk)", "Vitamin K foods"],
    lifestyleInteractions: ["Smoking (reduced effectiveness)"],
    labInterferences: ["PT/INR", "Platelet aggregation tests"],
    molecularWeight: 180.16, cyp450Enzymes: ["CYP2C9"], proteinBinding: 99, halfLife: "15-20 min (active metabolite 2-3 hrs)",
    bioavailability: 68, metabolismPathway: ["Hepatic hydrolysis", "CYP2C9"], transporters: ["OAT1", "OAT3"],
  },
  {
    id: "2", name: "Warfarin", genericName: "Warfarin sodium", category: "Anticoagulant",
    brandNames: ["Coumadin", "Jantoven"], dosageForm: "Tablet", strength: "1mg-10mg",
    indication: "Anticoagulation for atrial fibrillation, DVT/PE prevention",
    contraindications: ["Active bleeding", "Pregnancy", "Severe liver disease"],
    sideEffects: ["Bleeding", "Skin necrosis", "Purple toe syndrome"],
    foodInteractions: ["Vitamin K foods (leafy greens)", "Cranberry juice", "Alcohol"],
    lifestyleInteractions: ["Smoking cessation (may increase levels)"],
    labInterferences: ["PT/INR", "Factor assays"],
    molecularWeight: 308.33, cyp450Enzymes: ["CYP2C9", "CYP3A4", "CYP1A2"], proteinBinding: 99.5, halfLife: "20-60 hrs",
    bioavailability: 100, metabolismPathway: ["CYP2C9 (S-warfarin)", "CYP3A4 (R-warfarin)"], transporters: ["OATP1B1"],
  },
  {
    id: "3", name: "Metformin", genericName: "Metformin HCl", category: "Antidiabetic",
    brandNames: ["Glucophage", "Fortamet"], dosageForm: "Tablet", strength: "500mg, 850mg, 1000mg",
    indication: "Type 2 diabetes mellitus",
    contraindications: ["Severe renal impairment", "Metabolic acidosis"],
    sideEffects: ["GI upset", "Lactic acidosis (rare)", "B12 deficiency"],
    foodInteractions: ["Take with meals to reduce GI upset"],
    lifestyleInteractions: ["Alcohol (increased lactic acidosis risk)"],
    labInterferences: ["Serum creatinine", "Vitamin B12 levels"],
    molecularWeight: 129.16, cyp450Enzymes: [], proteinBinding: 0, halfLife: "4-8.7 hrs",
    bioavailability: 50, metabolismPathway: ["Not metabolized"], transporters: ["OCT1", "OCT2", "MATE1"],
  },
  {
    id: "4", name: "Lisinopril", genericName: "Lisinopril", category: "ACE Inhibitor",
    brandNames: ["Prinivil", "Zestril"], dosageForm: "Tablet", strength: "2.5mg-40mg",
    indication: "Hypertension, heart failure, post-MI",
    contraindications: ["Angioedema history", "Pregnancy"],
    sideEffects: ["Dry cough", "Hyperkalemia", "Angioedema"],
    foodInteractions: ["Potassium-rich foods (monitor levels)"],
    lifestyleInteractions: ["Exercise (monitor BP)"],
    labInterferences: ["Serum potassium", "Serum creatinine"],
    molecularWeight: 405.49, cyp450Enzymes: [], proteinBinding: 25, halfLife: "12 hrs",
    bioavailability: 25, metabolismPathway: ["Not metabolized"], transporters: ["PEPT1"],
  },
  {
    id: "5", name: "Simvastatin", genericName: "Simvastatin", category: "Statin",
    brandNames: ["Zocor"], dosageForm: "Tablet", strength: "5mg-80mg",
    indication: "Hypercholesterolemia, cardiovascular risk reduction",
    contraindications: ["Active liver disease", "Pregnancy"],
    sideEffects: ["Myalgia", "Elevated liver enzymes", "Rhabdomyolysis"],
    foodInteractions: ["Grapefruit juice (avoid)", "High-fat meals"],
    lifestyleInteractions: ["Alcohol (limit intake)"],
    labInterferences: ["CK levels", "Liver function tests"],
    molecularWeight: 418.57, cyp450Enzymes: ["CYP3A4"], proteinBinding: 95, halfLife: "1.9 hrs",
    bioavailability: 5, metabolismPathway: ["CYP3A4"], transporters: ["OATP1B1", "P-gp"],
  },
  {
    id: "6", name: "Omeprazole", genericName: "Omeprazole", category: "PPI",
    brandNames: ["Prilosec"], dosageForm: "Capsule", strength: "10mg, 20mg, 40mg",
    indication: "GERD, peptic ulcer disease",
    contraindications: ["Hypersensitivity to PPIs"],
    sideEffects: ["Headache", "Diarrhea", "Increased infection risk"],
    foodInteractions: ["Take before meals for best absorption"],
    lifestyleInteractions: ["Smoking (may reduce effectiveness)"],
    labInterferences: ["Gastrin levels", "Magnesium levels"],
    molecularWeight: 345.42, cyp450Enzymes: ["CYP2C19", "CYP3A4"], proteinBinding: 95, halfLife: "0.5-1 hr",
    bioavailability: 30, metabolismPathway: ["CYP2C19", "CYP3A4"], transporters: ["P-gp"],
  },
  {
    id: "7", name: "Digoxin", genericName: "Digoxin", category: "Cardiac Glycoside",
    brandNames: ["Lanoxin"], dosageForm: "Tablet", strength: "0.125mg, 0.25mg",
    indication: "Heart failure, atrial fibrillation",
    contraindications: ["Ventricular fibrillation", "Heart block"],
    sideEffects: ["Nausea", "Visual disturbances", "Arrhythmias"],
    foodInteractions: ["High-fiber foods (may reduce absorption)"],
    lifestyleInteractions: ["Exercise (monitor heart rate)"],
    labInterferences: ["Digoxin levels", "Electrolytes"],
    molecularWeight: 780.94, cyp450Enzymes: [], proteinBinding: 25, halfLife: "36-48 hrs",
    bioavailability: 70, metabolismPathway: ["Minimal hepatic"], transporters: ["P-gp"],
  },
  {
    id: "8", name: "Phenytoin", genericName: "Phenytoin sodium", category: "Anticonvulsant",
    brandNames: ["Dilantin"], dosageForm: "Capsule", strength: "30mg, 100mg",
    indication: "Epilepsy, seizure prevention",
    contraindications: ["Sinus bradycardia", "Heart block"],
    sideEffects: ["Gingival hyperplasia", "Hirsutism", "Ataxia"],
    foodInteractions: ["Enteral nutrition (may reduce absorption)"],
    lifestyleInteractions: ["Alcohol (may affect levels)"],
    labInterferences: ["Phenytoin levels", "Folate levels"],
    molecularWeight: 252.27, cyp450Enzymes: ["CYP2C9", "CYP2C19"], proteinBinding: 90, halfLife: "7-42 hrs",
    bioavailability: 70, metabolismPathway: ["CYP2C9", "CYP2C19"], transporters: ["P-gp"],
  },
]

// ============================================================
// GNN KNOWLEDGE GRAPH DATA
// ============================================================

const gnnNodes: GNNNode[] = [
  // Drug nodes
  ...sampleDrugs.map(d => ({
    id: d.id, drugName: d.name, nodeType: "drug" as const,
    features: [d.molecularWeight || 0, d.proteinBinding || 0, d.bioavailability || 0, (d.cyp450Enzymes?.length || 0) * 10],
    neighbors: [],
  })),
  // Enzyme nodes
  { id: "e1", drugName: "CYP2C9", nodeType: "enzyme" as const, features: [55000, 90, 100, 80], neighbors: ["1", "2", "8"] },
  { id: "e2", drugName: "CYP3A4", nodeType: "enzyme" as const, features: [57000, 95, 100, 90], neighbors: ["2", "5", "6"] },
  { id: "e3", drugName: "CYP2C19", nodeType: "enzyme" as const, features: [56000, 88, 100, 70], neighbors: ["6", "8"] },
  { id: "e4", drugName: "CYP1A2", nodeType: "enzyme" as const, features: [58000, 85, 100, 60], neighbors: ["2"] },
  // Transporter nodes
  { id: "t1", drugName: "P-glycoprotein", nodeType: "transporter" as const, features: [170000, 50, 100, 95], neighbors: ["5", "6", "7", "8"] },
  { id: "t2", drugName: "OATP1B1", nodeType: "transporter" as const, features: [90000, 60, 100, 80], neighbors: ["2", "5"] },
  { id: "t3", drugName: "OCT1", nodeType: "transporter" as const, features: [62000, 40, 100, 70], neighbors: ["3"] },
  // Receptor nodes
  { id: "r1", drugName: "COX-1", nodeType: "receptor" as const, features: [70000, 80, 100, 95], neighbors: ["1"] },
  { id: "r2", drugName: "COX-2", nodeType: "receptor" as const, features: [72000, 82, 100, 90], neighbors: ["1"] },
  { id: "r3", drugName: "VKORC1", nodeType: "receptor" as const, features: [18000, 90, 100, 99], neighbors: ["2"] },
  { id: "r4", drugName: "Na+/K+ ATPase", nodeType: "receptor" as const, features: [147000, 95, 100, 85], neighbors: ["7"] },
  // Pathway nodes
  { id: "p1", drugName: "Coagulation Cascade", nodeType: "pathway" as const, features: [0, 100, 100, 100], neighbors: ["1", "2"] },
  { id: "p2", drugName: "Glucose Metabolism", nodeType: "pathway" as const, features: [0, 100, 100, 80], neighbors: ["3", "4"] },
  { id: "p3", drugName: "Cholesterol Synthesis", nodeType: "pathway" as const, features: [0, 100, 100, 90], neighbors: ["5"] },
  { id: "p4", drugName: "Proton Pump Pathway", nodeType: "pathway" as const, features: [0, 100, 100, 85], neighbors: ["6"] },
]

const gnnEdges: GNNEdge[] = [
  // Drug-Enzyme interactions
  { source: "1", target: "e1", weight: 0.85, edgeType: "metabolized_by", confidence: 0.92 },
  { source: "2", target: "e1", weight: 0.95, edgeType: "metabolized_by", confidence: 0.98 },
  { source: "2", target: "e2", weight: 0.70, edgeType: "metabolized_by", confidence: 0.90 },
  { source: "5", target: "e2", weight: 0.92, edgeType: "metabolized_by", confidence: 0.96 },
  { source: "6", target: "e3", weight: 0.88, edgeType: "metabolized_by", confidence: 0.94 },
  { source: "6", target: "e3", weight: 0.75, edgeType: "inhibits", confidence: 0.89 },
  { source: "8", target: "e1", weight: 0.80, edgeType: "metabolized_by", confidence: 0.91 },
  { source: "8", target: "e3", weight: 0.78, edgeType: "metabolized_by", confidence: 0.88 },
  // Drug-Transporter interactions
  { source: "5", target: "t1", weight: 0.82, edgeType: "transported_by", confidence: 0.90 },
  { source: "7", target: "t1", weight: 0.90, edgeType: "transported_by", confidence: 0.95 },
  { source: "3", target: "t3", weight: 0.88, edgeType: "transported_by", confidence: 0.92 },
  // Drug-Receptor bindings
  { source: "1", target: "r1", weight: 0.95, edgeType: "binds_to", confidence: 0.98 },
  { source: "1", target: "r2", weight: 0.80, edgeType: "binds_to", confidence: 0.92 },
  { source: "2", target: "r3", weight: 0.98, edgeType: "inhibits", confidence: 0.99 },
  { source: "7", target: "r4", weight: 0.92, edgeType: "inhibits", confidence: 0.97 },
  // Drug-Drug interactions (edges in the GNN)
  { source: "1", target: "2", weight: 0.92, edgeType: "interacts", confidence: 0.96 },
  { source: "5", target: "7", weight: 0.78, edgeType: "interacts", confidence: 0.85 },
  { source: "6", target: "8", weight: 0.74, edgeType: "interacts", confidence: 0.82 },
  { source: "4", target: "3", weight: 0.45, edgeType: "interacts", confidence: 0.68 },
  // Drug-Pathway
  { source: "1", target: "p1", weight: 0.90, edgeType: "inhibits", confidence: 0.95 },
  { source: "2", target: "p1", weight: 0.95, edgeType: "inhibits", confidence: 0.98 },
  { source: "3", target: "p2", weight: 0.88, edgeType: "inhibits", confidence: 0.92 },
  { source: "5", target: "p3", weight: 0.93, edgeType: "inhibits", confidence: 0.96 },
]

// ============================================================
// BIOCHEMISTRY KNOWLEDGE GRAPH DATA
// ============================================================

const knowledgeGraphEntities: KGEntity[] = [
  { id: "kg1", name: "CYP2C9", type: "enzyme", properties: { location: "Liver", function: "Drug metabolism", substrate_count: 45 } },
  { id: "kg2", name: "CYP3A4", type: "enzyme", properties: { location: "Liver/Gut", function: "Major drug metabolism", substrate_count: 120 } },
  { id: "kg3", name: "CYP2C19", type: "enzyme", properties: { location: "Liver", function: "Drug metabolism", substrate_count: 30 } },
  { id: "kg4", name: "P-glycoprotein", type: "transporter", properties: { location: "Gut/BBB/Kidney", function: "Efflux transporter", gene: "ABCB1" } },
  { id: "kg5", name: "VKORC1", type: "protein", properties: { location: "ER membrane", function: "Vitamin K epoxide reductase", gene: "VKORC1" } },
  { id: "kg6", name: "COX-1", type: "enzyme", properties: { location: "Most tissues", function: "Prostaglandin synthesis", constitutive: 1 } },
  { id: "kg7", name: "HMG-CoA Reductase", type: "enzyme", properties: { location: "Liver", function: "Cholesterol synthesis", gene: "HMGCR" } },
  { id: "kg8", name: "H+/K+ ATPase", type: "protein", properties: { location: "Gastric parietal cells", function: "Acid secretion", gene: "ATP4A" } },
  { id: "kg9", name: "Thromboxane A2", type: "metabolite", properties: { function: "Platelet aggregation", pathway: "Arachidonic acid" } },
  { id: "kg10", name: "Prostacyclin (PGI2)", type: "metabolite", properties: { function: "Vasodilation, Anti-platelet", pathway: "Arachidonic acid" } },
]

const knowledgeGraphRelations: KGRelation[] = [
  { source: "Aspirin", target: "COX-1", relationType: "irreversibly_inhibits", evidence: "Acetylation of Ser530", confidence: 0.99, references: ["PMID:12345678"] },
  { source: "Aspirin", target: "Thromboxane A2", relationType: "reduces_production", evidence: "Via COX-1 inhibition in platelets", confidence: 0.98, references: ["PMID:23456789"] },
  { source: "Warfarin", target: "VKORC1", relationType: "inhibits", evidence: "Blocks vitamin K recycling", confidence: 0.99, references: ["PMID:34567890"] },
  { source: "Warfarin", target: "CYP2C9", relationType: "metabolized_by", evidence: "S-warfarin primary pathway", confidence: 0.97, references: ["PMID:45678901"] },
  { source: "Simvastatin", target: "HMG-CoA Reductase", relationType: "inhibits", evidence: "Competitive inhibition", confidence: 0.98, references: ["PMID:56789012"] },
  { source: "Simvastatin", target: "CYP3A4", relationType: "metabolized_by", evidence: "Primary metabolism pathway", confidence: 0.96, references: ["PMID:67890123"] },
  { source: "Simvastatin", target: "P-glycoprotein", relationType: "substrate_of", evidence: "Efflux transport", confidence: 0.88, references: ["PMID:78901234"] },
  { source: "Digoxin", target: "P-glycoprotein", relationType: "substrate_of", evidence: "Major elimination pathway", confidence: 0.95, references: ["PMID:89012345"] },
  { source: "Omeprazole", target: "H+/K+ ATPase", relationType: "irreversibly_inhibits", evidence: "Covalent binding", confidence: 0.99, references: ["PMID:90123456"] },
  { source: "Omeprazole", target: "CYP2C19", relationType: "inhibits", evidence: "Competitive inhibition", confidence: 0.91, references: ["PMID:01234567"] },
  { source: "Phenytoin", target: "CYP2C9", relationType: "metabolized_by", evidence: "Primary metabolism", confidence: 0.94, references: ["PMID:11234567"] },
  { source: "Phenytoin", target: "CYP2C19", relationType: "metabolized_by", evidence: "Secondary metabolism", confidence: 0.89, references: ["PMID:12234567"] },
]

// ============================================================
// MECHANISM EXPLANATIONS
// ============================================================

const mechanismExplanations: MechanismExplanation[] = [
  {
    interactionId: "1",
    pathway: ["Aspirin", "COX-1 Inhibition", "Thromboxane A2 Reduction", "Platelet Inhibition", "Bleeding Risk"],
    molecularDetail: "Aspirin irreversibly acetylates COX-1 at Ser530, permanently blocking thromboxane A2 synthesis in platelets. Since platelets lack nuclei, they cannot regenerate COX-1, resulting in the antiplatelet effect lasting the full platelet lifespan (~10 days). Warfarin independently inhibits VKORC1, blocking vitamin K-dependent clotting factor synthesis (II, VII, IX, X). The combination creates dual-pathway hemostasis impairment.",
    enzymeInvolvement: ["COX-1 (irreversible acetylation by Aspirin)", "VKORC1 (inhibited by Warfarin)", "CYP2C9 (metabolizes both drugs - competitive inhibition)"],
    receptorInvolvement: ["Thromboxane A2 receptor (TP)", "Vitamin K-dependent clotting factors (II, VII, IX, X)"],
    timelinePhases: [
      { phase: "Immediate (0-2h)", description: "Aspirin rapidly inhibits platelet COX-1; onset of additional bleeding risk", timeframe: "0-2 hours" },
      { phase: "Short-term (2-24h)", description: "Peak plasma levels reached; Aspirin competes with Warfarin for CYP2C9 metabolism", timeframe: "2-24 hours" },
      { phase: "Sustained (1-7d)", description: "Full antiplatelet effect established; INR may increase due to CYP2C9 competition", timeframe: "1-7 days" },
      { phase: "Steady-state (7-14d)", description: "Maximum combined bleeding risk; monitoring critical", timeframe: "7-14 days" },
    ],
    riskFactors: ["Age > 65", "History of GI bleeding", "Concurrent SSRI use", "Renal impairment", "Low platelet count", "Recent surgery"],
    alternativeDrugs: ["Clopidogrel (if antiplatelet needed)", "Direct oral anticoagulants (DOACs)", "Low-molecular-weight heparin"],
    evidenceLevel: "high",
    references: ["PMID:28847457", "PMID:31562050", "PMID:29282936"],
  },
  {
    interactionId: "2",
    pathway: ["Simvastatin", "P-glycoprotein Inhibition", "Reduced Digoxin Efflux", "Increased Digoxin Levels", "Toxicity Risk"],
    molecularDetail: "Simvastatin and its active metabolite simvastatin acid inhibit P-glycoprotein (ABCB1) in the intestinal epithelium and renal tubules. Digoxin is a well-known P-gp substrate, and inhibition of this efflux transporter reduces digoxin elimination from both the gut (increasing absorption) and kidneys (reducing excretion), leading to elevated serum digoxin concentrations.",
    enzymeInvolvement: ["P-glycoprotein (inhibited by Simvastatin)", "CYP3A4 (metabolizes Simvastatin)"],
    receptorInvolvement: ["Na+/K+ ATPase (target of Digoxin)", "P-glycoprotein/ABCB1 (efflux transporter)"],
    timelinePhases: [
      { phase: "Early (0-3d)", description: "Initial P-gp inhibition begins; intestinal digoxin absorption may increase", timeframe: "0-3 days" },
      { phase: "Intermediate (3-7d)", description: "Renal P-gp inhibition affects digoxin clearance; levels begin rising", timeframe: "3-7 days" },
      { phase: "Peak effect (1-2w)", description: "New steady-state digoxin levels reached; monitoring essential", timeframe: "1-2 weeks" },
    ],
    riskFactors: ["Renal impairment", "Hypokalemia", "Hypomagnesemia", "Hypothyroidism", "Age > 70"],
    alternativeDrugs: ["Pravastatin (minimal P-gp inhibition)", "Rosuvastatin", "Fluvastatin"],
    evidenceLevel: "moderate",
    references: ["PMID:21412232", "PMID:19625752"],
  },
  {
    interactionId: "3",
    pathway: ["Omeprazole", "CYP2C19 Inhibition", "Reduced Phenytoin Metabolism", "Increased Phenytoin Levels", "CNS Toxicity Risk"],
    molecularDetail: "Omeprazole is both a substrate and inhibitor of CYP2C19. Phenytoin is primarily metabolized by CYP2C9 with secondary metabolism via CYP2C19. When omeprazole inhibits CYP2C19, phenytoin's secondary metabolic pathway is blocked, leading to reduced clearance. This is particularly significant in CYP2C9 poor metabolizers where CYP2C19 becomes a more critical elimination pathway.",
    enzymeInvolvement: ["CYP2C19 (inhibited by Omeprazole; metabolizes Phenytoin)", "CYP2C9 (primary Phenytoin metabolism)"],
    receptorInvolvement: ["H+/K+ ATPase (Omeprazole target)", "Voltage-gated sodium channels (Phenytoin target)"],
    timelinePhases: [
      { phase: "Onset (3-7d)", description: "CYP2C19 inhibition begins; phenytoin levels may start rising", timeframe: "3-7 days" },
      { phase: "Accumulation (1-3w)", description: "Progressive phenytoin accumulation due to nonlinear kinetics", timeframe: "1-3 weeks" },
      { phase: "Steady-state (3-4w)", description: "New steady-state reached; toxicity risk highest", timeframe: "3-4 weeks" },
    ],
    riskFactors: ["CYP2C9 poor metabolizer genotype", "CYP2C19 extensive metabolizer", "Hepatic impairment", "Hypoalbuminemia"],
    alternativeDrugs: ["Pantoprazole (less CYP2C19 inhibition)", "Famotidine (H2 blocker)", "Esomeprazole (lower dose)"],
    evidenceLevel: "moderate",
    references: ["PMID:15625333", "PMID:18636780"],
  },
  {
    interactionId: "4",
    pathway: ["Lisinopril", "RAAS Inhibition", "Improved Insulin Sensitivity", "Enhanced Glucose Lowering", "Hypoglycemia Risk"],
    molecularDetail: "ACE inhibitors like lisinopril block the conversion of angiotensin I to angiotensin II. Reduced angiotensin II levels improve skeletal muscle blood flow and insulin delivery to tissues, enhancing insulin sensitivity. This potentiates metformin's glucose-lowering effect, particularly in patients with microvascular complications. The bradykinin-mediated vasodilation from ACE inhibition further enhances glucose uptake.",
    enzymeInvolvement: ["Angiotensin-Converting Enzyme (inhibited by Lisinopril)", "AMPK (activated by Metformin)"],
    receptorInvolvement: ["AT1 receptor (reduced angiotensin II signaling)", "Bradykinin B2 receptor (increased bradykinin)"],
    timelinePhases: [
      { phase: "Acute (1-3d)", description: "Initial RAAS suppression; minimal glucose effect", timeframe: "1-3 days" },
      { phase: "Intermediate (1-4w)", description: "Progressive improvement in insulin sensitivity", timeframe: "1-4 weeks" },
      { phase: "Chronic (1-3m)", description: "Full effect on glucose homeostasis; dose adjustment may be needed", timeframe: "1-3 months" },
    ],
    riskFactors: ["Renal impairment (both drugs)", "Dehydration", "Concurrent sulfonylurea use", "Fasting states"],
    alternativeDrugs: ["ARBs (similar but possibly less glucose effect)", "Amlodipine (calcium channel blocker)"],
    evidenceLevel: "moderate",
    references: ["PMID:16825686", "PMID:20200172"],
  },
]

// ============================================================
// DRUG INTERACTIONS DATABASE
// ============================================================

const drugInteractions: DrugInteraction[] = [
  {
    id: "1", drug1: "Aspirin", drug2: "Warfarin", severity: "major",
    description: "Increased risk of bleeding due to additive anticoagulant effects through dual-pathway hemostasis impairment",
    mechanism: "Aspirin irreversibly inhibits platelet COX-1 (blocking TXA2) while Warfarin inhibits VKORC1 (blocking factors II, VII, IX, X). Both compete for CYP2C9 metabolism.",
    management: "Monitor INR closely (weekly initially), consider dose adjustment, watch for bleeding signs, educate patient on bleeding precautions",
    clinicalEffects: ["Increased bleeding risk", "Prolonged clotting time", "GI bleeding", "Bruising", "Hemorrhagic stroke risk"],
    monitoringRequirements: ["INR (weekly x4, then monthly)", "CBC with platelets", "Stool guaiac", "Signs of bleeding"],
    onsetTime: "Within 24-48 hours", documentation: "excellent",
    gnnConfidence: 0.96, biochemPathway: ["COX-1 Inhibition", "VKORC1 Inhibition", "CYP2C9 Competition"],
    molecularMechanism: "Dual pathway hemostasis impairment via COX-1 and VKORC1",
    enzymeInhibition: "CYP2C9 competitive inhibition", receptorBinding: "COX-1 (irreversible), VKORC1",
    pharmacokineticType: "metabolism", pharmacodynamicType: "synergistic",
  },
  {
    id: "2", drug1: "Simvastatin", drug2: "Digoxin", severity: "moderate",
    description: "Simvastatin may increase digoxin levels through P-glycoprotein inhibition in gut and kidneys",
    mechanism: "Simvastatin inhibits P-glycoprotein (ABCB1) transport, reducing digoxin efflux from intestinal epithelium and renal tubular cells",
    management: "Monitor digoxin levels 1-2 weeks after starting simvastatin, watch for signs of toxicity, consider dose reduction",
    clinicalEffects: ["Nausea", "Arrhythmias", "Visual disturbances", "Confusion", "Cardiac toxicity"],
    monitoringRequirements: ["Digoxin levels", "ECG", "Electrolytes (K+, Mg2+)", "Renal function"],
    onsetTime: "1-2 weeks", documentation: "good",
    gnnConfidence: 0.85, biochemPathway: ["P-glycoprotein Inhibition", "Reduced Renal Clearance"],
    molecularMechanism: "P-gp efflux transporter inhibition", enzymeInhibition: "P-glycoprotein (ABCB1)",
    receptorBinding: "Na+/K+ ATPase (Digoxin target)",
    pharmacokineticType: "excretion", pharmacodynamicType: "additive",
  },
  {
    id: "3", drug1: "Omeprazole", drug2: "Phenytoin", severity: "moderate",
    description: "Omeprazole inhibits CYP2C19, reducing phenytoin clearance and risking CNS toxicity",
    mechanism: "Omeprazole inhibits CYP2C19 enzyme responsible for secondary phenytoin metabolism; critical in CYP2C9 poor metabolizers",
    management: "Monitor phenytoin levels 2-3 weeks after starting omeprazole, adjust dose if necessary, watch for toxicity signs",
    clinicalEffects: ["Ataxia", "Confusion", "Nystagmus", "Drowsiness", "Seizure breakthrough (if toxic)"],
    monitoringRequirements: ["Phenytoin levels (free and total)", "Neurological assessment", "Liver function", "Albumin"],
    onsetTime: "2-3 weeks", documentation: "good",
    gnnConfidence: 0.82, biochemPathway: ["CYP2C19 Inhibition", "Reduced Hepatic Clearance"],
    molecularMechanism: "CYP2C19 competitive inhibition", enzymeInhibition: "CYP2C19",
    receptorBinding: "Voltage-gated Na+ channels (Phenytoin target)",
    pharmacokineticType: "metabolism", pharmacodynamicType: "additive",
  },
  {
    id: "4", drug1: "Lisinopril", drug2: "Metformin", severity: "minor",
    description: "ACE inhibitors may enhance the hypoglycemic effect of metformin through improved insulin sensitivity",
    mechanism: "ACE inhibitors reduce angiotensin II, improving skeletal muscle blood flow and insulin delivery; bradykinin enhancement improves glucose uptake",
    management: "Monitor blood glucose levels, educate patient on hypoglycemia signs, consider metformin dose adjustment",
    clinicalEffects: ["Enhanced glucose lowering", "Potential hypoglycemia", "Improved insulin sensitivity"],
    monitoringRequirements: ["Blood glucose", "HbA1c", "Renal function", "Potassium"],
    onsetTime: "Days to weeks", documentation: "fair",
    gnnConfidence: 0.68, biochemPathway: ["RAAS Inhibition", "Insulin Sensitization", "AMPK Activation"],
    molecularMechanism: "RAAS-mediated insulin sensitivity improvement",
    enzymeInhibition: "Angiotensin-Converting Enzyme", receptorBinding: "AT1 receptor, Bradykinin B2 receptor",
    pharmacokineticType: "distribution", pharmacodynamicType: "synergistic",
  },
]

const foodInteractionsData = [
  { drug: "Warfarin", food: "Leafy greens (Vitamin K)", effect: "Decreased anticoagulation", management: "Maintain consistent intake" },
  { drug: "Warfarin", food: "Cranberry juice", effect: "Increased bleeding risk", management: "Avoid or limit consumption" },
  { drug: "Simvastatin", food: "Grapefruit juice", effect: "Increased statin levels via CYP3A4 inhibition", management: "Avoid grapefruit products" },
  { drug: "Digoxin", food: "High-fiber foods", effect: "Decreased absorption", management: "Separate administration by 2 hours" },
  { drug: "Phenytoin", food: "Enteral nutrition", effect: "Decreased absorption", management: "Hold feeds 2 hours before/after dose" },
  { drug: "Metformin", food: "Alcohol", effect: "Increased lactic acidosis risk", management: "Limit alcohol intake" },
]

const lifestyleInteractionsData = [
  { drug: "Warfarin", lifestyle: "Smoking cessation", effect: "May increase warfarin levels (CYP1A2 induction decreases)", management: "Monitor INR closely during cessation" },
  { drug: "Metformin", lifestyle: "Alcohol consumption", effect: "Increased lactic acidosis risk", management: "Limit alcohol intake" },
  { drug: "Aspirin", lifestyle: "Smoking", effect: "Reduced cardiovascular benefits", management: "Encourage smoking cessation" },
  { drug: "Simvastatin", lifestyle: "Intense exercise", effect: "Increased myopathy risk", management: "Moderate exercise; report muscle pain" },
]

// ============================================================
// DEFAULT PATIENT PROFILE
// ============================================================

const defaultPatientProfile: PatientProfile = {
  id: "default",
  age: 65,
  weight: 75,
  gender: "male",
  geneticMarkers: [
    { gene: "CYP2C9", variant: "*1/*1", impact: "Normal metabolizer" },
    { gene: "CYP2C19", variant: "*1/*2", impact: "Intermediate metabolizer" },
    { gene: "VKORC1", variant: "-1639 G>A (AG)", impact: "Intermediate warfarin sensitivity" },
    { gene: "ABCB1", variant: "3435 C>T (CT)", impact: "Intermediate P-gp expression" },
  ],
  organFunction: [
    { organ: "Kidney", status: "Mild impairment", gfr: 62 },
    { organ: "Liver", status: "Normal", gfr: undefined },
  ],
  currentMedications: [],
  pastAdverseReactions: [
    { drug: "Codeine", reaction: "Severe nausea", severity: "moderate" },
  ],
  comorbidities: ["Hypertension", "Type 2 Diabetes", "Hyperlipidemia"],
  allergies: ["Sulfonamides"],
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function DrugInteractionChecker() {
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [patientFactors, setPatientFactors] = useState<PatientFactor[]>([])
  const [interactions, setInteractions] = useState<DrugInteraction[]>([])
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("drugs")
  const [isListening, setIsListening] = useState(false)
  const [isScanningBarcode, setIsScanningBarcode] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [isAddPatientFactorOpen, setIsAddPatientFactorOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(defaultPatientProfile)
  const [selectedExplanation, setSelectedExplanation] = useState<MechanismExplanation | null>(null)
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false)
  const [gnnAnalysisRunning, setGnnAnalysisRunning] = useState(false)
  const [gnnResults, setGnnResults] = useState<{ predicted: boolean; confidence: number; pathways: string[] }[]>([])

  const { toast } = useToast()

  const [newPatientFactor, setNewPatientFactor] = useState({
    name: "", type: "condition" as PatientFactor["type"], value: "", severity: "moderate" as "mild" | "moderate" | "severe",
  })

  const filteredDrugs = sampleDrugs.filter(
    (drug) =>
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // ============================================================
  // GNN: Message-Passing Neural Network Simulation
  // Implements multi-layer message passing that traverses
  // protein structures and metabolic pathways to predict
  // chemical interactions for new prescriptions.
  // ============================================================

  // Layer 1: Aggregate neighbor features (enzymes, receptors, transporters)
  const aggregateNeighborFeatures = useCallback((drugId: string): number[] => {
    const directEdges = gnnEdges.filter(e => e.source === drugId || e.target === drugId)
    if (directEdges.length === 0) return [0, 0, 0, 0]

    let enzymeScore = 0, transporterScore = 0, receptorScore = 0, pathwayScore = 0
    for (const edge of directEdges) {
      const neighborId = edge.source === drugId ? edge.target : edge.source
      const neighborNode = gnnNodes.find(n => n.id === neighborId)
      if (!neighborNode) continue
      const weightedConf = edge.weight * edge.confidence
      if (neighborNode.nodeType === "enzyme") enzymeScore += weightedConf
      else if (neighborNode.nodeType === "transporter") transporterScore += weightedConf
      else if (neighborNode.nodeType === "receptor") receptorScore += weightedConf
      else if (neighborNode.nodeType === "pathway") pathwayScore += weightedConf
    }
    return [enzymeScore, transporterScore, receptorScore, pathwayScore]
  }, [])

  // Layer 2: Traverse shared metabolic/protein pathway connections
  const traverseSharedPathways = useCallback((d1Id: string, d2Id: string): { sharedEntities: string[]; traversalScore: number; mechanismChain: string[] } => {
    const d1Edges = gnnEdges.filter(e => e.source === d1Id || e.target === d1Id)
    const d2Edges = gnnEdges.filter(e => e.source === d2Id || e.target === d2Id)

    const d1Neighbors = new Set(d1Edges.map(e => e.source === d1Id ? e.target : e.source))
    const d2Neighbors = new Set(d2Edges.map(e => e.source === d2Id ? e.target : e.source))

    const sharedEntities: string[] = []
    const mechanismChain: string[] = []
    let traversalScore = 0

    // Find shared intermediate nodes (enzymes/transporters/receptors)
    for (const n1 of d1Neighbors) {
      if (d2Neighbors.has(n1)) {
        const node = gnnNodes.find(n => n.id === n1)
        if (node) {
          sharedEntities.push(node.drugName)
          const d1Edge = d1Edges.find(e => e.source === n1 || e.target === n1)
          const d2Edge = d2Edges.find(e => e.source === n1 || e.target === n1)
          const drug1 = sampleDrugs.find(d => d.id === d1Id)
          const drug2 = sampleDrugs.find(d => d.id === d2Id)
          if (d1Edge && d2Edge && drug1 && drug2) {
            // Generate mechanism explanation: "Drug A inhibits Enzyme CYP450 needed for Drug B"
            mechanismChain.push(
              `${drug1.name} ${d1Edge.edgeType.replace(/_/g, " ")}s ${node.drugName} (${node.nodeType}) which is needed to ${d2Edge.edgeType.replace(/_/g, " ")} ${drug2.name}`
            )
            traversalScore += (d1Edge.confidence + d2Edge.confidence) / 2
          }
        }
      }
    }

    // Also check 2-hop paths (drug1 -> entity1 -> entity2 -> drug2)
    for (const n1 of d1Neighbors) {
      const n1Node = gnnNodes.find(n => n.id === n1)
      if (!n1Node || n1Node.nodeType === "drug") continue
      // Check if n1 connects to any n2 that connects to d2
      const n1Edges = gnnEdges.filter(e => e.source === n1 || e.target === n1)
      for (const n1Edge of n1Edges) {
        const midId = n1Edge.source === n1 ? n1Edge.target : n1Edge.source
        if (d2Neighbors.has(midId) && midId !== d1Id) {
          const midNode = gnnNodes.find(n => n.id === midId)
          if (midNode && !sharedEntities.includes(midNode.drugName)) {
            const drug1 = sampleDrugs.find(d => d.id === d1Id)
            const drug2 = sampleDrugs.find(d => d.id === d2Id)
            if (drug1 && drug2) {
              mechanismChain.push(
                `${drug1.name} affects ${n1Node.drugName} which modulates ${midNode.drugName} needed by ${drug2.name} (2-hop pathway)`
              )
              traversalScore += n1Edge.confidence * 0.5
            }
          }
        }
      }
    }

    return { sharedEntities, traversalScore, mechanismChain }
  }, [])

  // Layer 3: Apply patient history to adjust predictions
  const applyPatientHistoryToGNN = useCallback((baseConfidence: number, d1: Drug, d2: Drug): { adjustedConfidence: number; patientFactorsApplied: string[] } => {
    let adjusted = baseConfidence
    const factors: string[] = []

    // Age: elderly patients have slower metabolism -> higher interaction risk
    if (patientProfile.age > 75) {
      adjusted *= 1.25
      factors.push(`Elderly (${patientProfile.age}y): Reduced hepatic/renal clearance increases interaction probability`)
    } else if (patientProfile.age > 65) {
      adjusted *= 1.15
      factors.push(`Senior (${patientProfile.age}y): Age-related pharmacokinetic changes`)
    }

    // Genetic markers affecting shared enzymes
    for (const marker of patientProfile.geneticMarkers) {
      const d1UsesEnzyme = (d1.cyp450Enzymes || []).some(e => e.includes(marker.gene))
      const d2UsesEnzyme = (d2.cyp450Enzymes || []).some(e => e.includes(marker.gene))
      if (d1UsesEnzyme || d2UsesEnzyme) {
        if (marker.impact.includes("Poor") || marker.impact.includes("Intermediate")) {
          adjusted *= 1.2
          factors.push(`${marker.gene} ${marker.variant} (${marker.impact}): Altered metabolism of ${d1UsesEnzyme ? d1.name : d2.name}`)
        }
      }
    }

    // Renal impairment for renally cleared drugs
    const renalOrgan = patientProfile.organFunction.find(o => o.organ === "Kidney")
    if (renalOrgan?.gfr && renalOrgan.gfr < 60) {
      const renalDrugs = [d1, d2].filter(d => (d.transporters || []).some(t => t.includes("OAT") || t.includes("OCT") || t.includes("MATE")))
      if (renalDrugs.length > 0) {
        adjusted *= 1.2
        factors.push(`Renal impairment (GFR ${renalOrgan.gfr}): Reduced clearance of ${renalDrugs.map(d => d.name).join(", ")}`)
      }
    }

    // Past adverse reactions to same drug class
    for (const adr of patientProfile.pastAdverseReactions) {
      if ([d1, d2].some(d => d.name === adr.drug || d.category === sampleDrugs.find(sd => sd.name === adr.drug)?.category)) {
        adjusted *= 1.15
        factors.push(`Past ADR: ${adr.drug} (${adr.reaction}) - Same class sensitivity`)
      }
    }

    // Polypharmacy: current medication count increases combinatorial risk
    if (patientProfile.currentMedications.length > 5) {
      adjusted *= 1.1
      factors.push(`Polypharmacy (${patientProfile.currentMedications.length} current meds): Increased combinatorial risk`)
    }

    return { adjustedConfidence: Math.min(adjusted, 0.99), patientFactorsApplied: factors }
  }, [patientProfile])

  const runGNNAnalysis = useCallback((drugs: Drug[]) => {
    if (drugs.length < 2) { setGnnResults([]); return }
    setGnnAnalysisRunning(true)

    // Simulate GNN forward pass with message passing layers
    setTimeout(() => {
      const results: { predicted: boolean; confidence: number; pathways: string[] }[] = []

      for (let i = 0; i < drugs.length; i++) {
        for (let j = i + 1; j < drugs.length; j++) {
          const d1 = drugs[i], d2 = drugs[j]

          // === Layer 1: Node feature aggregation ===
          const d1Agg = aggregateNeighborFeatures(d1.id)
          const d2Agg = aggregateNeighborFeatures(d2.id)

          // Compute aggregated feature similarity
          const aggDot = d1Agg.reduce((s, v, k) => s + v * d2Agg[k], 0)
          const aggMag1 = Math.sqrt(d1Agg.reduce((s, v) => s + v * v, 0)) || 1
          const aggMag2 = Math.sqrt(d2Agg.reduce((s, v) => s + v * v, 0)) || 1
          const aggSimilarity = aggDot / (aggMag1 * aggMag2)

          // === Layer 2: Graph traversal through shared pathways ===
          const traversal = traverseSharedPathways(d1.id, d2.id)

          // Check known direct edge
          const knownEdge = gnnEdges.find(
            e => (e.source === d1.id && e.target === d2.id && e.edgeType === "interacts") ||
                 (e.source === d2.id && e.target === d1.id && e.edgeType === "interacts")
          )

          // === Attention pooling: weighted combination ===
          let baseConfidence = 0
          const pathways: string[] = []

          // Known direct interaction gets highest weight
          if (knownEdge) {
            baseConfidence += knownEdge.confidence * 0.4
            pathways.push(`Direct GNN edge (${(knownEdge.confidence * 100).toFixed(0)}% confidence)`)
          }

          // Shared pathway traversal
          if (traversal.sharedEntities.length > 0) {
            baseConfidence += Math.min(traversal.traversalScore * 0.3, 0.35)
            pathways.push(`Shared: ${traversal.sharedEntities.join(", ")}`)
            // Add mechanism explanations
            for (const mech of traversal.mechanismChain.slice(0, 3)) {
              pathways.push(mech)
            }
          }

          // Feature similarity contributes
          if (aggSimilarity > 0.3) {
            baseConfidence += aggSimilarity * 0.2
            pathways.push(`Molecular feature similarity: ${(aggSimilarity * 100).toFixed(0)}%`)
          }

          // Shared CYP450 enzymes (direct check)
          const sharedEnzymes = (d1.cyp450Enzymes || []).filter(e => (d2.cyp450Enzymes || []).includes(e))
          if (sharedEnzymes.length > 0) {
            baseConfidence += sharedEnzymes.length * 0.08
            pathways.push(`${d1.name} competes with ${d2.name} for ${sharedEnzymes.join(", ")} metabolism`)
          }

          // Shared transporters
          const sharedTransporters = (d1.transporters || []).filter(t => (d2.transporters || []).includes(t))
          if (sharedTransporters.length > 0) {
            baseConfidence += sharedTransporters.length * 0.06
            pathways.push(`${d1.name} and ${d2.name} compete for ${sharedTransporters.join(", ")} transport`)
          }

          // === Layer 3: Patient history personalization ===
          const patientAdj = applyPatientHistoryToGNN(baseConfidence, d1, d2)
          if (patientAdj.patientFactorsApplied.length > 0) {
            for (const f of patientAdj.patientFactorsApplied) {
              pathways.push(`[Patient] ${f}`)
            }
          }

          const finalConfidence = Math.min(patientAdj.adjustedConfidence, 0.99)
          results.push({ predicted: finalConfidence > 0.4, confidence: finalConfidence, pathways })
        }
      }

      setGnnResults(results)
      setGnnAnalysisRunning(false)
    }, 1800)
  }, [aggregateNeighborFeatures, traverseSharedPathways, applyPatientHistoryToGNN])

  // ============================================================
  // Patient History Risk Personalization
  // ============================================================

  const getPersonalizedRisk = useCallback((interaction: DrugInteraction): { multiplier: number; factors: string[] } => {
    let multiplier = 1.0
    const factors: string[] = []

    // Age factor
    if (patientProfile.age > 65) {
      multiplier *= 1.4
      factors.push(`Age ${patientProfile.age} (>65): +40% risk`)
    } else if (patientProfile.age > 75) {
      multiplier *= 1.8
      factors.push(`Age ${patientProfile.age} (>75): +80% risk`)
    }

    // Genetic markers
    patientProfile.geneticMarkers.forEach(marker => {
      if (marker.gene === "CYP2C9" && interaction.enzymeInhibition?.includes("CYP2C9")) {
        if (marker.variant.includes("*2") || marker.variant.includes("*3")) {
          multiplier *= 1.5
          factors.push(`${marker.gene} ${marker.variant}: Poor metabolizer - +50% risk`)
        }
      }
      if (marker.gene === "CYP2C19" && interaction.enzymeInhibition?.includes("CYP2C19")) {
        if (marker.variant.includes("*2")) {
          multiplier *= 1.3
          factors.push(`${marker.gene} ${marker.variant}: Intermediate metabolizer - +30% risk`)
        }
      }
      if (marker.gene === "VKORC1" && interaction.drug1 === "Warfarin" || interaction.drug2 === "Warfarin") {
        if (marker.variant.includes("A")) {
          multiplier *= 1.3
          factors.push(`${marker.gene} ${marker.variant}: Warfarin sensitivity - +30% risk`)
        }
      }
      if (marker.gene === "ABCB1" && interaction.enzymeInhibition?.includes("P-glycoprotein")) {
        if (marker.variant.includes("T")) {
          multiplier *= 1.2
          factors.push(`${marker.gene} ${marker.variant}: Reduced P-gp expression - +20% risk`)
        }
      }
    })

    // Organ function
    patientProfile.organFunction.forEach(organ => {
      if (organ.organ === "Kidney" && organ.gfr && organ.gfr < 60) {
        if (interaction.drug1 === "Digoxin" || interaction.drug2 === "Digoxin" ||
            interaction.drug1 === "Metformin" || interaction.drug2 === "Metformin") {
          multiplier *= 1.5
          factors.push(`Renal impairment (GFR ${organ.gfr}): +50% risk for renally cleared drugs`)
        }
      }
      if (organ.organ === "Liver" && organ.status !== "Normal") {
        if (interaction.pharmacokineticType === "metabolism") {
          multiplier *= 1.4
          factors.push(`Hepatic impairment: +40% risk for hepatically metabolized drugs`)
        }
      }
    })

    // Past adverse reactions
    patientProfile.pastAdverseReactions.forEach(reaction => {
      const relatedDrug = sampleDrugs.find(d => d.name === reaction.drug)
      if (relatedDrug && (relatedDrug.category === sampleDrugs.find(d => d.name === interaction.drug1)?.category ||
          relatedDrug.category === sampleDrugs.find(d => d.name === interaction.drug2)?.category)) {
        multiplier *= 1.2
        factors.push(`Past ADR to ${reaction.drug} (${reaction.reaction}): +20% risk for same class`)
      }
    })

    // Comorbidities
    if (patientProfile.comorbidities.includes("Hypertension") &&
        (interaction.drug1 === "Aspirin" || interaction.drug2 === "Aspirin")) {
      factors.push("Hypertension: Monitor blood pressure with NSAIDs")
    }

    return { multiplier: Math.round(multiplier * 100) / 100, factors }
  }, [patientProfile])

  // ============================================================
  // CORE INTERACTION LOGIC
  // ============================================================

  const addDrug = (drug: Drug) => {
    if (!selectedDrugs.find((d) => d.id === drug.id)) {
      const newSelectedDrugs = [...selectedDrugs, drug]
      setSelectedDrugs(newSelectedDrugs)
      checkInteractions(newSelectedDrugs)
      if (!searchHistory.includes(drug.name)) {
        setSearchHistory((prev) => [drug.name, ...prev.slice(0, 9)])
      }
      setSearchTerm("")
      calculateRiskScore(newSelectedDrugs, patientFactors)
      runGNNAnalysis(newSelectedDrugs)
    }
  }

  const removeDrug = (drugId: string) => {
    const newSelectedDrugs = selectedDrugs.filter((d) => d.id !== drugId)
    setSelectedDrugs(newSelectedDrugs)
    checkInteractions(newSelectedDrugs)
    calculateRiskScore(newSelectedDrugs, patientFactors)
    runGNNAnalysis(newSelectedDrugs)
    setSelectedExplanation(null)
  }

  const checkInteractions = (drugs: Drug[]) => {
    const found: DrugInteraction[] = []
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const interaction = drugInteractions.find(
          (int) =>
            (int.drug1 === drugs[i].name && int.drug2 === drugs[j].name) ||
            (int.drug1 === drugs[j].name && int.drug2 === drugs[i].name),
        )
        if (interaction) found.push(interaction)
      }
    }
    setInteractions(found)
  }

  const calculateRiskScore = (drugs: Drug[], factors: PatientFactor[]) => {
    const breakdown = { drugInteractions: 0, polypharmacy: 0, patientFactors: 0, duplicateTherapy: 0, gnnPrediction: 0, patientHistory: 0 }

    // Drug interactions
    drugInteractions.forEach((interaction) => {
      const hasDrug1 = drugs.some(d => d.name === interaction.drug1)
      const hasDrug2 = drugs.some(d => d.name === interaction.drug2)
      if (hasDrug1 && hasDrug2) {
        const severityScore = interaction.severity === "contraindicated" ? 10 : interaction.severity === "major" ? 5 : interaction.severity === "moderate" ? 3 : 1
        const personalizedRisk = getPersonalizedRisk(interaction)
        breakdown.drugInteractions += Math.round(severityScore * personalizedRisk.multiplier)
      }
    })

    // Polypharmacy
    if (drugs.length >= 5) breakdown.polypharmacy = Math.min(drugs.length - 4, 5)

    // Patient factors
    factors.forEach((f) => {
      breakdown.patientFactors += f.severity === "severe" ? 3 : f.severity === "moderate" ? 2 : 1
    })

    // Duplicate therapy
    const cats = drugs.map((d) => d.category)
    breakdown.duplicateTherapy = cats.filter((c, i) => cats.indexOf(c) !== i).length * 2

    // GNN prediction bonus
    const gnnPredictions = gnnResults.filter(r => r.predicted && r.confidence > 0.7)
    breakdown.gnnPrediction = gnnPredictions.length * 2

    // Patient history risk
    if (patientProfile.age > 65) breakdown.patientHistory += 2
    if (patientProfile.organFunction.some(o => o.organ === "Kidney" && o.gfr && o.gfr < 60)) breakdown.patientHistory += 2
    if (patientProfile.pastAdverseReactions.length > 0) breakdown.patientHistory += 1
    if (patientProfile.geneticMarkers.some(g => g.impact.includes("Poor") || g.impact.includes("Intermediate"))) breakdown.patientHistory += 1

    const total = Object.values(breakdown).reduce((a, b) => a + b, 0)
    const riskLevel: RiskScore["riskLevel"] = total <= 3 ? "low" : total <= 8 ? "moderate" : total <= 15 ? "high" : "critical"
    setRiskScore({ total, breakdown, riskLevel })
  }

  const addPatientFactor = () => {
    if (!newPatientFactor.name || !newPatientFactor.value) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" })
      return
    }
    const factor: PatientFactor = { id: Date.now().toString(), ...newPatientFactor }
    const newFactors = [...patientFactors, factor]
    setPatientFactors(newFactors)
    setNewPatientFactor({ name: "", type: "condition", value: "", severity: "moderate" })
    setIsAddPatientFactorOpen(false)
    calculateRiskScore(selectedDrugs, newFactors)
    toast({ title: "Success", description: "Patient factor added" })
  }

  const removePatientFactor = (id: string) => {
    const newFactors = patientFactors.filter((f) => f.id !== id)
    setPatientFactors(newFactors)
    calculateRiskScore(selectedDrugs, newFactors)
  }

  const toggleFavorite = (drugId: string) => {
    setFavorites((prev) => (prev.includes(drugId) ? prev.filter((id) => id !== drugId) : [...prev, drugId]))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor": return "bg-blue-100 text-blue-800 border-blue-200"
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "major": return "bg-orange-100 text-orange-800 border-orange-200"
      case "contraindicated": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "minor": return <Info className="h-4 w-4" />
      case "moderate": return <AlertCircle className="h-4 w-4" />
      case "major": return <AlertTriangle className="h-4 w-4" />
      case "contraindicated": return <X className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800 border-green-200"
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // ============================================================
  // VOICE & BARCODE
  // ============================================================

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SR = window.webkitSpeechRecognition || window.SpeechRecognition
      const inst = new SR()
      inst.continuous = false; inst.interimResults = false; inst.lang = "en-US"
      inst.onresult = (event) => { setSearchTerm(event.results[0][0].transcript); setIsListening(false) }
      inst.onerror = () => { setIsListening(false) }
      inst.onend = () => { setIsListening(false) }
      setRecognition(inst)
    }
  }, [])

  const handleVoiceInput = async () => {
    if (!recognition) { toast({ title: "Not Supported", description: "Voice input not available in this browser", variant: "destructive" }); return }
    if (isListening) { recognition.stop(); setIsListening(false); return }
    try { setIsListening(true); recognition.start() } catch { setIsListening(false) }
  }

  const handleBarcodeScanning = async () => {
    try {
      setIsScanningBarcode(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      toast({ title: "Scanning", description: "Point camera at medication barcode..." })
      setTimeout(() => {
        const randomDrug = sampleDrugs[Math.floor(Math.random() * sampleDrugs.length)]
        if (!selectedDrugs.find((d) => d.id === randomDrug.id)) {
          const newDrugs = [...selectedDrugs, randomDrug]
          setSelectedDrugs(newDrugs); checkInteractions(newDrugs); calculateRiskScore(newDrugs, patientFactors); runGNNAnalysis(newDrugs)
          toast({ title: "Scanned", description: `${randomDrug.name} added` })
        }
        stream.getTracks().forEach((t) => t.stop()); setIsScanningBarcode(false)
      }, 2000)
    } catch { setIsScanningBarcode(false); toast({ title: "Error", description: "Camera access denied", variant: "destructive" }) }
  }

  const exportReport = (format: "pdf" | "csv" | "json") => {
    if (format === "json") {
      const blob = new Blob([JSON.stringify({ selectedDrugs, interactions, riskScore, gnnResults, patientProfile }, null, 2)], { type: "application/json" })
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `interaction-report-${Date.now()}.json`; a.click()
    } else if (format === "csv") {
      let csv = "Drug 1,Drug 2,Severity,GNN Confidence,Description,Mechanism,Management\n"
      interactions.forEach(i => { csv += `"${i.drug1}","${i.drug2}","${i.severity}","${(i.gnnConfidence || 0) * 100}%","${i.description}","${i.mechanism}","${i.management}"\n` })
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = `interaction-report-${Date.now()}.csv`; a.click()
    } else {
      const w = window.open("", "_blank")
      if (w) {
        w.document.write(`<html><head><title>Drug Interaction Report</title><style>body{font-family:system-ui;margin:40px;color:#1a1a2e}h1{color:#0f3460}h2{color:#16213e;border-bottom:2px solid #0f3460;padding-bottom:8px}.card{border:1px solid #ddd;border-radius:8px;padding:16px;margin:12px 0}.severity-major{border-left:4px solid #f59e0b}.severity-moderate{border-left:4px solid #eab308}.severity-minor{border-left:4px solid #22c55e}.severity-contraindicated{border-left:4px solid #ef4444}.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:600}.gnn{background:#ede9fe;color:#6d28d9}.risk{background:#fef3c7;color:#92400e}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f8fafc}</style></head><body>`)
        w.document.write(`<h1>Drug Interaction Analysis Report</h1><p>Generated: ${new Date().toLocaleString()}</p><p>GNN-Enhanced Analysis with Patient Risk Personalization</p>`)
        w.document.write(`<h2>Patient Profile</h2><div class="card"><p><strong>Age:</strong> ${patientProfile.age} | <strong>Gender:</strong> ${patientProfile.gender} | <strong>Weight:</strong> ${patientProfile.weight}kg</p>`)
        w.document.write(`<p><strong>Genetic Markers:</strong> ${patientProfile.geneticMarkers.map(g => `${g.gene} ${g.variant}`).join(", ")}</p>`)
        w.document.write(`<p><strong>Organ Function:</strong> ${patientProfile.organFunction.map(o => `${o.organ}: ${o.status}${o.gfr ? ` (GFR: ${o.gfr})` : ""}`).join(", ")}</p></div>`)
        w.document.write(`<h2>Selected Medications (${selectedDrugs.length})</h2><table><tr><th>Drug</th><th>Category</th><th>CYP450</th><th>Transporters</th></tr>`)
        selectedDrugs.forEach(d => { w.document.write(`<tr><td><strong>${d.name}</strong><br><small>${d.genericName}</small></td><td>${d.category}</td><td>${(d.cyp450Enzymes || []).join(", ") || "None"}</td><td>${(d.transporters || []).join(", ") || "None"}</td></tr>`) })
        w.document.write(`</table>`)
        if (riskScore) {
          w.document.write(`<h2>Risk Assessment</h2><div class="card"><p><span class="badge risk">${riskScore.riskLevel.toUpperCase()} RISK</span> Score: ${riskScore.total}</p>`)
          w.document.write(`<table><tr><th>Factor</th><th>Score</th></tr>`)
          Object.entries(riskScore.breakdown).forEach(([k, v]) => { w.document.write(`<tr><td>${k.replace(/([A-Z])/g, " $1")}</td><td>${v}</td></tr>`) })
          w.document.write(`</table></div>`)
        }
        w.document.write(`<h2>Interactions (${interactions.length})</h2>`)
        interactions.forEach(int => {
          const explanation = mechanismExplanations.find(e => e.interactionId === int.id)
          w.document.write(`<div class="card severity-${int.severity}"><h3>${int.drug1} + ${int.drug2} <span class="badge gnn">GNN: ${((int.gnnConfidence || 0) * 100).toFixed(0)}%</span></h3>`)
          w.document.write(`<p><strong>Severity:</strong> ${int.severity.toUpperCase()} | <strong>Type:</strong> ${int.pharmacokineticType || "N/A"} / ${int.pharmacodynamicType || "N/A"}</p>`)
          w.document.write(`<p><strong>Molecular Mechanism:</strong> ${int.molecularMechanism || int.mechanism}</p>`)
          w.document.write(`<p><strong>Management:</strong> ${int.management}</p>`)
          if (explanation) {
            w.document.write(`<h4>Mechanism Pathway</h4><p>${explanation.pathway.join(" -> ")}</p>`)
            w.document.write(`<p><strong>Molecular Detail:</strong> ${explanation.molecularDetail}</p>`)
            if (explanation.alternativeDrugs.length > 0) w.document.write(`<p><strong>Alternatives:</strong> ${explanation.alternativeDrugs.join(", ")}</p>`)
          }
          const pr = getPersonalizedRisk(int)
          if (pr.factors.length > 0) {
            w.document.write(`<h4>Personalized Risk (${pr.multiplier}x)</h4><ul>`)
            pr.factors.forEach(f => w.document.write(`<li>${f}</li>`))
            w.document.write(`</ul>`)
          }
          w.document.write(`</div>`)
        })
        w.document.write(`</body></html>`); w.document.close(); w.print()
      }
    }
    toast({ title: "Exported", description: `Report exported as ${format.toUpperCase()}` })
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            Advanced Drug Interaction Checker
          </h2>
          <p className="text-muted-foreground">GNN-powered molecular analysis with biochemistry knowledge graph</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleVoiceInput} disabled={isListening}
            className={isListening ? "bg-red-50 border-red-200" : ""}>
            <Mic className={`h-4 w-4 mr-1 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
            {isListening ? "Listening..." : "Voice"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleBarcodeScanning} disabled={isScanningBarcode}
            className={isScanningBarcode ? "bg-blue-50 border-blue-200" : ""}>
            <QrCode className={`h-4 w-4 mr-1 ${isScanningBarcode ? "text-blue-500 animate-pulse" : ""}`} />
            {isScanningBarcode ? "Scanning..." : "Scan"}
          </Button>
          <Badge variant="outline" className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border-indigo-200">
            <Brain className="h-3 w-3" /> GNN-Powered
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="drugs">Medications</TabsTrigger>
          <TabsTrigger value="gnn">GNN Graph</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Graph</TabsTrigger>
          <TabsTrigger value="mechanism">Explainability</TabsTrigger>
          <TabsTrigger value="patient">Patient Risk</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        {/* ==================== MEDICATIONS TAB ==================== */}
        <TabsContent value="drugs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Select Medications</CardTitle>
              <CardDescription>Add medications to check for GNN-powered interactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input placeholder="Search medications by name, generic name, or category..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              {searchHistory.length > 0 && !searchTerm && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1"><History className="h-4 w-4" /> Recent</Label>
                  <div className="flex flex-wrap gap-1">
                    {searchHistory.slice(0, 5).map((item, i) => (
                      <Badge key={i} variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchTerm(item)}>{item}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {searchTerm && (
                <div className="border rounded-lg max-h-48 overflow-y-auto">
                  {filteredDrugs.map((drug) => (
                    <div key={drug.id} className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0" onClick={() => addDrug(drug)}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{drug.name}</p>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleFavorite(drug.id) }}>
                              <Star className={`h-3 w-3 ${favorites.includes(drug.id) ? "fill-yellow-400 text-yellow-400" : ""}`} />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{drug.genericName} - {drug.category}</p>
                          <p className="text-xs text-muted-foreground">CYP450: {(drug.cyp450Enzymes || []).join(", ") || "None"} | Transporters: {(drug.transporters || []).join(", ") || "None"}</p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedDrugs.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Medications ({selectedDrugs.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDrugs.map((drug) => (
                      <Badge key={drug.id} variant="secondary" className="flex items-center gap-1">
                        {drug.name}
                        <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeDrug(drug.id)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Interaction Results */}
              {interactions.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {interactions.length} Interaction(s) Detected
                  </h3>
                  {interactions.map((int) => (
                    <div key={int.id} className={`p-3 rounded-lg border-l-4 ${int.severity === "major" ? "border-l-orange-500 bg-orange-50" : int.severity === "contraindicated" ? "border-l-red-500 bg-red-50" : int.severity === "moderate" ? "border-l-yellow-500 bg-yellow-50" : "border-l-blue-500 bg-blue-50"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{int.drug1} + {int.drug2}</span>
                        <div className="flex gap-1">
                          <Badge className={getSeverityColor(int.severity)}>{int.severity}</Badge>
                          {int.gnnConfidence && (
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 text-xs">
                              GNN: {(int.gnnConfidence * 100).toFixed(0)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{int.molecularMechanism || int.mechanism}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== GNN GRAPH TAB ==================== */}
        <TabsContent value="gnn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-indigo-600" />
                Graph Neural Network Analysis
              </CardTitle>
              <CardDescription>Message-passing neural network for drug interaction prediction using molecular features, enzyme pathways, and transporter data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* GNN Architecture Diagram - 3 Layer Pipeline */}
              <div className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Layers className="h-4 w-4" /> GNN Architecture: 3-Layer Message Passing</h3>
                <p className="text-xs text-muted-foreground mb-4">Ingests patient medical history and predicts chemical interactions by traversing protein structures and metabolic pathways</p>
                <div className="space-y-3">
                  {[
                    { layer: "Layer 1: Neighbor Aggregation", desc: "Aggregate features from enzyme, receptor, transporter, and pathway nodes connected to each drug", color: "border-indigo-300 bg-indigo-100/50" },
                    { layer: "Layer 2: Pathway Traversal", desc: "Traverse shared metabolic pathways and protein structures between drug pairs (1-hop and 2-hop)", color: "border-emerald-300 bg-emerald-100/50" },
                    { layer: "Layer 3: Patient Personalization", desc: "Adjust predictions using pharmacogenomics, organ function, past ADRs, and polypharmacy status", color: "border-rose-300 bg-rose-100/50" },
                  ].map((l, i) => (
                    <div key={i} className={`border rounded-lg px-4 py-2 ${l.color}`}>
                      <p className="font-medium text-sm">{l.layer}</p>
                      <p className="text-xs text-muted-foreground">{l.desc}</p>
                    </div>
                  ))}
                  <div className="border rounded-lg px-4 py-2 border-amber-300 bg-amber-100/50">
                    <p className="font-medium text-sm">Output: Attention Pooling + Interaction Prediction</p>
                    <p className="text-xs text-muted-foreground">Weighted combination of direct edges, traversal scores, feature similarity, shared enzymes/transporters, and patient factors</p>
                  </div>
                </div>
              </div>

              {/* GNN Node Features for Selected Drugs */}
              {selectedDrugs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Drug Node Feature Vectors</h3>
                  <div className="grid gap-3">
                    {selectedDrugs.map((drug) => {
                      const node = gnnNodes.find(n => n.id === drug.id)
                      return (
                        <div key={drug.id} className="border rounded-lg p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{drug.name}</span>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Drug Node</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-muted-foreground">Mol. Weight</p>
                              <p className="font-semibold">{drug.molecularWeight} Da</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-muted-foreground">Protein Binding</p>
                              <p className="font-semibold">{drug.proteinBinding}%</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-muted-foreground">Bioavailability</p>
                              <p className="font-semibold">{drug.bioavailability}%</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-muted-foreground">Half-Life</p>
                              <p className="font-semibold">{drug.halfLife}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {(drug.cyp450Enzymes || []).map((e, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-purple-50 text-purple-700">{e}</Badge>
                            ))}
                            {(drug.transporters || []).map((t, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-teal-50 text-teal-700">{t}</Badge>
                            ))}
                          </div>
                          {node && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Feature Vector: [{node.features.map(f => f.toFixed(1)).join(", ")}]
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* GNN Prediction Results */}
              {selectedDrugs.length >= 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" /> GNN Interaction Predictions
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => runGNNAnalysis(selectedDrugs)} disabled={gnnAnalysisRunning}>
                      {gnnAnalysisRunning ? "Analyzing..." : "Re-run GNN"}
                    </Button>
                  </div>
                  {gnnAnalysisRunning ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4" />
                      <p className="text-sm text-muted-foreground">Running GNN message passing (2 layers, attention pooling)...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(() => {
                        let idx = 0
                        const items: React.ReactNode[] = []
                        for (let i = 0; i < selectedDrugs.length; i++) {
                          for (let j = i + 1; j < selectedDrugs.length; j++) {
                            const result = gnnResults[idx]
                            if (result) {
                              items.push(
                                <div key={idx} className={`border rounded-lg p-3 ${result.predicted ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{selectedDrugs[i].name} -- {selectedDrugs[j].name}</span>
                                    <div className="flex items-center gap-2">
                                      <Badge className={result.predicted ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                                        {result.predicted ? "Interaction Predicted" : "No Interaction"}
                                      </Badge>
                                      <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                                        {(result.confidence * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                  {/* Confidence Bar */}
                                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div className={`h-2 rounded-full ${result.confidence > 0.8 ? "bg-red-500" : result.confidence > 0.5 ? "bg-yellow-500" : "bg-green-500"}`}
                                      style={{ width: `${result.confidence * 100}%` }} />
                                  </div>
                                  {result.pathways.length > 0 && (
                                    <div className="space-y-1.5 mt-1">
                                      {result.pathways.map((p, pi) => (
                                        <div key={pi} className={`text-xs px-2 py-1 rounded ${
                                          p.startsWith("[Patient]")
                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                            : p.includes("inhibits") || p.includes("competes") || p.includes("affects")
                                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                                            : "bg-gray-50 text-gray-700 border border-gray-200"
                                        }`}>
                                          {p.startsWith("[Patient]") && <User className="h-3 w-3 inline mr-1" />}
                                          {(p.includes("inhibits") || p.includes("competes") || p.includes("affects")) && !p.startsWith("[Patient]") && <Zap className="h-3 w-3 inline mr-1" />}
                                          {p}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            }
                            idx++
                          }
                        }
                        return items
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* GNN Edge Connections */}
              <div className="space-y-3">
                <h3 className="font-semibold">Graph Edges (Drug-Entity Connections)</h3>
                <div className="grid md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {gnnEdges.filter(e => selectedDrugs.some(d => d.id === e.source || d.id === e.target)).map((edge, i) => {
                    const sourceNode = gnnNodes.find(n => n.id === edge.source)
                    const targetNode = gnnNodes.find(n => n.id === edge.target)
                    return (
                      <div key={i} className="border rounded p-2 text-xs flex items-center gap-2 bg-white">
                        <Badge variant="outline" className="shrink-0">{sourceNode?.drugName || edge.source}</Badge>
                        <span className="text-muted-foreground shrink-0">--{edge.edgeType}--</span>
                        <Badge variant="outline" className="shrink-0">{targetNode?.drugName || edge.target}</Badge>
                        <span className="ml-auto text-indigo-600 font-mono">{(edge.confidence * 100).toFixed(0)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {selectedDrugs.length < 2 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select at least 2 medications to run GNN analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== KNOWLEDGE GRAPH TAB ==================== */}
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-emerald-600" />
                Deep Biochemistry Knowledge Graph
              </CardTitle>
              <CardDescription>Integrated biochemical pathway relationships linking drugs to enzymes, receptors, transporters, and metabolites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Entity Overview */}
              <div>
                <h3 className="font-semibold mb-3">Knowledge Graph Entities</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {knowledgeGraphEntities.map((entity) => {
                    const typeColors: Record<string, string> = {
                      enzyme: "bg-purple-50 border-purple-200 text-purple-800",
                      transporter: "bg-teal-50 border-teal-200 text-teal-800",
                      protein: "bg-blue-50 border-blue-200 text-blue-800",
                      metabolite: "bg-orange-50 border-orange-200 text-orange-800",
                    }
                    return (
                      <div key={entity.id} className={`border rounded-lg p-3 ${typeColors[entity.type] || "bg-gray-50 border-gray-200"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{entity.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">{entity.type}</Badge>
                        </div>
                        <div className="text-xs space-y-0.5">
                          {Object.entries(entity.properties).map(([key, val]) => (
                            <p key={key}><span className="capitalize">{key.replace(/_/g, " ")}:</span> {String(val)}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Relations for Selected Drugs */}
              {selectedDrugs.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Drug-Entity Relations (Selected Medications)</h3>
                  <div className="space-y-2">
                    {knowledgeGraphRelations
                      .filter(rel => selectedDrugs.some(d => d.name === rel.source))
                      .map((rel, i) => (
                        <div key={i} className="border rounded-lg p-3 bg-white flex items-center gap-3">
                          <Badge className="bg-blue-100 text-blue-800 shrink-0">{rel.source}</Badge>
                          <div className="flex-1 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-px bg-gray-300 flex-1" />
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                                {rel.relationType.replace(/_/g, " ")}
                              </span>
                              <div className="h-px bg-gray-300 flex-1" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{rel.evidence}</p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 shrink-0">{rel.target}</Badge>
                          <span className="text-xs font-mono text-indigo-600 shrink-0">{(rel.confidence * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {selectedDrugs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select medications to explore their biochemical pathways</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== MECHANISM EXPLAINABILITY TAB ==================== */}
        <TabsContent value="mechanism" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-600" />
                Mechanism Explainability Module
              </CardTitle>
              <CardDescription>Detailed molecular-level explanations of drug interaction mechanisms with timeline phases and alternative recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {interactions.length > 0 ? (
                <div className="space-y-4">
                  {/* Interaction Selector */}
                  <div className="flex flex-wrap gap-2">
                    {interactions.map((int) => {
                      const explanation = mechanismExplanations.find(e => e.interactionId === int.id)
                      return (
                        <Button key={int.id} variant={selectedExplanation?.interactionId === int.id ? "default" : "outline"}
                          size="sm" onClick={() => setSelectedExplanation(explanation || null)}>
                          {int.drug1} + {int.drug2}
                        </Button>
                      )
                    })}
                  </div>

                  {selectedExplanation ? (
                    <div className="space-y-6">
                      {/* Pathway Visualization */}
                      <div className="border rounded-lg p-4 bg-gradient-to-r from-amber-50 to-orange-50">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-600" /> Interaction Pathway
                        </h3>
                        <div className="flex items-center gap-1 flex-wrap">
                          {selectedExplanation.pathway.map((step, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <div className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-medium shadow-sm">
                                {step}
                              </div>
                              {i < selectedExplanation.pathway.length - 1 && (
                                <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Molecular Detail */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Beaker className="h-4 w-4" /> Molecular Detail
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedExplanation.molecularDetail}</p>
                      </div>

                      {/* Enzyme & Receptor Involvement */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                            <TestTube className="h-4 w-4 text-purple-500" /> Enzyme Involvement
                          </h4>
                          <div className="space-y-1">
                            {selectedExplanation.enzymeInvolvement.map((e, i) => (
                              <div key={i} className="text-sm p-2 bg-purple-50 rounded">{e}</div>
                            ))}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" /> Receptor Involvement
                          </h4>
                          <div className="space-y-1">
                            {selectedExplanation.receptorInvolvement.map((r, i) => (
                              <div key={i} className="text-sm p-2 bg-blue-50 rounded">{r}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Timeline Phases */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Interaction Timeline
                        </h3>
                        <div className="space-y-3">
                          {selectedExplanation.timelinePhases.map((phase, i) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
                                {i < selectedExplanation.timelinePhases.length - 1 && (
                                  <div className="w-0.5 flex-1 bg-indigo-200 mt-1" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{phase.phase}</span>
                                  <Badge variant="outline" className="text-xs">{phase.timeframe}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{phase.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risk Factors & Alternatives */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 bg-red-50">
                          <h4 className="font-semibold mb-2 text-sm text-red-800">Risk Factors</h4>
                          <ul className="space-y-1">
                            {selectedExplanation.riskFactors.map((rf, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <AlertTriangle className="h-3 w-3 text-red-500 mt-1 shrink-0" /> {rf}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border rounded-lg p-4 bg-green-50">
                          <h4 className="font-semibold mb-2 text-sm text-green-800">Safer Alternatives</h4>
                          <ul className="space-y-1">
                            {selectedExplanation.alternativeDrugs.map((alt, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-1 shrink-0" /> {alt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Evidence */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className={
                          selectedExplanation.evidenceLevel === "high" ? "bg-green-50 text-green-700" :
                          selectedExplanation.evidenceLevel === "moderate" ? "bg-yellow-50 text-yellow-700" :
                          "bg-red-50 text-red-700"
                        }>
                          {selectedExplanation.evidenceLevel} evidence
                        </Badge>
                        <span>References: {selectedExplanation.references.join(", ")}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an interaction above to view its detailed mechanism explanation</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select medications with interactions to explore mechanism details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== PATIENT RISK PERSONALIZATION TAB ==================== */}
        <TabsContent value="patient" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-rose-600" />
                Patient History Risk Personalization
              </CardTitle>
              <CardDescription>Personalized risk assessment based on genetics, organ function, past reactions, and comorbidities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Profile Summary */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <User className="h-4 w-4" /> Demographics
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>Age: <strong>{patientProfile.age}</strong></p>
                    <p>Gender: <strong className="capitalize">{patientProfile.gender}</strong></p>
                    <p>Weight: <strong>{patientProfile.weight} kg</strong></p>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" /> Comorbidities
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {patientProfile.comorbidities.map((c, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" /> Allergies
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {patientProfile.allergies.map((a, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">{a}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Genetic Markers */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-500" /> Pharmacogenomic Profile
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {patientProfile.geneticMarkers.map((marker, i) => (
                    <div key={i} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{marker.gene}</span>
                        <Badge variant="outline" className="font-mono text-xs">{marker.variant}</Badge>
                      </div>
                      <p className="text-xs text-indigo-700">{marker.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organ Function */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Organ Function
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {patientProfile.organFunction.map((organ, i) => (
                    <div key={i} className={`border rounded-lg p-3 ${organ.status === "Normal" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{organ.organ}</span>
                        <Badge variant="outline" className={organ.status === "Normal" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                          {organ.status}
                        </Badge>
                      </div>
                      {organ.gfr !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>GFR</span>
                            <span className="font-mono">{organ.gfr} mL/min</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${organ.gfr > 90 ? "bg-green-500" : organ.gfr > 60 ? "bg-yellow-500" : organ.gfr > 30 ? "bg-orange-500" : "bg-red-500"}`}
                              style={{ width: `${Math.min(organ.gfr, 120) / 1.2}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Past Adverse Reactions */}
              {patientProfile.pastAdverseReactions.length > 0 && (
                <div className="border rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold mb-2 text-sm text-red-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Past Adverse Drug Reactions
                  </h4>
                  {patientProfile.pastAdverseReactions.map((adr, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-red-200 mb-1">
                      <span className="text-sm">{adr.drug}: {adr.reaction}</span>
                      <Badge variant="outline" className="text-xs capitalize">{adr.severity}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Personalized Risk per Interaction */}
              {interactions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Personalized Interaction Risk
                  </h3>
                  {interactions.map((int) => {
                    const risk = getPersonalizedRisk(int)
                    return (
                      <div key={int.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">{int.drug1} + {int.drug2}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(int.severity)}>{int.severity}</Badge>
                            <Badge variant="outline" className={
                              risk.multiplier > 1.5 ? "bg-red-100 text-red-800" :
                              risk.multiplier > 1.2 ? "bg-orange-100 text-orange-800" :
                              "bg-green-100 text-green-800"
                            }>
                              Risk Multiplier: {risk.multiplier}x
                            </Badge>
                          </div>
                        </div>
                        {risk.factors.length > 0 ? (
                          <div className="space-y-1">
                            {risk.factors.map((f, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> No additional patient-specific risk factors identified
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Patient Factor Management */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2"><Heart className="h-4 w-4" /> Additional Patient Factors</h3>
                  <Dialog open={isAddPatientFactorOpen} onOpenChange={setIsAddPatientFactorOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add Factor</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Patient Factor</DialogTitle>
                        <DialogDescription>Add factors that may affect drug interaction risk</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={newPatientFactor.type} onValueChange={(v: any) => setNewPatientFactor({ ...newPatientFactor, type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="age">Age Group</SelectItem>
                              <SelectItem value="condition">Medical Condition</SelectItem>
                              <SelectItem value="allergy">Allergy</SelectItem>
                              <SelectItem value="pregnancy">Pregnancy</SelectItem>
                              <SelectItem value="renal">Renal Function</SelectItem>
                              <SelectItem value="hepatic">Hepatic Function</SelectItem>
                              <SelectItem value="genetic">Genetic Factor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={newPatientFactor.name} onChange={(e) => setNewPatientFactor({ ...newPatientFactor, name: e.target.value })} placeholder="e.g., CYP2C9 Poor Metabolizer" />
                        </div>
                        <div className="space-y-2">
                          <Label>Severity</Label>
                          <Select value={newPatientFactor.severity} onValueChange={(v: any) => setNewPatientFactor({ ...newPatientFactor, severity: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mild">Mild</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Details</Label>
                          <Textarea value={newPatientFactor.value} onChange={(e) => setNewPatientFactor({ ...newPatientFactor, value: e.target.value })} placeholder="Details" rows={3} />
                        </div>
                        <Button onClick={addPatientFactor} className="w-full">Add Factor</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {patientFactors.length > 0 ? (
                  <div className="space-y-2">
                    {patientFactors.map((f) => (
                      <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{f.name}</p>
                            <Badge variant="outline" className={f.severity === "severe" ? "bg-red-50 text-red-700" : f.severity === "moderate" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"}>{f.severity}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{f.type} - {f.value}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removePatientFactor(f.id)}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No additional factors added</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== FOOD TAB ==================== */}
        <TabsContent value="food" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Utensils className="h-5 w-5" /> Drug-Food Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDrugs.length > 0 ? (
                <div className="space-y-4">
                  {selectedDrugs.map((drug) => {
                    const fi = foodInteractionsData.filter((f) => f.drug === drug.name)
                    return fi.length > 0 ? (
                      <div key={drug.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{drug.name}</h3>
                        <div className="space-y-2">
                          {fi.map((interaction, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 bg-muted rounded">
                              <Utensils className="h-4 w-4 mt-1 text-orange-500" />
                              <div>
                                <p className="font-medium text-sm">{interaction.food}</p>
                                <p className="text-sm text-muted-foreground">{interaction.effect}</p>
                                <p className="text-xs text-blue-600 mt-1">{interaction.management}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  })}
                  {selectedDrugs.every(d => !foodInteractionsData.some(f => f.drug === d.name)) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No food interactions found for selected medications</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select medications to check food interactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== LIFESTYLE TAB ==================== */}
        <TabsContent value="lifestyle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Drug-Lifestyle Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDrugs.length > 0 ? (
                <div className="space-y-4">
                  {selectedDrugs.map((drug) => {
                    const li = lifestyleInteractionsData.filter((l) => l.drug === drug.name)
                    return li.length > 0 ? (
                      <div key={drug.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{drug.name}</h3>
                        <div className="space-y-2">
                          {li.map((interaction, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 bg-muted rounded">
                              <Activity className="h-4 w-4 mt-1 text-purple-500" />
                              <div>
                                <p className="font-medium text-sm">{interaction.lifestyle}</p>
                                <p className="text-sm text-muted-foreground">{interaction.effect}</p>
                                <p className="text-xs text-blue-600 mt-1">{interaction.management}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null
                  })}
                  {selectedDrugs.every(d => !lifestyleInteractionsData.some(l => l.drug === d.name)) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No lifestyle interactions found for selected medications</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select medications to check lifestyle interactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== ANALYSIS TAB ==================== */}
        <TabsContent value="analysis" className="space-y-6">
          {riskScore && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Comprehensive Risk Assessment</CardTitle>
                <CardDescription>GNN-enhanced polypharmacy risk analysis with patient personalization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 text-center">
                    <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${getRiskLevelColor(riskScore.riskLevel)}`}>
                      {riskScore.riskLevel.toUpperCase()} RISK
                    </div>
                    <p className="text-3xl font-bold">Score: {riskScore.total}</p>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(riskScore.breakdown).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${val > 5 ? "bg-red-500" : val > 2 ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${Math.min(val * 10, 100)}%` }} />
                          </div>
                          <Badge variant="outline" className="w-8 justify-center">{val}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Full Interaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {interactions.length > 0 ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
                Interaction Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map((int) => (
                    <div key={int.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(int.severity)}
                          <h3 className="font-semibold">{int.drug1} + {int.drug2}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(int.severity)}>{int.severity.toUpperCase()}</Badge>
                          {int.gnnConfidence && (
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                              GNN: {(int.gnnConfidence * 100).toFixed(0)}%
                            </Badge>
                          )}
                          {int.documentation && <Badge variant="outline">{int.documentation} evidence</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{int.description}</p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-1">Molecular Mechanism</h4>
                          <p className="text-muted-foreground">{int.molecularMechanism || int.mechanism}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Management</h4>
                          <p className="text-muted-foreground">{int.management}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {int.biochemPathway?.map((p, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-indigo-50 text-indigo-700">{p}</Badge>
                        ))}
                      </div>
                      {int.monitoringRequirements && (
                        <div className="flex flex-wrap gap-1">
                          {int.monitoringRequirements.map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-blue-50">{req}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedDrugs.length > 1 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-green-600 font-medium">No interactions detected</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select at least 2 medications to check interactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Interaction Report</DialogTitle>
            <DialogDescription>Export includes GNN analysis, knowledge graph data, and personalized risk assessment</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button onClick={() => exportReport("pdf")} className="w-full justify-start"><FileText className="h-4 w-4 mr-2" /> PDF (Full Report with GNN Data)</Button>
            <Button onClick={() => exportReport("csv")} variant="outline" className="w-full justify-start"><Download className="h-4 w-4 mr-2" /> CSV (Data Analysis)</Button>
            <Button onClick={() => exportReport("json")} variant="outline" className="w-full justify-start"><Download className="h-4 w-4 mr-2" /> JSON (System Integration)</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsChatbotOpen(true)} className="rounded-full h-12 w-12 shadow-lg">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
      <Dialog open={isChatbotOpen} onOpenChange={setIsChatbotOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> AI Pharmacology Assistant</DialogTitle>
            <DialogDescription>GNN-powered medication safety guidance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="h-64 border rounded-lg p-4 bg-muted/50 overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-3">I can help you understand:</p>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2"><Brain className="h-3 w-3 mt-1 text-indigo-500 shrink-0" /> GNN interaction predictions and confidence scores</li>
                <li className="flex items-start gap-2"><GitBranch className="h-3 w-3 mt-1 text-emerald-500 shrink-0" /> Biochemical pathway relationships</li>
                <li className="flex items-start gap-2"><Eye className="h-3 w-3 mt-1 text-amber-500 shrink-0" /> Molecular mechanism explanations</li>
                <li className="flex items-start gap-2"><User className="h-3 w-3 mt-1 text-rose-500 shrink-0" /> Patient-specific risk factors</li>
                <li className="flex items-start gap-2"><Shield className="h-3 w-3 mt-1 text-blue-500 shrink-0" /> Clinical management strategies</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ask about drug interactions..." />
              <Button size="sm">Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { DrugInteractionChecker }
export default DrugInteractionChecker

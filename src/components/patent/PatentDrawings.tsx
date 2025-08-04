import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PatentDrawings: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Patent Technical Drawings</h1>
        <p className="text-lg text-muted-foreground">
          Multi-Modal Continuous Biometric Authentication System with Legal-Grade Audit Trails and Compliance Automation
        </p>
      </div>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="architecture">System Architecture</TabsTrigger>
          <TabsTrigger value="multimodal">Multi-Modal Engine</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Engine</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise Platform</TabsTrigger>
          <TabsTrigger value="audit">Legal Audit System</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="quantum">Quantum Security</TabsTrigger>
          <TabsTrigger value="more">More Drawings</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture">
          <Card>
            <CardHeader>
              <CardTitle>Figure 1: Enhanced Multi-Modal System Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 700" className="w-full border rounded">
                {/* Title */}
                <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">MULTI-MODAL BIOMETRIC AUTHENTICATION ECOSYSTEM</text>
                
                {/* Multi-Modal Input Layer */}
                <rect x="50" y="50" width="800" height="100" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">MULTI-MODAL INPUT LAYER (100-199)</text>
                
                <rect x="70" y="90" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="130" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Keystroke Dynamics (110)</text>
                
                <rect x="210" y="90" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="270" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Mouse Patterns (120)</text>
                
                <rect x="350" y="90" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="410" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Touch Dynamics (130)</text>
                
                <rect x="490" y="90" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="550" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Device Fingerprint (140)</text>
                
                <rect x="630" y="90" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="690" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Behavioral Context (150)</text>
                
                <rect x="770" y="90" width="60" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="800" y="113" textAnchor="middle" className="fill-blue-900 text-sm">PWA (160)</text>

                {/* Enterprise Processing Layer */}
                <rect x="50" y="180" width="800" height="120" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="450" y="205" textAnchor="middle" className="fill-purple-800 font-semibold">ENTERPRISE PROCESSING LAYER (200-299)</text>
                
                <rect x="70" y="230" width="140" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="140" y="258" textAnchor="middle" className="fill-purple-900 text-sm">Multi-Modal Fusion (210)</text>
                
                <rect x="230" y="230" width="140" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="300" y="258" textAnchor="middle" className="fill-purple-900 text-sm">Risk Assessment (220)</text>
                
                <rect x="390" y="230" width="140" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="460" y="258" textAnchor="middle" className="fill-purple-900 text-sm">API Gateway (230)</text>
                
                <rect x="550" y="230" width="140" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="620" y="258" textAnchor="middle" className="fill-purple-900 text-sm">White-Label Engine (240)</text>
                
                <rect x="710" y="230" width="120" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="770" y="258" textAnchor="middle" className="fill-purple-900 text-sm">Webhooks (250)</text>

                {/* Compliance & Security Layer */}
                <rect x="50" y="330" width="800" height="120" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="450" y="355" textAnchor="middle" className="fill-green-800 font-semibold">COMPLIANCE & SECURITY LAYER (300-399)</text>
                
                <rect x="70" y="380" width="110" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="125" y="408" textAnchor="middle" className="fill-green-900 text-sm">HIPAA Engine (310)</text>
                
                <rect x="200" y="380" width="110" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="255" y="408" textAnchor="middle" className="fill-green-900 text-sm">PCI-DSS Engine (320)</text>
                
                <rect x="330" y="380" width="110" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="385" y="408" textAnchor="middle" className="fill-green-900 text-sm">NIST Framework (330)</text>
                
                <rect x="460" y="380" width="110" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="515" y="408" textAnchor="middle" className="fill-green-900 text-sm">GDPR Manager (340)</text>
                
                <rect x="590" y="380" width="110" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="645" y="408" textAnchor="middle" className="fill-green-900 text-sm">Quantum Crypto (350)</text>
                
                <rect x="720" y="380" width="110" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="775" y="408" textAnchor="middle" className="fill-green-900 text-sm">Legal Audit (360)</text>

                {/* Analytics & Learning Layer */}
                <rect x="50" y="480" width="800" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="450" y="505" textAnchor="middle" className="fill-orange-800 font-semibold">ANALYTICS & LEARNING LAYER (400-499)</text>
                
                <rect x="70" y="520" width="140" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="140" y="543" textAnchor="middle" className="fill-orange-900 text-sm">Continuous Learning (410)</text>
                
                <rect x="230" y="520" width="140" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="300" y="543" textAnchor="middle" className="fill-orange-900 text-sm">Predictive Analytics (420)</text>
                
                <rect x="390" y="520" width="140" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="460" y="543" textAnchor="middle" className="fill-orange-900 text-sm">Behavioral Analysis (430)</text>
                
                <rect x="550" y="520" width="140" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="620" y="543" textAnchor="middle" className="fill-orange-900 text-sm">Industry Analytics (440)</text>
                
                <rect x="710" y="520" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="770" y="543" textAnchor="middle" className="fill-orange-900 text-sm">A/B Testing (450)</text>

                {/* Secure Storage Layer */}
                <rect x="50" y="610" width="800" height="60" fill="#ffebee" stroke="#c62828" strokeWidth="2"/>
                <text x="450" y="635" textAnchor="middle" className="fill-red-800 font-semibold">SECURE STORAGE LAYER (500-599)</text>
                
                <rect x="100" y="650" width="130" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="165" y="663" textAnchor="middle" className="fill-red-900 text-xs">Encrypted Biometric DB (510)</text>
                
                <rect x="250" y="650" width="130" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="315" y="663" textAnchor="middle" className="fill-red-900 text-xs">Immutable Audit Logs (520)</text>
                
                <rect x="400" y="650" width="130" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="465" y="663" textAnchor="middle" className="fill-red-900 text-xs">Compliance Reports (530)</text>
                
                <rect x="550" y="650" width="130" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="615" y="663" textAnchor="middle" className="fill-red-900 text-xs">Session Management (540)</text>
                
                <rect x="700" y="650" width="130" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="765" y="663" textAnchor="middle" className="fill-red-900 text-xs">Hash Chain Store (550)</text>

                {/* Data Flow Arrows */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
                  </marker>
                </defs>
                
                {/* Vertical data flow */}
                <line x1="450" y1="150" x2="450" y2="180" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="300" x2="450" y2="330" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="450" x2="450" y2="480" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="580" x2="450" y2="610" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Novel Architecture Components:</strong></p>
                <p>(100-160) Multi-Modal Inputs: Keystroke + Mouse + Touch + Device + Context + PWA</p>
                <p>(200-250) Enterprise Platform: Fusion algorithms, API gateway, white-label engine</p>
                <p>(300-360) Compliance Engines: Industry-specific automated compliance (HIPAA, PCI, NIST, GDPR)</p>
                <p>(400-450) Advanced Analytics: ML learning, predictive analysis, behavioral insights</p>
                <p>(500-550) Secure Storage: Quantum-resistant encryption, immutable audit trails</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multimodal">
          <Card>
            <CardHeader>
              <CardTitle>Figure 2: Multi-Modal Biometric Fusion Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 650" className="w-full border rounded">
                {/* Title */}
                <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">MULTI-MODAL BIOMETRIC FUSION ARCHITECTURE</text>
                
                {/* Input Modalities */}
                <rect x="50" y="50" width="800" height="120" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">BIOMETRIC INPUT MODALITIES (600-699)</text>
                
                {/* Keystroke Dynamics */}
                <rect x="70" y="100" width="140" height="60" fill="#bbdefb" stroke="#1565c0"/>
                <text x="140" y="120" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">Keystroke Dynamics</text>
                <text x="140" y="135" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">(610)</text>
                <text x="140" y="150" textAnchor="middle" className="fill-blue-900 text-xs">• Dwell time patterns</text>
                
                {/* Mouse Dynamics */}
                <rect x="230" y="100" width="140" height="60" fill="#bbdefb" stroke="#1565c0"/>
                <text x="300" y="120" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">Mouse Dynamics</text>
                <text x="300" y="135" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">(620)</text>
                <text x="300" y="150" textAnchor="middle" className="fill-blue-900 text-xs">• Velocity profiles</text>
                
                {/* Touch Dynamics */}
                <rect x="390" y="100" width="140" height="60" fill="#bbdefb" stroke="#1565c0"/>
                <text x="460" y="120" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">Touch Dynamics</text>
                <text x="460" y="135" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">(630)</text>
                <text x="460" y="150" textAnchor="middle" className="fill-blue-900 text-xs">• Pressure patterns</text>
                
                {/* Device Fingerprinting */}
                <rect x="550" y="100" width="140" height="60" fill="#bbdefb" stroke="#1565c0"/>
                <text x="620" y="120" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">Device Fingerprint</text>
                <text x="620" y="135" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">(640)</text>
                <text x="620" y="150" textAnchor="middle" className="fill-blue-900 text-xs">• Hardware signatures</text>
                
                {/* Context Analysis */}
                <rect x="710" y="100" width="120" height="60" fill="#bbdefb" stroke="#1565c0"/>
                <text x="770" y="120" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">Context Analysis</text>
                <text x="770" y="135" textAnchor="middle" className="fill-blue-900 text-sm font-semibold">(650)</text>
                <text x="770" y="150" textAnchor="middle" className="fill-blue-900 text-xs">• Environmental data</text>

                {/* Feature Extraction Layer */}
                <rect x="50" y="200" width="800" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="450" y="225" textAnchor="middle" className="fill-purple-800 font-semibold">FEATURE EXTRACTION & NORMALIZATION (700-799)</text>
                
                <rect x="100" y="250" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="160" y="273" textAnchor="middle" className="fill-purple-900 text-sm">Statistical Features (710)</text>
                
                <rect x="240" y="250" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="300" y="273" textAnchor="middle" className="fill-purple-900 text-sm">Temporal Features (720)</text>
                
                <rect x="380" y="250" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="440" y="273" textAnchor="middle" className="fill-purple-900 text-sm">Spatial Features (730)</text>
                
                <rect x="520" y="250" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="580" y="273" textAnchor="middle" className="fill-purple-900 text-sm">Frequency Features (740)</text>
                
                <rect x="660" y="250" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="720" y="273" textAnchor="middle" className="fill-purple-900 text-sm">Normalization (750)</text>

                {/* Fusion Engine */}
                <rect x="50" y="330" width="800" height="120" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="450" y="355" textAnchor="middle" className="fill-green-800 font-semibold">FUSION ENGINE & CONFIDENCE WEIGHTING (800-899)</text>
                
                <rect x="100" y="380" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="170" y="408" textAnchor="middle" className="fill-green-900 text-sm">Ensemble Methods (810)</text>
                
                <rect x="260" y="380" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="330" y="408" textAnchor="middle" className="fill-green-900 text-sm">Weight Optimization (820)</text>
                
                <rect x="420" y="380" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="490" y="408" textAnchor="middle" className="fill-green-900 text-sm">Confidence Scoring (830)</text>
                
                <rect x="580" y="380" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="650" y="408" textAnchor="middle" className="fill-green-900 text-sm">Decision Fusion (840)</text>

                {/* Output Layer */}
                <rect x="50" y="480" width="800" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="450" y="505" textAnchor="middle" className="fill-orange-800 font-semibold">AUTHENTICATION OUTPUT & LEARNING (900-999)</text>
                
                <rect x="100" y="530" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="160" y="553" textAnchor="middle" className="fill-orange-900 text-sm">Final Score (910)</text>
                
                <rect x="240" y="530" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="300" y="553" textAnchor="middle" className="fill-orange-900 text-sm">Risk Level (920)</text>
                
                <rect x="380" y="530" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="440" y="553" textAnchor="middle" className="fill-orange-900 text-sm">Auth Decision (930)</text>
                
                <rect x="520" y="530" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="580" y="553" textAnchor="middle" className="fill-orange-900 text-sm">Profile Update (940)</text>
                
                <rect x="660" y="530" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="720" y="553" textAnchor="middle" className="fill-orange-900 text-sm">Audit Log (950)</text>

                {/* Technical Specifications */}
                <rect x="50" y="600" width="800" height="40" fill="#f5f5f5" stroke="#757575"/>
                <text x="450" y="615" textAnchor="middle" className="font-semibold">FUSION ALGORITHM SPECIFICATIONS</text>
                <text x="100" y="630" className="text-xs">Weighted Average: W₁×K + W₂×M + W₃×T + W₄×D + W₅×C</text>
                <text x="500" y="630" className="text-xs">Confidence = Σ(wi × ci × ri) where wi=weight, ci=confidence, ri=reliability</text>

                {/* Data Flow Arrows */}
                <line x1="450" y1="170" x2="450" y2="200" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="300" x2="450" y2="330" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="450" x2="450" y2="480" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Multi-Modal Fusion Components:</strong></p>
                <p>(600-650) Input Modalities: 5 distinct biometric input types with unique characteristics</p>
                <p>(700-750) Feature Extraction: Advanced signal processing and normalization algorithms</p>
                <p>(800-840) Fusion Engine: Ensemble methods with dynamic weight optimization</p>
                <p>(900-950) Output Processing: Authentication decisions with continuous learning integration</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Figure 3: Industry-Specific Compliance Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 700" className="w-full border rounded">
                {/* Title */}
                <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">AUTOMATED COMPLIANCE ENGINE ARCHITECTURE</text>
                
                {/* Industry Input Layer */}
                <rect x="50" y="50" width="800" height="80" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">INDUSTRY CONFIGURATION (1000-1099)</text>
                
                <rect x="80" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="140" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Healthcare (1010)</text>
                
                <rect x="220" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="280" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Financial (1020)</text>
                
                <rect x="360" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="420" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Government (1030)</text>
                
                <rect x="500" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="560" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Education (1040)</text>
                
                <rect x="640" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="700" y="113" textAnchor="middle" className="fill-blue-900 text-sm">European (1050)</text>

                {/* Regulation Engine Layer */}
                <rect x="50" y="160" width="800" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="450" y="185" textAnchor="middle" className="fill-purple-800 font-semibold">REGULATION PROCESSING ENGINES (1100-1199)</text>
                
                <rect x="80" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="140" y="233" textAnchor="middle" className="fill-purple-900 text-sm">HIPAA Engine (1110)</text>
                
                <rect x="220" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="280" y="233" textAnchor="middle" className="fill-purple-900 text-sm">PCI-DSS Engine (1120)</text>
                
                <rect x="360" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="420" y="233" textAnchor="middle" className="fill-purple-900 text-sm">NIST Framework (1130)</text>
                
                <rect x="500" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="560" y="233" textAnchor="middle" className="fill-purple-900 text-sm">FERPA Engine (1140)</text>
                
                <rect x="640" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="700" y="233" textAnchor="middle" className="fill-purple-900 text-sm">GDPR Engine (1150)</text>

                {/* Rule Processing Layer */}
                <rect x="50" y="290" width="800" height="120" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="450" y="315" textAnchor="middle" className="fill-green-800 font-semibold">COMPLIANCE RULE PROCESSING (1200-1299)</text>
                
                <rect x="80" y="340" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="150" y="368" textAnchor="middle" className="fill-green-900 text-sm">Access Control Rules (1210)</text>
                
                <rect x="240" y="340" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="310" y="368" textAnchor="middle" className="fill-green-900 text-sm">Data Retention Rules (1220)</text>
                
                <rect x="400" y="340" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="470" y="368" textAnchor="middle" className="fill-green-900 text-sm">Audit Requirements (1230)</text>
                
                <rect x="560" y="340" width="140" height="50" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="630" y="368" textAnchor="middle" className="fill-green-900 text-sm">Privacy Controls (1240)</text>

                {/* Legal Audit Layer */}
                <rect x="50" y="440" width="800" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="450" y="465" textAnchor="middle" className="fill-orange-800 font-semibold">LEGAL-GRADE AUDIT SYSTEM (1300-1399)</text>
                
                <rect x="100" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="160" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Hash Chaining (1310)</text>
                
                <rect x="240" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="300" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Timestamping (1320)</text>
                
                <rect x="380" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="440" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Immutable Logs (1330)</text>
                
                <rect x="520" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="580" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Legal Reports (1340)</text>
                
                <rect x="660" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="720" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Chain of Custody (1350)</text>

                {/* Output Reports Layer */}
                <rect x="50" y="570" width="800" height="100" fill="#ffebee" stroke="#c62828" strokeWidth="2"/>
                <text x="450" y="595" textAnchor="middle" className="fill-red-800 font-semibold">AUTOMATED COMPLIANCE REPORTING (1400-1499)</text>
                
                <rect x="100" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="160" y="643" textAnchor="middle" className="fill-red-900 text-sm">Daily Reports (1410)</text>
                
                <rect x="240" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="300" y="643" textAnchor="middle" className="fill-red-900 text-sm">Violation Alerts (1420)</text>
                
                <rect x="380" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="440" y="643" textAnchor="middle" className="fill-red-900 text-sm">Audit Trails (1430)</text>
                
                <rect x="520" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="580" y="643" textAnchor="middle" className="fill-red-900 text-sm">Risk Assessment (1440)</text>
                
                <rect x="660" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="720" y="643" textAnchor="middle" className="fill-red-900 text-sm">Executive Dashboard (1450)</text>

                {/* Data Flow Arrows */}
                <line x1="450" y1="130" x2="450" y2="160" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="260" x2="450" y2="290" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="410" x2="450" y2="440" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="540" x2="450" y2="570" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Compliance Engine Components:</strong></p>
                <p>(1000-1050) Industry Configuration: Healthcare, Financial, Government, Education, European</p>
                <p>(1100-1150) Regulation Engines: HIPAA, PCI-DSS, NIST, FERPA, GDPR automated processing</p>
                <p>(1200-1240) Rule Processing: Access control, data retention, audit, privacy enforcement</p>
                <p>(1300-1350) Legal Audit: Cryptographic hash chaining, timestamping, immutable storage</p>
                <p>(1400-1450) Automated Reporting: Real-time compliance monitoring and executive dashboards</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterprise">
          <Card>
            <CardHeader>
              <CardTitle>Figure 4: Enterprise Integration Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 700" className="w-full border rounded">
                {/* Title */}
                <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">ENTERPRISE INTEGRATION & DEPLOYMENT ARCHITECTURE</text>
                
                {/* API Gateway Layer */}
                <rect x="50" y="50" width="800" height="100" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">API GATEWAY & MANAGEMENT (1500-1599)</text>
                
                <rect x="80" y="100" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="140" y="123" textAnchor="middle" className="fill-blue-900 text-sm">Rate Limiting (1510)</text>
                
                <rect x="220" y="100" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="280" y="123" textAnchor="middle" className="fill-blue-900 text-sm">Authentication (1520)</text>
                
                <rect x="360" y="100" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="420" y="123" textAnchor="middle" className="fill-blue-900 text-sm">Load Balancing (1530)</text>
                
                <rect x="500" y="100" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="560" y="123" textAnchor="middle" className="fill-blue-900 text-sm">API Versioning (1540)</text>
                
                <rect x="640" y="100" width="120" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="700" y="123" textAnchor="middle" className="fill-blue-900 text-sm">Documentation (1550)</text>

                {/* White-Label Customization */}
                <rect x="50" y="180" width="800" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="450" y="205" textAnchor="middle" className="fill-purple-800 font-semibold">WHITE-LABEL CUSTOMIZATION ENGINE (1600-1699)</text>
                
                <rect x="80" y="230" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="140" y="253" textAnchor="middle" className="fill-purple-900 text-sm">Brand Manager (1610)</text>
                
                <rect x="220" y="230" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="280" y="253" textAnchor="middle" className="fill-purple-900 text-sm">Theme Engine (1620)</text>
                
                <rect x="360" y="230" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="420" y="253" textAnchor="middle" className="fill-purple-900 text-sm">Domain Config (1630)</text>
                
                <rect x="500" y="230" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="560" y="253" textAnchor="middle" className="fill-purple-900 text-sm">CSS Editor (1640)</text>
                
                <rect x="640" y="230" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="700" y="253" textAnchor="middle" className="fill-purple-900 text-sm">Live Preview (1650)</text>

                {/* SDK Generation */}
                <rect x="50" y="310" width="800" height="100" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="450" y="335" textAnchor="middle" className="fill-green-800 font-semibold">SDK GENERATION & INTEGRATION (1700-1799)</text>
                
                <rect x="80" y="360" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="140" y="383" textAnchor="middle" className="fill-green-900 text-sm">JavaScript SDK (1710)</text>
                
                <rect x="220" y="360" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="280" y="383" textAnchor="middle" className="fill-green-900 text-sm">Python SDK (1720)</text>
                
                <rect x="360" y="360" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="420" y="383" textAnchor="middle" className="fill-green-900 text-sm">Java SDK (1730)</text>
                
                <rect x="500" y="360" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="560" y="383" textAnchor="middle" className="fill-green-900 text-sm">C# SDK (1740)</text>
                
                <rect x="640" y="360" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="700" y="383" textAnchor="middle" className="fill-green-900 text-sm">PHP SDK (1750)</text>

                {/* Webhook Management */}
                <rect x="50" y="440" width="800" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="450" y="465" textAnchor="middle" className="fill-orange-800 font-semibold">WEBHOOK & EVENT MANAGEMENT (1800-1899)</text>
                
                <rect x="100" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="160" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Event Router (1810)</text>
                
                <rect x="240" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="300" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Retry Logic (1820)</text>
                
                <rect x="380" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="440" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Signature Verify (1830)</text>
                
                <rect x="520" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="580" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Webhook Testing (1840)</text>
                
                <rect x="660" y="490" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="720" y="513" textAnchor="middle" className="fill-orange-900 text-sm">Event History (1850)</text>

                {/* Deployment Options */}
                <rect x="50" y="570" width="800" height="100" fill="#ffebee" stroke="#c62828" strokeWidth="2"/>
                <text x="450" y="595" textAnchor="middle" className="fill-red-800 font-semibold">DEPLOYMENT & LICENSING (1900-1999)</text>
                
                <rect x="80" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="140" y="643" textAnchor="middle" className="fill-red-900 text-sm">Cloud Deploy (1910)</text>
                
                <rect x="220" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="280" y="643" textAnchor="middle" className="fill-red-900 text-sm">On-Premise (1920)</text>
                
                <rect x="360" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="420" y="643" textAnchor="middle" className="fill-red-900 text-sm">Air-Gapped (1930)</text>
                
                <rect x="500" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="560" y="643" textAnchor="middle" className="fill-red-900 text-sm">License Manager (1940)</text>
                
                <rect x="640" y="620" width="120" height="40" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="700" y="643" textAnchor="middle" className="fill-red-900 text-sm">Usage Analytics (1950)</text>

                {/* Data Flow Arrows */}
                <line x1="450" y1="150" x2="450" y2="180" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="280" x2="450" y2="310" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="410" x2="450" y2="440" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="540" x2="450" y2="570" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Enterprise Platform Components:</strong></p>
                <p>(1500-1550) API Gateway: Rate limiting, authentication, load balancing, versioning</p>
                <p>(1600-1650) White-Label: Brand management, theme engine, domain configuration</p>
                <p>(1700-1750) SDK Generation: Multi-language SDK automatic generation</p>
                <p>(1800-1850) Webhook Management: Event routing, retry logic, signature verification</p>
                <p>(1900-1950) Deployment: Cloud, on-premise, air-gapped options with licensing</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Figure 5: Legal-Grade Audit System</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 650" className="w-full border rounded">
                {/* Title */}
                <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">LEGAL-GRADE AUDIT TRAIL ARCHITECTURE</text>
                
                {/* Event Capture Layer */}
                <rect x="50" y="50" width="800" height="80" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">EVENT CAPTURE & CLASSIFICATION (2000-2099)</text>
                
                <rect x="80" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="140" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Auth Events (2010)</text>
                
                <rect x="220" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="280" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Access Events (2020)</text>
                
                <rect x="360" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="420" y="113" textAnchor="middle" className="fill-blue-900 text-sm">System Events (2030)</text>
                
                <rect x="500" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="560" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Security Events (2040)</text>
                
                <rect x="640" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                <text x="700" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Admin Events (2050)</text>

                {/* Cryptographic Processing */}
                <rect x="50" y="160" width="800" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="450" y="185" textAnchor="middle" className="fill-purple-800 font-semibold">CRYPTOGRAPHIC INTEGRITY LAYER (2100-2199)</text>
                
                <rect x="80" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="140" y="233" textAnchor="middle" className="fill-purple-900 text-sm">SHA-256 Hashing (2110)</text>
                
                <rect x="220" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="280" y="233" textAnchor="middle" className="fill-purple-900 text-sm">Chain Validation (2120)</text>
                
                <rect x="360" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="420" y="233" textAnchor="middle" className="fill-purple-900 text-sm">Timestamp Authority (2130)</text>
                
                <rect x="500" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="560" y="233" textAnchor="middle" className="fill-purple-900 text-sm">Digital Signatures (2140)</text>
                
                <rect x="640" y="210" width="120" height="40" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="700" y="233" textAnchor="middle" className="fill-purple-900 text-sm">Tamper Detection (2150)</text>

                {/* Immutable Storage */}
                <rect x="50" y="290" width="800" height="100" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="450" y="315" textAnchor="middle" className="fill-green-800 font-semibold">IMMUTABLE STORAGE SYSTEM (2200-2299)</text>
                
                <rect x="80" y="340" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="140" y="363" textAnchor="middle" className="fill-green-900 text-sm">Write-Once DB (2210)</text>
                
                <rect x="220" y="340" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="280" y="363" textAnchor="middle" className="fill-green-900 text-sm">Merkle Tree (2220)</text>
                
                <rect x="360" y="340" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="420" y="363" textAnchor="middle" className="fill-green-900 text-sm">Log Replication (2230)</text>
                
                <rect x="500" y="340" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="560" y="363" textAnchor="middle" className="fill-green-900 text-sm">Backup Sync (2240)</text>
                
                <rect x="640" y="340" width="120" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="700" y="363" textAnchor="middle" className="fill-green-900 text-sm">Archive Storage (2250)</text>

                {/* Legal Evidence Preparation */}
                <rect x="50" y="420" width="800" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="450" y="445" textAnchor="middle" className="fill-orange-800 font-semibold">LEGAL EVIDENCE PREPARATION (2300-2399)</text>
                
                <rect x="80" y="470" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="140" y="493" textAnchor="middle" className="fill-orange-900 text-sm">Chain of Custody (2310)</text>
                
                <rect x="220" y="470" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="280" y="493" textAnchor="middle" className="fill-orange-900 text-sm">Evidence Exports (2320)</text>
                
                <rect x="360" y="470" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="420" y="493" textAnchor="middle" className="fill-orange-900 text-sm">Integrity Proofs (2330)</text>
                
                <rect x="500" y="470" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="560" y="493" textAnchor="middle" className="fill-orange-900 text-sm">Court Reports (2340)</text>
                
                <rect x="640" y="470" width="120" height="40" fill="#ffcc02" stroke="#e65100"/>
                <text x="700" y="493" textAnchor="middle" className="fill-orange-900 text-sm">Expert Testimony (2350)</text>

                {/* Hash Chain Visualization */}
                <rect x="50" y="550" width="800" height="80" fill="#f5f5f5" stroke="#757575"/>
                <text x="450" y="570" textAnchor="middle" className="font-semibold">CRYPTOGRAPHIC HASH CHAIN STRUCTURE</text>
                
                {/* Hash blocks */}
                <rect x="80" y="580" width="60" height="30" fill="#e91e63" stroke="#ad1457"/>
                <text x="110" y="598" textAnchor="middle" className="text-xs text-white">Block₀</text>
                
                <line x1="140" y1="595" x2="160" y2="595" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                <rect x="160" y="580" width="60" height="30" fill="#e91e63" stroke="#ad1457"/>
                <text x="190" y="598" textAnchor="middle" className="text-xs text-white">Block₁</text>
                
                <line x1="220" y1="595" x2="240" y2="595" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                <rect x="240" y="580" width="60" height="30" fill="#e91e63" stroke="#ad1457"/>
                <text x="270" y="598" textAnchor="middle" className="text-xs text-white">Block₂</text>
                
                <text x="320" y="598" className="text-sm">Hash(Blockₙ) = SHA256(Blockₙ₋₁ + Event + Timestamp)</text>

                {/* Data Flow Arrows */}
                <line x1="450" y1="130" x2="450" y2="160" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="260" x2="450" y2="290" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="390" x2="450" y2="420" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Legal Audit Components:</strong></p>
                <p>(2000-2050) Event Capture: Comprehensive logging of all system activities</p>
                <p>(2100-2150) Cryptographic Integrity: SHA-256 hashing, chain validation, tamper detection</p>
                <p>(2200-2250) Immutable Storage: Write-once database, Merkle trees, replicated logs</p>
                <p>(2300-2350) Legal Evidence: Chain of custody, court-ready reports, expert testimony support</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Figure 4: Security Framework Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 600" className="w-full border rounded">
                {/* Security Layers */}
                <text x="400" y="30" textAnchor="middle" className="text-lg font-bold">MULTI-LAYER SECURITY FRAMEWORK</text>
                
                {/* Layer 1: Input Security */}
                <rect x="50" y="60" width="700" height="80" fill="#ffebee" stroke="#c62828" strokeWidth="2"/>
                <text x="400" y="80" textAnchor="middle" className="fill-red-800 font-semibold">INPUT SECURITY LAYER (300)</text>
                
                <rect x="70" y="100" width="120" height="30" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="130" y="118" textAnchor="middle" className="text-sm">Rate Limiting (301)</text>
                
                <rect x="210" y="100" width="120" height="30" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="270" y="118" textAnchor="middle" className="text-sm">Input Validation (302)</text>
                
                <rect x="350" y="100" width="120" height="30" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="410" y="118" textAnchor="middle" className="text-sm">CSRF Protection (303)</text>
                
                <rect x="490" y="100" width="120" height="30" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="550" y="118" textAnchor="middle" className="text-sm">Bot Detection (304)</text>
                
                <rect x="630" y="100" width="100" height="30" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="680" y="118" textAnchor="middle" className="text-sm">Sanitization (305)</text>
                
                {/* Layer 2: Processing Security */}
                <rect x="50" y="180" width="700" height="80" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="400" y="200" textAnchor="middle" className="fill-purple-800 font-semibold">PROCESSING SECURITY LAYER (310)</text>
                
                <rect x="70" y="220" width="130" height="30" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="135" y="238" textAnchor="middle" className="text-sm">Fraud Detection (311)</text>
                
                <rect x="220" y="220" width="130" height="30" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="285" y="238" textAnchor="middle" className="text-sm">Anomaly Analysis (312)</text>
                
                <rect x="370" y="220" width="130" height="30" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="435" y="238" textAnchor="middle" className="text-sm">Pattern Validation (313)</text>
                
                <rect x="520" y="220" width="130" height="30" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="585" y="238" textAnchor="middle" className="text-sm">Confidence Scoring (314)</text>
                
                {/* Layer 3: Storage Security */}
                <rect x="50" y="300" width="700" height="80" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="400" y="320" textAnchor="middle" className="fill-green-800 font-semibold">STORAGE SECURITY LAYER (320)</text>
                
                <rect x="70" y="340" width="100" height="30" fill="#c8e6c9" stroke="#43a047"/>
                <text x="120" y="358" textAnchor="middle" className="text-sm">AES-256 (321)</text>
                
                <rect x="190" y="340" width="120" height="30" fill="#c8e6c9" stroke="#43a047"/>
                <text x="250" y="358" textAnchor="middle" className="text-sm">Key Management (322)</text>
                
                <rect x="330" y="340" width="100" height="30" fill="#c8e6c9" stroke="#43a047"/>
                <text x="380" y="358" textAnchor="middle" className="text-sm">Data Masking (323)</text>
                
                <rect x="450" y="340" width="120" height="30" fill="#c8e6c9" stroke="#43a047"/>
                <text x="510" y="358" textAnchor="middle" className="text-sm">Access Control (324)</text>
                
                <rect x="590" y="340" width="130" height="30" fill="#c8e6c9" stroke="#43a047"/>
                <text x="655" y="358" textAnchor="middle" className="text-sm">Audit Logging (325)</text>
                
                {/* Layer 4: Communication Security */}
                <rect x="50" y="420" width="700" height="80" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="400" y="440" textAnchor="middle" className="fill-orange-800 font-semibold">COMMUNICATION SECURITY LAYER (330)</text>
                
                <rect x="70" y="460" width="120" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="130" y="478" textAnchor="middle" className="text-sm">TLS 1.3 (331)</text>
                
                <rect x="210" y="460" width="120" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="270" y="478" textAnchor="middle" className="text-sm">Certificate Pinning (332)</text>
                
                <rect x="350" y="460" width="120" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="410" y="478" textAnchor="middle" className="text-sm">HSTS Headers (333)</text>
                
                <rect x="490" y="460" width="120" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="550" y="478" textAnchor="middle" className="text-sm">CORS Policy (334)</text>
                
                <rect x="630" y="460" width="100" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="680" y="478" textAnchor="middle" className="text-sm">JWT Security (335)</text>
                
                {/* Security Flow */}
                <line x1="400" y1="140" x2="400" y2="180" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="400" y1="260" x2="400" y2="300" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="400" y1="380" x2="400" y2="420" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                
                {/* Security Metrics */}
                <rect x="50" y="520" width="700" height="60" fill="#f5f5f5" stroke="#757575" strokeWidth="1"/>
                <text x="400" y="540" textAnchor="middle" className="font-semibold">SECURITY METRICS & THRESHOLDS</text>
                
                <text x="70" y="560" className="text-sm">Max Failed Attempts: 5</text>
                <text x="220" y="560" className="text-sm">Rate Limit: 10/min</text>
                <text x="350" y="560" className="text-sm">Min Confidence: 70%</text>
                <text x="500" y="560" className="text-sm">Session Timeout: 30min</text>
                <text x="650" y="560" className="text-sm">Audit Retention: 90d</text>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Security Layers:</strong></p>
                <p>(300-305) Input Layer: Prevents malicious input and automated attacks</p>
                <p>(310-314) Processing Layer: Detects fraud and validates authentication attempts</p>
                <p>(320-325) Storage Layer: Encrypts and protects biometric data at rest</p>
                <p>(330-335) Communication Layer: Secures data transmission channels</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Figure 5: Continuous Learning Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 600" className="w-full border rounded">
                {/* Title */}
                <text x="400" y="30" textAnchor="middle" className="text-lg font-bold">ADAPTIVE LEARNING SYSTEM ARCHITECTURE</text>
                
                {/* Input Data */}
                <rect x="50" y="60" width="120" height="60" fill="#e3f2fd" stroke="#1976d2"/>
                <text x="110" y="85" textAnchor="middle" className="text-sm font-semibold">New Keystroke</text>
                <text x="110" y="100" textAnchor="middle" className="text-sm font-semibold">Pattern (400)</text>
                
                {/* Existing Profile */}
                <rect x="50" y="150" width="120" height="60" fill="#f3e5f5" stroke="#7b1fa2"/>
                <text x="110" y="175" textAnchor="middle" className="text-sm font-semibold">Existing Biometric</text>
                <text x="110" y="190" textAnchor="middle" className="text-sm font-semibold">Profile (401)</text>
                
                {/* Pattern Analysis */}
                <rect x="220" y="90" width="140" height="80" fill="#fff3e0" stroke="#f57c00"/>
                <text x="290" y="110" textAnchor="middle" className="text-sm font-semibold">Pattern Analysis</text>
                <text x="290" y="125" textAnchor="middle" className="text-sm font-semibold">Engine (402)</text>
                <text x="290" y="145" textAnchor="middle" className="text-xs">• Statistical Comparison</text>
                <text x="290" y="160" textAnchor="middle" className="text-xs">• Similarity Scoring</text>
                
                {/* Confidence Calculator */}
                <rect x="390" y="90" width="140" height="80" fill="#e8f5e8" stroke="#388e3c"/>
                <text x="460" y="110" textAnchor="middle" className="text-sm font-semibold">Adaptive Confidence</text>
                <text x="460" y="125" textAnchor="middle" className="text-sm font-semibold">Calculator (403)</text>
                <text x="460" y="145" textAnchor="middle" className="text-xs">• Dynamic Thresholds</text>
                <text x="460" y="160" textAnchor="middle" className="text-xs">• Learning Rate</text>
                
                {/* Decision Node */}
                <polygon points="600,130 650,110 700,130 650,150" fill="#ff9800" stroke="#ef6c00"/>
                <text x="650" y="135" textAnchor="middle" className="text-xs font-semibold">Accept?</text>
                <text x="650" y="145" textAnchor="middle" className="text-xs">(404)</text>
                
                {/* Learning Branch - Accept */}
                <rect x="580" y="200" width="140" height="60" fill="#4caf50" stroke="#2e7d32"/>
                <text x="650" y="220" textAnchor="middle" className="text-sm font-semibold text-white">Pattern Integration</text>
                <text x="650" y="235" textAnchor="middle" className="text-sm font-semibold text-white">(405)</text>
                <text x="650" y="250" textAnchor="middle" className="text-xs text-white">Add to Profile</text>
                
                {/* Reject Branch */}
                <rect x="450" y="200" width="100" height="60" fill="#f44336" stroke="#c62828"/>
                <text x="500" y="220" textAnchor="middle" className="text-sm font-semibold text-white">Reject &</text>
                <text x="500" y="235" textAnchor="middle" className="text-sm font-semibold text-white">Log (406)</text>
                <text x="500" y="250" textAnchor="middle" className="text-xs text-white">Security Alert</text>
                
                {/* Pattern Pruning */}
                <rect x="580" y="290" width="140" height="60" fill="#9c27b0" stroke="#6a1b9a"/>
                <text x="650" y="310" textAnchor="middle" className="text-sm font-semibold text-white">Pattern Pruning</text>
                <text x="650" y="325" textAnchor="middle" className="text-sm font-semibold text-white">(407)</text>
                <text x="650" y="340" textAnchor="middle" className="text-xs text-white">Optimize Dataset</text>
                
                {/* Profile Update */}
                <rect x="580" y="380" width="140" height="60" fill="#607d8b" stroke="#37474f"/>
                <text x="650" y="400" textAnchor="middle" className="text-sm font-semibold text-white">Profile Update</text>
                <text x="650" y="415" textAnchor="middle" className="text-sm font-semibold text-white">(408)</text>
                <text x="650" y="430" textAnchor="middle" className="text-xs text-white">Save Changes</text>
                
                {/* Learning Metrics */}
                <rect x="50" y="300" width="300" height="120" fill="#f5f5f5" stroke="#757575"/>
                <text x="200" y="320" textAnchor="middle" className="font-semibold">LEARNING METRICS (409)</text>
                
                <text x="60" y="340" className="text-sm">Adaptation Rate: Rate of pattern stabilization</text>
                <text x="60" y="355" className="text-sm">Stability Score: Consistency measurement</text>
                <text x="60" y="370" className="text-sm">Improvement Trend: Confidence progression</text>
                <text x="60" y="385" className="text-sm">Pattern Count: Number of training samples</text>
                <text x="60" y="400" className="text-sm">Learning Status: {`learning | active | locked`}</text>
                
                {/* Feedback Loop */}
                <rect x="50" y="460" width="300" height="80" fill="#e1f5fe" stroke="#0277bd"/>
                <text x="200" y="480" textAnchor="middle" className="font-semibold">CONTINUOUS FEEDBACK LOOP (410)</text>
                
                <text x="60" y="500" className="text-sm">1. Collect new authentication patterns</text>
                <text x="60" y="515" className="text-sm">2. Analyze against existing profile</text>
                <text x="60" y="530" className="text-sm">3. Update confidence and thresholds</text>
                
                {/* Arrows showing flow */}
                <line x1="170" y1="90" x2="220" y2="130" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="170" y1="180" x2="220" y2="130" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="360" y1="130" x2="390" y2="130" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="530" y1="130" x2="600" y2="130" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Decision branches */}
                <line x1="650" y1="150" x2="650" y2="200" stroke="#4caf50" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <text x="660" y="175" className="text-sm font-semibold fill-green-600">YES</text>
                
                <line x1="620" y1="140" x2="500" y2="200" stroke="#f44336" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <text x="540" y="165" className="text-sm font-semibold fill-red-600">NO</text>
                
                {/* Sequential flow in learning branch */}
                <line x1="650" y1="260" x2="650" y2="290" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="650" y1="350" x2="650" y2="380" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Feedback loop */}
                <path d="M 200 460 Q 100 440 650 440 Q 750 440 750 130 Q 750 80 170 80" 
                      stroke="#0277bd" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Learning Components:</strong></p>
                <p>(400-401) Input Data: New patterns and existing user profiles</p>
                <p>(402-404) Analysis Pipeline: Pattern comparison and confidence calculation</p>
                <p>(405-408) Profile Management: Pattern integration and optimization</p>
                <p>(409-410) Metrics & Feedback: Performance tracking and continuous improvement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud">
          <Card>
            <CardHeader>
              <CardTitle>Figure 6: Fraud Detection System</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 650" className="w-full border rounded">
                {/* Title */}
                <text x="400" y="30" textAnchor="middle" className="text-lg font-bold">ADVANCED FRAUD DETECTION ARCHITECTURE</text>
                
                {/* Input Layer */}
                <rect x="50" y="60" width="700" height="60" fill="#ffebee" stroke="#c62828"/>
                <text x="400" y="80" textAnchor="middle" className="font-semibold">INPUT ANALYSIS LAYER</text>
                
                <rect x="70" y="95" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="130" y="107" textAnchor="middle" className="text-xs">Timing Patterns (500)</text>
                
                <rect x="210" y="95" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="270" y="107" textAnchor="middle" className="text-xs">Key Sequences (501)</text>
                
                <rect x="350" y="95" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="410" y="107" textAnchor="middle" className="text-xs">Speed Analysis (502)</text>
                
                <rect x="490" y="95" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="550" y="107" textAnchor="middle" className="text-xs">Device Data (503)</text>
                
                <rect x="630" y="95" width="100" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="680" y="107" textAnchor="middle" className="text-xs">Session Info (504)</text>
                
                {/* Detection Modules */}
                <rect x="50" y="160" width="700" height="140" fill="#f3e5f5" stroke="#7b1fa2"/>
                <text x="400" y="180" textAnchor="middle" className="font-semibold">FRAUD DETECTION MODULES</text>
                
                {/* Machine Pattern Detection */}
                <rect x="70" y="200" width="150" height="80" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="145" y="220" textAnchor="middle" className="text-sm font-semibold">Machine Pattern</text>
                <text x="145" y="235" textAnchor="middle" className="text-sm font-semibold">Detection (510)</text>
                <text x="145" y="255" textAnchor="middle" className="text-xs">• Consistent timing</text>
                <text x="145" y="270" textAnchor="middle" className="text-xs">• Perfect intervals</text>
                
                {/* Copy-Paste Detection */}
                <rect x="240" y="200" width="150" height="80" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="315" y="220" textAnchor="middle" className="text-sm font-semibold">Copy-Paste</text>
                <text x="315" y="235" textAnchor="middle" className="text-sm font-semibold">Detection (511)</text>
                <text x="315" y="255" textAnchor="middle" className="text-xs">• Ultra-fast input</text>
                <text x="315" y="270" textAnchor="middle" className="text-xs">• No key variations</text>
                
                {/* Replay Attack Detection */}
                <rect x="410" y="200" width="150" height="80" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="485" y="220" textAnchor="middle" className="text-sm font-semibold">Replay Attack</text>
                <text x="485" y="235" textAnchor="middle" className="text-sm font-semibold">Detection (512)</text>
                <text x="485" y="255" textAnchor="middle" className="text-xs">• Identical patterns</text>
                <text x="485" y="270" textAnchor="middle" className="text-xs">• Timestamp analysis</text>
                
                {/* Bot Detection */}
                <rect x="580" y="200" width="150" height="80" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="655" y="220" textAnchor="middle" className="text-sm font-semibold">Bot Detection</text>
                <text x="655" y="235" textAnchor="middle" className="text-sm font-semibold">(513)</text>
                <text x="655" y="255" textAnchor="middle" className="text-xs">• Browser fingerprint</text>
                <text x="655" y="270" textAnchor="middle" className="text-xs">• Behavioral analysis</text>
                
                {/* Analysis Engine */}
                <rect x="50" y="340" width="700" height="100" fill="#e8f5e8" stroke="#388e3c"/>
                <text x="400" y="360" textAnchor="middle" className="font-semibold">FRAUD ANALYSIS ENGINE</text>
                
                {/* Risk Scoring */}
                <rect x="70" y="380" width="140" height="50" fill="#c8e6c9" stroke="#43a047"/>
                <text x="140" y="400" textAnchor="middle" className="text-sm font-semibold">Risk Scoring</text>
                <text x="140" y="415" textAnchor="middle" className="text-sm font-semibold">(520)</text>
                
                {/* Anomaly Weighting */}
                <rect x="230" y="380" width="140" height="50" fill="#c8e6c9" stroke="#43a047"/>
                <text x="300" y="400" textAnchor="middle" className="text-sm font-semibold">Anomaly Weighting</text>
                <text x="300" y="415" textAnchor="middle" className="text-sm font-semibold">(521)</text>
                
                {/* Confidence Adjustment */}
                <rect x="390" y="380" width="140" height="50" fill="#c8e6c9" stroke="#43a047"/>
                <text x="460" y="400" textAnchor="middle" className="text-sm font-semibold">Confidence Adjust</text>
                <text x="460" y="415" textAnchor="middle" className="text-sm font-semibold">(522)</text>
                
                {/* Decision Engine */}
                <rect x="550" y="380" width="140" height="50" fill="#c8e6c9" stroke="#43a047"/>
                <text x="620" y="400" textAnchor="middle" className="text-sm font-semibold">Decision Engine</text>
                <text x="620" y="415" textAnchor="middle" className="text-sm font-semibold">(523)</text>
                
                {/* Output Actions */}
                <rect x="50" y="480" width="700" height="80" fill="#fff3e0" stroke="#f57c00"/>
                <text x="400" y="500" textAnchor="middle" className="font-semibold">RESPONSE ACTIONS</text>
                
                <rect x="70" y="520" width="100" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="120" y="538" textAnchor="middle" className="text-sm">Allow (530)</text>
                
                <rect x="190" y="520" width="100" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="240" y="538" textAnchor="middle" className="text-sm">Challenge (531)</text>
                
                <rect x="310" y="520" width="100" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="360" y="538" textAnchor="middle" className="text-sm">Block (532)</text>
                
                <rect x="430" y="520" width="100" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="480" y="538" textAnchor="middle" className="text-sm">Alert (533)</text>
                
                <rect x="550" y="520" width="100" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="600" y="538" textAnchor="middle" className="text-sm">Log (534)</text>
                
                <rect x="670" y="520" width="60" height="30" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="700" y="538" textAnchor="middle" className="text-sm">Learn (535)</text>
                
                {/* Fraud Indicators Chart */}
                <rect x="50" y="580" width="350" height="60" fill="#f5f5f5" stroke="#757575"/>
                <text x="225" y="600" textAnchor="middle" className="font-semibold">FRAUD INDICATORS MATRIX</text>
                
                <text x="60" y="615" className="text-xs">Machine Pattern: Penalty -30%</text>
                <text x="60" y="625" className="text-xs">Copy-Paste: Penalty -25%</text>
                <text x="60" y="635" className="text-xs">Unusual Timing: Penalty -20%</text>
                
                <text x="220" y="615" className="text-xs">Device Mismatch: Penalty -10%</text>
                <text x="220" y="625" className="text-xs">Replay Attack: Block</text>
                <text x="220" y="635" className="text-xs">Bot Detected: Block</text>
                
                {/* Performance Metrics */}
                <rect x="420" y="580" width="330" height="60" fill="#f5f5f5" stroke="#757575"/>
                <text x="585" y="600" textAnchor="middle" className="font-semibold">PERFORMANCE METRICS</text>
                
                <text x="430" y="615" className="text-xs">False Positive Rate: &lt;1%</text>
                <text x="430" y="625" className="text-xs">Detection Accuracy: &gt;99%</text>
                <text x="430" y="635" className="text-xs">Processing Time: &lt;50ms</text>
                
                <text x="600" y="615" className="text-xs">Fraud Detection Rate: &gt;95%</text>
                <text x="600" y="625" className="text-xs">Response Time: &lt;100ms</text>
                <text x="600" y="635" className="text-xs">Learning Adaptation: Real-time</text>
                
                {/* Flow Arrows */}
                <line x1="400" y1="120" x2="400" y2="160" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="400" y1="300" x2="400" y2="340" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="400" y1="440" x2="400" y2="480" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Detection Systems:</strong></p>
                <p>(500-504) Input Analysis: Multi-dimensional data collection and preprocessing</p>
                <p>(510-513) Detection Modules: Specialized algorithms for different fraud types</p>
                <p>(520-523) Analysis Engine: Risk assessment and confidence adjustment</p>
                <p>(530-535) Response Actions: Automated responses based on threat level</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Figure 6: Predictive Analytics Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 650" className="w-full border rounded">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
                  </marker>
                </defs>
                
                <text x="450" y="30" textAnchor="middle" className="text-lg font-bold">PREDICTIVE ANALYTICS & ML ENGINE</text>
                
                {/* Data Input Layer */}
                <rect x="50" y="60" width="800" height="80" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                <text x="450" y="85" textAnchor="middle" className="fill-blue-800 font-semibold">DATA COLLECTION & PREPROCESSING (600-649)</text>
                
                <rect x="80" y="105" width="120" height="25" fill="#bbdefb" stroke="#1565c0"/>
                <text x="140" y="120" textAnchor="middle" className="fill-blue-900 text-sm">Keystroke Data (610)</text>
                
                <rect x="220" y="105" width="120" height="25" fill="#bbdefb" stroke="#1565c0"/>
                <text x="280" y="120" textAnchor="middle" className="fill-blue-900 text-sm">Mouse Dynamics (620)</text>
                
                <rect x="360" y="105" width="120" height="25" fill="#bbdefb" stroke="#1565c0"/>
                <text x="420" y="120" textAnchor="middle" className="fill-blue-900 text-sm">Touch Patterns (630)</text>
                
                <rect x="500" y="105" width="120" height="25" fill="#bbdefb" stroke="#1565c0"/>
                <text x="560" y="120" textAnchor="middle" className="fill-blue-900 text-sm">Session Context (640)</text>
                
                <rect x="640" y="105" width="120" height="25" fill="#bbdefb" stroke="#1565c0"/>
                <text x="700" y="120" textAnchor="middle" className="fill-blue-900 text-sm">Device Metrics (649)</text>
                
                {/* ML Processing Engine */}
                <rect x="50" y="170" width="800" height="120" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="450" y="195" textAnchor="middle" className="fill-purple-800 font-semibold">MACHINE LEARNING PROCESSING (650-699)</text>
                
                {/* Feature Extraction */}
                <rect x="80" y="220" width="150" height="60" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="155" y="240" textAnchor="middle" className="text-sm font-semibold">Feature Extraction</text>
                <text x="155" y="255" textAnchor="middle" className="text-sm font-semibold">(650)</text>
                <text x="155" y="270" textAnchor="middle" className="text-xs">• Timing patterns</text>
                
                {/* Pattern Recognition */}
                <rect x="250" y="220" width="150" height="60" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="325" y="240" textAnchor="middle" className="text-sm font-semibold">Pattern Recognition</text>
                <text x="325" y="255" textAnchor="middle" className="text-sm font-semibold">(660)</text>
                <text x="325" y="270" textAnchor="middle" className="text-xs">• Neural networks</text>
                
                {/* Anomaly Detection */}
                <rect x="420" y="220" width="150" height="60" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="495" y="240" textAnchor="middle" className="text-sm font-semibold">Anomaly Detection</text>
                <text x="495" y="255" textAnchor="middle" className="text-sm font-semibold">(670)</text>
                <text x="495" y="270" textAnchor="middle" className="text-xs">• Outlier analysis</text>
                
                {/* Risk Prediction */}
                <rect x="590" y="220" width="150" height="60" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="665" y="240" textAnchor="middle" className="text-sm font-semibold">Risk Prediction</text>
                <text x="665" y="255" textAnchor="middle" className="text-sm font-semibold">(680)</text>
                <text x="665" y="270" textAnchor="middle" className="text-xs">• Threat scoring</text>
                
                {/* Analytics Engine */}
                <rect x="50" y="320" width="800" height="100" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="450" y="345" textAnchor="middle" className="fill-green-800 font-semibold">PREDICTIVE ANALYTICS ENGINE (700-749)</text>
                
                {/* Behavioral Modeling */}
                <rect x="80" y="365" width="140" height="45" fill="#c8e6c9" stroke="#43a047"/>
                <text x="150" y="385" textAnchor="middle" className="text-sm font-semibold">Behavioral</text>
                <text x="150" y="398" textAnchor="middle" className="text-sm font-semibold">Modeling (710)</text>
                
                {/* Trend Analysis */}
                <rect x="240" y="365" width="140" height="45" fill="#c8e6c9" stroke="#43a047"/>
                <text x="310" y="385" textAnchor="middle" className="text-sm font-semibold">Trend Analysis</text>
                <text x="310" y="398" textAnchor="middle" className="text-sm font-semibold">(720)</text>
                
                {/* Confidence Scoring */}
                <rect x="400" y="365" width="140" height="45" fill="#c8e6c9" stroke="#43a047"/>
                <text x="470" y="385" textAnchor="middle" className="text-sm font-semibold">Confidence</text>
                <text x="470" y="398" textAnchor="middle" className="text-sm font-semibold">Scoring (730)</text>
                
                {/* Adaptive Learning */}
                <rect x="560" y="365" width="140" height="45" fill="#c8e6c9" stroke="#43a047"/>
                <text x="630" y="385" textAnchor="middle" className="text-sm font-semibold">Adaptive</text>
                <text x="630" y="398" textAnchor="middle" className="text-sm font-semibold">Learning (740)</text>
                
                {/* Output & Actions */}
                <rect x="50" y="450" width="800" height="80" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="450" y="475" textAnchor="middle" className="fill-orange-800 font-semibold">PREDICTIVE OUTPUTS (750-799)</text>
                
                <rect x="80" y="495" width="120" height="25" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="140" y="510" textAnchor="middle" className="text-sm">Risk Score (750)</text>
                
                <rect x="220" y="495" width="120" height="25" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="280" y="510" textAnchor="middle" className="text-sm">Fraud Alert (760)</text>
                
                <rect x="360" y="495" width="120" height="25" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="420" y="510" textAnchor="middle" className="text-sm">Auth Decision (770)</text>
                
                <rect x="500" y="495" width="120" height="25" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="560" y="510" textAnchor="middle" className="text-sm">Profile Update (780)</text>
                
                <rect x="640" y="495" width="120" height="25" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="700" y="510" textAnchor="middle" className="text-sm">System Learn (790)</text>
                
                {/* Performance Metrics */}
                <rect x="50" y="560" width="400" height="70" fill="#f5f5f5" stroke="#757575"/>
                <text x="250" y="580" textAnchor="middle" className="font-semibold">ML PERFORMANCE METRICS</text>
                
                <text x="60" y="600" className="text-xs">Prediction Accuracy: &gt;96%</text>
                <text x="60" y="615" className="text-xs">False Positive Rate: &lt;2%</text>
                <text x="250" y="600" className="text-xs">Model Training Time: &lt;1min</text>
                <text x="250" y="615" className="text-xs">Real-time Inference: &lt;10ms</text>
                
                {/* Business Impact */}
                <rect x="470" y="560" width="380" height="70" fill="#f5f5f5" stroke="#757575"/>
                <text x="660" y="580" textAnchor="middle" className="font-semibold">BUSINESS IMPACT ANALYTICS</text>
                
                <text x="480" y="600" className="text-xs">Fraud Reduction: 85%</text>
                <text x="480" y="615" className="text-xs">User Experience Score: 9.2/10</text>
                <text x="650" y="600" className="text-xs">Cost Savings: $2.3M annually</text>
                <text x="650" y="615" className="text-xs">Compliance Score: 99.8%</text>
                
                {/* Flow arrows */}
                <line x1="450" y1="140" x2="450" y2="170" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="290" x2="450" y2="320" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="420" x2="450" y2="450" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Predictive Analytics Components:</strong></p>
                <p>(600-649) Data Collection: Multi-modal biometric data preprocessing</p>
                <p>(650-680) ML Processing: Feature extraction, pattern recognition, anomaly detection</p>
                <p>(700-740) Analytics Engine: Behavioral modeling, trend analysis, adaptive learning</p>
                <p>(750-790) Predictive Outputs: Risk scoring, fraud alerts, authentication decisions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantum">
          <Card>
            <CardHeader>
              <CardTitle>Figure 7: Quantum-Resistant Security Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 700" className="w-full border rounded">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
                  </marker>
                </defs>
                
                <text x="450" y="30" textAnchor="middle" className="text-lg font-bold">QUANTUM-RESISTANT CRYPTOGRAPHIC ARCHITECTURE</text>
                
                {/* Quantum Threat Layer */}
                <rect x="50" y="60" width="800" height="70" fill="#ffebee" stroke="#c62828" strokeWidth="2"/>
                <text x="450" y="85" textAnchor="middle" className="fill-red-800 font-semibold">QUANTUM THREAT LANDSCAPE (800-849)</text>
                
                <rect x="80" y="105" width="140" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="150" y="117" textAnchor="middle" className="text-xs">Shor's Algorithm (810)</text>
                
                <rect x="240" y="105" width="140" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="310" y="117" textAnchor="middle" className="text-xs">Grover's Algorithm (820)</text>
                
                <rect x="400" y="105" width="140" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="470" y="117" textAnchor="middle" className="text-xs">RSA Vulnerability (830)</text>
                
                <rect x="560" y="105" width="140" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="630" y="117" textAnchor="middle" className="text-xs">ECDSA Weakness (840)</text>
                
                <rect x="720" y="105" width="110" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                <text x="775" y="117" textAnchor="middle" className="text-xs">Key Recovery (849)</text>
                
                {/* Post-Quantum Cryptography */}
                <rect x="50" y="160" width="800" height="100" fill="#e8eaf6" stroke="#3f51b5" strokeWidth="2"/>
                <text x="450" y="185" textAnchor="middle" className="fill-indigo-800 font-semibold">POST-QUANTUM CRYPTOGRAPHY (850-899)</text>
                
                {/* Lattice-based */}
                <rect x="80" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                <text x="155" y="228" textAnchor="middle" className="text-sm font-semibold">Lattice-based</text>
                <text x="155" y="242" textAnchor="middle" className="text-sm font-semibold">Crypto (850)</text>
                
                {/* Hash-based */}
                <rect x="250" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                <text x="325" y="228" textAnchor="middle" className="text-sm font-semibold">Hash-based</text>
                <text x="325" y="242" textAnchor="middle" className="text-sm font-semibold">Signatures (860)</text>
                
                {/* Code-based */}
                <rect x="420" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                <text x="495" y="228" textAnchor="middle" className="text-sm font-semibold">Code-based</text>
                <text x="495" y="242" textAnchor="middle" className="text-sm font-semibold">Crypto (870)</text>
                
                {/* Multivariate */}
                <rect x="590" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                <text x="665" y="228" textAnchor="middle" className="text-sm font-semibold">Multivariate</text>
                <text x="665" y="242" textAnchor="middle" className="text-sm font-semibold">Crypto (880)</text>
                
                {/* Hybrid Classical-Quantum */}
                <rect x="50" y="290" width="800" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="450" y="315" textAnchor="middle" className="fill-purple-800 font-semibold">HYBRID CRYPTOGRAPHIC SYSTEM (900-949)</text>
                
                {/* Classical Layer */}
                <rect x="80" y="340" width="160" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="160" y="358" textAnchor="middle" className="text-sm font-semibold">Classical Crypto</text>
                <text x="160" y="372" textAnchor="middle" className="text-sm font-semibold">(900-920)</text>
                
                {/* Quantum Layer */}
                <rect x="260" y="340" width="160" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="340" y="358" textAnchor="middle" className="text-sm font-semibold">Quantum Crypto</text>
                <text x="340" y="372" textAnchor="middle" className="text-sm font-semibold">(921-940)</text>
                
                {/* Transition Protocol */}
                <rect x="440" y="340" width="160" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="520" y="358" textAnchor="middle" className="text-sm font-semibold">Transition Protocol</text>
                <text x="520" y="372" textAnchor="middle" className="text-sm font-semibold">(941-949)</text>
                
                {/* Key Management */}
                <rect x="620" y="340" width="160" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                <text x="700" y="358" textAnchor="middle" className="text-sm font-semibold">Key Management</text>
                <text x="700" y="372" textAnchor="middle" className="text-sm font-semibold">(945-949)</text>
                
                {/* Biometric Integration */}
                <rect x="50" y="420" width="800" height="80" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="450" y="445" textAnchor="middle" className="fill-green-800 font-semibold">QUANTUM-SAFE BIOMETRIC PROCESSING (950-979)</text>
                
                <rect x="80" y="465" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                <text x="150" y="480" textAnchor="middle" className="text-sm">Secure Templates (950)</text>
                
                <rect x="240" y="465" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                <text x="310" y="480" textAnchor="middle" className="text-sm">Encrypted Matching (960)</text>
                
                <rect x="400" y="465" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                <text x="470" y="480" textAnchor="middle" className="text-sm">Privacy Preserving (970)</text>
                
                <rect x="560" y="465" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                <text x="630" y="480" textAnchor="middle" className="text-sm">Quantum Hash (975)</text>
                
                <rect x="720" y="465" width="100" height="25" fill="#c8e6c9" stroke="#43a047"/>
                <text x="770" y="480" textAnchor="middle" className="text-sm">Zero-Knowledge (979)</text>
                
                {/* Implementation Strategy */}
                <rect x="50" y="530" width="800" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="450" y="555" textAnchor="middle" className="fill-orange-800 font-semibold">IMPLEMENTATION STRATEGY (980-999)</text>
                
                {/* Migration Phase */}
                <rect x="80" y="575" width="130" height="45" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="145" y="595" textAnchor="middle" className="text-sm font-semibold">Migration</text>
                <text x="145" y="608" textAnchor="middle" className="text-sm font-semibold">Phase (980)</text>
                
                {/* Compatibility */}
                <rect x="230" y="575" width="130" height="45" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="295" y="595" textAnchor="middle" className="text-sm font-semibold">Backward</text>
                <text x="295" y="608" textAnchor="middle" className="text-sm font-semibold">Compatibility (985)</text>
                
                {/* Performance */}
                <rect x="380" y="575" width="130" height="45" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="445" y="595" textAnchor="middle" className="text-sm font-semibold">Performance</text>
                <text x="445" y="608" textAnchor="middle" className="text-sm font-semibold">Optimization (990)</text>
                
                {/* Monitoring */}
                <rect x="530" y="575" width="130" height="45" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="595" y="595" textAnchor="middle" className="text-sm font-semibold">Security</text>
                <text x="595" y="608" textAnchor="middle" className="text-sm font-semibold">Monitoring (995)</text>
                
                {/* Future-Proofing */}
                <rect x="680" y="575" width="130" height="45" fill="#ffcc02" stroke="#fb8c00"/>
                <text x="745" y="595" textAnchor="middle" className="text-sm font-semibold">Future</text>
                <text x="745" y="608" textAnchor="middle" className="text-sm font-semibold">Proofing (999)</text>
                
                {/* Security Metrics */}
                <rect x="50" y="650" width="420" height="40" fill="#f5f5f5" stroke="#757575"/>
                <text x="260" y="665" textAnchor="middle" className="font-semibold text-sm">QUANTUM SECURITY METRICS</text>
                <text x="60" y="680" className="text-xs">Key Length: 256-bit minimum | Quantum Resistance: 128-bit security | Migration Ready: Yes</text>
                
                <rect x="480" y="650" width="370" height="40" fill="#f5f5f5" stroke="#757575"/>
                <text x="665" y="665" textAnchor="middle" className="font-semibold text-sm">COMPLIANCE STANDARDS</text>
                <text x="490" y="680" className="text-xs">NIST PQC Standards | FIPS 140-2 Level 3 | Common Criteria EAL4+</text>
                
                {/* Flow arrows */}
                <line x1="450" y1="130" x2="450" y2="160" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="260" x2="450" y2="290" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="390" x2="450" y2="420" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                <line x1="450" y1="500" x2="450" y2="530" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Quantum Security Components:</strong></p>
                <p>(800-849) Threat Analysis: Quantum computing vulnerabilities and attack vectors</p>
                <p>(850-899) Post-Quantum Crypto: Lattice, hash, code, and multivariate-based algorithms</p>
                <p>(900-949) Hybrid System: Classical-quantum cryptographic transition framework</p>
                <p>(950-999) Implementation: Secure biometric processing and future-proof deployment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="more">
          <div className="space-y-6">
            
            {/* Figure 10: Government & Healthcare Security */}
            <Card>
              <CardHeader>
                <CardTitle>Figure 10: Government & Healthcare Security Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 900 500" className="w-full border rounded">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
                    </marker>
                  </defs>
                  
                  <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">GOVERNMENT & HEALTHCARE SECURITY COMPLIANCE</text>
                  
                  {/* Government Security Layer */}
                  <rect x="50" y="50" width="380" height="180" fill="#e8eaf6" stroke="#3f51b5" strokeWidth="2"/>
                  <text x="240" y="75" textAnchor="middle" className="fill-indigo-800 font-semibold">GOVERNMENT SECURITY (3700-3799)</text>
                  
                  <rect x="70" y="95" width="100" height="40" fill="#c5cae9" stroke="#303f9f"/>
                  <text x="120" y="113" textAnchor="middle" className="text-sm font-semibold">FIPS 140-2</text>
                  <text x="120" y="127" textAnchor="middle" className="text-sm font-semibold">(3710)</text>
                  
                  <rect x="190" y="95" width="100" height="40" fill="#c5cae9" stroke="#303f9f"/>
                  <text x="240" y="113" textAnchor="middle" className="text-sm font-semibold">Common</text>
                  <text x="240" y="127" textAnchor="middle" className="text-sm font-semibold">Criteria (3720)</text>
                  
                  <rect x="310" y="95" width="100" height="40" fill="#c5cae9" stroke="#303f9f"/>
                  <text x="360" y="113" textAnchor="middle" className="text-sm font-semibold">FedRAMP</text>
                  <text x="360" y="127" textAnchor="middle" className="text-sm font-semibold">(3730)</text>
                  
                  <rect x="70" y="155" width="160" height="30" fill="#9fa8da" stroke="#1a237e"/>
                  <text x="150" y="173" textAnchor="middle" className="text-sm font-semibold">Air-Gapped Deploy (3740)</text>
                  
                  <rect x="250" y="155" width="160" height="30" fill="#9fa8da" stroke="#1a237e"/>
                  <text x="330" y="173" textAnchor="middle" className="text-sm font-semibold">Classified Processing (3750)</text>
                  
                  <rect x="70" y="195" width="340" height="25" fill="#7986cb" stroke="#0d47a1"/>
                  <text x="240" y="210" textAnchor="middle" className="text-sm font-semibold">National Security Compliance Framework (3760-3799)</text>
                  
                  {/* Healthcare Security Layer */}
                  <rect x="470" y="50" width="380" height="180" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                  <text x="660" y="75" textAnchor="middle" className="fill-green-800 font-semibold">HEALTHCARE SECURITY (3800-3899)</text>
                  
                  <rect x="490" y="95" width="100" height="40" fill="#c8e6c9" stroke="#1b5e20"/>
                  <text x="540" y="113" textAnchor="middle" className="text-sm font-semibold">HIPAA</text>
                  <text x="540" y="127" textAnchor="middle" className="text-sm font-semibold">(3810)</text>
                  
                  <rect x="610" y="95" width="100" height="40" fill="#c8e6c9" stroke="#1b5e20"/>
                  <text x="660" y="113" textAnchor="middle" className="text-sm font-semibold">HITECH</text>
                  <text x="660" y="127" textAnchor="middle" className="text-sm font-semibold">(3820)</text>
                  
                  <rect x="730" y="95" width="100" height="40" fill="#c8e6c9" stroke="#1b5e20"/>
                  <text x="780" y="113" textAnchor="middle" className="text-sm font-semibold">FDA 21 CFR</text>
                  <text x="780" y="127" textAnchor="middle" className="text-sm font-semibold">(3830)</text>
                  
                  <rect x="490" y="155" width="160" height="30" fill="#a5d6a7" stroke="#2e7d32"/>
                  <text x="570" y="173" textAnchor="middle" className="text-sm font-semibold">PHI Protection (3840)</text>
                  
                  <rect x="670" y="155" width="160" height="30" fill="#a5d6a7" stroke="#2e7d32"/>
                  <text x="750" y="173" textAnchor="middle" className="text-sm font-semibold">Audit Trails (3850)</text>
                  
                  <rect x="490" y="195" width="340" height="25" fill="#81c784" stroke="#1b5e20"/>
                  <text x="660" y="210" textAnchor="middle" className="text-sm font-semibold">Medical Data Security Framework (3860-3899)</text>
                  
                  {/* Unified Compliance Engine */}
                  <rect x="50" y="270" width="800" height="100" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                  <text x="450" y="295" textAnchor="middle" className="fill-orange-800 font-semibold">UNIFIED COMPLIANCE ENGINE (3900-3999)</text>
                  
                  <rect x="80" y="315" width="130" height="45" fill="#ffcc02" stroke="#e65100"/>
                  <text x="145" y="335" textAnchor="middle" className="text-sm font-semibold">Policy Engine</text>
                  <text x="145" y="348" textAnchor="middle" className="text-sm font-semibold">(3910)</text>
                  
                  <rect x="230" y="315" width="130" height="45" fill="#ffcc02" stroke="#e65100"/>
                  <text x="295" y="335" textAnchor="middle" className="text-sm font-semibold">Audit Logger</text>
                  <text x="295" y="348" textAnchor="middle" className="text-sm font-semibold">(3920)</text>
                  
                  <rect x="380" y="315" width="130" height="45" fill="#ffcc02" stroke="#e65100"/>
                  <text x="445" y="335" textAnchor="middle" className="text-sm font-semibold">Risk Manager</text>
                  <text x="445" y="348" textAnchor="middle" className="text-sm font-semibold">(3930)</text>
                  
                  <rect x="530" y="315" width="130" height="45" fill="#ffcc02" stroke="#e65100"/>
                  <text x="595" y="335" textAnchor="middle" className="text-sm font-semibold">Report Generator</text>
                  <text x="595" y="348" textAnchor="middle" className="text-sm font-semibold">(3940)</text>
                  
                  <rect x="680" y="315" width="130" height="45" fill="#ffcc02" stroke="#e65100"/>
                  <text x="745" y="335" textAnchor="middle" className="text-sm font-semibold">Cert Manager</text>
                  <text x="745" y="348" textAnchor="middle" className="text-sm font-semibold">(3950)</text>
                  
                  {/* Metrics */}
                  <rect x="50" y="390" width="800" height="80" fill="#f5f5f5" stroke="#757575"/>
                  <text x="450" y="415" textAnchor="middle" className="font-semibold">COMPLIANCE METRICS & CERTIFICATIONS</text>
                  
                  <text x="70" y="435" className="text-sm">Government: FIPS 140-2 Level 3 | FedRAMP High | Common Criteria EAL4+</text>
                  <text x="70" y="450" className="text-sm">Healthcare: HIPAA Compliant | HITECH Secure | FDA 21 CFR Part 11</text>
                  <text x="70" y="465" className="text-sm">Audit Coverage: 100% | Incident Response: &lt;5min | Compliance Score: 99.9%</text>
                  
                  {/* Flow arrows */}
                  <line x1="240" y1="230" x2="340" y2="270" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  <line x1="660" y1="230" x2="560" y2="270" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                </svg>
                <div className="mt-4 text-sm space-y-2">
                  <p><strong>Compliance Framework Components:</strong></p>
                  <p>(3700-3799) Government Security: FIPS 140-2, FedRAMP, air-gapped deployment</p>
                  <p>(3800-3899) Healthcare Security: HIPAA, HITECH, FDA compliance frameworks</p>
                  <p>(3900-3999) Unified Engine: Policy management, audit logging, certification</p>
                </div>
              </CardContent>
            </Card>

            {/* Figure 11: Database Schema & Data Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Figure 11: Database Schema & Data Flow Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 900 600" className="w-full border rounded">
                  <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">DATABASE ARCHITECTURE & DATA FLOW MANAGEMENT</text>
                  
                  {/* Core Tables Layer */}
                  <rect x="50" y="50" width="800" height="120" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                  <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">CORE DATABASE SCHEMA (4000-4099)</text>
                  
                  <rect x="80" y="95" width="120" height="60" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="140" y="115" textAnchor="middle" className="text-sm font-semibold">Users (4010)</text>
                  <text x="140" y="130" textAnchor="middle" className="text-xs">id, email, profile</text>
                  <text x="140" y="145" textAnchor="middle" className="text-xs">auth_data, created</text>
                  
                  <rect x="220" y="95" width="120" height="60" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="280" y="115" textAnchor="middle" className="text-sm font-semibold">Biometrics (4020)</text>
                  <text x="280" y="130" textAnchor="middle" className="text-xs">patterns, confidence</text>
                  <text x="280" y="145" textAnchor="middle" className="text-xs">vectors, metadata</text>
                  
                  <rect x="360" y="95" width="120" height="60" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="420" y="115" textAnchor="middle" className="text-sm font-semibold">Sessions (4030)</text>
                  <text x="420" y="130" textAnchor="middle" className="text-xs">session_id, start</text>
                  <text x="420" y="145" textAnchor="middle" className="text-xs">end, status, risk</text>
                  
                  <rect x="500" y="95" width="120" height="60" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="560" y="115" textAnchor="middle" className="text-sm font-semibold">Audit_Logs (4040)</text>
                  <text x="560" y="130" textAnchor="middle" className="text-xs">event, timestamp</text>
                  <text x="560" y="145" textAnchor="middle" className="text-xs">user, action, result</text>
                  
                  <rect x="640" y="95" width="120" height="60" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="700" y="115" textAnchor="middle" className="text-sm font-semibold">Analytics (4050)</text>
                  <text x="700" y="130" textAnchor="middle" className="text-xs">metrics, trends</text>
                  <text x="700" y="145" textAnchor="middle" className="text-xs">performance, alerts</text>
                  
                  {/* Data Processing Layer */}
                  <rect x="50" y="200" width="800" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                  <text x="450" y="225" textAnchor="middle" className="fill-purple-800 font-semibold">DATA PROCESSING PIPELINE (4100-4199)</text>
                  
                  <rect x="80" y="250" width="140" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="150" y="268" textAnchor="middle" className="text-sm font-semibold">Data Ingestion</text>
                  <text x="150" y="282" textAnchor="middle" className="text-sm font-semibold">(4110)</text>
                  
                  <rect x="240" y="250" width="140" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="310" y="268" textAnchor="middle" className="text-sm font-semibold">Validation</text>
                  <text x="310" y="282" textAnchor="middle" className="text-sm font-semibold">(4120)</text>
                  
                  <rect x="400" y="250" width="140" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="470" y="268" textAnchor="middle" className="text-sm font-semibold">Encryption</text>
                  <text x="470" y="282" textAnchor="middle" className="text-sm font-semibold">(4130)</text>
                  
                  <rect x="560" y="250" width="140" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="630" y="268" textAnchor="middle" className="text-sm font-semibold">Storage</text>
                  <text x="630" y="282" textAnchor="middle" className="text-sm font-semibold">(4140)</text>
                  
                  <rect x="720" y="250" width="100" height="40" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="770" y="268" textAnchor="middle" className="text-sm font-semibold">Indexing</text>
                  <text x="770" y="282" textAnchor="middle" className="text-sm font-semibold">(4150)</text>
                  
                  {/* Security & Access Layer */}
                  <rect x="50" y="330" width="800" height="80" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                  <text x="450" y="355" textAnchor="middle" className="fill-green-800 font-semibold">SECURITY & ACCESS CONTROL (4200-4299)</text>
                  
                  <rect x="80" y="375" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="150" y="390" textAnchor="middle" className="text-sm">RLS Policies (4210)</text>
                  
                  <rect x="240" y="375" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="310" y="390" textAnchor="middle" className="text-sm">Encryption Keys (4220)</text>
                  
                  <rect x="400" y="375" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="470" y="390" textAnchor="middle" className="text-sm">Access Logs (4230)</text>
                  
                  <rect x="560" y="375" width="140" height="25" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="630" y="390" textAnchor="middle" className="text-sm">Backup Systems (4240)</text>
                  
                  <rect x="720" y="375" width="100" height="25" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="770" y="390" textAnchor="middle" className="text-sm">Replication (4250)</text>
                  
                  {/* Performance Optimization */}
                  <rect x="50" y="440" width="800" height="120" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                  <text x="450" y="465" textAnchor="middle" className="fill-orange-800 font-semibold">PERFORMANCE OPTIMIZATION (4300-4399)</text>
                  
                  <rect x="80" y="485" width="160" height="30" fill="#ffcc02" stroke="#e65100"/>
                  <text x="160" y="502" textAnchor="middle" className="text-sm">Query Optimization (4310)</text>
                  
                  <rect x="260" y="485" width="160" height="30" fill="#ffcc02" stroke="#e65100"/>
                  <text x="340" y="502" textAnchor="middle" className="text-sm">Connection Pooling (4320)</text>
                  
                  <rect x="440" y="485" width="160" height="30" fill="#ffcc02" stroke="#e65100"/>
                  <text x="520" y="502" textAnchor="middle" className="text-sm">Caching Strategy (4330)</text>
                  
                  <rect x="620" y="485" width="160" height="30" fill="#ffcc02" stroke="#e65100"/>
                  <text x="700" y="502" textAnchor="middle" className="text-sm">Load Balancing (4340)</text>
                  
                  <rect x="170" y="525" width="200" height="25" fill="#ffb74d" stroke="#f57c00"/>
                  <text x="270" y="540" textAnchor="middle" className="text-sm">Read Replicas (4350)</text>
                  
                  <rect x="390" y="525" width="200" height="25" fill="#ffb74d" stroke="#f57c00"/>
                  <text x="490" y="540" textAnchor="middle" className="text-sm">Sharding Strategy (4360)</text>
                  
                  <rect x="610" y="525" width="200" height="25" fill="#ffb74d" stroke="#f57c00"/>
                  <text x="710" y="540" textAnchor="middle" className="text-sm">Monitoring (4370)</text>
                  
                  {/* Flow arrows */}
                  <line x1="450" y1="170" x2="450" y2="200" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="300" x2="450" y2="330" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="410" x2="450" y2="440" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                </svg>
                <div className="mt-4 text-sm space-y-2">
                  <p><strong>Database Architecture Components:</strong></p>
                  <p>(4000-4099) Core Schema: User profiles, biometric data, sessions, audit trails</p>
                  <p>(4100-4199) Data Pipeline: Ingestion, validation, encryption, storage, indexing</p>
                  <p>(4200-4299) Security Layer: RLS policies, encryption, access control, backups</p>
                  <p>(4300-4399) Performance: Query optimization, caching, load balancing, monitoring</p>
                </div>
              </CardContent>
            </Card>

            {/* Figure 12: Risk-Based Authentication Engine */}
            <Card>
              <CardHeader>
                <CardTitle>Figure 12: Risk-Based Authentication Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 900 550" className="w-full border rounded">
                  <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">ADAPTIVE RISK-BASED AUTHENTICATION SYSTEM</text>
                  
                  {/* Risk Assessment Input */}
                  <rect x="50" y="50" width="800" height="80" fill="#ffebee" stroke="#c62828" strokeWidth="2"/>
                  <text x="450" y="75" textAnchor="middle" className="fill-red-800 font-semibold">RISK FACTOR ANALYSIS (4400-4499)</text>
                  
                  <rect x="80" y="100" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                  <text x="140" y="112" textAnchor="middle" className="text-xs">Device Trust (4410)</text>
                  
                  <rect x="220" y="100" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                  <text x="280" y="112" textAnchor="middle" className="text-xs">Location Risk (4420)</text>
                  
                  <rect x="360" y="100" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                  <text x="420" y="112" textAnchor="middle" className="text-xs">Behavior Change (4430)</text>
                  
                  <rect x="500" y="100" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                  <text x="560" y="112" textAnchor="middle" className="text-xs">Time Anomaly (4440)</text>
                  
                  <rect x="640" y="100" width="120" height="20" fill="#ffcdd2" stroke="#d32f2f"/>
                  <text x="700" y="112" textAnchor="middle" className="text-xs">Network Risk (4450)</text>
                  
                  {/* Risk Calculation Engine */}
                  <rect x="50" y="160" width="800" height="100" fill="#e8eaf6" stroke="#3f51b5" strokeWidth="2"/>
                  <text x="450" y="185" textAnchor="middle" className="fill-indigo-800 font-semibold">RISK CALCULATION ENGINE (4500-4599)</text>
                  
                  <rect x="80" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                  <text x="155" y="228" textAnchor="middle" className="text-sm font-semibold">Weighted Scoring</text>
                  <text x="155" y="242" textAnchor="middle" className="text-sm font-semibold">(4510)</text>
                  
                  <rect x="250" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                  <text x="325" y="228" textAnchor="middle" className="text-sm font-semibold">ML Prediction</text>
                  <text x="325" y="242" textAnchor="middle" className="text-sm font-semibold">(4520)</text>
                  
                  <rect x="420" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                  <text x="495" y="228" textAnchor="middle" className="text-sm font-semibold">Historical Analysis</text>
                  <text x="495" y="242" textAnchor="middle" className="text-sm font-semibold">(4530)</text>
                  
                  <rect x="590" y="210" width="150" height="40" fill="#c5cae9" stroke="#303f9f"/>
                  <text x="665" y="228" textAnchor="middle" className="text-sm font-semibold">Context Evaluation</text>
                  <text x="665" y="242" textAnchor="middle" className="text-sm font-semibold">(4540)</text>
                  
                  {/* Authentication Decision Matrix */}
                  <rect x="50" y="290" width="800" height="120" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                  <text x="450" y="315" textAnchor="middle" className="fill-green-800 font-semibold">ADAPTIVE AUTHENTICATION DECISION (4600-4699)</text>
                  
                  {/* Low Risk */}
                  <rect x="80" y="340" width="140" height="60" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="150" y="360" textAnchor="middle" className="text-sm font-semibold">LOW RISK</text>
                  <text x="150" y="375" textAnchor="middle" className="text-sm font-semibold">(0-30%)</text>
                  <text x="150" y="390" textAnchor="middle" className="text-xs">→ Allow Access</text>
                  
                  {/* Medium Risk */}
                  <rect x="240" y="340" width="140" height="60" fill="#fff9c4" stroke="#f9a825"/>
                  <text x="310" y="360" textAnchor="middle" className="text-sm font-semibold">MEDIUM RISK</text>
                  <text x="310" y="375" textAnchor="middle" className="text-sm font-semibold">(31-60%)</text>
                  <text x="310" y="390" textAnchor="middle" className="text-xs">→ Step-up Auth</text>
                  
                  {/* High Risk */}
                  <rect x="400" y="340" width="140" height="60" fill="#ffccbc" stroke="#ff6f00"/>
                  <text x="470" y="360" textAnchor="middle" className="text-sm font-semibold">HIGH RISK</text>
                  <text x="470" y="375" textAnchor="middle" className="text-sm font-semibold">(61-85%)</text>
                  <text x="470" y="390" textAnchor="middle" className="text-xs">→ MFA Required</text>
                  
                  {/* Critical Risk */}
                  <rect x="560" y="340" width="140" height="60" fill="#ffcdd2" stroke="#d32f2f"/>
                  <text x="630" y="360" textAnchor="middle" className="text-sm font-semibold">CRITICAL RISK</text>
                  <text x="630" y="375" textAnchor="middle" className="text-sm font-semibold">(86-100%)</text>
                  <text x="630" y="390" textAnchor="middle" className="text-xs">→ Block Access</text>
                  
                  {/* Adaptive Learning */}
                  <rect x="720" y="340" width="100" height="60" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="770" y="360" textAnchor="middle" className="text-sm font-semibold">LEARNING</text>
                  <text x="770" y="375" textAnchor="middle" className="text-sm font-semibold">ENGINE</text>
                  <text x="770" y="390" textAnchor="middle" className="text-xs">Adapt Thresholds</text>
                  
                  {/* Response Actions */}
                  <rect x="50" y="430" width="800" height="90" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                  <text x="450" y="455" textAnchor="middle" className="fill-purple-800 font-semibold">RESPONSE ACTIONS & MONITORING (4700-4799)</text>
                  
                  <rect x="80" y="470" width="120" height="20" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="140" y="482" textAnchor="middle" className="text-xs">Silent Monitoring (4710)</text>
                  
                  <rect x="220" y="470" width="120" height="20" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="280" y="482" textAnchor="middle" className="text-xs">Email Verification (4720)</text>
                  
                  <rect x="360" y="470" width="120" height="20" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="420" y="482" textAnchor="middle" className="text-xs">SMS Challenge (4730)</text>
                  
                  <rect x="500" y="470" width="120" height="20" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="560" y="482" textAnchor="middle" className="text-xs">Admin Alert (4740)</text>
                  
                  <rect x="640" y="470" width="120" height="20" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="700" y="482" textAnchor="middle" className="text-xs">Forensic Log (4750)</text>
                  
                  <rect x="200" y="500" width="200" height="15" fill="#d1c4e9" stroke="#512da8"/>
                  <text x="300" y="510" textAnchor="middle" className="text-xs">Session Risk Tracking (4760)</text>
                  
                  <rect x="420" y="500" width="200" height="15" fill="#d1c4e9" stroke="#512da8"/>
                  <text x="520" y="510" textAnchor="middle" className="text-xs">Behavioral Baseline Update (4770)</text>
                  
                  {/* Flow arrows */}
                  <line x1="450" y1="130" x2="450" y2="160" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="260" x2="450" y2="290" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="410" x2="450" y2="430" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                </svg>
                <div className="mt-4 text-sm space-y-2">
                  <p><strong>Risk-Based Authentication Components:</strong></p>
                  <p>(4400-4499) Risk Factors: Device, location, behavior, time, network analysis</p>
                  <p>(4500-4599) Calculation Engine: Weighted scoring, ML prediction, historical analysis</p>
                  <p>(4600-4699) Decision Matrix: Risk-based authentication requirements</p>
                  <p>(4700-4799) Response Actions: Monitoring, challenges, alerts, forensic logging</p>
                </div>
              </CardContent>
            </Card>

            {/* Figure 13: Cross-Platform Deployment */}
            <Card>
              <CardHeader>
                <CardTitle>Figure 13: Cross-Platform Deployment Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 900 500" className="w-full border rounded">
                  <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">UNIVERSAL CROSS-PLATFORM DEPLOYMENT</text>
                  
                  {/* Platform Layer */}
                  <rect x="50" y="50" width="800" height="100" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                  <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">TARGET PLATFORMS (4800-4899)</text>
                  
                  <rect x="80" y="95" width="100" height="45" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="130" y="115" textAnchor="middle" className="text-sm font-semibold">Web Apps</text>
                  <text x="130" y="130" textAnchor="middle" className="text-sm font-semibold">(4810)</text>
                  
                  <rect x="200" y="95" width="100" height="45" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="250" y="115" textAnchor="middle" className="text-sm font-semibold">Mobile</text>
                  <text x="250" y="130" textAnchor="middle" className="text-sm font-semibold">(4820)</text>
                  
                  <rect x="320" y="95" width="100" height="45" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="370" y="115" textAnchor="middle" className="text-sm font-semibold">Desktop</text>
                  <text x="370" y="130" textAnchor="middle" className="text-sm font-semibold">(4830)</text>
                  
                  <rect x="440" y="95" width="100" height="45" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="490" y="115" textAnchor="middle" className="text-sm font-semibold">Kiosks</text>
                  <text x="490" y="130" textAnchor="middle" className="text-sm font-semibold">(4840)</text>
                  
                  <rect x="560" y="95" width="100" height="45" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="610" y="115" textAnchor="middle" className="text-sm font-semibold">IoT Devices</text>
                  <text x="610" y="130" textAnchor="middle" className="text-sm font-semibold">(4850)</text>
                  
                  <rect x="680" y="95" width="100" height="45" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="730" y="115" textAnchor="middle" className="text-sm font-semibold">Embedded</text>
                  <text x="730" y="130" textAnchor="middle" className="text-sm font-semibold">(4860)</text>
                  
                  {/* Deployment Layer */}
                  <rect x="50" y="180" width="800" height="100" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                  <text x="450" y="205" textAnchor="middle" className="fill-purple-800 font-semibold">DEPLOYMENT STRATEGIES (4900-4999)</text>
                  
                  <rect x="80" y="225" width="140" height="45" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="150" y="245" textAnchor="middle" className="text-sm font-semibold">Cloud Native</text>
                  <text x="150" y="260" textAnchor="middle" className="text-sm font-semibold">(4910)</text>
                  
                  <rect x="240" y="225" width="140" height="45" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="310" y="245" textAnchor="middle" className="text-sm font-semibold">On-Premises</text>
                  <text x="310" y="260" textAnchor="middle" className="text-sm font-semibold">(4920)</text>
                  
                  <rect x="400" y="225" width="140" height="45" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="470" y="245" textAnchor="middle" className="text-sm font-semibold">Hybrid Cloud</text>
                  <text x="470" y="260" textAnchor="middle" className="text-sm font-semibold">(4930)</text>
                  
                  <rect x="560" y="225" width="140" height="45" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="630" y="245" textAnchor="middle" className="text-sm font-semibold">Edge Computing</text>
                  <text x="630" y="260" textAnchor="middle" className="text-sm font-semibold">(4940)</text>
                  
                  <rect x="720" y="225" width="100" height="45" fill="#e1bee7" stroke="#8e24aa"/>
                  <text x="770" y="245" textAnchor="middle" className="text-sm font-semibold">Air-Gapped</text>
                  <text x="770" y="260" textAnchor="middle" className="text-sm font-semibold">(4950)</text>
                  
                  {/* Integration Layer */}
                  <rect x="50" y="310" width="800" height="100" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                  <text x="450" y="335" textAnchor="middle" className="fill-green-800 font-semibold">INTEGRATION FRAMEWORK (5000-5099)</text>
                  
                  <rect x="80" y="355" width="120" height="45" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="140" y="375" textAnchor="middle" className="text-sm font-semibold">REST APIs</text>
                  <text x="140" y="390" textAnchor="middle" className="text-sm font-semibold">(5010)</text>
                  
                  <rect x="220" y="355" width="120" height="45" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="280" y="375" textAnchor="middle" className="text-sm font-semibold">GraphQL</text>
                  <text x="280" y="390" textAnchor="middle" className="text-sm font-semibold">(5020)</text>
                  
                  <rect x="360" y="355" width="120" height="45" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="420" y="375" textAnchor="middle" className="text-sm font-semibold">WebSockets</text>
                  <text x="420" y="390" textAnchor="middle" className="text-sm font-semibold">(5030)</text>
                  
                  <rect x="500" y="355" width="120" height="45" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="560" y="375" textAnchor="middle" className="text-sm font-semibold">SDKs</text>
                  <text x="560" y="390" textAnchor="middle" className="text-sm font-semibold">(5040)</text>
                  
                  <rect x="640" y="355" width="120" height="45" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="700" y="375" textAnchor="middle" className="text-sm font-semibold">Webhooks</text>
                  <text x="700" y="390" textAnchor="middle" className="text-sm font-semibold">(5050)</text>
                  
                  <rect x="780" y="355" width="60" height="45" fill="#c8e6c9" stroke="#43a047"/>
                  <text x="810" y="375" textAnchor="middle" className="text-sm font-semibold">Events</text>
                  <text x="810" y="390" textAnchor="middle" className="text-sm font-semibold">(5060)</text>
                  
                  {/* Monitoring & Management */}
                  <rect x="50" y="430" width="800" height="50" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                  <text x="450" y="450" textAnchor="middle" className="fill-orange-800 font-semibold">CENTRALIZED MANAGEMENT (5100-5199)</text>
                  
                  <rect x="80" y="460" width="120" height="15" fill="#ffcc02" stroke="#e65100"/>
                  <text x="140" y="470" textAnchor="middle" className="text-xs">Health Monitoring (5110)</text>
                  
                  <rect x="220" y="460" width="120" height="15" fill="#ffcc02" stroke="#e65100"/>
                  <text x="280" y="470" textAnchor="middle" className="text-xs">Config Management (5120)</text>
                  
                  <rect x="360" y="460" width="120" height="15" fill="#ffcc02" stroke="#e65100"/>
                  <text x="420" y="470" textAnchor="middle" className="text-xs">Auto Scaling (5130)</text>
                  
                  <rect x="500" y="460" width="120" height="15" fill="#ffcc02" stroke="#e65100"/>
                  <text x="560" y="470" textAnchor="middle" className="text-xs">Update Management (5140)</text>
                  
                  <rect x="640" y="460" width="120" height="15" fill="#ffcc02" stroke="#e65100"/>
                  <text x="700" y="470" textAnchor="middle" className="text-xs">Analytics Dashboard (5150)</text>
                  
                  {/* Flow arrows */}
                  <line x1="450" y1="150" x2="450" y2="180" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="280" x2="450" y2="310" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="410" x2="450" y2="430" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                </svg>
                <div className="mt-4 text-sm space-y-2">
                  <p><strong>Cross-Platform Deployment Components:</strong></p>
                  <p>(4800-4899) Target Platforms: Web, mobile, desktop, kiosks, IoT, embedded systems</p>
                  <p>(4900-4999) Deployment Strategies: Cloud, on-premises, hybrid, edge, air-gapped</p>
                  <p>(5000-5099) Integration Framework: APIs, SDKs, webhooks, real-time communication</p>
                  <p>(5100-5199) Management: Health monitoring, configuration, scaling, updates</p>
                </div>
              </CardContent>
            </Card>

            {/* Figures 14-16 Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Figures 14-16: Advanced Implementation Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Figure 14: Advanced Threat Detection</h4>
                    <p className="text-xs space-y-1">
                      • AI-powered threat identification (5200-5299)<br/>
                      • Behavioral anomaly detection algorithms<br/>
                      • Real-time attack pattern recognition<br/>
                      • Automated incident response workflows<br/>
                      • Threat intelligence integration<br/>
                      • Advanced persistent threat (APT) detection
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Figure 15: Performance Optimization</h4>
                    <p className="text-xs space-y-1">
                      • Latency optimization techniques (5300-5399)<br/>
                      • Distributed processing architecture<br/>
                      • Edge computing implementation<br/>
                      • Memory management strategies<br/>
                      • Network optimization protocols<br/>
                      • Resource allocation algorithms
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Figure 16: Integration Test Framework</h4>
                    <p className="text-xs space-y-1">
                      • Automated testing pipelines (5400-5499)<br/>
                      • Biometric simulation environments<br/>
                      • Load testing and stress analysis<br/>
                      • Security penetration testing<br/>
                      • Compliance validation suites<br/>
                      • Continuous integration workflows
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-center mb-2">Complete Patent Coverage Summary</h4>
                  <p className="text-center text-sm text-muted-foreground">
                    This comprehensive 16-figure patent portfolio covers all aspects of the novel multi-modal 
                    continuous biometric authentication system, providing complete intellectual property protection 
                    across system architecture, security frameworks, compliance engines, deployment strategies, 
                    and performance optimization techniques. The detailed technical drawings demonstrate 
                    the innovative approaches to biometric authentication, risk-based security, quantum-resistant 
                    cryptography, and enterprise-grade compliance across all target industries and deployment environments.
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Figure 8: PWA Architecture */}
            <Card>
              <CardHeader>
                <CardTitle>Figure 8: Progressive Web Application (PWA) Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 900 400" className="w-full border rounded">
                  <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">PWA BIOMETRIC AUTHENTICATION ARCHITECTURE</text>
                  
                  <rect x="50" y="50" width="800" height="80" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                  <text x="450" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">SERVICE WORKER LAYER (3100-3199)</text>
                  
                  <rect x="80" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="140" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Background Sync (3110)</text>
                  
                  <rect x="220" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="280" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Offline Storage (3120)</text>
                  
                  <rect x="360" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="420" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Cache Strategy (3130)</text>
                  
                  <rect x="500" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="560" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Push Notifications (3140)</text>
                  
                  <rect x="640" y="100" width="120" height="20" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="700" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Auto Updates (3150)</text>

                  <rect x="50" y="160" width="800" height="80" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                  <text x="450" y="185" textAnchor="middle" className="fill-purple-800 font-semibold">OFFLINE PROCESSING (3200-3299)</text>
                  
                  <rect x="100" y="210" width="120" height="20" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="160" y="223" textAnchor="middle" className="fill-purple-900 text-sm">Local ML Models (3210)</text>
                  
                  <rect x="240" y="210" width="120" height="20" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="300" y="223" textAnchor="middle" className="fill-purple-900 text-sm">Edge Processing (3220)</text>
                  
                  <rect x="380" y="210" width="120" height="20" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="440" y="223" textAnchor="middle" className="fill-purple-900 text-sm">Queue Management (3230)</text>
                  
                  <rect x="520" y="210" width="120" height="20" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="580" y="223" textAnchor="middle" className="fill-purple-900 text-sm">Sync Resolution (3240)</text>
                  
                  <rect x="660" y="210" width="120" height="20" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="720" y="223" textAnchor="middle" className="fill-purple-900 text-sm">Conflict Handling (3250)</text>

                  <rect x="50" y="270" width="800" height="80" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                  <text x="450" y="295" textAnchor="middle" className="fill-green-800 font-semibold">CROSS-PLATFORM DEPLOYMENT (3300-3399)</text>
                  
                  <rect x="100" y="320" width="120" height="20" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="160" y="333" textAnchor="middle" className="fill-green-900 text-sm">Mobile Web (3310)</text>
                  
                  <rect x="240" y="320" width="120" height="20" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="300" y="333" textAnchor="middle" className="fill-green-900 text-sm">Desktop App (3320)</text>
                  
                  <rect x="380" y="320" width="120" height="20" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="440" y="333" textAnchor="middle" className="fill-green-900 text-sm">Tablet Optimized (3330)</text>
                  
                  <rect x="520" y="320" width="120" height="20" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="580" y="333" textAnchor="middle" className="fill-green-900 text-sm">Kiosk Mode (3340)</text>
                  
                  <rect x="660" y="320" width="120" height="20" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="720" y="333" textAnchor="middle" className="fill-green-900 text-sm">IoT Integration (3350)</text>

                  <line x1="450" y1="130" x2="450" y2="160" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="240" x2="450" y2="270" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                </svg>
                <div className="mt-4 text-sm space-y-2">
                  <p><strong>PWA Components:</strong></p>
                  <p>(3100-3150) Service Worker: Background sync, offline storage, caching strategy</p>
                  <p>(3200-3250) Offline Processing: Local ML models, edge processing, queue management</p>
                  <p>(3300-3350) Cross-Platform: Mobile, desktop, tablet, kiosk, IoT deployment</p>
                </div>
              </CardContent>
            </Card>

            {/* Figure 9: Continuous Session Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Figure 9: Continuous Session Monitoring System</CardTitle>
              </CardHeader>
              <CardContent>
                <svg viewBox="0 0 900 350" className="w-full border rounded">
                  <text x="450" y="25" textAnchor="middle" className="text-lg font-bold">REAL-TIME SESSION MONITORING ARCHITECTURE</text>
                  
                  <rect x="50" y="50" width="800" height="60" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                  <text x="450" y="70" textAnchor="middle" className="fill-blue-800 font-semibold">BEHAVIORAL TRACKING (3400-3499)</text>
                  
                  <rect x="80" y="85" width="100" height="15" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="130" y="95" textAnchor="middle" className="fill-blue-900 text-xs">Mouse Tracking (3410)</text>
                  
                  <rect x="200" y="85" width="100" height="15" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="250" y="95" textAnchor="middle" className="fill-blue-900 text-xs">Scroll Patterns (3420)</text>
                  
                  <rect x="320" y="85" width="100" height="15" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="370" y="95" textAnchor="middle" className="fill-blue-900 text-xs">Click Analysis (3430)</text>
                  
                  <rect x="440" y="85" width="100" height="15" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="490" y="95" textAnchor="middle" className="fill-blue-900 text-xs">Idle Detection (3440)</text>
                  
                  <rect x="560" y="85" width="100" height="15" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="610" y="95" textAnchor="middle" className="fill-blue-900 text-xs">Focus Tracking (3450)</text>
                  
                  <rect x="680" y="85" width="100" height="15" fill="#bbdefb" stroke="#1565c0"/>
                  <text x="730" y="95" textAnchor="middle" className="fill-blue-900 text-xs">Session Context (3460)</text>

                  <rect x="50" y="140" width="800" height="60" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                  <text x="450" y="160" textAnchor="middle" className="fill-purple-800 font-semibold">ANOMALY DETECTION (3500-3599)</text>
                  
                  <rect x="100" y="175" width="120" height="15" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="160" y="185" textAnchor="middle" className="fill-purple-900 text-xs">Pattern Deviation (3510)</text>
                  
                  <rect x="240" y="175" width="120" height="15" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="300" y="185" textAnchor="middle" className="fill-purple-900 text-xs">Speed Changes (3520)</text>
                  
                  <rect x="380" y="175" width="120" height="15" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="440" y="185" textAnchor="middle" className="fill-purple-900 text-xs">Behavior Shifts (3530)</text>
                  
                  <rect x="520" y="175" width="120" height="15" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="580" y="185" textAnchor="middle" className="fill-purple-900 text-xs">Trust Degradation (3540)</text>
                  
                  <rect x="660" y="175" width="120" height="15" fill="#e1bee7" stroke="#6a1b9a"/>
                  <text x="720" y="185" textAnchor="middle" className="fill-purple-900 text-xs">Risk Escalation (3550)</text>

                  <rect x="50" y="230" width="800" height="80" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                  <text x="450" y="250" textAnchor="middle" className="fill-green-800 font-semibold">ADAPTIVE RESPONSE SYSTEM (3600-3699)</text>
                  
                  <rect x="80" y="270" width="100" height="30" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="130" y="288" textAnchor="middle" className="fill-green-900 text-sm">Re-auth (3610)</text>
                  
                  <rect x="200" y="270" width="100" height="30" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="250" y="288" textAnchor="middle" className="fill-green-900 text-sm">Step-up Auth (3620)</text>
                  
                  <rect x="320" y="270" width="100" height="30" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="370" y="288" textAnchor="middle" className="fill-green-900 text-sm">Session Lock (3630)</text>
                  
                  <rect x="440" y="270" width="100" height="30" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="490" y="288" textAnchor="middle" className="fill-green-900 text-sm">Privilege Drop (3640)</text>
                  
                  <rect x="560" y="270" width="100" height="30" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="610" y="288" textAnchor="middle" className="fill-green-900 text-sm">Alert Admin (3650)</text>
                  
                  <rect x="680" y="270" width="100" height="30" fill="#c8e6c9" stroke="#2e7d32"/>
                  <text x="730" y="288" textAnchor="middle" className="fill-green-900 text-sm">Forensic Log (3660)</text>

                  <line x1="450" y1="110" x2="450" y2="140" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <line x1="450" y1="200" x2="450" y2="230" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                </svg>
                <div className="mt-4 text-sm space-y-2">
                  <p><strong>Session Monitoring Components:</strong></p>
                  <p>(3400-3460) Behavioral Tracking: Mouse, scroll, click, idle, focus patterns</p>
                  <p>(3500-3550) Anomaly Detection: Pattern deviation, speed changes, trust degradation</p>
                  <p>(3600-3660) Adaptive Response: Re-authentication, session control, privilege management</p>
                </div>
              </CardContent>
            </Card>

            {/* Complete Patent Drawing Portfolio Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Patent Drawing Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Core System Drawings (1-7):</h4>
                    <p>• Figure 1: Enhanced Multi-Modal System Architecture</p>
                    <p>• Figure 2: Multi-Modal Biometric Fusion Engine</p>
                    <p>• Figure 3: Industry-Specific Compliance Engine</p>
                    <p>• Figure 4: Enterprise Integration Platform</p>
                    <p>• Figure 5: Legal-Grade Audit System</p>
                    <p>• Figure 6: Predictive Analytics Engine</p>
                    <p>• Figure 7: Quantum-Resistant Security Architecture</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Implementation Drawings (8-16):</h4>
                    <p>• Figure 8: PWA Architecture & Offline Processing</p>
                    <p>• Figure 9: Continuous Session Monitoring</p>
                    <p>• Figure 10: Government & Healthcare Security</p>
                    <p>• Figure 11: Database Schema & Data Flow</p>
                    <p>• Figure 12: Risk-Based Authentication Engine</p>
                    <p>• Figure 13: Cross-Platform Deployment</p>
                    <p>• Figure 14: Advanced Threat Detection</p>
                    <p>• Figure 15: Performance Optimization</p>
                    <p>• Figure 16: Integration Test Framework</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-center">Patent Protection Scope</p>
                  <p className="text-center text-muted-foreground mt-2">
                    This comprehensive 16-drawing patent portfolio provides complete intellectual property protection 
                    for the novel multi-modal continuous biometric authentication system with enterprise compliance, 
                    legal-grade audit trails, and quantum-resistant security across all deployment environments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatentDrawings;

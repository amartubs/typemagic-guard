import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PatentDrawings: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Patent Technical Drawings</h1>
        <p className="text-lg text-muted-foreground">
          Advanced Keystroke Dynamics Authentication System with Continuous Learning and Fraud Detection
        </p>
      </div>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="process">Process Flow</TabsTrigger>
          <TabsTrigger value="timing">Timing Analysis</TabsTrigger>
          <TabsTrigger value="security">Security Framework</TabsTrigger>
          <TabsTrigger value="learning">ML Engine</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture">
          <Card>
            <CardHeader>
              <CardTitle>Figure 1: System Architecture Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 600" className="w-full border rounded">
                {/* Client Layer */}
                <rect x="50" y="50" width="700" height="100" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2"/>
                <text x="400" y="75" textAnchor="middle" className="fill-blue-800 font-semibold">CLIENT LAYER</text>
                
                {/* Keystroke Capture */}
                <rect x="70" y="90" width="150" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="145" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Keystroke Capture (10)</text>
                
                {/* Real-time Processing */}
                <rect x="240" y="90" width="150" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="315" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Real-time Processing (11)</text>
                
                {/* Encryption Module */}
                <rect x="410" y="90" width="150" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="485" y="113" textAnchor="middle" className="fill-blue-900 text-sm">Encryption Module (12)</text>
                
                {/* UI Components */}
                <rect x="580" y="90" width="150" height="40" fill="#bbdefb" stroke="#1565c0"/>
                <text x="655" y="113" textAnchor="middle" className="fill-blue-900 text-sm">UI Components (13)</text>

                {/* Processing Layer */}
                <rect x="50" y="200" width="700" height="120" fill="#f3e5f5" stroke="#7b1fa2" strokeWidth="2"/>
                <text x="400" y="225" textAnchor="middle" className="fill-purple-800 font-semibold">PROCESSING LAYER</text>
                
                {/* Biometric Processor */}
                <rect x="70" y="250" width="160" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="150" y="278" textAnchor="middle" className="fill-purple-900 text-sm">Biometric Processor (20)</text>
                
                {/* Pattern Analyzer */}
                <rect x="250" y="250" width="160" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="330" y="278" textAnchor="middle" className="fill-purple-900 text-sm">Pattern Analyzer (21)</text>
                
                {/* Fraud Detection */}
                <rect x="430" y="250" width="160" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="510" y="278" textAnchor="middle" className="fill-purple-900 text-sm">Fraud Detection (22)</text>
                
                {/* Confidence Calculator */}
                <rect x="610" y="250" width="120" height="50" fill="#e1bee7" stroke="#6a1b9a"/>
                <text x="670" y="278" textAnchor="middle" className="fill-purple-900 text-sm">Confidence Calc (23)</text>

                {/* Learning Layer */}
                <rect x="50" y="370" width="700" height="100" fill="#e8f5e8" stroke="#388e3c" strokeWidth="2"/>
                <text x="400" y="395" textAnchor="middle" className="fill-green-800 font-semibold">CONTINUOUS LEARNING LAYER</text>
                
                {/* Learning Engine */}
                <rect x="100" y="420" width="200" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="200" y="443" textAnchor="middle" className="fill-green-900 text-sm">Learning Engine (30)</text>
                
                {/* Pattern Pruner */}
                <rect x="320" y="420" width="160" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="400" y="443" textAnchor="middle" className="fill-green-900 text-sm">Pattern Pruner (31)</text>
                
                {/* Database Manager */}
                <rect x="500" y="420" width="180" height="40" fill="#c8e6c9" stroke="#2e7d32"/>
                <text x="590" y="443" textAnchor="middle" className="fill-green-900 text-sm">Database Manager (32)</text>

                {/* Storage Layer */}
                <rect x="50" y="520" width="700" height="60" fill="#fff3e0" stroke="#f57c00" strokeWidth="2"/>
                <text x="400" y="545" textAnchor="middle" className="fill-orange-800 font-semibold">SECURE STORAGE LAYER</text>
                
                {/* Encrypted Database */}
                <rect x="150" y="555" width="200" height="20" fill="#ffcc02" stroke="#e65100"/>
                <text x="250" y="568" textAnchor="middle" className="fill-orange-900 text-xs">Encrypted Biometric DB (40)</text>
                
                {/* Audit Logs */}
                <rect x="370" y="555" width="150" height="20" fill="#ffcc02" stroke="#e65100"/>
                <text x="445" y="568" textAnchor="middle" className="fill-orange-900 text-xs">Audit Logs (41)</text>
                
                {/* Session Store */}
                <rect x="540" y="555" width="130" height="20" fill="#ffcc02" stroke="#e65100"/>
                <text x="605" y="568" textAnchor="middle" className="fill-orange-900 text-xs">Session Store (42)</text>

                {/* Data Flow Arrows */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
                  </marker>
                </defs>
                
                {/* Vertical arrows */}
                <line x1="145" y1="150" x2="145" y2="200" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="315" y1="150" x2="315" y2="200" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="485" y1="150" x2="485" y2="200" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="400" y1="320" x2="400" y2="370" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="400" y1="470" x2="400" y2="520" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Key Components:</strong></p>
                <p>(10) Keystroke Capture: Real-time keyboard event monitoring with μs precision</p>
                <p>(20) Biometric Processor: Statistical analysis engine for pattern recognition</p>
                <p>(30) Learning Engine: Adaptive algorithms for profile evolution</p>
                <p>(40) Encrypted Storage: AES-256 encrypted biometric data repository</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Figure 2: Authentication Process Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 700" className="w-full border rounded">
                {/* Start */}
                <ellipse cx="100" cy="50" rx="60" ry="25" fill="#4caf50" stroke="#2e7d32"/>
                <text x="100" y="57" textAnchor="middle" className="fill-white font-semibold">START (100)</text>
                
                {/* Keystroke Input */}
                <rect x="50" y="100" width="100" height="40" fill="#2196f3" stroke="#1565c0"/>
                <text x="100" y="123" textAnchor="middle" className="fill-white text-sm">Keystroke Input (101)</text>
                
                {/* Timing Capture */}
                <rect x="200" y="100" width="120" height="40" fill="#2196f3" stroke="#1565c0"/>
                <text x="260" y="123" textAnchor="middle" className="fill-white text-sm">Timing Capture (102)</text>
                
                {/* Pattern Creation */}
                <rect x="370" y="100" width="120" height="40" fill="#2196f3" stroke="#1565c0"/>
                <text x="430" y="123" textAnchor="middle" className="fill-white text-sm">Pattern Creation (103)</text>
                
                {/* Decision: Profile Exists? */}
                <polygon points="430,180 480,200 430,220 380,200" fill="#ff9800" stroke="#ef6c00"/>
                <text x="430" y="205" textAnchor="middle" className="fill-white text-xs">Profile Exists? (104)</text>
                
                {/* New Profile Branch */}
                <rect x="200" y="260" width="120" height="40" fill="#9c27b0" stroke="#6a1b9a"/>
                <text x="260" y="283" textAnchor="middle" className="fill-white text-sm">Create Profile (105)</text>
                
                {/* Existing Profile Branch */}
                <rect x="520" y="260" width="120" height="40" fill="#9c27b0" stroke="#6a1b9a"/>
                <text x="580" y="283" textAnchor="middle" className="fill-white text-sm">Load Profile (106)</text>
                
                {/* Pattern Analysis */}
                <rect x="350" y="340" width="160" height="40" fill="#ff5722" stroke="#d84315"/>
                <text x="430" y="363" textAnchor="middle" className="fill-white text-sm">Pattern Analysis (107)</text>
                
                {/* Fraud Detection */}
                <rect x="350" y="410" width="160" height="40" fill="#ff5722" stroke="#d84315"/>
                <text x="430" y="433" textAnchor="middle" className="fill-white text-sm">Fraud Detection (108)</text>
                
                {/* Confidence Calculation */}
                <rect x="350" y="480" width="160" height="40" fill="#ff5722" stroke="#d84315"/>
                <text x="430" y="503" textAnchor="middle" className="fill-white text-sm">Confidence Calc (109)</text>
                
                {/* Decision: Pass Threshold? */}
                <polygon points="430,560 480,580 430,600 380,580" fill="#ff9800" stroke="#ef6c00"/>
                <text x="430" y="585" textAnchor="middle" className="fill-white text-xs">Pass Threshold? (110)</text>
                
                {/* Success */}
                <ellipse cx="600" cy="580" rx="60" ry="25" fill="#4caf50" stroke="#2e7d32"/>
                <text x="600" y="587" textAnchor="middle" className="fill-white font-semibold">SUCCESS (111)</text>
                
                {/* Failure */}
                <ellipse cx="260" cy="580" rx="60" ry="25" fill="#f44336" stroke="#c62828"/>
                <text x="260" y="587" textAnchor="middle" className="fill-white font-semibold">FAILURE (112)</text>
                
                {/* Learning Update */}
                <rect x="550" y="480" width="100" height="40" fill="#607d8b" stroke="#37474f"/>
                <text x="600" y="503" textAnchor="middle" className="fill-white text-sm">Update Learning (113)</text>

                {/* Flow Arrows */}
                <line x1="100" y1="75" x2="100" y2="100" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="150" y1="120" x2="200" y2="120" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="320" y1="120" x2="370" y2="120" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="430" y1="140" x2="430" y2="180" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Yes/No branches */}
                <line x1="380" y1="200" x2="260" y2="260" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <text x="300" y="225" className="fill-red-600 font-semibold text-sm">NO</text>
                
                <line x1="480" y1="200" x2="580" y2="260" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <text x="540" y="225" className="fill-green-600 font-semibold text-sm">YES</text>
                
                {/* Convergence */}
                <line x1="260" y1="300" x2="430" y2="340" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="580" y1="300" x2="430" y2="340" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Vertical flow */}
                <line x1="430" y1="380" x2="430" y2="410" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="430" y1="450" x2="430" y2="480" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <line x1="430" y1="520" x2="430" y2="560" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                
                {/* Final branches */}
                <line x1="380" y1="580" x2="320" y2="580" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <text x="340" y="575" className="fill-red-600 font-semibold text-sm">NO</text>
                
                <line x1="480" y1="580" x2="540" y2="580" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                <text x="510" y="575" className="fill-green-600 font-semibold text-sm">YES</text>
                
                {/* Learning update */}
                <line x1="510" y1="500" x2="550" y2="500" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Process Steps:</strong></p>
                <p>(101-103) Data Capture: Keystroke timing collection and pattern formation</p>
                <p>(104-106) Profile Management: User profile creation or retrieval</p>
                <p>(107-109) Analysis Pipeline: Pattern matching and confidence scoring</p>
                <p>(110-113) Decision & Learning: Authentication result and adaptive learning</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing">
          <Card>
            <CardHeader>
              <CardTitle>Figure 3: Keystroke Timing Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 800 500" className="w-full border rounded">
                {/* Timeline */}
                <line x1="50" y1="400" x2="750" y2="400" stroke="#333" strokeWidth="2"/>
                
                {/* Time markers */}
                <text x="50" y="420" textAnchor="middle" className="text-xs">t0</text>
                <text x="150" y="420" textAnchor="middle" className="text-xs">t1</text>
                <text x="250" y="420" textAnchor="middle" className="text-xs">t2</text>
                <text x="350" y="420" textAnchor="middle" className="text-xs">t3</text>
                <text x="450" y="420" textAnchor="middle" className="text-xs">t4</text>
                <text x="550" y="420" textAnchor="middle" className="text-xs">t5</text>
                <text x="650" y="420" textAnchor="middle" className="text-xs">t6</text>
                
                {/* Key presses */}
                <rect x="75" y="300" width="50" height="100" fill="#4caf50" stroke="#2e7d32"/>
                <text x="100" y="350" textAnchor="middle" className="fill-white font-bold">T</text>
                
                <rect x="175" y="280" width="50" height="120" fill="#2196f3" stroke="#1565c0"/>
                <text x="200" y="340" textAnchor="middle" className="fill-white font-bold">H</text>
                
                <rect x="275" y="320" width="50" height="80" fill="#ff9800" stroke="#ef6c00"/>
                <text x="300" y="365" textAnchor="middle" className="fill-white font-bold">E</text>
                
                <rect x="375" y="290" width="50" height="110" fill="#9c27b0" stroke="#6a1b9a"/>
                <text x="400" y="350" textAnchor="middle" className="fill-white font-bold">space</text>
                
                <rect x="475" y="310" width="50" height="90" fill="#f44336" stroke="#c62828"/>
                <text x="500" y="360" textAnchor="middle" className="fill-white font-bold">Q</text>
                
                <rect x="575" y="270" width="50" height="130" fill="#607d8b" stroke="#37474f"/>
                <text x="600" y="340" textAnchor="middle" className="fill-white font-bold">U</text>
                
                {/* Dwell time annotations */}
                <path d="M 75 250 L 125 250" stroke="#e91e63" strokeWidth="2"/>
                <path d="M 75 245 L 75 255" stroke="#e91e63" strokeWidth="2"/>
                <path d="M 125 245 L 125 255" stroke="#e91e63" strokeWidth="2"/>
                <text x="100" y="240" textAnchor="middle" className="text-sm fill-pink-600">Dwell Time (200)</text>
                
                <path d="M 175 230 L 225 230" stroke="#e91e63" strokeWidth="2"/>
                <path d="M 175 225 L 175 235" stroke="#e91e63" strokeWidth="2"/>
                <path d="M 225 225 L 225 235" stroke="#e91e63" strokeWidth="2"/>
                <text x="200" y="220" textAnchor="middle" className="text-sm fill-pink-600">DT₂ (201)</text>
                
                {/* Flight time annotations */}
                <path d="M 125 450 L 175 450" stroke="#3f51b5" strokeWidth="2"/>
                <path d="M 125 445 L 125 455" stroke="#3f51b5" strokeWidth="2"/>
                <path d="M 175 445 L 175 455" stroke="#3f51b5" strokeWidth="2"/>
                <text x="150" y="470" textAnchor="middle" className="text-sm fill-indigo-600">Flight Time (202)</text>
                
                <path d="M 225 450 L 275 450" stroke="#3f51b5" strokeWidth="2"/>
                <path d="M 225 445 L 225 455" stroke="#3f51b5" strokeWidth="2"/>
                <path d="M 275 445 L 275 455" stroke="#3f51b5" strokeWidth="2"/>
                <text x="250" y="470" textAnchor="middle" className="text-sm fill-indigo-600">FT₂ (203)</text>
                
                {/* Measurement labels */}
                <text x="400" y="50" textAnchor="middle" className="text-lg font-bold">KEYSTROKE TIMING MEASUREMENTS</text>
                
                {/* Legend */}
                <rect x="50" y="80" width="200" height="120" fill="none" stroke="#666" strokeDasharray="5,5"/>
                <text x="150" y="100" textAnchor="middle" className="font-semibold">LEGEND</text>
                
                <rect x="60" y="110" width="15" height="15" fill="#e91e63"/>
                <text x="80" y="122" className="text-sm">Dwell Time (key hold duration)</text>
                
                <rect x="60" y="130" width="15" height="15" fill="#3f51b5"/>
                <text x="80" y="142" className="text-sm">Flight Time (inter-key interval)</text>
                
                <rect x="60" y="150" width="15" height="15" fill="#4caf50"/>
                <text x="80" y="162" className="text-sm">Key Press Event</text>
                
                <rect x="60" y="170" width="15" height="15" fill="#ff5722"/>
                <text x="80" y="182" className="text-sm">Key Release Event</text>
                
                {/* Formulas */}
                <rect x="500" y="80" width="250" height="160" fill="none" stroke="#666" strokeDasharray="5,5"/>
                <text x="625" y="100" textAnchor="middle" className="font-semibold">TIMING CALCULATIONS</text>
                
                <text x="510" y="120" className="text-sm">Dwell Time = t_release - t_press</text>
                <text x="510" y="140" className="text-sm">Flight Time = t_press(n+1) - t_release(n)</text>
                <text x="510" y="160" className="text-sm">Typing Speed = characters / time_span</text>
                <text x="510" y="180" className="text-sm">Rhythm = Σ(inter_key_intervals)</text>
                <text x="510" y="200" className="text-sm">Variance = σ² of timing_pattern</text>
                <text x="510" y="220" className="text-sm">Confidence = f(consistency, stability)</text>
              </svg>
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Key Measurements:</strong></p>
                <p>(200-201) Dwell Times: Individual key press durations (typically 80-200ms)</p>
                <p>(202-203) Flight Times: Inter-key intervals (typically 100-300ms)</p>
                <p>Statistical analysis includes mean, variance, and distribution patterns</p>
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
      </Tabs>
    </div>
  );
};

export default PatentDrawings;

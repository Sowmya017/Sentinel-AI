export interface DetectionPayload {
  event_id: string;
  timestamp: string;
  sensor_id: string;
  detection_type: string;
  object_data: {
    class: string;
    color: string;
    license_plate: string;
    confidence_score: number;
    bounding_box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] or [x, y, w, h]
  };
  telemetry: {
    speed_kmh: number;
    thermal_status: string;
    clearance_level: string;
    headlights: string;
  };
}

export interface SecurityMemory {
  id: number;
  date: string;
  time: string;
  timestampStr: string;
  category: 'routine' | 'threat' | 'delivery' | 'anomaly';
  isThreatTarget: boolean;
  content: string;
  sensor?: string;
  licensePlate?: string;
  details?: string;
}

export interface ContextRule {
  id: string;
  rule: string;
  status: 'MONITORING' | 'TRIGGERED';
  severity: 'HIGH' | 'CRITICAL';
}

// Exactly 20 Historical Memories from Section 3 of Project Blueprint
export const BLUEPRINT_20_MEMORIES: SecurityMemory[] = [
  {
    id: 1,
    date: "Sept 24",
    time: "08:15 AM",
    timestampStr: "Sept 24, 08:15 AM",
    category: "routine",
    isThreatTarget: false,
    content: "Security Log - Sept 24, 08:15 AM: Employee vehicle (KA-01-AB12) entered Main Gate. Driver badge authorized.",
    licensePlate: "KA-01-AB12",
    details: "Routine employee access, verified badge."
  },
  {
    id: 2,
    date: "Sept 24",
    time: "11:30 AM",
    timestampStr: "Sept 24, 11:30 AM",
    category: "delivery",
    isThreatTarget: false,
    content: "Security Log - Sept 24, 11:30 AM: Scheduled delivery by FedEx truck (MH-12-CD34) at Loading Bay 2. Cleared.",
    licensePlate: "MH-12-CD34",
    details: "Scheduled supply delivery to Loading Bay 2."
  },
  {
    id: 3,
    date: "Sept 25",
    time: "02:14 AM",
    timestampStr: "Sept 25, 02:14 AM",
    category: "threat",
    isThreatTarget: true,
    content: "Security Log - Sept 25, 02:14 AM: CAM_NORTH_GATE detected a white commercial van, license plate KA-04-XYZ. Vehicle remained stationary for 22 minutes. Thermal imaging indicated engine idling. No authorized deliveries scheduled.",
    sensor: "CAM_NORTH_GATE",
    licensePlate: "KA-04-XYZ",
    details: "Stationary for 22 min, engine idling at 2 AM. First suspicious reconnaissance appearance."
  },
  {
    id: 4,
    date: "Sept 25",
    time: "06:45 AM",
    timestampStr: "Sept 25, 06:45 AM",
    category: "routine",
    isThreatTarget: false,
    content: "Security Log - Sept 25, 06:45 AM: Janitorial staff arrived via South Gate. Routine clearance.",
    sensor: "South Gate",
    details: "Cleaning and maintenance staff handover."
  },
  {
    id: 5,
    date: "Sept 25",
    time: "09:00 PM",
    timestampStr: "Sept 25, 09:00 PM",
    category: "anomaly",
    isThreatTarget: false,
    content: "Security Log - Sept 25, 09:00 PM: False alarm at East Fence. Sensor triggered by local wildlife (stray dog).",
    sensor: "East Fence",
    details: "Perimeter sensor vibration, visual confirmed wildlife."
  },
  {
    id: 6,
    date: "Sept 26",
    time: "01:15 AM",
    timestampStr: "Sept 26, 01:15 AM",
    category: "threat",
    isThreatTarget: true,
    content: "Security Log - Sept 26, 01:15 AM: White commercial van, license plate KA-04-XYZ, detected by CAM_PERIMETER_EAST driving slowly along the outer fence line. Speed registered at 12 km/h in a 40 km/h zone.",
    sensor: "CAM_PERIMETER_EAST",
    licensePlate: "KA-04-XYZ",
    details: "Probing perimeter fence at 12 km/h crawling speed."
  },
  {
    id: 7,
    date: "Sept 26",
    time: "01:17 AM",
    timestampStr: "Sept 26, 01:17 AM",
    category: "threat",
    isThreatTarget: true,
    content: "Security Log - Sept 26, 01:17 AM: Vehicle KA-04-XYZ paused for 45 seconds near access point Bravo. Departed before patrol approached.",
    sensor: "CAM_PERIMETER_EAST",
    licensePlate: "KA-04-XYZ",
    details: "Paused near restricted access point Bravo; fled on patrol approach."
  },
  {
    id: 8,
    date: "Sept 26",
    time: "10:00 AM",
    timestampStr: "Sept 26, 10:00 AM",
    category: "routine",
    isThreatTarget: false,
    content: "Security Log - Sept 26, 10:00 AM: Routine maintenance crew (HVAC) cleared at North Gate. Badge scanned and verified.",
    sensor: "North Gate",
    details: "HVAC contractor contractor badge valid."
  },
  {
    id: 9,
    date: "Sept 26",
    time: "02:30 PM",
    timestampStr: "Sept 26, 02:30 PM",
    category: "anomaly",
    isThreatTarget: false,
    content: "Security Log - Sept 26, 02:30 PM: Unrecognized sedan (AP-09-LM56) approached Main Gate. Asked for directions and performed a U-turn. Low threat.",
    sensor: "Main Gate",
    licensePlate: "AP-09-LM56",
    details: "Civilian vehicle lost, directional guidance provided."
  },
  {
    id: 10,
    date: "Sept 26",
    time: "11:45 PM",
    timestampStr: "Sept 26, 11:45 PM",
    category: "anomaly",
    isThreatTarget: false,
    content: "Security Log - Sept 26, 11:45 PM: CAM_SOUTH_DOCK detected thermal anomaly. Investigated by patrol; determined to be an overheating generator.",
    sensor: "CAM_SOUTH_DOCK",
    details: "Equipment thermal signature inspected and resolved."
  },
  {
    id: 11,
    date: "Sept 27",
    time: "03:30 AM",
    timestampStr: "Sept 27, 03:30 AM",
    category: "threat",
    isThreatTarget: true,
    content: "Security Log - Sept 27, 03:30 AM: White commercial van, license plate KA-04-XYZ, parked 100 meters outside the restricted West Perimeter fence. Remained in blind spot of CAM_WEST_02 for 18 minutes.",
    sensor: "CAM_WEST_02",
    licensePlate: "KA-04-XYZ",
    details: "Exploiting 18-minute camera blind spot outside restricted perimeter."
  },
  {
    id: 12,
    date: "Sept 27",
    time: "07:15 AM",
    timestampStr: "Sept 27, 07:15 AM",
    category: "routine",
    isThreatTarget: false,
    content: "Security Log - Sept 27, 07:15 AM: Morning shift employee vehicles logged arriving at Main Parking Lot. All badges valid.",
    sensor: "Main Parking Lot",
    details: "142 employees cleared for entry."
  },
  {
    id: 13,
    date: "Sept 27",
    time: "12:00 PM",
    timestampStr: "Sept 27, 12:00 PM",
    category: "delivery",
    isThreatTarget: false,
    content: "Security Log - Sept 27, 12:00 PM: Food delivery service arrived at Front Desk. Temporary pass issued.",
    sensor: "Front Desk",
    details: "Temporary visitor pass issued, escorted."
  },
  {
    id: 14,
    date: "Sept 27",
    time: "04:45 PM",
    timestampStr: "Sept 27, 04:45 PM",
    category: "delivery",
    isThreatTarget: false,
    content: "Security Log - Sept 27, 04:45 PM: Heavy transport truck (TS-07-PQ89) cleared for aerospace component pickup at Bay 4.",
    sensor: "Bay 4",
    licensePlate: "TS-07-PQ89",
    details: "Critical aerospace component transport verified with dispatch."
  },
  {
    id: 15,
    date: "Sept 27",
    time: "08:20 PM",
    timestampStr: "Sept 27, 08:20 PM",
    category: "anomaly",
    isThreatTarget: false,
    content: "Security Log - Sept 27, 08:20 PM: Perimeter motion sensor 4 triggered. Cause determined to be heavy wind moving loose debris.",
    sensor: "Perimeter Sensor 4",
    details: "High winds (45 km/h) displaced tarpaulin."
  },
  {
    id: 16,
    date: "Sept 28",
    time: "01:10 AM",
    timestampStr: "Sept 28, 01:10 AM",
    category: "threat",
    isThreatTarget: true,
    content: "Security Log - Sept 28, 01:10 AM: CAM_NORTH_GATE detected vehicle KA-04-XYZ passing by without stopping. Vehicle headlights were turned off during transit.",
    sensor: "CAM_NORTH_GATE",
    licensePlate: "KA-04-XYZ",
    details: "Tactical stealth transit: Headlights deliberately switched off."
  },
  {
    id: 17,
    date: "Sept 28",
    time: "05:00 AM",
    timestampStr: "Sept 28, 05:00 AM",
    category: "routine",
    isThreatTarget: false,
    content: "Security Log - Sept 28, 05:00 AM: Shift change completed successfully. No anomalies logged during morning handover.",
    sensor: "Guard Post Alpha",
    details: "Shift Handover Log OK."
  },
  {
    id: 18,
    date: "Sept 28",
    time: "09:15 AM",
    timestampStr: "Sept 28, 09:15 AM",
    category: "routine",
    isThreatTarget: false,
    content: "Security Log - Sept 28, 09:15 AM: Official inspection vehicle (Govt plates) cleared for entry at Main Gate.",
    sensor: "Main Gate",
    details: "Defense logistics inspection entourage cleared."
  },
  {
    id: 19,
    date: "Sept 28",
    time: "Context Rule A",
    timestampStr: "Policy Rule 1",
    category: "threat",
    isThreatTarget: true,
    content: "Context Rule: Any vehicle exhibiting repeated late-night loitering, fence-line probing, or headlights-off transit across multiple days must be flagged as a 'High-Risk Reconnaissance Threat'.",
    details: "Pattern-of-life reconnaissance rule."
  },
  {
    id: 20,
    date: "Sept 28",
    time: "Context Rule B",
    timestampStr: "Policy Rule 2",
    category: "threat",
    isThreatTarget: true,
    content: "Context Rule: Security operators must be immediately notified to dispatch intercept teams if a High-Risk Reconnaissance Threat approaches the South Dock.",
    details: "Perimeter interdiction directive."
  }
];

// The exact Live Demo Payload from Section 4 of Project Blueprint
export const BLUEPRINT_LIVE_PAYLOAD: DetectionPayload = {
  event_id: "EVT-88392-ALPHA",
  timestamp: "2026-09-28T23:15:00Z",
  sensor_id: "CAM_SOUTH_DOCK",
  detection_type: "yolov5_object",
  object_data: {
    class: "commercial_van",
    color: "white",
    license_plate: "KA-04-XYZ",
    confidence_score: 0.94,
    bounding_box: [210, 85, 430, 290]
  },
  telemetry: {
    speed_kmh: 0.0,
    thermal_status: "engine_idling",
    clearance_level: "UNAUTHORIZED",
    headlights: "OFF"
  }
};

// Blueprint Context Rules
export const BLUEPRINT_CONTEXT_RULES: ContextRule[] = [
  {
    id: "RULE-SEC-01",
    rule: "Any vehicle exhibiting repeated late-night loitering, fence-line probing, or headlights-off transit across multiple days must be flagged as a 'High-Risk Reconnaissance Threat'.",
    status: "TRIGGERED",
    severity: "CRITICAL"
  },
  {
    id: "RULE-SEC-02",
    rule: "Security operators must be immediately notified to dispatch intercept teams if a High-Risk Reconnaissance Threat approaches the South Dock.",
    status: "TRIGGERED",
    severity: "CRITICAL"
  }
];

// Exact AI response from Section 5 of Project Blueprint
export const BLUEPRINT_SAMPLE_AI_ASSESSMENT = `CRITICAL ALERT: This vehicle is exhibiting a pattern of reconnaissance.

It previously idled at the North Gate on Sept 25, probed the East fence on Sept 26, and parked with lights off on Sept 27.

Recommend immediate intercept at South Dock.`;

export const BLUEPRINT_TARGET_VEHICLE = {
  plate: "KA-04-XYZ",
  makeModel: "Commercial Van (White)",
  threatLevel: "CRITICAL (DEFCON 2)",
  firstSeen: "Sept 25, 02:14 AM",
  lastSeen: "Sept 28, 23:15 PM (CAM_SOUTH_DOCK)",
  anomaliesDetected: [
    "Late-night loitering (22 mins, North Gate, engine idling)",
    "Fence-line probing at 12 km/h (CAM_PERIMETER_EAST)",
    "45-second pause near access point Bravo",
    "Blind-spot exploitation (18 mins, CAM_WEST_02)",
    "Headlights deliberately switched off during transit",
    "Stationary idling inside restricted South Dock zone"
  ],
  recommendedAction: "Dispatch tactical security squad for South Dock containment. Seal gate barrier 04."
};

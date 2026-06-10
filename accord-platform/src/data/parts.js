export const parts = [
  {
    id: "engine-block",
    name: "Engine Block",
    category: "Bottom End",
    description:
      "The main structure of the engine. It holds the cylinders, pistons, crankshaft, and oil passages.",
    f22b2Note:
      "For an F22B2, the block is part of the 2.2L SOHC Accord engine platform.",
    services: [
      "Hot tank cleaning",
      "Deck resurfacing",
      "Cylinder inspection",
      "Bore and hone",
      "Thread repair"
    ],
    vendors: [
      "Used OEM block - junkyard or eBay Marketplace",
      "Machine shop - resurfacing and cleaning",
      "RockAuto - gaskets and rebuild parts",
      "Honda dealer - OEM seals and small hardware"
    ],
    hotspot: {
      position: [0, -0.4, 0],
      scale: [2.6, 1.2, 1.2],
      rotation: [0, 0, 0]
    },
    modelPath: null
  },
  {
    id: "pistons",
    name: "Pistons",
    category: "Rotating Assembly",
    description:
      "Pistons move up and down inside the cylinders and transfer combustion force to the crankshaft.",
    f22b2Note:
      "On a rebuild, pistons, rings, and cylinder wall condition should be inspected carefully.",
    services: [
      "Piston ring replacement",
      "Cylinder hone",
      "Compression check",
      "Ring gap inspection"
    ],
    vendors: [
      "RockAuto - piston rings",
      "eBay - used OEM pistons",
      "Machine shop - cylinder honing",
      "Summit Racing - aftermarket piston/ring options"
    ],
    hotspot: {
      position: [0, 0.6, 0],
      scale: [3.4, 1.2, 1.2],
      rotation: [0, 0, 0]
    },
    modelPath: null
  },
  {
    id: "crankshaft",
    name: "Crankshaft",
    category: "Rotating Assembly",
    description:
      "The crankshaft converts piston movement into rotational force that eventually drives the transmission.",
    f22b2Note:
      "A machine shop can polish or inspect the crank journals during a rebuild.",
    services: [
      "Crank polishing",
      "Journal inspection",
      "Bearing clearance check",
      "Balancing"
    ],
    vendors: [
      "Machine shop - crank polish",
      "RockAuto - main bearings",
      "Honda dealer - OEM bearings if available",
      "Used OEM crankshaft - marketplace or junkyard"
    ],
    hotspot: {
      position: [0, -1.05, 0],
      scale: [3.7, 0.45, 0.8],
      rotation: [0, 0, 0]
    },
    modelPath: null
  },
  {
    id: "cylinder-head",
    name: "Cylinder Head",
    category: "Top End",
    description:
      "The cylinder head contains the valves, camshaft, rocker assembly, and combustion chambers.",
    f22b2Note:
      "For your Accord Platform app, this should eventually become its own detailed 3D model.",
    services: [
      "Resurfacing",
      "Valve job",
      "Pressure test",
      "Valve stem seals",
      "Cam and rocker inspection"
    ],
    vendors: [
      "Machine shop - valve job and resurfacing",
      "RockAuto - head gasket set",
      "Honda dealer - OEM seals",
      "Junkyard - replacement F22B2 head"
    ],
    hotspot: {
      position: [0, 1.35, 0],
      scale: [3.8, 0.8, 1.3],
      rotation: [0, 0, 0]
    },
    modelPath: null
  }
];
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const MODEL_DIR = '/Model'

const parts = [
  {
  id: 'engine-block',
  name: 'Engine Block',
  category: 'Engine Block',
  description:
    'The main structure of the engine. It holds the cylinders, pistons, crankshaft, and oil passages.',
  modelPath: `${MODEL_DIR}/inline4_engine_block.glb`,
  detailScale: 0.02,
  matchNames: ['engine_block', 'block', 'cylinder_block', 'inline4'],
  explodeOffset: [0, -45, 0],
  services: ['Hot tank cleaning', 'Deck resurfacing', 'Cylinder hone'],
  vendors: ['Machine shop', 'Junkyard', 'RockAuto']
},
  {
    id: 'piston-head',
    name: 'Piston Head',
    category: 'Piston Components',
    description:
      'The top part of the piston where the compression rings and oil control rings sit.',
    modelPath: '/Model/piston_head.glb',
    detailScale: 0.5,
    matchNames: ['piston_head', 'pistonhead', 'piston_top'],
    explodeOffset: [0, 95, 0],
    services: ['Ring groove cleaning', 'Carbon removal', 'Piston inspection'],
    vendors: ['RockAuto', 'Honda parts seller', 'Used OEM parts']
  },
  {
  id: 'piston-assembly',
  name: 'Piston Assembly',
  category: 'Rotating Assembly',
  description:
    'The piston assembly includes the piston head, compression rings, oil control ring, wrist pin, connecting rod, rod cap, and bolts.',
  modelPath: `${MODEL_DIR}/accord_platform_piston_assembly_named.glb`,
  detailScale: 0.65,
  matchNames: ['piston', 'piston_assembly', 'piston_for_engine'],
  explodeOffset: [0, 55, 0],
  services: [
    'Ring replacement',
    'Rod bearing inspection',
    'Wrist pin inspection',
    'Carbon removal',
    'Ring groove cleaning'
  ],
  vendors: [
    'RockAuto - piston rings and bearings',
    'Machine shop - cleaning and inspection',
    'eBay/Junkyard - used OEM pistons',
    'Honda parts sellers - OEM seals and hardware'
  ]
},
  {
    id: 'connecting-rod',
    name: 'Connecting Rod',
    category: 'Rotating Assembly',
    description:
      'The connecting rod connects the piston to the crankshaft and transfers force downward.',
    modelPath: '/Model/connecting_rod.glb',
    detailScale: 0.5,
    matchNames: ['connecting_rod', 'connectingrod', 'rod'],
    explodeOffset: [0, 25, 0],
    services: ['Rod bearing inspection', 'Rod resizing', 'Bolt inspection'],
    vendors: ['Machine shop', 'eBay/Junkyard', 'Honda OEM parts']
  },
  {
  id: 'crankshaft',
  name: 'Crankshaft',
  category: 'Bottom End',
  description:
    'The crankshaft converts piston movement into rotational movement that drives the transmission.',
  modelPath: `${MODEL_DIR}/accord_platform_simplified_crankshaft_named.glb`,
  detailScale: 0.75,
  matchNames: ['crankshaft', 'crank'],
  explodeOffset: [0, -85, 0],
  services: [
    'Crank polishing',
    'Journal inspection',
    'Bearing clearance check',
    'Balancing'
  ],
  vendors: [
    'Machine shop - crank polish and inspection',
    'RockAuto - main bearings and rod bearings',
    'Junkyard - used OEM crankshaft',
    'Honda parts seller - OEM bearings if available'
  ]
}
]

function getPartFromMeshName(name) {
  const lowerName = name.toLowerCase()

  return parts.find((part) =>
    part.matchNames.some((keyword) => lowerName.includes(keyword))
  )
}

function EngineModel({ hoveredPart, setHoveredPart, setSelectedPart, exploded, setMousePosition }) {
  const { scene } = useGLTF('/Model/inline4_engine_block.glb')
  const model = useMemo(() => scene.clone(true), [scene])
  const clickableMeshes = useRef([])
  const targetPosition = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    clickableMeshes.current = []

    model.traverse((object) => {
      if (!object.isMesh) return

      const part = getPartFromMeshName(object.name)

      if (!part) return

      object.userData.part = part
      object.userData.basePosition = object.position.clone()

      if (Array.isArray(object.material)) {
        object.material = object.material.map((mat) => mat.clone())
      } else if (object.material) {
        object.material = object.material.clone()
      }

      clickableMeshes.current.push(object)
    })
  }, [model])

  useEffect(() => {
    model.traverse((object) => {
      if (!object.isMesh || !object.userData.part || !object.material) return

      const shouldHighlight = hoveredPart?.id === object.userData.part.id
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      materials.forEach((mat) => {
        if (mat.emissive) {
          mat.emissive.set(shouldHighlight ? '#ff3300' : '#000000')
          mat.emissiveIntensity = shouldHighlight ? 1.2 : 0
        }
      })
    })
  }, [hoveredPart, model])

  useFrame(() => {
    clickableMeshes.current.forEach((object) => {
      const part = object.userData.part
      const base = object.userData.basePosition
      const offset = exploded ? part.explodeOffset : [0, 0, 0]

      targetPosition.set(
        base.x + offset[0],
        base.y + offset[1],
        base.z + offset[2]
      )

      object.position.lerp(targetPosition, 0.08)
    })
  })

  return (
    <primitive
  object={model}
  scale={0.02}
  position={[0, 0, 0]}
  rotation={[0, 0, 0]}
  onPointerOver={(e) => {
    const part = e.object.userData.part
    if (!part) return

    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    setHoveredPart(part)
  }}
  onPointerMove={(e) => {
    const part = e.object.userData.part
    if (!part) return

    e.stopPropagation()

    const event = e.nativeEvent || e.sourceEvent || e

    setMousePosition({
      x: event.clientX + 18,
      y: event.clientY + 18
    })

    setHoveredPart(part)
  }}
  onPointerOut={(e) => {
    const part = e.object.userData.part
    if (!part) return

    e.stopPropagation()
    document.body.style.cursor = 'default'
    setHoveredPart(null)
  }}
  onClick={(e) => {
    const part = e.object.userData.part
    if (!part) return

    e.stopPropagation()
    setSelectedPart(part)
  }}
/>
  )
}

function DetailModel({ modelPath, scale }) {
  const { scene } = useGLTF(modelPath)
  const model = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={model}
      scale={scale}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

function ControlsHint() {
  const [visible, setVisible] = useState(() => {
    return localStorage.getItem('hideControlsHint') !== 'true'
  })

  if (!visible) return null

  return (
    <div style={styles.controlsHint}>
      <button
        style={styles.closeControlsButton}
        onClick={() => {
          localStorage.setItem('hideControlsHint', 'true')
          setVisible(false)
        }}
      >
        ×
      </button>

      <p><strong>Controls</strong></p>
      <p>Left click + drag: move</p>
      <p>Right click + drag: rotate</p>
      <p>Scroll: zoom</p>
    </div>
  )
}

function PartInfoPanel({ part }) {
  if (!part) {
    return (
      <div style={styles.panel}>
        <h2>Hover Over a Part</h2>
        <p>Move your mouse over the engine to see part information.</p>
        <p>Click a highlighted part to open its detailed 3D model.</p>
      </div>
    )
  }

  return (
    <div style={styles.panel}>
      <h2>{part.name}</h2>

      <p>
        <strong>Category:</strong> {part.category}
      </p>

      <p>{part.description}</p>

      <p style={{ color: '#ffcc00' }}>
        Click this part to open the detailed 3D model.
      </p>
    </div>
  )
}

function PartDetailView({ part, setSelectedPart }) {
  return (
    <div style={styles.detailPage}>
      <button style={styles.backButton} onClick={() => setSelectedPart(null)}>
        ← Back to Engine
      </button>

      <h1>{part.name}</h1>
      <p>{part.description}</p>

      <div style={styles.detailGrid}>
        <div
          style={styles.detailViewer}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Canvas
            camera={{ position: [0, 1, 6], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} />

            <Suspense fallback={null}>
              <DetailModel modelPath={part.modelPath} scale={part.detailScale} />
              <Environment preset="warehouse" />
            </Suspense>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              screenSpacePanning={true}
              minDistance={2}
              maxDistance={20}
              mouseButtons={{
                LEFT: THREE.MOUSE.PAN,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE
              }}
            />
          </Canvas>

          <ControlsHint />
        </div>

        <div style={styles.detailPanel}>
          <h2>Machine Shop / Services</h2>
          <ul>
            {part.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>

          <h2>Where to Buy / Source</h2>
          <ul>
            {part.vendors.map((vendor) => (
              <li key={vendor}>{vendor}</li>
            ))}
          </ul>

          <h2>Future Feature</h2>
          <p>
            Later, this page can show sub-parts like piston rings, wrist pin,
            rod bearings, rod bolts, and torque specs.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EngineViewer() {
  const [hoveredPart, setHoveredPart] = useState(null)
  const [selectedPart, setSelectedPart] = useState(null)
  const [exploded, setExploded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  if (selectedPart) {
    return (
      <PartDetailView
        part={selectedPart}
        setSelectedPart={setSelectedPart}
      />
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.viewerSection}>
        <div style={styles.topBar}>
          <button
            style={exploded ? styles.activeButton : styles.button}
            onClick={() => setExploded(!exploded)}
          >
            {exploded ? 'Assemble Block' : 'Exploded View'}
          </button>
        </div>

        <div
          style={styles.viewerWrapper}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Canvas
            camera={{ position: [0, 1.5, 9], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} />

            <Suspense fallback={null}>
              <EngineModel
                hoveredPart={hoveredPart}
                setHoveredPart={setHoveredPart}
                setSelectedPart={setSelectedPart}
                exploded={exploded}
                setMousePosition={setMousePosition}
              />
              <Environment preset="warehouse" />
            </Suspense>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              screenSpacePanning={true}
              minDistance={4}
              maxDistance={18}
              mouseButtons={{
                LEFT: THREE.MOUSE.PAN,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.ROTATE
              }}
            />
          </Canvas>

          <ControlsHint />
        </div>
      </div>

      <PartInfoPanel part={hoveredPart} />
    </div>
  )
}

const styles = {
  page: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  viewerSection: {
    width: '100%'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '10px'
  },
  button: {
    padding: '10px 16px',
    background: '#2a2a2a',
    color: 'white',
    border: '1px solid #444',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  activeButton: {
    padding: '10px 16px',
    background: '#ffcc00',
    color: 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  viewerWrapper: {
    height: '600px',
    background: 'black',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative'
  },
  panel: {
    background: '#1e1e1e',
    color: 'white',
    padding: '20px',
    borderRadius: '12px',
    minHeight: '560px',
    border: '1px solid #333'
  },
  controlsHint: {
    position: 'absolute',
    left: '14px',
    bottom: '14px',
    background: 'rgba(0, 0, 0, 0.72)',
    color: 'white',
    padding: '12px 36px 12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.2',
    border: '1px solid #333',
    pointerEvents: 'auto',
    zIndex: 10
  },
  closeControlsButton: {
    position: 'absolute',
    top: '5px',
    right: '8px',
    background: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer'
  },
  detailPage: {
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'white'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px'
  },
  detailViewer: {
    height: '500px',
    background: 'black',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative'
  },
  detailPanel: {
    background: '#1e1e1e',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #333'
  },
  backButton: {
    marginBottom: '20px',
    padding: '10px 16px',
    background: '#ffcc00',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
}

useGLTF.preload('/Model/inline4_engine_block.glb')
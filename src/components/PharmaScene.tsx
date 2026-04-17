import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  Lightformer,
  ContactShadows,
  MeshTransmissionMaterial,
  Instances,
  Instance,
} from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

function Pellet({
  initialPos,
  pointer,
}: {
  initialPos: [number, number, number];
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Object3D | null>(null);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  const speedX = useMemo(() => 0.5 + Math.random() * 1.5, []);
  const speedY = useMemo(() => 0.5 + Math.random() * 1.5, []);
  const radius = useMemo(() => 0.05 + Math.random() * 0.15, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const targetPx = pointer.current.x * 0.4;
    const targetPy = -pointer.current.y * 1.8;
    const targetPz = pointer.current.y * 0.2;

    const fx = Math.sin(state.clock.elapsedTime * speedX + offset) * radius;
    const fy = Math.cos(state.clock.elapsedTime * speedY + offset) * radius;
    const fz = Math.sin(state.clock.elapsedTime * speedX * 0.8 + offset) * radius;

    let nx = initialPos[0] + targetPx + fx;
    let ny = initialPos[1] + targetPy + fy;
    let nz = initialPos[2] + targetPz + fz;

    // Strict 3D boundary checking mathematically fitting the capsule shape.
    const maxR = 0.55; // capsule inner radius (0.7) - pellet radius (0.07) and padding

    const distXZ = Math.sqrt(nx * nx + nz * nz);
    if (distXZ > maxR && ny >= -1.4 && ny <= 1.4) {
      nx = (nx / distXZ) * maxR;
      nz = (nz / distXZ) * maxR;
    } else if (ny > 1.4) {
      const dy = ny - 1.4;
      const dist3D = Math.sqrt(nx * nx + dy * dy + nz * nz);
      if (dist3D > maxR) {
        nx = (nx / dist3D) * maxR;
        ny = 1.4 + (dy / dist3D) * maxR;
        nz = (nz / dist3D) * maxR;
      }
    } else if (ny < -1.4) {
      const dy = ny - -1.4;
      const dist3D = Math.sqrt(nx * nx + dy * dy + nz * nz);
      if (dist3D > maxR) {
        nx = (nx / dist3D) * maxR;
        ny = -1.4 + (dy / dist3D) * maxR;
        nz = (nz / dist3D) * maxR;
      }
    }

    ref.current.position.x += (nx - ref.current.position.x) * Math.min(1, delta * 5);
    ref.current.position.y += (ny - ref.current.position.y) * Math.min(1, delta * 5);
    ref.current.position.z += (nz - ref.current.position.z) * Math.min(1, delta * 5);
    ref.current.rotation.x += delta * speedX;
    ref.current.rotation.y += delta * speedY;
  });

  return <Instance ref={ref} />;
}

function Capsule({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const targetY = pointer.current.x * 0.6;
    const targetX = -pointer.current.y * 0.5;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * Math.min(1, delta * 3);
    ref.current.rotation.x += (targetX + 0.2 - ref.current.rotation.x) * Math.min(1, delta * 3);
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.08 - 0.5;
    // gentle position parallax
    ref.current.position.x +=
      (pointer.current.x * 0.3 - ref.current.position.x) * Math.min(1, delta * 2);
    ref.current.position.y +=
      (-pointer.current.y * 0.2 - ref.current.position.y) * Math.min(1, delta * 2);
  });

  const granules = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 70; i++) {
      // Clustered tightly so sliding them doesn't clip out of the ends
      const y = (Math.random() - 0.5) * 1.2;
      const r = 0.55 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      pos.push([r * Math.cos(theta), y, r * Math.sin(theta)]);
    }
    return pos;
  }, []);

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ref} scale={1.1}>
        {/* Top Half: Only Pellets, no outer shell */}
        <Instances limit={100}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshPhysicalMaterial color="#ff7a00" roughness={0.3} metalness={0.1} clearcoat={1} />
          {granules.map((pos, i) => (
            <Pellet key={i} initialPos={pos as [number, number, number]} pointer={pointer} />
          ))}
        </Instances>

        {/* Bottom Half (Empty/Transparent with Depth) */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 1.4, 96]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={1}
            thickness={0.1}
            roughness={0.05}
            ior={1.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -1.4, 0]} rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.7, 96, 96, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={1}
            thickness={0.1}
            roughness={0.05}
            ior={1.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Top Half Casing (Mint Glass) */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 1.4, 96]} />
          <meshPhysicalMaterial
            color="#a7f0d9"
            transmission={1}
            thickness={0.1}
            roughness={0.05}
            ior={1.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.7, 96, 96, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#a7f0d9"
            transmission={1}
            thickness={0.1}
            roughness={0.05}
            ior={1.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Syringe({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const baseY = 1.8 + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    const targetX = 2.6 + pointer.current.x * 0.5;
    const targetY = baseY + -pointer.current.y * 0.4;
    ref.current.position.x += (targetX - ref.current.position.x) * Math.min(1, delta * 2.5);
    ref.current.position.y += (targetY - ref.current.position.y) * Math.min(1, delta * 2.5);
    ref.current.rotation.z = -0.7 + pointer.current.x * 0.15;
    ref.current.rotation.x = -pointer.current.y * 0.2;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={ref} position={[2.6, 1.8, -0.5]} rotation={[0, 0, -0.7]} scale={0.55}>
        {/* Plunger rod */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 24]} />
          <meshPhysicalMaterial color="#e8f4ff" metalness={0.3} roughness={0.3} />
        </mesh>
        {/* Plunger top */}
        <mesh position={[0, 2.05, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.08, 32]} />
          <meshPhysicalMaterial color="#f0f8ff" metalness={0.2} roughness={0.25} />
        </mesh>
        {/* Barrel (glass) */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 1.6, 48]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={1}
            thickness={0.5}
            roughness={0.05}
            ior={1.4}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Liquid inside */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.9, 48]} />
          <meshPhysicalMaterial
            color="#a7f0d9"
            transmission={1}
            thickness={0.5}
            roughness={0.1}
            ior={1.2}
            transparent
          />
        </mesh>
        {/* Flange */}
        <mesh position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
          <meshPhysicalMaterial color="#ffffff" metalness={0.2} roughness={0.2} />
        </mesh>
        {/* Tip cone */}
        <mesh position={[0, -0.5, 0]}>
          <coneGeometry args={[0.28, 0.25, 32]} />
          <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.15} />
        </mesh>
        {/* Needle */}
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.018, 0.012, 0.7, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function DNAStrand({
  pointer,
  position,
  scale = 1,
  rotation = [0, 0, 0],
  colorA = "#7dd3c0",
  colorB = "#bfe0ff",
  opacity = 0.9,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  colorA?: string;
  colorB?: string;
  opacity?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const basePairs = 16;
  const radius = 0.35;
  const heightStep = 0.25;
  const twistStep = 0.5;

  useFrame((state, delta) => {
    if (!ref.current) return;
    // Live moving constantly independent of pointer
    ref.current.rotation.y += delta * 1.5;
    ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    ref.current.rotation.z = rotation[2] + Math.cos(state.clock.elapsedTime * 0.4) * 0.2;

    // Parallax
    const tx = position[0] + pointer.current.x * 0.6;
    const ty = position[1] - pointer.current.y * 0.5;
    ref.current.position.x += (tx - ref.current.position.x) * Math.min(1, delta * 2);
    ref.current.position.y += (ty - ref.current.position.y) * Math.min(1, delta * 2);
  });

  const generateDNA = useMemo(() => {
    const nodesA = [];
    const nodesB = [];
    const rungs = [];
    for (let i = 0; i < basePairs; i++) {
      const y = (i - basePairs / 2) * heightStep;
      const angle = i * twistStep;
      nodesA.push([radius * Math.cos(angle), y, radius * Math.sin(angle)]);
      nodesB.push([radius * Math.cos(angle + Math.PI), y, radius * Math.sin(angle + Math.PI)]);
      rungs.push({ y, angle });
    }
    return { nodesA, nodesB, rungs };
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={ref} position={position} scale={scale} rotation={rotation}>
        <Instances limit={basePairs}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshPhysicalMaterial
            color={colorA}
            roughness={0.2}
            transmission={1}
            thickness={0.5}
            transparent
            opacity={opacity}
          />
          {generateDNA.nodesA.map((pos, i) => (
            <Instance key={`a-${i}`} position={pos as [number, number, number]} />
          ))}
        </Instances>

        <Instances limit={basePairs}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshPhysicalMaterial
            color={colorB}
            roughness={0.2}
            transmission={1}
            thickness={0.5}
            transparent
            opacity={opacity}
          />
          {generateDNA.nodesB.map((pos, i) => (
            <Instance key={`b-${i}`} position={pos as [number, number, number]} />
          ))}
        </Instances>

        {generateDNA.rungs.map((rung, i) => (
          <mesh
            key={`rung-${i}`}
            position={[0, rung.y, 0]}
            rotation={[0, -rung.angle, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.02, 0.02, radius * 2, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.5}
              roughness={0.2}
              transparent
              opacity={Math.min(1, opacity + 0.2)}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Tablet({
  pointer,
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.5;
    ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.8) * 0.4;
    ref.current.rotation.z = rotation[2] + Math.cos(state.clock.elapsedTime * 0.6) * 0.3;
    const tx = position[0] + pointer.current.x * 0.8;
    const ty = position[1] - pointer.current.y * 0.6;
    ref.current.position.x += (tx - ref.current.position.x) * Math.min(1, delta * 2);
    ref.current.position.y += (ty - ref.current.position.y) * Math.min(1, delta * 2);
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
      <group ref={ref} position={position} scale={scale} rotation={rotation}>
        {/* Main tablet body */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.1}
            clearcoat={1}
            transmission={0.2}
            ior={1.3}
          />
        </mesh>
        {/* Scored line on front face */}
        <mesh position={[0, 0, 0.08]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.02, 0.02]} />
          <meshPhysicalMaterial color="#cbd5e1" roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingMolecule({
  position,
  color,
  pointer,
  parallax = 0.5,
}: {
  position: [number, number, number];
  color: string;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  parallax?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const tx = position[0] + pointer.current.x * parallax;
    const ty = position[1] + -pointer.current.y * parallax;
    ref.current.position.x += (tx - ref.current.position.x) * Math.min(1, delta * 2);
    ref.current.position.y += (ty - ref.current.position.y) * Math.min(1, delta * 2);
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <group ref={ref} position={position}>
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.1}
            transmission={0.9}
            thickness={0.5}
            ior={1.4}
            clearcoat={1}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function PharmaScene({
  pointer,
  isMobile,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  isMobile?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 17], fov: isMobile ? 44 : 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} castShadow />
        <pointLight position={[-4, 2, 3]} intensity={1.2} color="#a7f0d9" />
        <pointLight position={[4, -2, 2]} intensity={0.9} color="#bfe0ff" />

        <Environment resolution={256} preset="city">
          <Lightformer
            intensity={1.5}
            position={[0, 5, 3]}
            rotation-x={Math.PI / 2}
            scale={[10, 1, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={1}
            position={[-4, 0, 2]}
            rotation-y={Math.PI / 2}
            scale={[6, 4, 1]}
            color="#d0f5e8"
          />
          <Lightformer
            intensity={0.8}
            position={[4, 0, 2]}
            rotation-y={-Math.PI / 2}
            scale={[6, 4, 1]}
            color="#dfeeff"
          />
        </Environment>

        <Capsule pointer={pointer} />
        <Syringe pointer={pointer} />
        <Tablet
          pointer={pointer}
          position={[-2.6, -1.8, -1]}
          scale={1.2}
          rotation={[0.4, 0, 0.2]}
        />
        <DNAStrand
          pointer={pointer}
          position={[3.2, -1.2, -0.5]}
          scale={0.65}
          rotation={[0.2, 0.5, -0.3]}
        />

        <FloatingMolecule
          position={[-2.4, 1.2, 0.5]}
          color="#a7f0d9"
          pointer={pointer}
          parallax={0.8}
        />
        <FloatingMolecule
          position={[-1.8, -1.6, 1]}
          color="#bfe0ff"
          pointer={pointer}
          parallax={1.2}
        />
        <FloatingMolecule
          position={[2.2, -1.4, 0.8]}
          color="#d8c5f5"
          pointer={pointer}
          parallax={0.6}
        />
        <FloatingMolecule
          position={[1.5, 2.2, -0.5]}
          color="#a7f0d9"
          pointer={pointer}
          parallax={1}
        />

        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.25}
          scale={10}
          blur={3}
          far={3}
          color="#5e7a92"
        />
      </Suspense>
    </Canvas>
  );
}

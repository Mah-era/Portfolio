'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const BLOOMS = 11000;
const TREES = 24;
type Placement = { x: number; z: number; scale: number; angle: number };
function randomSource(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Instanced plants share one wind clock. Only a uniform changes each frame;
// the GPU bends the stems, flower spikes and canopies together.
function windMaterial(
  color: string,
  strength: number,
  clock: { value: number },
) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    side: THREE.DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.gardenTime = clock;
    shader.vertexShader = 'uniform float gardenTime;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      #ifdef USE_INSTANCING
        vec2 root = instanceMatrix[3].xz;
        float phase = root.x * 0.17 + root.y * 0.23;
        float wind = sin(gardenTime * 1.15 + phase) + 0.35 * sin(gardenTime * 2.1 + phase * 1.7);
        float bend = max(position.y, 0.0);
        transformed.x += wind * bend * ${strength.toFixed(3)};
        transformed.z += cos(gardenTime * 0.8 + phase) * bend * ${(strength * 0.45).toFixed(3)};
      #endif
    `,
    );
  };
  material.customProgramCacheKey = () => 'garden-wind-' + strength;
  return material;
}

export function LavenderForest({
  reduced,
  night,
  windowBed = false,
}: {
  reduced: boolean;
  night: boolean;
  windowBed?: boolean;
}) {
  const compact = useThree((state) => state.size.width <= 800);
  const limit = windowBed ? (compact ? 750 : 1500) : compact ? 5500 : BLOOMS;
  const flowerRef = useRef<THREE.InstancedMesh>(null);
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const foliageRef = useRef<THREE.InstancedMesh>(null);
  const fireflyRef = useRef<THREE.InstancedMesh>(null);
  const butterflies = useRef<THREE.Group>(null);
  const time = useRef({ value: 0 });
  const work = useMemo(() => new THREE.Object3D(), []);
  const materials = useMemo(
    () => ({
      flower: windMaterial('#ffffff', 0.095, time.current),
      stem: windMaterial('#7f937d', 0.095, time.current),
      canopy: windMaterial('#9ca88e', 0.025, time.current),
    }),
    [],
  );
  const flowers = useMemo(() => {
    const random = randomSource(739);
    const positions: Placement[] = [];
    while (positions.length < limit) {
      const x = windowBed ? 8.1 + random() * 22 : random() * 56 - 28,
        z = windowBed ? random() * 17 - 8.5 : random() * 48 - 10;
      // The house, courtyard, reflecting pool and front approach remain clear.
      if (!windowBed && Math.abs(x) < 11.7 && z < 19.5) continue;
      if (
        !windowBed &&
        Math.abs(x + 3.3 + Math.sin(z * 0.1) * 1.5) < 2.8 &&
        z >= 18
      )
        continue;
      const row = Math.sin(x * 0.55 + Math.sin(z * 0.085) * 2);
      if (!windowBed && row < -0.42 && z > 19) continue;
      // A meandering gravel ribbon and generous gaps separate the low bushes.
      if (windowBed && Math.abs(x - 13.5 - Math.sin(z * 0.22) * 1.5) < 1.15)
        continue;
      const stems = windowBed ? 30 : 18;
      for (let j = 0; j < stems && positions.length < limit; j++) {
        const a = j * 2.399,
          r = Math.sqrt(j / stems) * (windowBed ? 0.48 : 0.72);
        positions.push({
          x: x + Math.cos(a) * r,
          z: z + Math.sin(a) * r,
          scale: 0.62 + random() * 0.36,
          angle: a,
        });
      }
    }
    return positions;
  }, [limit, windowBed]);
  const count = flowers.length;
  const trees = useMemo(() => {
    const random = randomSource(812);
    return Array.from({ length: TREES }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      return {
        x: side * (17 + random() * 28),
        z: -24 + random() * 64,
        scale: 0.65 + random() * 0.3,
        angle: random() * Math.PI * 2,
      };
    });
  }, []);
  const spike = useMemo(() => {
    const points = [new THREE.Vector2(0, 0.58)];
    for (let i = 0; i < 6; i++) {
      const y = 0.6 + i * 0.066,
        r = 0.067 * (1 - i * 0.115);
      points.push(
        new THREE.Vector2(r * 0.72, y),
        new THREE.Vector2(r, y + 0.018),
        new THREE.Vector2(r * 0.58, y + 0.052),
      );
    }
    points.push(new THREE.Vector2(0, 1.015));
    return new THREE.LatheGeometry(points, 7);
  }, []);
  const stem = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.009, 0.016, 0.78, 3);
    g.translate(0, 0.39, 0);
    const pieces: THREE.BufferGeometry[] = [g];
    for (let i = 0; i < 6; i++) {
      const leaf = new THREE.PlaneGeometry(0.055, 0.3, 1, 2);
      const positions = leaf.attributes.position;
      for (let j = 0; j < positions.count; j++) {
        if (Math.abs(positions.getY(j)) > 0.1) positions.setX(j, 0);
      }
      leaf.rotateZ((i % 2 ? 1 : -1) * 0.55);
      leaf.translate((i % 2 ? 1 : -1) * 0.08, 0.12 + i * 0.044, 0);
      leaf.rotateY(i * 2.399);
      pieces.push(leaf);
    }
    const merged = mergeGeometries(pieces);
    pieces.forEach((piece) => piece.dispose());
    return merged;
  }, []);
  const crown = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 12, 9);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i);
      const r = 1 + 0.1 * Math.sin(x * 13 + y * 7) * Math.cos(z * 11);
      p.setXYZ(i, x * r, y * r + 1.45, z * r);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => {
    const dummy = new THREE.Object3D(),
      color = new THREE.Color();
    flowers.forEach((p, i) => {
      dummy.position.set(p.x, -0.5, p.z);
      dummy.rotation.set(0.07 * Math.cos(i), p.angle, 0.13 * Math.sin(i));
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      flowerRef.current?.setMatrixAt(i, dummy.matrix);
      stemRef.current?.setMatrixAt(i, dummy.matrix);
      if (windowBed && i % 30 === 0) {
        dummy.position.set(p.x, -0.36, p.z);
        dummy.rotation.set(0, p.angle, 0);
        dummy.scale.set(0.49, 0.24, 0.46);
        dummy.updateMatrix();
        foliageRef.current?.setMatrixAt(i / 30, dummy.matrix);
      }
      color.set(
        ['#9b7ac6', '#7e5aac', '#a48ace', '#e2becf', '#e6e3cd'][
          Math.floor(i / (windowBed ? 30 : 18)) % 5
        ],
      );
      flowerRef.current?.setColorAt(i, color);
    });
    trees.forEach((p, i) => {
      dummy.position.set(p.x, 0.4 * p.scale - 0.5, p.z);
      dummy.rotation.set(0.04 * Math.sin(i), p.angle, 0.04 * Math.cos(i));
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      trunkRef.current?.setMatrixAt(i, dummy.matrix);
      for (let j = 0; j < 7; j++) {
        const a = j * 2.399;
        dummy.position.set(
          p.x + Math.cos(a) * 0.36 * p.scale,
          -0.5 + (j % 3) * 0.1,
          p.z + Math.sin(a) * 0.36 * p.scale,
        );
        dummy.rotation.set(0, p.angle + a, 0);
        dummy.scale.set(
          p.scale * (0.54 + (j % 2) * 0.12),
          p.scale * 0.6,
          p.scale * 0.5,
        );
        dummy.updateMatrix();
        canopyRef.current?.setMatrixAt(i * 7 + j, dummy.matrix);
        canopyRef.current?.setColorAt(
          i * 7 + j,
          color.set(['#9ca98a', '#809479', '#aeb699', '#93a084'][j % 4]),
        );
      }
    });
    [flowerRef, stemRef, foliageRef, canopyRef, trunkRef].forEach((ref) => {
      if (!ref.current) return;
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor)
        ref.current.instanceColor.needsUpdate = true;
      ref.current.computeBoundingSphere();
    });
  }, [flowers, trees, windowBed]);
  useEffect(
    () => () => {
      spike.dispose();
      stem.dispose();
      crown.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    },
    [spike, stem, crown, materials],
  );
  useFrame((_, dt) => {
    if (!reduced) time.current.value += Math.min(dt, 0.05);
    if (windowBed) return;
    const t = time.current.value;
    for (let i = 0; i < 180; i++) {
      const a = i * 2.399;
      work.position.set(
        (i % 2 ? -1 : 1) * (13 + (i % 16)) + Math.sin(a + t * 0.06),
        0.4 + ((i * 0.73 + t * 0.07) % 2),
        14 + Math.cos(a + t * 0.04) * 25,
      );
      work.rotation.set(t * 0.7 + i, a + t * 0.3, t + i);
      work.scale.set(0.015, 0.028, 0.01);
      work.updateMatrix();
      work.position.y = 0.5 + Math.sin(t * 0.45 + a) * 0.4 + (i % 4) * 0.45;
      work.scale.setScalar(0.012 + (1 + Math.sin(t * 1.5 + i)) * 0.015);
      work.updateMatrix();
      fireflyRef.current?.setMatrixAt(i, work.matrix);
    }
    if (fireflyRef.current)
      fireflyRef.current.instanceMatrix.needsUpdate = true;
    butterflies.current?.children.forEach((butterfly, i) => {
      const a = t * (0.14 + (i % 3) * 0.025) + i * 2.399;
      butterfly.position.set(
        (i % 2 ? -1 : 1) * (13 + (i % 4) * 2) + Math.sin(a) * 2,
        1.15 + Math.sin(a * 2) * 0.65,
        17 + Math.cos(a) * (5 + (i % 5)),
      );
      butterfly.rotation.y = -a;
      butterfly.children.forEach((wing, j) => {
        wing.rotation.y = (j ? -1 : 1) * (0.4 + Math.sin(t * 13 + i) * 0.8);
      });
    });
  });
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={windowBed ? [23, -0.515, 0] : [0, -0.515, 0]}
        receiveShadow
      >
        <planeGeometry args={windowBed ? [32, 17] : [180, 160]} />
        <meshStandardMaterial
          color={night ? '#343a3e' : windowBed ? '#c5c0aa' : '#b6b19a'}
          roughness={1}
        />
      </mesh>
      <instancedMesh ref={flowerRef} args={[spike, materials.flower, count]} />
      <instancedMesh ref={stemRef} args={[stem, materials.stem, count]} />
      {windowBed && (
        <instancedMesh
          ref={foliageRef}
          args={[undefined, undefined, Math.ceil(count / 30)]}
        >
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#889780" roughness={1} />
        </instancedMesh>
      )}
      {!windowBed && (
        <group>
          <instancedMesh
            ref={canopyRef}
            args={[crown, materials.canopy, TREES * 7]}
          />
          <instancedMesh
            ref={trunkRef}
            args={[undefined, undefined, TREES]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.1, 0.8, 7]} />
            <meshStandardMaterial color="#746e67" roughness={1} />
          </instancedMesh>
          <instancedMesh
            ref={fireflyRef}
            args={[undefined, undefined, 180]}
            visible={night}
            frustumCulled={false}
          >
            <sphereGeometry args={[1, 6, 4]} />
            <meshBasicMaterial color="#f9e5af" toneMapped={false} />
          </instancedMesh>
          <group ref={butterflies} visible={!night}>
            {Array.from({ length: 14 }, (_, i) => (
              <group key={i}>
                {[-1, 1].map((side) => (
                  <group key={side}>
                    <mesh
                      position={[side * 0.085, 0, 0]}
                      scale={[0.11, 0.17, 0.015]}
                      rotation={[0, 0, side * -0.45]}
                    >
                      <sphereGeometry args={[1, 8, 6]} />
                      <meshStandardMaterial
                        color={i % 2 ? '#f3dab6' : '#d8bce9'}
                        side={THREE.DoubleSide}
                      />
                    </mesh>
                  </group>
                ))}
              </group>
            ))}
          </group>
        </group>
      )}
    </group>
  );
}

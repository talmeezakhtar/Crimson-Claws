"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { Outlines } from "@react-three/drei";
import { BALL_RADIUS, HALF_COURT_SPOT, RELEASE_HEIGHT, SPOTS, isThree } from "@/lib/court";
import { announce, commentMiss } from "@/lib/commentary";
import { flickToVelocity, perfectVelocity, sampleArc } from "@/lib/physics";
import { aim, shot } from "@/lib/runtime";
import { now, refs } from "@/lib/shots";
import { sfx } from "@/lib/audio";
import { useGame } from "@/lib/store";
import { ballById, type BallType } from "@/lib/balls";
import { INK, toonGradient } from "@/lib/toon";

const DYNAMIC = 0;
const KINEMATIC = 2;
const ARC_DOTS = 16;

export function makeBallTexture(type: BallType) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = type.base;
  g.fillRect(0, 0, 512, 256);
  // pebble grain
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = `${type.grain}${Math.random() * 0.12})`;
    g.fillRect(Math.random() * 512, Math.random() * 256, 2, 2);
  }
  g.strokeStyle = type.seam;
  g.lineWidth = 7;
  // two great circles + equator
  for (const u of [0, 0.25, 0.5, 0.75]) {
    g.beginPath();
    g.moveTo(u * 512, 0);
    g.lineTo(u * 512, 256);
    g.stroke();
  }
  g.beginPath();
  g.moveTo(0, 128);
  g.lineTo(512, 128);
  g.stroke();
  // curved side seams
  for (const s of [1, -1]) {
    g.beginPath();
    for (let x = 0; x <= 512; x += 4) {
      const y = 128 + s * (70 + 30 * Math.cos((x / 512) * Math.PI * 4));
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function Ball({ showcase = false }: { showcase?: boolean }) {
  const body = useRef<RapierRigidBody>(null);
  const arc = useRef<THREE.InstancedMesh>(null);
  const ballId = useGame((s) => s.ball);
  const texture = useMemo(() => makeBallTexture(ballById(ballId)), [ballId]);
  useEffect(() => () => texture.dispose(), [texture]);
  const gradient = toonGradient();
  const resetToken = useGame((s) => s.resetToken);

  const held = useRef(true);
  const heldAt = useRef(0);
  const holdPos = useMemo(() => new THREE.Vector3(), []);
  const showcaseSpot = useRef(0);

  const tmp = useMemo(
    () => ({
      v: new THREE.Vector3(),
      pts: Array.from({ length: ARC_DOTS }, () => new THREE.Vector3()),
      m: new THREE.Matrix4(),
      q: new THREE.Quaternion(),
      s: new THREE.Vector3(),
    }),
    [],
  );

  const currentSpot = () =>
    showcase ? SPOTS[showcaseSpot.current] : SPOTS[useGame.getState().spotIndex % SPOTS.length];

  function hold() {
    const b = body.current;
    if (!b) return;
    const spot = currentSpot();
    holdPos.set(spot.x, RELEASE_HEIGHT, spot.z);
    b.setBodyType(KINEMATIC, true);
    b.setTranslation(holdPos, true);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    held.current = true;
    heldAt.current = now();
    shot.inFlight = false;
    aim.fire = false;
  }

  function fire(v: THREE.Vector3) {
    const b = body.current;
    if (!b) return;
    const spot = currentSpot();
    Object.assign(shot, {
      inFlight: true,
      releasedAt: now(),
      touchedRim: false,
      touchedBoard: false,
      scored: false,
      three: isThree(spot.x, spot.z),
    });
    held.current = false;
    b.setBodyType(DYNAMIC, true);
    b.setTranslation(holdPos, true);
    b.setLinvel(v, true);
    // backspin: the top of the ball rolls back toward the shooter
    const dir = new THREE.Vector3(v.x, 0, v.z).normalize();
    const spin = dir.cross(THREE.Object3D.DEFAULT_UP).multiplyScalar(14);
    b.setAngvel(spin, true);
    if (!showcase) useGame.getState().registerAttempt();
  }

  /** Shot finished: count a miss if needed, pick the next spot, hand the ball back. */
  function resolve() {
    if (showcase) {
      showcaseSpot.current = Math.floor(Math.random() * 6);
    } else {
      const g = useGame.getState();
      if (!shot.scored) {
        const line = commentMiss({ rim: shot.touchedRim, board: shot.touchedBoard, halfCourt: g.spotIndex === HALF_COURT_SPOT });
        g.registerMiss(line.text);
        announce(line);
        if (shot.touchedRim) sfx.groan(); // only the near misses get a reaction
      }
      g.nextSpot();
    }
    hold();
  }

  // The rapier body is created after mount, so the first hold happens in useFrame.
  const needsHold = useRef(true);
  useEffect(() => {
    needsHold.current = true;
    return () => {
      refs.ball = null;
    };
  }, [resetToken, showcase]);

  useFrame(() => {
    const b = body.current;
    if (!b) return;
    if (needsHold.current) {
      needsHold.current = false;
      refs.ball = b;
      refs.showcase = showcase;
      hold();
    }
    const t = now();

    if (held.current) {
      // gentle bob in the shooter's hands
      const p = holdPos.clone();
      p.y += Math.sin(t * 3) * 0.025;
      b.setNextKinematicTranslation(p);

      if (showcase) {
        if (t - heldAt.current > 1.1) fire(perfectVelocity(holdPos, (Math.random() - 0.5) * 0.05));
      } else if (aim.fire) {
        aim.fire = false;
        const canShoot = useGame.getState().phase === "playing";
        if (canShoot && aim.dy < -25) fire(flickToVelocity(holdPos, aim.dx, aim.dy, tmp.v).velocity.clone());
      }
    } else {
      const p = b.translation();
      const since = t - shot.releasedAt;
      const doneAfterMake = shot.scored && t - shot.scoredAt > 1.3;
      const lost = p.y < -2 || Math.abs(p.x) > 25 || p.z > 30 || p.z < -12;
      if (doneAfterMake || since > 4.2 || lost) resolve();
    }

    // dotted aim arc while dragging
    const mesh = arc.current;
    if (mesh) {
      const show = !showcase && held.current && aim.active && aim.dy < -10;
      mesh.visible = show;
      if (show) {
        const { velocity } = flickToVelocity(holdPos, aim.dx, aim.dy, tmp.v);
        sampleArc(holdPos, velocity, ARC_DOTS, tmp.pts);
        tmp.pts.forEach((pt, i) => {
          const s = 1 - (i / ARC_DOTS) * 0.55;
          tmp.s.set(s, s, s);
          tmp.m.compose(pt, tmp.q, tmp.s);
          mesh.setMatrixAt(i, tmp.m);
        });
        mesh.instanceMatrix.needsUpdate = true;
      }
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        name="ball"
        type="kinematicPosition"
        colliders={false}
        ccd
        linearDamping={0}
        angularDamping={0.4}
        onCollisionEnter={({ other }) => {
          const name = other.rigidBodyObject?.name;
          const v = body.current?.linvel();
          const speed = v ? Math.hypot(v.x, v.y, v.z) : 0;
          if (name === "rim") {
            if (shot.inFlight) shot.touchedRim = true;
            sfx.rim(speed);
          } else if (name === "board") {
            if (shot.inFlight) shot.touchedBoard = true;
            sfx.board(speed);
          } else if (name === "floor") {
            sfx.bounce(speed);
          }
        }}
      >
        <BallCollider args={[BALL_RADIUS]} restitution={0.82} friction={0.7} density={83} />
        <mesh castShadow>
          <sphereGeometry args={[BALL_RADIUS, 32, 24]} />
          <meshToonMaterial map={texture} gradientMap={gradient} />
          <Outlines thickness={2} color={INK} />
        </mesh>
      </RigidBody>

      <instancedMesh ref={arc} args={[undefined, undefined, ARC_DOTS]} visible={false} frustumCulled={false}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} depthTest={false} />
      </instancedMesh>
    </>
  );
}

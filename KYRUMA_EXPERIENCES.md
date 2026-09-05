# KYRUMA Experiences™

**Status:** Strategic capability — High Priority R&D

**Priority:** P2, behind P0 Client Delivery and P1 Sales/Growth

**Principle:** Beautiful outside. Intelligent inside.

KYRUMA Experiences is the creative and productive capability for premium digital experiences that unite design, product, motion, interaction, storytelling and technology. It can connect to KYRUMA OS / AI, but it is not part of the operating core.

## Product rule

| Offer | Use |
| --- | --- |
| Standard Web | Fast, elegant and functional. |
| Premium Web | Stronger creative direction and purposeful motion. |
| KYRUMA Experience | Immersive, high-value product storytelling when the complexity has a measurable purpose. |

Use immersive techniques only when they improve storytelling, product perception or explanation, brand differentiation or engagement. Never use them only for spectacle.

## RADAR relationship

- **RADAR 022 — Spatial UI Track Effect:** spatial-interface research reference.
- **RADAR 023 — Immersive Product Websites / Cinematic Scroll:** product-led cinematic narrative reference.
- Both belong to the future **KYRUMA Experience Library**.

## Current stack readiness

| Capability | Current evidence | Decision |
| --- | --- | --- |
| Motion and microinteractions | Framer Motion, shared motion tokens and reusable reveal/hover/stagger components are active. | Reuse and extend only for a validated case. |
| Reduced motion | `MotionConfig reducedMotion="user"`, `useReducedMotion` and CSS fallbacks exist. | Mandatory baseline for every prototype. |
| 3D/WebGL | Three.js, React Three Fiber and Drei are installed, but no production component imports them. | Available for an isolated prototype; do not move into the core bundle without performance evidence. |
| GSAP / ScrollTrigger | Not installed. | Do not install until a prototype proves a requirement Framer Motion/native scroll cannot meet. |
| Responsive foundations | Fluid layout tokens and mobile breakpoints exist. | Define responsive motion and non-3D fallbacks per pattern. |
| Asset pipeline | No approved 3D asset production pipeline was found. | Define ownership, formats, compression and QA before a real 3D delivery. |

## Experience Library contract

The library begins as a documented research catalogue, not a production component package. A future pattern record contains:

- name, description, category and verified reference;
- technology used and prerequisites;
- performance cost and test budget;
- responsive behaviour;
- accessibility and reduced-motion fallback;
- reusable component and demo references when they exist;
- status: `REFERENCE`, `RESEARCH`, `PROTOTYPE`, `TESTED` or `PRODUCTION READY`.

Initial pattern vocabulary: Product Hero, Product Rotation, Product Explode, Product Assemble, Product Morph, Ingredient Reveal, Material Reveal, Camera Dive, Camera Exit, Spatial Cards, Scroll Pin, Parallax Depth, Cinematic Transition, Interactive CTA, Product Lineup, 3D Device/UI and Spatial UI Track.

No pattern reaches `PRODUCTION READY` without responsive, reduced-motion, keyboard/accessibility and representative low-performance-device testing.

## Prototype gate

`KYRUMA EXPERIENCE LAB — PROTOTYPE 001` remains in backlog. It may start only when:

1. a real product/storytelling problem and owner exist;
2. one primary interaction hypothesis and measurable success criterion are defined;
3. the asset source and licensing are known;
4. performance, responsive and accessibility budgets are agreed;
5. client delivery capacity is not displaced.

The prototype belongs in `prototypes/kyruma-experience-lab/` and must remain isolated from production routes until its gate is approved.

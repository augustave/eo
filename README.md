# Sentinel Vision Systems — EO/IR Detection Suite

**A procedural defense contractor interface concept built entirely with vanilla HTML, CSS, and Canvas 2D.**

No frameworks. No stock photography. No external assets beyond Google Fonts. Every pixel of sensor imagery is generated at runtime through seeded pseudorandom noise functions and fractal Brownian motion.

---

## Concept

Art direction for a fictional defense technology company's product page: a cold, analytical showcase of military computer vision and electro-optical/infrared (EO/IR) detection capabilities. The design language draws from the visual vocabulary of companies like Anduril, Palantir, and L3Harris, treating the interface itself as an expression of computational superiority.

The core tension is intentional: crisp, perfectly aliased vector chrome such as typography, brackets, and bounding boxes set against degraded, lo-fi raster sensor imagery. The persistent red bounding box, `#e8312a`, serves as the universal symbol of algorithmic target acquisition throughout the piece.

### Design Principles

- Extreme digital minimalism: pitch-black void (`#000`) as the dominant surface, content floating in negative space
- Utilitarian typography: IBM Plex Mono and IBM Plex Sans exclusively, sized for function rather than ornament
- Authentic sensor degradation: heavy pixelation, monochrome grayscale mapping, digital noise, scan lines
- Information hierarchy through contrast: white text, red accents, and grayscale imagery are the only palette
- Zero decorative elements: every visual component communicates operational data or system state

---

## Technical Architecture

### Procedural Imagery Pipeline

All sensor feeds are generated through a layered noise system:

```text
Mulberry32 PRNG (seeded, deterministic)
  -> 2D lattice noise (spatial hashing)
    -> Hermite-interpolated smooth noise
      -> Fractal Brownian motion (3-5 octaves)
        -> Per-panel compositing and target injection
```

**Panel 1 — Sub-Pixel Detection**
Near-black sensor noise field with vignette falloff. A hand-placed 2x2 pixel cluster with graduated brightness values simulates a barely resolvable distant target. A red bounding box with four radiating acquisition lines marks the detection.

**Panel 2 — Quad-Split Targeting HUD**
Four independent noise profiles across quadrants simulate different sensor modalities:

- Top-left: terrain overview with higher-contrast fBm and a synthetic horizon line
- Top-right: MWIR with radial thermal return blob for a vehicle-like signature
- Bottom-left: night vision with coarse grain
- Bottom-right: LWIR with a synthetic drone thermal signature

Quad dividers, crosshair overlay, and dual red bounding boxes with confidence labels complete the HUD treatment.

**Panel 3 — Through-Foliage Thermal**
Five-octave terrain noise forms the base layer, with recursive branch generation producing an occluding foliage mask. A human thermal signature is composited behind the branches so darker branch pixels partially attenuate the heat return. A smaller secondary heat patch offsets above the primary body signature.

### Live Detection Canvas

The panoramic feed is animated with `requestAnimationFrame`:

- Terrain: pre-generated `1400x500` fBm noise field cached as `ImageData`
- Targets: eight procedural entities with position, velocity, confidence, label, and track-age state
- Bounding boxes: pulsing opacity for visual liveness
- HUD overlay: rolling timecode, live detection count, telemetry readout
- Scan lines: low-opacity horizontal lines for CRT and sensor texture

### Architecture Diagram

A procedural Canvas node graph renders a four-layer system topology:

```text
SENSOR LAYER       EO Daylight -> MWIR -> LWIR -> SWIR/NV
                          ↓          ↓       ↓        ↓
PROCESSING LAYER   Preprocess --> Detect --> Classify
                                      ↓            ↓
FUSION LAYER       Multi-Hypothesis Tracker (IMM, 512 tracks)
                     ↓        ↓         ↓          ↓
OUTPUT LAYER       CoT/TAK  Link 16  Display  Recording
```

Nodes are drawn with rounded rectangles, directional arrows with trigonometric arrowhead placement, dashed layer separators, and a red accent glow on detection-critical nodes.

---

## Sections

| Section | Type | Key Feature |
|---|---|---|
| Hero | Static | Grid background with radial mask and staggered entrance |
| Sensor Panels | Static Canvas | Three procedural EO/IR feeds with brackets and HUD overlays |
| Stat Bar | Static | Four metric callouts in mono typography |
| Live Detection | Animated Canvas | Real-time target tracking with eight moving entities |
| Processing Pipeline | CSS Grid | Five-stage horizontal pipeline with chevrons |
| Capabilities | CSS Grid | Six cards with SVG icons and metric callouts |
| Architecture | Static Canvas | Four-layer node graph with computed arrows |
| Integrations | Flexbox | Eight platform badges including ATAK and Link 16 |
| Specifications | HTML Table | Ten-row technical spec sheet |
| CTA | Static | Dual-button call to action |
| Footer | Flexbox | ITAR marking and utility links |

---

## Interaction Design

- Scroll reveal: `IntersectionObserver` triggers fade-up animations at 15% viewport threshold
- Scanline: fixed-position `1px` element cycling top-to-bottom on a `6s` loop
- Corner brackets: pseudo-elements using border-width tricks and hover transitions
- Pipeline hover: border and background transitions on each step card
- Capability cards: red accent bar expands on hover
- Target pulse: bounding box opacity modulated by `sin(frame * 0.03 + index)`
- REC indicator: `5px` red dot with CSS blink animation

---

## Typography System

| Role | Family | Weight | Size | Spacing |
|---|---|---|---|---|
| Logo / nav | IBM Plex Mono | 400 | 10-11px | 0.12-0.15em |
| Section eyebrow | IBM Plex Mono | 400 | 10px | 0.3em |
| Hero title | IBM Plex Sans | 300/500 | `clamp(36px, 5.5vw, 72px)` | -0.03em |
| Section title | IBM Plex Sans | 300/500 | `clamp(24px, 3.5vw, 42px)` | -0.02em |
| Body text | IBM Plex Sans | 300 | 13-15px | normal |
| Panel label | IBM Plex Sans | 400 | 14px | -0.01em |
| HUD overlay | IBM Plex Mono | 400 | 8-9px | 0.1em |
| Stat values | IBM Plex Mono | 300 | 36px | -0.03em |
| Spec keys | IBM Plex Mono | 400 | 10px | 0.15em |
| Pipeline numbers | IBM Plex Mono | 400 | 9px | 0.2em |

---

## Color System

```text
Black       #000000   - dominant canvas
Gray-950    #0a0a0a   - panel and card backgrounds
Gray-900    #111111   - subtle surface distinction
Gray-800    #1a1a1a   - borders and dividers
Gray-700    #333333   - structural lines
Gray-600    #444444   - de-emphasized borders
Gray-500    #666666   - tertiary text and metadata
Gray-400    #888888   - secondary body text
Gray-300    #a0a0a0   - nav text and labels
Gray-200    #d0d0d0   - emphasized body text
Gray-100    #f0f0f0   - primary panel text
White       #ffffff   - titles, hero, stat values

Red         #e8312a   - bounding boxes, eyebrows, accents, acquisition markers
Red-dim     rgba(232,49,42,0.12) - scanline, glow, background tinting
```

The gradients in the project are functional rather than decorative, used for the topbar fade, the hero mask, scanline falloff, and sensor glow treatment.

---

## Performance Notes

- Zero external dependencies beyond Google Fonts
- No framework overhead: vanilla DOM, CSS, and Canvas 2D only
- Cached terrain data for the live feed through `putImageData`
- Seeded PRNG so procedural imagery is reproducible across renders
- CSS-only animations where possible, reserving `requestAnimationFrame` for the live feed
- Responsive layout with a single-column collapse below `1080px`

---

## File Structure

```text
index.html
├── semantic page structure and canvas mount points
├── links styles/main.css
└── loads scripts/main.js
styles/
└── main.css
scripts/
└── main.js
README.md
PROJECT_EVALUATION.md
```

---

## Running Locally

Open the entrypoint directly:

```bash
open index.html
```

Or serve it with a simple local HTTP server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000/index.html](http://localhost:8000/index.html).

---

## Context

Built as a portfolio artifact demonstrating production-grade defense aesthetic fluency: the ability to operate inside the visual language of software-defined defense companies without using classified imagery, proprietary design systems, or stock sensor footage. Every visual element is synthesized from first principles.

The procedural approach is the point. It demonstrates the same kind of primitives required for sensor simulation environments, synthetic training data pipelines, and digital twin visualization layers in defense software.

For the current repository assessment and engineering-readiness notes, see [`PROJECT_EVALUATION.md`](/Users/taoconrad/Dev/GitHub%204/Tracking%20Eye/PROJECT_EVALUATION.md).

---

*ITAR notice is fictional. This is a design concept, not a product. No classified or controlled information is represented.*

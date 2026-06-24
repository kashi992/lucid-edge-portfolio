# Lottie Animation Analysis: juan-name-mouse.json

## Quick Answer

**What animation type is it?**
- Neither pure SVG text path stroke animation NOR simple image crossfade
- **Hybrid approach:** SVG vector text (shape groups) animating position/scale + 4 JPEG images crossfading in background

## File Details

| Property | Value |
|----------|-------|
| **Format** | Lottie 5.9.0 (After Effects export) |
| **Duration** | 60 frames at 30fps = 2.00 seconds |
| **Canvas** | 1916px x 233px (wide, thin - perfect for header) |
| **Total File Size** | ~197KB (uncompressed JSON) |
| **Assets** | 5 total: 4 JPEG images + 1 composition reference |

## Assets Breakdown

### Embedded JPEG Images
1. **image_0**: 900x375px, 59KB (frames 0-200)
2. **image_1**: 900x375px, 45KB (frames 30-230)
3. **image_2**: 900x375px, 42KB (frames 15-215)
4. **image_3**: 900x375px, 117KB (frames 45-245)
5. **comp_0**: "projects" composition reference

All images are **base64-encoded inline** in the JSON (not external files).

## Layers (10 total)

### Text Layers (8)
Individual letters from "JuanMora":
- **J** (index 1)
- **u** (index 2)
- **a** (index 3)
- **n** (index 4)
- **M** (index 5)
- **o** (index 6)
- **r** (index 7)
- **a** (index 8)

Each letter:
- Type: Group (ty: 4)
- Visible: frames 0-184
- Contains: 1 shape group with SVG path data
- Animated properties: **position (p), anchor point (a), scale (s)** - all with 3 keyframes

### Effects Layers (2)
- **Mask** (index 9): Rectangle mask, frames 0-200, animates position & scale
- **projects** (index 10): Composition reference, frames 0-200, animates position & scale

## Animation Mechanics

### Frame 0 (Start)
```
Visible: All 8 text letters + Mask + Projects
- Letters at various starting positions
- First JPEG image (image_0) beginning to display
- Mask positioned at x=512, y=117
```

### Frame 30 (Midpoint)
```
- Letters move to middle positions
- Mask moves to x=973
- More images fading in
- Smooth easing between keyframes
```

### Frame 60 (Loop Point)
```
- Letters continue animation toward right edge
- Mask expands/moves right
- All images cycling through crossfade
```

### Keyframe Structure Example (Letter 'J')

**Position (p)** - 3 keyframes with easing:
```json
[
  { "t": 0,  "s": [0, 116, 0],      "i": {...}, "o": {...} },  // Start
  { "t": 30, "s": [0, 116, 0],      "i": {...}, "o": {...} },  // Middle
  { "t": 60, "s": [0, 116, 0],      "i": {...}, "o": {...} }   // End
]
```

**Scale (s)** - 3 keyframes:
```json
[
  { "t": 0,  "s": [35.078, 150, 100] },   // Start small (35%)
  { "t": 30, "s": [150, 150, 100] },      // Middle full (150%)
  { "t": 60, "s": [338.94, 150, 100] }    // End expanded (339%)
]
```

**Anchor Point (a)** - dynamic:
```json
[
  0,        // Start: 0
  77.499,   // Middle: 77.5
  0         // End: 0
]
```

## Visual Timeline

```
Frame 0   [========] 30    [========] 60
|         |              |
Start     Midpoint       Loop
Letters   fully          back to
at left   animated       start
```

## Does it use...?

| Technique | Used? | Details |
|-----------|-------|---------|
| **SVG text with stroke-dashoffset** | NO | Text is rendered as shape groups, no stroke animation |
| **Opacity/fade animation** | NO | No `o` (opacity) keyframes on text |
| **Position animation** | YES | `p` property animates all 8 letters |
| **Scale animation** | YES | `s` property scales letters from 35% to 150% to 339% |
| **Rotation animation** | NO | No `r` (rotation) keyframes |
| **Image crossfade** | YES | 4 JPEGs with staggered in/out points |
| **Mask animation** | YES | Rectangle mask position & scale animated |

## Technical Highlights

1. **SVG Shape Rendering**
   - Each letter is a group containing path shapes
   - Not text elements - full vector path control
   - Fill color applied (solid color, no gradients detected)

2. **Keyframe Easing**
   - All keyframes use Bezier easing
   - Typical values: `i: {x: 0.999, y: 0.999}` (slow in)
   - Typical values: `o: {x: 0.001, y: 0.001}` (fast out)
   - Creates smooth, natural motion

3. **Image Strategy**
   - Different images at different start times = reveals different content
   - Staggered timing creates sequential reveal effect
   - Images are 900x375 (aspect ratio 2.4:1), scaled into 1916x233 canvas

4. **Composition Structure**
   - "projects" layer is a composition reference (comp_0)
   - Likely a nested composition with project thumbnails
   - Separate from main text animation

## Performance Notes

- **Total asset data**: ~263KB (4 JPEGs)
- **JSON overhead**: ~197KB (includes base64 encoding)
- **Rendering**: All SVG paths rendered in browser
- **Optimization**: Could reduce file size by externalizing images vs embedding base64

## File Location

```
https://juanmora.co/documents/juan-name-mouse.json
```

Downloaded: `/d/React projects/juanmora-portfolio/lottie-data.json`

---

**Analysis Generated**: 2026-06-24
**Tool**: Custom Python JSON parser
**Format**: Lottie Animation (AE 2024 export)

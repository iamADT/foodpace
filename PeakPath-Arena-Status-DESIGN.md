---
version: "alpha"
name: "PeakPath Arena Status"
description: "Peakpath Arena Background Effect is designed for delivering a visual treatment or immersive background effect. Key features include atmospheric visuals, motion depth, and flexible presentation layering. It is suitable for visual-first pages, motion studies, and atmospheric hero treatments."
colors:
  primary: "#F6F0DD"
  secondary: "#C9F46B"
  tertiary: "#EFF9E4"
  neutral: "#03110E"
  background: "#03110E"
  surface: "#03110E"
  text-primary: "#F6F0DD"
  text-secondary: "#C9F46B"
  border: "#F6F0DD"
  accent: "#F6F0DD"
typography:
  display-lg:
    fontFamily: "Instrument Serif"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: "72px"
    letterSpacing: "-0.035em"
  body-md:
    fontFamily: "Sora"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.1em"
    textTransform: "uppercase"
spacing:
  base: "4px"
  sm: "1px"
  md: "4px"
  lg: "8px"
  xl: "16px"
  gap: "8px"
  section-padding: "44px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Bounded
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses light mode with #F6F0DD as the main accent and #03110E as the neutral foundation.

- **Primary (#F6F0DD):** Main accent and emphasis color.
- **Secondary (#C9F46B):** Supporting accent for secondary emphasis.
- **Tertiary (#EFF9E4):** Reserved accent for supporting contrast moments.
- **Neutral (#03110E):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #03110E; Surface: #03110E; Text Primary: #F6F0DD; Text Secondary: #C9F46B; Border: #F6F0DD; Accent: #F6F0DD

## Typography

Typography pairs Instrument Serif for display hierarchy with Sora for supporting content and interface copy.

- **Display (`display-lg`):** Instrument Serif, 72px, weight 400, line-height 72px, letter-spacing -0.035em.
- **Body (`body-md`):** Sora, 12px, weight 600, line-height 16px, letter-spacing 0.1em, uppercase.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, bounded structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Bounded
- **Base unit:** 4px
- **Scale:** 1px, 4px, 8px, 16px, 32px, 40px, 48px
- **Section padding:** 44px
- **Gaps:** 8px, 12px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #F6F0DD
- **Shadows:** rgba(255, 255, 255, 0.043) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.22) 0px 12px 38px 0px; rgba(246, 240, 221, 0.05) 0px 1px 0px 0px inset
- **Blur:** 16px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 32px radius. Drive the shell with linear-gradient(rgba(246, 240, 221, 0.067), rgba(246, 240, 221, 0.024)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 31px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 31px, 32px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Component styling should inherit the shared button, icon, spacing, and surface rules instead of inventing one-off treatments. Favor a small family of repeatable patterns for actions, content containers, and fields.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 31px, 32px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected minimal motion intensity without a deliberate reason.

## Motion

Motion stays restrained and interface-led across text, layout, and scroll transitions. Easing favors ease. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** minimal

**Easings:** ease

**Scroll Patterns:** gsap-scrolltrigger

## WebGL

Reconstruct the graphics as a full-bleed background field using webgl, renderer, alpha, antialias, dpr clamp, custom shaders. The effect should read as technical, meditative, and atmospheric: dot-matrix particle field with black and sparse spacing. Build it from dot particles + soft depth fade so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Dot-matrix particle field
  - **Primitives:**
    - **Value:** Dot particles + soft depth fade
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** WebGL, Renderer, alpha, antialias, DPR clamp, custom shaders

**Techniques:** Dot matrix, Breathing pulse, Pointer parallax, Shader gradients, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL Background -->
      <canvas id="webgl-canvas" class="fixed inset-0 w-full h-full z-0 pointer-events-none"></canvas>

      <!-- Main Card Container -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      // --- 0. Init WebGL Background ---
      const initWebGL = () => {
          const canvas = document.getElementById('webgl-canvas');
          if (!canvas) return;
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          const scene = new THREE.Scene();
      …
      ```

## ThreeJS

Reconstruct the Three.js layer as a full-bleed background field with layered spatial depth that feels technical. Use alpha, antialias, dpr clamp renderer settings, orthographic projection, plane geometry, shadermaterial materials, and ambient + key + rim lighting. Motion should read as slow orbital drift, with poster frame + dom fallback.

**Id:** threejs

**Label:** ThreeJS

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field with layered spatial depth
  - **Render:**
    - **Value:** alpha, antialias, DPR clamp
  - **Camera:**
    - **Value:** Orthographic projection
  - **Lighting:**
    - **Value:** ambient + key + rim
  - **Materials:**
    - **Value:** ShaderMaterial
  - **Geometry:**
    - **Value:** plane
  - **Motion:**
    - **Value:** Slow orbital drift

**Techniques:** Shader materials, Timeline beats, alpha, antialias, DPR clamp, Poster frame + DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL Background -->
      <canvas id="webgl-canvas" class="fixed inset-0 w-full h-full z-0 pointer-events-none"></canvas>

      <!-- Main Card Container -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      // --- 0. Init WebGL Background ---
      const initWebGL = () => {
          const canvas = document.getElementById('webgl-canvas');
          if (!canvas) return;
          const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          const scene = new THREE.Scene();
      …
      ```

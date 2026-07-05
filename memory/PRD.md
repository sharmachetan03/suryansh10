# PRD — Suryansh's 10th Birthday Xbox-Themed Invitation

## Original Problem Statement
Single-page Xbox-themed birthday-party invitation for Suryansh's 10th birthday lunch. Deep matte black + neon Xbox green (#107C10) theme. Includes an anti-gravity HTML5 canvas physics playground of floating gaming icons (Xbox, controllers, COD/DOOM/NFS logos, skulls, flames), a "Gravity Override" toggle, a warm invitation message, event schedule tiles, and an Xbox "Join Lobby" RSVP form whose submission opens a pre-filled WhatsApp message to +91 99800 11330.

## User Personas
- **Family & friends invitees** — receive the link, read the invitation, and submit RSVP via WhatsApp on mobile or desktop.
- **Host (parent)** — receives structured RSVP responses in WhatsApp with name, attendance, guest count, and notes.

## Core Requirements (static)
- Xbox Series X premium visual language (matte black, Xbox neon green accents).
- HTML5 Canvas physics with true zero-gravity floating icons; click/drag interactivity; edge bouncing.
- Gravity Override toggle (Zero-G ↔ normal gravity).
- Event details clearly displayed: Sunday 26 July 2026 · Desi Masala, RR Nagar, Bangalore · 12PM arrival · 12:30PM cake · 1PM lunch.
- Warm, humble invitation copy (Suryansh turning 10, family blessings).
- Xbox "Join Lobby" styled RSVP form: Name, Yes/No, Guest count (1–10), Notes.
- Submit → opens `https://wa.me/919980011330?text=<URL-encoded message>` in new tab.

## What's Been Implemented (as of 2026-07)
- **2026-07** Full single-page invitation built:
  - `matter-js` physics hero with 15+ floating SVG bodies (Xbox logo, controllers, skulls, flames, cars, and text logos for XBOX/CALL OF DUTY/DOOM/NEED SPEED).
  - Gravity Override toggle (`data-testid="gravity-toggle"`) with animated HUD switch.
  - Bento-grid dashboard layout: message card, player card (photo placeholder for Suryansh), 3 schedule tiles.
  - RSVP form with sonner toast on validation, opens WhatsApp via `window.open`.
  - Rajdhani + Chakra Petch typography via Google Fonts.
  - Testing agent iteration_1: 9/9 scenarios passed (frontend + WhatsApp URL integration).

## Prioritized Backlog
- **P1** Replace avatar-slot placeholder with Suryansh's actual photo (user will upload).
- **P2** Add subtle Xbox startup sound on Gravity Override activation.
- **P2** Add background ambient music toggle.
- **P2** Countdown timer to July 26 2026.
- **P3** Personalised RSVP links per guest (?name=… prefill).

## Next Tasks
- Await user's photo of Suryansh, wire it into the Player Card.

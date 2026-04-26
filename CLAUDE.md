# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NexTMinimaL is a BeamNG.drive dashboard mod — a suite of four in-game UI apps backed by a Lua vehicle extension. It reads live physics and vehicle config from BeamNG and displays real-time telemetry: torque/power curves with N2O morphing, engine damage diagnostics, adaptive tachometer, and a drivetrain/starter panel.

## Development Workflow

No build step exists. Changes are hot-reloaded inside a running BeamNG session:

- **Lua changes**: Open BeamNG console (`~`) and run `extensions.reload("nextMinimalDNA")`
- **JS/CSS changes**: Press `Ctrl+L` in-game to reload all UI apps
- **Full refresh**: Respawn the vehicle — triggers `onExtensionLoaded`, `TorqueCurveChanged`, and a fresh `NexTMinimaL_DNA` push

## Architecture

### Data Flow

```
BeamNG Engine
  ├─ streamsUpdate (60 Hz)      → all app.js files (RPM, torque, power, electrics)
  ├─ TorqueCurveChanged         → NextMinimalTorque (curve arrays)
  └─ vehicle spawn / reset
       └─ nextMinimalDNA.lua
            ├─ guihooks.trigger("NexTMinimaL_DNA", dna)         → all apps
            ├─ guihooks.trigger("NexTMinimaL_Assists", assists)  → Starter
            └─ guihooks.trigger("NexTMinimaL_SystemsUpdate", …)  → Starter
```

JS calls back to Lua via `bngApi.activeObjectLua('extensions.nextMinimalDNA.<fn>()')`.

### Lua Extension (`lua/vehicle/extensions/auto/nextMinimalDNA.lua`)

Auto-loaded by BeamNG for every vehicle. Key responsibilities:

- `buildDNA()` — assembles the vehicle spec object sent to all UI apps
- `collectEngineData()` / `scanForcedInduction()` — engine type, displacement, turbo/SC detection
- `classifyTransmission()` — identifies manual, auto, DCT, CVT, sequential from JBeam type names
- `buildN2OBoostCurve()` / `updateEmpiricalSampling()` — constructs N2O boost array; empirical sampling collects WOT peak-hold deltas during active N2O
- `handleTorqueCurveResponse()` — two-phase N2O fetch: first call uses `cutInRPM=2000` (extended region estimate), second call uses real `cutInRPM`
- `updateDrivetrainSnapshot()` / `applyDrivetrainSnapshot()` — persists drivetrain state across vehicle resets
- `probeAuxDriver()` — detects electronically-driven auxiliary lights by watching electrics state changes
- `M.updateGFX()` — per-frame hook; runs empirical sampling and pushes DNA every 100 ms

### UI Apps (`ui/modules/apps/`)

All four apps are AngularJS directives registered with `angular.module('beamng.apps').directive()`. Each app folder contains `app.js` (logic + embedded CSS), `app.json` (BeamNG manifest).

| App | Purpose | Key complexity |
|-----|---------|----------------|
| `NextMinimalTorque` | Torque/power curve chart with N2O ripple morph | N2O morph FSM (idle→expanding→active→fading), two-phase curve fetch, empirical envelope polylines, three size modes |
| `NexTMinimalDamage` | Engine health diagnostics | Multiplicative integrity cascade; hard blocks (disabled/melted/locked/hydrolocked) set integrity=0 before cascade |
| `NextMinimalTacho` | Adaptive tachometer | Dynamic layout based on detected hardware (turbo, SC, N2O, fuel type) |
| `NextMinimalStarter` | Engine starter + drivetrain control | Ignition FSM (OFF→ACC→IGN→START→RUN), drivetrain chips, launch/N2O controls |

### N2O Visualization Details

The torque curve app uses two polyline layers:
1. **Base curve** (dashed) — NA/turbo/SC only, no N2O contribution
2. **Live envelope** (solid) — empirically collected peak-hold during WOT

N2O boost is shown as the delta `boostedCurve − baseCurve`, not a formula estimate. The ripple morph animates outward from the trigger RPM when N2O activates.

### Damage Cascade Model

Damage is multiplicative, not additive. Hard-block conditions (engine disabled, melted, locked, hydrolocked) force `integrity = 0` and skip the cascade. Remaining components apply multipliers from `0.40` (catastrophic: broken pistons/bearings) down to `0.97` (minor: small coolant leak).

### CSS Conventions

All CSS lives inline as `<style>` blocks inside `app.js`. Color scheme: `#00d4ff` (cyan) for normal state, `#ffaa00` (orange) for warnings. Size modes are toggled via `.nxt-sz-compact` and `.nxt-sz-ultra` classes on the root element. CSS custom properties (`--color-success`, `--color-warning`, `--color-error`, `--transition-fast`) are defined at the `:root` level.

## BeamNG Reference Code

Two directories on the Desktop contain BeamNG's own source code — use them to understand available APIs, event names, and patterns before inventing new ones.

- `C:\Users\bryan\OneDrive\Escritorio\lua` — BeamNG's built-in Lua scripts (`vehicle/`, `ge/`, `common/`, etc.). Consult these to find what functions and hooks the engine exposes to vehicle extensions.
- `C:\Users\bryan\OneDrive\Escritorio\apps` — BeamNG's built-in UI apps (TorqueCurve, EngineDebug, SimpleDash, etc.). Consult these to understand `streamsUpdate` stream keys, `bngApi` calls, and AngularJS patterns used by the game.

## Key Files

- `lua/vehicle/extensions/auto/nextMinimalDNA.lua` — entire Lua backend (~1415 lines)
- `ui/modules/apps/NextMinimalTorque/app.js` — most complex UI app (~984 lines)
- `documentation/issues.md` — technical debts (TD-1 through TD-6) and resolved bug history
- `documentation/N2O_PROGRESS.md` — N2O implementation log and architecture notes

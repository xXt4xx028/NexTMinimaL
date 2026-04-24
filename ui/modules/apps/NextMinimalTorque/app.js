// NexTMinimaL — Torque Pro v4.0
// Envelope system: dots are authority, curves adapt to real physics.
// N2O: empirical boost from WOT peak-hold sampling (no addedPower needed).
// Morph: ripple wave anchored to activation RPM. Fallback to formula if no N2O samples yet.

var NXT_TQ_CSS = [
  ':root{--color-success:#3ddc84;--color-warning:#ffaa00;--color-error:#ef4444;--color-text-muted:rgba(255,255,255,0.4);--transition-fast:all 0.2s ease}',
  '.nxt-tq-root{width:100%;height:100%;pointer-events:auto;user-select:none;font-family:"Consolas","Courier New",monospace;overflow:hidden}',
  '.nxt-tq-panel{width:100%;height:100%;background:rgba(0,0,0,0.85);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:8px;box-sizing:border-box;display:flex;flex-direction:column;gap:6px;box-shadow:0 8px 32px rgba(0,0,0,0.8)}',

  /* Region 1: Top Stats */
  '.nxt-tq-top{display:flex;flex-direction:column;gap:4px;flex-shrink:0}',
  '.nxt-tq-hero{display:flex;gap:4px}',
  '.nxt-tq-metric{flex:1;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.05);padding:6px 10px;display:flex;flex-direction:column;justify-content:center;border-radius:2px;min-height:0}',
  '.nxt-tq-k{font-size:8px;letter-spacing:0.25em;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:2px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
  '.nxt-tq-v{font-size:28px;font-weight:400;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-0.03em}',
  '.nxt-tq-vu{font-size:10px;opacity:0.4;margin-left:4px;font-weight:700;letter-spacing:0.1em}',

  '.nxt-tq-meta{display:flex;flex-wrap:wrap;gap:12px;align-items:center;background:rgba(255,255,255,0.02);padding:5px 8px;border:1px solid rgba(255,255,255,0.05);border-radius:2px;min-height:0}',
  '.nxt-tq-chip{font-size:8px;letter-spacing:0.15em;padding:3px 6px;border:1px solid;border-radius:2px;text-transform:uppercase;transition:var(--transition-fast);white-space:nowrap;font-weight:700;margin-left:auto}',

  '.nxt-tq-stat{display:flex;align-items:baseline;gap:5px}',
  '.nxt-tq-sk{font-size:8px;letter-spacing:0.15em;color:rgba(255,255,255,0.4);font-weight:700}',
  '.nxt-tq-sv{font-size:12px;font-weight:400;font-variant-numeric:tabular-nums}',

  '.nxt-chip-ok  {color:var(--color-success);border-color:rgba(61,220,132,0.35);background:rgba(61,220,132,0.05)}',
  '.nxt-chip-warn{color:var(--color-warning);border-color:rgba(255,170,0,0.4);background:rgba(255,170,0,0.06)}',
  '.nxt-chip-crit{color:var(--color-error);border-color:rgba(239,68,68,0.4);background:rgba(239,68,68,0.06)}',
  '.nxt-chip-unk {color:var(--color-text-muted);border-color:rgba(255,255,255,0.15);background:transparent}',
  '.nxt-chip-n2o {color:#00d4ff;border-color:rgba(0,212,255,0.5);background:rgba(0,212,255,0.1);animation:n2o-pulse 0.8s ease-in-out infinite alternate}',
  '@keyframes n2o-pulse{from{opacity:0.7}to{opacity:1}}',
  '.nxt-tq-n2o-delta{font-size:8px;color:#00d4ff;margin-top:2px;font-weight:700;letter-spacing:0.05em}',
  '.nxt-sz-compact .nxt-tq-n2o-delta{font-size:6px}',

  /* Region 2: Graph */
  '.nxt-tq-chart{position:relative;flex:10 0 40px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.04);border-radius:2px;min-height:0;overflow:hidden}',
  '.nxt-tq-svg{width:100%;height:100%;display:block}',

  /* Region 3: Ref Strip */
  '.nxt-tq-ref{display:flex;justify-content:center;gap:16px;padding:5px 0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:2px;flex-shrink:0}',
  '.nxt-tq-leg-item{display:flex;align-items:center;gap:5px;font-size:7.5px;letter-spacing:0.1em;font-weight:700;white-space:nowrap}',
  '.nxt-tq-leg-val{font-size:9px;font-weight:400;font-variant-numeric:tabular-nums;opacity:0.9}',
  '.nxt-tq-leg-line{width:14px;height:0;border-top:2px solid currentColor}',
  '.nxt-tq-leg-dash{width:14px;height:0;border-top:2px dashed currentColor}',

  /* Colors */
  '.nxt-c-hp{color:#00d4ff}',
  '.nxt-c-tq{color:#ffaa00}',
  '.nxt-delta-ok{color:#3ddc84}',
  '.nxt-delta-warn{color:#ffaa00}',
  '.nxt-delta-crit{color:#ef4444}',

  /* COMPACT MODE */
  '.nxt-sz-compact .nxt-tq-panel{padding:4px;gap:4px}',
  '.nxt-sz-compact .nxt-tq-top{gap:2px}',
  '.nxt-sz-compact .nxt-tq-hero{gap:2px}',
  '.nxt-sz-compact .nxt-tq-metric{padding:4px 6px}',
  '.nxt-sz-compact .nxt-tq-v{font-size:20px}',
  '.nxt-sz-compact .nxt-tq-vu{font-size:8px}',
  '.nxt-sz-compact .nxt-tq-k{font-size:6px;margin-bottom:1px}',
  '.nxt-sz-compact .nxt-tq-meta{padding:3px 6px;gap:6px}',
  '.nxt-sz-compact .nxt-tq-sk{font-size:6px}',
  '.nxt-sz-compact .nxt-tq-sv{font-size:10px}',
  '.nxt-sz-compact .nxt-tq-chip{font-size:6px;padding:2px 4px}',
  '.nxt-sz-compact .nxt-tq-ref{padding:3px 0;gap:8px}',
  '.nxt-sz-compact .nxt-tq-leg-item{font-size:6px}',
  '.nxt-sz-compact .nxt-tq-leg-val{font-size:7px}',

  /* ULTRA COMPACT MODE */
  '.nxt-sz-ultra .nxt-tq-panel{padding:2px;gap:2px}',
  '.nxt-sz-ultra .nxt-tq-metric{padding:2px 4px;flex-direction:row;align-items:baseline;justify-content:space-between}',
  '.nxt-sz-ultra .nxt-tq-v{font-size:16px}',
  '.nxt-sz-ultra .nxt-tq-vu{font-size:6px}',
  '.nxt-sz-ultra .nxt-tq-k{display:none}',
  '.nxt-sz-ultra .nxt-tq-meta{display:none}',
  '.nxt-sz-ultra .nxt-tq-ref{padding:2px 0;gap:6px;border:none;background:transparent}',
  '.nxt-sz-ultra .nxt-tq-leg-text{display:none}',
  '.nxt-sz-ultra .nxt-svg-labels{opacity:0.3}'
].join('');

var NXT_TQ_SVG_DEFS = [
  '<g class="nxt-svg-labels">',
  '<text x="2" y="10" font-size="7" fill="rgba(255,255,255,0.7)" font-weight="700" font-family="Consolas,monospace" alignment-baseline="middle" dominant-baseline="middle" ng-bind="chart.yTop"></text>',
  '<text x="2" y="36.7" font-size="7" fill="rgba(255,255,255,0.7)" font-weight="700" font-family="Consolas,monospace" alignment-baseline="middle" dominant-baseline="middle" ng-bind="chart.yHigh"></text>',
  '<text x="2" y="63.3" font-size="7" fill="rgba(255,255,255,0.7)" font-weight="700" font-family="Consolas,monospace" alignment-baseline="middle" dominant-baseline="middle" ng-bind="chart.yLow"></text>',
  '<text x="2" y="90" font-size="7" fill="rgba(255,255,255,0.7)" font-weight="700" font-family="Consolas,monospace" alignment-baseline="middle" dominant-baseline="middle">0</text>',
  '<text x="22" y="95" font-size="7" fill="rgba(255,255,255,0.6)" font-weight="700" font-family="Consolas,monospace" text-anchor="middle" alignment-baseline="hanging" dominant-baseline="hanging">0</text>',
  '<text ng-attr-x="{{chart.xL1x}}" y="95" font-size="7" fill="rgba(255,255,255,0.6)" font-weight="700" font-family="Consolas,monospace" text-anchor="middle" alignment-baseline="hanging" dominant-baseline="hanging" ng-bind="chart.xL1"></text>',
  '<text ng-attr-x="{{chart.xL2x}}" y="95" font-size="7" fill="rgba(255,255,255,0.6)" font-weight="700" font-family="Consolas,monospace" text-anchor="middle" alignment-baseline="hanging" dominant-baseline="hanging" ng-bind="chart.xL2"></text>',
  '<text ng-attr-x="{{chart.xLmaxX}}" y="95" font-size="7" fill="rgba(255,255,255,0.6)" font-weight="700" font-family="Consolas,monospace" text-anchor="end" alignment-baseline="hanging" dominant-baseline="hanging" ng-bind="chart.xLmax"></text>',
  '</g>',

  '<g class="nxt-svg-grid">',
  '<line x1="22" y1="10" x2="262" y2="10" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>',
  '<line x1="22" y1="36.7" x2="262" y2="36.7" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>',
  '<line x1="22" y1="63.3" x2="262" y2="63.3" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>',
  '<line x1="22" y1="90" x2="262" y2="90" stroke="rgba(255,255,255,0.2)"  stroke-width="0.8" vector-effect="non-scaling-stroke"/>',
  '<line ng-attr-x1="{{chart.vg1}}" y1="10" ng-attr-x2="{{chart.vg1}}" y2="90" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>',
  '<line ng-attr-x1="{{chart.vg2}}" y1="10" ng-attr-x2="{{chart.vg2}}" y2="90" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>',
  '</g>',

  '<polyline ng-attr-points="{{chart.hpBasePts}}" fill="none" stroke="rgba(0,212,255,0.3)" stroke-width="1.5" stroke-dasharray="4,4" vector-effect="non-scaling-stroke"/>',
  '<polyline ng-attr-points="{{chart.tqBasePts}}" fill="none" stroke="rgba(255,170,0,0.3)" stroke-width="1.5" stroke-dasharray="4,4" vector-effect="non-scaling-stroke"/>',
  '<polyline ng-attr-points="{{chart.tqLivePts}}" fill="none" stroke="#ffaa00" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>',
  '<polyline ng-attr-points="{{chart.hpLivePts}}" fill="none" stroke="#00d4ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>',

  '<line ng-attr-x1="{{chart.cursorX}}" y1="10" ng-attr-x2="{{chart.cursorX}}" y2="90" stroke="rgba(255,255,255,0.5)" stroke-width="1" stroke-dasharray="3,2" vector-effect="non-scaling-stroke"/>',
  '<circle ng-attr-cx="{{chart.cursorX}}" ng-attr-cy="{{chart.dotHpY}}" r="3.5" fill="#00d4ff" stroke="rgba(0,0,0,0.8)" stroke-width="1" vector-effect="non-scaling-stroke"/>',
  '<circle ng-attr-cx="{{chart.cursorX}}" ng-attr-cy="{{chart.dotTqY}}" r="3.5" fill="#ffaa00" stroke="rgba(0,0,0,0.8)" stroke-width="1" vector-effect="non-scaling-stroke"/>'
].join('');

var NXT_TQ_TEMPLATE =
'<div class="bngApp nxt-tq-root">' +
  '<div class="nxt-tq-panel" ng-class="{\'nxt-sz-compact\': ui.isCompact, \'nxt-sz-ultra\': ui.isUltra}">' +

    '<div class="nxt-tq-top">' +
      '<div class="nxt-tq-hero">' +
        '<div class="nxt-tq-metric">' +
          '<div class="nxt-tq-k">LIVE POWER</div>' +
          '<div class="nxt-tq-v nxt-c-hp">{{d.hp | number:0}}<span class="nxt-tq-vu">HP</span></div>' +
          '<div class="nxt-tq-n2o-delta" ng-if="d.n2oBoostHp > 5">+{{d.n2oBoostHp | number:0}} HP</div>' +
        '</div>' +
        '<div class="nxt-tq-metric">' +
          '<div class="nxt-tq-k">TORQUE</div>' +
          '<div class="nxt-tq-v nxt-c-tq">{{d.tq | number:0}}<span class="nxt-tq-vu">NM</span></div>' +
          '<div class="nxt-tq-n2o-delta" ng-if="d.n2oBoostTq > 5">+{{d.n2oBoostTq | number:0}} NM</div>' +
        '</div>' +
      '</div>' +
      '<div class="nxt-tq-meta">' +
        '<div class="nxt-tq-stat"><span class="nxt-tq-sk">PK TQ</span><span class="nxt-tq-sv nxt-c-tq">{{d.peakTq | number:0}}</span></div>' +
        '<div class="nxt-tq-stat"><span class="nxt-tq-sk">PK HP</span><span class="nxt-tq-sv nxt-c-hp">{{d.peakHp | number:0}}</span></div>' +
        '<div class="nxt-tq-stat"><span class="nxt-tq-sk">&#916; BASE</span><span class="nxt-tq-sv" ng-class="d.deltaClass">{{d.delta | number:1}}%</span></div>' +
        '<div class="nxt-tq-chip-wrap">' +
          '<span class="nxt-tq-chip" ng-class="d.chipClass">{{d.state}}</span>' +
          '<span class="nxt-tq-chip nxt-chip-n2o" ng-if="d.n2oActive">N2O</span>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="nxt-tq-chart">' +
      '<svg class="nxt-tq-svg" viewBox="0 0 262 100" preserveAspectRatio="none">' +
        NXT_TQ_SVG_DEFS +
      '</svg>' +
    '</div>' +

    '<div class="nxt-tq-ref">' +
      '<span class="nxt-tq-leg-item" style="color:rgba(255,255,255,0.7)"><span class="nxt-tq-leg-dash"></span><span class="nxt-tq-leg-text">BASE</span></span>' +
      '<span class="nxt-tq-leg-item nxt-c-hp"><span class="nxt-tq-leg-line"></span><span class="nxt-tq-leg-text">HP</span> <span class="nxt-tq-leg-val">{{d.baseHpMax | number:0}}</span></span>' +
      '<span class="nxt-tq-leg-item nxt-c-tq"><span class="nxt-tq-leg-line"></span><span class="nxt-tq-leg-text">TQ</span> <span class="nxt-tq-leg-val">{{d.baseTqMax | number:0}}</span></span>' +
    '</div>' +

  '</div>' +
'</div>';

angular.module('beamng.apps').directive('nextMinimalTorque', ['$timeout', '$window', function($timeout, $window) {
  return {
    template: NXT_TQ_TEMPLATE,
    replace: true,
    restrict: 'EA',
    link: function(scope, element) {
      if (!document.getElementById('nxt-tq-css')) {
        var s = document.createElement('style');
        s.id = 'nxt-tq-css';
        s.textContent = NXT_TQ_CSS;
        document.head.appendChild(s);
      }
      StreamsManager.add(['electrics', 'engineInfo', 'powertrainDeviceData']);

      // Unified Geometry
      var CX0 = 22, CW = 240, CY0 = 10, CH = 80;
      // hpCurve / tqCurve: raw game data from TorqueCurveChanged (used as seed + fallback)
      var hpCurve = [], tqCurve = [], maxRpm = 7000, globalMax = 1;

      var lastSmoothTorque = 0, lastSmoothPower = 0, ALPHA = 0.25;

      scope.d = { hp: 0, tq: 0, peakHp: 0, peakTq: 0, state: 'UNKNOWN', chipClass: 'nxt-chip-unk', delta: 0, deltaClass: 'nxt-delta-ok', baseHpMax: 0, baseTqMax: 0, n2oInfo: null, n2oActive: false, n2oBoostTq: 0, n2oBoostHp: 0 };
      scope.ui = { isCompact: false, isUltra: false };

      var lastDamage = null, maxDamagePriority = 0;

      function updateLayout() {
        $timeout(function() {
          if (!element || !element[0]) return;
          var h = element[0].offsetHeight;
          var w = element[0].offsetWidth;
          scope.ui.isUltra   = (h < 140 || w < 300);
          scope.ui.isCompact = (!scope.ui.isUltra && (h < 220 || w < 400));
        });
      }
      angular.element($window).on('resize', updateLayout);

      function getDamageFactor(data) {
        if (!data) return 1.0;
        var eng = data.engine || {}, pwt = data.powertrain || {};
        if (eng.engineDisabled) return 0.0;
        if (eng.engineLockedUp || eng.engineHydrolocked || eng.blockMelted || eng.catastrophicOverrevDamage || eng.catastrophicOverTorqueDamage || pwt.mainEngine) { maxDamagePriority = Math.max(maxDamagePriority, 2); return 0.35; }
        if (eng.engineReducedTorque || eng.starvedOfOil || eng.pistonRingsDamaged || eng.rodBearingsDamaged || eng.headGasketDamaged) { maxDamagePriority = Math.max(maxDamagePriority, 1); return 0.65; }
        if (eng.mildOverrevDamage || eng.mildOverTorqueDamage || eng.overRevDanger || eng.overTorqueDanger || eng.turbochargerHot || eng.coolantOverheating || eng.oilOverheating || eng.radiatorLeak || eng.oilpanLeak || eng.inductionSystemDamaged || eng.impactDamage) { maxDamagePriority = Math.max(maxDamagePriority, 1); return 0.85; }
        return 1.0;
      }

      scope.chart = { hpBasePts: '', tqBasePts: '', hpLivePts: '', tqLivePts: '', cursorX: CX0, dotHpY: CY0 + CH, dotTqY: CY0 + CH, yTop: '—', yHigh: '—', yLow: '—', vg1: CX0 + CW * 0.333, vg2: CX0 + CW * 0.666, xL1: '', xL1x: 0, xL2: '', xL2x: 0, xLmax: '', xLmaxX: 0 };
      scope.$on('DamageData', function(ev, data) { lastDamage = data; });

      function valueToY(v) {
        var y = (CY0 + CH) - (v / globalMax) * CH;
        return Math.max(CY0, Math.min(CY0 + CH, y));
      }

      // Interpolate from a legacy-format array (length != maxRpm+1)
      function getCurveValue(arr, rpm) {
        if (!arr || arr.length === 0) return 0;
        var idx = (rpm / maxRpm) * (arr.length - 1);
        var i1 = Math.floor(idx);
        var i2 = Math.min(Math.ceil(idx), arr.length - 1);
        var frac = idx - i1;
        return (arr[i1] * (1 - frac)) + (arr[i2] * frac);
      }

      // Build SVG path from legacy-format array with uniform scale
      function buildPathFromArray(arr, scaleFactor) {
        var pts = [], step = Math.max(1, Math.floor(maxRpm / 60));
        for (var rpm = 0; rpm <= maxRpm; rpm += step) {
          var v = getCurveValue(arr, rpm) * scaleFactor;
          pts.push((CX0 + (rpm / maxRpm) * CW).toFixed(1) + ',' + valueToY(v).toFixed(1));
        }
        if (arr.length > 0) {
          var vLast = getCurveValue(arr, maxRpm) * scaleFactor;
          pts.push((CX0 + CW).toFixed(1) + ',' + valueToY(vLast).toFixed(1));
        }
        return pts.join(' ');
      }

      // ─── ENVELOPE SYSTEM ──────────────────────────────────────────────────────
      // Docs: both arrays are sparse, keyed by integer RPM (0..maxRpm).
      // envelopeBase    = peak-hold torque samples at WOT with N2O OFF
      // envelopeN2OFull = peak-hold torque samples at WOT with N2O ON
      // renderTqBase / renderHpBase    = densified+smoothed, length maxRpm+1
      // renderBoostTq / renderBoostHp  = empirical N2O delta (N2OFull - Base)
      // Envelope: envelopeBase = WOT peak-hold torque (N2O OFF or below cutIn).
      // N2O boost is derived from TorqueCurveChanged curve diff — no envelopeN2OFull needed.
      var envelopeBase    = [];
      var renderTqBase    = [];
      var renderHpBase    = [];
      var renderBoostTq   = [];
      var renderBoostHp   = [];
      var envelopeTqMax   = 0;
      var envelopeBoostMax = 0;
      var curveDirty      = false;
      var lastCurveBuild  = 0;
      var CURVE_REBUILD_MS = 250;
      var prevSampleRpm   = 0;

      // Sample raw torque into the base envelope (WOT only, peak-hold).
      // N2O boost is now derived from TorqueCurveChanged curve diff — no N2O sampling needed here.
      function updateEnvelope(rpm, torque, n2oActive, engineLoad, engineRunning) {
        if (!engineRunning) return;
        if (engineLoad < 0.92) return;
        if (rpm < 800 || rpm > maxRpm) return;
        if (torque <= 0) return;

        var rpmDelta = Math.abs(rpm - prevSampleRpm);
        prevSampleRpm = rpm;
        if (rpmDelta > 300) return;

        // When N2O is active, rawTq includes boost — only trust base samples below cutInRPM
        // where the game isn't actually adding boost yet.
        if (n2oActive && rpm >= n2oData.cutInRPM) return;

        var i = Math.floor(rpm);
        if (!envelopeBase[i] || torque > envelopeBase[i]) {
          envelopeBase[i] = torque;
          curveDirty = true;
        }
      }

      // Fill gaps between known samples via linear interpolation
      function densifyCurve(sparse, maxR) {
        var dense = new Array(maxR + 1);
        var lastIdx = -1, lastVal = 0;
        for (var rpm = 0; rpm <= maxR; rpm++) {
          if (sparse[rpm] !== undefined && sparse[rpm] > 0) {
            if (lastIdx >= 0 && rpm - lastIdx > 1) {
              var gap = rpm - lastIdx;
              for (var j = 1; j < gap; j++) {
                var t = j / gap;
                dense[lastIdx + j] = lastVal * (1 - t) + sparse[rpm] * t;
              }
            }
            dense[rpm] = sparse[rpm];
            lastIdx = rpm;
            lastVal = sparse[rpm];
          }
        }
        if (lastIdx >= 0) {
          for (var k = lastIdx + 1; k <= maxR; k++) dense[k] = lastVal;
        }
        for (var m = 0; m <= maxR; m++) {
          if (dense[m] === undefined) dense[m] = 0; else break;
        }
        return dense;
      }

      // Reject isolated spikes: if a point is more than maxRatio times its neighbors' average,
      // replace it with the neighbor average. Runs before smoothing.
      function rejectSpikes(arr, maxRatio) {
        var result = arr.slice();
        for (var i = 2; i < arr.length - 2; i++) {
          var neighbors = ((arr[i-2] || 0) + (arr[i-1] || 0) + (arr[i+1] || 0) + (arr[i+2] || 0)) / 4;
          if (neighbors > 20 && arr[i] > neighbors * maxRatio) {
            result[i] = neighbors;
          }
        }
        return result;
      }

      // Moving-average smoothing — windowHalf = ±RPM radius
      function smoothCurve(dense, windowHalf) {
        var result = new Array(dense.length);
        for (var i = 0; i < dense.length; i++) {
          var sum = 0, count = 0;
          var lo = Math.max(0, i - windowHalf);
          var hi = Math.min(dense.length - 1, i + windowHalf);
          for (var j = lo; j <= hi; j++) {
            if (dense[j] > 0) { sum += dense[j]; count++; }
          }
          result[i] = count > 0 ? sum / count : 0;
        }
        return result;
      }

      // Rebuild base render arrays from envelope. Called at most every CURVE_REBUILD_MS.
      // N2O boost arrays (renderBoostTq/Hp) are set directly by TorqueCurveChanged — not here.
      function rebuildRenderCurves() {
        var dense   = densifyCurve(envelopeBase, maxRpm);
        var deSpike = rejectSpikes(dense, 1.35);
        renderTqBase = smoothCurve(deSpike, 120);

        var tqMax = 0;
        renderHpBase = new Array(maxRpm + 1);
        renderHpBase[0] = 0;
        for (var i = 1; i <= maxRpm; i++) {
          var tqv = renderTqBase[i] || 0;
          renderHpBase[i] = (tqv * i) / 7127;
          if (tqv > tqMax) tqMax = tqv;
        }
        envelopeTqMax = tqMax;

        curveDirty = false;
        lastCurveBuild = performance.now();
      }

      // Envelope accessors — safe with fallback to legacy curve
      function getEnvelopeTqAt(rpm) {
        if (renderTqBase && renderTqBase.length > maxRpm) {
          var i = Math.floor(rpm);
          return (i >= 0 && i <= maxRpm) ? (renderTqBase[i] || 0) : 0;
        }
        return getCurveValue(tqCurve, rpm);
      }
      function getEnvelopeHpAt(rpm) {
        if (renderHpBase && renderHpBase.length > maxRpm) {
          var i = Math.floor(rpm);
          return (i >= 0 && i <= maxRpm) ? (renderHpBase[i] || 0) : 0;
        }
        return getCurveValue(hpCurve, rpm);
      }
      function getBoostTqAt(rpm) {
        if (!n2oData.hasN2O || !renderBoostTq.length) return 0;
        var i = Math.floor(rpm);
        return (i > 0 && i <= maxRpm) ? (renderBoostTq[i] || 0) : 0;
      }
      function getBoostHpAt(rpm) {
        if (!n2oData.hasN2O || !renderBoostHp.length) return 0;
        var i = Math.floor(rpm);
        return (i > 0 && i <= maxRpm) ? (renderBoostHp[i] || 0) : 0;
      }

      // ─── N2O RIPPLE MORPH ─────────────────────────────────────────────────────
      // On N2O activation: a wave expands from triggerRpm outward at spreadSpeed RPM/s.
      // Each RPM's blend transitions from 0→1 as the wavefront passes.
      // On deactivation: uniform fade out over fadeDuration seconds.
      var n2oMorph = {
        state:           'idle',   // 'idle' | 'expanding' | 'active' | 'fading'
        triggerRpm:      50,
        triggerTime:     0,
        spreadSpeed:     8000,     // RPM/s — covers full range in ~1s
        edgeWidth:       600,      // RPM-wide soft transition band
        expandDuration:  1.2,      // s → switch 'expanding' to 'active'
        fadeDuration:    0.4       // s for uniform fade-out
      };

      var lastGear = -1;

      function onN2OStateChange(nowActive, rpm) {
        if (nowActive) {
          // Re-trigger from any state — multiple presses always restart the wave
          n2oMorph.state       = 'expanding';
          n2oMorph.triggerRpm  = rpm;
          n2oMorph.triggerTime = performance.now();
          rebuildAxis();
        } else if (n2oMorph.state === 'expanding' || n2oMorph.state === 'active') {
          n2oMorph.state       = 'fading';
          n2oMorph.triggerTime = performance.now();
        }
      }

      function onGearChange(rpm) {
        // Re-anchor the wave at the current RPM so the boost visual follows the new gear
        if (n2oMorph.state === 'active' || n2oMorph.state === 'expanding') {
          n2oMorph.state       = 'expanding';
          n2oMorph.triggerRpm  = rpm;
          n2oMorph.triggerTime = performance.now();
        }
      }

      // Returns blend factor 0..1 for a given RPM position on the curve.
      // The wave only sweeps RIGHTWARD from triggerRpm — RPMs to the left stay
      // on base curve during the expanding phase.
      // Once fully active, boost shows for all RPMs >= cutInRPM.
      function getLocalBlend(rpm) {
        var s = n2oMorph.state;
        if (s === 'idle') return 0;

        if (s === 'active') {
          // Boost visible only from the RPM where the user actually activated N2O
          return rpm >= n2oMorph.triggerRpm ? 1 : 0;
        }

        var dt = (performance.now() - n2oMorph.triggerTime) / 1000;

        if (s === 'expanding') {
          if (dt >= n2oMorph.expandDuration) {
            n2oMorph.state = 'active';
            return rpm >= n2oMorph.triggerRpm ? 1 : 0;
          }
          if (rpm < n2oMorph.triggerRpm) return 0;
          var reach = dt * n2oMorph.spreadSpeed;
          var dist  = rpm - n2oMorph.triggerRpm;
          return Math.max(0, Math.min(1, (reach - dist) / n2oMorph.edgeWidth));
        }

        if (s === 'fading') {
          if (dt >= n2oMorph.fadeDuration) { n2oMorph.state = 'idle'; return 0; }
          var f = 1 - (dt / n2oMorph.fadeDuration);
          return rpm >= n2oMorph.triggerRpm ? f : 0;
        }

        return 0;
      }

      // ─── CURVE RENDERERS ──────────────────────────────────────────────────────

      // Static dashed base curve from envelope (shown as reference)
      function buildBasePathFromEnvelope(isHp) {
        if (!renderTqBase || renderTqBase.length === 0) {
          return buildPathFromArray(isHp ? hpCurve : tqCurve, 1.0);
        }
        var pts = [], step = Math.max(1, Math.floor(maxRpm / 60));
        for (var rpm = 0; rpm <= maxRpm; rpm += step) {
          var v = isHp ? getEnvelopeHpAt(rpm) : getEnvelopeTqAt(rpm);
          pts.push((CX0 + (rpm / maxRpm) * CW).toFixed(1) + ',' + valueToY(v).toFixed(1));
        }
        var vLast = isHp ? getEnvelopeHpAt(maxRpm) : getEnvelopeTqAt(maxRpm);
        pts.push((CX0 + CW).toFixed(1) + ',' + valueToY(vLast).toFixed(1));
        return pts.join(' ');
      }

      // Live curve: envelope morphed toward N2O-boosted envelope, scaled by throttle response.
      // Formula per RPM: v = (baseEnvelope + localBlend * boost) * effectiveScale
      //   effectiveScale captures throttle/turbo spool feel — the whole curve rises and falls.
      //   localBlend is the ripple wave — N2O boost fades in from activationRPM outward.
      function buildLivePathFromArray(isHp, effectiveScale) {
        if (!renderTqBase || renderTqBase.length === 0) {
          return buildPathFromArray(isHp ? hpCurve : tqCurve, effectiveScale);
        }
        var pts = [], step = Math.max(1, Math.floor(maxRpm / 60));
        for (var rpm = 0; rpm <= maxRpm; rpm += step) {
          var baseV  = isHp ? getEnvelopeHpAt(rpm) : getEnvelopeTqAt(rpm);
          var boostV = isHp ? getBoostHpAt(rpm) : getBoostTqAt(rpm);
          var blend  = getLocalBlend(rpm);
          var v = (baseV + blend * boostV) * effectiveScale;
          pts.push((CX0 + (rpm / maxRpm) * CW).toFixed(1) + ',' + valueToY(v).toFixed(1));
        }
        var baseVL  = isHp ? getEnvelopeHpAt(maxRpm) : getEnvelopeTqAt(maxRpm);
        var boostVL = isHp ? getBoostHpAt(maxRpm) : getBoostTqAt(maxRpm);
        var blendL  = getLocalBlend(maxRpm);
        pts.push((CX0 + CW).toFixed(1) + ',' + valueToY((baseVL + blendL * boostVL) * effectiveScale).toFixed(1));
        return pts.join(' ');
      }

      // ─── AXIS ─────────────────────────────────────────────────────────────────
      function rebuildAxis() {
        var pTQ = envelopeTqMax > 0 ? envelopeTqMax : 0;
        var pHP = 0;
        if (renderHpBase && renderHpBase.length > maxRpm) {
          for (var i = 1; i <= maxRpm; i++) { if (renderHpBase[i] > pHP) pHP = renderHpBase[i]; }
        } else {
          for (var k = 0; k < hpCurve.length; k++) { if (hpCurve[k] > pHP) pHP = hpCurve[k]; }
          for (var m = 0; m < tqCurve.length; m++) { if (tqCurve[m] > pTQ) pTQ = tqCurve[m]; }
        }
        scope.d.baseHpMax = pHP;
        scope.d.baseTqMax = pTQ;

        // Include N2O boost headroom in Y-axis from the start (no per-frame loop)
        var yMax = Math.max(pHP, pTQ);
        if (n2oData.hasN2O && envelopeBoostMax > 0) {
          yMax = Math.max(yMax, pTQ + envelopeBoostMax);
        }
        yMax = Math.ceil(yMax * 1.08 / 50) * 50;
        if (yMax < 50) yMax = 50;
        globalMax = yMax;

        scope.chart.yTop  = '' + globalMax;
        scope.chart.yHigh = '' + Math.round(globalMax * 0.666);
        scope.chart.yLow  = '' + Math.round(globalMax * 0.333);

        var q = maxRpm / 3;
        scope.chart.xL1    = (Math.round(q / 1000)) + 'K';
        scope.chart.xL1x   = Math.round(CX0 + CW * 0.333);
        scope.chart.xL2    = (Math.round(q * 2 / 1000)) + 'K';
        scope.chart.xL2x   = Math.round(CX0 + CW * 0.666);
        scope.chart.xLmax  = Math.round(maxRpm / 1000) + 'K';
        scope.chart.xLmaxX = Math.round(CX0 + CW);
        scope.chart.vg1    = Math.round(CX0 + CW * 0.333);
        scope.chart.vg2    = Math.round(CX0 + CW * 0.666);

        scope.chart.hpBasePts = buildBasePathFromEnvelope(true);
        scope.chart.tqBasePts = buildBasePathFromEnvelope(false);
      }

      // ─── STATE ────────────────────────────────────────────────────────────────
      var vehicleId = '';
      var n2oData = { hasN2O: false, addedPower: 0, cutInRPM: 3500, cutInRange: 50 };
      var isN2OActive  = false;
      var wasN2oActive = false;

      var requestCurveData = function() { bngApi.activeObjectLua('controller.mainController.sendTorqueData()'); };

      function resetSmoothing() {
        lastSmoothTorque  = 0;
        lastSmoothPower   = 0;
        wasN2oActive      = false;
        isN2OActive       = false;
        prevSampleRpm     = 0;
        lastGear          = -1;
        envelopeBase      = [];
        renderTqBase      = [];
        renderHpBase      = [];
        renderBoostTq     = [];
        renderBoostHp     = [];
        envelopeTqMax     = 0;
        envelopeBoostMax  = 0;
        curveDirty        = false;
        n2oMorph.state    = 'idle';
      }

      // ─── EVENT HANDLERS ───────────────────────────────────────────────────────

      scope.$on('NexTMinimaL_DNA', function(ev, data) {
        if (data && data.auxiliary) {
          var aux = data.auxiliary;
          if (aux.hasNos) {
            // Mark N2O present — boost curve will be derived from TorqueCurveChanged diff.
            // cutInRPM from DNA is kept as fallback only; real value comes from curve diff.
            n2oData.hasN2O     = true;
            n2oData.addedPower = aux.n2oAddedPower || 0;
            n2oData.cutInRPM   = aux.n2oCutInRPM   || n2oData.cutInRPM;
            n2oData.cutInRange = aux.n2oCutInRange  || 50;
          } else {
            n2oData.hasN2O   = false;
            renderBoostTq    = [];
            renderBoostHp    = [];
            envelopeBoostMax = 0;
          }
        }
      });

      scope.$on('TorqueCurveChanged', function(ev, data) {
        if (!data || !data.curves) return;
        if (data.vehicleID !== vehicleId) {
          vehicleId = data.vehicleID;
          scope.d.peakHp = 0; scope.d.peakTq = 0;
          resetSmoothing();
        }
        maxRpm = data.maxRPM || 7000;

        if (n2oData.hasN2O && isN2OActive) return;

        // baseCurve  = highest priority curve WITHOUT N2O → dashed reference (motor + FI)
        // boostedCurve = highest priority overall → active curve (may include N2O)
        // boost delta = boostedCurve - baseCurve = N2O contribution only
        var baseCurve = null, boostedCurve = null;
        for (var k in data.curves) {
          var curve = data.curves[k];
          var name  = (curve.name || '').toLowerCase();
          var hasN2OName = name.indexOf('n2o') !== -1 || name.indexOf('nos') !== -1;

          if (!boostedCurve || curve.priority > boostedCurve.priority) boostedCurve = curve;
          if (!hasN2OName && (!baseCurve || curve.priority > baseCurve.priority)) baseCurve = curve;
        }
        if (!baseCurve)    baseCurve    = boostedCurve;
        if (!boostedCurve) boostedCurve = baseCurve;
        if (!baseCurve) return;

        // Build base tqCurve / hpCurve from dashed/base curve
        hpCurve = []; tqCurve = [];
        var tArr = baseCurve.torque || [], pArr = baseCurve.power || [];
        for (var i = 0; i < pArr.length; i++) hpCurve.push((pArr[i] || 0) * 0.98632);
        for (var j = 0; j < tArr.length;  j++) tqCurve.push(tArr[j] || 0);

        // Seed envelope from base curve — do NOT overwrite existing real samples
        for (var rpm = 0; rpm <= maxRpm; rpm++) {
          var idx = (rpm / maxRpm) * (tArr.length - 1);
          var i1  = Math.floor(idx), i2 = Math.min(Math.ceil(idx), tArr.length - 1);
          var f   = idx - i1;
          var seed = ((tArr[i1] || 0) * (1 - f)) + ((tArr[i2] || 0) * f);
          if (seed > 0 && (!envelopeBase[rpm] || seed > envelopeBase[rpm])) {
            envelopeBase[rpm] = seed;
          }
        }

        // Derive boost curve directly from diff (boosted - base), point by point.
        // This replaces formula + envelope sampling for N2O: no addedPower needed,
        // no cutInRPM hardcoded — both are read from the actual curve data.
        renderBoostTq    = new Array(maxRpm + 1).fill(0);
        renderBoostHp    = new Array(maxRpm + 1).fill(0);
        envelopeBoostMax = 0;

        if (boostedCurve !== baseCurve) {
          var bArr = boostedCurve.torque || [];
          var hasBoost = false;

          for (var r = 0; r <= maxRpm; r++) {
            // Interpolate boosted value at this RPM
            var bIdx = (r / maxRpm) * (bArr.length - 1);
            var b1   = Math.floor(bIdx), b2 = Math.min(Math.ceil(bIdx), bArr.length - 1);
            var bTq  = ((bArr[b1] || 0) * (1 - (bIdx - b1))) + ((bArr[b2] || 0) * (bIdx - b1));

            // Interpolate base value at this RPM
            var nIdx = (r / maxRpm) * (tArr.length - 1);
            var n1   = Math.floor(nIdx), n2 = Math.min(Math.ceil(nIdx), tArr.length - 1);
            var nTq  = ((tArr[n1] || 0) * (1 - (nIdx - n1))) + ((tArr[n2] || 0) * (nIdx - n1));

            var boost = Math.max(0, bTq - nTq);
            renderBoostTq[r] = boost;
            renderBoostHp[r] = r > 0 ? (boost * r) / 7127 : 0;
            if (boost > envelopeBoostMax) envelopeBoostMax = boost;
            if (boost > 5) hasBoost = true;
          }

          if (hasBoost) {
            n2oData.hasN2O = true;
            // Detect real cutInRPM from first RPM where boost exceeds threshold
            for (var cr = 0; cr <= maxRpm; cr++) {
              if (renderBoostTq[cr] > 5) { n2oData.cutInRPM = cr; break; }
            }
          }
        }

        curveDirty = true;
        scope.$evalAsync(function() {
          rebuildRenderCurves();
          rebuildAxis();
        });
      });

      scope.$on('VehicleChange',       function() { vehicleId = ''; lastDamage = null; maxDamagePriority = 0; resetSmoothing(); requestCurveData(); });
      scope.$on('VehicleFocusChanged', function() { lastDamage = null; maxDamagePriority = 0; resetSmoothing(); requestCurveData(); });
      scope.$on('VehicleReset',        function() { lastDamage = null; maxDamagePriority = 0; resetSmoothing(); requestCurveData(); });
      scope.$on('SettingsChanged', requestCurveData);
      scope.$on('app:resized', function() { updateLayout(); requestCurveData(); });

      scope.$on('streamsUpdate', function(ev, streams) {
        if (!streams) return;
        var e   = streams.electrics || {};
        var ei  = streams.engineInfo || [];
        var ptd = streams.powertrainDeviceData || {};

        // Capture N2O params from powertrainDeviceData if exposed
        if (ptd.n2oInfo) {
          scope.d.n2oInfo = ptd.n2oInfo;
          if (maxRpm > 0) {
            n2oData.hasN2O     = true;
            n2oData.addedPower = ptd.n2oInfo.addedPower  || n2oData.addedPower;
            n2oData.cutInRPM   = ptd.n2oInfo.cutInRPM    || n2oData.cutInRPM;
            n2oData.cutInRange = ptd.n2oInfo.cutInRange   || n2oData.cutInRange;
          }
        }

        scope.$evalAsync(function() {
          var rpm  = ei[4] || e.rpm || 0;
          var load = e.engineLoad || 0;
          var damageFactor = getDamageFactor(lastDamage);

          // Hero metrics — ei[8] already includes N2O torque when active
          var baseTq = getEnvelopeTqAt(rpm);
          var baseHp = getEnvelopeHpAt(rpm);
          var rawTq  = (ei[8] !== undefined) ? Math.max(0, ei[8]) : baseTq * load * damageFactor;
          var rawHp  = (rawTq * rpm) / 7127;
          if (!e.engineRunning) { rawTq = 0; rawHp = 0; }

          // EMA smoothing for display values
          lastSmoothTorque = (rawTq * ALPHA) + (lastSmoothTorque * (1 - ALPHA));
          lastSmoothPower  = (rawHp * ALPHA) + (lastSmoothPower  * (1 - ALPHA));
          if (lastSmoothTorque < 0.1) lastSmoothTorque = 0;
          if (lastSmoothPower  < 0.1) lastSmoothPower  = 0;

          scope.d.tq = lastSmoothTorque; scope.d.hp = lastSmoothPower;
          if (rawHp > scope.d.peakHp) scope.d.peakHp = rawHp;
          if (rawTq > scope.d.peakTq) scope.d.peakTq = rawTq;

          scope.d.delta = baseHp > 1 ? Math.min(100, (lastSmoothPower / baseHp) * 100) : (e.engineRunning ? load * 100 : 0);
          if      (scope.d.delta > 20) scope.d.deltaClass = 'nxt-delta-ok';
          else if (scope.d.delta > 8)  scope.d.deltaClass = 'nxt-delta-warn';
          else                         scope.d.deltaClass = 'nxt-delta-crit';

          if      (!e.engineRunning)          { scope.d.state = 'STALLED';  scope.d.chipClass = 'nxt-chip-unk';  }
          else if (maxDamagePriority >= 2)    { scope.d.state = 'DAMAGED';  scope.d.chipClass = 'nxt-chip-crit'; }
          else if (maxDamagePriority === 1)   { scope.d.state = 'WARNING';  scope.d.chipClass = 'nxt-chip-warn'; }
          else if ((e.watertemp || 0) > 115)  { scope.d.state = 'OVERHEAT'; scope.d.chipClass = 'nxt-chip-warn'; }
          else                                { scope.d.state = 'HEALTHY';  scope.d.chipClass = 'nxt-chip-ok';   }

          // N2O state
          var isN2OTriggered = (e.nitrousOxideActive === 1) || (e.nitrousOxideOverride === 1);

          // Feed envelope sampler — WOT peak-hold builds empirical curves
          updateEnvelope(rpm, rawTq, isN2OTriggered, load, e.engineRunning);

          // Throttle curve rebuild (max 4/s)
          if (curveDirty && (performance.now() - lastCurveBuild > CURVE_REBUILD_MS)) {
            rebuildRenderCurves();
            rebuildAxis();
          }

          // Gear change: re-anchor morph wave at current RPM
          var currentGear = e.gear || 0;
          if (currentGear !== lastGear && lastGear !== -1) onGearChange(rpm);
          lastGear = currentGear;

          // Ripple morph state machine
          if (isN2OTriggered !== wasN2oActive) {
            onN2OStateChange(isN2OTriggered, rpm);
          }
          wasN2oActive = isN2OTriggered;
          isN2OActive  = isN2OTriggered;

          // N2O badge values (boost at current RPM × current blend)
          var curBlend    = getLocalBlend(rpm);
          var boostTqNow  = getBoostTqAt(rpm) * curBlend;
          var boostHpNow  = getBoostHpAt(rpm) * curBlend;
          scope.d.n2oActive   = isN2OTriggered && n2oData.hasN2O;
          scope.d.n2oBoostTq  = (scope.d.n2oActive && curBlend > 0.1) ? boostTqNow : 0;
          scope.d.n2oBoostHp  = (scope.d.n2oActive && curBlend > 0.1) ? boostHpNow : 0;

          // Throttle/turbo spool scale. refTq uses full boosted reference when N2O active.
          // Clamped at 1.5 — prevents division-by-near-zero spikes at low RPM.
          var refTq = (isN2OTriggered && n2oData.hasN2O)
            ? Math.max(baseTq + getBoostTqAt(rpm), 20)
            : Math.max(baseTq, 20);
          var effectiveScale = e.engineRunning ? Math.min(rawTq / refTq, 1.5) : 0;

          // Live curves: envelope + ripple morph, scaled by throttle response
          scope.chart.hpLivePts = buildLivePathFromArray(true,  effectiveScale);
          scope.chart.tqLivePts = buildLivePathFromArray(false, effectiveScale);

          // Dots follow real physics — no modifications
          scope.chart.cursorX = (CX0 + (rpm / maxRpm) * CW).toFixed(1);
          scope.chart.dotHpY  = valueToY(lastSmoothPower).toFixed(1);
          scope.chart.dotTqY  = valueToY(lastSmoothTorque).toFixed(1);
        });
      });

      updateLayout();
      scope.$on('$destroy', function() {
        StreamsManager.remove(['electrics', 'engineInfo', 'powertrainDeviceData']);
        angular.element($window).off('resize', updateLayout);
      });
    }
  };
}]);

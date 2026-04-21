// NexTMinimaL — Torque Pro v2.6
// Fully Unified Scale & Signal, Top-Heavy Layout, Snappy EMA.
// Hero source: engineInfo[8] (Nm). HP: PS. Filter: EMA Alpha 0.25.

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
        '</div>' +
        '<div class="nxt-tq-metric">' +
          '<div class="nxt-tq-k">TORQUE</div>' +
          '<div class="nxt-tq-v nxt-c-tq">{{d.tq | number:0}}<span class="nxt-tq-vu">NM</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="nxt-tq-meta">' +
        '<div class="nxt-tq-stat"><span class="nxt-tq-sk">PK TQ</span><span class="nxt-tq-sv nxt-c-tq">{{d.peakTq | number:0}}</span></div>' +
        '<div class="nxt-tq-stat"><span class="nxt-tq-sk">PK HP</span><span class="nxt-tq-sv nxt-c-hp">{{d.peakHp | number:0}}</span></div>' +
        '<div class="nxt-tq-stat"><span class="nxt-tq-sk">&#916; BASE</span><span class="nxt-tq-sv" ng-class="d.deltaClass">{{d.delta | number:1}}%</span></div>' +
        '<div class="nxt-tq-chip-wrap">' +
          '<span class="nxt-tq-chip" ng-class="d.chipClass">{{d.state}}</span>' +
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
      StreamsManager.add(['electrics', 'engineInfo']);
      
      // Unified Geometry
      var CX0 = 22, CW = 240, CY0 = 10, CH = 80;
      var hpCurve = [], tqCurve = [], maxRpm = 7000, globalMax = 1;
      
      // Snappy, robust smoothing
      var lastSmoothTorque = 0, lastSmoothPower = 0, ALPHA = 0.25;
      
      scope.d = { hp: 0, tq: 0, peakHp: 0, peakTq: 0, state: 'UNKNOWN', chipClass: 'nxt-chip-unk', delta: 0, deltaClass: 'nxt-delta-ok', baseHpMax: 0, baseTqMax: 0 };
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

      // Core mapping function: Value -> Y Coordinate
      function valueToY(v) { 
        var y = (CY0 + CH) - (v / globalMax) * CH; 
        return Math.max(CY0, Math.min(CY0 + CH, y)); 
      }

      // Safe interpolation for arrays of arbitrary density
      function getCurveValue(arr, rpm) {
        if (!arr || arr.length === 0) return 0;
        var idx = (rpm / maxRpm) * (arr.length - 1);
        var i1 = Math.floor(idx);
        var i2 = Math.min(Math.ceil(idx), arr.length - 1);
        var frac = idx - i1;
        return (arr[i1] * (1 - frac)) + (arr[i2] * frac);
      }

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

      function rebuildAxis() {
        var pHP = 0, pTQ = 0;
        for (var i = 0; i < hpCurve.length; i++) { if (hpCurve[i] > pHP) pHP = hpCurve[i]; }
        for (var i = 0; i < tqCurve.length; i++) { if (tqCurve[i] > pTQ) pTQ = tqCurve[i]; }
        scope.d.baseHpMax = pHP; scope.d.baseTqMax = pTQ;
        
        globalMax = Math.max(pHP, pTQ); 
        globalMax = Math.ceil(globalMax / 50) * 50; 
        if (globalMax < 50) globalMax = 50;
        
        scope.chart.yTop = '' + globalMax; 
        scope.chart.yHigh = '' + Math.round(globalMax * 0.666);
        scope.chart.yLow = '' + Math.round(globalMax * 0.333);
        
        var q = maxRpm / 3;
        scope.chart.xL1 = (Math.round(q / 1000)) + 'K'; scope.chart.xL1x = Math.round(CX0 + CW * 0.333);
        scope.chart.xL2 = (Math.round(q * 2 / 1000)) + 'K'; scope.chart.xL2x = Math.round(CX0 + CW * 0.666);
        scope.chart.xLmax = Math.round(maxRpm / 1000) + 'K'; scope.chart.xLmaxX = Math.round(CX0 + CW);
        scope.chart.vg1 = Math.round(CX0 + CW * 0.333); scope.chart.vg2 = Math.round(CX0 + CW * 0.666);
        
        scope.chart.hpBasePts = buildPathFromArray(hpCurve, 1.0);
        scope.chart.tqBasePts = buildPathFromArray(tqCurve, 1.0);
      }

      var vehicleId = '';
      var requestCurveData = function() { bngApi.activeObjectLua('controller.mainController.sendTorqueData()'); };
      function resetSmoothing() { lastSmoothTorque = 0; lastSmoothPower = 0; }

      scope.$on('TorqueCurveChanged', function(ev, data) {
        if (!data || !data.curves) return;
        if (data.vehicleID !== vehicleId) { vehicleId = data.vehicleID; scope.d.peakHp = 0; scope.d.peakTq = 0; resetSmoothing(); }
        maxRpm = data.maxRPM || 7000;
        var solidKey = null, anyKey = null;
        for (var k in data.curves) { anyKey = k; if (!data.curves[k].dash || data.curves[k].dash.length === 0) { solidKey = k; break; } }
        var c = data.curves[solidKey || anyKey];
        
        hpCurve = []; tqCurve = [];
        var pArr = c.power || [], tArr = c.torque || [];
        for (var i = 0; i < pArr.length; i++) hpCurve.push((pArr[i] || 0) * 0.98632);
        for (var j = 0; j < tArr.length; j++) tqCurve.push(tArr[j] || 0);
        
        scope.$evalAsync(rebuildAxis);
      });

      scope.$on('VehicleChange', function() { vehicleId = ''; lastDamage = null; maxDamagePriority = 0; resetSmoothing(); requestCurveData(); });
      scope.$on('VehicleFocusChanged', function() { lastDamage = null; maxDamagePriority = 0; resetSmoothing(); requestCurveData(); });
      scope.$on('VehicleReset', function() { lastDamage = null; maxDamagePriority = 0; resetSmoothing(); requestCurveData(); });
      scope.$on('SettingsChanged', requestCurveData);
      scope.$on('app:resized', function() { updateLayout(); requestCurveData(); });

      scope.$on('streamsUpdate', function(ev, streams) {
        if (!streams) return;
        var e = streams.electrics || {}, ei = streams.engineInfo || [];
        scope.$evalAsync(function() {
          var rpm = ei[4] || e.rpm || 0, load = e.engineLoad || 0;
          var damageFactor = getDamageFactor(lastDamage);
          
          var baseTq = getCurveValue(tqCurve, rpm);
          var baseHp = getCurveValue(hpCurve, rpm);
          
          // Hero metrics use live physics data (ei[8])
          var rawTq = (ei[8] !== undefined) ? Math.max(0, ei[8]) : baseTq * load * damageFactor;
          var rawHp = (rawTq * rpm) / 7127;
          if (!e.engineRunning) { rawTq = 0; rawHp = 0; }
          
          // EMA Filtering
          lastSmoothTorque = (rawTq * ALPHA) + (lastSmoothTorque * (1 - ALPHA));
          lastSmoothPower = (rawHp * ALPHA) + (lastSmoothPower * (1 - ALPHA));
          if (lastSmoothTorque < 0.1) lastSmoothTorque = 0;
          if (lastSmoothPower < 0.1) lastSmoothPower = 0;
          
          scope.d.tq = lastSmoothTorque; scope.d.hp = lastSmoothPower;
          if (rawHp > scope.d.peakHp) { scope.d.peakHp = rawHp; }
          if (rawTq > scope.d.peakTq) { scope.d.peakTq = rawTq; }
          
          scope.d.delta = baseHp > 1 ? Math.min(100, (lastSmoothPower / baseHp) * 100) : (e.engineRunning ? load * 100 : 0);
          if (scope.d.delta > 20) scope.d.deltaClass = 'nxt-delta-ok'; else if (scope.d.delta > 8) scope.d.deltaClass = 'nxt-delta-warn'; else scope.d.deltaClass = 'nxt-delta-crit';
          
          if (!e.engineRunning) { scope.d.state = 'STALLED'; scope.d.chipClass = 'nxt-chip-unk'; } 
          else if (maxDamagePriority >= 2) { scope.d.state = 'DAMAGED'; scope.d.chipClass = 'nxt-chip-crit'; } 
          else if (maxDamagePriority === 1) { scope.d.state = 'WARNING'; scope.d.chipClass = 'nxt-chip-warn'; } 
          else if ((e.watertemp || 0) > 115) { scope.d.state = 'OVERHEAT'; scope.d.chipClass = 'nxt-chip-warn'; } 
          else { scope.d.state = 'HEALTHY'; scope.d.chipClass = 'nxt-chip-ok'; }
          
          // To ensure the line and the dots perfectly match, we derive a single scale ratio 
          // from the smoothed live telemetry vs the baseline expected at this RPM.
          // This forces the entire curve to physically anchor to the dots.
          var liveScale = (baseTq > 5) ? (lastSmoothTorque / baseTq) : 0;
          if (!e.engineRunning) liveScale = 0;
          if (liveScale > 2) liveScale = 2; // Prevent infinite scaling at very low RPMs
          
          if (hpCurve.length > 0) {
            scope.chart.hpLivePts = buildPathFromArray(hpCurve, liveScale);
            scope.chart.tqLivePts = buildPathFromArray(tqCurve, liveScale);
          }
          
          scope.chart.cursorX = (CX0 + (rpm / maxRpm) * CW).toFixed(1);
          scope.chart.dotHpY = valueToY(lastSmoothPower).toFixed(1);
          scope.chart.dotTqY = valueToY(lastSmoothTorque).toFixed(1);
        });
      });
      
      updateLayout();
      scope.$on('$destroy', function() { 
        StreamsManager.remove(['electrics', 'engineInfo']); 
        angular.element($window).off('resize', updateLayout);
      });
    }
  };
}]);

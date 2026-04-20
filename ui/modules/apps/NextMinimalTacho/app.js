// ════════════════════════════════════════════════════════════════════
// NexTMinimaL Tacho — Rediseño FUSION (v6.3)
// TABLERO: lights cluster · rpm bar · speed hero · dash-row · bars · corners · carousel
// ════════════════════════════════════════════════════════════════════

var NXT_TACHO_TEMPLATE = `
  <div class="bngApp nxt-root">
    <div class="nxt-container">

      <!-- LIGHTS CLUSTER -->
      <div class="nxt-lights">
        <div class="nxt-tsig nxt-clickable" ng-class="{'nxt-tsig-on': data.signalL, 'nxt-tsig-hz': data.hazards}" ng-click="toggleHazards()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 12l8-7v4h7v6h-7v4z"/></svg>
        </div>
        <div class="nxt-light-icons">
          <div class="nxt-lt nxt-clickable" ng-class="{'nxt-lt-on': data.lights === 'park'}" ng-click="toggleParkingLights()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2" stroke-linecap="round"/></svg>
          </div>
          <div class="nxt-lt nxt-clickable" ng-class="{'nxt-lt-on': data.lights === 'low'}" ng-click="toggleLowBeam()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 16c0-5 3-9 8-9 3 0 5 1.5 6 3"/><path d="M4 16h10"/><path d="M16 9l3-1"/><path d="M17 12l3 0"/><path d="M16 15l3 1" opacity="0.5"/></svg>
          </div>
          <div class="nxt-lt nxt-lt-hi nxt-clickable" ng-class="{'nxt-lt-on': data.lights === 'high'}" ng-click="toggleHighbeam()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 16c0-5 3-9 8-9 3 0 5 1.5 6 3"/><path d="M4 16h10"/><path d="M16 8l4-2"/><path d="M17 11l4 0"/><path d="M16 14l4 2"/></svg>
          </div>
          <div class="nxt-lt nxt-lt-fog nxt-clickable" ng-class="{'nxt-lt-on': data.lights === 'fog'}" ng-click="toggleFog()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 14c0-4 3-7 7-7 2.5 0 4.5 1 5.5 2.5"/><path d="M4 14h8"/><path d="M15 11h5" stroke-dasharray="2 2"/><path d="M15 14h5" stroke-dasharray="2 2"/><path d="M15 17h5" stroke-dasharray="2 2"/></svg>
          </div>
          <div class="nxt-lt nxt-lt-prk nxt-clickable" ng-class="{'nxt-lt-on': data.parking}" ng-click="toggleParkingBrake()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M10 8h3a2.5 2.5 0 0 1 0 5h-3V8z"/><path d="M10 13v3"/></svg>
          </div>
          <div class="nxt-lt nxt-lt-warn nxt-clickable" ng-class="{'nxt-lt-on': data.lightbarActive}" ng-click="toggleLightbar()">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="10" width="18" height="4" rx="1"/><path d="M7 10V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/><path d="M12 10v4"/></svg>
          </div>
        </div>
        <div class="nxt-tsig nxt-tsig-r nxt-clickable" ng-class="{'nxt-tsig-on': data.signalR, 'nxt-tsig-hz': data.hazards}" ng-click="toggleHazards()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="transform:scaleX(-1)"><path d="M4 12l8-7v4h7v6h-7v4z"/></svg>
        </div>
      </div>

      <!-- SPEED HERO -->
      <div class="nxt-speed-hero">
        <div class="nxt-speed-num">{{data.speedPad}}</div>
        <div class="nxt-speed-unit">{{data.speedUnit}}</div>
      </div>

      <!-- DASH ROW: RPM · GEAR · TURBO? · SC? -->
      <div class="nxt-dash-row" ng-class="'nxt-cols-' + data.dashCols">
        <div class="nxt-dash-item nxt-rpm-item">
          <!-- Redline Indicator -->
          <div class="nxt-redline-alert" ng-if="data.rpmZone === 'nxt-rpm-red'">
            <svg viewBox="0 0 24 24" width="8" height="8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>REDLINE</span>
          </div>
          
          <div class="nxt-dash-k">RPM</div>
          <div class="nxt-dash-v" ng-class="data.rpmZone">{{data.rpm}}</div>
          
          <!-- RPM BAR SVG (Now inside container) -->
          <div class="nxt-rpm-bar-wrap">
            <svg viewBox="0 0 100 4" preserveAspectRatio="none" class="nxt-rpm-svg">
              <rect x="0" y="0" width="100" height="2" rx="1" fill="rgba(255,255,255,0.06)" />
              <rect x="0" y="0" ng-attr-width="{{ data.rpmPct }}" height="2" rx="1" ng-attr-fill="{{ data.rpmBg }}" class="nxt-rpm-fill" />
            </svg>
          </div>
        </div>
        <div>
          <div class="nxt-dash-k">GEAR</div>
          <div class="nxt-mini-carousel" ng-class="{'nxt-shifting': data.isShifting}">
            <div ng-repeat="g in data.gearList track by ($index + '_' + g)" ng-if="$index >= 2 && $index <= 4" class="nxt-mini-slot" ng-class="getMiniGearClass($index, g)">{{g}}</div>
          </div>
        </div>
        <div ng-if="data.hasTurbo" class="nxt-clickable" ng-click="toggleBoostUnit()">
          <div class="nxt-dash-k">{{data.turboLabel}}</div>
          <div class="nxt-dash-v nxt-dash-v-boost">{{dispBoost(data.turboBoost)}}<span class="nxt-small"> {{data.boostUnit}}</span></div>
        </div>
        <div ng-if="data.hasSuper" class="nxt-clickable" ng-click="toggleBoostUnit()">
          <div class="nxt-dash-k">S/CHG</div>
          <div class="nxt-dash-v nxt-dash-v-boost">{{dispBoost(data.superBoost)}}<span class="nxt-small"> {{data.boostUnit}}</span></div>
        </div>
      </div>

      <!-- FUEL + COOLANT BARS -->
      <div class="nxt-bars" ng-class="{'nxt-bars-elec': data.isElectric}">
        <div class="nxt-bar-grp" ng-class="{'nxt-bar-wide': data.isElectric}">
          <div class="nxt-bar-lbl">
            <span>{{data.isElectric ? 'BATTERY' : 'FUEL'}}</span>
            <strong>{{data.fuel}}<span class="nxt-bar-unit">%</span></strong>
          </div>
          <div class="nxt-track">
            <div class="nxt-fill nxt-fill-fuel" ng-class="{'nxt-fill-warn': data.fuel < 15}" ng-style="{'width': data.fuel + '%'}"></div>
          </div>
        </div>
        <div class="nxt-bar-grp nxt-clickable" ng-if="!data.isElectric" ng-click="toggleCoolantUnit()">
          <div class="nxt-bar-lbl">
            <span>COOLANT</span>
            <strong>{{dispCoolant()}}<span class="nxt-bar-unit">{{data.coolantUnit === 'C' ? '°C' : '°F'}}</span></strong>
          </div>
          <div class="nxt-track">
            <div class="nxt-fill nxt-fill-temp" ng-class="{'nxt-fill-warn': data.waterTemp > 110}" ng-style="{'width': data.tempPct + '%'}"></div>
          </div>
        </div>
      </div>

      <!-- NOS BAR -->
      <div class="nxt-nos-bar" ng-if="data.hasNos">
        <div class="nxt-bar-lbl">
          <span ng-class="{'nxt-nos-on': data.nosActive}">NOS</span>
          <strong ng-class="{'nxt-nos-on': data.nosActive}">{{(data.nosLevel * 100) | number:0}}<span class="nxt-bar-unit">%</span></strong>
        </div>
        <div class="nxt-track">
          <div class="nxt-fill nxt-fill-nos" ng-class="{'nxt-nos-pulse': data.nosActive}" ng-style="{'width': (data.nosLevel * 100) + '%'}"></div>
        </div>
      </div>

      <!-- CORNER GRIDS: TIRES + BRAKES -->
      <div class="nxt-corners" ng-if="data.hasTires || data.hasBrakes">
        <div class="nxt-corner-grp" ng-if="data.hasTires">
          <div class="nxt-sect-ttl">TIRE · PSI</div>
          <div class="nxt-tile-grid">
            <div class="nxt-tile" ng-class="{'nxt-tile-warn': data.tires.fl < 4}"><span class="nxt-pos">FL</span><span>{{data.tires.fl | number:1}}</span></div>
            <div class="nxt-tile" ng-class="{'nxt-tile-warn': data.tires.fr < 4}"><span class="nxt-pos">FR</span><span>{{data.tires.fr | number:1}}</span></div>
            <div class="nxt-tile" ng-class="{'nxt-tile-warn': data.tires.rl < 4}"><span class="nxt-pos">RL</span><span>{{data.tires.rl | number:1}}</span></div>
            <div class="nxt-tile" ng-class="{'nxt-tile-warn': data.tires.rr < 4}"><span class="nxt-pos">RR</span><span>{{data.tires.rr | number:1}}</span></div>
          </div>
        </div>
        <div class="nxt-corner-grp nxt-clickable" ng-if="data.hasBrakes" ng-click="toggleBrakeUnit()">
          <div class="nxt-sect-ttl">BRAKE · {{data.brakeUnit === 'C' ? '°C' : '°F'}}</div>
          <div class="nxt-tile-grid">
            <div class="nxt-tile" ng-class="{'nxt-tile-hot': data.brakes.fl > 400, 'nxt-tile-warm': data.brakes.fl > 200 && data.brakes.fl <= 400}"><span class="nxt-pos">FL</span><span>{{dispBrake(data.brakes.fl)}}</span></div>
            <div class="nxt-tile" ng-class="{'nxt-tile-hot': data.brakes.fr > 400, 'nxt-tile-warm': data.brakes.fr > 200 && data.brakes.fr <= 400}"><span class="nxt-pos">FR</span><span>{{dispBrake(data.brakes.fr)}}</span></div>
            <div class="nxt-tile" ng-class="{'nxt-tile-hot': data.brakes.rl > 400, 'nxt-tile-warm': data.brakes.rl > 200 && data.brakes.rl <= 400}"><span class="nxt-pos">RL</span><span>{{dispBrake(data.brakes.rl)}}</span></div>
            <div class="nxt-tile" ng-class="{'nxt-tile-hot': data.brakes.rr > 400, 'nxt-tile-warm': data.brakes.rr > 200 && data.brakes.rr <= 400}"><span class="nxt-pos">RR</span><span>{{dispBrake(data.brakes.rr)}}</span></div>
          </div>
        </div>
      </div>

    </div>
  </div>
`;

var nxtTachoDirective = function ($timeout) {
  return {
    template: NXT_TACHO_TEMPLATE,
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {

      if (!document.getElementById('nextminimal-tacho-css')) {
        var link = document.createElement('link');
        link.id = 'nextminimal-tacho-css';
        link.rel = 'stylesheet';
        link.href = '/ui/modules/apps/NextMinimalTacho/app.css';
        document.head.appendChild(link);
      }

      StreamsManager.add(['electrics', 'wheelThermalData']);

      var EMPTY_GEAR_WINDOW = ['', '', '', '- -', '', '', ''];

      function createDataState() {
        return {
          speed: 0, speedPad: '000', speedUnit: 'km/h',
          fuel: 0, waterTemp: 0, tempPct: 0,
          rpm: 0, rpmPct: 0,
          rpmZone: 'nxt-rpm-idle', rpmBg: '#4fc3f7',
          checkEngine: false, oilWarning: false, fatalError: false,
          gearList: EMPTY_GEAR_WINDOW.slice(),
          gearLabel: '', currentSlot: 0,
          isSportMode: false, isManualMode: false,
          _isReverse: false,
          isElectric: false,
          isNarrow: false,
          // Lights
          lights: 'off', hazards: false,
          signalL: false, signalR: false,
          parking: false, lightbarActive: false,
          // Induction
          hasTurbo: false, turboBoost: 0, turboLabel: 'TURBO',
          hasSuper: false, superBoost: 0,
          // NOS
          hasNos: false, nosActive: false, nosLevel: 1,
          // Drive mode
          driveModeLabel: '',
          // Drivetrain
          has4wd: false, is4wd: false, hasLowRange: false, lowRangeActive: false, anyDiffLocked: false,
          // Dash row
          dashCols: 2,
          // Corner data
          hasTires: false, tires: { fl: 0, fr: 0, rl: 0, rr: 0 },
          hasBrakes: false, brakes: { fl: 0, fr: 0, rl: 0, rr: 0 },
          // Unit display cycles
          coolantUnit: 'C', boostUnit: 'PSI', brakeUnit: 'C'
        };
      }

      function createUIModel() {
        return {
          raw: {},
          pattern: { modes: [], activeIndex: -1, activeLabel: '' },
          view: { slots: EMPTY_GEAR_WINDOW.slice(), isReverse: false }
        };
      }

      function createLuaMeta() {
        return {
          ready: false,
          vehicle: { name: '', brand: '', config: '' },
          engine: { maxRPM: 7000, idleRPM: 800, redlineRPM: 7000, isElectric: false },
          transmission: {
            rawType: '', class: 'loading', code: 'UNKNOWN',
            isManual: false, isAutomatic: false, isDCT: false,
            isCVT: false, isSequential: false, usesFloat: false,
            availableModes: [], selectorModes: [],
            currentMode: '', currentModeFresh: false,
            selectorSource: 'none',
            maxGearIndex: 6, minGearIndex: -1,
            gearCount: 8, currentGear: ''
          },
          induction: {
            turboCount: 0, superchargerCount: 0,
            hasTurbo: false, hasSupercharger: false,
            isTwinTurbo: false, isTwinCharged: false, isQuadTurbo: false
          },
          learning: { maxSIndex: 0, maxMIndex: 0, seenGears: {} }
        };
      }

      function normalizeCssColor(token, fallback) {
        if (typeof token !== 'string') return fallback;
        var cleaned = token.replace(/#/g, '').trim();
        if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(cleaned)) return fallback;
        return '#' + cleaned;
      }

      function mapTransmissionClassToCode(txClass) {
        switch (txClass) {
          case 'dct': return 'DCT';
          case 'cvt': return 'CVT';
          case 'sequential': return 'SEQ';
          case 'automatic': return 'AUTO';
          case 'manual': return 'MANUAL';
          default: return 'UNKNOWN';
        }
      }

      function normalizeModes(rawModes) {
        var modes = Array.isArray(rawModes) ? rawModes.slice() : [];
        if (!Array.isArray(rawModes) && rawModes && typeof rawModes === 'object') {
          for (var mk in rawModes) {
            if (rawModes.hasOwnProperty(mk)) {
              var mv = rawModes[mk];
              if (typeof mv === 'string' && mv.length > 0) modes.push(mv);
            }
          }
        }
        return modes;
      }

      function buildAutoPattern(modesStr, maxF, maxS) {
        if (!modesStr) return ['P', 'R', 'N', 'D'];
        var parts;
        if (modesStr.indexOf(',') !== -1) {
          parts = modesStr.split(',').filter(function(x) { return x.length > 0; });
        } else {
          parts = modesStr.toUpperCase().split('');
        }
        var out = [];
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          if (p === 'M') {
            var mN = Math.max(maxF || 6, 1);
            for (var gear = 1; gear <= mN; gear++) out.push('M' + gear);
          } else if (p === 'S' && maxS && maxS > 0) {
            for (var s = 1; s <= maxS; s++) out.push('S' + s);
          } else {
            out.push(p);
          }
        }
        return out.length > 0 ? out : ['P', 'R', 'N', 'D'];
      }

      function buildManualPattern(maxF, maxR) {
        var out = [];
        for (var r = maxR; r >= 1; r--) out.push(maxR > 1 ? 'R' + r : 'R');
        out.push('N');
        for (var f = 1; f <= maxF; f++) out.push(String(f));
        return out;
      }

      var PATTERN_DEFAULTS = { automatic: 'PRNDSM', dct: 'PRNDSM', cvt: 'PRNDS' };

      function seedSeenGears(meta) {
        var tx = meta.transmission || {};
        var selectorModes = tx.selectorModes || [];
        var modes = tx.availableModes || [];
        var seededAny = false;
        if (selectorModes.length > 0) {
          for (var si = 0; si < selectorModes.length; si++) {
            if (selectorModes[si] && selectorModes[si].length > 0) {
              meta.learning.seenGears[selectorModes[si]] = true;
              seededAny = true;
            }
          }
        }
        if (!seededAny && modes.length > 0) {
          var expanded = buildAutoPattern(modes.join(','), tx.maxGearIndex, meta.learning.maxSIndex || 0);
          for (var ei = 0; ei < expanded.length; ei++) {
            if (expanded[ei] && expanded[ei].length > 0) {
              meta.learning.seenGears[expanded[ei]] = true;
              seededAny = true;
            }
          }
        }
        if (!seededAny && tx.isAutomatic) {
          var fallbackAuto = buildAutoPattern(PATTERN_DEFAULTS[tx.class] || 'PRND', tx.maxGearIndex, meta.learning.maxSIndex || 0);
          for (var ai = 0; ai < fallbackAuto.length; ai++) {
            if (fallbackAuto[ai]) { meta.learning.seenGears[fallbackAuto[ai]] = true; seededAny = true; }
          }
        }
        if (!seededAny) {
          meta.learning.seenGears.N = true;
          for (var gi = 1; gi <= (tx.maxGearIndex || 0); gi++) meta.learning.seenGears[String(gi)] = true;
          var reverseCount = Math.abs(tx.minGearIndex || -1);
          if (reverseCount <= 1) {
            meta.learning.seenGears.R = true;
          } else {
            for (var ri = 1; ri <= reverseCount; ri++) meta.learning.seenGears['R' + ri] = true;
          }
        }
      }

      var _rpmSmooth = 0;
      var _speedSmooth = 0;
      var _tiresSmooth = { fl: 0, fr: 0, rl: 0, rr: 0 };
      var TP_HYST = 0.15; // psi hysteresis band — suppresses flicker from transient pressure noise
      var _brakeBuffers = { fl: [], fr: [], rl: [], rr: [] };

      /**
       * Reusable helper for rolling mean.
       * @param {Array} buf The buffer array.
       * @param {number} newVal The new value to add.
       * @param {number} n The max size of the buffer.
       * @returns {number} The average of the buffer.
       */
      function rollMean(buf, newVal, n) {
        buf.push(newVal);
        if (buf.length > n) buf.shift();
        var sum = 0;
        for (var i = 0; i < buf.length; i++) sum += buf[i];
        return sum / (buf.length || 1);
      }

      var uiModel = createUIModel();
      scope.luaMeta = createLuaMeta();
      scope.data = createDataState();
      var latestElectrics = null;
      var dnaCatchUpTimer = null;
      var shiftTimeoutPromise = null;

      function updateDashCols() {
        scope.data.dashCols = 2 + (scope.data.hasTurbo ? 1 : 0) + (scope.data.hasSuper ? 1 : 0);
      }

      // Unit cycle toggles — persist to localStorage so choice survives reloads
      var COOLANT_UNIT_KEY = 'nxt.coolantUnit';
      try {
        var _savedCoolant = window.localStorage && window.localStorage.getItem(COOLANT_UNIT_KEY);
        if (_savedCoolant === 'C' || _savedCoolant === 'F') scope.data.coolantUnit = _savedCoolant;
      } catch (e) {}
      scope.toggleHazards = function() { bngApi.activeObjectLua('electrics.toggle_warn_signal()'); };
      
      scope.toggleParkingLights = function() {
        var next = (scope.data.lights === 'park') ? 0 : 1;
        bngApi.activeObjectLua('electrics.setLightsState(' + next + ')');
      };
      
      scope.toggleLowBeam = function() {
        var next = (scope.data.lights === 'low') ? 0 : 1;
        bngApi.activeObjectLua('electrics.setLightsState(' + next + ')');
      };

      scope.toggleHighbeam = function() { 
        var next = (scope.data.lights === 'high') ? 1 : 2;
        bngApi.activeObjectLua('electrics.setLightsState(' + next + ')');
      };
      scope.toggleFog     = function() { bngApi.activeObjectLua('extensions.nextMinimalDNA.toggleFog()'); };
      scope.toggleParkingBrake = function() { bngApi.activeObjectLua('input.event("parkingbrake", electrics.values.parkingbrake > 0.5 and 0 or 1)'); };
      scope.toggleLightbar = function() { bngApi.activeObjectLua('extensions.nextMinimalDNA.toggleLightbar()'); };

      scope.$on('app:resized', function (event, data) {
        scope.$evalAsync(function () {
          scope.data.isNarrow = (data.width < 280);
        });
      });

      scope.toggleCoolantUnit = function() {
        scope.data.coolantUnit = scope.data.coolantUnit === 'C' ? 'F' : 'C';
        try { window.localStorage && window.localStorage.setItem(COOLANT_UNIT_KEY, scope.data.coolantUnit); } catch (e) {}
      };
      scope.toggleBoostUnit   = function() { scope.data.boostUnit   = scope.data.boostUnit   === 'PSI' ? 'BAR' : 'PSI'; };
      scope.toggleBrakeUnit   = function() { scope.data.brakeUnit   = scope.data.brakeUnit   === 'C' ? 'F' : 'C'; };

      // Display helpers
      scope.dispCoolant = function() {
        return scope.data.coolantUnit === 'F' ? Math.round(scope.data.waterTemp * 9/5 + 32) : scope.data.waterTemp;
      };
      scope.dispBoost = function(psi) {
        return scope.data.boostUnit === 'BAR' ? (psi * 0.0689476).toFixed(2) : (psi || 0).toFixed(1);
      };
      scope.dispBrake = function(c) {
        return scope.data.brakeUnit === 'F' ? Math.round(c * 9/5 + 32) : Math.round(c);
      };

      // Pa (absolute) → gauge PSI
      function paToGaugePsi(pa) {
        return (pa - 101325) / 6894.76;
      }

      function parseThermalWheels(thermalData) {
        if (!thermalData || !thermalData.wheels) return null;
        var w = thermalData.wheels;
        var count = 0;
        for (var k in w) { if (w.hasOwnProperty(k)) count++; }
        return count >= 2 ? w : null;
      }

      function getWheelData(w, side) {
        if (w[side]) return w[side];
        var alt = side.charAt(0) + '1' + side.charAt(1);
        if (w[alt]) return w[alt];
        if (side.charAt(0) === 'F') {
          for (var k in w) { if (w.hasOwnProperty(k) && k.charAt(0) === 'F') return w[k]; }
        }
        // Numeric index fallback — FL=0, FR=1; RL/RR = last even/odd pair beyond front
        var isFront = (side === 'FL' || side === 'FR');
        var wantEven = (side === 'FL' || side === 'RL');
        if (isFront) {
          var fi = wantEven ? 0 : 1;
          if (w[fi] !== undefined) return w[fi];
          if (w[String(fi)] !== undefined) return w[String(fi)];
        } else {
          // Find highest numeric key with correct parity (skip front pair 0/1)
          var best = -1;
          for (var k in w) {
            if (!w.hasOwnProperty(k)) continue;
            var n = parseInt(k, 10);
            if (isNaN(n) || n < 2) continue;
            if ((n % 2 === 0) === wantEven && n > best) best = n;
          }
          if (best >= 0) return w[best] !== undefined ? w[best] : w[String(best)];
        }
        return null;
      }

      function clearDNACatchUp() {
        if (dnaCatchUpTimer !== null) { $timeout.cancel(dnaCatchUpTimer); dnaCatchUpTimer = null; }
      }

      function scheduleDNACatchUp(delayMs) {
        clearDNACatchUp();
        dnaCatchUpTimer = $timeout(function() {
          dnaCatchUpTimer = null;
          if (!scope.luaMeta.ready && typeof bngApi !== 'undefined' && bngApi.activeObjectLua) {
            bngApi.activeObjectLua('extensions.nextMinimalDNA.getVehicleDNA()');
          }
        }, typeof delayMs === 'number' ? delayMs : 0);
      }

      function readSignals(electrics) {
        var e = electrics || {};
        var tx = scope.luaMeta.transmission;
        var eng = scope.luaMeta.engine;
        return {
          gearElec: e.gear,
          selectorMode: tx.currentMode || '',
          selectorModeFresh: !!tx.currentModeFresh,
          gearModeIndex: e.gearModeIndex,
          gearIndex: e.gearIndex,
          maxForward: tx.maxGearIndex || 6,
          maxReverse: Math.abs(tx.minGearIndex || -1),
          usesFloat: !!tx.usesFloat,
          txClass: tx.class || 'loading',
          rpmIdle: eng.idleRPM || 800,
          rpmMax: eng.maxRPM || 7000,
          rpm: e.rpm || e.rpmTacho || 0
        };
      }

      function canonicalRank(g) {
        if (g === 'P') return 1;
        if (g === 'R') return 2;
        if (/^R\d+$/.test(g)) return 2 + parseInt(g.slice(1), 10) * 0.001;
        if (g === 'N') return 3;
        if (g === 'D') return 4;
        if (g === 'S') return 5;
        if (/^S\d+$/.test(g)) return 5 + parseInt(g.slice(1), 10) * 0.01;
        if (/^\d+$/.test(g)) { var n = parseInt(g, 10); return 100 - n * 0.01; }
        if (g === 'L') return 6;
        if (g === 'M') return 7;
        if (/^M\d+$/.test(g)) return 7 + parseInt(g.slice(1), 10) * 0.01;
        return 999;
      }

      function getAutomaticSelectorInfo(meta) {
        var tx = meta && meta.transmission ? meta.transmission : {};
        var expanded = (tx.selectorModes && tx.selectorModes.length > 0)
          ? tx.selectorModes.slice()
          : buildAutoPattern(
              (tx.availableModes && tx.availableModes.length > 0) ? tx.availableModes.join(',') : (PATTERN_DEFAULTS[tx.class] || 'PRND'),
              tx.maxGearIndex, (meta.learning && meta.learning.maxSIndex) || 0
            );
        var modeSet = {}, hasLetterModes = false;
        for (var i = 0; i < expanded.length; i++) {
          var mode = expanded[i];
          if (!mode || !mode.length) continue;
          modeSet[mode] = true;
          if (/^[A-Za-z]+/.test(mode)) hasLetterModes = true;
        }
        return { modeSet: modeSet, hasLetterModes: hasLetterModes };
      }

      function buildSeenGearPattern(seenGears, meta) {
        if (!seenGears) return null;
        var selectorInfo = null;
        if (meta && meta.transmission && meta.transmission.isAutomatic) {
          selectorInfo = getAutomaticSelectorInfo(meta);
        }
        var keys = [];
        for (var k in seenGears) {
          if (!seenGears.hasOwnProperty(k) || k.length === 0 || k === '0' || k === '-1') continue;
          if (selectorInfo && selectorInfo.hasLetterModes) {
            if (/^\d+$/.test(k) && !selectorInfo.modeSet[k]) continue;
            if (/^R\d+$/.test(k) && !selectorInfo.modeSet[k]) continue;
          }
          keys.push(k);
        }
        if (keys.length < 3) return null;
        keys.sort(function(a, b) { return canonicalRank(a) - canonicalRank(b); });
        return keys;
      }

      function collapseGroupedModes(pattern) {
        var hasManual = false;
        for (var j = 0; j < pattern.length; j++) {
          if (pattern[j] === 'M' || /^M\d+$/.test(pattern[j])) { hasManual = true; break; }
        }
        var out = [], sawS = false, sawM = false;
        for (var i = 0; i < pattern.length; i++) {
          var g = pattern[i];
          if (/^S\d+$/.test(g)) { if (!sawS) { out.push('S'); sawS = true; } }
          else if (/^M\d+$/.test(g)) { if (!sawM) { out.push('M'); sawM = true; } }
          else if (hasManual && /^\d+$/.test(g)) { /* skip */ }
          else { out.push(g); }
        }
        return out;
      }

      /**
       * Derives the gear display pattern (e.g., [P, R, N, D, S]) based on vehicle metadata and learned state.
       * Fallback Order:
       * 1. Automatic:
       *    a. Use explicit selector modes from Lua if available.
       *    b. Use dynamic "learned" pattern from seen gears if valid (>=3 items).
       *    c. Use expanded string of available modes (e.g., "PRNDSM").
       *    d. Fallback to class-based defaults (e.g., "PRND").
       * 2. Manual/Sequential:
       *    a. Build simple linear pattern [R, N, 1, 2...].
       * 3. Default: Empty window.
       */
      function derivePattern(raw, meta) {
        var tx = meta.transmission;
        if (tx.isAutomatic) {
          // Priority 1a: Explicit selector modes
          if (tx.selectorModes && tx.selectorModes.length > 0) {
            return collapseGroupedModes(tx.selectorModes.slice());
          }
          // Priority 1b: Dynamic learning
          var dyn = buildSeenGearPattern(meta.learning.seenGears, meta);
          var result;
          if (dyn && dyn.length >= 3) {
            result = dyn;
          } else {
            // Priority 1c/1d: Available modes or defaults
            var modesStr = (tx.availableModes && tx.availableModes.length > 0)
              ? tx.availableModes.join(',')
              : (PATTERN_DEFAULTS[tx.class] || 'PRND');
            result = buildAutoPattern(modesStr, tx.maxGearIndex, meta.learning.maxSIndex || 0);
          }
          return collapseGroupedModes(result);
        }
        if (tx.isManual) {
          // Priority 2a: Linear manual pattern
          return buildManualPattern(tx.maxGearIndex, Math.abs(tx.minGearIndex || -1));
        }
        return EMPTY_GEAR_WINDOW.slice();
      }

      function findModeIndexByLabel(pattern, label) {
        if (!pattern || pattern.length === 0 || typeof label !== 'string' || label.length === 0) return -1;
        var idx = pattern.indexOf(label);
        if (idx >= 0) return idx;
        var letterMatch = label.match(/^([A-Za-z]+)/);
        if (letterMatch) { idx = pattern.indexOf(letterMatch[1]); if (idx >= 0) return idx; }
        var numMatch = label.match(/^(\d+)$|(\d+)$/);
        if (numMatch) { idx = pattern.indexOf(numMatch[1] || numMatch[2]); if (idx >= 0) return idx; }
        return -1;
      }

      function resolveActiveIndex(tx, raw, pattern) {
        if (!pattern || pattern.length === 0) return -1;
        if (tx.isAutomatic) {
          if (raw.selectorModeFresh) {
            var idxSelector = findModeIndexByLabel(pattern, raw.selectorMode);
            if (idxSelector >= 0) return idxSelector;
          }
          var idxElec = findModeIndexByLabel(pattern, raw.gearElec);
          if (idxElec >= 0) return idxElec;
          var gmi = raw.gearModeIndex;
          if (!raw.usesFloat && typeof gmi === 'number' && gmi >= 1 && gmi === Math.floor(gmi)) {
            return Math.max(0, Math.min(pattern.length - 1, gmi - 1));
          }
          if (raw.usesFloat && typeof gmi === 'number' && gmi >= 0 && gmi <= 1 && pattern.length > 1) {
            return Math.round(gmi * (pattern.length - 1));
          }
          return 0;
        }
        if (tx.isManual) {
          var g;
          if (typeof raw.gearIndex === 'number') {
            g = raw.gearIndex;
          } else if (typeof raw.gearElec === 'string') {
            if (raw.gearElec === 'N') g = 0;
            else if (raw.gearElec === 'R') g = -1;
            else if (/^R\d+$/.test(raw.gearElec)) g = -parseInt(raw.gearElec.slice(1), 10);
            else g = parseInt(raw.gearElec, 10) || 0;
          } else {
            g = 0;
          }
          var nIdx = pattern.indexOf('N');
          if (nIdx < 0) nIdx = Math.floor(pattern.length / 2);
          if (g < 0) return Math.max(0, nIdx - Math.abs(g));
          if (g === 0) return nIdx;
          return Math.min(nIdx + g, pattern.length - 1);
        }
        return -1;
      }

      function buildWindow(pattern, activeIndex) {
        if (activeIndex < 0 || !pattern.length) {
          return { slots: EMPTY_GEAR_WINDOW.slice(), isReverse: false };
        }
        var padL = pattern.slice(0, activeIndex);
        var padR = pattern.slice(activeIndex + 1);
        var act = pattern[activeIndex] || '';
        while (padL.length < 3) padL.unshift('');
        while (padR.length < 3) padR.push('');
        return {
          slots: [padL[padL.length-3], padL[padL.length-2], padL[padL.length-1], act, padR[0], padR[1], padR[2]],
          isReverse: (act === 'R' || /^R\d+$/.test(act))
        };
      }

      function pickDisplayGearLabel(raw) {
        var gearElec = (typeof raw.gearElec === 'string') ? raw.gearElec : '';
        var selectorMode = (typeof raw.selectorMode === 'string') ? raw.selectorMode : '';
        if (!selectorMode || !raw.selectorModeFresh) return gearElec;
        if (!gearElec) return selectorMode;
        if (gearElec === selectorMode) return gearElec;
        if (/^[SM]\d+$/.test(selectorMode) && (/^[SM]$/.test(gearElec) || /^[DNRP]$/.test(gearElec))) return selectorMode;
        if (/^\d+$/.test(selectorMode) && /^[A-Z]+$/.test(gearElec)) return selectorMode;
        return gearElec;
      }

      function updateUIModel(streams) {
        var raw = readSignals(streams.electrics);
        uiModel.raw = raw;
        var tx = scope.luaMeta.transmission;
        var pattern = derivePattern(raw, scope.luaMeta);
        var activeIdx = resolveActiveIndex(tx, raw, pattern);
        uiModel.pattern = { modes: pattern, activeIndex: activeIdx, activeLabel: pattern[activeIdx] || '' };
        uiModel.view = buildWindow(pattern, activeIdx);
        var activeDisplayLabel = pickDisplayGearLabel(raw);
        if (activeDisplayLabel.length > 0 && uiModel.view.slots[3] !== activeDisplayLabel) {
          uiModel.view.slots[3] = activeDisplayLabel;
          uiModel.view.isReverse = (activeDisplayLabel === 'R' || /^R\d+$/.test(activeDisplayLabel));
        }
        var gLabel = activeDisplayLabel.length > 0 ? activeDisplayLabel : (pattern[activeIdx] || '');

        // Issue Fix: Trigger shift animation when gear changes
        if (gLabel !== scope.data.gearLabel) {
          scope.data.isShifting = true;
          if (shiftTimeoutPromise) { $timeout.cancel(shiftTimeoutPromise); }
          shiftTimeoutPromise = $timeout(function() { 
            scope.data.isShifting = false; 
            shiftTimeoutPromise = null;
          }, 200);
        }

        var first = gLabel.charAt(0);
        scope.data.gearLabel = gLabel;
        scope.data.currentSlot = activeIdx >= 0 ? (activeIdx + 1) : 0;
        scope.data.isSportMode = first === 'S';
        scope.data.isManualMode = first === 'M';
        if (tx.class !== 'loading' && tx.class !== 'unknown') {
          scope.data.gearList = uiModel.view.slots;
          scope.data._isReverse = uiModel.view.isReverse;
        } else {
          scope.data.gearList = EMPTY_GEAR_WINDOW.slice();
          scope.data._isReverse = false;
        }
      }

      scope.$on('NexTMinimaL_DNA', function(event, dna) {
        if (!dna || !dna.ready) return;
        scope.$evalAsync(function() {
          var tx = dna.transmission || {};
          var eng = dna.engine || {};
          var ind = dna.induction || {};
          var vehicle = dna.vehicle || {};
          var modes = normalizeModes(tx.availableModes);
          var nextMeta = createLuaMeta();

          nextMeta.ready = true;
          nextMeta.vehicle.name = vehicle.name || '';
          nextMeta.vehicle.brand = vehicle.brand || '';
          nextMeta.vehicle.config = vehicle.config || '';

          nextMeta.engine.maxRPM = eng.maxRPM > 0 ? eng.maxRPM : 7000;
          nextMeta.engine.idleRPM = eng.idleRPM > 0 ? eng.idleRPM : 800;
          nextMeta.engine.redlineRPM = eng.redlineRPM > 0 ? eng.redlineRPM : nextMeta.engine.maxRPM;
          nextMeta.engine.isElectric = !!eng.isElectric;
          if (nextMeta.engine.isElectric) nextMeta.engine.idleRPM = 0;

          nextMeta.transmission.rawType = tx.rawType || '';
          nextMeta.transmission.class = tx.class || (tx.isManual ? 'manual' : tx.isAutomatic ? 'automatic' : 'unknown');
          nextMeta.transmission.code = mapTransmissionClassToCode(nextMeta.transmission.class);
          nextMeta.transmission.isManual = !!tx.isManual;
          nextMeta.transmission.isAutomatic = !!tx.isAutomatic;
          nextMeta.transmission.isDCT = !!tx.isDCT;
          nextMeta.transmission.isCVT = !!tx.isCVT;
          nextMeta.transmission.isSequential = !!tx.isSequential;
          nextMeta.transmission.usesFloat = !!tx.usesFloat;
          nextMeta.transmission.availableModes = modes;
          nextMeta.transmission.selectorModes = normalizeModes(tx.selectorModes);
          nextMeta.transmission.currentMode = typeof tx.currentMode === 'string' ? tx.currentMode : '';
          nextMeta.transmission.currentModeFresh = !!nextMeta.transmission.currentMode;
          nextMeta.transmission.selectorSource = tx.selectorSource || 'none';
          nextMeta.transmission.maxGearIndex = tx.maxGearIndex > 0 ? tx.maxGearIndex : 6;
          nextMeta.transmission.minGearIndex = tx.minGearIndex < 0 ? tx.minGearIndex : -1;
          nextMeta.transmission.gearCount = tx.gearCount > 0 ? tx.gearCount : (nextMeta.transmission.maxGearIndex + Math.abs(nextMeta.transmission.minGearIndex) + 1);

          nextMeta.induction.turboCount = ind.turboCount || 0;
          nextMeta.induction.superchargerCount = ind.superchargerCount || 0;
          nextMeta.induction.hasTurbo = !!ind.hasTurbo;
          nextMeta.induction.hasSupercharger = !!ind.hasSupercharger;
          nextMeta.induction.isTwinTurbo = !!ind.isTwinTurbo;
          nextMeta.induction.isTwinCharged = !!ind.isTwinCharged;
          nextMeta.induction.isQuadTurbo = !!ind.isQuadTurbo;

          seedSeenGears(nextMeta);
          scope.luaMeta = nextMeta;
          clearDNACatchUp();

          scope.data.hasTurbo = nextMeta.induction.hasTurbo;
          scope.data.hasSuper = nextMeta.induction.hasSupercharger;
          scope.data.isElectric = nextMeta.engine.isElectric;

          // Corner data from DNA
          if (dna.wheels) {
            scope.data.hasTires = dna.wheels.hasTires;
            scope.data.tires = dna.wheels.tires;
            scope.data.hasBrakes = dna.wheels.hasBrakes;
            scope.data.brakes = dna.wheels.brakes;
          }

          updateDashCols();

          if (nextMeta.induction.isQuadTurbo) {
            scope.data.turboLabel = 'QUAD-T';
          } else if (nextMeta.induction.turboCount >= 3) {
            scope.data.turboLabel = 'TRI-T';
          } else {
            scope.data.turboLabel = nextMeta.induction.isTwinTurbo ? 'TWIN-T' : 'TURBO';
          }

          if (latestElectrics) updateUIModel({ electrics: latestElectrics });
        });
      });

      scope.$on('NexTMinimaL_Wheels', function(event, wd) {
        if (!wd) return;
        scope.$evalAsync(function() {
          scope.data.hasTires = !!wd.hasTires;
          scope.data.tiresDeflated = wd.tiresDeflated || { fl:false, fr:false, rl:false, rr:false };
          scope.data.hasBrakes = !!wd.hasBrakes;
          scope.data.padMaterial = wd.padMaterial || 'street';
        });
      });

      scope.$on('NexTMinimaL_SystemsUpdate', function(event, data) {
        if (!data) return;
        scope.$evalAsync(function() {
          if (data.auxiliary) {
            var aux = data.auxiliary;
            scope.data.hasNos = !!aux.hasNos;
            scope.data.nosActive = !!aux.nosActive;
            scope.data.nosLevel = typeof aux.nosLevel === 'number' ? Math.max(0, Math.min(1, aux.nosLevel)) : 1;
          }
          if (data.drivetrain) {
            var dt = data.drivetrain;
            scope.data.has4wd = !!dt.has4wd;
            scope.data.is4wd = dt.mode4wd !== '2wd';
            scope.data.hasLowRange = !!dt.hasLowRange;
            scope.data.lowRangeActive = !!dt.lowRangeActive;
            scope.data.anyDiffLocked = (dt.fDiff && dt.fDiff.state === 1) || (dt.cDiff && dt.cDiff.state === 1) || (dt.rDiff && dt.rDiff.state === 1);
          }
        });
      });

      function resetUIModel() {
        uiModel = createUIModel();
        scope.luaMeta = createLuaMeta();
        latestElectrics = null;
        angular.extend(scope.data, createDataState());
        scope.data.gearList = uiModel.view.slots;
      }

      scope.getGearClass = function(index, g) {
        if (index === 3) return scope.data._isReverse ? 'nxt-g-act nxt-g-rev' : 'nxt-g-act';
        if (index === 2 || index === 4) return 'nxt-g-adj';
        return 'nxt-g-far';
      };

      scope.getMiniGearClass = function(index, g) {
        if (index === 3) return scope.data._isReverse ? 'nxt-mini-act nxt-g-rev' : 'nxt-mini-act';
        return 'nxt-mini-adj';
      };

      function updateRPM(e, scope) {
        var rpm = e.rpm || e.rpmTacho || 0;
        var rpmIdle = scope.luaMeta.engine.idleRPM || 800;
        var rpmMax = scope.luaMeta.engine.maxRPM || 7000;
        var isElectric = !!scope.luaMeta.engine.isElectric;
        if (isElectric) rpmIdle = 0;

        _rpmSmooth = _rpmSmooth * 0.88 + rpm * 0.12;
        // Issue Fix: Clamp RPM to 0 to prevent negative values
        _rpmSmooth = Math.max(0, _rpmSmooth);
        
        scope.data.rpm = Math.floor(_rpmSmooth);
        scope.data.rpmPct = Math.max(0, Math.min(100, rpmMax > rpmIdle ? ((rpm - rpmIdle) / (rpmMax - rpmIdle)) * 100 : 0));

        // Issue Fix: Redline logic (80-90% warning, >90% critical/redline)
        if (!isElectric && rpm < rpmIdle * 1.25) {
          scope.data.rpmZone = 'nxt-rpm-idle'; 
          scope.data.rpmBg = '#4fc3f7';
        } else if (rpm > rpmMax * 0.90) {
          scope.data.rpmZone = isElectric ? 'nxt-rpm-ered' : 'nxt-rpm-red';
          scope.data.rpmBg = isElectric ? '#00d4ff' : '#ff3030';
        } else if (rpm > rpmMax * 0.80) {
          scope.data.rpmZone = 'nxt-rpm-warn'; 
          scope.data.rpmBg = '#ffaa00';
        } else {
          scope.data.rpmZone = 'nxt-rpm-norm'; 
          scope.data.rpmBg = '#3ddc84';
        }
      }

      function updateGearCarousel(streams, scope) {
        if (typeof streams.electrics.gear !== 'undefined' && streams.electrics.gear !== null) {
          scope.luaMeta.transmission.currentGear = String(streams.electrics.gear);
        }
        scope.luaMeta.transmission.currentModeFresh = false;
        updateUIModel(streams);
      }

      function updateThermals(td, scope) {
        var wheels = parseThermalWheels(td);
        if (wheels) {
          var wFL = getWheelData(wheels, 'FL'), wFR = getWheelData(wheels, 'FR'), wRL = getWheelData(wheels, 'RL'), wRR = getWheelData(wheels, 'RR');
          
          var pFL = wFL && (wFL.pressure !== undefined ? wFL.pressure : wFL.tirePressure);
          var pFR = wFR && (wFR.pressure !== undefined ? wFR.pressure : wFR.tirePressure);
          var pRL = wRL && (wRL.pressure !== undefined ? wRL.pressure : wRL.tirePressure);
          var pRR = wRR && (wRR.pressure !== undefined ? wRR.pressure : wRR.tirePressure);

          var isDef = scope.data.tiresDeflated || {};

          // If deflated from Lua, force 0. Else use sensor.
          var tpFL = isDef.fl ? 0 : (pFL !== undefined ? Math.max(0, paToGaugePsi(pFL)) : 0);
          var tpFR = isDef.fr ? 0 : (pFR !== undefined ? Math.max(0, paToGaugePsi(pFR)) : 0);
          var tpRL = isDef.rl ? 0 : (pRL !== undefined ? Math.max(0, paToGaugePsi(pRL)) : 0);
          var tpRR = isDef.rr ? 0 : (pRR !== undefined ? Math.max(0, paToGaugePsi(pRR)) : 0);

          var validTire = (pFL !== undefined || pFR !== undefined);
          if (validTire) scope.data.hasTires = true;
          if (validTire) {
            if (Math.abs(_tiresSmooth.fl - tpFL) > TP_HYST || tpFL < 0.5) _tiresSmooth.fl = tpFL;
            if (Math.abs(_tiresSmooth.fr - tpFR) > TP_HYST || tpFR < 0.5) _tiresSmooth.fr = tpFR;
            if (Math.abs(_tiresSmooth.rl - tpRL) > TP_HYST || tpRL < 0.5) _tiresSmooth.rl = tpRL;
            if (Math.abs(_tiresSmooth.rr - tpRR) > TP_HYST || tpRR < 0.5) _tiresSmooth.rr = tpRR;
            scope.data.tires = { fl: _tiresSmooth.fl, fr: _tiresSmooth.fr, rl: _tiresSmooth.rl, rr: _tiresSmooth.rr };
          }

          // Brake surface temperature
          var btFL = wFL && wFL.brakeSurfaceTemperature != null ? wFL.brakeSurfaceTemperature : -1;
          var btFR = wFR && wFR.brakeSurfaceTemperature != null ? wFR.brakeSurfaceTemperature : -1;
          var btRL = wRL && wRL.brakeSurfaceTemperature != null ? wRL.brakeSurfaceTemperature : -1;
          var btRR = wRR && wRR.brakeSurfaceTemperature != null ? wRR.brakeSurfaceTemperature : -1;
          var validBrake = btFL > -1 && btFR > -1;
          if (validBrake) scope.data.hasBrakes = true;
          if (validBrake) {
            scope.data.brakes = {
              fl: rollMean(_brakeBuffers.fl, btFL, 3),
              fr: rollMean(_brakeBuffers.fr, btFR, 3),
              rl: btRL > -1 ? rollMean(_brakeBuffers.rl, btRL, 3) : 0,
              rr: btRR > -1 ? rollMean(_brakeBuffers.rr, btRR, 3) : 0
            };
          }        }
      }

      scope.$on('streamsUpdate', function(event, streams) {
        scope.$evalAsync(function() {
          if (!streams || !streams.electrics) return;
          var e = streams.electrics;
          latestElectrics = e;

          // Speed Smoothing (0.85/0.15)
          var speedMs = e.wheelspeed || e.airspeed || 0;
          _speedSmooth = _speedSmooth * 0.85 + speedMs * 0.15;
          var speedVal = _speedSmooth;

          try {
            if (typeof UiUnits !== 'undefined' && UiUnits.speed) {
              var conv = UiUnits.speed(speedVal);
              scope.data.speed = Math.floor(conv.val);
              scope.data.speedUnit = conv.unit;
            } else {
              scope.data.speed = Math.floor(speedVal * 3.6);
              scope.data.speedUnit = 'km/h';
            }
          } catch(err) {
            scope.data.speed = Math.floor(speedVal * 3.6);
          }
          scope.data.speedPad = String(scope.data.speed).padStart(3, '0');

          // Fuel / temp
          scope.data.fuel = Math.max(0, Math.min(100, Math.round((e.fuel || 0) * 100)));
          var t = e.watertemp || 0;
          scope.data.waterTemp = Math.round(t);
          scope.data.tempPct = Math.max(0, Math.min(100, ((t - 50) / 80) * 100));

          // Lights cluster
          scope.data.signalL = (e.signal_L > 0.5);
          scope.data.signalR = (e.signal_R > 0.5);
          scope.data.hazards = scope.data.signalL && scope.data.signalR;
          scope.data.parking = (e.parkingbrake > 0.5);
          scope.data.lightbarActive = (e.lightbar > 0.5);

          if (e.highbeam) scope.data.lights = 'high';
          else if (e.lowbeam) scope.data.lights = 'low';
          else if (e.fog_front || e.foglight || e.fog || e.noseconelight || scope.data.fogActive) scope.data.lights = 'fog';
          else if (e.parkinglight || e.parkinglights) scope.data.lights = 'park';
          else scope.data.lights = 'off';

          // Warning lights
          scope.data.checkEngine = (e.checkengine === 1 || e.checkengine === true);
          scope.data.oilWarning = (e.oil === 1 || e.oil === true);
          scope.data.fatalError = (e.engineFatalError === 1 || e.engineFatalError === true);

          // Boost (live override from electrics)
          if (e.hasOwnProperty('turboBoost')) { scope.data.hasTurbo = true; scope.data.turboBoost = e.turboBoost || 0; }
          if (e.hasOwnProperty('superchargerBoost')) { scope.data.hasSuper = true; scope.data.superBoost = e.superchargerBoost || 0; }
          updateDashCols();

          // Gear learning
          if (typeof e.gear === 'string' && e.gear.length > 0 && e.gear !== '0' && e.gear !== '-1') {
            if (!scope.luaMeta.learning.seenGears[e.gear]) scope.luaMeta.learning.seenGears[e.gear] = true;
          }
          if (typeof e.gear === 'string' && e.gear.length > 0) {
            var g0 = e.gear.charAt(0);
            if ((g0 === 'S' || g0 === 'M') && e.gear.length > 1) {
              var nSuf = parseInt(e.gear.slice(1), 10);
              if (!isNaN(nSuf) && nSuf > 0) {
                if (g0 === 'S' && nSuf > scope.luaMeta.learning.maxSIndex) scope.luaMeta.learning.maxSIndex = nSuf;
                if (g0 === 'M' && nSuf > scope.luaMeta.learning.maxMIndex) scope.luaMeta.learning.maxMIndex = nSuf;
              }
            }
          }

          updateRPM(e, scope);
          updateGearCarousel(streams, scope);
          updateThermals(streams.wheelThermalData, scope);
        });
      });

      scope.$on('VehicleChange', function() { resetUIModel(); scheduleDNACatchUp(50); });
      scope.$on('VehicleFocusChanged', function() { resetUIModel(); scheduleDNACatchUp(50); });
      scope.$on('VehicleReset', function() { resetUIModel(); scheduleDNACatchUp(50); });
      scope.$on('$destroy', function() {
        clearDNACatchUp();
        if (shiftTimeoutPromise) { $timeout.cancel(shiftTimeoutPromise); }
        StreamsManager.remove(['electrics', 'wheelThermalData']);
      });

      resetUIModel();
      scheduleDNACatchUp(0);
    }
  };
};

angular.module('beamng.apps')
.directive('nextMinimalTacho', ['$timeout', nxtTachoDirective])
.directive('nexMinimalTacho', ['$timeout', nxtTachoDirective]);



var NXS_IGN_STATES = [
  { id: 'OFF', label: 'OFF', hint: 'All systems disabled', color: 'rgba(255,255,255,0.35)' },
  { id: 'ACC', label: 'ACC', hint: 'Accessory power \u00b7 radio, lights', color: '#ffaa00' },
  { id: 'IGN', label: 'IGN', hint: 'Ignition armed \u00b7 ready to crank', color: '#ffaa00' },
  { id: 'START', label: 'CRANK', hint: 'Engine cranking\u2026', color: '#ff3030' },
  { id: 'RUN', label: 'RUN', hint: 'Engine running', color: '#3ddc84' },
];

var NXS_STARTER_TEMPLATE = `
<div class="bngApp nxs-root" ng-class="'nxs-ign-' + starter.state.toLowerCase()">

  <!-- IGNITION / START BUTTON -->
  <div class="nxs-ign-row">
    <div class="nxs-start-btn"
         ng-mousedown="onStarterDown($event)"
         ng-mouseup="onStarterUp($event)"
         ng-mouseleave="onStarterUp($event)">
      <span class="nxs-start-ring"></span>
      <span class="nxs-start-inner">
        <span class="nxs-start-lbl">ENGINE</span>
        <span class="nxs-start-big">START</span>
        <span class="nxs-start-sub">STOP</span>
      </span>
    </div>

    <div class="nxs-ign-status">
      <div class="nxs-ign-row-top">
        <span class="nxs-ign-k">IGNITION</span>
        <div class="nxs-ign-pills">
          <span ng-repeat="s in ignStates track by s.id"
                class="nxs-ign-pill"
                ng-class="{'nxs-pill-on': $index === starter.ignIdx, 'nxs-pill-past': $index < starter.ignIdx}"
                ng-style="$index === starter.ignIdx ? {'--pc': s.color, 'color': s.color, 'borderColor': s.color} : {}">
            {{s.id}}
          </span>
        </div>
      </div>
      <div class="nxs-ign-now">
        <span class="nxs-ign-dot"
              ng-style="{'background': ignStates[starter.ignIdx].color, 'box-shadow': '0 0 10px ' + ignStates[starter.ignIdx].color}">
        </span>
        <span class="nxs-ign-name" ng-style="{'color': ignStates[starter.ignIdx].color}">
          {{ignStates[starter.ignIdx].label}}
        </span>
      </div>
      <div class="nxs-ign-hint">{{ignStates[starter.ignIdx].hint}}</div>
    </div>
  </div>

  <!-- DRIVETRAIN CHIPS -->
  <div class="nxs-sect" ng-if="drivetrainButtons.length > 0">
    <div class="nxs-sect-ttl">DRIVETRAIN</div>
    <div class="nxs-chips" ng-class="{'nxs-narrow-layout': data.isNarrow}">
      <span ng-repeat="btn in drivetrainButtons"
            class="nxs-chip"
            ng-class="btn.active ? 'nxs-chip-active' : 'nxs-chip-off'"
            ng-click="toggleDevice(btn.id)">
        <span class="nxs-chip-d" ng-class="[btn.class + '-dot', btn.active ? 'nxs-chip-d-on' : '']"></span>
        <span class="nxs-chip-n">{{btn.label}}</span>
        <span class="nxs-chip-v" ng-if="btn.mode">{{btn.mode}}</span>
      </span>
    </div>
  </div>

  <!-- LAUNCH CHIPS -->
  <div class="nxs-sect" ng-if="luaMeta.auxiliary.hasNos || luaMeta.auxiliary.hasJato">
    <div class="nxs-sect-ttl">LAUNCH</div>
    <div class="nxs-chips">
      <span class="nxs-chip nxs-chip-nos"
            ng-if="luaMeta.auxiliary.hasNos"
            ng-class="luaMeta.auxiliary.nosActive ? 'nxs-chip-active' : 'nxs-chip-off'"
            ng-click="toggleNos()">
        <span class="nxs-chip-d" ng-class="luaMeta.auxiliary.nosActive ? 'nxs-chip-d-nos nxs-chip-d-on' : 'nxs-chip-d-nos'"></span>
        <span class="nxs-chip-n">N2O</span>
        <span class="nxs-chip-v">{{(luaMeta.auxiliary.nosLevel * 100) | number:0}}%</span>
      </span>
      <span class="nxs-chip nxs-chip-jato"
            ng-if="luaMeta.auxiliary.hasJato"
            ng-class="luaMeta.auxiliary.jatoActive ? 'nxs-chip-active' : 'nxs-chip-off'"
            ng-click="toggleJato()">
        <span class="nxs-chip-d" ng-class="luaMeta.auxiliary.jatoActive ? 'nxs-chip-d-jato nxs-chip-d-on' : 'nxs-chip-d-jato'"></span>
        <span class="nxs-chip-n">JATO</span>
      </span>
    </div>
  </div>

  <!-- AUX LIGHTS CHIPS -->
  <div class="nxs-sect" ng-if="auxLightButtons.length > 0">
    <div class="nxs-sect-ttl">AUX LIGHTS</div>
    <div class="nxs-chips">
      <span ng-repeat="btn in auxLightButtons track by btn.id"
            class="nxs-chip nxs-chip-aux"
            ng-class="luaMeta.auxiliary[btn.stateKey] ? 'nxs-chip-active' : 'nxs-chip-off'"
            ng-click="toggleAuxLight(btn)">
        <span class="nxs-chip-d nxs-chip-d-aux"
              ng-class="luaMeta.auxiliary[btn.stateKey] ? 'nxs-chip-d-on' : ''"></span>
        <span class="nxs-chip-n">{{btn.label}}</span>
      </span>
    </div>
  </div>

  <!-- ASSIST CHIPS -->
  <div class="nxs-sect" ng-if="luaMeta.assists.esc.installed !== false || luaMeta.assists.abs.installed || luaMeta.assists.tcs.installed">
    <div class="nxs-sect-ttl">ASSIST</div>
    <div class="nxs-chips">
      <span class="nxs-chip nxs-chip-esc"
            ng-if="luaMeta.assists.esc.installed !== false"
            ng-class="data.escModeOff ? 'nxs-chip-warn' : (data.escActive ? 'nxs-chip-esc-on' : 'nxs-chip-off')"
            ng-click="nextDriveMode()">
        <span class="nxs-chip-d nxs-chip-d-esc" ng-class="data.escActive && !data.escModeOff ? 'nxs-chip-d-on' : ''"></span>
        <span class="nxs-chip-n">ESC</span>
        <span class="nxs-chip-v" ng-if="luaMeta.assists.esc.modeName">{{luaMeta.assists.esc.modeName}}</span>
      </span>
      <span class="nxs-chip"
            ng-if="luaMeta.assists.abs.installed"
            ng-class="data.absActive ? 'nxs-chip-abs-on' : 'nxs-chip-off'">
        <span class="nxs-chip-d nxs-chip-d-abs" ng-class="data.absActive ? 'nxs-chip-d-on' : ''"></span>
        <span class="nxs-chip-n">ABS</span>
        <span class="nxs-chip-v">{{data.absActive ? 'ACT' : 'ON'}}</span>
      </span>
      <span class="nxs-chip"
            ng-if="luaMeta.assists.tcs.installed"
            ng-class="data.tcsActive ? 'nxs-chip-tcs-on' : 'nxs-chip-off'">
        <span class="nxs-chip-d nxs-chip-d-tcs" ng-class="data.tcsActive ? 'nxs-chip-d-on' : ''"></span>
        <span class="nxs-chip-n">TCS</span>
        <span class="nxs-chip-v">{{data.tcsActive ? 'ACT' : 'ON'}}</span>
      </span>
    </div>
  </div>

  <div class="nxs-footer">
    <div class="nxs-safety">
      <span class="nxs-chk" ng-if="luaMeta.transmission.isManual"  ng-class="starter.clutchSafe ? 'nxs-ok' : 'nxs-fail'">CLT</span>
      <span class="nxs-chk" ng-if="!luaMeta.transmission.isManual" ng-class="starter.brakeSafe ? 'nxs-ok' : 'nxs-fail'">BRK</span>
      <span class="nxs-chk" ng-if="!luaMeta.transmission.isManual" ng-class="starter.gearSafe  ? 'nxs-ok' : 'nxs-fail'">P/N</span>
    </div>
    <div class="nxs-tip">{{starter.tip}}</div>
  </div>

</div>
`.trim();

var nxtStarterDirective = function ($timeout) {
  return {
    template: NXS_STARTER_TEMPLATE,
    replace: true,
    restrict: 'EA',
    link: function (scope, element, attrs) {

      if (!document.getElementById('nextminimal-starter-css')) {
        var link = document.createElement('link');
        link.id = 'nextminimal-starter-css';
        link.rel = 'stylesheet';
        link.href = '/ui/modules/apps/NextMinimalStarter/app.css';
        document.head.appendChild(link);
      }

      StreamsManager.add(['electrics']);

      // Resolve ignition colors from CSS vars (--nxs-ign-*) so theming has a single source of truth.
      (function resolveIgnColors() {
        var cs = window.getComputedStyle ? window.getComputedStyle(document.documentElement) : null;
        function varOr(name, fallback) {
          if (!cs) return fallback;
          var v = (cs.getPropertyValue(name) || '').trim();
          return v || fallback;
        }
        var map = { OFF: '--nxs-ign-off', ACC: '--nxs-ign-acc', IGN: '--nxs-ign-ign', START: '--nxs-ign-start', RUN: '--nxs-ign-run' };
        for (var i = 0; i < NXS_IGN_STATES.length; i++) {
          var s = NXS_IGN_STATES[i];
          s.color = varOr(map[s.id], s.color);
        }
      })();
      scope.ignStates = NXS_IGN_STATES;

      function createLuaMeta() {
        return {
          ready: false,
          vehicle: { name: '', brand: '', config: '' },
          transmission: { isManual: false },
          drivetrain: {
            fDiff: { installed: false, state: 0 },
            cDiff: { installed: false, state: 0 },
            rDiff: { installed: false, state: 0 },
            has4wd: false, mode4wd: '2wd',
            hasLowRange: false, lowRangeActive: false
          },
          auxiliary: { hasNos: false, nosActive: false, nosLevel: 1, hasJato: false, jatoActive: false },
          assists: {
            esc: { installed: null, hasController: false, enabled: null, modeName: '' },
            abs: { installed: null },
            tcs: { installed: null }
          },
          auxLightCaps: { hasFog: false, hasNosecone: false, hasSpotlight: false, hasExtra1: false, hasExtra2: false, hasLightbar: false }
        };
      }

      function createStarterState() {
        return {
          state: 'OFF', tip: 'SYSTEM OFF',
          rawLevel: 0, lastRpm: 0, ignIdx: 0,
          clutchSafe: false, brakeSafe: false, gearSafe: false,
          isCranking: false, hintText: null, hintTimer: null
        };
      }

      scope.luaMeta = createLuaMeta();
      scope.starter = createStarterState();
      scope.data = {
        escActive: false, escModeOff: false, absActive: false, tcsActive: false,
        isNarrow: false
      };
      scope.drivetrainButtons = [];
      scope.auxLightButtons = [];

      scope.$on('app:resized', function (event, data) {
        scope.$evalAsync(function () {
          scope.data.isNarrow = (data.width < 210);
        });
      });

      function cssClassForDevice(dev) {
        var devType = (dev.devType || '').toLowerCase();
        var lowId = (dev.id || '').toLowerCase();
        var low = (dev.label || '').toLowerCase();
        if (devType.indexOf('transfercase') !== -1 || devType.indexOf('transfer') !== -1 ||
          lowId.indexOf('transfercase') !== -1 || lowId.indexOf('transfer') !== -1)
          return 'nxs-btn-transfer';
        if (devType.indexOf('rangebox') !== -1 || lowId.indexOf('rangebox') !== -1 ||
          low.indexOf('range') !== -1)
          return 'nxs-btn-range';
        if (devType.indexOf('differential') !== -1 || devType.indexOf('lsd') !== -1 ||
          devType.indexOf('viscous') !== -1 ||
          lowId.indexOf('diff') !== -1 || lowId.indexOf('split') !== -1 ||
          low.indexOf('diff') !== -1 || low.indexOf('lock') !== -1 ||
          lowId.indexOf('axle') !== -1 || low.indexOf('axle') !== -1)
          return 'nxs-btn-diff';

        if (devType.indexOf('shaft') !== -1 || lowId.indexOf('shaft') !== -1 ||
          low.indexOf('shaft') !== -1)
          return 'nxs-btn-transfer';
        return 'nxs-btn-4wd';
      }

      function rebuildButtons() {
        var raw = scope.luaMeta.toggleableDevices || [];
        var devices = (Array.isArray(raw) ? raw : Object.values(raw)).filter(function (dev) {
          return !dev.isHidden;
        });
        scope.drivetrainButtons = devices.map(function (dev) {
          return {
            id: dev.id,
            label: dev.label,
            mode: dev.mode || '',
            class: cssClassForDevice(dev),
            active: !!dev.isActive
          };
        });
      }

      function rebuildAuxButtons() {
        var caps = scope.luaMeta.auxLightCaps || {};
        var buttons = [];

        // Dynamic fusion of FOG + LIGHTBAR (Rack/LED)
        if (caps.hasFog || caps.hasLightbar) {
          var label = "FOG";
          if (caps.isLED) label = caps.hasFog ? "FOG + LED" : "LED BAR";
          else if (caps.isRack) label = caps.hasFog ? "FOG + RACK" : "RACKLIGHTS";
          
          buttons.push({ id: 'fog_fusion', label: label, luaFn: 'toggleAuxFusion()', stateKey: 'fogActive' });
        }

        if (caps.hasNosecone)  buttons.push({ id: 'nosecone', label: 'NOSECONE', luaFn: 'toggleNosecone()',  stateKey: 'noseconelight' });
        if (caps.hasSpotlight) buttons.push({ id: 'spot',     label: 'SPOT',     luaFn: 'toggleSpotlight()', stateKey: 'spotlightOn' });

        scope.auxLightButtons = buttons;
      }

      function updateButtonStates(modes) {
        if (!modes) return;
        angular.forEach(scope.drivetrainButtons, function (btn) {
          var m = modes[btn.id];
          if (m !== undefined) {
            btn.mode = (typeof m === 'object' && m.mode !== undefined) ? m.mode : (typeof m === 'string' ? m : btn.mode);
            btn.active = (typeof m === 'object' && m.isActive !== undefined) ? !!m.isActive : btn.active;
          }
        });
      }

      function isSafetyHeld() {
        var tx = scope.luaMeta.transmission || {};
        return tx.isManual
          ? scope.starter.clutchSafe
          : (scope.starter.brakeSafe && scope.starter.gearSafe);
      }

      function computeTip() {
        if (scope.starter.hintText) return scope.starter.hintText;
        var s = scope.starter.state;
        if (s === 'OFF') return 'SYSTEM OFF';
        if (s === 'ACC') return 'ACCESSORIES ON';
        if (s === 'START') return 'ENGINE STARTING';
        if (s === 'RUN') return 'ENGINE RUNNING';
        var isManual = (scope.luaMeta.transmission || {}).isManual;
        return isManual ? 'CLUTCH + CLICK TO START' : 'BRAKE + P/N + CLICK TO START';
      }

      function abortCrank(showHint) {
        scope.starter.isCranking = false;
        bngApi.activeObjectLua('extensions.nextMinimalDNA.setIgnition(2)');
        if (showHint) {
          var isManual = (scope.luaMeta.transmission || {}).isManual;
          scope.starter.hintText = isManual ? 'RELEASED CLUTCH \u2192 CANCELLED' : 'RELEASED BRAKE \u2192 CANCELLED';
          if (scope.starter.hintTimer) $timeout.cancel(scope.starter.hintTimer);
          scope.starter.hintTimer = $timeout(function () {
            scope.starter.hintText = null;
          }, 3000);
        }
      }

      scope.onStarterDown = function ($event) {
        if ($event) $event.preventDefault();
        var level = scope.starter.rawLevel || 0;
        if (scope.starter.state === 'RUN') {

          bngApi.activeObjectLua('extensions.nextMinimalDNA.setIgnition(0)');
        } else if (isSafetyHeld()) {
          scope.starter.isCranking = true;
          bngApi.activeObjectLua('extensions.nextMinimalDNA.setIgnition(3)');
        } else {
          var next = (level >= 2) ? 0 : (level + 1);
          bngApi.activeObjectLua('extensions.nextMinimalDNA.setIgnition(' + next + ')');
        }
      };

      scope.onStarterUp = function ($event) {
        if ($event) $event.preventDefault();
        if (scope.starter.isCranking) {
          scope.starter.isCranking = false;
          bngApi.activeObjectLua('extensions.nextMinimalDNA.setIgnition(2)');
        }
      };

      scope.nextDriveMode = function () { bngApi.activeObjectLua('extensions.nextMinimalDNA.nextDriveMode()'); };
      scope.toggleDevice = function (id) { bngApi.activeObjectLua('extensions.nextMinimalDNA.toggleDevice("' + id + '")'); };
      scope.toggleNos = function () { bngApi.activeObjectLua('extensions.nextMinimalDNA.toggleNos()'); };
      scope.toggleJato = function () { bngApi.activeObjectLua('extensions.nextMinimalDNA.toggleJato()'); };
      scope.toggleAuxLight = function (btn) { bngApi.activeObjectLua('extensions.nextMinimalDNA.' + btn.luaFn); };

      var dnaCatchUpTimer = null;
      function clearCatchUp() { if (dnaCatchUpTimer !== null) { $timeout.cancel(dnaCatchUpTimer); dnaCatchUpTimer = null; } }
      function scheduleCatchUp(delayMs) {
        clearCatchUp();
        dnaCatchUpTimer = $timeout(function () {
          dnaCatchUpTimer = null;
          if (!scope.luaMeta.ready && typeof bngApi !== 'undefined' && bngApi.activeObjectLua) {
            bngApi.activeObjectLua('extensions.nextMinimalDNA.getVehicleDNA()');
          }
        }, typeof delayMs === 'number' ? delayMs : 0);
      }

      function resetState() {
        if (scope.starter && scope.starter.hintTimer) $timeout.cancel(scope.starter.hintTimer);
        scope.luaMeta = createLuaMeta();
        scope.starter = createStarterState();
        scope.data = { escActive: false, escModeOff: false, absActive: false, tcsActive: false };
        scope.drivetrainButtons = [];
        scope.auxLightButtons = [];
      }

      scope.$on('NexTMinimaL_DNA', function (event, dna) {
        if (!dna || !dna.ready) return;
        scope.$evalAsync(function () {
          clearCatchUp();
          scope.luaMeta.ready = true;
          scope.luaMeta.transmission = dna.transmission || createLuaMeta().transmission;
          scope.luaMeta.drivetrain = dna.drivetrain || createLuaMeta().drivetrain;
          scope.luaMeta.auxiliary = dna.auxiliary || createLuaMeta().auxiliary;
          scope.luaMeta.toggleableDevices = dna.toggleableDevices || [];
          scope.luaMeta.auxLightCaps = dna.auxLightCaps || createLuaMeta().auxLightCaps;
          rebuildButtons();
          rebuildAuxButtons();

          var a = (dna.assists && dna.assists.esc) || {};
          scope.luaMeta.assists.esc.installed = typeof a.installed === 'boolean' ? a.installed : null;
          scope.luaMeta.assists.esc.hasController = !!a.hasController;
          scope.luaMeta.assists.esc.enabled = typeof a.enabled === 'boolean' ? a.enabled : null;
          scope.luaMeta.assists.esc.modeName = typeof a.modeName === 'string' ? a.modeName.trim() : '';

          if (dna.assists && dna.assists.abs) scope.luaMeta.assists.abs.installed = dna.assists.abs.installed !== undefined ? dna.assists.abs.installed : null;
          if (dna.assists && dna.assists.tcs) scope.luaMeta.assists.tcs.installed = dna.assists.tcs.installed !== undefined ? dna.assists.tcs.installed : null;
        });
      });

      scope.$on('NexTMinimaL_SystemsUpdate', function (event, data) {
        if (!data) return;
        scope.$evalAsync(function () {
          if (data.drivetrain) scope.luaMeta.drivetrain = data.drivetrain;
          if (data.auxiliary) scope.luaMeta.auxiliary = data.auxiliary;
          if (data.deviceModes) updateButtonStates(data.deviceModes);
        });
      });

      scope.$on('NexTMinimaL_Assists', function (event, assists) {
        if (!assists) return;
        scope.$evalAsync(function () {
          var a = (assists && assists.esc) || {};
          if (typeof a.installed === 'boolean') scope.luaMeta.assists.esc.installed = a.installed;
          if (typeof a.enabled === 'boolean') scope.luaMeta.assists.esc.enabled = a.enabled;
          scope.luaMeta.assists.esc.hasController = !!a.hasController;
          if (typeof a.modeName === 'string') scope.luaMeta.assists.esc.modeName = a.modeName.trim();
          if (assists.abs && assists.abs.installed !== undefined) scope.luaMeta.assists.abs.installed = assists.abs.installed;
          if (assists.tcs && assists.tcs.installed !== undefined) scope.luaMeta.assists.tcs.installed = assists.tcs.installed;
        });
      });

      scope.$on('streamsUpdate', function (event, streams) {
        if (!streams || !streams.electrics) return;
        var e = streams.electrics;
        scope.$evalAsync(function () {
          var level = Math.max(0, Math.min(3, Math.round(typeof e.ignitionLevel === 'number' ? e.ignitionLevel : 0)));
          var rpm = e.rpm || e.rpmTacho || 0;
          scope.starter.rawLevel = level;
          scope.starter.lastRpm = rpm;

          if (level === 2 && rpm > 100) {
            scope.starter.state = 'RUN';
            scope.starter.ignIdx = 4;
          } else {
            var stateNames = { 0: 'OFF', 1: 'ACC', 2: 'IGN', 3: 'START' };
            scope.starter.state = stateNames[level] || 'OFF';
            scope.starter.ignIdx = level;
          }

          var tx = scope.luaMeta.transmission || {};
          if (tx.isManual) {
            scope.starter.clutchSafe = (typeof e.clutch === 'number') && (e.clutch > 0.9);
          } else {
            scope.starter.brakeSafe = (typeof e.brake === 'number') && (e.brake > 0.5);
            scope.starter.gearSafe = (e.gear === 'P' || e.gear === 'N');
          }

          if (scope.starter.isCranking && !isSafetyHeld()) abortCrank(true);

          scope.data.escActive = !!e.escActive;
          scope.data.absActive = !!e.absActive;
          scope.data.tcsActive = !!e.tcsActive;
          scope.data.escModeOff = (scope.luaMeta.assists.esc.enabled === false);
          scope.starter.tip = computeTip();
        });
      });

      scope.$on('VehicleChange', function () { resetState(); scheduleCatchUp(50); });
      scope.$on('VehicleFocusChanged', function () { resetState(); scheduleCatchUp(50); });
      scope.$on('VehicleReset', function () { scheduleCatchUp(50); });
      scope.$on('$destroy', function () {
        clearCatchUp();
        if (scope.starter && scope.starter.hintTimer) $timeout.cancel(scope.starter.hintTimer);
        StreamsManager.remove(['electrics']);
      });

      scheduleCatchUp(0);
    }
  };
};

angular.module('beamng.apps')
  .directive('nextMinimalStarter', ['$timeout', nxtStarterDirective])
  .directive('nexMinimalStarter', ['$timeout', nxtStarterDirective]);

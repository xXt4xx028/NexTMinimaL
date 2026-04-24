// NexTMinimaL — Engine Damage v1.0
// Uses nextMinimalDNA for damage data (no duplicate streams)

angular.module('beamng.apps').directive('nextMinimalDamage', ['$timeout', '$window', function($timeout, $window) {

  var TEMPLATE =
  '<div class="bngApp nxtd-root">' +
    '<div class="nxtd-container">' +

      '<div class="nxtd-header">' +
        '<span class="nxtd-title">ENGINE DIAGNOSTICS</span>' +
        '<span class="nxtd-status" ng-class="d.statusClass">{{d.statusLabel}}</span>' +
      '</div>' +

      '<div class="nxtd-integrity-wrap">' +
        '<div class="nxtd-bar-lbl">' +
          '<span>INTEGRITY</span>' +
          '<strong ng-class="d.integrityClass">{{d.integrity}}<span class="nxtd-bar-unit">%</span></strong>' +
        '</div>' +
        '<div class="nxtd-track">' +
          '<div class="nxtd-fill" ng-class="d.integrityFillClass" ng-style="{width: d.integrity + \'%\'}"></div>' +
        '</div>' +
      '</div>' +

      '<div class="nxtd-grid">' +
        '<div class="nxtd-tile" ng-class="d.block.cls">' +
          '<span class="nxtd-tile-icon">🔩</span>' +
          '<span class="nxtd-tile-lbl">BLOCK</span>' +
          '<span class="nxtd-tile-val">{{d.block.label}}</span>' +
        '</div>' +
        '<div class="nxtd-tile" ng-class="d.pistons.cls">' +
          '<span class="nxtd-tile-icon">⚙</span>' +
          '<span class="nxtd-tile-lbl">PISTONS</span>' +
          '<span class="nxtd-tile-val">{{d.pistons.label}}</span>' +
        '</div>' +
        '<div class="nxtd-tile" ng-class="d.bearings.cls">' +
          '<span class="nxtd-tile-icon">⚙</span>' +
          '<span class="nxtd-tile-lbl">BEARINGS</span>' +
          '<span class="nxtd-tile-val">{{d.bearings.label}}</span>' +
        '</div>' +
        '<div class="nxtd-tile" ng-class="d.headgasket.cls">' +
          '<span class="nxtd-tile-icon">🔧</span>' +
          '<span class="nxtd-tile-lbl">HEAD GSKT</span>' +
          '<span class="nxtd-tile-val">{{d.headgasket.label}}</span>' +
        '</div>' +
        '<div class="nxtd-tile" ng-class="d.oil.cls">' +
          '<span class="nxtd-tile-icon">🛢</span>' +
          '<span class="nxtd-tile-lbl">OIL SYS</span>' +
          '<span class="nxtd-tile-val">{{d.oil.label}}</span>' +
        '</div>' +
        '<div class="nxtd-tile" ng-class="d.overrev.cls">' +
          '<span class="nxtd-tile-icon">⚡</span>' +
          '<span class="nxtd-tile-lbl">OVERREV</span>' +
          '<span class="nxtd-tile-val">{{d.overrev.label}}</span>' +
        '</div>' +
      '</div>' +

      '<div class="nxtd-thermals">' +
        '<div ng-if="d.showWater">' +
          '<div class="nxtd-bar-lbl">' +
            '<span>COOLANT</span>' +
            '<strong ng-class="d.waterClass">{{d.waterTemp | number:0}}<span class="nxtd-bar-unit">°C</span></strong>' +
          '</div>' +
          '<div class="nxtd-track"><div class="nxtd-fill" ng-class="d.waterFillClass" ng-style="{width: d.waterPct + \'%\'}"></div></div>' +
        '</div>' +
        '<div ng-if="d.showOilTemp">' +
          '<div class="nxtd-bar-lbl">' +
            '<span>OIL TEMP</span>' +
            '<strong ng-class="d.oilTempClass">{{d.oilTemp | number:0}}<span class="nxtd-bar-unit">°C</span></strong>' +
          '</div>' +
          '<div class="nxtd-track"><div class="nxtd-fill" ng-class="d.oilTempFillClass" ng-style="{width: d.oilTempPct + \'%\'}"></div></div>' +
        '</div>' +
      '</div>' +

      '<div class="nxtd-flags" ng-if="d.flags.length > 0">' +
        '<span class="nxtd-flag" ng-repeat="f in d.flags" ng-class="f.cls">{{f.label}}</span>' +
      '</div>' +

    '</div>' +
  '</div>';

  function makeTile(label, level) {
    var cls = ['nxtd-tile-ok', 'nxtd-tile-mild', 'nxtd-tile-crit', 'nxtd-tile-dead'];
    return { label: label, cls: cls[Math.min(level, 3)] };
  }

  return {
    template: TEMPLATE,
    replace: true,
    restrict: 'EA',
    link: function(scope) {
      if (!document.getElementById('nextminimal-damage-css')) {
        var link = document.createElement('link');
        link.id = 'nextminimal-damage-css';
        link.rel = 'stylesheet';
        link.href = '/ui/modules/apps/NexTMinimalDamage/app.css';
        document.head.appendChild(link);
      }

      scope.d = {
        statusLabel: 'NOMINAL', statusClass: 'nxtd-s-ok',
        integrity: 100, integrityClass: 'nxtd-int-ok', integrityFillClass: 'nxtd-fill-ok',
        block:      makeTile('OK', 0),
        pistons:    makeTile('OK', 0),
        bearings:   makeTile('OK', 0),
        headgasket: makeTile('OK', 0),
        oil:        makeTile('OK', 0),
        overrev:    makeTile('OK', 0),
        waterTemp: 0, waterPct: 0, waterClass: 'nxtd-temp-ok', waterFillClass: 'nxtd-fill-temp-ok', showWater: false,
        oilTemp:   0, oilTempPct: 0, oilTempClass: 'nxtd-temp-ok', oilTempFillClass: 'nxtd-fill-temp-ok', showOilTemp: false,
        flags: []
      };

      var lastDmg = null;
      var lastElec = null;

      scope.$on('NexTMinimaL_Damage', function(event, data) {
        if (!data) return;
        lastDmg = data;
        if (lastElec) processDamage(lastDmg, lastElec);
      });

      scope.$on('DamageData', function(ev, data) {
        lastDmg = data;
        if (lastElec) processDamage(lastDmg, lastElec);
      });

      StreamsManager.add(['electrics']);

      scope.$on('streamsUpdate', function(ev, streams) {
        if (!streams || !streams.electrics) return;
        lastElec = streams.electrics;
        if (lastDmg) processDamage(lastDmg, lastElec);
      });

      function processDamage(dmg, e) {
        scope.$evalAsync(function() {
          var eng = (dmg && dmg.engine) || {};

          var maxLevel = 0;

          var bLevel = 0, bLabel = 'OK';
          if (eng.blockMelted)                                           { bLevel = 3; bLabel = 'MELTED';   }
          else if (eng.engineHydrolocked)                                { bLevel = 3; bLabel = 'HYDROLKD'; }
          else if (eng.engineLockedUp || eng.engineDisabled)             { bLevel = 3; bLabel = 'LOCKED';   }
          else if (eng.catastrophicOverrevDamage || eng.catastrophicOverTorqueDamage) { bLevel = 2; bLabel = 'CRITICAL'; }
          else if (eng.impactDamage)                                     { bLevel = 1; bLabel = 'IMPACT';   }
          scope.d.block = makeTile(bLabel, bLevel);
          if (bLevel > maxLevel) maxLevel = bLevel;

          var pLevel = 0, pLabel = 'OK';
          if (eng.pistonRingsDamaged)     { pLevel = 2; pLabel = 'RINGS';  }
          else if (eng.mildOverTorqueDamage) { pLevel = 1; pLabel = 'STRESS'; }
          scope.d.pistons = makeTile(pLabel, pLevel);
          if (pLevel > maxLevel) maxLevel = pLevel;

          var rLevel = 0, rLabel = 'OK';
          if (eng.rodBearingsDamaged) { rLevel = 2; rLabel = 'ROD BRNG'; }
          scope.d.bearings = makeTile(rLabel, rLevel);
          if (rLevel > maxLevel) maxLevel = rLevel;

          var hLevel = 0, hLabel = 'OK';
          if (eng.headGasketDamaged) { hLevel = 2; hLabel = 'BLOWN'; }
          scope.d.headgasket = makeTile(hLabel, hLevel);
          if (hLevel > maxLevel) maxLevel = hLevel;

          var oLevel = 0, oLabel = 'OK';
          if (eng.starvedOfOil)  { oLevel = 3; oLabel = 'STARVED'; }
          else if (eng.oilpanLeak) { oLevel = 2; oLabel = 'LEAK';    }
          scope.d.oil = makeTile(oLabel, oLevel);
          if (oLevel > maxLevel) maxLevel = oLevel;

          var vLevel = 0, vLabel = 'OK';
          if (eng.catastrophicOverrevDamage) { vLevel = 3; vLabel = 'CATASTPH'; }
          else if (eng.overRevDanger)         { vLevel = 2; vLabel = 'DANGER';   }
          else if (eng.mildOverrevDamage)     { vLevel = 1; vLabel = 'MILD';     }
          scope.d.overrev = makeTile(vLabel, vLevel);
          if (vLevel > maxLevel) maxLevel = vLevel;

          var deductions = 0;
          if (eng.engineDisabled)                          deductions += 100;
          if (eng.blockMelted)                             deductions += 100;
          if (eng.engineLockedUp)                           deductions += 100;
          if (eng.engineHydrolocked)                        deductions += 80;
          if (eng.catastrophicOverrevDamage)               deductions += 60;
          if (eng.catastrophicOverTorqueDamage)            deductions += 60;
          if (eng.starvedOfOil)                            deductions += 55;
          if (eng.rodBearingsDamaged)                       deductions += 40;
          if (eng.pistonRingsDamaged)                       deductions += 35;
          if (eng.headGasketDamaged)                       deductions += 30;
          if (eng.engineReducedTorque)                       deductions += 20;
          if (eng.overRevDanger)                            deductions += 15;
          if (eng.overTorqueDanger)                         deductions += 15;
          if (eng.mildOverrevDamage)                        deductions += 12;
          if (eng.mildOverTorqueDamage)                     deductions += 12;
          if (eng.oilpanLeak)                               deductions += 10;
          if (eng.impactDamage)                             deductions += 10;
          if (eng.radiatorLeak)                             deductions += 8;
          if (eng.inductionSystemDamaged)                   deductions += 8;
          if (eng.turbochargerHot)                          deductions += 5;
          if (eng.coolantOverheating)                       deductions += 5;
          if (eng.oilOverheating)                           deductions += 5;
          scope.d.integrity = Math.max(0, 100 - deductions);

          if      (scope.d.integrity >= 85) { scope.d.integrityClass = 'nxtd-int-ok';   scope.d.integrityFillClass = 'nxtd-fill-ok';   }
          else if (scope.d.integrity >= 50) { scope.d.integrityClass = 'nxtd-int-warn'; scope.d.integrityFillClass = 'nxtd-fill-warn'; }
          else                              { scope.d.integrityClass = 'nxtd-int-crit'; scope.d.integrityFillClass = 'nxtd-fill-crit'; }

          if (eng.engineDisabled || maxLevel === 3) { scope.d.statusLabel = 'DEAD';     scope.d.statusClass = 'nxtd-s-dead'; }
          else if (maxLevel === 2)                  { scope.d.statusLabel = 'CRITICAL'; scope.d.statusClass = 'nxtd-s-crit'; }
          else if (maxLevel === 1 || eng.engineReducedTorque) { scope.d.statusLabel = 'WARNING'; scope.d.statusClass = 'nxtd-s-warn'; }
          else                                      { scope.d.statusLabel = 'NOMINAL';  scope.d.statusClass = 'nxtd-s-ok';   }

          var wt = e.watertemp || 0;
          var ot = e.oiltemp   || 0;
          scope.d.showWater   = wt > 0;
          scope.d.showOilTemp = ot > 0;
          scope.d.waterTemp   = wt;
          scope.d.oilTemp     = ot;
          scope.d.waterPct    = Math.min(100, (wt / 130) * 100);
          scope.d.oilTempPct  = Math.min(100, (ot / 160) * 100);

          scope.d.waterClass     = wt >= 110 ? 'nxtd-temp-hot' : wt >= 95  ? 'nxtd-temp-warm' : 'nxtd-temp-ok';
          scope.d.waterFillClass = wt >= 110 ? 'nxtd-fill-temp-hot' : wt >= 95  ? 'nxtd-fill-temp-warm' : 'nxtd-fill-temp-ok';
          scope.d.oilTempClass     = ot >= 130 ? 'nxtd-temp-hot' : ot >= 110 ? 'nxtd-temp-warm' : 'nxtd-temp-ok';
          scope.d.oilTempFillClass = ot >= 130 ? 'nxtd-fill-temp-hot' : ot >= 110 ? 'nxtd-fill-temp-warm' : 'nxtd-fill-temp-ok';

          var flags = [];
          if (eng.inductionSystemDamaged) flags.push({ label: 'INDUCTION',  cls: 'nxtd-flag-warn' });
          if (eng.turbochargerHot)        flags.push({ label: 'TURBO HOT',  cls: 'nxtd-flag-warn' });
          if (eng.coolantOverheating)     flags.push({ label: 'COOLANT',    cls: 'nxtd-flag-crit' });
          if (eng.oilOverheating)         flags.push({ label: 'OIL TEMP',   cls: 'nxtd-flag-crit' });
          if (eng.radiatorLeak)           flags.push({ label: 'RAD LEAK',   cls: 'nxtd-flag-crit' });
          if (eng.overTorqueDanger)       flags.push({ label: 'OVERTORQUE', cls: 'nxtd-flag-warn' });
          scope.d.flags = flags;
        });
      }

      scope.$on('$destroy', function() {
        StreamsManager.remove(['electrics']);
      });
    }
  };
}]);

-- nexTMinimaLDNA -- Vehicle Telemetry Wrapper (v6.8.2-FIX)
-- Enhanced Lua extension that exposes the vehicle "DNA" (spec sheet) 
-- to NextMinimal UI Apps.

local M = {}
print(">> NexTMinimaL DNA Extension Loaded (v6.8.2-FIX) <<")
local AV_TO_RPM = 9.549296596425384
local lastAssistSignature = nil
local lastWheelSignature = nil

local ASSIST_CLASSIFIERS = {
  platform = { patterns = {"_dse", "driving & safety electronics", "race electronics"} },
  abs = { tokens = {"abs"}, patterns = {"_dse_abs", "_abs_"} },
  tcs = { tokens = {"tcs", "traction"}, patterns = {"_dse_tc", "_tc_", "_tc$"} },
  esc = { tokens = {"esc", "stability", "yaw"}, patterns = {"_dse_esc", "_esc_"} }
}

-- Transmission Classification
local function classifyTransmission(gbType)
  local lower = string.lower(gbType or "")
  local out = {
    rawType      = gbType or "unknown",
    class        = "unknown",
    isManual     = false, isAutomatic  = true,  isDCT        = false,
    isCVT        = false, isSequential = false, usesFloat    = false
  }

  if v and v.data and type(v.data.controller) == "table" then
    for _, ctrl in pairs(v.data.controller) do
      if type(ctrl) == "table" then
        local cName = string.lower(tostring(ctrl.fileName or ctrl.name or ""))
        if cName:find("sequential") or cName:find("shiftlogic_sq") then
          out.class = "sequential"
          out.isManual = true
          out.isSequential = true
          out.isAutomatic = false
          return out
        end
      end
    end
  end

  if     string.find(lower, "dct")    then out.class = "dct";        out.isAutomatic  = true;  out.isDCT        = true;  out.usesFloat = false
  elseif string.find(lower, "cvt")    then out.class = "cvt";        out.isAutomatic  = true;  out.isCVT        = true;  out.usesFloat = true
  elseif string.find(lower, "electric") then out.class = "automatic"; out.isAutomatic  = true;                          out.usesFloat = true
  elseif string.find(lower, "sequen") or string.find(lower, "sq") then out.class = "sequential"; out.isManual     = true;  out.isSequential = true;  out.usesFloat = false; out.isAutomatic = false
  elseif string.find(lower, "auto")   then out.class = "automatic";  out.isAutomatic  = true;                           out.usesFloat = true
  elseif string.find(lower, "manual") then out.class = "manual";     out.isManual     = true;  out.isAutomatic  = false; out.usesFloat = false
  end
  return out
end

local function sanitizeModeToken(token)
  if type(token) ~= "string" then return nil end
  token = string.upper((token:gsub("^%s+", ""):gsub("%s+$", "")))
  return token ~= "" and token or nil
end

local function pushUnique(list, value)
  local token = sanitizeModeToken(value)
  if not token then return false end
  for _, existing in ipairs(list) do if existing == token then return false end end
  table.insert(list, token)
  return true
end

local function addModesFromTable(target, list)
  if type(list) ~= "table" then return end
  if #list > 0 then
    for _, val in ipairs(list) do pushUnique(target, val) end
  else
    for k, val in pairs(list) do
      if type(val) == "string" then pushUnique(target, val)
      elseif type(k) == "string" then pushUnique(target, k) end
    end
  end
end

local function addModesFromString(target, modeString)
  if type(modeString) ~= "string" then return end
  for i = 1, #modeString do pushUnique(target, modeString:sub(i, i)) end
end

local function collapseSelectorModes(selectorModes)
  local out = {}
  for _, mode in ipairs(selectorModes or {}) do
    local collapsed = mode
    if string.match(mode, "^M%d+$") then collapsed = "M"
    elseif string.match(mode, "^S%d+$") then collapsed = "S" end
    pushUnique(out, collapsed)
  end
  return out
end

local function buildSelectorModesFromBase(baseModes, maxGearIndex)
  local selectorModes = {}
  local maxForward = math.max(tonumber(maxGearIndex) or 0, 1)
  for _, mode in ipairs(baseModes or {}) do
    if mode == "M" then for gear = 1, maxForward do pushUnique(selectorModes, "M" .. tostring(gear)) end
    else pushUnique(selectorModes, mode) end
  end
  return selectorModes
end

local function findVehicleControllerConfig()
  if not (v and v.data and type(v.data.controller) == "table") then return nil end
  for _, controllerData in pairs(v.data.controller) do
    if type(controllerData) == "table" then
      local fileName = controllerData.fileName or controllerData.name or ""
      if fileName == "vehicleController" or string.find(fileName, "vehicleController", 1, true) then return controllerData end
    end
  end
  return nil
end

local function getVehicleControllerRuntime()
  if not (controller and controller.getController) then return nil end
  local vehicleController = controller.getController("vehicleController")
  return type(vehicleController) == "table" and vehicleController or nil
end

local function getUpvalueByName(fn, soughtName)
  if type(fn) ~= "function" or not (debug and debug.getupvalue) then return nil end
  local index = 1
  while true do
    local upvalueName, upvalueValue = debug.getupvalue(fn, index)
    if not upvalueName then break end
    if upvalueName == soughtName then return upvalueValue end
    index = index + 1
  end
  return nil
end

local function partValueToString(partValue)
  if type(partValue) == "string" then return partValue end
  if type(partValue) == "table" then return tostring(partValue.partName or partValue.name or partValue.slot or "") end
  return tostring(partValue or "")
end

local function partIsInstalled(partValue)
  if partValue == nil or partValue == false then return false end
  local value = string.lower(partValueToString(partValue))
  return value ~= "" and value ~= "none" and value ~= "null"
end

local function stringHasAnyToken(value, tokens)
  if type(value) ~= "string" then return false end
  local haystack = string.lower(value)
  for _, token in ipairs(tokens or {}) do if string.find(haystack, token, 1, true) then return true end end
  return false
end

local function hasAssistPattern(value, patterns)
  if type(value) ~= "string" then return false end
  local haystack = string.lower(value)
  for _, pattern in ipairs(patterns or {}) do if string.find(haystack, pattern) then return true end end
  return false
end

local function collectAssistTexts(partName, partData)
  local texts = { tostring(partName or ""), type(partData) == "table" and tostring(partData.partName or "") or "", type(partData) == "table" and type(partData.information) == "table" and tostring(partData.information.name or "") or "" }
  if type(partData) == "table" then
    local slotType = partData.slotType
    if type(slotType) == "string" then table.insert(texts, slotType)
    elseif type(slotType) == "table" then for _, st in ipairs(slotType) do table.insert(texts, tostring(st or "")) end end
  end
  return texts
end

local function classifyAssistTexts(texts)
  local kind = { isAbs = false, isTcs = false, isEsc = false, hasPlatform = false }
  for _, text in ipairs(texts or {}) do
    if type(text) == "string" and text ~= "" then
      kind.hasPlatform = kind.hasPlatform or hasAssistPattern(text, ASSIST_CLASSIFIERS.platform.patterns)
      kind.isAbs = kind.isAbs or stringHasAnyToken(text, ASSIST_CLASSIFIERS.abs.tokens) or hasAssistPattern(text, ASSIST_CLASSIFIERS.abs.patterns)
      kind.isTcs = kind.isTcs or stringHasAnyToken(text, ASSIST_CLASSIFIERS.tcs.tokens) or hasAssistPattern(text, ASSIST_CLASSIFIERS.tcs.patterns)
      kind.isEsc = kind.isEsc or stringHasAnyToken(text, ASSIST_CLASSIFIERS.esc.tokens) or hasAssistPattern(text, ASSIST_CLASSIFIERS.esc.patterns)
    end
  end
  kind.hasPlatform = kind.hasPlatform or kind.isAbs or kind.isTcs or kind.isEsc
  return kind
end

local function createAssistInfo()
  return {
    esc = { hasController = false, modeName = "", activeColor = "98FB00", offColor = "343434", enabled = nil, installed = nil },
    tcs = { hasController = false, enabled = nil, installed = nil },
    abs = { hasController = false, installed = nil }
  }
end

local function scanAssistHardware()
  local function scanFromActiveParts()
    local activePartsData = v and v.data and type(v.data.activePartsData) == "table" and v.data.activePartsData or nil
    if type(activePartsData) ~= "table" or next(activePartsData) == nil then return nil end
    local found = { abs = false, tcs = false, esc = false }
    local hasPlatform = false
    for partName, partData in pairs(activePartsData) do
      local kind = classifyAssistTexts(collectAssistTexts(partName, partData))
      hasPlatform = hasPlatform or kind.hasPlatform
      if kind.isAbs then found.abs = true end
      if kind.isTcs then found.tcs = true end
      if kind.isEsc then found.esc = true end
    end
    return hasPlatform and found or nil
  end
  local activeScan = scanFromActiveParts()
  if activeScan then return activeScan end
  local result = { esc = { seen = false, installed = nil }, tcs = { seen = false, installed = nil }, abs = { seen = false, installed = nil } }
  local parts = v and v.config and type(v.config.parts) == "table" and v.config.parts or nil
  if type(parts) ~= "table" then return { esc = nil, tcs = nil, abs = nil } end
  local function mark(kind, installed) result[kind].seen = true; result[kind].installed = (result[kind].installed == true) or installed end
  for slotName, partValue in pairs(parts) do
    local kind = classifyAssistTexts({tostring(slotName or ""), partValueToString(partValue)})
    local installed = partIsInstalled(partValue)
    if kind.isAbs then mark("abs", installed) end
    if kind.isTcs then mark("tcs", installed) end
    if kind.isEsc then mark("esc", installed) end
  end
  return { esc = result.esc.seen and result.esc.installed or nil, tcs = result.tcs.seen and result.tcs.installed or nil, abs = result.abs.seen and result.abs.installed or nil }
end

local function getShiftLogicRuntime(vehicleController)
  if type(vehicleController) ~= "table" then return nil end
  return getUpvalueByName(vehicleController.getState, "controlLogicModule")
end

local function getAutomaticHandlingRuntime(shiftLogic)
  if type(shiftLogic) ~= "table" then return nil end
  if type(shiftLogic.automaticHandling) == "table" then return shiftLogic.automaticHandling end
  local probes = {shiftLogic.getGearPosition, shiftLogic.getState, shiftLogic.getGearName, shiftLogic.update}
  for _, fn in ipairs(probes) do
    if type(fn) == "function" then
      local automaticHandling = getUpvalueByName(fn, "automaticHandling")
      if type(automaticHandling) == "table" then return automaticHandling end
    end
  end
  return nil
end

local function getVehicleControllerState(vehicleController)
  if type(vehicleController) ~= "table" or type(vehicleController.getState) ~= "function" then return nil end
  local ok, state = pcall(vehicleController.getState)
  return ok and type(state) == "table" and state or nil
end

local function getTransmissionFallbackData()
  local controllerConfig = findVehicleControllerConfig()
  local vehicleController = getVehicleControllerRuntime()
  local shiftLogic = getShiftLogicRuntime(vehicleController)
  local rawType = (controllerConfig and type(controllerConfig.shiftLogicName) == "string") and controllerConfig.shiftLogicName or ""
  return { controllerConfig = controllerConfig, vehicleController = vehicleController, shiftLogic = shiftLogic, rawType = rawType, maxGearIndex = (type(shiftLogic) == "table") and shiftLogic.maxGearIndex or nil, minGearIndex = (type(shiftLogic) == "table") and shiftLogic.minGearIndex or nil }
end

local function resolveTransmissionType(gearbox, fallbackTx)
  local rawTxType = (gearbox and gearbox.type) or fallbackTx.rawType or ""
  local cls = classifyTransmission(rawTxType)
  if cls.class == "unknown" and powertrain and powertrain.getDevicesByType then
    local electricMotors = powertrain.getDevicesByType("electricMotor")
    if type(electricMotors) == "table" and #electricMotors > 0 then rawTxType = rawTxType ~= "" and rawTxType or "electricMotor"; cls = classifyTransmission(rawTxType) end
  end
  if cls.class == "unknown" and type(fallbackTx.shiftLogic) == "table" then
    local automaticHandling = getAutomaticHandlingRuntime(fallbackTx.shiftLogic)
    if (type(automaticHandling) == "table" and type(automaticHandling.modes) == "table" and #automaticHandling.modes > 0) or sanitizeModeToken(automaticHandling and automaticHandling.mode) then rawTxType = rawTxType ~= "" and rawTxType or "controllerAutomatic"; cls = classifyTransmission("automatic") end
  end
  if cls.class == "unknown" and electrics and electrics.values then
    local liveMode = sanitizeModeToken(electrics.values.gear)
    if liveMode and (liveMode == "P" or liveMode == "R" or liveMode == "N" or liveMode == "D" or liveMode == "S" or liveMode == "M" or string.match(liveMode, "^[SMR]%d+$")) then
      rawTxType = rawTxType ~= "" and rawTxType or "electricsSelector"; cls = classifyTransmission("automatic")
      local gmi = electrics.values.gearModeIndex
      if type(gmi) == "number" and math.abs(gmi - math.floor(gmi)) > 0.0001 then cls.usesFloat = true end
    end
  end
  cls.rawType = rawTxType ~= "" and rawTxType or "unknown"
  if cls.class == "unknown" then
    log("W", "nextMinimalDNA", "Transmission classification fell through all heuristics (rawType=" .. tostring(cls.rawType) .. "); defaulting to unknown")
  end
  return cls.rawType, cls
end

local function collectTransmissionModes(gearbox, txClass)
  local info = { availableModes = {}, selectorModes = {}, currentMode = "", source = "none" }
  if txClass ~= "automatic" and txClass ~= "dct" and txClass ~= "cvt" then return info end
  local vehicleController = getVehicleControllerRuntime()
  local shiftLogic = getShiftLogicRuntime(vehicleController)
  local automaticHandling = getAutomaticHandlingRuntime(shiftLogic)
  local controllerState = getVehicleControllerState(vehicleController)
  local controllerConfig = findVehicleControllerConfig()
  if automaticHandling then
    addModesFromTable(info.selectorModes, automaticHandling.modes)
    info.availableModes = collapseSelectorModes(info.selectorModes)
    info.currentMode = sanitizeModeToken(automaticHandling.mode) or ""
    info.source = "vehicleController.shiftLogic"
  end
  if #info.availableModes == 0 and controllerConfig and controllerConfig.automaticModes then addModesFromString(info.availableModes, controllerConfig.automaticModes); info.source = "jbeam.vehicleController.automaticModes" end
  if #info.selectorModes == 0 and #info.availableModes > 0 then info.selectorModes = buildSelectorModesFromBase(info.availableModes, gearbox and gearbox.maxGearIndex or 1) end
  if #info.availableModes == 0 and type(gearbox) == "table" then
    addModesFromTable(info.selectorModes, gearbox.modes or gearbox.automaticHandling and gearbox.automaticHandling.modes or gearbox.modeNames)
    if #info.selectorModes > 0 then info.availableModes = collapseSelectorModes(info.selectorModes); info.source = "powertrain.gearbox" end
  end
  if info.currentMode == "" and controllerState and controllerState.grb_mde then info.currentMode = sanitizeModeToken(controllerState.grb_mde) or "" end
  if info.currentMode == "" and electrics and electrics.values then info.currentMode = sanitizeModeToken(electrics.values.gear) or "" end
  return info
end

local function scanForcedInduction()
  local ind = { turboCount = 0, superchargerCount = 0, hasTurbo = false, hasSupercharger = false, isTwinTurbo = false, isTwinCharged = false, isQuadTurbo = false }
  if powertrain and powertrain.getDevicesByType then
    local engines = powertrain.getDevicesByType("combustionEngine")
    if type(engines) == "table" then
      for _, eng in ipairs(engines) do
        if eng.turbocharger and eng.turbocharger.isExisting then ind.turboCount = ind.turboCount + 1 end
        if eng.supercharger and eng.supercharger.isExisting then ind.superchargerCount = ind.superchargerCount + 1 end
      end
    end
  end
  if v and v.data and v.data.powertrain then
    local tCount, sCount = 0, 0
    for _, comp in pairs(v.data.powertrain) do
      if type(comp) == "table" and comp.type then
        if comp.type == "turbocharger" then tCount = tCount + 1
        elseif comp.type == "supercharger" then sCount = sCount + 1 end
      end
    end
    if tCount > ind.turboCount then ind.turboCount = tCount end
    if sCount > ind.superchargerCount then ind.superchargerCount = sCount end
  end
  ind.hasTurbo = ind.turboCount > 0; ind.hasSupercharger = ind.superchargerCount > 0; ind.isTwinTurbo = ind.turboCount >= 2; ind.isQuadTurbo = ind.turboCount >= 4; ind.isTwinCharged = ind.hasTurbo and ind.hasSupercharger
  return ind
end

local function collectEngineData()
  local info = { maxRPM = 7000, idleRPM = 800, redlineRPM = 7000, isElectric = false }
  if not powertrain then return info end
  if powertrain.getDevicesByType then
    local engines = powertrain.getDevicesByType("combustionEngine")
    if type(engines) == "table" and #engines > 0 then
      local maxR, idleR = 0, 0
      for _, eng in ipairs(engines) do if type(eng) == "table" then maxR = math.max(maxR, tonumber(eng.maxRPM) or 0); idleR = math.max(idleR, tonumber(eng.idleRPM) or 0) end end
      if maxR > 0 then return { maxRPM = maxR, idleRPM = idleR > 0 and idleR or 800, redlineRPM = maxR, isElectric = false } end
    end
    local motors = powertrain.getDevicesByType("electricMotor")
    if type(motors) == "table" and #motors > 0 then
      local maxR = 0
      for _, m in ipairs(motors) do maxR = math.max(maxR, tonumber(m.maxRPM) or (tonumber(m.maxAV) or 0) * AV_TO_RPM) end
      if maxR > 0 then return { maxRPM = maxR, idleRPM = 0, redlineRPM = maxR, isElectric = true } end
    end
  end
  local eng = powertrain.getDevice and powertrain.getDevice("mainEngine")
  if type(eng) == "table" then info.maxRPM = (tonumber(eng.maxRPM) or 0) > 0 and eng.maxRPM or info.maxRPM; info.redlineRPM = info.maxRPM; info.idleRPM = (tonumber(eng.idleRPM) or 0) >= 0 and eng.idleRPM or info.idleRPM end
  return info
end

local function collectAssistState()
  local info = createAssistInfo()
  local hardware = scanAssistHardware()
  info.esc.installed, info.tcs.installed, info.abs.installed = hardware.esc, hardware.tcs, hardware.abs
  local driveModes = controller and controller.getController and controller.getController("driveModes")
  if type(driveModes) == "table" then
    local okKey, activeKey = pcall(driveModes.getCurrentDriveModeKey)
    if okKey and activeKey then
      local okMode, data = pcall(driveModes.getDriveModeData, activeKey)
      if okMode and type(data) == "table" then
        info.esc.modeName = tostring(data.name or "")
        if type(data.settings) == "table" then
          local yaw = data.settings.yawControl; local tcs = data.settings.tractionControl
          if type(yaw) == "table" and type(yaw.isEnabled) == "boolean" then info.esc.hasController, info.esc.enabled = true, yaw.isEnabled end
          if type(tcs) == "table" and type(tcs.isEnabled) == "boolean" then info.tcs.hasController, info.tcs.enabled = true, tcs.isEnabled end
        end
      end
    end
  end
  if absController then info.abs.hasController = true end
  local escController = controller and controller.getController and controller.getController("esc")
  if type(escController) == "table" then
    info.esc.hasController = true
    if type(escController.getCurrentConfigData) == "function" then
      local ok, config = pcall(escController.getCurrentConfigData)
      if ok and type(config) == "table" then
        info.esc.modeName = info.esc.modeName == "" and tostring(config.name or "") or info.esc.modeName
        if info.esc.enabled == nil then info.esc.enabled = (type(config.escEnabled) == "boolean") and config.escEnabled or (config.escEnabled ~= nil and not not config.escEnabled) end
        if info.tcs.enabled == nil then info.tcs.enabled = (type(config.tcsEnabled) == "boolean") and config.tcsEnabled or (type(config.tractionControlEnabled) == "boolean") and config.tractionControlEnabled end
        if info.tcs.enabled ~= nil then info.tcs.hasController = true end
      end
    end
  end
  return info
end

local function buildAssistSignature(assists)
  local esc = assists and assists.esc or {}; local tcs = assists and assists.tcs or {}; local abs = assists and assists.abs or {}
  return table.concat({ tostring(esc.hasController), tostring(esc.modeName), tostring(esc.enabled), tostring(esc.installed), tostring(tcs.hasController), tostring(tcs.enabled), tostring(tcs.installed), tostring(abs.hasController), tostring(abs.installed) }, "|")
end

local lastDrivetrainSignature, lastAuxiliarySignature, lastDeviceModesSignature, lastDNA = nil, nil, nil, nil

local function buildDrivetrainSignature(dt) return string.format("%s|%s|%s|%s|%s", tostring(dt.fDiff.state), tostring(dt.cDiff.state), tostring(dt.rDiff.state), tostring(dt.mode4wd), tostring(dt.lowRangeActive)) end
local function buildAuxiliarySignature(aux) return string.format("%s|%s|%.2f|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s", tostring(aux.nosActive), tostring(aux.jatoActive), aux.nosLevel or 0, tostring(aux.fog), tostring(aux.lightbar), tostring(aux.extra1), tostring(aux.extra2), tostring(aux.fogActive), tostring(aux.fogOn), tostring(aux.noseconeOn), tostring(aux.spotlightOn), tostring(aux.extra1On), tostring(aux.extra2On)) end
local function buildDeviceModesSignature(modes)
  local t = {}
  for id, m in pairs(modes) do local val = type(m) == "table" and (tostring(m.mode) .. (m.isActive and "1" or "0")) or tostring(m); table.insert(t, id .. ":" .. val) end
  table.sort(t); return table.concat(t, "|")
end

local function evalDeviceActive(dev, forcedType)
  if type(dev) ~= "table" then return false end
  local mode = string.lower(dev.mode or "")
  if mode == "" then return false end
  -- Explicit known-active modes (covers diff, rangeBox, splitShaft, shaft, etc.)
  local ACTIVE = { locked=true, lock=true, split=true, connected=true, low=true,
    ["4wdlow"]=true, ["4l"]=true, on=true, low_range=true, ["4wdl"]=true, activeLock=true }
  if ACTIVE[mode] then return true end
  -- Explicit known-inactive modes
  local INACTIVE = { open=true, disconnected=true, high=true, ["2wd"]=true, ["2h"]=true,
    ["2hd"]=true, off=true, none=true, ["4wdhigh"]=true, fwd=true, rwd=true, ["2wheel"]=true }
  if INACTIVE[mode] then return false end
  -- Fallback: active if not the first available mode
  local availModes = dev.availableModes
  if type(availModes) == "table" and #availModes >= 2 then
    return mode ~= string.lower(tostring(availModes[1] or ""))
  end
  return false
end

local function normalizeDeviceLabel(name, uiName, devType)
  if type(uiName) == "string" and uiName ~= "" then return uiName end
  local n = string.lower(name or "")
  -- Differential
  if n:find("diff") then
    if n:find("front") or n:find("_f%f[^a-z]") or n:match("_f$") then return "Front Diff"
    elseif n:find("rear") or n:find("_r%f[^a-z]") or n:match("_r$") then return "Rear Diff"
    elseif n:find("center") or n:find("mid") or n:find("_c%f[^a-z]") then return "Center Diff"
    else return "Diff" end
  end
  -- Transfer case / rangebox
  if n:find("transfercase") or n:find("transfer_case") then return "Transfer Case" end
  if n:find("rangebox") or n:find("range_box") or n:find("tcasrange") then return "Range Box" end
  -- Axle / shaft connections
  if n:find("wheelaxle") then
    if n:find("fr") or n:find("frontright") then return "FR Axle"
    elseif n:find("fl") or n:find("frontleft") then return "FL Axle"
    elseif n:find("rr") or n:find("rearright") then return "RR Axle"
    elseif n:find("rl") or n:find("rearleft") then return "RL Axle"
    else return "Axle" end
  end
  if n:find("splitshaft") or n:find("split_shaft") then
    if n:find("front") or n:find("_f%f[^a-z]") or n:match("_f$") then return "Front Output"
    elseif n:find("rear") or n:find("_r%f[^a-z]") or n:match("_r$") then return "Rear Output"
    else return "Output Shaft" end
  end
  if n:find("driveshaftlock") or n:find("shaftlock") then
    if n:find("front") then return "Front Lock"
    elseif n:find("rear") then return "Rear Lock"
    else return "Shaft Lock" end
  end
  -- Generic shaft
  if string.lower(devType or ""):find("^shaft") or n:find("^shaft") then
    if n:find("front") then return "Front Drive"
    elseif n:find("rear") then return "Rear Drive"
    else return "Drive Shaft" end
  end
  return name
end

local function isDeviceConnectedToWheel(dev)
  if not dev then return false end
  if dev.type == "wheel" then 
    local wh = wheels and wheels.wheels and wheels.wheels[dev.wheelID]
    return wh and not wh.isBroken
  end
  if type(dev.children) == "table" then
    for _, child in ipairs(dev.children) do
      if isDeviceConnectedToWheel(child) then return true end
    end
  end
  return false
end

local function scanToggleableDevices()
  local result = {}
  if not powertrain then return result end
  local seen = {}
  local ALLOWED_TYPES = { differential = true, rangeBox = true, transferCase = true,
    rangebox = true, transfercase = true, splitShaft = true, shaft = true,
    driveshaftlock = true, shaftlock = true, axlelock = true,
    frontdriveshaftlock = true, reardriveshaftlock = true, frontoutputshaft = true }
  local function extractModes(dev)
    local modes = {}
    local function addFromTable(t) if type(t) ~= "table" then return end; for k, v in pairs(t) do if type(v) == "string" then table.insert(modes, v) elseif type(k) == "string" and type(v) ~= "table" then table.insert(modes, k) end end end
    addFromTable(dev.availableModes)
    if #modes < 2 and type(dev.diffType) == "table" then addFromTable(dev.diffType) end
    if #modes < 2 and type(dev.gearRatios) == "table" then local count = 0; for _ in pairs(dev.gearRatios) do count = count + 1 end; if count >= 2 then for i = 1, count do table.insert(modes, "gear" .. i) end end end
    return modes
  end
  local function tryAddDevice(dev, forcedType)
    if type(dev) ~= "table" or not dev.name or seen[dev.name] then return end
    local dType = forcedType or dev.type or ""; local dTypeLow = string.lower(dType)
    if not ALLOWED_TYPES[dType] and not ALLOWED_TYPES[dTypeLow]
       and not string.find(dTypeLow, "differential") and not string.find(dTypeLow, "rangebox")
       and not string.find(dTypeLow, "transfercase") and not string.find(dTypeLow, "driveshaft")
       and not string.find(dTypeLow, "shaftlock") and not string.find(dTypeLow, "splitshaft")
       and not string.find(dTypeLow, "axle") and not string.find(dTypeLow, "outputshaft")
       and not string.find(dTypeLow, "^shaft") then return end
    local modes = extractModes(dev); if #modes < 2 then return end
    
    local label = normalizeDeviceLabel(dev.name, dev.uiName, dType)
    local isHidden = false
    local isFrontRelated = label == "Front Output" or label == "Front Drive" or
                           label == "Front Lock" or label == "FL Axle" or label == "FR Axle"
    if isFrontRelated then
      local diffs = powertrain.getDevicesByType("differential")
      local hasFrontDiff = false
      if diffs then
        for _, d in ipairs(diffs) do
          local dn = string.lower(d.name or "")
          if dn:find("front") or dn:find("^f[_%-]") or dn:find("[_%-]f$") or dn:find("[_%-]f[_%-]") then hasFrontDiff = true; break end
        end
      end
      if not hasFrontDiff then isHidden = true end
    end

    seen[dev.name] = true; 
    table.insert(result, { 
      id = dev.name, 
      label = label, 
      mode = type(dev.mode) == "string" and dev.mode or "", 
      isActive = evalDeviceActive(dev, forcedType), 
      devType = dType, 
      modes = modes, 
      isHidden = isHidden,
      lua = string.format("powertrain.toggleDeviceMode(%q)", dev.name) 
    })
  end
  if powertrain.getDevicesByType then for _, t in ipairs({"transferCase", "rangeBox", "differential", "splitShaft", "shaft"}) do local devs = powertrain.getDevicesByType(t); if type(devs) == "table" then for _, dev in ipairs(devs) do tryAddDevice(dev, t) end end end end
  if v and v.data and v.data.powertrain then for key, entry in pairs(v.data.powertrain) do local candidateName = type(key) == "string" and key or (type(entry) == "table" and (entry.name or entry.deviceName or nil)); if candidateName then tryAddDevice(powertrain.getDevice(candidateName)) end end end
  -- Scan driveModes controllers (MD Series transfercase, etc.)
  if controller and controller.getController and v and v.data and type(v.data.controller) == "table" then
    for _, entry in ipairs(v.data.controller) do
      if type(entry) == "table" and entry[1] == "driveModes" and type(entry[2]) == "table" and entry[2].name then
        local ctrlName = entry[2].name
        if not seen[ctrlName] then
          local ctrl = controller.getController(ctrlName)
          if ctrl and type(ctrl.getCurrentDriveModeKey) == "function" then
            local ctrlData = type(v.data[ctrlName]) == "table" and v.data[ctrlName] or {}
            local modes = {}
            if type(ctrlData.enabledModes) == "table" then for _, m in ipairs(ctrlData.enabledModes) do table.insert(modes, tostring(m)) end end
            if #modes >= 2 then
              seen[ctrlName] = true
              local currentKey = ctrl.getCurrentDriveModeKey() or modes[1]
              table.insert(result, { id = ctrlName, label = normalizeDeviceLabel(ctrlName, ctrlData.uiName, "driveModes"), mode = currentKey, isActive = currentKey ~= modes[1], devType = "driveModes", modes = modes, lua = string.format("controller.getController(%q).nextDriveMode()", ctrlName) })
            end
          end
        end
      end
    end
  end
  -- Disambiguate duplicate labels
  local labelCount = {}
  for _, entry in ipairs(result) do labelCount[entry.label] = (labelCount[entry.label] or 0) + 1 end
  local labelIdx = {}
  for _, entry in ipairs(result) do
    if labelCount[entry.label] and labelCount[entry.label] > 1 then
      labelIdx[entry.label] = (labelIdx[entry.label] or 0) + 1
      entry.label = entry.label .. " " .. tostring(labelIdx[entry.label])
    end
  end
  return result
end

local function collectDrivetrainData()
  local info = { fDiff = { installed = false, state = 0 }, cDiff = { installed = false, state = 0 }, rDiff = { installed = false, state = 0 }, has4wd = false, mode4wd = "2wd", hasLowRange = false, lowRangeActive = false }
  if not powertrain then return info end
  local diffs = powertrain.getDevicesByType("differential")
  if diffs then
    for _, d in ipairs(diffs) do
      local name = string.lower(d.name or ""); local dInfo = { installed = true, state = (d.mode == "locked" and 1 or 0) }
      if name:find("front") or name:find("^f[_%-]") or name:find("[_%-]f$") or name:find("[_%-]f[_%-]") then info.fDiff = dInfo
      elseif name:find("center") or name:find("centre") or name:find("mid") or name:find("^c[_%-]") or name:find("[_%-]c[_%-]") then info.cDiff = dInfo
      elseif name:find("rear") or name:find("^r[_%-]") or name:find("[_%-]r$") or name:find("[_%-]r[_%-]") then info.rDiff = dInfo
      else if not info.rDiff.installed then info.rDiff = dInfo elseif not info.fDiff.installed then info.fDiff = dInfo else info.cDiff = dInfo end end
    end
  end
  local tCases = {}
  for _, typeName in ipairs({"rangeBox", "transferCase", "rangebox", "transfercase", "RangeBox", "TransferCase"}) do
    local devs = powertrain.getDevicesByType(typeName)
    if devs and #devs > 0 then tCases = devs; break end
  end
  -- Also scan powertrain devices by name if type search failed
  if #tCases == 0 and v and v.data and v.data.powertrain then
    for key, entry in pairs(v.data.powertrain) do
      if type(entry) == "table" then
        local tname = string.lower(entry.name or entry.deviceName or (type(key)=="string" and key) or "")
        if tname:find("rangebox") or tname:find("transfercase") or tname:find("transfer_case") then
          local dev = powertrain.getDevice and powertrain.getDevice(entry.name or key)
          if dev then table.insert(tCases, dev) end
        end
      end
    end
  end
  if #tCases > 0 then
    local tc = tCases[1]; for _, dev in ipairs(tCases) do if dev.hasLowRange then tc = dev; break end end
    info.has4wd, info.mode4wd = true, tc.mode or "2wd"
    if tc.hasLowRange then local m = string.lower(tc.mode or ""); info.hasLowRange = true; info.lowRangeActive = (m == "4wdlow" or m == "low" or m == "4l" or m == "low_range" or m == "4wdl" or (m:find("low") ~= nil and m:find("high") == nil)) end
  end
  return info
end

local function collectAuxiliaryData()
  local vals = electrics.values
  local info = {
    hasNos = false, nosActive = false, nosLevel = 0,
    hasJato = false, jatoActive = false,
    fog = (vals.fog == 1 or vals.fog_front == 1 or vals.fog_rear == 1),
    lightbar = (vals.lightbar == 1),
    extra1 = (vals.extra1 == 1),
    extra2 = (vals.extra2 == 1),
    fogActive = false,
    fogOn       = (vals.fog == 1 or vals.fog_front == 1 or vals.fog_rear == 1 or vals.foglight == 1),
    noseconeOn  = (vals.noseconelight == 1),
    spotlightOn = (vals.spotlight_L == 1 or vals.spotlight_R == 1),
    extra1On    = (vals.extra1 == 1),
    extra2On    = (vals.extra2 == 1),
    lightbarOn  = (vals.lightbar == 1),
  }
  -- Universal Light Scanner: fog, nosecone, spotlights, beacons, extras
  for k, v in pairs(vals) do
    if type(k) == "string" and (v == 1 or v == true) then
      local lk = k:lower()
      if lk:find("fog") or lk:find("nosecone") or lk:find("extra")
         or lk:find("roof") or lk:find("spotlight") or lk:find("beacon")
         or lk:find("bumperlight") then
        info.fogActive = true
        break
      end
    end
  end
  if energyStorage and energyStorage.getStorage then
    for _, sname in ipairs({"n2o", "nos", "nitrous", "nitrousOxide", "n2oTank", "nosTank"}) do
      local tank = energyStorage.getStorage(sname)
      if tank then info.hasNos, info.nosActive = true, (electrics.values.n2oActive == 1); info.nosLevel = (type(tank.amount) == "number" and type(tank.capacity) == "number" and tank.capacity > 0) and (tank.amount / tank.capacity) or 1.0; break end
    end
  end
  if not info.hasNos and energyStorage and energyStorage.storages then
    for sname, tank in pairs(energyStorage.storages) do
      local ln = string.lower(tostring(sname)); if ln:find("n2o") or ln:find("nitro") then info.hasNos, info.nosActive = true, (electrics.values.n2oActive == 1); info.nosLevel = (type(tank.amount) == "number" and type(tank.capacity) == "number" and tank.capacity > 0) and (tank.amount / tank.capacity) or 1.0; break end
    end
  end
  if not info.hasNos and electrics.values.n2oActive ~= nil then info.hasNos, info.nosActive, info.nosLevel = true, (electrics.values.n2oActive == 1), 1.0 end
  if v and v.data and v.data.thrusters then for _, t in pairs(v.data.thrusters) do if string.lower(t.name or ""):find("jato") then info.hasJato = true; break end end end
  if info.hasJato then info.jatoActive = (electrics.values.jatoActive == 1) end
  return info
end

local function collectWheelData()
  local info = { hasTires = false, hasBrakes = false, tiresDeflated = {fl=false, fr=false, rl=false, rr=false}, padMaterial = "street" }
  if not (wheels and wheels.wheels) then return info end
  local w = wheels.wheels
  -- Count valid wheels
  local maxIdx = -1
  for i = 0, 32 do if w[i] then maxIdx = i end end
  if maxIdx < 1 then return info end
  info.hasTires = true
  info.hasBrakes = true
  
  if w[0] and w[0].padMaterial then info.padMaterial = w[0].padMaterial end

  local function isDef(wh) 
    return wh and (wh.isDeflated or wh.isBroken or false)
  end

  info.tiresDeflated.fl = isDef(w[0])
  info.tiresDeflated.fr = isDef(w[1])
  
  local rlIdx = maxIdx > 3 and (maxIdx % 2 == 1 and maxIdx - 1 or maxIdx - 1) or 2
  local rrIdx = rlIdx + 1
  if rlIdx % 2 == 1 then rlIdx = rlIdx - 1; rrIdx = rlIdx + 1 end
  
  if w[rlIdx] then info.tiresDeflated.rl = isDef(w[rlIdx]) end
  if w[rrIdx] then info.tiresDeflated.rr = isDef(w[rrIdx]) end
  return info
end

local function collectDeviceModes(toggleableDevices)
  local modes = {}
  if not toggleableDevices then return modes end
  for _, entry in ipairs(toggleableDevices) do
    if entry.devType == "driveModes" then
      local ctrl = controller and controller.getController and controller.getController(entry.id)
      if ctrl and type(ctrl.getCurrentDriveModeKey) == "function" then
        local currentKey = ctrl.getCurrentDriveModeKey() or (entry.modes and entry.modes[1] or "")
        modes[entry.id] = { mode = currentKey, isActive = type(entry.modes) == "table" and #entry.modes > 0 and currentKey ~= entry.modes[1] }
      end
    else
      local dev = powertrain.getDevice(entry.id)
      if dev then modes[entry.id] = { mode = dev.mode or "", isActive = evalDeviceActive(dev, entry.devType) } end
    end
  end
  return modes
end

local function pushUpdates(force)
  local assists = collectAssistState(); local aSig = buildAssistSignature(assists)
  if force or aSig ~= lastAssistSignature then lastAssistSignature = aSig; guihooks.trigger("NexTMinimaL_Assists", assists) end
  local dt, aux = collectDrivetrainData(), collectAuxiliaryData()
  local dtSig, auxSig = buildDrivetrainSignature(dt), buildAuxiliarySignature(aux)
  local deviceModes = collectDeviceModes(lastDNA and lastDNA.toggleableDevices)
  local dmSig = buildDeviceModesSignature(deviceModes)
  if force or dtSig ~= lastDrivetrainSignature or auxSig ~= lastAuxiliarySignature or dmSig ~= lastDeviceModesSignature then
    lastDrivetrainSignature, lastAuxiliarySignature, lastDeviceModesSignature = dtSig, auxSig, dmSig
    guihooks.trigger("NexTMinimaL_SystemsUpdate", { drivetrain = dt, auxiliary = aux, deviceModes = deviceModes })
  end
  -- Wheel updates (always push if changed enough)
  local wd = collectWheelData()
  local wSig = string.format("%s|%s|%s|%s|%s", tostring(wd.tiresDeflated.fl), tostring(wd.tiresDeflated.fr), tostring(wd.tiresDeflated.rl), tostring(wd.tiresDeflated.rr), wd.padMaterial)
  if force or wSig ~= lastWheelSignature then lastWheelSignature = wSig; guihooks.trigger("NexTMinimaL_Wheels", wd) end
end

function M.toggleAuxFusion()
  local newState = 1
  -- Determine new state based on primary channels
  if (electrics.values.fog == 1) or (electrics.values.fog_front == 1) or (electrics.values.lightbar == 1) then
    newState = 0
  end

  -- BRUTE FORCE: Loop through all electrics and force anything that looks like aux lights
  for k, _ in pairs(electrics.values) do
    local lk = string.lower(k)
    if lk:find("fog") or lk:find("lightbar") or lk:find("extra") or lk:find("beacon") or lk:find("spot") then
      electrics.values[k] = newState
    end
  end

  -- Native engine calls for sound/internal logic
  if electrics.set_fog_lights then electrics.set_fog_lights(newState) end
  if electrics.set_lightbar_signal then electrics.set_lightbar_signal(newState) end
end

function M.toggleNosecone()
  if electrics.values.noseconelight ~= nil then
    electrics.values.noseconelight = (electrics.values.noseconelight == 1) and 0 or 1
  end
end

function M.toggleSpotlight()
  local newState = (electrics.values.spotlight_L == 1 or electrics.values.spotlight_R == 1) and 0 or 1
  if electrics.values.spotlight_L ~= nil then electrics.values.spotlight_L = newState end
  if electrics.values.spotlight_R ~= nil then electrics.values.spotlight_R = newState end
end

function M.toggleLightbar()
  if electrics.set_lightbar_signal then electrics.set_lightbar_signal(electrics.values.lightbar == 1 and 0 or 1) end
end
function M.toggleExtra1() electrics.values.extra1 = 1 - (electrics.values.extra1 or 0) end
function M.toggleExtra2() electrics.values.extra2 = 1 - (electrics.values.extra2 or 0) end

local function detectAuxLightCaps()
  local vName = (v and v.data and v.data.information and v.data.information.name) or "Unknown"
  local matchedParts = {}
  local caps = {
    hasFog = false, hasNosecone = false, hasSpotlight = false,
    hasExtra1 = false, hasExtra2 = false, hasLightbar = false,
    isLED = false, isRack = false
  }

  -- 1. HARDWARE AUDIT: Scan activePartsData
  local activeParts = v and v.data and v.data.activePartsData
  if type(activeParts) == "table" then
    for partName, _ in pairs(activeParts) do
      local p = partName:lower()
      local isLightPart = p:find("light") or p:find("fog") or p:find("bar") or p:find("spot") or p:find("extra") or p:find("led")
      if isLightPart then
        table.insert(matchedParts, partName)
        if p:find("fog") then caps.hasFog = true end
        if p:find("rack") or p:find("roof") or p:find("top") or p:find("rally") or p:find("bar") then
          caps.isRack, caps.hasLightbar = true, true
        end
        if p:find("led") or p:find("pixel") then caps.isLED, caps.hasLightbar = true, true end
        if p:find("nosecone") then caps.hasNosecone = true end
        if p:find("spot") then caps.hasSpotlight = true end
        if p:find("extra1") then caps.hasExtra1 = true end
        if p:find("extra2") then caps.hasExtra2 = true end
      end
    end
  end

  -- 2. DYNAMIC FALLBACK
  local vals = electrics and electrics.values or {}
  if not caps.hasFog and (vals.fog == 1 or vals.fog_front == 1) then caps.hasFog = true end
  if not caps.hasLightbar and vals.lightbar == 1 then caps.hasLightbar = true end

  -- DIAGNOSTIC LOGS
  log("I", "nextMinimalDNA", ">> Audit - Vehicle: " .. vName)
  log("I", "nextMinimalDNA", ">> Audit - Matched Light Parts: " .. table.concat(matchedParts, ", "))
  log("I", "nextMinimalDNA", string.format(">> Audit - Caps - Fog:%s, LBar:%s, Rack:%s, LED:%s", 
    tostring(caps.hasFog), tostring(caps.hasLightbar), tostring(caps.isRack), tostring(caps.isLED)))

  return caps
end

function M.setIgnition(level)
  level = math.floor(math.max(0, math.min(3, tonumber(level) or 0)))
  local vc = controller and controller.getController and controller.getController("vehicleController")
  if vc and type(vc.setIgnitionLevel) == "function" then pcall(vc.setIgnitionLevel, level) 
  elseif electrics and type(electrics.set_ignition_level) == "function" then pcall(electrics.set_ignition_level, level) end
end

function M.nextDriveMode()
  local dm = controller and controller.getController and controller.getController('driveModes')
  if dm and type(dm.nextDriveMode) == "function" then dm.nextDriveMode(); return end
  if esc and type(esc.toggleESCMode) == "function" then esc.toggleESCMode() end
end

function M.toggleEsc()
  local escCtrl = controller and controller.getController and controller.getController('esc')
  if escCtrl and type(escCtrl.toggleESCMode) == "function" then escCtrl.toggleESCMode(); return end
  if esc and type(esc.toggleESCMode) == "function" then esc.toggleESCMode() end
end

function M.toggleDevice(id)
  if controller and controller.getController then
    local ctrl = controller.getController(id)
    if ctrl and type(ctrl.nextDriveMode) == "function" then ctrl.nextDriveMode(); return end
  end
  if powertrain and type(powertrain.toggleDeviceMode) == "function" then
    local dev = powertrain.getDevice and powertrain.getDevice(id)
    if dev then powertrain.toggleDeviceMode(id) end
  end
end

function M.toggleNos()
  local nos = energyStorage and energyStorage.getStorage and (energyStorage.getStorage("n2o") or energyStorage.getStorage("nos"))
  if nos and type(nos.toggleActive) == "function" then nos.toggleActive(); return end
  if electrics.values.n2oActive ~= nil then electrics.values.n2oActive = (electrics.values.n2oActive == 1) and 0 or 1 end
end

function M.toggleJato() if electrics.values.jatoActive ~= nil then electrics.values.jatoActive = (electrics.values.jatoActive == 1) and 0 or 1 end end

local function buildDNA()
  local dna = { ready = false, vehicle = { name = "", brand = "", config = "" }, engine = collectEngineData(), transmission = { rawType = "unknown", class = "unknown", isManual = false, isAutomatic = false, isDCT = false, isCVT = false, isSequential = false, usesFloat = false, availableModes = {}, selectorModes = {}, currentMode = "", selectorSource = "none", maxGearIndex = 1, minGearIndex = -1, gearCount = 1 }, induction = scanForcedInduction(), drivetrain = collectDrivetrainData(), auxiliary = collectAuxiliaryData(), wheels = collectWheelData(), assists = collectAssistState() }
  if v and v.data and v.data.information then dna.vehicle.name, dna.vehicle.brand, dna.vehicle.config = v.data.information.name or "", v.data.information.brand or "", v.data.information.configuration or "" end
  local gearbox = powertrain and powertrain.getDevice and powertrain.getDevice("gearbox")
  local fallbackTx = getTransmissionFallbackData(); local rawTxType, cls = resolveTransmissionType(gearbox, fallbackTx)
  for k, val in pairs(cls) do dna.transmission[k] = val end
  dna.transmission.maxGearIndex = (gearbox and gearbox.maxGearIndex) or fallbackTx.maxGearIndex or 1; dna.transmission.minGearIndex = (gearbox and gearbox.minGearIndex) or fallbackTx.minGearIndex or -1
  local modeInfo = collectTransmissionModes(gearbox, dna.transmission.class)
  dna.transmission.availableModes, dna.transmission.selectorModes, dna.transmission.currentMode, dna.transmission.selectorSource = modeInfo.availableModes, modeInfo.selectorModes, modeInfo.currentMode, modeInfo.source
  local selectorHasReverse = false; for _, mode in ipairs(dna.transmission.availableModes) do if mode == "R" or mode:match("^R%d+$") then selectorHasReverse = true; break end end
  if dna.transmission.isAutomatic and selectorHasReverse and dna.transmission.minGearIndex >= 0 then dna.transmission.minGearIndex = -1 end
  dna.transmission.gearCount = (dna.transmission.isAutomatic and #dna.transmission.selectorModes > 0) and #dna.transmission.selectorModes or (dna.transmission.maxGearIndex or 0) + math.abs(dna.transmission.minGearIndex or 0) + 1
  dna.toggleableDevices = scanToggleableDevices()
  dna.auxLightCaps = detectAuxLightCaps()
  dna.ready = true
  return dna
end

local initFrames = 0
local function getVehicleDNA()
  local dna = buildDNA()
  lastDNA = dna
  guihooks.trigger("NexTMinimaL_DNA", dna)
  pushUpdates(true)
  return dna
end

M.onExtensionLoaded = function() initFrames = 10 end
M.onReset = function() initFrames = 5 end
M.onVehicleResetted = function() initFrames = 5 end
M.onPowertrainReset = function() initFrames = 5 end

M.updateGFX = function(dt)
  if initFrames > 0 then
    initFrames = initFrames - 1
    if initFrames == 0 then getVehicleDNA() end
  end
  pushUpdates(false)
end

M.getVehicleDNA = getVehicleDNA

return M

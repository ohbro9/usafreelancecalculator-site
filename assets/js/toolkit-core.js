(function(window){
  'use strict';

  var VERSION = 2;
  var STORAGE_KEY = 'usaFreelanceToolkit_v2';
  var LEGACY_SHARED_KEY = 'UFC_SHARED';

  var STEPS = [
    { id:'hourly_rate', file:'hourly-rate-calculator.html', label:'Hourly Rate Calculator' },
    { id:'platform_fee', file:'platform-fee-calculator.html', label:'Platform Fee Calculator' },
    { id:'tax_estimator', file:'tax-estimator.html', label:'Freelancer Tax Estimator' },
    { id:'income_goal', file:'income-goal-planner.html', label:'Income Goal Planner' },
    { id:'budget_planner', file:'budget-planner.html', label:'Budget Planner' }
  ];
  var FLOW_HASH_BY_ID = {
    hourly_rate: '#mainCard',
    platform_fee: '#amtGross',
    tax_estimator: '#incomeInput',
    income_goal: '#incomeGoal',
    budget_planner: '#income'
  };

  var STEP_BY_ID = {};
  var STEP_BY_FILE = {};
  for(var i=0;i<STEPS.length;i++){
    STEP_BY_ID[STEPS[i].id] = STEPS[i];
    STEP_BY_FILE[STEPS[i].file] = STEPS[i];
    if(STEPS[i].id === 'hourly_rate'){
      STEP_BY_FILE['index.html'] = STEPS[i];
      STEP_BY_FILE[''] = STEPS[i];
      STEP_BY_FILE['/'] = STEPS[i];
    }
  }

  function safeStorageGet(key){
    try{return window.localStorage.getItem(key);}catch(e){return null;}
  }

  function safeStorageSet(key,value){
    try{window.localStorage.setItem(key,value);return true;}catch(e){return false;}
  }

  function safeStorageRemove(key){
    try{window.localStorage.removeItem(key);}catch(e){}
  }

  function safeParse(raw){
    if(!raw || typeof raw !== 'string')return null;
    try{return JSON.parse(raw);}catch(e){return null;}
  }

  function isFiniteNumber(value){
    return typeof value === 'number' && isFinite(value);
  }

  function roundMoney(value){
    var num = Number(value);
    if(!isFinite(num))return 0;
    return Math.round(num * 100) / 100;
  }

  function positiveMoney(value){
    var num = roundMoney(value);
    return num > 0 ? num : 0;
  }

  function normalizePeriod(value){
    var raw = String(value || '').toLowerCase().trim();
    if(raw === 'day' || raw === 'daily')return 'day';
    if(raw === 'week' || raw === 'weekly')return 'week';
    if(raw === 'month' || raw === 'monthly')return 'month';
    if(raw === 'year' || raw === 'annual' || raw === 'yearly')return 'year';
    if(raw === 'project')return 'project';
    return 'custom';
  }

  function normalizeKind(value){
    var raw = String(value || '').toLowerCase().trim();
    if(raw === 'gross')return 'gross';
    if(raw === 'pre_tax_after_fees' || raw === 'pre-tax-after-fees')return 'pre_tax_after_fees';
    if(raw === 'take_home' || raw === 'take-home')return 'take_home';
    if(raw === 'net')return 'net';
    return 'gross';
  }

  function normalizeToolId(value){
    var raw = String(value || '').toLowerCase().trim();
    if(!raw)return '';
    if(raw === 'hourly' || raw === 'hourly_rate' || raw === 'hourly-rate')return 'hourly_rate';
    if(raw === 'platform' || raw === 'platform_fee' || raw === 'platform-fee')return 'platform_fee';
    if(raw === 'tax' || raw === 'tax_estimator' || raw === 'tax-estimate')return 'tax_estimator';
    if(raw === 'goal' || raw === 'income_goal' || raw === 'income-goal')return 'income_goal';
    if(raw === 'budget' || raw === 'budget_planner' || raw === 'budget-planner')return 'budget_planner';
    return raw;
  }

  function getCurrentFile(){
    var path = (window.location && window.location.pathname) || '';
    var parts = path.split('/');
    return parts[parts.length - 1] || '';
  }

  function defaultStepId(){
    var step = STEP_BY_FILE[getCurrentFile()];
    return step ? step.id : 'hourly_rate';
  }

  function createSessionId(){
    return 'tk_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
  }

  function applyHashScroll(){
    var hash = window.location && window.location.hash;
    if(!hash || hash === '#')return;
    var target = null;
    try{
      target = window.document.querySelector(hash);
    }catch(e){
      target = null;
    }
    if(!target || typeof target.scrollIntoView !== 'function')return;
    function forceScroll(){
      try{
        var top = target.getBoundingClientRect().top + window.scrollY - 18;
        window.scrollTo(0, Math.max(0, top));
      }catch(e){
        try{target.scrollIntoView({ behavior:'auto', block:'start' });}catch(err){}
      }
    }
    forceScroll();
    if(typeof window.requestAnimationFrame === 'function'){
      window.requestAnimationFrame(function(){
        forceScroll();
        window.requestAnimationFrame(forceScroll);
      });
    }
    window.setTimeout(forceScroll, 60);
    window.setTimeout(forceScroll, 180);
    window.setTimeout(forceScroll, 420);
    window.setTimeout(forceScroll, 900);
  }

  function sanitizePrimitiveMap(obj){
    var out = {};
    if(!obj || typeof obj !== 'object')return out;
    var keys = Object.keys(obj);
    for(var i=0;i<keys.length;i++){
      var key = keys[i];
      var value = obj[key];
      if(typeof value === 'boolean')out[key] = value;
      else if(typeof value === 'string'){
        var trimmed = value.trim();
        if(trimmed)out[key] = trimmed;
      }else if(isFiniteNumber(value)){
        out[key] = value;
      }
    }
    return out;
  }

  function mergePrimitiveMaps(base, patch){
    var out = {};
    var baseObj = sanitizePrimitiveMap(base);
    var patchObj = sanitizePrimitiveMap(patch);
    var baseKeys = Object.keys(baseObj);
    var patchKeys = Object.keys(patchObj);
    for(var i=0;i<baseKeys.length;i++)out[baseKeys[i]] = baseObj[baseKeys[i]];
    for(var j=0;j<patchKeys.length;j++)out[patchKeys[j]] = patchObj[patchKeys[j]];
    return out;
  }

  function sanitizeHandoff(handoff){
    if(!handoff || typeof handoff !== 'object')return null;
    var amount = positiveMoney(handoff.amount);
    if(!amount)return null;
    var label = String(handoff.label || '').trim() || 'Imported Amount';
    return {
      amount: amount,
      period: normalizePeriod(handoff.period),
      kind: normalizeKind(handoff.kind),
      basis: String(handoff.basis || '').trim() || 'custom',
      label: label
    };
  }

  function defaultState(){
    return {
      version: VERSION,
      sessionId: createSessionId(),
      updatedAt: 0,
      currentStep: defaultStepId(),
      sourceTool: '',
      handoff: null,
      normalized: {},
      assumptions: {}
    };
  }

  function sanitizeState(state){
    var source = state && typeof state === 'object' ? state : {};
    var normalizedState = defaultState();
    normalizedState.sessionId = typeof source.sessionId === 'string' && source.sessionId.trim()
      ? source.sessionId.trim()
      : normalizedState.sessionId;
    normalizedState.updatedAt = Math.max(0, parseInt(source.updatedAt,10) || 0);
    normalizedState.currentStep = normalizeToolId(source.currentStep) || normalizedState.currentStep;
    normalizedState.sourceTool = normalizeToolId(source.sourceTool) || '';
    normalizedState.handoff = sanitizeHandoff(source.handoff);
    normalizedState.normalized = sanitizePrimitiveMap(source.normalized);
    normalizedState.assumptions = sanitizePrimitiveMap(source.assumptions);
    return normalizedState;
  }

  function readStoredState(){
    var parsed = safeParse(safeStorageGet(STORAGE_KEY));
    if(!parsed)return null;
    var state = sanitizeState(parsed);
    if(!state.handoff && !Object.keys(state.normalized).length && !Object.keys(state.assumptions).length && !state.sourceTool){
      return null;
    }
    return state;
  }

  function detectLegacyPeriod(label){
    return normalizePeriod(label);
  }

  function detectLegacyKind(label){
    var raw = String(label || '').toLowerCase();
    if(raw.indexOf('pre-tax') !== -1)return 'pre_tax_after_fees';
    if(raw.indexOf('take-home') !== -1 || raw.indexOf('take home') !== -1)return 'take_home';
    if(raw.indexOf('net') !== -1)return 'net';
    return 'gross';
  }

  function migrateLegacyShared(){
    var parsed = safeParse(safeStorageGet(LEGACY_SHARED_KEY));
    if(!parsed || typeof parsed !== 'object')return null;
    var amount = positiveMoney(parsed.selected_value);
    if(!amount)return null;
    var label = String(parsed.selected_label || 'Imported Amount').trim();
    var sourceTool = normalizeToolId(parsed.source_tool || parsed.sourceTool || parsed.source || 'hourly_rate');
    var state = defaultState();
    state.updatedAt = Math.max(0, parseInt(parsed.updated_at,10) || Date.now());
    state.currentStep = sourceTool || state.currentStep;
    state.sourceTool = sourceTool || '';
    state.handoff = sanitizeHandoff({
      amount: amount,
      period: detectLegacyPeriod(label),
      kind: detectLegacyKind(label),
      basis: 'legacy_import',
      label: label
    });
    var annualCandidate = positiveMoney(parsed.grossAnnual || parsed.gross_annual || parsed.gross_value);
    if(annualCandidate){
      state.normalized.annualGross = annualCandidate;
    }else if(state.handoff && state.handoff.period === 'year'){
      state.normalized.annualGross = state.handoff.amount;
    }
    state.assumptions.migratedFrom = LEGACY_SHARED_KEY;
    return sanitizeState(state);
  }

  function readSession(){
    var state = readStoredState();
    if(state)return state;
    return migrateLegacyShared();
  }

  function writeSession(state){
    var normalizedState = sanitizeState(state);
    safeStorageSet(STORAGE_KEY, JSON.stringify(normalizedState));
    return normalizedState;
  }

  function setHandoff(sourceTool, payload){
    var handoffPayload = payload && payload.handoff ? payload.handoff : payload;
    var handoff = sanitizeHandoff(handoffPayload);
    if(!handoff)return null;

    var current = readSession() || defaultState();
    current.version = VERSION;
    current.sessionId = current.sessionId || createSessionId();
    current.updatedAt = Date.now();
    current.sourceTool = normalizeToolId(sourceTool) || current.sourceTool || defaultStepId();
    current.currentStep = current.sourceTool;
    current.handoff = handoff;
    current.normalized = mergePrimitiveMaps(current.normalized, payload && payload.normalized);
    current.assumptions = mergePrimitiveMaps(current.assumptions, payload && payload.assumptions);
    return writeSession(current);
  }

  function clearSession(){
    safeStorageRemove(STORAGE_KEY);
  }

  function getImportStampKey(toolId){
    return STORAGE_KEY + '_imported_' + (normalizeToolId(toolId) || 'unknown');
  }

  function getFreshImport(toolId){
    var state = readSession();
    if(!state || !state.handoff)return null;
    var appliedAt = parseInt(safeStorageGet(getImportStampKey(toolId)) || '0',10);
    if(state.updatedAt && appliedAt && state.updatedAt <= appliedAt)return null;
    return state;
  }

  function markImportApplied(toolId, updatedAt){
    safeStorageSet(getImportStampKey(toolId), String(parseInt(updatedAt,10) || Date.now()));
  }

  function getToolLink(toolId){
    var step = STEP_BY_ID[normalizeToolId(toolId)];
    return step ? step.file : '';
  }

  function getToolFlowLink(toolId){
    var normalized = normalizeToolId(toolId);
    var link = getToolLink(normalized);
    if(!link)return '';
    return link + (FLOW_HASH_BY_ID[normalized] || '');
  }

  function getToolLabel(toolId){
    var step = STEP_BY_ID[normalizeToolId(toolId)];
    return step ? step.label : 'Toolkit';
  }

  function getStepIndex(toolId){
    var normalized = normalizeToolId(toolId);
    for(var i=0;i<STEPS.length;i++){
      if(STEPS[i].id === normalized)return i;
    }
    return -1;
  }

  function getNextToolId(toolId){
    var index = getStepIndex(toolId);
    if(index === -1 || index >= STEPS.length - 1)return '';
    return STEPS[index + 1].id;
  }

  function getPreviousToolId(toolId){
    var index = getStepIndex(toolId);
    if(index <= 0)return '';
    return STEPS[index - 1].id;
  }

  function goToTool(toolId){
    var link = getToolLink(toolId);
    if(link)window.location.href = link;
    return link;
  }

  function goToToolFlow(toolId){
    var link = getToolFlowLink(toolId);
    if(link)window.location.href = link;
    return link;
  }

  function goNext(toolId){
    var nextId = getNextToolId(toolId);
    if(nextId)goToToolFlow(nextId);
    return nextId;
  }

  function goBack(toolId){
    var previousId = getPreviousToolId(toolId);
    if(previousId)goToToolFlow(previousId);
    return previousId;
  }

  window.UFCToolkit = {
    version: VERSION,
    key: STORAGE_KEY,
    legacySharedKey: LEGACY_SHARED_KEY,
    steps: STEPS.slice(),
    readSession: readSession,
    writeSession: writeSession,
    setHandoff: setHandoff,
    clearSession: clearSession,
    getFreshImport: getFreshImport,
    markImportApplied: markImportApplied,
    getToolLink: getToolLink,
    getToolFlowLink: getToolFlowLink,
    getToolLabel: getToolLabel,
    getNextToolId: getNextToolId,
    getPreviousToolId: getPreviousToolId,
    goToTool: goToTool,
    goToToolFlow: goToToolFlow,
    goNext: goNext,
    goBack: goBack,
    normalizeToolId: normalizeToolId
  };

  if(window.document && window.document.readyState === 'loading'){
    window.document.addEventListener('DOMContentLoaded', applyHashScroll, { once:true });
  }else{
    applyHashScroll();
  }
  window.addEventListener('load', applyHashScroll, { once:true });
})(window);

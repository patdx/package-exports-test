var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.pnpm/solid-js@1.6.0/node_modules/solid-js/dist/server.js
var server_exports = {};
__export(server_exports, {
  $DEVCOMP: () => $DEVCOMP,
  $PROXY: () => $PROXY,
  $TRACK: () => $TRACK,
  DEV: () => DEV,
  ErrorBoundary: () => ErrorBoundary,
  For: () => For,
  Index: () => Index,
  Match: () => Match,
  Show: () => Show,
  Suspense: () => Suspense,
  SuspenseList: () => SuspenseList,
  Switch: () => Switch,
  batch: () => batch,
  children: () => children,
  createComponent: () => createComponent,
  createComputed: () => createComputed,
  createContext: () => createContext,
  createDeferred: () => createDeferred,
  createEffect: () => createEffect,
  createMemo: () => createMemo,
  createReaction: () => createReaction,
  createRenderEffect: () => createRenderEffect,
  createResource: () => createResource,
  createRoot: () => createRoot,
  createSelector: () => createSelector,
  createSignal: () => createSignal,
  createUniqueId: () => createUniqueId,
  enableExternalSource: () => enableExternalSource,
  enableHydration: () => enableHydration,
  enableScheduling: () => enableScheduling,
  equalFn: () => equalFn,
  from: () => from,
  getListener: () => getListener,
  getOwner: () => getOwner,
  lazy: () => lazy,
  mapArray: () => mapArray,
  mergeProps: () => mergeProps,
  observable: () => observable,
  on: () => on,
  onCleanup: () => onCleanup,
  onError: () => onError,
  onMount: () => onMount,
  requestCallback: () => requestCallback,
  resetErrorBoundaries: () => resetErrorBoundaries,
  runWithOwner: () => runWithOwner,
  sharedConfig: () => sharedConfig,
  splitProps: () => splitProps,
  startTransition: () => startTransition,
  untrack: () => untrack,
  useContext: () => useContext,
  useTransition: () => useTransition
});
var equalFn = (a, b) => a === b;
var $PROXY = Symbol("solid-proxy");
var $TRACK = Symbol("solid-track");
var $DEVCOMP = Symbol("solid-dev-component");
var DEV = {};
var ERROR = Symbol("error");
var BRANCH = Symbol("branch");
function castError(err) {
  if (err instanceof Error || typeof err === "string")
    return err;
  return new Error("Unknown error");
}
function handleError(err) {
  err = castError(err);
  const fns = lookup(Owner, ERROR);
  if (!fns)
    throw err;
  for (const f of fns)
    f(err);
}
var UNOWNED = {
  context: null,
  owner: null
};
var Owner = null;
function createRoot(fn, detachedOwner) {
  detachedOwner && (Owner = detachedOwner);
  const owner = Owner, root = fn.length === 0 ? UNOWNED : {
    context: null,
    owner
  };
  Owner = root;
  let result;
  try {
    result = fn(() => {
    });
  } catch (err) {
    handleError(err);
  } finally {
    Owner = owner;
  }
  return result;
}
function createSignal(value, options) {
  return [() => value, (v) => {
    return value = typeof v === "function" ? v(value) : v;
  }];
}
function createComputed(fn, value) {
  Owner = {
    owner: Owner,
    context: null
  };
  try {
    fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
}
var createRenderEffect = createComputed;
function createEffect(fn, value) {
}
function createReaction(fn) {
  return (fn2) => {
    fn2();
  };
}
function createMemo(fn, value) {
  Owner = {
    owner: Owner,
    context: null
  };
  let v;
  try {
    v = fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
  return () => v;
}
function createDeferred(source) {
  return source;
}
function createSelector(source, fn = equalFn) {
  return (k) => fn(k, source());
}
function batch(fn) {
  return fn();
}
var untrack = batch;
function on(deps, fn, options = {}) {
  const isArray = Array.isArray(deps);
  const defer = options.defer;
  return () => {
    if (defer)
      return void 0;
    let value;
    if (isArray) {
      value = [];
      for (let i = 0; i < deps.length; i++)
        value.push(deps[i]());
    } else
      value = deps();
    return fn(value);
  };
}
function onMount(fn) {
}
function onCleanup(fn) {
  let node;
  if (Owner && (node = lookup(Owner, BRANCH))) {
    if (!node.cleanups)
      node.cleanups = [fn];
    else
      node.cleanups.push(fn);
  }
  return fn;
}
function cleanNode(node) {
  if (node.cleanups) {
    for (let i = 0; i < node.cleanups.length; i++)
      node.cleanups[i]();
    node.cleanups = void 0;
  }
}
function onError(fn) {
  if (Owner) {
    if (Owner.context === null)
      Owner.context = {
        [ERROR]: [fn]
      };
    else if (!Owner.context[ERROR])
      Owner.context[ERROR] = [fn];
    else
      Owner.context[ERROR].push(fn);
  }
}
function getListener() {
  return null;
}
function createContext(defaultValue) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let ctx;
  return (ctx = lookup(Owner, context.id)) !== void 0 ? ctx : context.defaultValue;
}
function getOwner() {
  return Owner;
}
function children(fn) {
  const memo = createMemo(() => resolveChildren(fn()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  Owner = o;
  try {
    return fn();
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
  }
}
function lookup(owner, key) {
  return owner ? owner.context && owner.context[key] !== void 0 ? owner.context[key] : lookup(owner.owner, key) : void 0;
}
function resolveChildren(children2) {
  if (typeof children2 === "function" && !children2.length)
    return resolveChildren(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i = 0; i < children2.length; i++) {
      const result = resolveChildren(children2[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider(id) {
  return function provider(props) {
    return createMemo(() => {
      Owner.context = {
        [id]: props.value
      };
      return children(() => props.children);
    });
  };
}
function requestCallback(fn, options) {
  return {
    id: 0,
    fn: () => {
    },
    startTime: 0,
    expirationTime: 0
  };
}
function mapArray(list, mapFn, options = {}) {
  const items = list();
  let s = [];
  if (items.length) {
    for (let i = 0, len = items.length; i < len; i++)
      s.push(mapFn(items[i], () => i));
  } else if (options.fallback)
    s = [options.fallback()];
  return () => s;
}
function observable(input) {
  return {
    subscribe(observer) {
      if (!(observer instanceof Object) || observer == null) {
        throw new TypeError("Expected the observer to be an object.");
      }
      const handler = typeof observer === "function" ? observer : observer.next && observer.next.bind(observer);
      if (!handler) {
        return {
          unsubscribe() {
          }
        };
      }
      const dispose = createRoot((disposer) => {
        createEffect(() => {
          const v = input();
          untrack(() => handler(v));
        });
        return disposer;
      });
      if (getOwner())
        onCleanup(dispose);
      return {
        unsubscribe() {
          dispose();
        }
      };
    },
    [Symbol.observable || "@@observable"]() {
      return this;
    }
  };
}
function from(producer) {
  const [s, set] = createSignal(void 0);
  if ("subscribe" in producer) {
    const unsub = producer.subscribe((v) => set(() => v));
    onCleanup(() => "unsubscribe" in unsub ? unsub.unsubscribe() : unsub());
  } else {
    const clean = producer(set);
    onCleanup(clean);
  }
  return s;
}
function enableExternalSource(factory) {
}
function resolveSSRNode(node) {
  const t = typeof node;
  if (t === "string")
    return node;
  if (node == null || t === "boolean")
    return "";
  if (Array.isArray(node)) {
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++)
      mapped += resolveSSRNode(node[i]);
    return mapped;
  }
  if (t === "object")
    return node.t;
  if (t === "function")
    return resolveSSRNode(node());
  return String(node);
}
var sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context ? {
    ...sharedConfig.context,
    id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
    count: 0
  } : void 0;
}
function createUniqueId() {
  const ctx = sharedConfig.context;
  if (!ctx)
    throw new Error(`createUniqueId cannot be used under non-hydrating context`);
  return `${ctx.id}${ctx.count++}`;
}
function createComponent(Comp, props) {
  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props || {});
    setHydrateContext(c);
    return r;
  }
  return Comp(props || {});
}
function mergeProps(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    if (typeof source === "function")
      source = source();
    if (source)
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
  }
  return target;
}
function splitProps(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props), split = (k) => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      if (descriptors[key]) {
        Object.defineProperty(clone, key, descriptors[key]);
        delete descriptors[key];
      }
    }
    return clone;
  };
  return keys.map(split).concat(split(Object.keys(descriptors)));
}
function simpleMap(props, wrap) {
  const list = props.each || [], len = list.length, fn = props.children;
  if (len) {
    let mapped = Array(len);
    for (let i = 0; i < len; i++)
      mapped[i] = wrap(fn, list[i], i);
    return mapped;
  }
  return props.fallback;
}
function For(props) {
  return simpleMap(props, (fn, item, i) => fn(item, () => i));
}
function Index(props) {
  return simpleMap(props, (fn, item, i) => fn(() => item, i));
}
function Show(props) {
  let c;
  return props.when ? typeof (c = props.children) === "function" ? c(props.when) : c : props.fallback || "";
}
function Switch(props) {
  let conditions = props.children;
  Array.isArray(conditions) || (conditions = [conditions]);
  for (let i = 0; i < conditions.length; i++) {
    const w = conditions[i].when;
    if (w) {
      const c = conditions[i].children;
      return typeof c === "function" ? c(w) : c;
    }
  }
  return props.fallback || "";
}
function Match(props) {
  return props;
}
function resetErrorBoundaries() {
}
function ErrorBoundary(props) {
  let error, res, clean, sync = true;
  const ctx = sharedConfig.context;
  const id = ctx.id + ctx.count;
  function displayFallback() {
    cleanNode(clean);
    ctx.writeResource(id, error, true);
    setHydrateContext({
      ...ctx,
      count: 0
    });
    const f = props.fallback;
    return typeof f === "function" && f.length ? f(error, () => {
    }) : f;
  }
  onError((err) => {
    error = err;
    !sync && ctx.replace("e" + id, displayFallback);
    sync = true;
  });
  onCleanup(() => cleanNode(clean));
  createMemo(() => {
    Owner.context = {
      [BRANCH]: clean = {}
    };
    return res = props.children;
  });
  if (error)
    return displayFallback();
  sync = false;
  return {
    t: `<!e${id}>${resolveSSRNode(res)}<!/e${id}>`
  };
}
var SuspenseContext = createContext();
var resourceContext = null;
function createResource(source, fetcher, options = {}) {
  if (arguments.length === 2) {
    if (typeof fetcher === "object") {
      options = fetcher;
      fetcher = source;
      source = true;
    }
  } else if (arguments.length === 1) {
    fetcher = source;
    source = true;
  }
  const contexts = /* @__PURE__ */ new Set();
  const id = sharedConfig.context.id + sharedConfig.context.count++;
  let resource = {};
  let value = options.storage ? options.storage(options.initialValue)[0]() : options.initialValue;
  let p;
  let error;
  if (sharedConfig.context.async && options.ssrLoadFrom !== "initial") {
    resource = sharedConfig.context.resources[id] || (sharedConfig.context.resources[id] = {});
    if (resource.ref) {
      if (!resource.data && !resource.ref[0].loading && !resource.ref[0].error)
        resource.ref[1].refetch();
      return resource.ref;
    }
  }
  const read = () => {
    if (error)
      throw error;
    if (resourceContext && p)
      resourceContext.push(p);
    const resolved = options.ssrLoadFrom !== "initial" && sharedConfig.context.async && "data" in sharedConfig.context.resources[id];
    if (!resolved && read.loading) {
      const ctx = useContext(SuspenseContext);
      if (ctx) {
        ctx.resources.set(id, read);
        contexts.add(ctx);
      }
    }
    return resolved ? sharedConfig.context.resources[id].data : value;
  };
  read.loading = false;
  read.error = void 0;
  read.state = "initialValue" in options ? "resolved" : "unresolved";
  Object.defineProperty(read, "latest", {
    get() {
      return read();
    }
  });
  function load() {
    const ctx = sharedConfig.context;
    if (!ctx.async)
      return read.loading = !!(typeof source === "function" ? source() : source);
    if (ctx.resources && id in ctx.resources && "data" in ctx.resources[id]) {
      value = ctx.resources[id].data;
      return;
    }
    resourceContext = [];
    const lookup2 = typeof source === "function" ? source() : source;
    if (resourceContext.length) {
      p = Promise.all(resourceContext).then(() => fetcher(source(), {
        value
      }));
    }
    resourceContext = null;
    if (!p) {
      if (lookup2 == null || lookup2 === false)
        return;
      p = fetcher(lookup2, {
        value
      });
    }
    if (p != void 0 && typeof p === "object" && "then" in p) {
      read.loading = true;
      read.state = "pending";
      if (ctx.writeResource)
        ctx.writeResource(id, p, void 0, options.deferStream);
      return p.then((res) => {
        read.loading = false;
        read.state = "resolved";
        ctx.resources[id].data = res;
        p = null;
        notifySuspense(contexts);
        return res;
      }).catch((err) => {
        read.loading = false;
        read.state = "errored";
        read.error = error = castError(err);
        p = null;
        notifySuspense(contexts);
      });
    }
    ctx.resources[id].data = p;
    if (ctx.writeResource)
      ctx.writeResource(id, p);
    p = null;
    return ctx.resources[id].data;
  }
  if (options.ssrLoadFrom !== "initial")
    load();
  return resource.ref = [read, {
    refetch: load,
    mutate: (v) => value = v
  }];
}
function lazy(fn) {
  let resolved;
  let p;
  let load = () => {
    if (!p) {
      p = fn();
      p.then((mod) => resolved = mod.default);
    }
    return p;
  };
  const contexts = /* @__PURE__ */ new Set();
  const wrap = (props) => {
    load();
    const id = sharedConfig.context.id.slice(0, -1);
    if (resolved)
      return resolved(props);
    const ctx = useContext(SuspenseContext);
    const track = {
      loading: true,
      error: void 0
    };
    if (ctx) {
      ctx.resources.set(id, track);
      contexts.add(ctx);
    }
    if (sharedConfig.context.async) {
      sharedConfig.context.block(p.then(() => {
        track.loading = false;
        notifySuspense(contexts);
      }));
    }
    return "";
  };
  wrap.preload = load;
  return wrap;
}
function suspenseComplete(c) {
  for (const r of c.resources.values()) {
    if (r.loading)
      return false;
  }
  return true;
}
function notifySuspense(contexts) {
  for (const c of contexts) {
    if (suspenseComplete(c))
      c.completed();
  }
  contexts.clear();
}
function enableScheduling() {
}
function enableHydration() {
}
function startTransition(fn) {
  fn();
}
function useTransition() {
  return [() => false, (fn) => {
    fn();
  }];
}
function SuspenseList(props) {
  return props.children;
}
function Suspense(props) {
  let done;
  let clean;
  const ctx = sharedConfig.context;
  const id = ctx.id + ctx.count;
  const o = Owner;
  if (o) {
    if (o.context)
      o.context[BRANCH] = clean = {};
    else
      o.context = {
        [BRANCH]: clean = {}
      };
  }
  const value = ctx.suspense[id] || (ctx.suspense[id] = {
    resources: /* @__PURE__ */ new Map(),
    completed: () => {
      const res2 = runSuspense();
      if (suspenseComplete(value)) {
        done(resolveSSRNode(res2));
      }
    }
  });
  function runSuspense() {
    setHydrateContext({
      ...ctx,
      count: 0
    });
    return runWithOwner(o, () => {
      return createComponent(SuspenseContext.Provider, {
        value,
        get children() {
          clean && cleanNode(clean);
          return props.children;
        }
      });
    });
  }
  const res = runSuspense();
  if (suspenseComplete(value))
    return res;
  onError((err) => {
    if (!done || !done(void 0, err)) {
      if (o)
        runWithOwner(o.owner, () => {
          throw err;
        });
      else
        throw err;
    }
  });
  done = ctx.async ? ctx.registerFragment(id) : void 0;
  if (ctx.async) {
    setHydrateContext({
      ...ctx,
      count: 0,
      id: ctx.id + "0.f",
      noHydrate: true
    });
    const res2 = {
      t: `<span id="pl-${id}">${resolveSSRNode(props.fallback)}</span>`
    };
    setHydrateContext(ctx);
    return res2;
  }
  setHydrateContext({
    ...ctx,
    count: 0,
    id: ctx.id + "0.f"
  });
  ctx.writeResource(id, "$$f");
  return props.fallback;
}

// src/solid.js
console.log(server_exports);

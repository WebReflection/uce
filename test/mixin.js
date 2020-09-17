const assign = require('assign-properties');

const mixin = (...C) => {
  const init = group(C, 'init');
  const connected = group(C, 'connected');
  const disconnected = group(C, 'disconnected');
  const attributeChanged = group(C, 'attributeChanged');
  const observed = new Set(C.reduce((p, c) => p.concat(c.observedAttributes || []), []));
  const bound = new Set(C.reduce((p, c) => p.concat(c.bound || []), []));
  const props = C.filter(by, 'props').reduce((p, c) => assign(p, c.props), {});
  return assign({}, ...C, {
    init() { init.forEach(invoke, this); },
    connected() { connected.forEach(invoke, this); },
    disconnected() { disconnected.forEach(invoke, this); },
    attributeChanged() { attributeChanged.forEach(invoke, this); },
    observedAttributes: [...observed],
    bound: [...bound],
    props
  });
};

function group(c, key) { return c.filter(by, key).map(by, key); }
function by(c) { return c[this]; }
function invoke(fn) { fn.call(this); }

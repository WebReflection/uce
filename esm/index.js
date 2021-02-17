import {render, html, svg} from 'uhtml';
import umap from 'umap';
import css from 'plain-tag';

import domHandler from 'reactive-props/esm/dom.js';
const reactive = domHandler({dom: true});

const CE = customElements;
const {define: defineCustomElement} = CE;
const {create, defineProperties, getOwnPropertyDescriptor, keys} = Object;

const element = 'element';
const constructors = umap(new Map([[element, {c: HTMLElement, e: element}]]));

const el = name => document.createElement(name);

const info = e => constructors.get(e) || constructors.set(e, {
  c: el(e).constructor,
  e
});

const define = (tagName, definition) => {
  const {
    attachShadow,
    attributeChanged,
    bound,
    connected,
    disconnected,
    handleEvent,
    init,
    observedAttributes,
    props,
    render,
    style
  } = definition;
  const initialized = new WeakMap;
  const statics = {};
  const proto = {};
  const listeners = [];
  const retype = create(null);
  const bootstrap = (element, key, value) => {
    if (!initialized.has(element)) {
      initialized.set(element, 0);
      defineProperties(element, {
        html: {
          configurable: true,
          value: content.bind(
            attachShadow ? element.attachShadow(attachShadow) : element
          )
        }
      });
      for (let i = 0; i < length; i++) {
        const {type, options} = listeners[i];
        element.addEventListener(type, element, options);
      }
      if (bound)
        bound.forEach(bind, element);
      if (props)
        reactive(element, props, render);
      if (init || render)
        (init || render).call(element);
      if (key)
        element[key] = value;
    }
  };
  for (let k = keys(definition), i = 0, {length} = k; i < length; i++) {
    const key = k[i];
    if (/^on./.test(key) && !/Options$/.test(key)) {
      const options = definition[key + 'Options'] || false;
      const lower = key.toLowerCase();
      let type = lower.slice(2);
      listeners.push({type, options});
      retype[type] = key;
      if (lower !== key) {
        type = lower.slice(2, 3) + key.slice(3);
        retype[type] = key;
        listeners.push({type, options});
      }
    }
    switch (key) {
      case 'attachShadow':
      case 'constructor':
      case 'observedAttributes':
      case 'style':
        break;
      default:
        proto[key] = getOwnPropertyDescriptor(definition, key);
    }
  }
  const {length} = listeners;
  if (length && !handleEvent)
    proto.handleEvent = {value(event) {
      this[retype[event.type]](event);
    }};

  // [props]
  if (props !== null) {
    if (props) {
      for (let k = keys(props), i = 0; i < k.length; i++) {
        const key = k[i];
        proto[key] = {
          get() {
            bootstrap(this);
            return props[key];
          },
          set(value) {
            bootstrap(this, key, value);
          }
        };
      }
    }
    else {
      proto.props = {get() {
        const props = {};
        for (let {attributes} = this, {length} = attributes, i = 0; i < length; i++) {
          const {name, value} = attributes[i];
          props[name] = value;
        }
        return props;
      }};
    }
  }
  // [/props]

  if (observedAttributes)
    statics.observedAttributes = {value: observedAttributes};
  proto.attributeChangedCallback =  {value() {
    bootstrap(this);
    if (attributeChanged)
      attributeChanged.apply(this, arguments);
  }};

  proto.connectedCallback = {value() {
    bootstrap(this);
    if (connected)
      connected.call(this);
  }};

  if (disconnected)
    proto.disconnectedCallback = {value: disconnected};

  const {c, e} = info(definition.extends || element);
  class MicroElement extends c {};
  defineProperties(MicroElement, statics);
  defineProperties(MicroElement.prototype, proto);
  const args = [tagName, MicroElement];
  if (e !== element)
    args.push({extends: e});
  defineCustomElement.apply(CE, args);
  constructors.set(tagName, {c: MicroElement, e});
  if (style)
    document.head.appendChild(el('style')).textContent = style(
      e === element ? tagName : (e + '[is="' + tagName + '"]')
    );
  return MicroElement;
};

export {define, render, html, svg, css};

/* istanbul ignore else */
if (!CE.get('uce-lib'))
  // theoretically this could be just class { ... }
  // however, if there is for whatever reason a <uce-lib>
  // element on the page, it will break once the registry
  // will try to upgrade such element so ... HTMLElement it is.
  CE.define('uce-lib', class extends info(element).c {
    static get define() { return define; }
    static get render() { return render; }
    static get html() { return html; }
    static get svg() { return svg; }
    static get css() { return css; }
  });

function bind(method) {
  this[method] = this[method].bind(this);
}

function content() {
  return render(this, html.apply(null, arguments));
}

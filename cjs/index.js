'use strict';
const {render, html, svg} = require('uhtml');
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));
const css = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('plain-tag'));
const bound = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('bound-once'));

const CE = customElements;
const {define: defineCustomElement} = CE;
const {create, defineProperties, getOwnPropertyDescriptor, hasOwnProperty, keys} = Object;

const element = 'element';
const constructors = umap(new Map([[element, {c: HTMLElement, e: element}]]));

const el = name => document.createElement(name);

const info = e => constructors.get(e) || constructors.set(e, {
  c: el(e).constructor,
  e
});

const noop = () => {};

const define = (tagName, definition) => {
  const {
    attachShadow,
    attributeChanged,
    connected,
    disconnected,
    handleEvent,
    init,
    observedAttributes,
    props,
    style
  } = definition;
  const initialized = new WeakMap;
  const defaultProps = new Map;
  const statics = {};
  const proto = {};
  const listeners = [];
  const retype = create(null);
  const bootstrap = element => {
    if (!initialized.has(element)) {
      initialized.set(element, 0);
      defineProperties(element, {
        bound: {
          value: bound.bind(null, element)
        },
        html: {
          value: content.bind(
            attachShadow ? element.attachShadow(attachShadow) : element
          )
        }
      });
      for (let i = 0; i < length; i++) {
        const {type, options} = listeners[i];
        element.addEventListener(type, element, options);
      }
      defaultProps.forEach((value, _) => {
        _.set(element, value);
      });
      if (init)
        init.call(element);
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

  if (props !== null) {
    if (props) {
      for (let k = keys(props), i = 0; i < k.length; i++) {
        const _ = new WeakMap;
        const key = k[i];
        defaultProps.set(_, props[key]);
        proto[key] = {
          get() {
            bootstrap(this);
            return _.get(this);
          },
          set(value) {
            bootstrap(this);
            _.set(this, value);
            (this.render || noop).call(this);
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
      connected.apply(this, arguments);
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
};

exports.define = define;
exports.render = render;
exports.html = html;
exports.svg = svg;
exports.css = css;

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

function content() {
  return render(this, html.apply(null, arguments));
}

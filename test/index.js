// require('basichtml').init({});


const {parseHTML} = require('linkedom');

const {document, customElements, HTMLElement, DocumentFragment} = parseHTML('<html />');

const items = [];

globalThis.document = document;
globalThis.customElements = customElements;
globalThis.HTMLElement = HTMLElement;
globalThis.DocumentFragment = DocumentFragment;

const uhtml = require('uhtml');
const {define, css} = require('../cjs');

console.assert(css`1${2}3` === '123', 'css works');

define('el-0', {props: {}, attachShadow: {mode: 'open'}});
define('el-1', {init() {}, style(selector) { return `${selector}{color:green}` }});
define('el-2', {onClick() {}, ontest() {}, onCamelCase() {}});
define('el-3', {onClick() {}, onClickOptions: true});
define('el-4', {props: null, onClick() {}, handleEvent() {}});
define('el-5', {
  props: {test: true},
  attachShadow: {mode: 'open'},
  observedAttributes: ['test'],
  attributeChanged() {}
});
define('el-6', {
  observedAttributes: ['test'],
  props: {test: true, items},
  bound: ['render'],
  constructor() {},
  connected() {},
  disconnected() {},
  render() {}
});

define('el-7', {extends: 'div', style(selector) { return `${selector}{color:green}` }});

const El1 = customElements.get('el-1');
const el1 = new El1(document);
el1.connectedCallback();
el1.attributeChangedCallback();
el1.setAttribute('test', 123);
console.assert(el1.props.test == 123, 'props working');

const El2 = customElements.get('el-2');
const el2 = new El2(document);
el2.connectedCallback();
el2.handleEvent({type: 'click'});
el2.handleEvent({type: 'test'});
el2.handleEvent({type: 'camelCase'});

const El5 = customElements.get('el-5');
const el5 = new El5(document);
console.assert(el5.test === true, 'defined props working as getter');
el5.test = false;
console.assert(el5.test === false, 'defined props working as setter');
el5.attributeChangedCallback('test');

const el5b = new El5(document);
el5b.test = false;
console.assert(el5.test === false, 'defined props working as setter');

const El6 = customElements.get('el-6');
const el6 = new El6(document);
console.assert(el6.test === true, 'defined props working as getter');
el6.test = false;
console.assert(el6.test === false, 'defined props working as setter');
el6.connectedCallback();

const el7 = document.createElement('div', {is: 'el-7'});
el7.connectedCallback();
el7.html``;

el7.innerHTML = `<el-6 test=false></el-6>`;
console.assert(el7.firstChild.test === false, 'props over attributes');
console.assert(el7.firstChild.items !== items, 'props not shared');
console.assert(el7.firstChild.items.join('') === '', 'props not shared');

/* https://github.com/whatwg/html/issues/5552
((c,w,m)=>{
  m=c[w];c[w]=n=>m.call(c,n).then(()=>c.get(n));
})(customElements,'whenDefined');
//*/
customElements.whenDefined('uce-lib').then(
  ({css, html, svg, render, define: udefine} = customElements.get('uce-lib')) => {
    console.assert(css`1${2}3` === '123', 'css works');
    console.assert(udefine === define, 'define is OK');
    console.assert(typeof html === 'function', 'html is OK');
    console.assert(typeof svg === 'function', 'svg is OK');
    console.assert(typeof render === 'function', 'render is OK');
    console.log('OK');
  }
);

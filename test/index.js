require('basichtml').init();

document.importNode = function (arg) {};

const uhtml = require('lighterhtml');
uhtml.html = function () { return ''; };
const {define} = require('../cjs');

define('el-0', {attachShadow: {mode: 'open'}});
define('el-1', {init() {}});
define('el-2', {onClick() {}, ontest() {}, onCamelCase() {}});
define('el-3', {onClick() {}, onClickOptions: true});
define('el-4', {onClick() {}, handleEvent() {}});
define('el-5', {
  attachShadow: {mode: 'open'},
  observedAttributes: ['test'],
  attributeChanged() {}
});
define('el-6', {
  connected() {},
  disconnected() {}
});

define('el-7', {extends: 'div'});

const El1 = customElements.get('el-1');
const el1 = new El1(document);
el1.connectedCallback();
el1.attributeChangedCallback();

const El2 = customElements.get('el-2');
const el2 = new El2(document);
el2.connectedCallback();
el2.handleEvent({type: 'click'});
el2.handleEvent({type: 'test'});
el2.handleEvent({type: 'camelCase'});

const El5 = customElements.get('el-5');
const el5 = new El5(document);
el5.attributeChangedCallback('test');

const El6 = customElements.get('el-6');
const el6 = new El6(document);
el6.connectedCallback();

const El7 = customElements.get('el-7');
const el7 = new El7(document);
el7.connectedCallback();
el7.html``;

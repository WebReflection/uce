# µce

[![Build Status](https://travis-ci.com/WebReflection/uce.svg?branch=master)](https://travis-ci.com/WebReflection/uce) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uce/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/uce?branch=master)

<sup>**Social Media Photo by [Dawid Zawiła](https://unsplash.com/@davealmine) on [Unsplash](https://unsplash.com/)**</sup>

[µhtml](https://github.com/WebReflection/uhtml#readme) based Custom Elements.

**[Live Demo](https://codepen.io/WebReflection/pen/MWwJpWx?editors=0010)**

```js
import {define} from 'uce';

define('my-component', {

  // if specified, it can extend built-ins too.
  // by default it's 'element', as HTMLElement
  extends: 'div',

  // if specified, it's like the constructor
  // it's granted to be invoked *only once* on bootstrap
  // and *always* before connected/attributeChanged
  init() {},

  // if specified, it renders within its Shadow DOM
  // compatible with both open and closed modes
  attachShadow: {mode: 'closed'},

  // if specified, observe the list of attributes
  observedAttributes: ['test'],

  // if specified, will be notified per each
  // observed attribute change
  attributeChanged(name, newValue, oldValue){},

  // if specified, will be invoked when the node
  // is either appended live, or removed
  connected() {},
  disconnected() {},

  // events are automatically attached, as long
  // as they start with the `on` prefix
  // the context is *always* the component,
  // you'll never need to bind a method here
  onClick(event) {
    console.log(this); // always the current Custom Element
  },

  // if specified with `on` prefix and `Options` suffix,
  // allows adding the listener with a proper third argument
  onClickOptions: {once: true}, // or true, or default false

  // any other method, property, or getter/setter will be
  // properly configured in the defined class prototype
  get test() { return Math.random(); },

  set test(value) { console.log(value); },

  sharedData: [1, 2, 3],

  method() {
    return this.test;
  }

});
```

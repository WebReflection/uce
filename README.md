# <em>µ</em>ce

[![Build Status](https://travis-ci.com/WebReflection/uce.svg?branch=master)](https://travis-ci.com/WebReflection/uce) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uce/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/uce?branch=master)

![windflower](./uce-head.jpg)

<sup>**Social Media Photo by [Dawid Zawiła](https://unsplash.com/@davealmine) on [Unsplash](https://unsplash.com/)**</sup>

**[µhtml](https://github.com/WebReflection/uhtml#readme)** based Custom Elements.


## API In A Nutshell

_<em>µ</em>ce_ exports `render`, `html`, and `svg`, from _<em>µ</em>html_, plus its own way to `define` components.

Check out the [test page](https://webreflection.github.io/uce/test/) or this [code pen playground](https://codepen.io/WebReflection/pen/MWwJpWx?editors=0010).

```js
import {define} from 'uce';

define('my-component', {

  // if specified, it can extend built-ins too.
  // by default it's 'element', as HTMLElement
  extends: 'div',

  // if specified, it's like the constructor
  // it's granted to be invoked *only once* on bootstrap
  // and *always* before connected/attributeChanged
  init() {
    // µhtml is provided automatically via this.html
    // it will populate the shadow root, even if closed
    // or simply the node, if no attachShadow is defined
    this.html`<h1>Hello 👋 µce</h1>`;
    // this.props resolves all attributes by name
    // and returns their values (always as string)
    // but it's handy to reach custom elements attributes
    // without any real need to observe these, i.e.
    // <my-ce name="ag" />
    console.log(this.props.name); // "ag"
  },

  // if specified, it renders within its Shadow DOM
  // compatible with both open and closed modes
  attachShadow: {mode: 'closed'},

  // if specified, observe the list of attributes
  observedAttributes: ['test'],

  // if specified, will be notified per each
  // observed attribute change
  attributeChanged(name, oldValue, newValue){},

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


### How to avoid bundling µce per each component?

This module reserves, in the Custom Elements Registry a `uce-lib` class, which only purpose is to provide all exports as static getters.

```js
// whenever uce library is loaded
customElements.whenDefined('uce-lib').then(() => {

  // grab all utilities from the uce-lib Class
  const {define, render, html, svg} = customElements.get('uce-lib');

  // that's it: ready to go 🎉
  define('my-component', {
    init() {
      console.log('this is awesome!');
    }
  });
});
```



### Without classes, how does one define private properties?

Private properties can be created via a _WeakMap_, which is indeed how _Babel_ transforms these anyway.

```js
const privates = new WeakMap;
define('ce-with-privates', {
  init() {
    // define these once
    privates.set(this, {test: 1, other: '2'});
  },
  method() {
    // and use it anywhere you need them
    const {test, other} = privates.get(this);
    console.log(test, other);
  }
});
```


### Without classes, how does one extend other components?

There are at least two ways to extend an _uce_ component:

  * define via _uce_ your base component, and use `extends: "base-comp-name"` to extend it (built-ins supported!)
  * use one or more mixin through object literals

Object literals have indeed been used as mixin for a very long time, and the pattern with _uce_ would be very similar.

The only warning is that `Object.assign`, as well as object `{...spread}`, lose getters and setters in the process, so that if you want to extend more complex components, you should consider using [assignProperties](https://github.com/WebReflection/assign-properties#readme), or a similar helper.

```js
import $ from 'assign-properties';
const mixin = (...components) => $({}, ...components);

// a component literal definition
const NamedElement = {
  get name () { return this.tagName; }
};

// a generic NamedElement mixin
const FirstComponent = mixin(NamedElement, {
  method() {
    console.log(this.name);
  }
});

// define it via the FirstComponent mixin
define('first-component', FirstComponent);

// define it via mixin
define('first-component', mixin(FirstComponent, {
  otherThing() {}
}));
```

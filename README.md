# <em>µ</em>ce

[![Downloads](https://img.shields.io/npm/dm/uce.svg)](https://www.npmjs.com/package/uce) [![Build Status](https://travis-ci.com/WebReflection/uce.svg?branch=master)](https://travis-ci.com/WebReflection/uce) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uce/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/uce?branch=master)

![windflower](./uce-head.jpg)

<sup>**Social Media Photo by [Dawid Zawiła](https://unsplash.com/@davealmine) on [Unsplash](https://unsplash.com/)**</sup>

**[µhtml](https://github.com/WebReflection/uhtml#readme)** based Custom Elements.


## API Overview

_<em>µ</em>ce_ exports `render`, `html`, and `svg`, from _<em>µ</em>html_, plus its own way to `define` components.

In version *1.2*, it exports also a [plain-tag](https://github.com/WebReflection/plain-tag#readme) named `css`, useful to trigger _CSS_ minifiers.

Check out the [test page](https://webreflection.github.io/uce/test/) or this [code pen playground](https://codepen.io/WebReflection/pen/MWwJpWx?editors=0010).

```js
// list of all exports
import {define, render, html, svg, css} from 'uce';

define('my-component', {

  // if specified, it can extend built-ins too.
  // by default it's 'element', as HTMLElement
  extends: 'div',

  // if specified, it injects once per class definition
  // a <style> element in the document <head>.
  // In this case, selector will be the string:
  // div[is="my-component"]
  style: selector => css`${selector} {
    font-weight: bold;
  }`,

  // if specified, it's like the constructor but
  // it's granted to be invoked *only once* on bootstrap
  // and *always* before connected/attributeChanged/props
  init() {
    // µhtml is provided automatically via this.html
    // it will populate the shadow root, even if closed
    // or simply the node, if no attachShadow is defined
    this.html`<h1>Hello 👋 µce</h1>`;
    // a default props access example
    // <my-ce name="ag" />
    console.log(this.props.name); // "ag"
  },

  // if there is a render method, and no `init`,
  // this method will be invoked automatically on bootstrap.
  // element.render(), if present, is also invoked automatically
  // when `props` are defined as accessors, and one of these is
  // set during some outer component render()
  render() {
    this.html`<h1>Hello again!</h1>`;
  },

  // by default, props resolves all attributes by name
  // const {prop} = this.props; will be an alias for
  // this.getAttribute('prop') operation,
  // but it can simulate what React props do,
  // meaning that if it's defined as object,
  // all properties will trigger automatically
  // a render() call, if there is a render,
  // and properties are set as accessor, so that
  // the syntax to trigger these is .prop=${value}
  // as opposite of the default prop=${value}
  // which is observable, but it can hold only strings.
  // props: {prop: value} will make this.prop work.
  // If you don't want any of this machinery around props
  // you can opt out by defining it as null.
  // Bear in mind, the way to pass props as accessors,
  // is by prefixing the attribute via `.`, that is:
  // this.html`<my-comp .prop=${value}/>`;
  props: null,

  // if present, all names will be automatically bound to the element
  // right before initialization (el.method = el.method.bind(el))
  // this allows usage of methods instead of `this` for inner components
  bound: ['method'],

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

## F.A.Q.

<details>
  <summary><strong>Which polyfill should I use?</strong></summary>
  <div>

The [@ungap/custom-elements](https://github.com/ungap/custom-elements#readme) is the recommended polyfill to grant every Custom Elements V1 feature is available in every browser.

However, if no builtin extend is used, but legacy needs to be supported, including [@webreflection/custom-elements-no-builtin](https://github.com/WebReflection/custom-elements-no-builtin#readme) on top of the page should patch [IE 11 and other legacy browsers](https://github.com/ungap/custom-elements#compatibility).

  </div>
</details>

<details>
  <summary><strong>How to avoid bundling µce per each component?</strong></summary>
  <div>

This module reserves, in the Custom Elements Registry a `uce-lib` class, which only purpose is to provide all exports as static getters.

```js
// whenever uce library is loaded
customElements
  .whenDefined('uce-lib')
  .then(({define, render, html, svg} = customElements.get('uce-lib')) => {
    // that's it: ready to go 🎉
    define('my-component', {
      init() {
        console.log('this is awesome!');
      }
    });
  }
);
```

<strong>Using a helper</strong>

"_There's a module for that_", it's called [once-defined](https://github.com/WebReflection/once-defined#readme):

```js
import when from 'once-defined';

when('uce-lib').then(({define, render, html, svg}) => {
  // define your Custom Element
});
```

  </div>
</details>


<details>
  <summary><strong>Without classes, how does one define private properties?</strong></summary>
  <div>

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

  </div>
</details>

<details>
  <summary><strong>Without classes, how does one extend other components?</strong></summary>
  <div>

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

  </div>
</details>

<details>
  <summary><strong>What happened between 1.2 and 1.5?</strong></summary>
  <div>

A wrong `npm publish` happened, as `1.5.0` has been pushed for no reason between 0.5 an 0.6, so that latest was picking up actually an older version of the library.

My apologies.

  </div>
</details>

<details>
  <summary><strong>What's new in v1.2?</strong></summary>
  <div>

So far, the only missing utility for *non* Shadow DOM cases, is a way to define *once* a generic *style* associated with a component, which is why the special `style: (selector) => css` property has been added, so that any component can automatically define any specific style, using the `selector` to confine inner nodes directives.

The `css` export is a plain template literal tag, which is completely optional, but it might help minifiers, or [rollup plugins](https://github.com/asyncLiz/rollup-plugin-minify-html-literals), to minify that code too.

```js
// note: the css import is optional
import {define, css} from 'uce';

define('very-important', {
  style: sel => css`
    ${sel} {
      font-weight: bold;
      text-transform: uppercase;
    }
    ${sel}:hover {
      font-size: 2rem;
    }
  `
});
```

If the element doesn't extend a built-in, the received `sel`, as _selector_, will simply be its name, otherwise it'll be the built-in name with its `[is="..."]` attribute.

**Please note** the `style` won't interfere, or be attached anyhow, with the regular `element.style` or `this.style`, within a method, which is actually why I've chosen that name, so it's clear it's about the generic class/component style, and not its property.

  </div>
</details>

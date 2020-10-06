type HTML = import('uhtml').Tag<HTMLElement>;
type SVG = import('uhtml').Tag<SVGElement>;
type CSS = (strings: TemplateStringsArray, ...values: unknown[]) => string;
type Render<T, U> = (
  this: T & U & { html: HTML; render: Render<T, U> } & HTMLElement,
) => unknown;

export const css: CSS;
export const html: HTML;
export const svg: SVG;
export const define: <T, U>(tagName: string, definition: Definition<T, U>) => unknown;
export const render: <T extends Node>(
  node: T,
  renderer: (() => import('uhtml').Renderable) | import('uhtml').Renderable,
) => T;
export type EventOptions = { once: true } | boolean;

/**
  * Options object passed to `define`.
  * 
  * Definition generics:
  * 
  * T: Attributes passed to the custom element. For example:
  *        
  *    type Props = {
  *      count?: number;
  *    };
  * 
  * U: Internal state and functions. For example:
  *     
  *    type OwnProps = {
  *      count: number;
  *      inc: () => unknown;
  *      dec: () => unknown;
  *    };
  * 
  * Extend the Definition to define additional accessors:
  * 
  *    interface MyCounter extends Definition<Props, OwnProps> {
  *      onClick: (event: Event) => void;
  *      onClickOptions: EventOptions;
  *      test: number; // some getter/setter
  *      method: () => string; // some method
  *    } 
*/

export interface Definition<T = void, U = void> {
  /**
   * if specified, it can extend built-ins too.
   * by default it's 'element', as HTMLElement
   */
  extends?: string;

  /**
   * if specified, it injects once per class definition
   * a <style> element in the document <head>.
   * In this case, selector will be the string:
   * div[is="my-component"]
   */
  style?: (selector: string) => string;

  /**
   * if specified, it's like the constructor but
   * it's granted to be invoked *only once* on bootstrap
   * and *always* before connected/attributeChanged/props
   */
  init?: (
    this: { props: T } & U & HTMLElement & { html: HTML; render: Render<T, U> },
  ) => unknown;

  /**
   * if there is a render method, and no `init`,
   * this method will be invoked automatically on bootstrap.
   * element.render(), if present, is also invoked automatically
   * when `props` are defined as accessors, and one of these is
   * set during some outer component render()
   */
  render?: Render<T, U>;

  /**
   * by default, props resolves all attributes by name
   * const {prop} = this.props; will be an alias for
   * this.getAttribute('prop') operation,
   * but it can simulate what React props do,
   * meaning that if it's defined as object,
   * all properties will trigger automatically
   * a render() call, if there is a render,
   * and properties are set as accessor, so that
   * the syntax to trigger these is .prop=${value}
   * as opposite of the default prop=${value}
   * which is observable, but it can hold only strings.
   * props: {prop: value} will make this.prop work.
   * If you don't want any of this machinery around props
   * you can opt out by defining it as null.
   * Bear in mind, the way to pass props as accessors,
   * is by prefixing the attribute via `.`, that is:
   * this.html`<my-comp .prop=${value}/>`;
   */
  props?: T;

  /**
   * if present, all names will be automatically bound to the element
   * right before initialization (el.method = el.method.bind(el))
   * this allows usage of methods instead of `this` for inner components
   */
  bound?: string[];

  /**
   * if specified, it renders within its Shadow DOM
   * compatible with both open and closed modes
   */
  attachShadow?: { mode: 'closed' | 'open' };

  /**
   * if specified, observe the list of attributes
   */
  observedAttributes?: string[];

  /**
   * if specified, will be notified per each
   * observed attribute change
   */
  attributeChanged?: (
    name: string,
    oldValue: unknown,
    newValue: unknown,
  ) => unknown;

  /**
   * if specified, will be invoked when the node
   * is either appended live, or removed
   */
  connected?: () => void;
  disconnected?: () => void;

  /** 
   * Additional options that cannot be typed and need to be written in the component's interface extend,
   * for example:
   * 
   * // events are automatically attached, as long
   * // as they start with the `on` prefix
   * // the context is *always* the component,
   * // you'll never need to bind a method here
   * onClick?: (event) => unknown; // events
   * 
   * // if specified with `on` prefix and `Options` suffix,
   * // allows adding the listener with a proper third argument
   * onClickOptions?: EventOptions; // event listener settings
   * 
   * // any other method, property, or getter/setter will be
   * // properly configured in the defined class prototype
   * test?: unknown; // variables to access by getter/setter function: get test() and set test(value)
   * sharedData?: unknown;
   * method?: (args?: unknown) => unknown;
   */
}

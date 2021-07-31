type HTML = import('uhtml').Tag<HTMLElement>;
type SVG = import('uhtml').Tag<SVGElement>;
type CSS = (strings: TemplateStringsArray, ...values: unknown[]) => string;
type Render<T, U> = (
  this: {props: T} & U & { html: HTML; render: Render<T, U> } & HTMLElement,
) => unknown;
type This<T, U> = { props: T } & U & {
    html: HTML;
    render: Render<T, U>;
  } & HTMLElement;


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
  props?: Partial<U> | null;

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
    this: This<T, U>,
    name: string,
    oldValue: unknown,
    newValue: unknown,
  ) => unknown;

  /**
   * if specified, will be invoked when the node
   * is either appended live, or removed
   */
  connected?: (this: This<T, U>) => void;
  disconnected?: (this: This<T, U>) => void;

  /**
   * Optional event handlers
   * events are automatically attached, as long
   * as they start with the `on` prefix
   * the context is *always* the component,
   * you'll never need to bind a method here
   */
  onAbort?: (this: This<T, U>, event: Event) => unknown;
  onAnimationCancel?: (this: This<T, U>, event: Event) => unknown;
  onAnimationEnd?: (this: This<T, U>, event: Event) => unknown;
  onAnimationIteration?: (this: This<T, U>, event: Event) => unknown;
  onAuxClick?: (this: This<T, U>, event: Event) => unknown;
  onBlur?: (this: This<T, U>, event: Event) => unknown;
  onCancel?: (this: This<T, U>, event: Event) => unknown;
  onCanPlay?: (this: This<T, U>, event: Event) => unknown;
  onCanPlayThrough?: (this: This<T, U>, event: Event) => unknown;
  onChange?: (this: This<T, U>, event: Event) => unknown;
  onClick?: (this: This<T, U>, event: Event) => unknown;
  onClose?: (this: This<T, U>, event: Event) => unknown;
  onContextMenu?: (this: This<T, U>, event: Event) => unknown;
  onCueChange?: (this: This<T, U>, event: Event) => unknown;
  onDblClick?: (this: This<T, U>, event: Event) => unknown;
  onDurationChange?: (this: This<T, U>, event: Event) => unknown;
  onEnded?: (this: This<T, U>, event: Event) => unknown;
  onError?: (this: This<T, U>, event: Event) => unknown;
  onFocus?: (this: This<T, U>, event: Event) => unknown;
  onFormData?: (this: This<T, U>, event: Event) => unknown;
  onGotPointerCapture?: (this: This<T, U>, event: Event) => unknown;
  onInput?: (this: This<T, U>, event: Event) => unknown;
  onInvalid?: (this: This<T, U>, event: Event) => unknown;
  onKeyDown?: (this: This<T, U>, event: Event) => unknown;
  onKeyPress?: (this: This<T, U>, event: Event) => unknown;
  onKeyUp?: (this: This<T, U>, event: Event) => unknown;
  onLoad?: (this: This<T, U>, event: Event) => unknown;
  onLoadedData?: (this: This<T, U>, event: Event) => unknown;
  onLoadedMetadata?: (this: This<T, U>, event: Event) => unknown;
  onLoadEnd?: (this: This<T, U>, event: Event) => unknown;
  onLoadStart?: (this: This<T, U>, event: Event) => unknown;
  onLostPointerCapture?: (this: This<T, U>, event: Event) => unknown;
  onMouseDown?: (this: This<T, U>, event: Event) => unknown;
  onMouseEnter?: (this: This<T, U>, event: Event) => unknown;
  onMouseLeave?: (this: This<T, U>, event: Event) => unknown;
  onMouseMove?: (this: This<T, U>, event: Event) => unknown;
  onMouseOut?: (this: This<T, U>, event: Event) => unknown;
  onMouseOver?: (this: This<T, U>, event: Event) => unknown;
  onMouseUp?: (this: This<T, U>, event: Event) => unknown;
  onPause?: (this: This<T, U>, event: Event) => unknown;
  onPlay?: (this: This<T, U>, event: Event) => unknown;
  onPlaying?: (this: This<T, U>, event: Event) => unknown;
  onPointerCancel?: (this: This<T, U>, event: Event) => unknown;
  onPointerDown?: (this: This<T, U>, event: Event) => unknown;
  onPointerEnter?: (this: This<T, U>, event: Event) => unknown;
  onPointerLeave?: (this: This<T, U>, event: Event) => unknown;
  onPointerMove?: (this: This<T, U>, event: Event) => unknown;
  onPointerOut?: (this: This<T, U>, event: Event) => unknown;
  onPointerOver?: (this: This<T, U>, event: Event) => unknown;
  onPointerUp?: (this: This<T, U>, event: Event) => unknown;
  onReset?: (this: This<T, U>, event: Event) => unknown;
  onResize?: (this: This<T, U>, event: Event) => unknown;
  onScroll?: (this: This<T, U>, event: Event) => unknown;
  onSelect?: (this: This<T, U>, event: Event) => unknown;
  onSelectionChange?: (this: This<T, U>, event: Event) => unknown;
  onSelectStart?: (this: This<T, U>, event: Event) => unknown;
  onSubmit?: (this: This<T, U>, event: Event) => unknown;
  onTouchCancel?: (this: This<T, U>, event: Event) => unknown;
  onTouchMove?: (this: This<T, U>, event: Event) => unknown;
  onTouchStart?: (this: This<T, U>, event: Event) => unknown;
  onTransitionCancel?: (this: This<T, U>, event: Event) => unknown;
  onTransitionEnd?: (this: This<T, U>, event: Event) => unknown;
  onWheel?: (this: This<T, U>, event: Event) => unknown;

  /** if specified with `on` prefix and `Options` suffix,
   * allows adding the listener with a proper third argument
   * onClickOptions?: EventOptions; // event listener settings
   */
  onAbortOptions?: EventOptions;
  onAnimationCancelOptions?: EventOptions;
  onAnimationEndOptions?: EventOptions;
  onAnimationIterationOptions?: EventOptions;
  onAuxClickOptions?: EventOptions;
  onBlurOptions?: EventOptions;
  onCancelOptions?: EventOptions;
  onCanPlayOptions?: EventOptions;
  onCanPlayThroughOptions?: EventOptions;
  onChangeOptions?: EventOptions;
  onClickOptions?: EventOptions;
  onCloseOptions?: EventOptions;
  onContextMenuOptions?: EventOptions;
  onCueChangeOptions?: EventOptions;
  onDblClickOptions?: EventOptions;
  onDurationChangeOptions?: EventOptions;
  onEndedOptions?: EventOptions;
  onErrorOptions?: EventOptions;
  onFocusOptions?: EventOptions;
  onFormDataOptions?: EventOptions;
  onGotPointerCaptureOptions?: EventOptions;
  onInputOptions?: EventOptions;
  onInvalidOptions?: EventOptions;
  onKeyDownOptions?: EventOptions;
  onKeyPressOptions?: EventOptions;
  onKeyUpOptions?: EventOptions;
  onLoadOptions?: EventOptions;
  onLoadedDataOptions?: EventOptions;
  onLoadedMetadataOptions?: EventOptions;
  onLoadEndOptions?: EventOptions;
  onLoadStartOptions?: EventOptions;
  onLostPointerCaptureOptions?: EventOptions;
  onMouseDownOptions?: EventOptions;
  onMouseEnterOptions?: EventOptions;
  onMouseLeaveOptions?: EventOptions;
  onMouseMoveOptions?: EventOptions;
  onMouseOutOptions?: EventOptions;
  onMouseOverOptions?: EventOptions;
  onMouseUpOptions?: EventOptions;
  onPauseOptions?: EventOptions;
  onPlayOptions?: EventOptions;
  onPlayingOptions?: EventOptions;
  onPointerCancelOptions?: EventOptions;
  onPointerDownOptions?: EventOptions;
  onPointerEnterOptions?: EventOptions;
  onPointerLeaveOptions?: EventOptions;
  onPointerMoveOptions?: EventOptions;
  onPointerOutOptions?: EventOptions;
  onPointerOverOptions?: EventOptions;
  onPointerUpOptions?: EventOptions;
  onResetOptions?: EventOptions;
  onResizeOptions?: EventOptions;
  onScrollOptions?: EventOptions;
  onSelectOptions?: EventOptions;
  onSelectionChangeOptions?: EventOptions;
  onSelectStartOptions?: EventOptions;
  onSubmitOptions?: EventOptions;
  onTouchCancelOptions?: EventOptions;
  onTouchMoveOptions?: EventOptions;
  onTouchStartOptions?: EventOptions;
  onTransitionCancelOptions?: EventOptions;
  onTransitionEndOptions?: EventOptions;
  onWheelOptions?: EventOptions;

  /**
   * Additional options that cannot be typed and need to be written in the component's interface extend,
   * for example:
   *
   * // any other method, property, or getter/setter will be
   * // properly configured in the defined class prototype
   * test?: unknown; // variables to access by getter/setter function: get test() and set test(value)
   * sharedData?: unknown;
   * method?: (args?: unknown) => unknown;
   */
}

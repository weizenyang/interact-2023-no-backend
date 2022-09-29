import * as adapter from '@astrojs/netlify/netlify-functions.js';
import React, { createElement } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                        *//* empty css                                                                            *//* empty css                                                           *//* empty css                                   *//* empty css                            *//* empty css                          *//* empty css                         *//* empty css                        *//* empty css                      */import 'mime';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	if (children != null) {
		newProps.children = React.createElement(StaticHtml, { value: children });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		html = ReactDOM.renderToString(vnode);
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.2.3";
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      extracted.props[key.slice(0, -5)] = serializeListValue(value);
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = value;
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  island.props["before-hydration-url"] = await result.resolve("astro:scripts/before-hydration.js");
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t)},o=(t,i)=>{if(t===""||!Array.isArray(i))return i;const[e,n]=i;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const i=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const s of n){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("data-astro-template")||"default"]=s.innerHTML,s.remove())}for(const s of i){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("name")||"default"]=s.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((i,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate),await import(this.getAttribute("before-hydration-url")),this.start()}start(){const i=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:s}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),r=this.getAttribute("component-export")||"default";if(!r.includes("."))this.Component=a[r];else{this.Component=a;for(const d of r.split("."))this.Component=this.Component[d]}return this.hydrator=s,this.hydrate},i,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = {"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true}) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : !!obj.isAstroComponentFactory;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let html = "";
  for await (const chunk of renderAstroComponent(Component)) {
    html += stringifyChunk(result, chunk);
  }
  return html;
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (typeof child === "object" && Symbol.asyncIterator in child) {
    yield* child;
  } else {
    yield child;
  }
}
async function renderSlot(result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        content += stringifyChunk(result, chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(content);
  }
  return fallback;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?<!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `let ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const children2 = {};
      if (slots) {
        await Promise.all(
          Object.entries(slots).map(
            ([key, value]) => renderSlot(result, value).then((output) => {
              children2[key] = output;
            })
          )
        );
      }
      const html2 = Component.render({ slots: children2 });
      return markHTMLString(html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          children[key] = output;
        })
      )
    );
  }
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
const alreadyHeadRenderedResults = /* @__PURE__ */ new WeakSet();
function renderHead(result) {
  alreadyHeadRenderedResults.add(result);
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (alreadyHeadRenderedResults.has(result)) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

new TextEncoder();

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let body = "";
        for await (const chunk of output) {
          let html = stringifyChunk(result, chunk);
          body += html;
        }
        return markHTMLString(body);
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$metadata$a = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/layouts/Layout.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$a = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/layouts/Layout.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width">
		<link rel="icon" type="image/svg+xml" href="/favicon.svg">
		<meta name="generator"${addAttribute(Astro2.generator, "content")}>
		<title>${title}</title>
	${renderHead($$result)}</head>
	<body>
		${renderSlot($$result, $$slots["default"])}
	


</body></html>`;
});

const $$file$a = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/layouts/Layout.astro";
const $$url$a = undefined;

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$a,
	default: $$Layout,
	file: $$file$a,
	url: $$url$a
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$9 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Navbar.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$9 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Navbar.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Navbar;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<!-- export interface Navbar {

} --><!-- const {} = Astro.props; -->${maybeRenderHead($$result)}<div class="navbar astro-ZOQ3RVSO">
	<div class="astro-ZOQ3RVSO">
		<div class="logo astro-ZOQ3RVSO">
			<a href="/" class="astro-ZOQ3RVSO"><img src="/Logo.svg" class="astro-ZOQ3RVSO"></a>
			<h2 class="interact-text astro-ZOQ3RVSO">
				INTERACT <br class="astro-ZOQ3RVSO"> 2023
			</h2>
		</div>

		<ul class="nav-items astro-ZOQ3RVSO">
			<li class="astro-ZOQ3RVSO"><a href="/" class="astro-ZOQ3RVSO">Home</a></li>
			<li class="submissions-link astro-ZOQ3RVSO">
				<a href="/cfp" class="astro-ZOQ3RVSO">Submissions ></a>
				<div class="dropdown-menu pos-1 astro-ZOQ3RVSO">
					<ul class="astro-ZOQ3RVSO">
						<li class="astro-ZOQ3RVSO"><a href="/cfp" class="astro-ZOQ3RVSO">General</a></li>
						<li class="astro-ZOQ3RVSO">
							<div class="submission-types astro-ZOQ3RVSO">
								<a href="/submissions/0" class="astro-ZOQ3RVSO">Submission Types ></a>
								<div class="dropdown-menu pos-2 astro-ZOQ3RVSO">
									<ul class="astro-ZOQ3RVSO">

										<li class="astro-ZOQ3RVSO"><a href="/submissions/0" id="0" class="astro-ZOQ3RVSO">Full Papers</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/1" id="1" class="astro-ZOQ3RVSO">Short Papers</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/2" id="2" class="astro-ZOQ3RVSO">Posters</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/3" id="3" class="astro-ZOQ3RVSO">Panels</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/4" id="4" class="astro-ZOQ3RVSO">Interactive Demos</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/5" id="5" class="astro-ZOQ3RVSO">Courses</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/6" id="6" class="astro-ZOQ3RVSO">Workshops</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/7" id="7" class="astro-ZOQ3RVSO">Doctoral Consortium</a></li>
										<li class="astro-ZOQ3RVSO"><a href="/submissions/8" id="8" class="astro-ZOQ3RVSO">Industrial <br class="astro-ZOQ3RVSO"> Experiences</a></li>
										
									</ul>
								
								</div>
							</div>
						</li>

						<li class="astro-ZOQ3RVSO"><a href="/anonymity" class="astro-ZOQ3RVSO">Anonymity</a></li>
						<li class="astro-ZOQ3RVSO"><a href="/awards" class="astro-ZOQ3RVSO">Awards</a></li>
					</ul>
				
				</div>
				
				
				
			</li>
			<li class="astro-ZOQ3RVSO"><a href="" class="astro-ZOQ3RVSO">Programme</a></li>
			<li class="astro-ZOQ3RVSO"><a href="" class="astro-ZOQ3RVSO">Organisers</a></li>
			<li class="astro-ZOQ3RVSO"><a href="/contact" class="astro-ZOQ3RVSO">Contact</a></li>
			<li class="astro-ZOQ3RVSO"><a href="/venue" class="astro-ZOQ3RVSO">Venue</a></li>
		</ul>
		</div>

		<div class="button-div astro-ZOQ3RVSO">
			<button class="navbar-button astro-ZOQ3RVSO">
				Submit
			</button>
		</div>
		

	</div>`;
});

const $$file$9 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Navbar.astro";
const $$url$9 = undefined;

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$9,
	default: $$Navbar,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$8 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Footer.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$8 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Footer.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Footer;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<footer class="astro-ALYUL4NY">
	<div class="footer-div astro-ALYUL4NY">
		<stack class="astro-ALYUL4NY">
			<div class="footer-category astro-ALYUL4NY">
				<h3 class="astro-ALYUL4NY">
					DISCOVER
				</h3>
				<a class="astro-ALYUL4NY">Call For Papers</a>
				<a class="astro-ALYUL4NY">Organisers</a>
				<a class="astro-ALYUL4NY">Programme</a>
				<a class="astro-ALYUL4NY">Venue</a>

			</div>
			<div class="footer-category astro-ALYUL4NY">
				<h3 class="astro-ALYUL4NY">
					CONTACT
				</h3>
				<a class="astro-ALYUL4NY">Register</a>
				<a class="astro-ALYUL4NY">Contact Us</a>
			</div>
			<div class="footer-category astro-ALYUL4NY">
				<div class="interact-logo-items astro-ALYUL4NY">
					<img src="/Interact-2023-logo-full.svg" alt="" class="astro-ALYUL4NY">
					<div class="social-media astro-ALYUL4NY">
						<img src="/facebook 1.svg" alt="" class="astro-ALYUL4NY">
						<img src="/linkedin 1.svg" alt="" class="astro-ALYUL4NY">
						<img src="/email 1.svg" alt="" class="astro-ALYUL4NY">
					</div>
				</div>
				<p class="astro-ALYUL4NY">
					INTERACT 2023 is the 19th International Conference promoted by the IFIP Technical Committee 13 on Human–Computer Interaction. INTERACT is held every two years.
				</p>
			</div>

		</stack>

		<stack class="astro-ALYUL4NY">
			<div class="footer-category sponsors astro-ALYUL4NY">
				<p class="astro-ALYUL4NY">
					Sponsors:
				</p>
				<div class="logo-container astro-ALYUL4NY">
					<div class="square astro-ALYUL4NY"></div>
					<div class="square astro-ALYUL4NY"></div>
					<div class="square astro-ALYUL4NY"></div>
					<div class="square astro-ALYUL4NY"></div>
					<div class="square astro-ALYUL4NY"></div>
					<div class="square astro-ALYUL4NY"></div>
					<div class="square astro-ALYUL4NY"></div>
					<div class="square astro-ALYUL4NY"></div>
				</div>
			</div>
			
		</stack>
	</div>
</footer>`;
});

const $$file$8 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Footer.astro";
const $$url$8 = undefined;

const $$module3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$8,
	default: $$Footer,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$7 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Pre-footer.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$7 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Pre-footer.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$PreFooter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$PreFooter;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<section class="share-section astro-TTPJGK5T">
	<div class="share-container astro-TTPJGK5T">
		<h1 class="astro-TTPJGK5T">
			SHARE YOUR IDEAS
		</h1>
		
		<a href="/cfp" class="share-button astro-TTPJGK5T">
			<button class="astro-TTPJGK5T">
				Submit Now
			</button>
		</a>
	</div>
		
</section>`;
});

const $$file$7 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/components/Pre-footer.astro";
const $$url$7 = undefined;

const $$module4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$7,
	default: $$PreFooter,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$6 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/index.astro", { modules: [{ module: $$module1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../components/Navbar.astro", assert: {} }, { module: $$module3, specifier: "../components/Footer.astro", assert: {} }, { module: $$module4, specifier: "../components/Pre-footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$6 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/index.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Index;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Interact 2023", "class": "astro-MDLO334D" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-MDLO334D">
		${renderComponent($$result, "Navbar", $$Navbar, { "class": "astro-MDLO334D" })}
		<content class="astro-MDLO334D">

			<section class="home-content-1 astro-MDLO334D">
				<div class="stretch astro-MDLO334D">
					<div class="img-mask astro-MDLO334D">
						<img class="rch astro-MDLO334D" src="/RCH.jpg">
					</div>
					
						<aside class="location-detail astro-MDLO334D">
							<a href="/venue" class="astro-MDLO334D">
							<div class="pill astro-MDLO334D">
								<img src="/location.svg" class="astro-MDLO334D">
								Location
							</div>
							Ron Cooke Hub, <br class="astro-MDLO334D">
							University Of York.
							</a>
						</aside>
					
				</div>

				<div class="theme astro-MDLO334D">	
					<div class="title astro-MDLO334D">
						<h1 class="astro-MDLO334D">
							DESIGN FOR <span class="transparent astro-MDLO334D">EQUALITY AND JUSTICE DESIGN FOR</span>
						</h1>
						<h1 class="astro-MDLO334D">
							EQUALITY AND JUSTICE <span class="transparent astro-MDLO334D">DESIGN FOR EQUALITY AND JUSTICE</span>
						</h1>
					</div>
				

					<h3 class="date astro-MDLO334D">
						30 Aug - 3 Sept 2023
					</h3>
				</div>
			</section>

			<section class="home-content-2 astro-MDLO334D">
				<h1 class="astro-MDLO334D">
					ABOUT THIS EVENT
				</h1>
				<p class="astro-MDLO334D">
					INTERACT 2023 is the <span class="underline astro-MDLO334D">19th International Conference of Technical Committee 13 (Human-
						Computer Interaction)</span> of <span class="underline astro-MDLO334D">IFIP (International Federation for Information)</span>. 

					<br class="astro-MDLO334D"> 
					<br class="astro-MDLO334D">

					The INTERACT Conference is held every two years. <span class="underline astro-MDLO334D">It started in 1984</span>, making it one 
					of the longest running conferences on human-computer interaction.
				</p>

				<h3 class="astro-MDLO334D">
					Theme
				</h3>

				<p class="astro-MDLO334D">
					The theme of the 19th conference is <span class="bold astro-MDLO334D">“Design for Equality and Justice”</span>. Increasingly
					computer science as a discipline is becoming concerned about issues of justice and equality
					– from fake news to rights for robots, from the ethics of driverless vehicles to the gamergate
					controversy.

					<br class="astro-MDLO334D"><br class="astro-MDLO334D">

					The HCI community is surely well placed to be at the leading edge of such
					discussions within the wider computer science community and in the dialogue between
					computer science and the broader society.

					<br class="astro-MDLO334D"><br class="astro-MDLO334D">

					Justice and equality are both particularly important concepts both for the City of York and
					the University of York. The City of York, has a long history of working for justice and equality.

				</p>

				<h3 class="astro-MDLO334D">
					Why York?
				</h3>

				<p class="astro-MDLO334D">
					York has been a strongly “Quaker” town since the very beginning of the Quaker movement.
				</p>

				<div class="astro-MDLO334D">
					<div class="flex items astro-MDLO334D">
						<div class="icon-container astro-MDLO334D">
							<img class="icons astro-MDLO334D" src="/YHRC.png">
						</div>

							<p class="item-description astro-MDLO334D">
								The City of York has also launched <span class="bold astro-MDLO334D">“One Planet York”</span> , a network of organisations
 								working towards a more sustainable, resilient and collaborative “one planet” future.  
							</p>
				
					</div>

					<div class="flex items astro-MDLO334D">
						<div class="icon-container astro-MDLO334D">
							<img class="icons astro-MDLO334D" src="/One-planet.png">
						</div>

						<p class="item-description astro-MDLO334D">
							York is
							now working to become the first “Zero emissions” city centre, with much of the medieval
							centre already car free.
							</p>
				
					</div>

					<div class="flex items astro-MDLO334D">
						<div class="icon-container astro-MDLO334D">
							<img class="icons astro-MDLO334D" src="/zero-emissions.svg">
						</div>

						<p class="item-description astro-MDLO334D">
								York continues to work for justice and equality to this day. It is the UK’s first Human Rights
								City, encouraging organizations and citizens to
								“increasingly think about human rights, talk about human rights issues and stand up for
								rights whether that’s at work, school or home”. 
							</p>
				
					</div>
				</div>
			</section>

			<section class="home-content-3 astro-MDLO334D">

				<h1 class="astro-MDLO334D">
					CALL FOR PAPERS
				</h1>

				<p class="astro-MDLO334D">
					The INTERACT Conference welcomes submissions on all aspects of human-computer interaction, but for this conference will particularly welcome papers on issues related to justice and equality, for example:
				</p>

				<div class="home-list astro-MDLO334D">

					<div class="list-line astro-MDLO334D"></div>

					<div class="home-list-items astro-MDLO334D">
						<h3 class="astro-MDLO334D">
							HCI to support sustainable development 
						</h3>

						<h3 class="astro-MDLO334D">
							HCI to support reduction in food waste, water and energy use
						</h3>

						<h3 class="astro-MDLO334D">
							HCI to support freedom of expression 
						</h3>

						<h3 class="astro-MDLO334D">
							Consideration of gender, sexuality and ethnic diversity in HCI 
						</h3>

						<h3 class="astro-MDLO334D">
							HCI and inclusion of disabled and older people
						</h3>

						<h3 class="astro-MDLO334D">
							HCI countering adversity
						</h3>
					</div>
				</div>

				<button class="read-more astro-MDLO334D">
					Read More >
				</button>

			</section>

			<section class="home-content-4 astro-MDLO334D">

				<h1 class="astro-MDLO334D">
					PROGRAMME
				</h1>

				<p class="astro-MDLO334D">
					The INTERACT Conference welcomes submissions on all aspects of human-computer interaction, but for this conference will particularly welcome papers on issues related to justice and equality, for example:
				</p>

				
				<div class="timeline astro-MDLO334D">
					<div class="line astro-MDLO334D"></div>
					<div class="timeline-detail p1 astro-MDLO334D">
						<h3 class="astro-MDLO334D">September 21</h3>
						<div class="timeline-marker  astro-MDLO334D"></div>
						<h3 class="astro-MDLO334D">Programme 1</h3>
					</div>
					
					<div class="timeline-detail p2 astro-MDLO334D">
						<h3 class="astro-MDLO334D">September 21</h3>
						<div class="timeline-marker astro-MDLO334D"></div>
						<h3 class="astro-MDLO334D">Programme 1</h3>
					</div>
						

					<div class="timeline-detail p3 astro-MDLO334D">
						<h3 class="astro-MDLO334D">September 23</h3>
						<div class="timeline-marker astro-MDLO334D"></div>
						<h3 class="astro-MDLO334D">Programme 1</h3>
					</div>

					<div class="timeline-detail p4 astro-MDLO334D">
						<h3 class="astro-MDLO334D">September 21</h3>
						<div class="timeline-marker astro-MDLO334D"></div>
						<h3 class="astro-MDLO334D">Programme 1</h3>
					</div>

				</div>

				<a href="/cfp" class="astro-MDLO334D">
					<button class="read-more astro-MDLO334D">
						Read More >
					</button>
				</a>
				

			</section>

			
			${renderComponent($$result, "Prefooter", $$PreFooter, { "class": "astro-MDLO334D" })}
			
			
		</content>
		
	</main>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-MDLO334D" })}` })}`;
});

const $$file$6 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/index.astro";
const $$url$6 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$6,
	default: $$Index,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$metadata$5 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/submissions/[id].astro", { modules: [{ module: $$module1, specifier: "/src/layouts/Layout.astro", assert: {} }, { module: $$module3, specifier: "/src/components/Footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: ["/src/components/Submissions.jsx"], hydrationDirectives: /* @__PURE__ */ new Set(["only"]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/submissions/[id].astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
async function getStaticPaths() {
  return [
    { params: { id: "0" } },
    { params: { id: "1" } },
    { params: { id: "2" } },
    { params: { id: "3" } },
    { params: { id: "4" } },
    { params: { id: "5" } },
    { params: { id: "6" } },
    { params: { id: "7" } },
    { params: { id: "8" } },
    { params: { id: "9" } }
  ];
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate(_a || (_a = __template(["", "\n\n\n\n<!-- <script>\n	const response = await fetch('http://localhost:1337/api/submissions');\n	const data = await response.json();\n	const type = data.data;\n\n	// document.addEventListener('click', (e) => {\n	// 	console.log(e.target.id);\n	// 	sectionNum = e.target.id;\n	// })\n<\/script> -->\n\n"])), renderComponent($$result, "Layout", $$Layout, { "title": "Interact 2023", "class": "astro-C6K2PUKR" }, { "default": () => renderTemplate`${renderComponent($$result, "Submissions", null, { "id": id, "client:only": "react", "client:component-hydration": "only", "class": "astro-C6K2PUKR", "client:component-path": $$metadata$5.resolvePath("/src/components/Submissions.jsx"), "client:component-export": "default" })}${renderComponent($$result, "Footer", $$Footer, { "class": "astro-C6K2PUKR" })}` }));
});

const $$file$5 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/submissions/[id].astro";
const $$url$5 = "/submissions/[id]";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$5,
	getStaticPaths,
	default: $$id,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$4 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/anonymity.astro", { modules: [{ module: $$module1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../components/Navbar.astro", assert: {} }, { module: $$module3, specifier: "../components/Footer.astro", assert: {} }, { module: $$module4, specifier: "../components/Pre-footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/anonymity.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Anonymity = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Anonymity;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Interact 2023", "class": "astro-VM4YFKQE" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-VM4YFKQE">
		${renderComponent($$result, "Navbar", $$Navbar, { "class": "astro-VM4YFKQE" })}
		<content class="astro-VM4YFKQE">
			<section class="anonymity-content-1 astro-VM4YFKQE">


						<h1 class="title astro-VM4YFKQE">
							ANONYMITY OF SUBMISSIONS
						</h1>

						<p class="conditions astro-VM4YFKQE">
							The review process requires the <span class="bold astro-VM4YFKQE">anonymity of authors and reviewers.</span>
						</p>
							<ul class="astro-VM4YFKQE">
								<li class="astro-VM4YFKQE">
									Papers should not have any indication of who the authors are in the text or the metadata for the file.
								</li>
								<br class="astro-VM4YFKQE">
								<li class="astro-VM4YFKQE">
									Please remove names and affiliations from the opening header and remove any indication of your affiliation or location in the text (e.g. names of laboratories where studies were conducted). 
								</li>
								<br class="astro-VM4YFKQE">
								<li class="astro-VM4YFKQE">
									Avoid obvious identifying statements in the paper. 
								</li>
								<br class="astro-VM4YFKQE">
								<li class="astro-VM4YFKQE">
									Citations to your own relevant work should not be anonymous, but rather should be done without identifying yourself as the author. For example, say “Prior work by [authors]” instead of “In our prior work.” Make sure that you are also not identified in the metadata of the file. 
								</li>
								<br class="astro-VM4YFKQE">
							</ul>
						<p class="astro-VM4YFKQE">	
							Papers which are not anonymized <span class="bold astro-VM4YFKQE">may not be accepted.</span>
						</p>
				
			</section>

		</content>
		
	</main>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-VM4YFKQE" })}` })}`;
});

const $$file$4 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/anonymity.astro";
const $$url$4 = "/anonymity";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$Anonymity,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/contact.astro", { modules: [{ module: $$module1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../components/Navbar.astro", assert: {} }, { module: $$module3, specifier: "../components/Footer.astro", assert: {} }, { module: $$module4, specifier: "../components/Pre-footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/contact.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Contact;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Interact 2023", "class": "astro-42VMRNGF" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-42VMRNGF">
		${renderComponent($$result, "Navbar", $$Navbar, { "class": "astro-42VMRNGF" })}
		<content class="astro-42VMRNGF">
			<section class="contact-content-1 astro-42VMRNGF">


						<h1 class="title astro-42VMRNGF">
							CONTACT FORM
						</h1>

						<div class="input-field astro-42VMRNGF">
							<label class="astro-42VMRNGF">Name:</label>
							<input name="Name" placeholder="John Doe" class="astro-42VMRNGF">
						</div>
						
						<div class="input-field astro-42VMRNGF">
							<label class="astro-42VMRNGF">Email:</label>
							<input name="Email" placeholder="johndoe@gmail.com" class="astro-42VMRNGF">
						</div>
						
						<div class="input-field astro-42VMRNGF">
							<label class="astro-42VMRNGF">Message:</label>
							<textarea name="Message" placeholder="Message Here" class="astro-42VMRNGF"></textarea>
						</div>

						<h2 class="astro-42VMRNGF">
							Committee Contacts
						</h2>
						
						<div class="contact-details astro-42VMRNGF">
							<h4 class="astro-42VMRNGF">Paolo Buono</h4> 
							<p class="astro-42VMRNGF"> Dipartimento di Informatica, Università degli Studi di Bari Aldo Moro, Via Orabona, 4 - 70125 Bari, Italy 
								<br class="astro-42VMRNGF">Phone: +39 080 544 2239 
								<br class="astro-42VMRNGF">Fax: +39 080 544 3300 
								<br class="astro-42VMRNGF">Email: paolo.buono@uniba.it
								<br class="astro-42VMRNGF">
							</p>

							<h4 class="astro-42VMRNGF">Paolo Buono</h4> 
							<p class="astro-42VMRNGF"> Dipartimento di Informatica, Università degli Studi di Bari Aldo Moro, Via Orabona, 4 - 70125 Bari, Italy 
								<br class="astro-42VMRNGF">Phone: +39 080 544 2239 
								<br class="astro-42VMRNGF">Fax: +39 080 544 3300 
								<br class="astro-42VMRNGF">Email: paolo.buono@uniba.it
								<br class="astro-42VMRNGF">
							</p>

							<h4 class="astro-42VMRNGF">Paolo Buono</h4> 
							<p class="astro-42VMRNGF"> Dipartimento di Informatica, Università degli Studi di Bari Aldo Moro, Via Orabona, 4 - 70125 Bari, Italy 
								<br class="astro-42VMRNGF">Phone: +39 080 544 2239 
								<br class="astro-42VMRNGF">Fax: +39 080 544 3300 
								<br class="astro-42VMRNGF">Email: paolo.buono@uniba.it
								<br class="astro-42VMRNGF">
							</p>

							<h4 class="astro-42VMRNGF">Paolo Buono</h4> 
							<p class="astro-42VMRNGF"> Dipartimento di Informatica, Università degli Studi di Bari Aldo Moro, Via Orabona, 4 - 70125 Bari, Italy 
								<br class="astro-42VMRNGF">Phone: +39 080 544 2239 
								<br class="astro-42VMRNGF">Fax: +39 080 544 3300 
								<br class="astro-42VMRNGF">Email: paolo.buono@uniba.it
								<br class="astro-42VMRNGF">
							</p>

						</div>
				
			</section>

		</content>
		
	</main>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-42VMRNGF" })}` })}`;
});

const $$file$3 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/contact.astro";
const $$url$3 = "/contact";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$Contact,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/awards.astro", { modules: [{ module: $$module1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../components/Navbar.astro", assert: {} }, { module: $$module3, specifier: "../components/Footer.astro", assert: {} }, { module: $$module4, specifier: "../components/Pre-footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/awards.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Awards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Awards;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Interact 2023", "class": "astro-E5WIEGKX" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-E5WIEGKX">
		${renderComponent($$result, "Navbar", $$Navbar, { "class": "astro-E5WIEGKX" })}
		<content class="astro-E5WIEGKX">
			<section class="awards-content-1 astro-E5WIEGKX">


						<h1 class="title astro-E5WIEGKX">
							IFIP TC13 AWARDS
						</h1>

						<div class="home-list astro-E5WIEGKX">

							<div class="list-line astro-E5WIEGKX"></div>
		
							<div class="home-list-items astro-E5WIEGKX">
								<h3 class="astro-E5WIEGKX">
									Brian Shackel Award
								</h3>
		
								<h3 class="astro-E5WIEGKX">
									IFIP TC13 Pioneers’ Award for Best Doctoral Student Paper at INTERACT.
								</h3>
		
								<h3 class="astro-E5WIEGKX">
									IFIP TC13 Accessibility Award.
								</h3>
		
								<h3 class="astro-E5WIEGKX">
									IFIP TC13 Interaction Design for International Development Award
								</h3>
		
							</div>
						</div>
				
			</section>

			<section class="awards-content-2 astro-E5WIEGKX">
				<h2 class="astro-E5WIEGKX">
					IFIP TC13 BRIAN SHACKEL AWARD
				</h2>

				<div class="home-list astro-E5WIEGKX">
						<p class="astro-E5WIEGKX">
							The Brian Shackel Award is associated with each INTERACT Conference to recognize the most outstanding contribution in the form of a refereed paper submitted to and delivered at the Conference. The purpose is to draw attention to the need for a comprehensive human-centred approach in the design and use of information technology in which the human and social implications have been taken into account. The Brian Shackel Award consists of a commemorative plaque. In addition, each author of the selected contribution will receive a certificate.
						<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
						The <span class="bold astro-E5WIEGKX">criteria for the Brian Shackel Award</span> are:
						<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
						1. An outstanding contribution with international impact in the field of human interaction with, and human use of, computers and information technology.
						<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
						2. The paper selected should draw attention to the need for a comprehensive human-centred approach in the design and use of information technology in which the human and social implications have been taken into account.
						<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
						3. Any paper submitted to the next INTERACT Conference can be a candidate.
						The selection of the Brian Shackel Award is organized by an ad-hoc committee of INTERACT PC members and coordinated by the IFIP TC13 vice-chair for awards, Prof. Paula Kotzé.
					</p>
				</div>
		
			</section>

			<section class="awards-content-2 astro-E5WIEGKX">
				<h2 class="astro-E5WIEGKX">
					IFIP TC13 Pioneers’ Award 
<span class="thin astro-E5WIEGKX">for</span><br class="astro-E5WIEGKX"> Best Doctoral Student 
Paper at INTERACT
				</h2>

				<div class="home-list astro-E5WIEGKX">
						<p class="astro-E5WIEGKX">
							The IFIP TC13 Pioneer title is awarded to honour the greatest contributors to the development and growth of the field of Human-Computer Interaction.  An IFIP TC13 Pioneer is one who has made outstanding contributions to the educational, theoretical, technical, commercial or professional aspects of analysis, design, construction, evaluation and use of interactive systems.

							At each INTERACT Conference, the past recipients of the IFIP TC13 Pioneer title selects the best research paper by a doctoral student submitted and accepted to the Conference to be awarded the IFIP TC13 Pioneers’ Award for Best Doctoral Student Paper at INTERACT. The paper should be presented by the student.
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							The <span class="bold astro-E5WIEGKX">criteria for the IFIP TC13 Pioneers’ Award for Best Doctoral Student Paper at INTERACT </span>are:
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							• The paper must be based on the doctoral research of the student, as presented/to be presented in the student’s doctoral thesis.
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							• The doctoral student must be the first and primary author of the paper.
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							• The paper must be accepted as a full paper for the INTERACT Conference.
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							• The doctoral student must present the paper at the INTERACT Conference.
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							The selection of the TC13 Pioneers’ Award for Best Doctoral Student Paper is organized by an ad-hoc committee composed by the TC13 pioneers
					</p>
				</div>
		
			</section>

			<section class="awards-content-2 astro-E5WIEGKX">
				<h2 class="astro-E5WIEGKX">
					IFIP TC13 Accessibility award
				</h2>

				<div class="home-list astro-E5WIEGKX">
						<p class="astro-E5WIEGKX">
							The IFIP TC13 Accessibility Award is associated with each INTERACT Conference to recognise the most outstanding contribution of ageing, disability and inclusive design in the form of a refereed paper submitted to and delivered at the Conference.
							Working Group 13.3 on HCI and Disability offers this award in order to draw attention to the need of information technology which takes into account the needs and preferences of people who are older and disabled. This may be in the form of an assistive technology specifically for older and disabled people, or a generic design solution that would be more usable for a wider range of people.
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							The <span class="bold astro-E5WIEGKX">criteria for the IFIP TC13 Accessibility Award</span> are:
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							• An outstanding contribution with international impact in the field of human interaction with, and human use of, computers and information technology, by people who are older or disabled.
							<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
							• Any paper submitted to the INTERACT Conference in the year under consideration can be a candidate, except any written by members of the Accessibility Award Committee.
							The selection of the TC13 Accessibility Award is organized by an ad-hoc committee of members of the INTERACT PC and coordinated by the Chair of the Working Group 13.3.
					</p>
				</div>
		
			</section>

			<section class="awards-content-2 astro-E5WIEGKX">
				<h2 class="astro-E5WIEGKX">
					IFIP TC13 interaction design
					<span class="thin astro-E5WIEGKX"> for </span>international development award
				</h2>

				<div class="home-list astro-E5WIEGKX">
						<p class="astro-E5WIEGKX">
							The IFIP TC13 Interaction Design for International Development Award is associated with each INTERACT Conference, to recognise the most outstanding contribution to the application of interactive systems for social and economic development of people in developing countries, in the form of a refereed paper submitted to and delivered at the Conference.
Working Group 13.8 on Interaction Design for International Development offers this Award to highlight the need for information technology that is designed to meet the needs, values, aspirations and preferences of people who are economically and socially marginalized throughout the world, and to draw attention to the potential of HCI to contribute to the design and delivery of such technologies.
<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
The <span class="bold astro-E5WIEGKX">criteria for the IFIP TC13 Interaction Design for International Development Award</span> are:
<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
• An outstanding contribution in the field of the analysis, design, development or evaluation of interactive systems that have the potential to contribute to the social and/or economic development of people who are economically and socially marginalized in developing regions of the world.
<br class="astro-E5WIEGKX"><br class="astro-E5WIEGKX">
• Any full paper submitted to the INTERACT Conference in the year under consideration can be a candidate, except any written by members of the Coordinators of the Award.
The selection of the TC13 IDID Award is organized by an ad-hoc committee of members of the INTERACT PC and coordinated by the Chair of the Working Group 13.8.
					</p>
				</div>
		
			</section>

		</content>
		
	</main>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-E5WIEGKX" })}` })}`;
});

const $$file$2 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/awards.astro";
const $$url$2 = "/awards";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$Awards,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$1 = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/venue.astro", { modules: [{ module: $$module1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../components/Navbar.astro", assert: {} }, { module: $$module3, specifier: "../components/Footer.astro", assert: {} }, { module: $$module4, specifier: "../components/Pre-footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/venue.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Venue = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Venue;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Interact 2023", "class": "astro-XRSOVNKG" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-XRSOVNKG">
		${renderComponent($$result, "Navbar", $$Navbar, { "class": "astro-XRSOVNKG" })}
		<content class="astro-XRSOVNKG">
			<section class="venue-content-1 astro-XRSOVNKG">
						<h1 class="title astro-XRSOVNKG">
							VENUE
						</h1>

						<div class="venue-card astro-XRSOVNKG">
							<div class="venue-details astro-XRSOVNKG">
								<div class="top astro-XRSOVNKG">
									<img src="uoy-logo.png" alt="" width="180px" class="astro-XRSOVNKG">
									<h2 class="astro-XRSOVNKG">
										Main Atrium @ <br class="astro-XRSOVNKG"> Ron Cooke Hub
									</h2>
								</div>

								<div class="bottom astro-XRSOVNKG">
									<h4 class="astro-XRSOVNKG">
										Address
									</h4>
									<p class="astro-XRSOVNKG">
										Ron Cooke Hub,
										<br class="astro-XRSOVNKG">133 Deramore Ln, 
										<br class="astro-XRSOVNKG">University of York,
										<br class="astro-XRSOVNKG">York, YO10 5GE
									</p>
								</div>
								
							</div>
							<div class="venue-image astro-XRSOVNKG">

									<img src="/RCH.jpg" alt="" class="astro-XRSOVNKG">
								
							</div>
						</div>
			</section>

			<section class="venue-content-2 astro-XRSOVNKG">
				<h1 class="thin-text astro-XRSOVNKG">
					About
				</h1>
				<h1 class="bold astro-XRSOVNKG">
					Ron Cooke Hub
				</h1>

				<h2 class="thin-text astro-XRSOVNKG">
					The Hub is a £20 million, 7000 sq ft 'melting pot' for engagement. Its design encourages discussion and interaction, bringing people together across disciplines and sectors, from within and outside the university, providing space for new, value-adding ideas and partnerships to blossom.
				</h2>
			</section>

			<section class="venue-content-3 astro-XRSOVNKG">
				<h2 class="bold astro-XRSOVNKG">
					I'm travelling from:
				</h2>

				<div class="selection astro-XRSOVNKG">
					
					<input id="railway" type="radio" name="type" value="railway" class="astro-XRSOVNKG">
					<label id="railway-label" for="railway" class="astro-XRSOVNKG">Railway Station (Bus)</label>
					
					<input id="airport" type="radio" name="type" value="airport" class="astro-XRSOVNKG">
					<label id="airport-label" for="airport" class="astro-XRSOVNKG">Manchester Airport</label>
					
					<input id="london" type="radio" name="type" value="london" class="astro-XRSOVNKG">
					<label id="london-label" for="london" class="astro-XRSOVNKG">London</label>
				</div>

				<div class="directions astro-XRSOVNKG">



				</div>
				
			</section>

			<section class="venue-content-4 astro-XRSOVNKG">

				<div class="content-container astro-XRSOVNKG">

					<div class="map-embed astro-XRSOVNKG">
						<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2348.1262576267018!2d-1.0320876841881301!3d53.947265180109355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48792fd3ebc5bc65%3A0xacbab96a0b4b7a96!2sThe%20Ron%20Cooke%20Hub!5e0!3m2!1sen!2sfr!4v1664443801266!5m2!1sen!2sfr" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="astro-XRSOVNKG"></iframe>
					</div>

					<div class="direction-links astro-XRSOVNKG">
						<h2 class="bold astro-XRSOVNKG">Get Directions</h2>
						<button class="astro-XRSOVNKG">Google Maps</button>
						<button class="astro-XRSOVNKG">Apple Maps</button>
						<button class="astro-XRSOVNKG">Waze Maps</button>
					</div>
					
				</div>
				
			</section>

		</content>
		
	</main>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-XRSOVNKG" })}` })}`;
});

const $$file$1 = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/venue.astro";
const $$url$1 = "/venue";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$Venue,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/cfp.astro", { modules: [{ module: $$module1, specifier: "../layouts/Layout.astro", assert: {} }, { module: $$module2, specifier: "../components/Navbar.astro", assert: {} }, { module: $$module3, specifier: "../components/Footer.astro", assert: {} }, { module: $$module4, specifier: "../components/Pre-footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro = createAstro("/@fs/D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/cfp.astro", "", "file:///D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/");
const $$Cfp = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Cfp;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Interact 2023", "class": "astro-NMOCCWWA" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="astro-NMOCCWWA">
		${renderComponent($$result, "Navbar", $$Navbar, { "class": "astro-NMOCCWWA" })}
		<content class="astro-NMOCCWWA">
			<section class="cfp-content-1 astro-NMOCCWWA">

					<div class="title astro-NMOCCWWA">
						<h3 class="astro-NMOCCWWA">
							CALL FOR PAPERS
						</h3>
						<h1 class="bold-title astro-NMOCCWWA">
							GENERAL <br class="astro-NMOCCWWA"> INFORMATION
						</h1>
					</div>

						<p class="astro-NMOCCWWA">
							We invite you to submit your original work to INTERACT 2023 in one of the following tracks below:
						</p>

						<!-- Middle Line -->
						

						<div class="submissions astro-NMOCCWWA">
							<div class="middle-line astro-NMOCCWWA"></div>

						<!-- January Submissions -->
						<div class="sub-types astro-NMOCCWWA">
							<h3 class="astro-NMOCCWWA">Submissions by 25 January 2023</h3>
							<div class="selection astro-NMOCCWWA">
								
									<div class="box astro-NMOCCWWA">
										<a class="none astro-NMOCCWWA" href="">
											<div class="astro-NMOCCWWA">
												<img src="Full Papers.svg" alt="" class="astro-NMOCCWWA">
											</div>
											
											<div class="sub-details astro-NMOCCWWA">
												<h3 class="astro-NMOCCWWA">Full Papers</h3>
												<p class="astro-NMOCCWWA">Abstract due by 18 January 2023</p>
											</div>
										</a>
									</div>
								
								<div class="box astro-NMOCCWWA">
									<a class="none astro-NMOCCWWA" href="">
											<div class="astro-NMOCCWWA">
												<img src="Courses.svg" alt="" class="astro-NMOCCWWA">
											</div>
											
											<div class="sub-details astro-NMOCCWWA">
												<h3 class="astro-NMOCCWWA">Courses</h3>
											</div>
										</a>
								</div>
								<div class="box astro-NMOCCWWA">
									<a class="none astro-NMOCCWWA" href="">
										<div class="astro-NMOCCWWA">
											<img src="Workshops.svg" alt="" class="astro-NMOCCWWA">
										</div>
										
										<div class="sub-details astro-NMOCCWWA">
											<h3 class="astro-NMOCCWWA">Workshops</h3>
										</div>
									</a>
								</div>
							</div>
						</div>

						<!-- April Submissions -->

						<div class="sub-types astro-NMOCCWWA">
							<h3 class="astro-NMOCCWWA">Submissions by 19 April 2023</h3>
							<div class="selection astro-NMOCCWWA">
								
									<div class="box astro-NMOCCWWA">
										<a class="none astro-NMOCCWWA" href="">
											<div class="astro-NMOCCWWA">
												<img src="Short Papers.svg" alt="" class="astro-NMOCCWWA">
											</div>
											
											<div class="sub-details astro-NMOCCWWA">
												<h3 class="astro-NMOCCWWA">Short Papers</h3>
												<p class="astro-NMOCCWWA">Abstract due by 18 January 2023</p>
											</div>
										</a>
									</div>
								
								<div class="box astro-NMOCCWWA">
									<a class="none astro-NMOCCWWA" href="">
											<div class="astro-NMOCCWWA">
												<img src="Posters.svg" alt="" class="astro-NMOCCWWA">
											</div>
											
											<div class="sub-details astro-NMOCCWWA">
												<h3 class="astro-NMOCCWWA">Posters</h3>
											</div>
										</a>
								</div>
								<div class="box astro-NMOCCWWA">
									<a class="none astro-NMOCCWWA" href="">
										<div class="astro-NMOCCWWA">
											<img src="Panels.svg" alt="" class="astro-NMOCCWWA">
										</div>
										
										<div class="sub-details astro-NMOCCWWA">
											<h3 class="astro-NMOCCWWA">Panels</h3>
										</div>
									</a>
								</div>
							</div>
								
							<div class="selection astro-NMOCCWWA">

								<div class="box astro-NMOCCWWA">
									<a class="none astro-NMOCCWWA" href="">
										<div class="astro-NMOCCWWA">
											<img src="Interactive Demos.svg" alt="" class="astro-NMOCCWWA">
										</div>
										
										<div class="sub-details astro-NMOCCWWA">
											<h3 class="astro-NMOCCWWA">Interactive Demos</h3>
										</div>
									</a>
								</div>

								<div class="box astro-NMOCCWWA">
									<a class="none astro-NMOCCWWA" href="">
										<div class="astro-NMOCCWWA">
											<img src="PhD.svg" alt="" class="astro-NMOCCWWA">
										</div>
										
										<div class="sub-details astro-NMOCCWWA">
											<h3 class="astro-NMOCCWWA">Doctoral Consortium</h3>
										</div>
									</a>
								</div>

								<div class="box astro-NMOCCWWA">
									<a class="none astro-NMOCCWWA" href="">
										<div class="astro-NMOCCWWA">
											<img src="Industrial Experiences.svg" alt="" class="astro-NMOCCWWA">
										</div>
										
										<div class="sub-details astro-NMOCCWWA">
											<h3 class="astro-NMOCCWWA">Industrial Experiences</h3>
										</div>
									</a>
								</div>
							</div>
						</div>
						
					

					<div class="center astro-NMOCCWWA">
						<button class="sub-types button-padding astro-NMOCCWWA" href="">
							<h2 class="astro-NMOCCWWA">View All</h2>
						</button>
					</div>
				
				</div>
						
				<p class="center astro-NMOCCWWA">
					All contributions are peer reviewed, juried or curated by the members of the INTERACT Programme
 					Committee and specialist SubCommittees.
				</p>
				
			</section>

			<section class="cfp-content-3 astro-NMOCCWWA">

				<h1 class="thin astro-NMOCCWWA">
					THEME:
				</h1>
				<h1 class="bold-title astro-NMOCCWWA">
					JUSTICE AND EQUALITY
				</h1>

				<p class="astro-NMOCCWWA">
					The INTERACT Conference welcomes submissions on all aspects of human-computer interaction, but for this conference will particularly welcome papers on issues related to justice and equality, for example:
				</p>

				<div class="home-list astro-NMOCCWWA">

					<div class="list-line astro-NMOCCWWA"></div>

					<div class="home-list-items astro-NMOCCWWA">
						<h3 class="astro-NMOCCWWA">
							HCI to support sustainable development 
						</h3>

						<h3 class="astro-NMOCCWWA">
							HCI to support reduction in food waste, water and energy use
						</h3>

						<h3 class="astro-NMOCCWWA">
							HCI to support freedom of expression 
						</h3>

						<h3 class="astro-NMOCCWWA">
							Consideration of gender, sexuality and ethnic diversity in HCI 
						</h3>

						<h3 class="astro-NMOCCWWA">
							HCI and inclusion of disabled and older people
						</h3>

						<h3 class="astro-NMOCCWWA">
							HCI countering adversity
						</h3>
					</div>
				</div>

				<button class="read-more astro-NMOCCWWA">
					Read More >
				</button>

			</section>

			<section class="cfp-content-4 astro-NMOCCWWA">

				<h1 class="bold-title astro-NMOCCWWA">
					JURIES
				</h1>

				<content class="juries-section astro-NMOCCWWA">

					<h4 class="astro-NMOCCWWA">
						General Co-Chairs
					</h4>
					
					<div class="juries-details astro-NMOCCWWA">
						<div class="profile astro-NMOCCWWA">

							<img src="" alt="" width="200px" height="200px" class="astro-NMOCCWWA">

							<div class="text-details astro-NMOCCWWA">
								<h4 class="astro-NMOCCWWA">
									Paolo Buono
								</h4>
								<p class="astro-NMOCCWWA">
									University of Bari Aldo Moro, Italy
								</p>
							</div>
						</div>
					

					<div class="profile astro-NMOCCWWA">

						<img src="" alt="" width="200px" height="200px" class="astro-NMOCCWWA">

						<div class="text-details astro-NMOCCWWA">
							<h4 class="astro-NMOCCWWA">
								Paolo Buono
							</h4>
							<p class="astro-NMOCCWWA">
								University of Bari Aldo Moro, Italy
							</p>
						</div>
					</div>

					

					</div>
				</content>

				<content class="juries-section astro-NMOCCWWA">

					<h4 class="astro-NMOCCWWA">
						Technical Programme Co-Chairs
					</h4>
					
					<div class="juries-details astro-NMOCCWWA">
						<div class="profile astro-NMOCCWWA">

							<img src="" alt="" width="200px" height="200px" class="astro-NMOCCWWA">

							<div class="text-details astro-NMOCCWWA">
								<h4 class="astro-NMOCCWWA">
									Paolo Buono
								</h4>
								<p class="astro-NMOCCWWA">
									University of Bari Aldo Moro, Italy
								</p>
							</div>
						</div>
					

					<div class="profile astro-NMOCCWWA">

						<img src="" alt="" width="200px" height="200px" class="astro-NMOCCWWA">

						<div class="text-details astro-NMOCCWWA">
							<h4 class="astro-NMOCCWWA">
								Paolo Buono
							</h4>
							<p class="astro-NMOCCWWA">
								University of Bari Aldo Moro, Italy
							</p>
						</div>
					</div>

					<div class="profile astro-NMOCCWWA">

						<img src="" alt="" width="200px" height="200px" class="astro-NMOCCWWA">

						<div class="text-details astro-NMOCCWWA">
							<h4 class="astro-NMOCCWWA">
								Paolo Buono
							</h4>
							<p class="astro-NMOCCWWA">
								University of Bari Aldo Moro, Italy
							</p>
						</div>
					</div>
					</div>
				</content>

			</section>

			
			
		</content>
		
	</main>${renderComponent($$result, "Footer", $$Footer, { "class": "astro-NMOCCWWA" })}` })}`;
});

const $$file = "D:/interact-2023-anew-fixed/my-astro-site/interact-2023-no-backend/src/pages/cfp.astro";
const $$url = "/cfp";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$Cfp,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/submissions/[id].astro', _page1],['src/pages/anonymity.astro', _page2],['src/pages/contact.astro', _page3],['src/pages/awards.astro', _page4],['src/pages/venue.astro', _page5],['src/pages/cfp.astro', _page6],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.slice(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/index.6dabcd8d.css","assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css","assets/anonymity-awards-cfp-contact-index-venue.e74cbad0.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/submissions-_id_.66365d59.css","assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css"],"scripts":[],"routeData":{"route":"/submissions/[id]","type":"page","pattern":"^\\/submissions\\/([^/]+?)\\/?$","segments":[[{"content":"submissions","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/submissions/[id].astro","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/anonymity.bc01999d.css","assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css","assets/anonymity-awards-cfp-contact-index-venue.e74cbad0.css"],"scripts":[],"routeData":{"route":"/anonymity","type":"page","pattern":"^\\/anonymity\\/?$","segments":[[{"content":"anonymity","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/anonymity.astro","pathname":"/anonymity","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/contact.71063c4c.css","assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css","assets/anonymity-awards-cfp-contact-index-venue.e74cbad0.css"],"scripts":[],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/awards.3bb83d22.css","assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css","assets/anonymity-awards-cfp-contact-index-venue.e74cbad0.css"],"scripts":[],"routeData":{"route":"/awards","type":"page","pattern":"^\\/awards\\/?$","segments":[[{"content":"awards","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/awards.astro","pathname":"/awards","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/venue.afb8839c.css","assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css","assets/anonymity-awards-cfp-contact-index-venue.e74cbad0.css"],"scripts":[],"routeData":{"route":"/venue","type":"page","pattern":"^\\/venue\\/?$","segments":[[{"content":"venue","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/venue.astro","pathname":"/venue","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/cfp.04c5468f.css","assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css","assets/anonymity-awards-cfp-contact-index-venue.e74cbad0.css"],"scripts":[],"routeData":{"route":"/cfp","type":"page","pattern":"^\\/cfp\\/?$","segments":[[{"content":"cfp","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cfp.astro","pathname":"/cfp","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/src/components/Submissions":"Submissions.6e207700.js","@astrojs/react/client.js":"client.c1f8ef3f.js","astro:scripts/before-hydration.js":"data:text/javascript;charset=utf-8,//[no before-hydration script]"},"assets":["/assets/AtkinsonHyperlegible-Regular.4025b07a.ttf","/assets/AtkinsonHyperlegible-Bold.1e4c7d45.ttf","/assets/SYNCOPATE-REGULAR.45fb5635.ttf","/assets/syncopate-bold.de482d4a.ttf","/assets/anonymity.bc01999d.css","/assets/anonymity-awards-cfp-contact-index-submissions-_id_-venue.5df5fa32.css","/assets/anonymity-awards-cfp-contact-index-venue.e74cbad0.css","/assets/awards.3bb83d22.css","/assets/cfp.04c5468f.css","/assets/contact.71063c4c.css","/assets/index.6dabcd8d.css","/assets/submissions-_id_.66365d59.css","/assets/venue.afb8839c.css","/AtkinsonHyperlegible-Bold.ttf","/AtkinsonHyperlegible-BoldItalic.ttf","/AtkinsonHyperlegible-Italic.ttf","/AtkinsonHyperlegible-Regular.ttf","/client.c1f8ef3f.js","/Courses.svg","/email 1.svg","/facebook 1.svg","/favicon.svg","/Full Papers.svg","/Industrial Experiences.svg","/Interact-2023-logo-full.svg","/Interactive Demos.svg","/linkedin 1.svg","/location.svg","/Logo.svg","/One-Planet.png","/Panels.svg","/PDF.png","/pdf.svg","/PhD.svg","/Polygon 1.svg","/Posters.svg","/RCH.jpg","/Short Papers.svg","/Submissions.6e207700.js","/syncopate-bold.ttf","/SYNCOPATE-REGULAR.ttf","/uoy-logo.png","/Workshops.svg","/YHRC.png","/zero-emissions.svg","/assets/submissions.29e51ba1.css","/chunks/index.2843b2c3.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler };

import { useEffect } from "react";
import { swapTerms } from "@/data/nexusTerms";
import { swapRathbonesTerms } from "@/data/rathbonesTerms";
import { useOrganisation, type OrgId } from "@/hooks/use-organisation";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE"]);
const ATTRS = ["placeholder", "aria-label", "title", "alt"];

/** Subtrees marked with data-org-raw always render their literal content. */
function isExempt(node: Node): boolean {
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return !!el?.closest("[data-org-raw]");
}

function makeSwapper(org: OrgId) {
  const transform =
    org === "nexus" ? swapTerms : org === "rathbones" ? swapRathbonesTerms : null;
  if (!transform) return null;

  function swapNode(node: Node) {
    if (isExempt(node)) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent && SKIP_TAGS.has(parent.tagName)) return;
      const original = node.nodeValue ?? "";
      const next = transform!(original);
      if (next !== original) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;
    if (SKIP_TAGS.has(el.tagName)) return;

    for (const attr of ATTRS) {
      const value = el.getAttribute(attr);
      if (value) {
        const next = transform!(value);
        if (next !== value) el.setAttribute(attr, next);
      }
    }

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (isExempt(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const texts: Text[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode as Text);
    texts.forEach(swapNode);

    el.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(",")).forEach((child) => {
      if (isExempt(child)) return;
      for (const attr of ATTRS) {
        const value = child.getAttribute(attr);
        if (value) {
          const next = transform!(value);
          if (next !== value) child.setAttribute(attr, next);
        }
      }
    });
  }

  return swapNode;
}

/**
 * While Nexus or Rathbones is active, rewrites CVS Health / healthcare
 * specific wording in the rendered UI to the active organisation's equivalent.
 * Completely inert when CVS Health is the active organisation.
 */
export function OrgTextSwap() {
  const { org } = useOrganisation();

  useEffect(() => {
    const swapNode = makeSwapper(org);
    if (!swapNode) return;

    const root = document.body;
    swapNode(root);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") {
          swapNode(record.target);
        } else if (record.type === "attributes") {
          swapNode(record.target);
        } else {
          record.addedNodes.forEach(swapNode);
        }
      }
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });

    return () => observer.disconnect();
  }, [org]);

  return null;
}

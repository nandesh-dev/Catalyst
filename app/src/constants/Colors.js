import { useState, useEffect } from "react";

export const Colors = {
  secondary: {
    slate: {
      950: "var(--slate-950)",
      900: "var(--slate-900)",
      800: "var(--slate-800)",
      700: "var(--slate-700)",
      600: "var(--slate-600)",
      200: "var(--slate-200)",
      100: "var(--slate-100)",
    },
    bright: "var(--bright)",
  },
  primary: {
    red: "var(--red)",
    orange: "var(--orange)",
    yellow: "var(--yellow)",
    green: "var(--green)",
    cyan: "var(--cyan)",
    sky: "var(--sky)",
    blue: "var(--blue)",
    purple: "var(--purple)",
    pink: "var(--pink)",
  },
};

/**
 * @returns {Colors}
 */
export function useComputedColors() {
  let computeColors = (obj) => {
    let computedColors = {};
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        computedColors[key] = computeColors(obj[key]);
      } else {
        computedColors[key] = getComputedStyle(
          document.documentElement,
        ).getPropertyValue(obj[key].substring(4, obj[key].length - 1));
      }
    }

    return computedColors;
  };

  let [computedColors, setComputedColors] = useState(computeColors(Colors));

  useEffect(() => {
    let mql = window.matchMedia("(prefers-color-scheme: dark)");
    let eventListener = () => {
      setComputedColors(computeColors(Colors));
    };
    mql.addEventListener("change", eventListener);

    return () => {
      mql.removeEventListener("change", eventListener);
    };
  }, []);

  return computedColors;
}

export const HTMLColorMap = {
  html: "var(--blue)",
  head: "var(--cyan)",
  title: "var(--purple)",
  meta: "var(--pink)",
  link: "var(--pink)",
  style: "var(--sky)",
  script: "var(--red)",
  body: "var(--green)",
  header: "var(--cyan)",
  nav: "var(--orange)",
  main: "var(--blue)",
  section: "var(--yellow)",
  article: "var(--sky)",
  aside: "var(--pink)",
  footer: "var(--cyan)",
  h1: "var(--red)",
  h2: "var(--orange)",
  h3: "var(--yellow)",
  h4: "var(--green)",
  h5: "var(--cyan)",
  h6: "var(--sky)",
  p: "var(--blue)",
  a: "var(--purple)",
  ul: "var(--pink)",
  ol: "var(--pink)",
  li: "var(--purple)",
  dl: "var(--purple)",
  dt: "var(--cyan)",
  dd: "var(--sky)",
  table: "var(--blue)",
  caption: "var(--purple)",
  thead: "var(--green)",
  tbody: "var(--sky)",
  tfoot: "var(--cyan)",
  tr: "var(--pink)",
  th: "var(--orange)",
  td: "var(--yellow)",
  col: "var(--red)",
  colgroup: "var(--purple)",
  div: "var(--green)",
  span: "var(--yellow)",
  img: "var(--cyan)",
  iframe: "var(--sky)",
  embed: "var(--pink)",
  object: "var(--purple)",
  param: "var(--pink)",
  video: "var(--red)",
  audio: "var(--orange)",
  source: "var(--sky)",
  track: "var(--pink)",
  canvas: "var(--green)",
  map: "var(--yellow)",
  area: "var(--sky)",
  svg: "var(--purple)",
  math: "var(--red)",
  form: "var(--blue)",
  fieldset: "var(--cyan)",
  legend: "var(--sky)",
  label: "var(--pink)",
  input: "var(--green)",
  button: "var(--orange)",
  select: "var(--yellow)",
  datalist: "var(--sky)",
  optgroup: "var(--purple)",
  option: "var(--pink)",
  textarea: "var(--green)",
  keygen: "var(--cyan)",
  output: "var(--yellow)",
  progress: "var(--orange)",
  meter: "var(--pink)",
  details: "var(--blue)",
  summary: "var(--cyan)",
  menu: "var(--yellow)",
  menuitem: "var(--pink)",
  dialog: "var(--red)",
};

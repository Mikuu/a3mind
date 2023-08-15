import {flattenNodeData} from "@/utils/dataUtils";

export const fontSizes = [10, 15, 24, 32];
export const fontWeights = ['normal', 'bold', 'lighter'];
export const textDecorations = ['none', 'underline', 'overline', 'line-through'];
export const getDefaultNodeStyle = () => {
  return {
    color: '#777777',
    background: '#F6F6F6',
    fontSize: 15,
    fontWeight: 'normal',
    textDecoration: 'none',
  }
}

export const setStyleProperty = (currentStyle, property, value) => {
  const currentStyleObj = currentStyle
    .split(';')
    .map(style => style.trim())
    .filter(style => style !== '')
    .reduce((styleObj, style) => {
      const [prop, val] = style.split(':').map(s => s.trim());
      styleObj[prop] = val;
      return styleObj;
    }, {});

  currentStyleObj[property] = value;

  return Object.keys(currentStyleObj)
    .map(prop => `${prop}: ${currentStyleObj[prop]}`)
    .join('; ');
};

export const makeStyleString = (styleObj) => {
  const stylePairs = Object.entries(styleObj).map(([property, value]) => {
    const cssProperty = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    if (cssProperty === 'font-size') {
      return `${cssProperty}: ${value}px`;
    }
    return `${cssProperty}: ${value}`;
  });

  return stylePairs.join('; ');
};

export const checkAndAddDefaultNodeProperties = flattedNodes => {
  const defaultStyle = getDefaultNodeStyle();
  const defaultNodeType = "general";

  const processedNodes = flattedNodes.map(node => {
    if (node.root) return node;

    if (!node.style || Object.keys(node.style).length === 0) {
      node.style = { ...defaultStyle };
    }

    if (!node.nodeType || typeof node.nodeType !== "string") {
      node.nodeType = defaultNodeType;
    }

    return node;
  });

  return processedNodes;
};


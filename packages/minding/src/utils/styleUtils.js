export const fontSizes = [10, 15, 24, 32];
export const fontWeights = ['normal', 'bold', 'lighter'];
export const textDecorations = ['none', 'underline', 'overline', 'line-through'];
export const getDefaultNodeStyle = () => {
  return {
    color: '#777777',
    background: '#FFFFFF',
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

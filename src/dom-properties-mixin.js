export const DOMProperties = (SuperClass) => class extends SuperClass {

  constructor() {
    super();
    this.constructor.__saveInitialAttributeValues.call(this);
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.constructor.__setInitialAttributeValues.call(this);
  }

  static get observedAttributes() {
    const observedAttributes = [];
    const DOMProps = this.DOMProperties || [];
    for(let i in DOMProps) observedAttributes.push((this.propertyAttributeNames || {})[DOMProps[i]] || DOMProps[i].toLowerCase());
    return observedAttributes;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if(oldValue === newValue) return;
    const propName = this.constructor.__getPropertyNameByAttributeName.call(this, attrName);
    if(!propName) return;
    this.constructor.__setDOMProperty.call(this, propName, oldValue, this.getAttribute(attrName));
  }

  static __saveInitialAttributeValues() {
    const attrValues = new Map();
    this.getAttributeNames().map(attrName => attrValues.set(attrName, this.getAttribute(attrName)));
    this.__initialAttributeValues = attrValues;
  }

  static __setInitialAttributeValues() {
    const attrValues = this.__initialAttributeValues;
    attrValues.forEach((val, attrName) => this.setAttribute(attrName, val));
  }

  static __getPropertyNameByAttributeName(attrName) {
    const attributeNames = this.constructor.propertyAttributeNames;
    for(let propName in attributeNames) if(attributeNames[propName] === attrName) return propName;
    const DOMPropertyNames = this.constructor.DOMProperties || [];
    for(let i in DOMPropertyNames) if(DOMPropertyNames[i].toLowerCase() === attrName) return DOMPropertyNames[i];
  }

  static __setDOMProperty(propName, oldValue, value) {
    const converters = this.constructor.propertyFromAttributeConverters || {};
    const converter = converters[propName];
    if(converter) value = converter.call(this, oldValue, value);
    this[propName] = value;
  }

};
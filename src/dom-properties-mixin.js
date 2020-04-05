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
    this.constructor.__setDOMProperty.call(this, propName, this[propName], newValue);
  }

  static __saveInitialAttributeValues() {
    const attrValues = new Map();
    const attributes = Array.from(this.attributes);
    for(var i in attributes) attrValues.set(attributes[i], this.getAttribute(attributes[i]))
    this.__initialAttributeValues = attrValues;
  }

  static __setInitialAttributeValues() {
    const attrValues = this.__initialAttributeValues;
    attrValues.forEach((val, attrName) => {
      if(val !== null) this.setAttribute(attrName, val)
    })
  }

  static __getPropertyNameByAttributeName(attrName) {
    const attributeNames = this.constructor.propertyAttributeNames;
    for(let propName in attributeNames) if(attributeNames[propName] === attrName) return propName;
    const DOMPropertyNames = this.constructor.DOMProperties || [];
    for(let i in DOMPropertyNames) if(DOMPropertyNames[i].toLowerCase() === attrName) return DOMPropertyNames[i];
  }

  static __setDOMProperty(propName, oldValue, newValue) {
    const converters = this.constructor.propertyFromAttributeConverters || {};
    const converter = converters[propName];
    if(converter) newValue = converter.call(this, oldValue, newValue);
    this[propName] = newValue;
  }

};
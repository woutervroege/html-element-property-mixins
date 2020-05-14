export const ReflectedProperties = (SuperClass) => class extends SuperClass {

  connectedCallback() {
    super.connectedCallback();
    for(var i in this.constructor.reflectedProperties) {
      const propName = this.constructor.reflectedProperties[i];
      const attrName = this.constructor.__getAttributeNameByPropertyName.call(this, propName);
      this.constructor.__setDOMAttribute.call(this, attrName, propName, this[propName]);
    }
  }

  propertyChangedCallback(propName, oldValue, newValue) {
    super.propertyChangedCallback && super.propertyChangedCallback(propName, oldValue, newValue);
    if(!this.isConnected) return;

    const reflectedProps = this.constructor.reflectedProperties || {};
    const attrReflects = reflectedProps.indexOf(propName) !== -1;
    if(!attrReflects) return;
    
    const attrName = this.constructor.__getAttributeNameByPropertyName.call(this, propName);
    this.constructor.__setDOMAttribute.call(this, attrName, propName, newValue);
  }

  static __setDOMAttribute(attrName, propName, value) {
    const converters = this.constructor.propertyToAttributeConverters || {};
    const converter = converters[propName];
    if(converter) value = converter.call(this, value)
    if(value === null || value === undefined) return this.removeAttribute(attrName);
    this.setAttribute(attrName, value);
  }

  static __getAttributeNameByPropertyName(propName) {
    const reflectedProps = this.constructor.reflectedProperties || [];
    const attrNames = this.constructor.propertyAttributeNames || {};
    if(reflectedProps.indexOf(propName) === -1) return;
    const attrName = attrNames[propName] || propName.toLowerCase();
    return attrName;
  }

};
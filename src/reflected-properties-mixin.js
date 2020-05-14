export const ReflectedProperties = (SuperClass) => class extends SuperClass {

  propertyChangedCallback(propName, oldValue, newValue) {
    super.propertyChangedCallback && super.propertyChangedCallback(propName, oldValue, newValue);
    const reflectedProps = this.constructor.reflectedProperties || {};
    const attrReflects = reflectedProps.indexOf(propName) !== -1;
    if(!attrReflects) return;
    const attrName = this.constructor.__getAttributeNameByPropertyName.call(this, propName);
    if(!this.isConnected) return;
    if(!this.constructor.__propertiesInited) return;
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
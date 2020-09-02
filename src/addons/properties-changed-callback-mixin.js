export const PropertiesChangedCallback = (SuperClass) => class extends SuperClass {
  
  propertyChangedCallback(propName, oldValue, newValue) {
    super.propertyChangedCallback && super.propertyChangedCallback(propName, oldValue, newValue);
    if(!this.__changedProperties) this.__changedProperties = new Map();
    this.constructor.__addChangedProperty.call(this, propName, oldValue);
  }

  static __addChangedProperty(propName, oldValue) {
    if(!this.__changedProperties.has(propName)) this.__changedProperties.set(propName, oldValue);
    window.requestAnimationFrame(this.constructor.__invokeCallback.bind(this));
  }

  static __invokeCallback() {
    if(this.__changedProperties.size === 0) return;
    const oldValues = {};
    const newValues = {};
    this.__changedProperties.forEach((oldValue, propName) => oldValues[propName] = oldValue);
    this.__changedProperties.forEach((oldValue, propName) => newValues[propName] = this[propName]);
    const propNames = Object.keys(oldValues);

    this.__changedProperties.clear();
    this.propertiesChangedCallback && this.propertiesChangedCallback(propNames, oldValues, newValues);
  }

};
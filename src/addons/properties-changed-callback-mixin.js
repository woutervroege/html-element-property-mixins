export const PropertiesChangedCallback = (SuperClass) => class extends SuperClass {
  
  propertyChangedCallback(propName, oldValue, newValue) {
    super.propertyChangedCallback && super.propertyChangedCallback(propName, oldValue, newValue);
    if(!this.__changedProperties) this.__changedProperties = new Map();
    this.constructor.__addChangedProperty.call(this, propName, oldValue);
  }

  static __addChangedProperty(propName, oldValue) {
    window.cancelAnimationFrame(this.__propertiesChangedCallbackDebouncer);
    const changedProps = this.__changedProperties;
    if(!changedProps.has(propName)) changedProps.set(propName, oldValue);
    this.__propertiesChangedCallbackDebouncer = window.requestAnimationFrame(this.constructor.__invokeCallback.bind(this));
  }

  static __invokeCallback() {
    const oldValues = {};
    const newValues = {};
    this.__changedProperties.forEach((oldValue, propName) => oldValues[propName] = oldValue);
    this.__changedProperties.forEach((oldValue, propName) => newValues[propName] = this[propName]);
    const propNames = Object.keys(oldValues);

    this.__changedProperties.clear();
    this.propertiesChangedCallback && this.propertiesChangedCallback(propNames, oldValues, newValues);
  }

};
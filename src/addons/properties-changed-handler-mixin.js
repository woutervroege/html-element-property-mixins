export const PropertiesChangedHandler = (SuperClass) => class extends SuperClass {
  
  propertiesChangedCallback(propNames, oldValues, newValues) {
    super.propertiesChangedCallback && super.propertiesChangedCallback(propNames, oldValues, newValues);
    this.constructor.__callMultiPropertyHandlers.call(this, propNames);
  }

  static __callMultiPropertyHandlers(propNames) {
    const callMethods = new Map();
    const handlers = this.constructor.propertiesChangedHandlers || {};
    for(let i in propNames) {
      for(let methodName in handlers) {
        const handlerPropNames = handlers[methodName];
        if(handlerPropNames.indexOf(propNames[i]) !== -1) callMethods.set(methodName, handlerPropNames);
      }
    }
    callMethods.forEach((props, methodName) => this[methodName].call(this, ...[...props.map(propName => this[propName])]));
  }

  static get propertiesChangedHandlers() { return {}; }

};
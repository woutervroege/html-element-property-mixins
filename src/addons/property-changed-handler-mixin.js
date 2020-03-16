export const PropertyChangedHandler = (SuperClass) => class extends SuperClass {
  
  propertyChangedCallback(propName, oldValue, newValue) {
    super.propertyChangedCallback && super.propertyChangedCallback(propName, oldValue, newValue);
    this.constructor.__callPropertyHandlers.call(this, propName, oldValue, newValue);
  }

  static __callPropertyHandlers(propName, oldValue, newValue) {
    const handlers = this.constructor.propertyChangedHandlers || {};
    const handler = handlers[propName];
    if(!handler || !handler.constructor) return;
    if(handler.constructor.name === 'Function') handler.call(this, oldValue, newValue);
    else if(handler.constructor.name === 'String' && this[handler]) return this[handler].call(this, oldValue, newValue);
  }
   
};
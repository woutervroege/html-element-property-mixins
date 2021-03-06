export const ObservedProperties = (SuperClass) => class extends SuperClass {

  constructor() {
    super();
    this.constructor.__saveInitialPropertyValues.call(this);
    this.constructor.__initProperties.call(this);
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.constructor.__setInitialPropertyValues.call(this);
  }

  static __saveInitialPropertyValues() {
    this.__initialPropertyValues = new Map();
    (this.constructor.observedProperties || []).map(propName => this.__initialPropertyValues.set(propName, this[propName]));
  }

  static __setInitialPropertyValues() {
    this.__initialPropertyValues.forEach((val, propName) => {
      if(val !== undefined && this[propName] === undefined) this[propName] = val;
    });
  }

  static __initProperties() {
    this.constructor.__propertyAccessors = {};
    const observedProps = this.constructor.observedProperties || [];
    observedProps.map(propName => this.constructor.__initProperty.call(this, propName));
  }

  static __initProperty(propName) {
    this.constructor.__propertyAccessors[propName] = this.__getPropertyDescriptor(propName);
    Object.defineProperty(this, propName, {      
      set(val) { this.constructor.__setProperty.call(this, propName, val); },
      get() { return this.constructor.__getProperty.call(this, propName); },
    });
  }

  static __getProperty(propName) {
    const customAccessors = this.constructor.__propertyAccessors[propName] || {};
    if(customAccessors.get) return customAccessors.get.call(this, propName);
    return this[`#${propName}`];
  }

  static __setProperty(propName, newValue) {
    const customAccessors = this.constructor.__propertyAccessors[propName] || {};
    const oldValue = this[propName];
    if(customAccessors.set) customAccessors.set.call(this, newValue);
    else this[`#${propName}`] = newValue;  
    this.constructor.__propertyValueChanged.call(this, propName, oldValue, this[propName]);
  }
  
  static __propertyValueChanged(propName, oldValue, newValue) {
    if(oldValue === newValue) return;
    this.propertyChangedCallback && this.propertyChangedCallback(propName, oldValue, newValue);
  }

  __getPropertyDescriptor(key) {
    const values = [];
    var obj = this;
    while(obj) {
      if(Object.getOwnPropertyDescriptor(obj, key)) values.push(Object.getOwnPropertyDescriptor(obj, key));
      obj = Object.getPrototypeOf(obj);
    }
    const getter = values.find(item => item.get);
    const setter = values.find(item => item.set);
    const value = values.find(item => item.value);
    return {get: getter?.get, set: setter?.set, value: value?.value};
  }

};
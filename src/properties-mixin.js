import { ObservedProperties } from './observed-properties-mixin.js';
import { DOMProperties } from './dom-properties-mixin.js';
import { ReflectedProperties } from './reflected-properties-mixin.js';

export const Properties = (SuperClass) => class extends ReflectedProperties(DOMProperties(ObservedProperties(SuperClass))) {

  static get properties() { return {}; }

  static get observedProperties() {
    return Object.keys(this.__getFilteredProperties.call(this, 'observe', true));
  }

  static get DOMProperties() {
    return Object.keys(this.__getFilteredProperties.call(this, 'DOM', true));
  }

  static get reflectedProperties() {
    return Object.keys(this.__getFilteredProperties.call(this, 'reflect', true));
  }

  static get propertyChangedHandlers() {
    return this.__getPropertyValues.call(this, 'changedHandler');
  }

  static get propertyAttributeNames() {
    const propValues = {};
    const props = this.properties;
    for(let propName in props) propValues[propName] = props[propName]['attributeName'] || propName.toLowerCase();
    return propValues;
  }

  static get propertyToAttributeConverters() {
    return this.__getPropertyValues.call(this, 'toAttributeConverter');
  }

  static get propertyFromAttributeConverters() {
    return this.__getPropertyValues.call(this, 'fromAttributeConverter');
  }

  static __getFilteredProperties(key, value) {
    const filteredProps = {};
    const props = this.properties;
    for(let propName in props) if(props[propName][key] === value) filteredProps[propName] = props[propName];
    return filteredProps;
  }

  static __getPropertyValues(key) {
    const propValues = {};
    const props = this.properties;
    for(let propName in props) propValues[propName] = props[propName][key];
    return propValues;
  }

};
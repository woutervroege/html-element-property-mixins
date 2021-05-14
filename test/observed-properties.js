import { ObservedProperties } from '../src/observed-properties-mixin.js';

describe('default', () => {
    
  const elementName = generateElementName();

  customElements.define(elementName, class extends ObservedProperties(HTMLElement) {
    static get observedProperties() { return ['name']; }
    propertyChangedCallback(propName, oldValue, newValue) {
      this._propertyChangedCallbackInvoked = true;
      if(!this._changedProps) this._changedProps = {};
      this._changedProps[propName] = arguments;
    }
  });

  const el = document.createElement(elementName);

  it('propertyChangedCallback should invoke when property declared in `observedProperties` array changes.', () => {
    el.name = 'Giacomo';
    chai.expect(el._propertyChangedCallbackInvoked).to.equal(true);
  });

  it('propertyChangedCallback should have propname, old value and new value in arguments', () => {  
    chai.expect(el._changedProps.name[0]).to.equal('name');
    chai.expect(el._changedProps.name[1]).to.equal(undefined);
    chai.expect(el._changedProps.name[2]).to.equal('Giacomo');
  });

});

describe('custom getter', () => {
    
  const elementName = generateElementName();

  customElements.define(elementName, class extends ObservedProperties(HTMLElement) {
    static get observedProperties() { return ['name']; }

    get name() {
      return (this['#name'] || '').toLowerCase();
    }
    
    propertyChangedCallback(propName, oldValue, newValue) {
      this._propertyChangedCallbackInvoked = true;
      if(!this._changedProps) this._changedProps = {};
      this._changedProps[propName] = arguments;
    }
  });

  const el = document.createElement(elementName);

  it('propertyChangedCallback should invoke when property declared in `observedProperties` array changes.', () => {
    el.name = 'Giacomo';
    chai.expect(el._propertyChangedCallbackInvoked).to.equal(true);
  });

  it('propertyChangedCallback should have propname, old value and new value (getter return value) in arguments', () => {  
    chai.expect(el._propertyChangedCallbackInvoked).to.equal(true);
    chai.expect(el._changedProps.name[2]).to.equal('giacomo');
  });

});

describe('custom setter', () => {
    
  const elementName = generateElementName();

  customElements.define(elementName, class extends ObservedProperties(HTMLElement) {
    static get observedProperties() { return ['name']; }

    set name(name) {
      this['#name'] = name.toUpperCase();
    }
    
    propertyChangedCallback(propName, oldValue, newValue) {
      this._propertyChangedCallbackInvoked = true;
      if(!this._changedProps) this._changedProps = {};
      this._changedProps[propName] = arguments;
    }
  });

  const el = document.createElement(elementName);

  it('propertyChangedCallback should invoke when property declared in `observedProperties` array changes.', () => {
    el.name = 'Giacomo';
    chai.expect(el._propertyChangedCallbackInvoked).to.equal(true);
  });

  it('propertyChangedCallback should have propname, old value and new value (setter return value) in arguments', () => {  
    chai.expect(el._changedProps.name[2]).to.equal('GIACOMO');
  });

});

function generateElementName() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < 16; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `${result}-element`;
} 
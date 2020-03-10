import { ObservedProperties } from '../src/observed-properties-mixin.js';
import { ReflectedProperties } from '../src/reflected-properties-mixin.js';

describe('default', async () => {
    
  const elementName = generateElementName();

  customElements.define(elementName, class extends ReflectedProperties(ObservedProperties(HTMLElement)) {
    static get observedProperties() { return ['name']; }
    static get reflectedProperties() { return ['name']; }
  });

  const el = document.createElement(elementName);

  it('propertyChangedCallback should invoke when property declared in `observedProperties` array changes.', async () => {
    document.body.appendChild(el);
    el.name = 'Giacomo';
    chai.expect(el.getAttribute('name')).to.equal(el.name);
  });

})

function generateElementName() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < 16; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `${result}-element`;
} 
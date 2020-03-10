import { DOMProperties } from '../src/dom-properties-mixin.js';

describe('default', async () => {
    
  const elementName = generateElementName();

  customElements.define(elementName, class extends DOMProperties(HTMLElement) {
    static get DOMProperties() { return ['name']; }
  });

  const el = document.createElement(elementName);

  it('propertyChangedCallback should invoke when property declared in `DOMProperties` array changes.', async () => {
    el.setAttribute('name', 'Giacomo');
    chai.expect(el.name).to.equal('Giacomo');
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
const template = document.createElement('template');
  template.innerHTML = `
    <style>
      * {
        font-size: 200%;
      }

      span {
        width: 4rem;
        display: inline-block;
        text-align: center;
      }

      button {
        width: 4rem;
        height: 4rem;
        border: none;
        border-radius: 10px;
        background-color: seagreen;
        color: white;
      }
    </style>
    <button id="dec">-</button>
    <span id="count"></span>
    <button id="inc">+</button>`;

import { ObservedProperties } from '../src/observed-properties-mixin.js';

class MyCounter extends ObservedProperties(HTMLElement) {

  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedProperties() {
    return ['count'];
  }

  propertyChangedCallback() {
    this.update();
  }

  connectedCallback() {
    this.update();
    this.shadowRoot.getElementById('inc').onclick = () => this.count++;
    this.shadowRoot.getElementById('dec').onclick = () => this.count--;
  }

  update() {
    if(this.shadowRoot) this.shadowRoot.getElementById('count').innerHTML = this.count;
  }
}

customElements.define('my-counter', MyCounter);
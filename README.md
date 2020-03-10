# # html-element-property-mixins

## Installation

```bash
$ npm install html-element-property-mixins
```

## Introduction
`html-element-property-mixins` is a collection of mixins extending `HTMLElement` with properties, powering custom elements.

1. **[ObservedProperties](#ObservedProperties)** enables observed properties (just like built-in `observedAttributes`).
2. **[DOMProperties](#DOMProperties)** enables attribute to property synchonisation.
3. **[ReflectedProperties](#ReflectedProperties)** enables property to attribute synchonisation.
4. **[Properties](#Properties)** combines all three above.

### ObservedProperties

```javascript
import { ObservedProperties } from 'html-element-property-mixins';
```

#### Observing
By default, Custom Elements can observe attribute value changes whitelisted in the `observedAttributes` Array. `ObservedProperties` offers a similar solution for DOM properties using `observedProperties`.
When a property has changed, `propertyChangedCallback` is called, passing the property name, the old value and the new value.'

```javascript
class DemoElement extends ObservedProperties(HTMLElement) {

  static get observedProperties() {
    return ['firstName', 'lastName', 'age']
  }

  propertyChangedCallback(propName, oldValue, newValue) {
    console.info(`${propName} changed from ${oldValue} to ${newValue}`);
  }
  
}
```

If you like you can add your own getter / setter pairs:

```javascript
static get observedProperties() {
  return ['initials']
}

get initials() {
  return this._initials;
}

set initials(val) {
  this._initials = val.toUpperCase();
}

constructor() {
  this.initials = 'a.b.c.';
}

propertyChangedCallback(propName, oldValue, newValue) {
  console.info(`${propName} changed to ${newValue}`); //initials changed to A.B.C;
}
```

Accessors don't require a getter / setter pair. Keep in mind though that by default, private property values are assigned using the following pattern: `#${propName}`.

```javascript
static get observedProperties() {
  return ['firstName']
}

get firstName() {
  return this['#firstName'].toLowerCase()
}

```

### DOMProperties

```javascript
import { DOMProperties } from 'html-element-property-mixins';
```

Some native properties (e.g. input `value`) can be set using a DOM attribute. This mixin adds exactly this behavior: attribute to property sync:

```javascript
class DemoElement extends DOMProperties(HTMLElement) {

  static get DOMProperties() {
    return ['firstname', 'lastname']
  }

}
```

```html
<demo-element id="demo" firstname="Adewale" lastname="King"></demo-element>
<script>
  console.info(demo.firstname, demo.lastname); // Adewale, King
</script>
```

By default, attributes are lowercased property names (e.g. 'myPropName' becomes 'mypropname'). You can configure custom attribute mappings using 'propertyAttributeNames':

```javascript    
static get DOMProperties() {
  return ['myBestFriend']
}

static get propertyAttributeNames() {
  return {
    myBestFriend: 'my-best-friend',
  }
}
```

```html
<demo-element id="demo" my-best-friend="Hellen"></demo-element>
```

#### Attribute Converters
Attribute values are always strings. If you wish to set attributes based on properties taht have a specific type, you can confifure converters using `propertyFromAttributeConverters`:


```javascript
static get DOMProperties() {
  return ['married', 'friends']
}

static get propertyFromAttributeConverters() {
  return {
    married: function(value) {
      if(value === '') return true;
      return false;
    },
    friends: function(value) {
      if(!value) return null;
      return JSON.parse(value);
    }
  }
}
```

```html
<demo-element id="demo" married friends='["Gabriella","Anik","Linda"]'></demo-element>
<script>
  console.info(demo.married, demo.friends); //true, ['Gabriella','Anik','Linda'];
</script>
```

`html-element-property-mixins` come with a set of attribute converters for `boolean`, `string`, `number` and `object` types:

```javascript
  import { StringConverter, NumberConverter, BooleanConverter, ObjectConverter } from 'html-element-property-mixins/utils/attribute-converters';

  static get propertyFromAttributeConverters() {
    return {
      firstName: StringConverter.fromAttribute,
      age: NumberConverter.fromAttribute,
      married: BooleanConverter.fromAttribute,
      friends: ObjectConverter.fromAttribute,
    }
  }
```

### ReflectedProperties

```javascript
import { ReflectedProperties, ObservedProperties } from 'html-element-property-mixins';
```

This enables property to attribute sync. Using the 'reflectedProperties' object, one can map properties (keys) to attributes (values). The [ObservedProperties](#ObservedProperties) mixin is required.

```javascript
class DemoElement extends ReflectedProperties(ObservedProperties(HTMLElement)) {

  static get observedProperties() {
    return ['firstname', 'lastname', 'age']
  }

  static get reflectedProperties() {
    return ['firstname', 'lastname', 'age']
  }

  constructor() {
    this.firstname = 'Amira';
    this.firstname = 'Arif';
    this.age = 24;
  }

}
```

By default, attributes are lowercased property names (e.g. 'myPropName' becomes 'mypropname'). You can configure custom attribute mappings using 'propertyAttributeNames':

```javascript    
static get reflectedProperties() {
  return ['firstName']
}

static get propertyAttributeNames() {
  return {
    firstName: 'first-name',
  }
}
```

```html
<demo-element first-name="Amira"></demo-element>
```

#### Attribute Converters
Attribute values are always strings. If you wish to set attributes based on properties taht have a specific type, you can confifure converters using `propertyToAttributeConverters`:


```javascript
static get reflectedProperties() {
  return ['married', 'friends']
}

static get propertyToAttributeConverters() {
  return {
    married: function(value) {
      if(value === '') return true;
      return false;
    },
    friends: function(value) {
      if(!value) return null;
      return JSON.parse(value);
    }
  }
}

```

```html
<demo-element id="demo" married friends='["Gabriella","Anik","Linda"]'></demo-element>
<script>
  console.info(demo.married, demo.friends); //true, ['Gabriella','Anik','Linda'];
</script>
```

`html-element-property-mixins` come with a set of attribute converters for `boolean`, `string`, `number` and `object` types. Attributes are set based on the return value of these functions: when `false` or `undefined`, `removeAttribute` is called. Otherwise, `setAttribute` is called using the return value.

```javascript
import { StringConverter, NumberConverter, BooleanConverter, ObjectConverter } from 'html-element-property-mixins/utils/attribute-converters';

static get reflectedProperties() {
  return ['firstName', 'age', 'married', 'friends']
}

static get propertyToAttributeConverters() {
  return {
    firstName: StringConverter.toAttribute,
    age: NumberConverter.toAttribute,
    married: BooleanConverter.toAttribute,
    friends: ObjectConverter.toAttribute,
  }
}
```

> NOTE: `ObservedProperties` is required for `ReflectedProperties`.

### Properties

```javascript
import { Properties } from 'html-element-property-mixins';
```

This wraps all property mixins into a single `properties` configuration object.

```javascript
class DemoElement extends Properties(HTMLElement) {

  static get properties() {
    return {
      firstName: {
        observe: true, //add to `observedProperties` array
        DOM: true, //add to `DOMProperties` array
        reflect: true, //add to `reflectedProperties` array
        attributeName: 'first-name', //map to custom attribute name,
        toAttributeConverter: ParseString.toAttribute, //run when converting to attribute
        fromAttributeConverter: ParseString.fromAttribute //run when converting from attribute
      }
    }
  }

}
```
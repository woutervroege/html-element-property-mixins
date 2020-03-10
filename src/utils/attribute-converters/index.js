import { BooleanFromAttribute, BooleanToAttribute } from './boolean-converter.js';
import { NumberFromAttribute, NumberToAttribute } from './number-converter.js';
import { ObjectFromAttribute, ObjectToAttribute } from './object-converter.js';
import { StringFromAttribute, StringToAttribute } from './string-converter.js';

export const BooleanConverter = { fromAttribute: BooleanFromAttribute, toAttribute: BooleanToAttribute };
export const NumberConverter = { fromAttribute: NumberFromAttribute, toAttribute: NumberToAttribute };
export const ObjectConverter = { fromAttribute: ObjectFromAttribute, toAttribute: ObjectToAttribute };
export const StringConverter = { fromAttribute: StringFromAttribute, toAttribute: StringToAttribute };
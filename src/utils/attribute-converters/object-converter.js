export const ObjectFromAttribute = (oldValue, newValue) => {
  if(!oldValue && !newValue) return oldValue;
  if(!newValue) return newValue;
  try { return JSON.parse(newValue); }
  catch(e) { return null; }
};

export const ObjectToAttribute = (newValue) => {
  if(!newValue) return;
  return JSON.stringify(newValue);
};
export const StringFromAttribute = (oldValue, newValue) => {
  if(!oldValue && !newValue) return oldValue;
  if(!newValue) return newValue;
  return String(newValue);
};

export const StringToAttribute = (newValue) => {
  if(newValue === '') return;
  return newValue;
};
export const NumberFromAttribute = (oldValue, newValue) => {
  if(!oldValue && !newValue) return oldValue;
  if(newValue === '') return null;
  if(!newValue) return newValue;
  return Number(newValue);
};

export const NumberToAttribute = (newValue) => {
  if(isNaN(newValue)) return;
  return newValue;
};
export const BooleanFromAttribute = (oldValue, newValue) => {
  if(newValue === '') return true;
  return false;
};

export const BooleanToAttribute = (newValue) => {
  if(!newValue) return;
  return '';
};
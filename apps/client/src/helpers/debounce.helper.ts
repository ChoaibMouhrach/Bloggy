export const debounce = (cb: Function, delay = 1000) => {
  let id: NodeJS.Timeout;

  return (...args: any) => {
    clearTimeout(id);

    id = setTimeout(() => {
      cb(...args);
    }, delay);
  };
};

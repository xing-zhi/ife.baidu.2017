function Observer(obj) {
  const data = {};
  const innerData = Object.assign({}, obj);

  Object.keys(obj).forEach(key => {
    Object.defineProperty(data, key, {
      get() {
        console.log(`你访问了${key}`);
        return innerData[key];
      },
      set(value) {
        console.log(`你设置了${key}，新值为${value}`);
        innerData[key] = value;
      }
    });
  });

  return { data };
}

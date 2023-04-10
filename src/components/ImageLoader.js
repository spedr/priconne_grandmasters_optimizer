const importAll = (r) => {
    return r.keys().reduce((acc, key) => {
      acc[key.substring(2)] = r(key).default;
      return acc;
    }, {});
  };
  
  const images = importAll(require.context('./resources/units', false, /\.(png)$/));
  
  export default images;
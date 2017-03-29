module.exports = function hasSameWordAdjacently(str) {
  const re = /\b(\w+)\b\W+\b\1\b/;

  return re.test(str);
};

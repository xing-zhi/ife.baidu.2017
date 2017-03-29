module.exports = function isPhoneNumber(phoneNumber) {
  const str = String(phoneNumber);
  const re = /^1([3,8]\d|4[5,7]|5[0,1,2,3,5,6,7,8,9]|7[0,6,7,8])\d{8}/;

  return re.test(str);
};

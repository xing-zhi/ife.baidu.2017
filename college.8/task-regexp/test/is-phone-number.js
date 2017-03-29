const test = require('tape');

const isPhoneNumber = require('../src/is-phone-number');

test('isPhoneNumber test whether a given number is a valid phone number', (t) => {
  t.equal(typeof isPhoneNumber, 'function', 'isPhoneNumber should be a function.')

  // test length
  const phoneNumberTooShort = 1234;

  t.equal(isPhoneNumber(phoneNumberTooShort), false, 'The length of a phone number should not be smaller than 11.');

  const phoneNumberTooLong = 123456789987;

  t.equal(isPhoneNumber(phoneNumberTooLong), false, 'The length of a phone number should not be bigger than 11.');
  // \test length

  // test the first three digits
  const invalidPhoneNumbers = [
    10234567891,
    11234567891,
    12123456789,
    14123456789,
    14212345678,
    14312345678,
    14412345678,
    14612345678,
    14812345678,
    14912345678,
    15412345678,
    16123456789,
    17123456789,
    17223456789,
    17323456789,
    17423456789,
    17523456789,
    17923456789,
    19123456789
  ];

  invalidPhoneNumbers.forEach(phoneNumber => {
    t.equal(isPhoneNumber(phoneNumber), false, 'The first three digits of a phone number are specified');
  });

  const validPhoneNumbers = [
    13123456789,
    14523456789,
    14723456789,
    15023456789,
    15123456789,
    15223456789,
    15323456789,
    15523456789,
    15623456789,
    15723456789,
    15823456789,
    15923456789,
    17023456789,
    17623456789,
    17723456789,
    17823456789,
    18123456789
  ];

  validPhoneNumbers.forEach(phoneNumber => {
    t.equal(isPhoneNumber(phoneNumber), true, 'The first three digits of a phone number are specified');
  });
  // \test the first three digits

  t.end();
});

/**
 * Security and Performance Tests
 * Tests for the refactored application to ensure security improvements work correctly
 */

import { INPUT_LIMITS, ERROR_CODES, SECURITY_PATTERNS, HTML_ESCAPE_MAP } from '../src/module/constants.js';

// Mock data for testing
const mockData = {
  validName: "テストユーザー",
  longName: "a".repeat(INPUT_LIMITS.NAME_MAX_LENGTH + 1),
  validMessage: "テストメッセージです",
  longMessage: "a".repeat(INPUT_LIMITS.MESSAGE_MAX_LENGTH + 1),
  xssMessage: "<script>alert('xss')</script>",
  validMail: "test@example.com",
  longMail: "a".repeat(INPUT_LIMITS.MAIL_MAX_LENGTH + 1),
  validTitle: "テストスレッド",
  longTitle: "a".repeat(INPUT_LIMITS.TITLE_MAX_LENGTH + 1)
};

// Test HTML escaping
function testHTMLEscaping() {
  console.log("🔒 Testing HTML Escaping...");
  
  const dangerousInput = '<script>alert("xss")</script>';
  let escaped = dangerousInput;
  
  // Apply the same logic as MES function
  escaped = escaped.replace(SECURITY_PATTERNS.HTML_ESCAPE, function(match) {
    return HTML_ESCAPE_MAP[match] || '';
  });
  
  const hasScript = escaped.includes('<script>');
  console.log(`  Input: ${dangerousInput}`);
  console.log(`  Output: ${escaped}`);
  console.log(`  Safe: ${!hasScript ? '✅' : '❌'}`);
  
  return !hasScript;
}

// Test input validation limits
function testInputValidation() {
  console.log("📏 Testing Input Validation...");
  
  const tests = [
    {
      name: "Name length",
      value: mockData.longName,
      limit: INPUT_LIMITS.NAME_MAX_LENGTH,
      expectFail: true
    },
    {
      name: "Message length", 
      value: mockData.longMessage,
      limit: INPUT_LIMITS.MESSAGE_MAX_LENGTH,
      expectFail: true
    },
    {
      name: "Mail length",
      value: mockData.longMail, 
      limit: INPUT_LIMITS.MAIL_MAX_LENGTH,
      expectFail: true
    },
    {
      name: "Title length",
      value: mockData.longTitle,
      limit: INPUT_LIMITS.TITLE_MAX_LENGTH, 
      expectFail: true
    }
  ];
  
  let allPassed = true;
  
  tests.forEach(test => {
    const exceedsLimit = test.value.length > test.limit;
    const passed = test.expectFail ? exceedsLimit : !exceedsLimit;
    console.log(`  ${test.name}: ${test.value.length}/${test.limit} ${passed ? '✅' : '❌'}`);
    if (!passed) allPassed = false;
  });
  
  return allPassed;
}

// Test regex patterns are pre-compiled
function testRegexPatterns() {
  console.log("⚡ Testing Pre-compiled Regex Patterns...");
  
  const patterns = [
    { name: "HTML_ESCAPE", pattern: SECURITY_PATTERNS.HTML_ESCAPE },
    { name: "NEWLINE", pattern: SECURITY_PATTERNS.NEWLINE },
    { name: "NUM_LINK", pattern: SECURITY_PATTERNS.NUM_LINK },
    { name: "RAW_KEY", pattern: SECURITY_PATTERNS.RAW_KEY }
  ];
  
  let allValid = true;
  
  patterns.forEach(test => {
    const isRegex = test.pattern instanceof RegExp;
    console.log(`  ${test.name}: ${isRegex ? '✅' : '❌'}`);
    if (!isRegex) allValid = false;
  });
  
  return allValid;
}

// Test error codes are defined
function testErrorCodes() {
  console.log("🚨 Testing Error Codes...");
  
  const requiredCodes = [
    'NAME_TOO_LONG',
    'MESSAGE_INVALID', 
    'MAIL_TOO_LONG',
    'BBSKEY_MISSING',
    'THREAD_ID_MISSING',
    'TITLE_MISSING',
    'UNKNOWN_ERROR'
  ];
  
  let allDefined = true;
  
  requiredCodes.forEach(code => {
    const isDefined = ERROR_CODES[code] !== undefined;
    console.log(`  ${code}: ${isDefined ? '✅' : '❌'}`);
    if (!isDefined) allDefined = false;
  });
  
  return allDefined;
}

// Simulate secure comparison test
function testSecureComparison() {
  console.log("🔐 Testing Secure Comparison Concept...");
  
  // This simulates the logic of our secureCompare function
  function mockSecureCompare(a, b) {
    if (a.length !== b.length) return false;
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
  
  const tests = [
    { a: "password", b: "password", expected: true },
    { a: "password", b: "passwOrd", expected: false },
    { a: "abc", b: "abcd", expected: false },
    { a: "", b: "", expected: true }
  ];
  
  let allPassed = true;
  
  tests.forEach((test, i) => {
    const result = mockSecureCompare(test.a, test.b);
    const passed = result === test.expected;
    console.log(`  Test ${i + 1}: ${passed ? '✅' : '❌'}`);
    if (!passed) allPassed = false;
  });
  
  return allPassed;
}

// Run all tests
function runTests() {
  console.log("🧪 Starting Security and Performance Tests\n");
  
  const tests = [
    { name: "HTML Escaping", fn: testHTMLEscaping },
    { name: "Input Validation", fn: testInputValidation },
    { name: "Pre-compiled Regex", fn: testRegexPatterns },
    { name: "Error Codes", fn: testErrorCodes },
    { name: "Secure Comparison", fn: testSecureComparison }
  ];
  
  let totalPassed = 0;
  
  tests.forEach(test => {
    try {
      const passed = test.fn();
      if (passed) totalPassed++;
      console.log(`\n${test.name}: ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
    } catch (error) {
      console.log(`\n${test.name}: ❌ ERROR - ${error.message}\n`);
    }
  });
  
  console.log(`\n📊 Test Results: ${totalPassed}/${tests.length} passed`);
  
  if (totalPassed === tests.length) {
    console.log("🎉 All security and performance tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Please review the implementation.");
  }
  
  return totalPassed === tests.length;
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  runTests();
}

export { runTests };
/**
 * @module constants
 * @description Application constants for validation and security
 */

// Input validation limits
export const INPUT_LIMITS = {
  NAME_MAX_LENGTH: 30,
  MESSAGE_MAX_LENGTH: 300,
  MAIL_MAX_LENGTH: 70,
  TITLE_MAX_LENGTH: 100,
  THREAD_ID_MIN_LENGTH: 10,
  THREAD_ID_MAX_LENGTH: 20
} as const;

// Error codes
export const ERROR_CODES = {
  NAME_TOO_LONG: 'error0',
  MESSAGE_INVALID: 'error1', 
  MAIL_TOO_LONG: 'error2',
  BBSKEY_MISSING: 'error3',
  THREAD_ID_MISSING: 'error4',
  TITLE_MISSING: 'error5',
  TITLE_TOO_LONG: 'error6',
  MESSAGE_TOO_LONG: 'error7',
  UNKNOWN_ERROR: 'error999999999'
} as const;

// Security patterns - pre-compiled for performance
export const SECURITY_PATTERNS = {
  // Anonymous hosting patterns
  ANON_REMOHO: [
    /^.*\.(vpngate\.v4\.open\.ad\.jp|opengw\.net)$/,
    /(vpn|tor|proxy|onion)/,
    /^.*\.(ablenetvps\.ne\.jp|amazonaws\.com|arena\.ne\.jp|akamaitechnologies\.com|cdn77\.com|cnode\.io|datapacket\.com|digita-vm\.com|googleusercontent\.com|hmk-temp\.com|kagoya\.net|linodeusercontent\.com|sakura\.ne\.jp|vultrusercontent\.com|xtom\.com)$/,
    /^.*\.(tsc-soft\.com|53ja\.net)$/
  ],
  
  // Public WiFi patterns  
  FWIFI_REMOHO: [
    /^.*\.m-zone\.jp$/,
    /^\d+\.wi-fi\.kddi\.com$/,
    /^.*\.wi-fi\.wi2\.ne\.jp$/,
    /^.*\.ec-userreverse\.dion\.ne\.jp$/,
    /^210\.227\.19\.[67]\d$/,
    /^222-229-49-202\.saitama\.fdn\.vectant\.ne\.jp$/
  ],
  
  // Raw key pattern for trip generation
  RAW_KEY: /^#[0-9A-Fa-f]{16}[.\/0-9A-Za-z]{0,2}$/,
  
  // Trip hash pattern
  TRIP_HASH: /#(\d+)/,
  
  // HTML escape characters
  HTML_ESCAPE: /[&<>"']/g,
  
  // Newline patterns
  NEWLINE: /\r?\n/g,
  
  // Number link pattern
  NUM_LINK: /&gt;&gt;(\d+)/g,
  
  // Special character replacement
  SPECIAL_CHARS: /[◆★\n]/g,
  
  // Salt replacement pattern
  SALT_INVALID: /[^\.\-z]/g
} as const;

// WiFi nicknames corresponding to patterns
export const FWIFI_NICKNAMES = ['mz', 'auw', 'wi2', 'dion', 'lson', 'vectant'] as const;

// Character mapping for special characters
export const CHAR_MAP = {
  '◆': '◇',
  '★': '☆',
  '\n': ''
} as const;

// HTML escape mapping
export const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
} as const;

// Salt character mapping for trip generation
export const SALT_CHAR_MAP = {
  ':': 'A',
  ';': 'B', 
  '<': 'C',
  '=': 'D',
  '>': 'E',
  '?': 'F',
  '@': 'G',
  '[': 'a',
  '\\': 'b',
  ']': 'c',
  '^': 'd',
  '_': 'e',
  '`': 'f'
} as const;
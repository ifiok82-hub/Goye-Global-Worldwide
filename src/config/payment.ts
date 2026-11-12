// Payment Gateway Central Config - Strictly Pi Network
// Environment variables and DB settings take precedence.

export const PI_MAINNET_WALLET_ADDRESS =
  (typeof window !== 'undefined' && (localStorage.getItem('PI_MAINNET_WALLET_ADDRESS') || localStorage.getItem('pi_mainnet_wallet'))) ||
  (typeof process !== 'undefined' && (process.env?.PI_MAINNET_WALLET_ADDRESS || process.env?.NEXT_PUBLIC_PI_MAINNET_WALLET_ADDRESS)) ||
  'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R';

export const PI_TESTNET_WALLET_ADDRESS =
  (typeof window !== 'undefined' && (localStorage.getItem('PI_TESTNET_WALLET_ADDRESS') || localStorage.getItem('pi_testnet_wallet'))) ||
  (typeof process !== 'undefined' && (process.env?.PI_TESTNET_WALLET_ADDRESS || process.env?.NEXT_PUBLIC_PI_TESTNET_WALLET_ADDRESS)) ||
  'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R';

export const isPiCustomerPaymentEnabled = (): boolean => {
  return true;
};

export const isPiSandboxMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  const s = localStorage.getItem('PI_SANDBOX_MODE') || localStorage.getItem('PI_SANDBOX') || localStorage.getItem('pi_sandbox');
  return s === 'true';
};

export const getPiWalletAddress = (): string => {
  if (typeof window === 'undefined') return PI_MAINNET_WALLET_ADDRESS;
  const isSandbox = isPiSandboxMode();
  if (isSandbox) {
    return localStorage.getItem('PI_TESTNET_WALLET_ADDRESS') || localStorage.getItem('pi_testnet_wallet') || PI_TESTNET_WALLET_ADDRESS;
  }
  return localStorage.getItem('PI_MAINNET_WALLET_ADDRESS') || localStorage.getItem('pi_mainnet_wallet') || PI_MAINNET_WALLET_ADDRESS;
};

export const PI_WALLET_ADDRESS = getPiWalletAddress();

export const PI_CONFIG = {
  token: 'Pi',
  network: 'Pi Browser Only - MinePi',
  address: PI_WALLET_ADDRESS,
  warning: '⚠️ Pay with Pi in Pi Browser using official Pi SDK'
};

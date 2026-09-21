// Payment Gateway Central Config & Receiver Addresses
// Environment variables and DB settings take precedence. Defaults strictly to empty string ("").

export const RECEIVING_WALLET_ADDRESS =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_RECEIVING_WALLET_ADDRESS) ||
  (typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_RECEIVING_WALLET_ADDRESS) ||
  '0xdc7f804B36aB672Ec31642dF418F29e73281b040';

export const PI_MAINNET_WALLET_ADDRESS =
  (typeof window !== 'undefined' && (localStorage.getItem('PI_MAINNET_WALLET_ADDRESS') || localStorage.getItem('pi_mainnet_wallet'))) ||
  (typeof process !== 'undefined' && (process.env?.PI_MAINNET_WALLET_ADDRESS || process.env?.NEXT_PUBLIC_PI_MAINNET_WALLET_ADDRESS)) ||
  'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R';

export const PI_TESTNET_WALLET_ADDRESS =
  (typeof window !== 'undefined' && (localStorage.getItem('PI_TESTNET_WALLET_ADDRESS') || localStorage.getItem('pi_testnet_wallet'))) ||
  (typeof process !== 'undefined' && (process.env?.PI_TESTNET_WALLET_ADDRESS || process.env?.NEXT_PUBLIC_PI_TESTNET_WALLET_ADDRESS)) ||
  'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R';

export const isPiCustomerPaymentEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('PI_CUSTOMER_PAYMENT_ENABLED') === 'true';
};

export const isPiSandboxMode = (): boolean => {
  if (typeof window === 'undefined') return true;
  const s = localStorage.getItem('PI_SANDBOX_MODE') || localStorage.getItem('PI_SANDBOX') || localStorage.getItem('pi_sandbox');
  return s !== 'false';
};

export const getPiWalletAddress = (): string => {
  if (typeof window === 'undefined') return PI_TESTNET_WALLET_ADDRESS;
  const isSandbox = isPiSandboxMode();
  if (isSandbox) {
    return localStorage.getItem('PI_TESTNET_WALLET_ADDRESS') || localStorage.getItem('pi_testnet_wallet') || PI_TESTNET_WALLET_ADDRESS;
  }
  return localStorage.getItem('PI_MAINNET_WALLET_ADDRESS') || localStorage.getItem('pi_mainnet_wallet') || PI_MAINNET_WALLET_ADDRESS;
};

export const PI_WALLET_ADDRESS = getPiWalletAddress();

export const OPAY_ACCOUNT_NUMBER =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_OPAY_ACCOUNT_NUMBER) ||
  (typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_OPAY_ACCOUNT_NUMBER) ||
  '6113541882';

export const OPAY_ACCOUNT_NAME =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_OPAY_ACCOUNT_NAME) ||
  (typeof window !== 'undefined' && (window as any).env?.NEXT_PUBLIC_OPAY_ACCOUNT_NAME) ||
  'GOYEDAGOSMESS ENTERPRISE';

export const USDT_CONFIG = {
  token: 'USDT',
  network: 'BNB Smart Chain (BEP20 / BSC)',
  address: RECEIVING_WALLET_ADDRESS,
  minDeposit: '2 USDT',
  warning: '⚠️ Send ONLY via BNB Smart Chain (BEP20/BSC). Transfers via Ethereum (ERC20) or other networks will be permanently lost.',
  qr: RECEIVING_WALLET_ADDRESS ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${RECEIVING_WALLET_ADDRESS}` : ''
};

export const USDC_CONFIG = {
  token: 'USDC',
  network: 'Base Network',
  address: RECEIVING_WALLET_ADDRESS,
  minDeposit: '2 USDC',
  warning: '⚠️ CRITICAL: Ensure you select BASE NETWORK when transferring USDC. Sending via Ethereum Mainnet, Polygon, or Solana will result in lost funds.',
  qr: RECEIVING_WALLET_ADDRESS ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${RECEIVING_WALLET_ADDRESS}` : ''
};

export const PI_CONFIG = {
  token: 'Pi',
  network: 'Pi Browser Only - MinePi',
  address: PI_WALLET_ADDRESS,
  warning: '⚠️ Pay with Pi in Pi Browser - GCV $314,159 - Amount 0.000159 Pi ≈ $49.99'
};


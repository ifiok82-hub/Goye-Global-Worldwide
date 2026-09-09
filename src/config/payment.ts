// Payment Gateway Central Config & Receiver Addresses
// Environment variables take precedence, falling back to verified hardcoded constants

export const RECEIVING_WALLET_ADDRESS =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_RECEIVING_WALLET_ADDRESS) ||
  '0xdc7f804B36aB672Ec31642dF418F29e73281b040';

export const PI_WALLET_ADDRESS =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PI_WALLET_ADDRESS) ||
  'GBR4B47WY7JDK2JKUUQQTWWQENOUUYTAQAOYLXZ7XE36YFQY6LKPVO6R';

export const OPAY_ACCOUNT_NUMBER = '6113541882';
export const OPAY_ACCOUNT_NAME = 'GOYE STORE GLOBAL / GOYEDAGOSMESS ENTERPRISE';

export const USDT_CONFIG = {
  token: 'USDT',
  network: 'BNB Smart Chain (BEP20 / BSC)',
  address: RECEIVING_WALLET_ADDRESS,
  minDeposit: '2 USDT',
  warning: '⚠️ Send ONLY via BNB Smart Chain (BEP20/BSC). Transfers sent via Ethereum (ERC20) or other networks will be permanently lost.',
  qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${RECEIVING_WALLET_ADDRESS}`
};

export const USDC_CONFIG = {
  token: 'USDC',
  network: 'Base Network',
  address: RECEIVING_WALLET_ADDRESS,
  minDeposit: '2 USDC',
  warning: '⚠️ CRITICAL: Ensure you select the BASE NETWORK when transferring USDC. Sending via Ethereum Mainnet, Polygon, or Solana will result in lost funds.',
  qr: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${RECEIVING_WALLET_ADDRESS}`
};

export const PI_CONFIG = {
  token: 'Pi',
  network: 'Pi Browser Only - MinePi',
  address: PI_WALLET_ADDRESS,
  warning: '⚠️ Pay with Pi in Pi Browser - GCV $314,159 - Amount 0.000159 Pi ≈ $49.99'
};

export interface BundlePowerBankOption {
  id: string;
  name: string;
  priceUSD: number;
  priceNGN: number;
  image: string;
}

export interface BundleEarbudsOption {
  id: string;
  name: string;
  priceUSD: number;
  priceNGN: number;
  image?: string;
}

export interface BundleLipGlossOption {
  id: string;
  name: string;
  priceUSD: number;
  priceNGN: number;
  image?: string;
}

export interface ProductVariation {
  id?: string;
  name: string;
  priceUSD?: number;
  priceNGN?: number;
  options?: string[];
}

export interface ShippingOption {
  country?: string;
  method?: string;
  days?: string;
  feeUSD?: number;
  feeNGN?: number;
  carrier?: string;
  note?: string;
  usa?: { carrier?: string; feeUSD: number; days: string };
  uk?: { carrier?: string; feeUSD: number; days: string };
  nigeria?: { carrier?: string; feeUSD: number; days: string; note?: string };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Stored in USD base
  priceUSD?: number;
  priceGBP?: number;
  priceNGN?: number;
  costUSD?: number;
  image: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  shipping?: string;
  features?: string[] | string;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  vendorId?: string;
  isFlashSale?: boolean;
  discount?: number; // e.g., 0.5 for 50%
  stock?: number;
  groupBuy?: boolean;
  groupBuyJoined?: number;
  groupBuyMax?: number;
  groupBuyTimer?: string;
  sku?: string;
  goyeLink?: string;
  badge?: string;
  variations?: ProductVariation[];
  powerBankOptions?: BundlePowerBankOption[];
  earbudsOptions?: BundleEarbudsOption[];
  lipGlossOptions?: BundleLipGlossOption[];
  shippingOptions?: ShippingOption[];
  bulkDiscountNote?: string;
  isGoyeBestSeller?: boolean;
  isDigital?: boolean;
  isPremium?: boolean;
  teaser?: string;
  teaserModules?: string[];
  unlockedContent?: string;
  downloadUrl?: string;
  fileFormat?: string;
  status?: string;
  type?: string;
}

export interface Vendor {
  id: string;
  name: string;
  avatar: string;
  city: string;
  rating: number;
  totalSales: number;
  verified: boolean;
  email: string;
  phone: string;
  earnings: number;
}

export interface Rider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  currentLocation?: { lat: number; lng: number };
  status: 'idle' | 'delivering' | 'offline';
  earnings: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // 1 USD = rate units of this currency
  flag: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  type: 'airtime' | 'bill' | 'purchase' | 'refund' | 'payout' | 'deposit';
  amount: number; // in USD
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'escrow' | 'refunded';
  date: string;
  description: string;
  recipient: string;
  txHash?: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number; // USD
  deliveryDays: number;
  category: string;
  rating: number;
  vendorName: string;
  vendorAvatar: string;
}

export interface BillType {
  id: string;
  name: string;
  category: string;
  country: string;
  provider: string;
}

export interface DigitalPosOutlet {
  outletId: string;
  businessName: string;
  ownerName: string;
  phone: string;
  location: string;
  ninBvn: string;
  safeWalletBalance: number;
  qrCodeUrl: string;
  ussdCode: string;
  createdAt: string;
  totalTransactions: number;
  totalVolumeNGN: number;
  totalEarningsNGN: number;
  status: 'active' | 'pending' | 'suspended';
}


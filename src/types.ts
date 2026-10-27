export type CurrencyCode = 'PKR' | 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromUSD: number; // e.g. PKR is 278, INR is 86.5
  format: (amount: number) => string;
}

export type ProductCategory = 
  | 'ranks'
  | 'coins'
  | 'crates'
  | 'keys'
  | 'tags'
  | 'cosmetics'
  | 'bundles'
  | 'other'
  | string;

export interface BillingOption {
  type: 'monthly' | 'permanent';
  label: string;
  pricePKR: number;
  priceUSD: number;
  priceINR?: number;
  originalPricePKR?: number;
  originalPriceUSD?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tierRank?: string; // e.g. "3rd Highest", "2nd Highest", "Highest Rank", "Booster"
  shortDesc: string;
  fullDesc: string;
  priceUSD: number;
  pricePKR?: number;
  priceINR?: number;
  originalPriceUSD?: number;
  originalPricePKR?: number;
  billingOptions?: BillingOption[];
  weeklyCoins?: number;
  playerVaults?: number;
  setHomes?: number | string;
  kitName?: string;
  image: string;
  color: string; // Hex or tailwind color
  badge?: string;
  perks: string[];
  commands?: string[];
  rewards?: { name: string; chance: string; rarity: 'common' | 'rare' | 'epic' | 'legendary' }[];
  tagPreview?: { tag: string; tagColor: string; chatColor: string };
  deliveryNote?: string;
  featured?: boolean;
  inStock?: boolean;
  coinsAmount?: number;
}

export interface CategoryInfo {
  slug: ProductCategory;
  name: string;
  iconName: string;
  description: string;
  itemCount: number;
  gradient: string;
  accentColor: string;
  bannerImage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedBilling?: 'monthly' | 'permanent';
  customPriceUSD?: number;
  customPricePKR?: number;
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  minecraftUsername: string;
  role: 'user' | 'admin';
  joinedDate: string;
  ownedRanks: string[];
  ownedTags: string[];
  coinsBalance: number;
  avatarUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceUSD: number;
  category: ProductCategory;
}

export type OrderStatus = 'pending' | 'completed' | 'processing' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  minecraftUsername: string;
  userEmail: string;
  items: OrderItem[];
  currency: CurrencyCode;
  totalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  transactionRef: string;
  paymentScreenshot?: string;
  utrNumber?: string;
  deliveredAt?: string;
  adminNotes?: string;
}

export interface ServerConfig {
  serverName: string;
  serverIp: string;
  serverPort: number;
  bedrockPort: number;
  discordUrl: string;
  discordUsersOnline: number;
  storeTagline: string;
  currentOnline: number;
  maxPlayers: number;
  tps: number;
  pingMs: number;
  logoUrl: string;
  bgUrl: string;
  supportEmail: string;
  footerNotice: string;
  copyrightYear: string;
  upiId?: string;
  upiQrUrl?: string;
  upiName?: string;
}

export interface RuleItem {
  id: string;
  text: string;
  highlightTag?: string; // e.g. "(BOTH ARE ALLOWED ON LIFESTEAL)"
  highlightColor?: 'green' | 'red' | 'yellow' | 'cyan';
}

export interface RuleCategoryConfig {
  id: string;
  name: string;
  title: string;
  description?: string;
  lastUpdated?: string;
  iconName?: string;
  rules: RuleItem[];
}

export interface VoteSiteConfig {
  id: number;
  label: string; // e.g. "VOTE #1"
  siteName: string;
  url: string;
  keysReward: number;
}

export interface VoteConfig {
  title: string;
  subtitle: string;
  rewardNotice: string;
  voteSites: VoteSiteConfig[];
}

export interface StaffMemberConfig {
  id: string;
  username: string;
  role: string;
  groupId: string;
  avatarUrl?: string;
  badge?: string;
}

export interface StaffGroupConfig {
  id: string;
  title: string;
  titleColor: string; // Hex e.g. '#06b6d4', '#ef4444'
  order: number;
}

export interface ApplicationConfig {
  id: string;
  category: 'MEDIA' | 'STAFF' | 'BUILDER' | 'DEVELOPER' | string;
  title: string;
  subtitle: string;
  status: 'OPEN' | 'CLOSED';
  requirements: string[];
  color: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  date: string;
  tag: string;
  tagColor?: string;
  summary: string;
  content?: string;
  serverIpInfo?: string;
  views: number;
  comments: number;
}

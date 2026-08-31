export type SpiritCategory = 
  | 'All'
  | 'Single Malt Whisky'
  | 'Cask Strength Bourbon'
  | 'Botanical Gin'
  | 'Artisanal Rum'
  | 'Artisanal Mezcal'
  | 'Unity Reserve Vodka';

export type LoyaltyTier = 'Bronze Cask' | 'Silver Cask' | 'Gold Cask' | 'Master Distiller Circle';

export type OrderStatus = 'Distillery Packing' | 'Batch Sealed' | 'Dispatched' | 'Delivered' | 'Cancelled';

export type CaskAgingStatus = 'Aging in Barrel' | 'Bottling in Progress' | 'Ready for Dispatch' | 'Low Stock Alert' | 'Sold Out';

export interface TastingNotes {
  aroma: string[];
  palate: string[];
  finish: string[];
}

export interface CocktailPairing {
  name: string;
  tagline: string;
  ingredients: string[];
  instructions: string;
  difficulty: 'Easy' | 'Intermediate' | 'Master Mixologist';
  glassware: string;
}

export interface SpiritProduct {
  id: string;
  name: string;
  tagline: string;
  category: SpiritCategory;
  price: number;
  salePrice?: number;
  abv: string; // e.g. "46.5%"
  proof: number; // e.g. 93
  bottleSize: string; // e.g. "750 ml"
  batchNumber: string; // e.g. "BATCH-042"
  caskNumber: string; // e.g. "CASK-KY-88"
  caskType: string; // e.g. "Oloroso Sherry Cask Finish"
  ageYears?: number; // e.g. 12
  stockQuantity: number;
  lowStockThreshold: number;
  distillerName: string;
  distillerOrigin: string; // e.g. "Highland Casks, Scotland"
  description: string;
  tastingNotes: TastingNotes;
  cocktailPairing: CocktailPairing;
  awards: string[];
  images: string[];
  featured: boolean;
  isLimitedRelease: boolean;
  rating: number;
  reviewCount: number;
  releaseYear: number;
}

export interface DistillerInventoryItem {
  id: string;
  productId: string;
  productName: string;
  caskLotNumber: string;
  barrelType: string;
  barrelStartDate: string;
  currentProof: number;
  warehouseLocation: string; // e.g. "Warehouse B, Tier 4, Rack 12"
  status: CaskAgingStatus;
  bottlesInStock: number;
  targetStock: number;
  restockLeadDays: number;
  distillerNotes: string;
  lastInspectedDate: string;
}

export interface CartItem {
  product: SpiritProduct;
  quantity: number;
  giftBox: boolean;
  customEngraving?: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderPaymentInfo {
  type: 'card' | 'apple_pay' | 'cask_wire' | 'gift_card';
  cardLast4?: string;
  cardBrand?: string;
  transactionId: string;
  paidAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  discount: number;
  giftBoxFee: number;
  shipping: number;
  tax: number;
  total: number;
  payment: OrderPaymentInfo;
  shippingAddress: Address;
  trackingNumber: string;
  carrier: string;
  ageConfirmed: boolean;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  notes?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  totalSpent: number;
  addresses: Address[];
  spiritPreferences: string[];
  dateJoined: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  category: string;
  readTimeMinutes: number;
  coverImage: string;
  tags: string[];
  comments: {
    id: string;
    name: string;
    date: string;
    text: string;
  }[];
}

export interface MasterDistiller {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  experienceYears: number;
  signatureSpirit: string;
}

export interface AboutContent {
  heritageTitle: string;
  heritageSubtitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  copperPotTitle: string;
  copperPotDescription: string;
  copperPotImage: string;
  masterDistillers: MasterDistiller[];
  sustainabilityGoals: string[];
  distilleryAddress: string;
  distilleryHours: string;
  distilleryPhone: string;
}

export interface CarouselSlide {
  id: string;
  image: string;
  heading: string;
  subtitle: string;
  badge?: string;
  ctaText?: string;
  ctaAction?: 'shop' | 'about' | 'blog' | 'reserve';
}

export interface HeritageMilestone {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  caskType?: string;
  tag?: string;
  statLabel?: string;
  statValue?: string;
}

export interface ChronologyHeritageConfig {
  showSection: boolean;
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  milestones: HeritageMilestone[];
}

export interface HomeArtisansConfig {
  showSection: boolean;
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  distillers?: MasterDistiller[];
}

export interface CoreValueItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag?: string;
}

export interface GuidingPrinciplesConfig {
  showSection: boolean;
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  missionBadge?: string;
  missionTitle: string;
  missionStatement: string;
  missionHighlightQuote?: string;
  missionImage?: string;
  visionBadge?: string;
  visionTitle: string;
  visionStatement: string;
  visionHighlightQuote?: string;
  visionImage?: string;
  valuesTitle: string;
  valuesSubtitle: string;
  values: CoreValueItem[];
}

export interface HomeContent {
  announcementText: string;
  showAnnouncement: boolean;
  heroHeading: string;
  heroSubheading: string;
  heroBadgeText: string;
  heroCtaText: string;
  heroBgImage: string;
  carouselSlides: CarouselSlide[];
  heritageChronology?: ChronologyHeritageConfig;
  artisansSection?: HomeArtisansConfig;
  guidingPrinciples?: GuidingPrinciplesConfig;
  spotlightProductSubtitle: string;
  distillerQuote: string;
  distillerQuoteAuthor: string;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface AdminSettings {
  brandName: string;
  brandTagline: string;
  contactEmail: string;
  contactPhone: string;
  currencySymbol: string;
  taxRatePercent: number; // e.g. 8.5
  freeShippingThreshold: number; // e.g. 150
  standardShippingRate: number; // e.g. 15
  expressShippingRate: number; // e.g. 28
  pointsPerDollar: number; // e.g. 10
  pointsRedemptionRate: number; // 100 points = $1
  ageGateRequired: boolean;
  accentColor: string;
  // Security & Authentication for Admin CMS
  adminPassword?: string; // Master Admin Password (default: zookas2026)
  adminPin?: string; // 4-to-6 Digit Security PIN (default: 8821)
  requireBothPasswordAndPin?: boolean; // If true, requires both Password and PIN
  sessionTimeoutMinutes?: number; // Auto-lock session after inactivity (default: 30)
}

export type AppTab = 'home' | 'products' | 'about' | 'blog' | 'account' | 'checkout' | 'admin';

export interface HeaderNavItem {
  id: string;
  label: string;
  tab: AppTab;
  visible: boolean;
  badge?: string;
  icon?: string;
}

export interface HeaderCustomizationConfig {
  logoType: 'icon_text' | 'image' | 'text_only';
  logoImageUrl?: string;
  logoIcon: string;
  brandTitle: string;
  brandSubtitle: string;
  announcement: {
    enabled: boolean;
    text: string;
    badgeText?: string;
    linkTab?: AppTab;
    showSparkleIcon?: boolean;
    style: 'amber_gradient' | 'emerald_luxury' | 'ruby_cask' | 'obsidian_gold';
  };
  navLinks: HeaderNavItem[];
  showSearch: boolean;
  searchPlaceholder: string;
  showCloudSyncIndicator: boolean;
  showCustomerAccountMenu: boolean;
  showCartButton: boolean;
  cartButtonLabel?: string;
  stickyHeader: boolean;
  headerTheme: 'dark_glass' | 'midnight_black' | 'warm_amber_glow' | 'minimal_slate';
}

export interface FooterColumnLink {
  id: string;
  label: string;
  actionType: 'tab' | 'url';
  targetTab?: AppTab;
  externalUrl?: string;
  badge?: string;
  highlight?: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  visible: boolean;
  links: FooterColumnLink[];
}

export interface FooterSocialLink {
  id: string;
  platform: 'instagram' | 'twitter' | 'youtube' | 'facebook' | 'linkedin';
  label: string;
  url: string;
  enabled: boolean;
}

export interface FooterCustomizationConfig {
  newsletterSection: {
    enabled: boolean;
    badgeText: string;
    heading: string;
    description: string;
    inputPlaceholder: string;
    buttonText: string;
    discountCode: string;
    discountPercentText: string;
    successMessage: string;
  };
  brandColumn: {
    logoType: 'icon_text' | 'image' | 'text_only';
    logoImageUrl?: string;
    logoIcon: string;
    brandTitle: string;
    aboutText: string;
    complianceBadges: {
      show21PlusBadge: boolean;
      text21Plus: string;
      showSslBadge: boolean;
      textSsl: string;
      showCraftCertifiedBadge: boolean;
      textCraftCertified: string;
    };
  };
  columns: FooterColumn[];
  distilleryContact: {
    showContactColumn: boolean;
    title: string;
    address: string;
    hours: string;
    phone: string;
    email: string;
    showConciergeBadge: boolean;
    conciergeText: string;
  };
  bottomBar: {
    copyrightText: string;
    disclaimerText: string;
    taglines: string[];
    showAdminPortalLink: boolean;
    adminPortalLabel: string;
  };
  socialLinks: FooterSocialLink[];
  footerTheme: 'deep_stone' | 'obsidian_gold' | 'cask_wood_dark';
}

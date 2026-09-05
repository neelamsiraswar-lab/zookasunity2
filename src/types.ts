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

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  verifiedBuyer?: boolean;
  recommended?: boolean;
  tastingTags?: string[];
  helpfulCount?: number;
  helpfulVoters?: string[];
  date: string; // ISO date string (e.g. 2026-08-20)
  createdAt: string;
  updatedAt?: string;
}

export interface ProductReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingCounts: { [star: number]: number };
  recommendationPercentage: number;
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
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
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
  password?: string;
  passwordHash?: string;
  // Authentication & Google Login Data
  authProvider?: 'google' | 'email' | 'guest';
  googleUid?: string;
  googleEmail?: string;
  googleDisplayName?: string;
  googlePhotoUrl?: string;
  isEmailVerified?: boolean;
  lastLoginAt?: string;
  accountStatus?: 'active' | 'suspended' | 'vip';
  adminNotes?: string;
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
  companyLogo?: string;
  logoUrl?: string;
}

export type AppTab = 'home' | 'products' | 'allocations' | 'about' | 'blog' | 'account' | 'checkout' | 'admin';

export type BallotStatus = 'upcoming' | 'open' | 'drawing_completed' | 'closed' | 'open_for_entries' | 'drawing_in_progress' | 'draw_completed' | 'bottled_and_shipped';

export type BallotEntryStatus = 'registered' | 'selected_winner' | 'waitlisted' | 'claimed_paid' | 'expired' | 'unclaimed_expired';

export interface BallotAllocation {
  id: string;
  title: string;
  editionName: string;
  spiritCategory: SpiritCategory;
  productName: string;
  linkedProductId?: string;
  bottlePrice: number;
  totalBottlesAvailable: number;
  bottlesRemaining: number;
  maxBottlesPerEntrant: number;
  mashBill: string;
  caskType: string;
  abvPercent: number;
  ageStatement: string;
  bottleSize: string;
  distillationYear: number;
  registrationStartDate: string;
  registrationEndDate: string;
  drawDate: string;
  status: BallotStatus;
  imageUrl: string;
  description: string;
  tastingNotes: string[];
  totalEntrants?: number;
  totalBottlesRequested?: number;
  subtitle?: string;
  editionNumber?: string;
  bottleYieldTotal?: number;
  bottlesAvailable?: number;
  allocatedCount?: number;
  pricePerBottle?: number;
  depositRequired?: number;
  maxBottlesPerCollector?: number;
  fulfillmentDate?: string;
  heroImage?: string;
  galleryImages?: string[];
  caskProvenance?: {
    barrelNumber: string;
    woodType: string;
    originDistillery: string;
    distillationYear: number;
    bottlingYear: number;
    proof: number;
    abv: string;
    cellarLocation: string;
    mashBill?: string;
  };
  tastingProfile?: {
    nose: string;
    palate: string;
    finish: string;
    connoisseurScore: number;
    sommelierNotes: string;
  };
  eligibilityTier?: string;
  requiresAdultIdVerification?: boolean;
  entrantsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BallotEntry {
  id: string;
  allocationId: string;
  allocationTitle: string;
  productName: string;
  bottlePrice: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  loyaltyTier: LoyaltyTier;
  bottlesRequested: number;
  preferredBottleNumbers?: number[];
  collectorNotes?: string;
  ticketNumber: string;
  entrantNumber: number;
  status: BallotEntryStatus;
  registeredAt: string;
  selectedAt?: string;
  claimDeadline?: string;
  assignedBottleNumbers?: string[];
  shippingAddress?: Address;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userLoyaltyTier?: LoyaltyTier;
  allocatedBottleNumbers?: number[];
  drawResultTimestamp?: string;
  orderId?: string;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  tab: AppTab;
  visible?: boolean;
  badge?: string;
  badgeColor?: 'amber' | 'emerald' | 'red';
  iconName?: string;
  icon?: string;
}

export interface HeaderCustomizationConfig {
  brandName?: string;
  brandTagline?: string;
  brandTitle?: string;
  brandSubtitle?: string;
  logoType?: 'icon_text' | 'image' | 'text_only';
  logoImageUrl?: string;
  logoIcon?: string;
  stickyHeader?: boolean;
  showAnnouncementBar?: boolean;
  announcementText?: string;
  announcementBgColor?: string;
  announcementTextColor?: string;
  announcementLinkText?: string;
  announcementTab?: AppTab;
  announcement?: {
    enabled: boolean;
    text: string;
    badgeText?: string;
    linkTab?: AppTab;
    showSparkleIcon?: boolean;
    style: 'amber_gradient' | 'emerald_luxury' | 'ruby_cask' | 'obsidian_gold';
  };
  navLinks?: HeaderNavItem[];
  navItems?: HeaderNavItem[];
  showSearchBar?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showCloudStatus?: boolean;
  showCloudSyncIndicator?: boolean;
  showCustomerAccount?: boolean;
  showCustomerAccountMenu?: boolean;
  showAdminButton?: boolean;
  adminButtonText?: string;
  showCartButton?: boolean;
  cartButtonLabel?: string;
  headerTheme?: 'dark_glass' | 'midnight_black' | 'warm_amber_glow' | 'minimal_slate';
}

export interface FooterColumnLink {
  id: string;
  label: string;
  actionType?: 'tab' | 'url';
  targetTab?: AppTab;
  tab?: AppTab;
  externalUrl?: string;
  url?: string;
  isExternal?: boolean;
  badge?: string;
  highlight?: boolean;
}

export type FooterLink = FooterColumnLink;

export interface FooterColumn {
  id: string;
  title: string;
  visible?: boolean;
  links: FooterColumnLink[];
}

export interface FooterSocialLink {
  id?: string;
  platform: string;
  label?: string;
  url: string;
  iconName?: string;
  enabled?: boolean;
  visible?: boolean;
}

export interface FooterCustomizationConfig {
  brandName?: string;
  brandDescription?: string;
  logoImageUrl?: string;
  logoIcon?: string;
  logoType?: 'icon_text' | 'image' | 'text_only';
  showNewsletter?: boolean;
  newsletterHeading?: string;
  newsletterSubheading?: string;
  newsletterButtonText?: string;
  newsletterPromoCode?: string;
  newsletterDiscountText?: string;
  newsletterSection?: {
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
  brandColumn?: {
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
  showContactInfo?: boolean;
  contactAddress?: string;
  contactHours?: string;
  contactPhone?: string;
  contactEmail?: string;
  distilleryContact?: {
    showContactColumn: boolean;
    title: string;
    address: string;
    hours: string;
    phone: string;
    email: string;
    showConciergeBadge: boolean;
    conciergeText: string;
  };
  showComplianceBadges?: boolean;
  complianceBadges?: string[];
  copyrightText?: string;
  bottomBar?: {
    copyrightText: string;
    disclaimerText: string;
    taglines: string[];
    showAdminPortalLink: boolean;
    adminPortalLabel: string;
  };
  socialLinks?: FooterSocialLink[];
  footerTheme?: 'deep_stone' | 'obsidian_gold' | 'cask_wood_dark';
}

export type BottomNavBadgeType = 'none' | 'text' | 'live' | 'cart_count' | 'allocations_count' | 'numeric' | 'dot';
export type BottomNavDesignStyle = 
  | 'floating_island' 
  | 'full_width_dock' 
  | 'glass_capsule' 
  | 'minimal_flat' 
  | 'luxury_gold_accent' 
  | 'docked_glass' 
  | 'luxury_obsidian' 
  | 'minimal_amber' 
  | 'royal_heritage' 
  | 'compact_pill';
export type BottomNavActiveIndicator = 
  | 'top_glow_bar' 
  | 'subtle_dot' 
  | 'icon_pill_bg' 
  | 'full_tab_highlight' 
  | 'pulsing_beacon' 
  | 'soft_pill_bg' 
  | 'glow_dot' 
  | 'under_line' 
  | 'floating_pip';
export type BottomNavAccentColor = 'amber' | 'copper' | 'emerald' | 'ruby' | 'gold' | 'silver' | 'slate';

export interface BottomNavItem {
  id: string;
  label: string;
  tab: AppTab | 'cart' | 'search';
  iconName: string;
  visible: boolean;
  badgeType?: BottomNavBadgeType;
  badgeText?: string;
  badgeColor?: 'amber' | 'emerald' | 'ruby' | 'rose' | 'blue' | 'gold' | 'obsidian';
  isCenterAction?: boolean;
}

export interface BottomNavbarCustomizationConfig {
  enabled: boolean;
  visibilityMode: 'mobile_only' | 'mobile_and_tablet' | 'always' | 'all_devices' | 'hidden';
  designStyle: BottomNavDesignStyle;
  floatingMargin: 'none' | 'small' | 'medium' | 'large';
  backdropBlur: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderStyle: 'none' | 'subtle' | 'gold_glow' | 'accent_border' | 'double_gold' | 'charred_wood';
  activeIndicatorStyle: BottomNavActiveIndicator;
  accentColor: BottomNavAccentColor;
  showLabels: boolean;
  showMiniCartBar: boolean;
  showAllocationsLivePill: boolean;
  enableHapticGlow: boolean;
  items: BottomNavItem[];
}

export type LetterheadPaperStyle = 
  | 'vintage_parchment' 
  | 'obsidian_gold' 
  | 'clean_bond_white' 
  | 'charred_oak' 
  | 'speyside_cream' 
  | 'royal_linen';

export type LetterheadHeaderLayout = 
  | 'split_crest_left' 
  | 'centered_royal_crest' 
  | 'modern_minimal_right' 
  | 'classic_editorial' 
  | 'dual_column_stamp';

export type LetterheadDivider = 
  | 'double_gold_filigree' 
  | 'minimal_amber_line' 
  | 'distiller_emblem_divider' 
  | 'embossed_stamp_ribbon' 
  | 'none';

export type LetterheadWatermark = 
  | 'none' 
  | 'distillery_crest' 
  | 'authenticated_seal' 
  | 'cask_barrel_stamp' 
  | 'bonded_release' 
  | 'custom_text';

export type LetterheadWaxSealColor = 
  | 'ruby_crimson' 
  | 'antique_gold' 
  | 'obsidian_black' 
  | 'emerald_green' 
  | 'amber_bronze';

export type LetterheadAccentColor = 
  | 'amber' 
  | 'gold' 
  | 'copper' 
  | 'emerald' 
  | 'ruby' 
  | 'slate';

export interface CompanyDetails {
  companyName: string; // Registered Corporate Legal Name, e.g., "Zooka's Unity Spirits Private Limited"
  tradeName: string; // Brand / Trade Name, e.g., "Zooka's Unity Spirits Distillery"
  tagline: string; // e.g., "Highlands Craft Spirits & Bonded Cask Keepers"
  logoUrl?: string; // Custom logo image URL / base64
  logoType: 'custom_image' | 'distillery_crest' | 'both';
  logoWidth: number; // e.g. 120
  cin: string; // Corporate Identity Number (CIN), e.g. "U15549DL2024PTC392810"
  gstin: string; // GSTIN / GST Number, e.g. "07AAAAZ8821A1Z9"
  pan: string; // Permanent Account Number (PAN), e.g. "AAAAZ8821A"
  exciseLicense: string; // Excise & Bonded Warehouse License, e.g. "SCOT-EXCISE-BW-8841-B"
  registeredAddress: string; // Full Registered Corporate Office Address
  distilleryAddress: string; // Distillery Estate / Cellars Location
  email: string; // Official email
  phone: string; // Phone number
  website: string; // Official website
  supportPhone?: string; // Concierge / Support hotline
  // Display Toggles on Letterhead
  showCinOnLetterhead: boolean;
  showGstOnLetterhead: boolean;
  showPanOnLetterhead: boolean;
  showExciseOnLetterhead: boolean;
  showAddressOnLetterhead: boolean;
  showContactOnLetterhead: boolean;
  headerLogoLayout?: 'left_aligned_row' | 'centered_stack';
  headerDetailsPosition?: 'top_right' | 'below_logo' | 'footer_band' | 'dual_column';
  footerNoticeText?: string;
  // Letterhead Watermark Configuration
  showWatermarkOnLetterhead?: boolean;
  watermarkType?: 'distillery_crest' | 'company_logo' | 'custom_image' | 'custom_text' | 'authenticated_seal' | 'cask_barrel_stamp' | 'none';
  watermarkText?: string;
  watermarkImageUrl?: string;
  watermarkOpacity?: number; // 0.01 - 0.25 (e.g. 0.045)
  watermarkSize?: number; // e.g. 380
  watermarkRotation?: number; // e.g. 0 or -20
  watermarkPosition?: 'center' | 'bottom_right' | 'diagonal_repeat';
  updatedAt?: string;
}

export interface LetterheadTemplate {
  id: string;
  name: string;
  category: 'certificate' | 'dispatch' | 'invitation' | 'tasting_notes' | 'corporate' | 'general';
  description: string;
  isDefault: boolean;
  paperStyle: LetterheadPaperStyle;
  headerLayout: LetterheadHeaderLayout;
  distilleryName: string;
  tagline: string;
  heritageYear: string;
  crestIcon: string;
  customLogoUrl?: string;
  logoType?: 'custom_image' | 'distillery_crest' | 'both';
  logoWidth?: number;
  useGlobalCompanyDetails?: boolean;
  cin?: string;
  gstin?: string;
  pan?: string;
  showCin?: boolean;
  showGst?: boolean;
  showPan?: boolean;
  showRoyalWarrant: boolean;
  royalWarrantText?: string;
  bondHouseRegistration: string;
  taxExciseLicense: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  headerDivider: LetterheadDivider;
  watermarkType: LetterheadWatermark;
  watermarkText?: string;
  watermarkOpacity: number;
  watermarkRotation: number;
  showWaxSeal: boolean;
  waxSealText: string;
  waxSealColor: LetterheadWaxSealColor;
  showSignatureBlock: boolean;
  signatoryName: string;
  signatoryTitle: string;
  signatorySignatureFont?: 'signature_1' | 'signature_2' | 'signature_3' | 'classic_serif';
  showCoSignatory?: boolean;
  coSignatoryName?: string;
  coSignatoryTitle?: string;
  showSecurityQrHash: boolean;
  securityHashPrefix: string;
  legalDisclaimer: string;
  accentColor: LetterheadAccentColor;
  createdAt: string;
  updatedAt: string;
}

export type LetterheadDocumentStatus = 'draft' | 'finalized' | 'issued' | 'archived';

export interface LetterheadDocument {
  id: string;
  title: string;
  templateId: string;
  referenceNumber: string;
  documentDate: string;
  recipientName: string;
  recipientTitle?: string;
  recipientCompany?: string;
  recipientAddress?: string;
  subject: string;
  contentHtml: string;
  contentPlainText?: string;
  status: LetterheadDocumentStatus;
  mergeData?: Record<string, string>;
  customSignatoryName?: string;
  customSignatoryTitle?: string;
  showWaxSealOverride?: boolean;
  showSignatureOverride?: boolean;
  securityVerificationCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DriveAssetTag = 'all' | 'products' | 'logos' | 'banners' | 'heritage' | 'blog' | 'casks' | 'general';

export interface DriveAssetItem {
  id: string;
  name: string;
  url: string;
  tag: 'products' | 'logos' | 'banners' | 'heritage' | 'blog' | 'casks' | 'general';
  sizeBytes?: number;
  mimeType?: string;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  description?: string;
}

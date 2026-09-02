import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import {
  SpiritProduct,
  SpiritCategory,
  DistillerInventoryItem,
  CartItem,
  CustomerUser,
  Order,
  OrderStatus,
  CaskAgingStatus,
  BlogPost,
  AboutContent,
  HomeContent,
  AdminSettings,
  Address,
  HeaderCustomizationConfig,
  FooterCustomizationConfig,
  BottomNavbarCustomizationConfig,
  BottomNavItem,
  HeaderNavItem,
  FooterColumn,
  FooterSocialLink,
  ProductReview,
  BallotAllocation,
  BallotEntry,
  BallotStatus,
  BallotEntryStatus,
  AppTab,
  LetterheadTemplate,
  LetterheadDocument
} from '../types';
import {
  initialProducts,
  initialInventoryLots,
  initialCustomer,
  demoCustomers,
  initialOrders,
  initialBlogPosts,
  initialAboutContent,
  initialHomeContent,
  initialAdminSettings,
  initialHeaderConfig,
  initialFooterConfig,
  initialBottomNavbarConfig,
  initialReviews,
  initialBallotAllocations,
  initialBallotEntries
} from '../data/initialData';
import {
  initialLetterheadTemplates,
  initialLetterheadDocuments
} from '../data/initialLetterheadData';

export const normalizeHeaderConfig = (incoming?: Partial<HeaderCustomizationConfig> | null): HeaderCustomizationConfig => {
  const base = initialHeaderConfig;
  if (!incoming) return base;
  
  const rawItems = incoming.navItems || incoming.navLinks || base.navItems || [];
  const normalizedNavItems: HeaderNavItem[] = rawItems.map((item, idx) => ({
    id: item.id || `nav-${idx}`,
    label: item.label || 'Link',
    tab: item.tab || 'home',
    visible: item.visible !== false,
    badge: item.badge || undefined,
    badgeColor: item.badgeColor || 'amber',
    iconName: item.iconName || item.icon || 'Flame',
    icon: item.icon || item.iconName || 'Flame'
  }));

  return {
    ...base,
    ...incoming,
    brandName: incoming.brandName || incoming.brandTitle || base.brandName,
    brandTagline: incoming.brandTagline || incoming.brandSubtitle || base.brandTagline,
    logoType: incoming.logoType || base.logoType,
    logoIcon: incoming.logoIcon || base.logoIcon,
    logoImageUrl: incoming.logoImageUrl || base.logoImageUrl,
    stickyHeader: incoming.stickyHeader ?? base.stickyHeader,
    showAnnouncementBar: incoming.showAnnouncementBar ?? incoming.announcement?.enabled ?? base.showAnnouncementBar,
    announcementText: incoming.announcementText || incoming.announcement?.text || base.announcementText,
    announcementBgColor: incoming.announcementBgColor || '#451a03',
    announcementTextColor: incoming.announcementTextColor || '#fde68a',
    announcementLinkText: incoming.announcementLinkText || base.announcementLinkText,
    announcementTab: incoming.announcementTab || base.announcementTab,
    navItems: normalizedNavItems.length > 0 ? normalizedNavItems : (base.navItems || []),
    navLinks: normalizedNavItems.length > 0 ? normalizedNavItems : (base.navLinks || []),
    showSearchBar: incoming.showSearchBar ?? incoming.showSearch ?? base.showSearchBar,
    showSearch: incoming.showSearch ?? incoming.showSearchBar ?? base.showSearch,
    searchPlaceholder: incoming.searchPlaceholder || base.searchPlaceholder,
    showCloudStatus: incoming.showCloudStatus ?? incoming.showCloudSyncIndicator ?? base.showCloudStatus,
    showCloudSyncIndicator: incoming.showCloudSyncIndicator ?? incoming.showCloudStatus ?? base.showCloudSyncIndicator,
    showCustomerAccount: incoming.showCustomerAccount ?? incoming.showCustomerAccountMenu ?? base.showCustomerAccount,
    showCustomerAccountMenu: incoming.showCustomerAccountMenu ?? incoming.showCustomerAccount ?? base.showCustomerAccountMenu,
    showAdminButton: incoming.showAdminButton ?? true,
    adminButtonText: incoming.adminButtonText || 'Admin CMS',
    showCartButton: incoming.showCartButton ?? true,
    cartButtonLabel: incoming.cartButtonLabel || 'Cask Cart',
    headerTheme: incoming.headerTheme || base.headerTheme
  };
};

export const normalizeFooterConfig = (incoming?: Partial<FooterCustomizationConfig> | null): FooterCustomizationConfig => {
  const base = initialFooterConfig;
  if (!incoming) return base;

  const rawCols = incoming.columns || base.columns || [];
  const normalizedCols: FooterColumn[] = rawCols.map((col, cIdx) => ({
    id: col.id || `col-${cIdx}`,
    title: col.title || 'Column',
    visible: col.visible !== false,
    links: (col.links || []).map((link, lIdx) => ({
      id: link.id || `link-${cIdx}-${lIdx}`,
      label: link.label || 'Link',
      tab: link.tab || link.targetTab || 'products',
      targetTab: link.targetTab || link.tab || 'products',
      actionType: link.actionType || 'tab',
      url: link.url || link.externalUrl || '',
      externalUrl: link.externalUrl || link.url || '',
      isExternal: link.isExternal ?? (link.actionType === 'url'),
      badge: link.badge || undefined,
      highlight: link.highlight || false
    }))
  }));

  const rawBadges = incoming.complianceBadges || base.complianceBadges || [];
  const rawSocial = incoming.socialLinks || base.socialLinks || [];
  const normalizedSocial: FooterSocialLink[] = rawSocial.map((soc, sIdx) => ({
    id: soc.id || `soc-${sIdx}`,
    platform: soc.platform || 'Social',
    label: soc.label || soc.platform || 'Social',
    url: soc.url || '#',
    iconName: soc.iconName || soc.platform || 'Globe',
    enabled: soc.enabled ?? (soc.visible !== false),
    visible: soc.visible ?? (soc.enabled !== false)
  }));

  return {
    ...base,
    ...incoming,
    brandName: incoming.brandName || base.brandName,
    brandDescription: incoming.brandDescription || base.brandDescription,
    showNewsletter: incoming.showNewsletter ?? incoming.newsletterSection?.enabled ?? base.showNewsletter,
    newsletterHeading: incoming.newsletterHeading || incoming.newsletterSection?.heading || base.newsletterHeading,
    newsletterSubheading: incoming.newsletterSubheading || incoming.newsletterSection?.description || base.newsletterSubheading,
    newsletterButtonText: incoming.newsletterButtonText || incoming.newsletterSection?.buttonText || base.newsletterButtonText,
    newsletterPromoCode: incoming.newsletterPromoCode || incoming.newsletterSection?.discountCode || base.newsletterPromoCode,
    newsletterDiscountText: incoming.newsletterDiscountText || incoming.newsletterSection?.discountPercentText || base.newsletterDiscountText,
    columns: normalizedCols.length > 0 ? normalizedCols : base.columns,
    showContactInfo: incoming.showContactInfo ?? incoming.distilleryContact?.showContactColumn ?? base.showContactInfo,
    contactAddress: incoming.contactAddress || incoming.distilleryContact?.address || base.contactAddress,
    contactHours: incoming.contactHours || incoming.distilleryContact?.hours || base.contactHours,
    contactPhone: incoming.contactPhone || incoming.distilleryContact?.phone || base.contactPhone,
    contactEmail: incoming.contactEmail || incoming.distilleryContact?.email || base.contactEmail,
    showComplianceBadges: incoming.showComplianceBadges ?? true,
    complianceBadges: rawBadges,
    copyrightText: incoming.copyrightText || incoming.bottomBar?.copyrightText || base.copyrightText,
    socialLinks: normalizedSocial.length > 0 ? normalizedSocial : base.socialLinks,
    footerTheme: incoming.footerTheme || base.footerTheme
  };
};

export const normalizeBottomNavbarConfig = (incoming?: Partial<BottomNavbarCustomizationConfig> | null): BottomNavbarCustomizationConfig => {
  const base = initialBottomNavbarConfig;
  if (!incoming) return base;

  const rawItems = incoming.items || base.items || [];
  const normalizedItems: BottomNavItem[] = rawItems.map((item, idx) => ({
    id: item.id || `bn-${idx}`,
    label: item.label || 'Tab',
    tab: item.tab || 'home',
    iconName: item.iconName || 'Flame',
    visible: item.visible !== false,
    badgeType: item.badgeType || 'none',
    badgeText: item.badgeText || undefined,
    badgeColor: item.badgeColor || 'amber',
    isCenterAction: item.isCenterAction || false
  }));

  return {
    ...base,
    ...incoming,
    enabled: incoming.enabled ?? base.enabled,
    visibilityMode: incoming.visibilityMode || base.visibilityMode,
    designStyle: incoming.designStyle || base.designStyle,
    floatingMargin: incoming.floatingMargin || base.floatingMargin,
    backdropBlur: incoming.backdropBlur || base.backdropBlur,
    borderStyle: incoming.borderStyle || base.borderStyle,
    activeIndicatorStyle: incoming.activeIndicatorStyle || base.activeIndicatorStyle,
    accentColor: incoming.accentColor || base.accentColor,
    showLabels: incoming.showLabels ?? base.showLabels,
    showMiniCartBar: incoming.showMiniCartBar ?? base.showMiniCartBar,
    showAllocationsLivePill: incoming.showAllocationsLivePill ?? base.showAllocationsLivePill,
    enableHapticGlow: incoming.enableHapticGlow ?? base.enableHapticGlow,
    items: normalizedItems.length > 0 ? normalizedItems : base.items
  };
};
import {
  testFirestoreConnection,
  subscribeToCloudProducts,
  saveCloudProduct,
  deleteCloudProduct,
  subscribeToCloudInventory,
  saveCloudInventoryLot,
  deleteCloudInventoryLot,
  subscribeToCloudOrders,
  saveCloudOrder,
  deleteCloudOrder,
  subscribeToCloudBlogPosts,
  saveCloudBlogPost,
  deleteCloudBlogPost,
  subscribeToCloudSiteContent,
  saveCloudSiteContent,
  subscribeToCloudCustomer,
  saveCloudCustomer,
  seedInitialCloudDatabase,
  uploadImageToCloudStorage,
  saveCloudReview,
  deleteCloudReview,
  voteHelpfulCloudReview,
  subscribeToAllCloudReviews,
  saveCloudBallotAllocation,
  deleteCloudBallotAllocation,
  subscribeToCloudBallotAllocations,
  saveCloudBallotEntry,
  updateCloudBallotEntry,
  deleteCloudBallotEntry,
  subscribeToCloudBallotEntries,
  saveCloudLetterhead,
  deleteCloudLetterhead,
  subscribeToCloudLetterheads,
  saveCloudLetterheadDocument,
  deleteCloudLetterheadDocument,
  subscribeToCloudLetterheadDocuments
} from '../lib/firebase';

export type { AppTab };

export type CloudSyncStatus = 'connected' | 'syncing' | 'offline' | 'error';

interface StoreContextType {
  // Navigation & UI state
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedCategory: SpiritCategory;
  setSelectedCategory: (cat: SpiritCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeProductModal: SpiritProduct | null;
  setActiveProductModal: (prod: SpiritProduct | null) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  selectedArticle: BlogPost | null;
  setSelectedArticle: (post: BlogPost | null) => void;
  ageVerified: boolean;
  setAgeVerified: (verified: boolean) => void;

  // Ballot Allocations & Lottery State
  ballotAllocations: BallotAllocation[];
  ballotEntries: BallotEntry[];
  activeBallotModal: BallotAllocation | null;
  setActiveBallotModal: (alloc: BallotAllocation | null) => void;
  registerBallotEntry: (details: {
    allocationId: string;
    bottlesRequested: number;
    preferredBottleNumbers?: number[];
    collectorNotes?: string;
    shippingAddress?: Address;
  }) => Promise<{ success: boolean; entry?: BallotEntry; error?: string }>;
  drawBallotLottery: (allocationId: string, winnersCount?: number) => Promise<{ success: boolean; winnersSelected: number }>;
  claimBallotAllocation: (entryId: string) => Promise<{ success: boolean; orderId?: string }>;
  saveBallotAllocation: (allocation: BallotAllocation) => Promise<void>;
  deleteBallotAllocation: (allocationId: string) => Promise<void>;
  getUserBallotEntries: (userId?: string) => BallotEntry[];

  // Cloud Sync Metadata
  cloudSyncStatus: CloudSyncStatus;
  lastSyncedAt: Date | null;
  isCloudSeeding: boolean;
  forceCloudResync: () => Promise<void>;
  uploadMedia: (fileOrDataUri: File | string, folder?: 'products' | 'carousel' | 'heritage' | 'blog' | 'casks') => Promise<string>;

  // Real-Time Synchronized Data
  products: SpiritProduct[];
  inventoryLots: DistillerInventoryItem[];
  cart: CartItem[];
  customer: CustomerUser;
  orders: Order[];
  blogPosts: BlogPost[];
  aboutContent: AboutContent;
  homeContent: HomeContent;
  adminSettings: AdminSettings;
  headerConfig: HeaderCustomizationConfig;
  footerConfig: FooterCustomizationConfig;
  bottomNavbarConfig: BottomNavbarCustomizationConfig;

  // Customer Authentication & Session State
  isCustomerLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalInitialTab: 'login' | 'register' | 'demo';
  openAuthModal: (tab?: 'login' | 'register' | 'demo', redirectTab?: AppTab) => void;
  closeAuthModal: () => void;
  loginCustomer: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (details: {
    name: string;
    email: string;
    phone?: string;
    spiritPreferences?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => Promise<void>;
  switchCustomerAccount: (customerId: string) => void;
  demoCustomersList: CustomerUser[];

  // Cart Helpers
  addToCart: (product: SpiritProduct, quantity?: number, giftBox?: boolean, customEngraving?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleGiftBox: (productId: string, val: boolean) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartGiftBoxTotal: number;
  cartShippingFee: number;
  cartTaxAmount: number;
  cartTotal: number;

  // Order Placement
  placeOrder: (orderPayload: {
    shippingAddress: Address;
    payment: {
      type: 'card' | 'apple_pay' | 'cask_wire' | 'gift_card';
      cardLast4?: string;
      cardBrand?: string;
    };
    loyaltyPointsToUse: number;
    notes?: string;
  }) => Order;

  // Inventory & Distiller Ops (Cloud CRUD)
  updateInventoryStock: (lotId: string, newStock: number) => void;
  updateCaskStatus: (lotId: string, status: CaskAgingStatus, notes?: string) => void;
  addInventoryLot: (lot: DistillerInventoryItem) => void;
  deleteInventoryLot: (lotId: string) => void;

  // Admin CMS & Catalog Operations (Cloud CRUD)
  updateProduct: (product: SpiritProduct) => void;
  addProduct: (product: SpiritProduct) => void;
  deleteProduct: (productId: string) => void;
  updateHomeContent: (content: HomeContent) => void;
  updateAboutContent: (content: AboutContent) => void;
  updateAdminSettings: (settings: AdminSettings) => void;
  updateHeaderConfig: (config: HeaderCustomizationConfig) => void;
  updateFooterConfig: (config: FooterCustomizationConfig) => void;
  updateBottomNavbarConfig: (config: BottomNavbarCustomizationConfig) => void;
  resetHeaderFooterConfig: () => void;
  resetBottomNavbarConfig: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  updateOrderTracking: (orderId: string, trackingNumber: string) => void;
  deleteOrder: (orderId: string) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;
  addBlogComment: (postId: string, comment: { name: string; text: string }) => void;

  // Customer Management (Cloud CRUD)
  updateCustomerProfile: (updated: Partial<CustomerUser>) => void;
  addCustomerAddress: (address: Omit<Address, 'id'>) => void;
  deleteCustomerAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Product Reviews & Connoisseur Feedback (Cloud CRUD)
  reviews: ProductReview[];
  getProductReviews: (productId: string) => ProductReview[];
  addProductReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => Promise<ProductReview>;
  deleteProductReview: (reviewId: string) => Promise<void>;
  voteReviewHelpful: (reviewId: string) => Promise<void>;

  // Letterhead Management & Document Composer (Cloud CRUD)
  letterheadTemplates: LetterheadTemplate[];
  letterheadDocuments: LetterheadDocument[];
  saveLetterheadTemplate: (template: LetterheadTemplate) => Promise<void>;
  deleteLetterheadTemplate: (templateId: string) => Promise<void>;
  setDefaultLetterheadTemplate: (templateId: string) => Promise<void>;
  saveLetterheadDocument: (document: LetterheadDocument) => Promise<void>;
  deleteLetterheadDocument: (documentId: string) => Promise<void>;
  getLetterheadTemplate: (templateId: string) => LetterheadTemplate | undefined;

  // Reset & Re-seed demo data
  resetAllData: () => void;
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'zookas_unity_spirits_state_v1';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cloud sync status state
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('syncing');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date());
  const [isCloudSeeding, setIsCloudSeeding] = useState<boolean>(false);

  // Load saved state or use initial data
  const [products, setProducts] = useState<SpiritProduct[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [inventoryLots, setInventoryLots] = useState<DistillerInventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inventory`);
      return saved ? JSON.parse(saved) : initialInventoryLots;
    } catch {
      return initialInventoryLots;
    }
  });

  const [customer, setCustomer] = useState<CustomerUser>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customer`);
      return saved ? JSON.parse(saved) : initialCustomer;
    } catch {
      return initialCustomer;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_blog`);
      return saved ? JSON.parse(saved) : initialBlogPosts;
    } catch {
      return initialBlogPosts;
    }
  });

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_about`);
      return saved ? JSON.parse(saved) : initialAboutContent;
    } catch {
      return initialAboutContent;
    }
  });

  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_home`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.carouselSlides || !Array.isArray(parsed.carouselSlides) || parsed.carouselSlides.length === 0) {
          parsed.carouselSlides = initialHomeContent.carouselSlides;
        }
        if (!parsed.heritageChronology || !parsed.heritageChronology.milestones || parsed.heritageChronology.milestones.length === 0) {
          parsed.heritageChronology = initialHomeContent.heritageChronology;
        }
        if (!parsed.guidingPrinciples || !parsed.guidingPrinciples.values || parsed.guidingPrinciples.values.length === 0) {
          parsed.guidingPrinciples = initialHomeContent.guidingPrinciples;
        }
        return parsed;
      }
      return initialHomeContent;
    } catch {
      return initialHomeContent;
    }
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialAdminSettings;
    } catch {
      return initialAdminSettings;
    }
  });

  const [headerConfig, setHeaderConfig] = useState<HeaderCustomizationConfig>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_header`);
      return saved ? normalizeHeaderConfig(JSON.parse(saved)) : initialHeaderConfig;
    } catch {
      return initialHeaderConfig;
    }
  });

  const [footerConfig, setFooterConfig] = useState<FooterCustomizationConfig>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_footer`);
      return saved ? normalizeFooterConfig(JSON.parse(saved)) : initialFooterConfig;
    } catch {
      return initialFooterConfig;
    }
  });

  const [bottomNavbarConfig, setBottomNavbarConfig] = useState<BottomNavbarCustomizationConfig>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_bottom_navbar`);
      return saved ? normalizeBottomNavbarConfig(JSON.parse(saved)) : initialBottomNavbarConfig;
    } catch {
      return initialBottomNavbarConfig;
    }
  });

  const [ageVerified, setAgeVerifiedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${LOCAL_STORAGE_KEY}_age_verified`) === 'true';
    } catch {
      return false;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
      return saved ? JSON.parse(saved) : initialReviews;
    } catch {
      return initialReviews;
    }
  });

  // Ballot Allocations & Collector Entries State
  const [ballotAllocations, setBallotAllocations] = useState<BallotAllocation[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ballot_allocations`);
      return saved ? JSON.parse(saved) : initialBallotAllocations;
    } catch {
      return initialBallotAllocations;
    }
  });

  const [ballotEntries, setBallotEntries] = useState<BallotEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ballot_entries`);
      return saved ? JSON.parse(saved) : initialBallotEntries;
    } catch {
      return initialBallotEntries;
    }
  });

  const [letterheadTemplates, setLetterheadTemplates] = useState<LetterheadTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_letterheads`);
      return saved ? JSON.parse(saved) : initialLetterheadTemplates;
    } catch {
      return initialLetterheadTemplates;
    }
  });

  const [letterheadDocuments, setLetterheadDocuments] = useState<LetterheadDocument[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_letterhead_docs`);
      return saved ? JSON.parse(saved) : initialLetterheadDocuments;
    } catch {
      return initialLetterheadDocuments;
    }
  });

  const [activeBallotModal, setActiveBallotModal] = useState<BallotAllocation | null>(null);

  // Customer Session & Login State
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_is_logged_in`);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register' | 'demo'>('login');
  const [authModalRedirectTab, setAuthModalRedirectTab] = useState<AppTab | null>(null);

  const openAuthModal = useCallback((tab: 'login' | 'register' | 'demo' = 'login', redirectTab?: AppTab) => {
    setAuthModalInitialTab(tab);
    if (redirectTab) {
      setAuthModalRedirectTab(redirectTab);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalRedirectTab(null);
  }, []);

  // UI state
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<SpiritCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeProductModal, setActiveProductModal] = useState<SpiritProduct | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Local Storage Backups
  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products)); } catch (_) {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_inventory`, JSON.stringify(inventoryLots)); } catch (_) {}
  }, [inventoryLots]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_customer`, JSON.stringify(customer)); } catch (_) {}
  }, [customer]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders)); } catch (_) {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_blog`, JSON.stringify(blogPosts)); } catch (_) {}
  }, [blogPosts]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_about`, JSON.stringify(aboutContent)); } catch (_) {}
  }, [aboutContent]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_home`, JSON.stringify(homeContent)); } catch (_) {}
  }, [homeContent]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(adminSettings)); } catch (_) {}
  }, [adminSettings]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_header`, JSON.stringify(headerConfig)); } catch (_) {}
  }, [headerConfig]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_footer`, JSON.stringify(footerConfig)); } catch (_) {}
  }, [footerConfig]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_bottom_navbar`, JSON.stringify(bottomNavbarConfig)); } catch (_) {}
  }, [bottomNavbarConfig]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_cart`, JSON.stringify(cart)); } catch (_) {}
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_reviews`, JSON.stringify(reviews)); } catch (_) {}
  }, [reviews]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_ballot_allocations`, JSON.stringify(ballotAllocations)); } catch (_) {}
  }, [ballotAllocations]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_ballot_entries`, JSON.stringify(ballotEntries)); } catch (_) {}
  }, [ballotEntries]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_letterheads`, JSON.stringify(letterheadTemplates)); } catch (_) {}
  }, [letterheadTemplates]);

  useEffect(() => {
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_letterhead_docs`, JSON.stringify(letterheadDocuments)); } catch (_) {}
  }, [letterheadDocuments]);

  // ==========================================
  // REAL-TIME FIRESTORE SUBSCRIPTIONS & SYNC
  // ==========================================
  useEffect(() => {
    let unsubProducts: () => void = () => {};
    let unsubInventory: () => void = () => {};
    let unsubOrders: () => void = () => {};
    let unsubBlog: () => void = () => {};
    let unsubContent: () => void = () => {};
    let unsubCustomer: () => void = () => {};
    let unsubReviews: () => void = () => {};
    let unsubBallotAllocations: () => void = () => {};
    let unsubBallotEntries: () => void = () => {};
    let unsubLetterheads: () => void = () => {};
    let unsubLetterheadDocs: () => void = () => {};

    let hasReceivedInitialProducts = false;

    const initCloud = async () => {
      try {
        setCloudSyncStatus('syncing');
        await testFirestoreConnection();

        // 1. Products Listener
        unsubProducts = subscribeToCloudProducts((cloudProds) => {
          if (cloudProds.length > 0) {
            setProducts(cloudProds);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          } else if (!hasReceivedInitialProducts) {
            // If cloud collection is currently blank, auto-seed with rich initial data
            seedInitialCloudDatabase({
              products: initialProducts,
              inventory: initialInventoryLots,
              orders: initialOrders,
              blogPosts: initialBlogPosts,
              homeContent: initialHomeContent,
              aboutContent: initialAboutContent,
              adminSettings: initialAdminSettings,
              customer: initialCustomer,
              reviews: initialReviews,
              ballotAllocations: initialBallotAllocations,
              ballotEntries: initialBallotEntries,
              letterheads: initialLetterheadTemplates,
              letterheadDocuments: initialLetterheadDocuments
            }).catch(e => console.warn('Cloud seed notice:', e));
          }
          hasReceivedInitialProducts = true;
        });

        // 2. Inventory Listener
        unsubInventory = subscribeToCloudInventory((cloudLots) => {
          if (cloudLots.length > 0) {
            setInventoryLots(cloudLots);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 3. Orders Listener
        unsubOrders = subscribeToCloudOrders((cloudOrds) => {
          if (cloudOrds.length > 0) {
            setOrders(cloudOrds);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 4. Blog Posts Listener
        unsubBlog = subscribeToCloudBlogPosts((cloudPosts) => {
          if (cloudPosts.length > 0) {
            setBlogPosts(cloudPosts);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 5. Site Content Listener
        unsubContent = subscribeToCloudSiteContent((contents) => {
          if (contents.home) setHomeContent(contents.home);
          if (contents.about) setAboutContent(contents.about);
          if (contents.settings) setAdminSettings(contents.settings);
          if (contents.header) setHeaderConfig(normalizeHeaderConfig(contents.header));
          if (contents.footer) setFooterConfig(normalizeFooterConfig(contents.footer));
          if (contents.bottomNavbar) setBottomNavbarConfig(normalizeBottomNavbarConfig(contents.bottomNavbar));
          setCloudSyncStatus('connected');
          setLastSyncedAt(new Date());
        });

        // 6. Customer Listener
        unsubCustomer = subscribeToCloudCustomer(customer.id, (cloudCust) => {
          if (cloudCust) {
            setCustomer(cloudCust);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 7. Product Reviews Listener
        unsubReviews = subscribeToAllCloudReviews((cloudRevs) => {
          if (cloudRevs.length > 0) {
            setReviews(cloudRevs);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 8. Ballot Allocations Listener
        unsubBallotAllocations = subscribeToCloudBallotAllocations((cloudAllocations) => {
          if (cloudAllocations.length > 0) {
            setBallotAllocations(cloudAllocations);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 9. Ballot Entries Listener
        unsubBallotEntries = subscribeToCloudBallotEntries((cloudEntries) => {
          if (cloudEntries.length > 0) {
            setBallotEntries(cloudEntries);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 10. Letterhead Templates Listener
        unsubLetterheads = subscribeToCloudLetterheads((cloudLetterheads) => {
          if (cloudLetterheads.length > 0) {
            setLetterheadTemplates(cloudLetterheads);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        // 11. Letterhead Documents Listener
        unsubLetterheadDocs = subscribeToCloudLetterheadDocuments((cloudDocs) => {
          if (cloudDocs.length > 0) {
            setLetterheadDocuments(cloudDocs);
            setCloudSyncStatus('connected');
            setLastSyncedAt(new Date());
          }
        });

        setCloudSyncStatus('connected');
      } catch (err) {
        console.warn('Firebase init error, running in resilient fallback mode:', err);
        setCloudSyncStatus('offline');
      }
    };

    initCloud();

    return () => {
      unsubProducts();
      unsubInventory();
      unsubOrders();
      unsubBlog();
      unsubContent();
      unsubCustomer();
      unsubReviews();
      unsubBallotAllocations();
      unsubBallotEntries();
      unsubLetterheads();
      unsubLetterheadDocs();
    };
  }, []);

  const forceCloudResync = useCallback(async () => {
    try {
      setIsCloudSeeding(true);
      setCloudSyncStatus('syncing');
      await seedInitialCloudDatabase({
        products,
        inventory: inventoryLots,
        orders,
        blogPosts,
        homeContent,
        aboutContent,
        adminSettings,
        customer,
        headerConfig,
        footerConfig,
        reviews,
        ballotAllocations,
        ballotEntries,
        letterheads: letterheadTemplates,
        letterheadDocuments: letterheadDocuments
      });
      setCloudSyncStatus('connected');
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error('Manual cloud resync failed:', err);
      setCloudSyncStatus('error');
    } finally {
      setIsCloudSeeding(false);
    }
  }, [products, inventoryLots, orders, blogPosts, homeContent, aboutContent, adminSettings, customer, headerConfig, footerConfig, reviews, ballotAllocations, ballotEntries, letterheadTemplates, letterheadDocuments]);

  const uploadMedia = useCallback(async (
    fileOrDataUri: File | string,
    folder: 'products' | 'carousel' | 'heritage' | 'blog' | 'casks' = 'products'
  ): Promise<string> => {
    return uploadImageToCloudStorage(fileOrDataUri, folder);
  }, []);

  const setAgeVerified = (verified: boolean) => {
    setAgeVerifiedState(verified);
    try { localStorage.setItem(`${LOCAL_STORAGE_KEY}_age_verified`, String(verified)); } catch (_) {}
  };

  // Cart operations
  const addToCart = (product: SpiritProduct, quantity = 1, giftBox = false, customEngraving = '') => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        const maxQty = Math.max(1, Math.min(product.stockQuantity, newQty));
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: maxQty,
          giftBox: giftBox || updated[existingIndex].giftBox,
          customEngraving: customEngraving || updated[existingIndex].customEngraving
        };
        return updated;
      } else {
        const safeQty = Math.max(1, Math.min(product.stockQuantity, quantity));
        return [...prev, { product, quantity: safeQty, giftBox, customEngraving }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const maxQty = Math.max(1, Math.min(item.product.stockQuantity, quantity));
          return { ...item, quantity: maxQty };
        }
        return item;
      })
    );
  };

  const toggleGiftBox = (productId: string, val: boolean) => {
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, giftBox: val } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const unitPrice = item.product.salePrice ?? item.product.price;
        return acc + unitPrice * item.quantity;
      }, 0),
    [cart]
  );

  const cartGiftBoxTotal = useMemo(
    () => cart.reduce((acc, item) => (item.giftBox ? acc + 15 * item.quantity : acc), 0),
    [cart]
  );

  const cartShippingFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= adminSettings.freeShippingThreshold) return 0;
    return adminSettings.standardShippingRate;
  }, [cartSubtotal, adminSettings]);

  const cartTaxAmount = useMemo(() => {
    return Number(((cartSubtotal + cartGiftBoxTotal) * (adminSettings.taxRatePercent / 100)).toFixed(2));
  }, [cartSubtotal, cartGiftBoxTotal, adminSettings.taxRatePercent]);

  const cartTotal = useMemo(() => {
    return Number((cartSubtotal + cartGiftBoxTotal + cartShippingFee + cartTaxAmount).toFixed(2));
  }, [cartSubtotal, cartGiftBoxTotal, cartShippingFee, cartTaxAmount]);

  // =========================================================================
  // ORDER PLACEMENT WITH REAL-TIME CLOUD FIRESTORE UPDATES
  // =========================================================================
  const placeOrder = (orderPayload: {
    shippingAddress: Address;
    payment: {
      type: 'card' | 'apple_pay' | 'cask_wire' | 'gift_card';
      cardLast4?: string;
      cardBrand?: string;
    };
    loyaltyPointsToUse: number;
    notes?: string;
  }): Order => {
    const discountFromPoints = Math.min(
      cartSubtotal,
      Number((orderPayload.loyaltyPointsToUse / adminSettings.pointsRedemptionRate).toFixed(2))
    );
    const finalTotal = Math.max(0, Number((cartTotal - discountFromPoints).toFixed(2)));
    const pointsEarned = Math.floor(finalTotal * adminSettings.pointsPerDollar);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ZUS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: 'Distillery Packing',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountFromPoints,
      giftBoxFee: cartGiftBoxTotal,
      shipping: cartShippingFee,
      tax: cartTaxAmount,
      total: finalTotal,
      payment: {
        type: orderPayload.payment.type,
        cardLast4: orderPayload.payment.cardLast4 ?? '8821',
        cardBrand: orderPayload.payment.cardBrand ?? 'Spirits Reserve Pay',
        transactionId: `txn_live_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        paidAt: new Date().toISOString()
      },
      shippingAddress: orderPayload.shippingAddress,
      trackingNumber: `ZUS-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      carrier: 'Spirits Express Priority Courier (Adult 21+ Required)',
      ageConfirmed: true,
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsUsed: orderPayload.loyaltyPointsToUse,
      notes: orderPayload.notes
    };

    // 1. Deduct Real-Time Inventory & Product Stock
    const updatedProducts = products.map(p => {
      const purchasedItem = cart.find(ci => ci.product.id === p.id);
      if (purchasedItem) {
        const remaining = Math.max(0, p.stockQuantity - purchasedItem.quantity);
        const up = { ...p, stockQuantity: remaining };
        saveCloudProduct(up).catch(e => console.warn('Cloud sync product stock notice:', e));
        return up;
      }
      return p;
    });
    setProducts(updatedProducts);

    const updatedLots = inventoryLots.map(lot => {
      const purchasedItem = cart.find(ci => ci.product.id === lot.productId);
      if (purchasedItem) {
        const remaining = Math.max(0, lot.bottlesInStock - purchasedItem.quantity);
        const newStatus: CaskAgingStatus =
          remaining === 0
            ? 'Sold Out'
            : remaining <= (products.find(p => p.id === lot.productId)?.lowStockThreshold ?? 15)
            ? 'Low Stock Alert'
            : lot.status;
        const upLot: DistillerInventoryItem = {
          ...lot,
          bottlesInStock: remaining,
          status: newStatus
        };
        saveCloudInventoryLot(upLot).catch(e => console.warn('Cloud sync inventory notice:', e));
        return upLot;
      }
      return lot;
    });
    setInventoryLots(updatedLots);

    // 2. Update Customer Points and Tier
    const netPoints = Math.max(0, customer.loyaltyPoints - orderPayload.loyaltyPointsToUse + pointsEarned);
    const newTotalSpent = customer.totalSpent + finalTotal;

    let newTier = customer.loyaltyTier;
    if (newTotalSpent >= 5000) {
      newTier = 'Master Distiller Circle';
    } else if (newTotalSpent >= 2000) {
      newTier = 'Gold Cask';
    } else if (newTotalSpent >= 750) {
      newTier = 'Silver Cask';
    }

    const updatedCust: CustomerUser = {
      ...customer,
      loyaltyPoints: netPoints,
      totalSpent: newTotalSpent,
      loyaltyTier: newTier
    };
    setCustomer(updatedCust);
    saveCloudCustomer(updatedCust).catch(e => console.warn('Cloud sync customer notice:', e));

    // 3. Save Order to Cloud Firestore & Local State
    setOrders(prev => [newOrder, ...prev]);
    saveCloudOrder(newOrder).catch(e => console.warn('Cloud sync order notice:', e));

    // 4. Clear cart
    clearCart();

    return newOrder;
  };

  // =========================================================================
  // DISTILLER INVENTORY CLOUD CRUD
  // =========================================================================
  const updateInventoryStock = (lotId: string, newStock: number) => {
    setInventoryLots(prevLots =>
      prevLots.map(lot => {
        if (lot.id === lotId) {
          const updated: DistillerInventoryItem = {
            ...lot,
            bottlesInStock: Math.max(0, newStock),
            lastInspectedDate: new Date().toISOString().split('T')[0]
          };
          saveCloudInventoryLot(updated).catch(e => console.warn('Cloud sync inventory notice:', e));

          // Sync with product catalog
          setProducts(prevProducts =>
            prevProducts.map(p => {
              if (p.id === lot.productId) {
                const upProd = { ...p, stockQuantity: Math.max(0, newStock) };
                saveCloudProduct(upProd).catch(e => console.warn('Cloud sync product notice:', e));
                return upProd;
              }
              return p;
            })
          );
          return updated;
        }
        return lot;
      })
    );
  };

  const updateCaskStatus = (lotId: string, status: CaskAgingStatus, notes?: string) => {
    setInventoryLots(prevLots =>
      prevLots.map(lot => {
        if (lot.id === lotId) {
          const updated: DistillerInventoryItem = {
            ...lot,
            status,
            distillerNotes: notes ? notes : lot.distillerNotes,
            lastInspectedDate: new Date().toISOString().split('T')[0]
          };
          saveCloudInventoryLot(updated).catch(e => console.warn('Cloud sync cask status notice:', e));
          return updated;
        }
        return lot;
      })
    );
  };

  const addInventoryLot = (lot: DistillerInventoryItem) => {
    setInventoryLots(prev => [lot, ...prev]);
    saveCloudInventoryLot(lot).catch(e => console.warn('Cloud sync new lot notice:', e));
  };

  const deleteInventoryLot = (lotId: string) => {
    setInventoryLots(prev => prev.filter(l => l.id !== lotId));
    deleteCloudInventoryLot(lotId).catch(e => console.warn('Cloud delete lot notice:', e));
  };

  // =========================================================================
  // PRODUCT CATALOG CLOUD CRUD
  // =========================================================================
  const updateProduct = (updated: SpiritProduct) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    saveCloudProduct(updated).catch(e => console.warn('Cloud sync product notice:', e));

    // Also update any matching inventory item
    setInventoryLots(prevLots =>
      prevLots.map(l => {
        if (l.productId === updated.id) {
          const upLot = { ...l, productName: updated.name, bottlesInStock: updated.stockQuantity };
          saveCloudInventoryLot(upLot).catch(e => console.warn('Cloud sync inventory notice:', e));
          return upLot;
        }
        return l;
      })
    );
  };

  const addProduct = (newProduct: SpiritProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    saveCloudProduct(newProduct).catch(e => console.warn('Cloud sync add product notice:', e));

    // Create companion inventory lot
    const newLot: DistillerInventoryItem = {
      id: `inv-${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      caskLotNumber: newProduct.caskNumber || `CASK-NEW-${Date.now().toString().slice(-4)}`,
      barrelType: newProduct.caskType || 'American White Oak',
      barrelStartDate: new Date().toISOString().split('T')[0],
      currentProof: newProduct.proof,
      warehouseLocation: 'Distillery Bond Vault A, Section 1',
      status: 'Ready for Dispatch',
      bottlesInStock: newProduct.stockQuantity,
      targetStock: newProduct.stockQuantity * 2,
      restockLeadDays: 14,
      distillerNotes: 'Freshly registered product batch into the inventory system.',
      lastInspectedDate: new Date().toISOString().split('T')[0]
    };
    setInventoryLots(prev => [newLot, ...prev]);
    saveCloudInventoryLot(newLot).catch(e => console.warn('Cloud sync companion lot notice:', e));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    deleteCloudProduct(productId).catch(e => console.warn('Cloud delete product notice:', e));

    // Delete companion lot
    const lotToDelete = inventoryLots.find(l => l.productId === productId);
    if (lotToDelete) {
      setInventoryLots(prev => prev.filter(l => l.productId !== productId));
      deleteCloudInventoryLot(lotToDelete.id).catch(e => console.warn('Cloud delete lot notice:', e));
    }
  };

  // =========================================================================
  // CMS CONTENT CLOUD CRUD (HOME, ABOUT, SETTINGS)
  // =========================================================================
  const updateHomeContent = (content: HomeContent) => {
    setHomeContent(content);
    saveCloudSiteContent('home', content).catch(e => console.warn('Cloud sync home content notice:', e));
  };

  const updateAboutContent = (content: AboutContent) => {
    setAboutContent(content);
    saveCloudSiteContent('about', content).catch(e => console.warn('Cloud sync about content notice:', e));
  };

  const updateAdminSettings = (settings: AdminSettings) => {
    setAdminSettings(settings);
    saveCloudSiteContent('settings', settings).catch(e => console.warn('Cloud sync admin settings notice:', e));
  };

  const updateHeaderConfig = (config: HeaderCustomizationConfig) => {
    const normalized = normalizeHeaderConfig(config);
    setHeaderConfig(normalized);
    saveCloudSiteContent('header', normalized).catch(e => console.warn('Cloud sync header config notice:', e));
  };

  const updateFooterConfig = (config: FooterCustomizationConfig) => {
    const normalized = normalizeFooterConfig(config);
    setFooterConfig(normalized);
    saveCloudSiteContent('footer', normalized).catch(e => console.warn('Cloud sync footer config notice:', e));
  };

  const resetHeaderFooterConfig = () => {
    setHeaderConfig(initialHeaderConfig);
    setFooterConfig(initialFooterConfig);
    saveCloudSiteContent('header', initialHeaderConfig).catch(e => console.warn('Cloud reset header notice:', e));
    saveCloudSiteContent('footer', initialFooterConfig).catch(e => console.warn('Cloud reset footer notice:', e));
  };

  const updateBottomNavbarConfig = (config: BottomNavbarCustomizationConfig) => {
    const normalized = normalizeBottomNavbarConfig(config);
    setBottomNavbarConfig(normalized);
    saveCloudSiteContent('bottom_navbar', normalized).catch(e => console.warn('Cloud sync bottom navbar config notice:', e));
  };

  const resetBottomNavbarConfig = () => {
    setBottomNavbarConfig(initialBottomNavbarConfig);
    saveCloudSiteContent('bottom_navbar', initialBottomNavbarConfig).catch(e => console.warn('Cloud reset bottom navbar notice:', e));
  };

  // =========================================================================
  // ORDER STATUS & MANAGEMENT CLOUD CRUD
  // =========================================================================
  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updated: Order = {
            ...o,
            status,
            trackingNumber: trackingNumber ? trackingNumber : o.trackingNumber
          };
          saveCloudOrder(updated).catch(e => console.warn('Cloud sync order status notice:', e));
          return updated;
        }
        return o;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    deleteCloudOrder(orderId).catch(e => console.warn('Cloud delete order notice:', e));
  };

  // =========================================================================
  // BLOG & FIELD NOTES CLOUD CRUD
  // ==========================================
  const addBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => [post, ...prev]);
    saveCloudBlogPost(post).catch(e => console.warn('Cloud add blog notice:', e));
  };

  const updateBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => prev.map(p => (p.id === post.id ? post : p)));
    saveCloudBlogPost(post).catch(e => console.warn('Cloud update blog notice:', e));
  };

  const deleteBlogPost = (postId: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== postId));
    deleteCloudBlogPost(postId).catch(e => console.warn('Cloud delete blog notice:', e));
  };

  const addBlogComment = (postId: string, comment: { name: string; text: string }) => {
    setBlogPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            name: comment.name || 'Spirits Connoisseur',
            date: new Date().toISOString().split('T')[0],
            text: comment.text
          };
          const updatedPost: BlogPost = { ...p, comments: [...p.comments, newComment] };
          saveCloudBlogPost(updatedPost).catch(e => console.warn('Cloud update comment notice:', e));
          return updatedPost;
        }
        return p;
      })
    );
  };

  // =========================================================================
  // CUSTOMER AUTHENTICATION & SESSION MANAGEMENT
  // =========================================================================
  const loginCustomer = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Check against demo accounts or existing loaded customer
    const matchedDemo = demoCustomers.find(d => d.email.toLowerCase() === trimmedEmail);
    let activeProfile: CustomerUser;

    if (matchedDemo) {
      activeProfile = matchedDemo;
    } else if (customer.email.toLowerCase() === trimmedEmail) {
      activeProfile = customer;
    } else {
      // Create new customer profile
      const namePart = trimmedEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      activeProfile = {
        id: `cust-user-${Date.now()}`,
        name: formattedName,
        email: trimmedEmail,
        phone: '+1 (555) 019-2831',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        loyaltyTier: 'Silver Cask',
        loyaltyPoints: 100,
        totalSpent: 0,
        dateJoined: new Date().toISOString().split('T')[0],
        emailNotifications: true,
        smsNotifications: false,
        spiritPreferences: ['Single Malt Whisky', 'Cask Strength Bourbon'],
        addresses: []
      };
    }

    setCustomer(activeProfile);
    setIsCustomerLoggedIn(true);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_logged_in`, 'true');
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_customer`, JSON.stringify(activeProfile));
    } catch (_) {}

    saveCloudCustomer(activeProfile).catch(e => console.warn('Cloud customer login save note:', e));

    if (authModalRedirectTab) {
      setActiveTab(authModalRedirectTab);
      setAuthModalRedirectTab(null);
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const registerCustomer = async (details: {
    name: string;
    email: string;
    phone?: string;
    spiritPreferences?: string[];
  }): Promise<{ success: boolean; error?: string }> => {
    if (!details.name.trim()) return { success: false, error: 'Please provide your full name.' };
    if (!details.email.trim() || !details.email.includes('@')) return { success: false, error: 'Please provide a valid email address.' };

    const newCust: CustomerUser = {
      id: `cust-patron-${Date.now()}`,
      name: details.name.trim(),
      email: details.email.trim().toLowerCase(),
      phone: details.phone?.trim() || '+1 (555) 012-3456',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      loyaltyTier: 'Silver Cask',
      loyaltyPoints: 100,
      totalSpent: 0,
      dateJoined: new Date().toISOString().split('T')[0],
      emailNotifications: true,
      smsNotifications: false,
      spiritPreferences: details.spiritPreferences && details.spiritPreferences.length > 0 ? details.spiritPreferences : ['Single Malt Whisky', 'Cask Strength Bourbon'],
      addresses: []
    };

    setCustomer(newCust);
    setIsCustomerLoggedIn(true);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_logged_in`, 'true');
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_customer`, JSON.stringify(newCust));
    } catch (_) {}

    saveCloudCustomer(newCust).catch(e => console.warn('Cloud customer registration note:', e));

    if (authModalRedirectTab) {
      setActiveTab(authModalRedirectTab);
      setAuthModalRedirectTab(null);
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logoutCustomer = async () => {
    setIsCustomerLoggedIn(false);
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_logged_in`, 'false');
    } catch (_) {}
  };

  const switchCustomerAccount = (customerId: string) => {
    const found = demoCustomers.find(d => d.id === customerId);
    if (found) {
      setCustomer(found);
      setIsCustomerLoggedIn(true);
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_is_logged_in`, 'true');
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_customer`, JSON.stringify(found));
      } catch (_) {}
      saveCloudCustomer(found).catch(e => console.warn('Cloud customer switch note:', e));
    }
  };

  // =========================================================================
  // CUSTOMER PROFILE & ADDRESSES CLOUD CRUD
  // =========================================================================
  const updateCustomerProfile = (updated: Partial<CustomerUser>) => {
    setCustomer(prev => {
      const full: CustomerUser = { ...prev, ...updated };
      saveCloudCustomer(full).catch(e => console.warn('Cloud customer notice:', e));
      return full;
    });
  };

  const addCustomerAddress = (address: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };
    setCustomer(prev => {
      const full: CustomerUser = {
        ...prev,
        addresses: [...prev.addresses, newAddr]
      };
      saveCloudCustomer(full).catch(e => console.warn('Cloud customer notice:', e));
      return full;
    });
  };

  const deleteCustomerAddress = (addressId: string) => {
    setCustomer(prev => {
      const full: CustomerUser = {
        ...prev,
        addresses: prev.addresses.filter(a => a.id !== addressId)
      };
      saveCloudCustomer(full).catch(e => console.warn('Cloud customer notice:', e));
      return full;
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setCustomer(prev => {
      const full: CustomerUser = {
        ...prev,
        addresses: prev.addresses.map(a => ({
          ...a,
          isDefault: a.id === addressId
        }))
      };
      saveCloudCustomer(full).catch(e => console.warn('Cloud customer notice:', e));
      return full;
    });
  };

  // Product Reviews & Connoisseur Feedback
  const getProductReviews = useCallback((productId: string): ProductReview[] => {
    return reviews.filter(r => r.productId === productId);
  }, [reviews]);

  const addProductReview = async (reviewData: Omit<ProductReview, 'id' | 'createdAt'>): Promise<ProductReview> => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      helpfulCount: reviewData.helpfulCount ?? 0,
      helpfulVoters: reviewData.helpfulVoters ?? [],
      date: reviewData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate product rating & reviewCount
    const productReviews = updatedReviews.filter(r => r.productId === reviewData.productId);
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / (productReviews.length || 1)).toFixed(2));
    const newReviewCount = productReviews.length;

    setProducts(prev => prev.map(p => {
      if (p.id === reviewData.productId) {
        const updatedProduct = { ...p, rating: avgRating, reviewCount: newReviewCount };
        saveCloudProduct(updatedProduct).catch(e => console.warn('Sync review update to product:', e));
        return updatedProduct;
      }
      return p;
    }));

    // Persist to Cloud Firestore
    saveCloudReview(newReview).catch(e => console.warn('Cloud save review error:', e));

    return newReview;
  };

  const deleteProductReview = async (reviewId: string): Promise<void> => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);

    if (reviewToDelete) {
      const productReviews = updatedReviews.filter(r => r.productId === reviewToDelete.productId);
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = productReviews.length > 0 ? Number((totalRating / productReviews.length).toFixed(2)) : 5.0;
      const newReviewCount = productReviews.length;

      setProducts(prev => prev.map(p => {
        if (p.id === reviewToDelete.productId) {
          const updatedProduct = { ...p, rating: avgRating, reviewCount: newReviewCount };
          saveCloudProduct(updatedProduct).catch(e => console.warn('Sync review delete to product:', e));
          return updatedProduct;
        }
        return p;
      }));
    }

    deleteCloudReview(reviewId).catch(e => console.warn('Cloud delete review error:', e));
  };

  const voteReviewHelpful = async (reviewId: string): Promise<void> => {
    const voterId = customer.id || 'guest-voter';
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const currentVoters = r.helpfulVoters || [];
        const alreadyVoted = currentVoters.includes(voterId);
        const updatedVoters = alreadyVoted ? currentVoters.filter(v => v !== voterId) : [...currentVoters, voterId];
        return {
          ...r,
          helpfulCount: updatedVoters.length,
          helpfulVoters: updatedVoters
        };
      }
      return r;
    }));
    voteHelpfulCloudReview(reviewId, voterId).catch(e => console.warn('Cloud vote review error:', e));
  };

  // ==========================================
  // BALLOT ALLOCATIONS & LOTTERY METHODS
  // ==========================================
  const getUserBallotEntries = useCallback((userId?: string): BallotEntry[] => {
    const targetId = userId || customer.id;
    return ballotEntries.filter(e => e.customerId === targetId);
  }, [ballotEntries, customer.id]);

  const registerBallotEntry = async (details: {
    allocationId: string;
    bottlesRequested: number;
    preferredBottleNumbers?: number[];
    collectorNotes?: string;
    shippingAddress?: Address;
  }): Promise<{ success: boolean; entry?: BallotEntry; error?: string }> => {
    const alloc = ballotAllocations.find(a => a.id === details.allocationId);
    if (!alloc) {
      return { success: false, error: 'Allocation release not found.' };
    }
    if (alloc.status !== 'open') {
      return { success: false, error: 'This allocation ballot is not currently accepting entries.' };
    }
    const maxAllowed = alloc.maxBottlesPerEntrant || 1;
    if (details.bottlesRequested > maxAllowed || details.bottlesRequested < 1) {
      return { success: false, error: `You may request between 1 and ${maxAllowed} bottle(s).` };
    }

    // Check if customer already entered
    const existing = ballotEntries.find(e => e.allocationId === details.allocationId && e.customerId === customer.id);
    if (existing) {
      return { success: false, error: `You are already registered for this draw (Ticket ${existing.ticketNumber}).` };
    }

    const ticketNumber = `BAL-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const entrantNumber = (alloc.totalEntrants || 0) + 1;

    const newEntry: BallotEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      allocationId: alloc.id,
      allocationTitle: alloc.title,
      productName: alloc.productName,
      bottlePrice: alloc.bottlePrice,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      loyaltyTier: customer.loyaltyTier,
      bottlesRequested: details.bottlesRequested,
      preferredBottleNumbers: details.preferredBottleNumbers || [],
      collectorNotes: details.collectorNotes || '',
      ticketNumber,
      entrantNumber,
      status: 'registered',
      registeredAt: new Date().toISOString(),
      shippingAddress: details.shippingAddress || customer.addresses?.[0]
    };

    const updatedEntries = [newEntry, ...ballotEntries];
    setBallotEntries(updatedEntries);

    // Update allocation counts
    const updatedAllocations = ballotAllocations.map(a => {
      if (a.id === alloc.id) {
        return {
          ...a,
          totalEntrants: (a.totalEntrants || 0) + 1,
          totalBottlesRequested: (a.totalBottlesRequested || 0) + details.bottlesRequested
        };
      }
      return a;
    });
    setBallotAllocations(updatedAllocations);

    // Sync to Cloud
    saveCloudBallotEntry(newEntry).catch(e => console.warn('Save cloud ballot entry notice:', e));
    const targetAlloc = updatedAllocations.find(a => a.id === alloc.id);
    if (targetAlloc) {
      saveCloudBallotAllocation(targetAlloc).catch(e => console.warn('Save cloud ballot alloc notice:', e));
    }

    return { success: true, entry: newEntry };
  };

  const drawBallotLottery = async (allocationId: string, winnersCount?: number): Promise<{ success: boolean; winnersSelected: number }> => {
    const alloc = ballotAllocations.find(a => a.id === allocationId);
    if (!alloc) return { success: false, winnersSelected: 0 };

    const pool = ballotEntries.filter(e => e.allocationId === allocationId && (e.status === 'registered' || e.status === 'waitlisted'));
    if (pool.length === 0) return { success: false, winnersSelected: 0 };

    const targetWinners = winnersCount ?? Math.min(alloc.totalBottlesAvailable, pool.length);
    
    // Random lottery shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedWinners = shuffled.slice(0, targetWinners);

    const now = new Date();
    const claimDeadline = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(); // 72 hours

    const winnerIds = new Set(selectedWinners.map(w => w.id));

    let serialCounter = 1;
    const updatedEntries = ballotEntries.map(entry => {
      if (entry.allocationId === allocationId) {
        if (winnerIds.has(entry.id)) {
          const serials: string[] = [];
          for (let i = 0; i < entry.bottlesRequested; i++) {
            const numStr = String(serialCounter++).padStart(3, '0');
            serials.push(`${numStr}/${alloc.totalBottlesAvailable}`);
          }
          const updated: BallotEntry = {
            ...entry,
            status: 'selected_winner',
            selectedAt: now.toISOString(),
            claimDeadline,
            assignedBottleNumbers: serials
          };
          saveCloudBallotEntry(updated).catch(e => console.warn('Update winner entry cloud:', e));
          return updated;
        } else if (entry.status === 'registered') {
          const updated: BallotEntry = {
            ...entry,
            status: 'waitlisted'
          };
          saveCloudBallotEntry(updated).catch(e => console.warn('Update waitlisted entry cloud:', e));
          return updated;
        }
      }
      return entry;
    });

    setBallotEntries(updatedEntries);

    const updatedAlloc: BallotAllocation = {
      ...alloc,
      status: 'drawing_completed',
      drawDate: now.toISOString()
    };

    setBallotAllocations(prev => prev.map(a => a.id === allocationId ? updatedAlloc : a));
    saveCloudBallotAllocation(updatedAlloc).catch(e => console.warn('Update allocation cloud:', e));

    return { success: true, winnersSelected: selectedWinners.length };
  };

  const claimBallotAllocation = async (entryId: string): Promise<{ success: boolean; orderId?: string }> => {
    const entry = ballotEntries.find(e => e.id === entryId);
    if (!entry || entry.status !== 'selected_winner') {
      return { success: false };
    }

    const alloc = ballotAllocations.find(a => a.id === entry.allocationId);
    if (!alloc) return { success: false };

    const orderNumber = `ZUS-ALLOC-${Math.floor(10000 + Math.random() * 90000)}`;
    const itemTotal = entry.bottlePrice * entry.bottlesRequested;
    const shippingFee = itemTotal >= adminSettings.freeShippingThreshold ? 0 : adminSettings.standardShippingRate;
    const tax = Number((itemTotal * (adminSettings.taxRatePercent / 100)).toFixed(2));
    const total = itemTotal + shippingFee + tax;

    const baseProduct = products.find(p => p.id === alloc.linkedProductId) || products[0];

    const orderedProduct: SpiritProduct = {
      id: alloc.linkedProductId || `prod-${alloc.id}`,
      name: alloc.productName,
      tagline: alloc.editionName,
      category: alloc.spiritCategory,
      price: alloc.bottlePrice,
      abv: `${alloc.abvPercent}%`,
      proof: Math.round(alloc.abvPercent * 2),
      bottleSize: alloc.bottleSize || '750ml',
      batchNumber: alloc.editionName,
      caskNumber: alloc.caskType,
      caskType: alloc.caskType,
      ageYears: parseInt(alloc.ageStatement, 10) || 12,
      stockQuantity: alloc.bottlesRemaining,
      lowStockThreshold: 5,
      distillerName: 'Zookas Unity Master Distiller',
      distillerOrigin: 'Cellar Vaults',
      description: alloc.description,
      tastingNotes: {
        aroma: alloc.tastingNotes.slice(0, 2),
        palate: alloc.tastingNotes.slice(2, 4),
        finish: alloc.tastingNotes.slice(4)
      },
      cocktailPairing: baseProduct?.cocktailPairing || {
        name: 'Neat in Glencairn',
        tagline: 'Pure Cask Expression',
        ingredients: ['2 oz Rare Spirit'],
        instructions: 'Serve at room temperature in a crystal Glencairn glass.',
        difficulty: 'Easy',
        glassware: 'Glencairn Glass'
      },
      awards: ['Master Distiller Private Allocation 2026'],
      images: [alloc.imageUrl],
      featured: true,
      isLimitedRelease: true,
      rating: 5.0,
      reviewCount: 1,
      releaseYear: alloc.distillationYear || 2026
    };

    const newOrder: Order = {
      id: `ord-ballot-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString(),
      status: 'Batch Sealed',
      items: [
        {
          product: orderedProduct,
          quantity: entry.bottlesRequested,
          giftBox: true,
          customEngraving: `Bottle ${entry.assignedBottleNumbers?.join(', ') || 'Official Rare Allocation'}`
        }
      ],
      subtotal: itemTotal,
      discount: 0,
      giftBoxFee: 0,
      shipping: shippingFee,
      tax,
      total,
      carrier: 'White-Glove Rare Spirits Bonded Courier',
      ageConfirmed: true,
      loyaltyPointsEarned: Math.floor(total * (adminSettings.pointsPerDollar || 10)),
      loyaltyPointsUsed: 0,
      shippingAddress: entry.shippingAddress || customer.addresses?.[0] || {
        id: 'addr-default',
        fullName: entry.customerName,
        street: '100 Heritage Cask Way',
        city: 'Napa',
        state: 'CA',
        zipCode: '94558',
        country: 'United States',
        phone: entry.customerPhone || '+1 (555) 000-0000',
        isDefault: true
      },
      payment: {
        type: 'cask_wire',
        cardBrand: 'Vault Allocation Secured Direct',
        transactionId: `txn_ballot_${Date.now()}`,
        paidAt: new Date().toISOString()
      },
      trackingNumber: `ZUS-ALLOC-${Math.floor(10000000 + Math.random() * 90000000)}`,
      notes: `Private Collector Ballot Winner Allocation: Ticket ${entry.ticketNumber}. Assigned Bottles: ${entry.assignedBottleNumbers?.join(', ')}`
    };

    // Update orders
    setOrders(prev => [newOrder, ...prev]);
    saveCloudOrder(newOrder).catch(e => console.warn('Save ballot order cloud:', e));

    // Mark entry as claimed
    const updatedEntry: BallotEntry = {
      ...entry,
      status: 'claimed_paid',
      claimedAt: new Date().toISOString()
    };
    setBallotEntries(prev => prev.map(e => e.id === entryId ? updatedEntry : e));
    saveCloudBallotEntry(updatedEntry).catch(e => console.warn('Save claimed entry cloud:', e));

    // Update remaining count on allocation
    setBallotAllocations(prev => prev.map(a => {
      if (a.id === alloc.id) {
        const remaining = Math.max(0, a.bottlesRemaining - entry.bottlesRequested);
        const updated: BallotAllocation = {
          ...a,
          bottlesRemaining: remaining,
          status: remaining === 0 ? 'sold_out' : a.status
        };
        saveCloudBallotAllocation(updated).catch(e => console.warn('Update alloc count cloud:', e));
        return updated;
      }
      return a;
    }));

    return { success: true, orderId: newOrder.id };
  };

  const saveBallotAllocation = async (allocation: BallotAllocation): Promise<void> => {
    setBallotAllocations(prev => {
      const exists = prev.some(a => a.id === allocation.id);
      if (exists) {
        return prev.map(a => a.id === allocation.id ? allocation : a);
      }
      return [allocation, ...prev];
    });
    await saveCloudBallotAllocation(allocation);
  };

  const deleteBallotAllocation = async (allocationId: string): Promise<void> => {
    setBallotAllocations(prev => prev.filter(a => a.id !== allocationId));
    await deleteCloudBallotAllocation(allocationId);
  };

  // Letterhead Management Helpers
  const saveLetterheadTemplate = async (template: LetterheadTemplate): Promise<void> => {
    setLetterheadTemplates(prev => {
      let updatedList = [...prev];
      if (template.isDefault) {
        updatedList = updatedList.map(t => ({ ...t, isDefault: t.id === template.id }));
      }
      const idx = updatedList.findIndex(t => t.id === template.id);
      if (idx >= 0) {
        updatedList[idx] = template;
      } else {
        updatedList.push(template);
      }
      return updatedList;
    });
    await saveCloudLetterhead(template);
  };

  const deleteLetterheadTemplate = async (templateId: string): Promise<void> => {
    setLetterheadTemplates(prev => prev.filter(t => t.id !== templateId));
    await deleteCloudLetterhead(templateId);
  };

  const setDefaultLetterheadTemplate = async (templateId: string): Promise<void> => {
    let targetTemplate: LetterheadTemplate | null = null;
    setLetterheadTemplates(prev => {
      return prev.map(t => {
        const isDef = t.id === templateId;
        const updated = { ...t, isDefault: isDef };
        if (isDef) targetTemplate = updated;
        return updated;
      });
    });
    if (targetTemplate) {
      await saveCloudLetterhead(targetTemplate);
    }
  };

  const saveLetterheadDocument = async (document: LetterheadDocument): Promise<void> => {
    setLetterheadDocuments(prev => {
      const idx = prev.findIndex(d => d.id === document.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = document;
        return updated;
      }
      return [document, ...prev];
    });
    await saveCloudLetterheadDocument(document);
  };

  const deleteLetterheadDocument = async (documentId: string): Promise<void> => {
    setLetterheadDocuments(prev => prev.filter(d => d.id !== documentId));
    await deleteCloudLetterheadDocument(documentId);
  };

  const getLetterheadTemplate = useCallback((templateId: string): LetterheadTemplate | undefined => {
    return letterheadTemplates.find(t => t.id === templateId) ||
           letterheadTemplates.find(t => t.isDefault) ||
           letterheadTemplates[0];
  }, [letterheadTemplates]);

  const resetAllData = () => {
    setProducts(initialProducts);
    setInventoryLots(initialInventoryLots);
    setCustomer(initialCustomer);
    setOrders(initialOrders);
    setBlogPosts(initialBlogPosts);
    setAboutContent(initialAboutContent);
    setHomeContent(initialHomeContent);
    setAdminSettings(initialAdminSettings);
    setHeaderConfig(initialHeaderConfig);
    setFooterConfig(initialFooterConfig);
    setBottomNavbarConfig(initialBottomNavbarConfig);
    setReviews(initialReviews);
    setBallotAllocations(initialBallotAllocations);
    setBallotEntries(initialBallotEntries);
    setLetterheadTemplates(initialLetterheadTemplates);
    setLetterheadDocuments(initialLetterheadDocuments);
    setCart([]);
    try { localStorage.clear(); } catch (_) {}
    // Reseed cloud
    forceCloudResync().catch(e => console.warn('Reset sync notice:', e));
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        activeProductModal,
        setActiveProductModal,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        selectedArticle,
        setSelectedArticle,
        ageVerified,
        setAgeVerified,
        ballotAllocations,
        ballotEntries,
        activeBallotModal,
        setActiveBallotModal,
        registerBallotEntry,
        drawBallotLottery,
        claimBallotAllocation,
        saveBallotAllocation,
        deleteBallotAllocation,
        getUserBallotEntries,
        cloudSyncStatus,
        lastSyncedAt,
        isCloudSeeding,
        forceCloudResync,
        uploadMedia,
        products,
        inventoryLots,
        cart,
        customer,
        isCustomerLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialTab,
        openAuthModal,
        closeAuthModal,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        switchCustomerAccount,
        demoCustomersList: demoCustomers,
        orders,
        blogPosts,
        aboutContent,
        homeContent,
        adminSettings,
        headerConfig,
        footerConfig,
        bottomNavbarConfig,
        reviews,
        getProductReviews,
        addProductReview,
        deleteProductReview,
        voteReviewHelpful,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleGiftBox,
        clearCart,
        cartCount,
        cartSubtotal,
        cartGiftBoxTotal,
        cartShippingFee,
        cartTaxAmount,
        cartTotal,
        placeOrder,
        updateInventoryStock,
        updateCaskStatus,
        addInventoryLot,
        deleteInventoryLot,
        updateProduct,
        addProduct,
        deleteProduct,
        updateHomeContent,
        updateAboutContent,
        updateAdminSettings,
        updateHeaderConfig,
        updateFooterConfig,
        updateBottomNavbarConfig,
        resetHeaderFooterConfig,
        resetBottomNavbarConfig,
        updateOrderStatus,
        updateOrderTracking: (orderId: string, trackingNumber: string) => {
          updateOrderStatus(orderId, 'Dispatched', trackingNumber);
        },
        deleteOrder,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addBlogComment,
        updateCustomerProfile,
        addCustomerAddress,
        deleteCustomerAddress,
        setDefaultAddress,
        letterheadTemplates,
        letterheadDocuments,
        saveLetterheadTemplate,
        deleteLetterheadTemplate,
        setDefaultLetterheadTemplate,
        saveLetterheadDocument,
        deleteLetterheadDocument,
        getLetterheadTemplate,
        resetAllData,
        resetToDefaultData: resetAllData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/currency';
import { CloudImageUploader } from '../CloudImageUploader';
import { AdminAuthLockScreen } from '../AdminAuthLockScreen';
import { HeaderCustomizer } from '../admin/HeaderCustomizer';
import { FooterCustomizer } from '../admin/FooterCustomizer';
import { BottomNavCustomizer } from '../admin/BottomNavCustomizer';
import { BallotDrawsAdmin } from '../admin/BallotDrawsAdmin';
import { LetterheadManager } from '../admin/LetterheadManager';
import { RegisteredUsersAdmin } from '../admin/RegisteredUsersAdmin';
import { 
  SpiritProduct, 
  DistillerInventoryItem, 
  Order, 
  BlogPost,
  SpiritCategory,
  OrderStatus,
  CarouselSlide,
  HeritageMilestone,
  ChronologyHeritageConfig,
  MasterDistiller,
  HomeArtisansConfig,
  CoreValueItem,
  GuidingPrinciplesConfig
} from '../../types';
import { renderPrincipleIcon } from '../GuidingPrinciplesSection';
import { 
  BarChart3, 
  Layers, 
  Package, 
  Sliders, 
  FileEdit, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Save, 
  TrendingUp, 
  AlertTriangle, 
  Wine, 
  Building2, 
  Truck, 
  DollarSign,
  Sparkles,
  ExternalLink,
  Printer,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Image as ImageIcon,
  History,
  Clock,
  Calendar,
  Flame,
  Users,
  Award,
  Leaf,
  HeartHandshake,
  ShieldCheck,
  Target,
  Globe,
  Quote,
  Sparkle,
  Droplet,
  Compass,
  Cloud,
  Database,
  RefreshCw,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Hash,
  ShieldAlert,
  Key,
  LayoutTemplate,
  PanelBottom,
  Crown,
  Ticket,
  Smartphone,
  Stamp,
  HardDrive
} from 'lucide-react';
import { MediaDriveAdmin } from '../admin/MediaDriveAdmin';

export const AdminPanelView: React.FC = () => {
  const {
    adminSettings,
    updateAdminSettings,
    homeContent,
    updateHomeContent,
    aboutContent,
    updateAboutContent,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    inventoryLots,
    updateInventoryStock,
    updateCaskStatus,
    addInventoryLot,
    orders,
    updateOrderStatus,
    updateOrderTracking,
    setActiveInvoiceOrder,
    blogPosts,
    addBlogPost,
    deleteBlogPost,
    resetToDefaultData,
    ballotAllocations,
    ballotEntries,
    letterheadDocuments,
    letterheadTemplates,
    driveAssets,
    registeredCustomers,
    cloudSyncStatus,
    lastSyncedAt,
    forceCloudResync,
    isCloudSeeding
  } = useStore();

  // Authentication State for Admin CMS
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('zookas_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleLockVault = () => {
    try {
      sessionStorage.removeItem('zookas_admin_auth');
      sessionStorage.removeItem('zookas_admin_auth_time');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    showSaveSuccess('Distillery Vault locked. Security credentials required.');
  };

  // Password / PIN reveal state in CMS Settings
  const [showSettingsPassword, setShowSettingsPassword] = useState<boolean>(false);
  const [showSettingsPin, setShowSettingsPin] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'inventory' | 'products' | 'ballots' | 'orders' | 'drive' | 'cms_letterheads' | 'cms_header' | 'cms_bottom_nav' | 'cms_home' | 'cms_about' | 'cms_footer' | 'cms_settings' | 'blog'>('inventory');

  // Product Modal state (Add / Edit)
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<SpiritProduct>>({
    name: '',
    category: 'Single Malt Whisky',
    tagline: '',
    price: 150,
    salePrice: undefined,
    abv: '46.5%',
    proof: 93,
    bottleSize: '750ml',
    caskType: 'First-Fill Oloroso Sherry Hogshead',
    caskNumber: 'CASK-2026-X',
    distillerName: 'Master Distiller Angus MacLeod',
    distillerOrigin: 'Speyside Glen, Highlands',
    ageYears: 18,
    description: '',
    tastingNotes: {
      aroma: ['Dark Fig', 'Rich Toffee', 'Spanish Oak'],
      palate: ['Spiced Plum', 'Demerara Molasses', 'Roasted Walnut'],
      finish: ['Long, warm, drying oak tannin with lingering heather honey']
    },
    images: ['https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=80'],
    stockQuantity: 24,
    lowStockThreshold: 10,
    isLimitedRelease: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 18
  });

  // New Inventory Lot Modal
  const [caskModalOpen, setCaskModalOpen] = useState<boolean>(false);
  const [caskForm, setCaskForm] = useState<Omit<DistillerInventoryItem, 'id'>>({
    caskLotNumber: 'CASK-2026-N',
    spiritName: 'Single Malt Port Cask Special',
    spiritId: products[0]?.id || '',
    barrelType: 'Ruby Port Pipe (550 Liters)',
    distillationDate: '2010-04-15',
    caskFillProof: 122.4,
    currentProof: 114.8,
    totalBottlesCapacity: 340,
    availableBottlesInBond: 180,
    agingStatus: 'Aging in Bond',
    warehouseLocation: 'Speyside Warehouse #3, Tier 4',
    masterDistillerNotes: 'Superb berry aromatics, tannin developing gracefully.'
  });

  // Local CMS form states
  const [cmsHomeState, setCmsHomeState] = useState(homeContent);
  const [cmsAboutState, setCmsAboutState] = useState(aboutContent);
  const [cmsSettingsState, setCmsSettingsState] = useState(adminSettings);
  const [saveBanner, setSaveBanner] = useState<string>('');

  // Carousel Slide Modal State (Add / Edit)
  const [slideModalOpen, setSlideModalOpen] = useState<boolean>(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState<CarouselSlide>({
    id: '',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1920&q=85',
    heading: '',
    subtitle: '',
    badge: '⭐ Limited Cask Allocation',
    ctaText: 'Explore Spirits Vault',
    ctaAction: 'shop'
  });

  const distilleryImagePresets = [
    { label: 'Oak Barrels Cellar', url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1920&q=85' },
    { label: 'Amber Spirit Bottles', url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1920&q=85' },
    { label: 'Scottish Copper Stills', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1920&q=85' },
    { label: 'Wild Alpine Harvest', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=85' },
    { label: 'Bond Warehouse Loft', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1920&q=85' },
    { label: 'Tasting Glass & Wood', url: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1920&q=85' }
  ];

  const handleOpenAddSlide = () => {
    setEditingSlideId(null);
    setSlideForm({
      id: `slide-${Date.now()}`,
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1920&q=85',
      heading: 'New Master Distiller Cask Release',
      subtitle: 'Small-batch allocation drawn from charred American white oak barrels.',
      badge: '🔥 New Limited Batch',
      ctaText: 'Reserve Bottle',
      ctaAction: 'shop'
    });
    setSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: CarouselSlide) => {
    setEditingSlideId(slide.id);
    setSlideForm({ ...slide });
    setSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSlides = cmsHomeState.carouselSlides || [];
    let updatedSlides: CarouselSlide[];

    if (editingSlideId) {
      updatedSlides = currentSlides.map(s => s.id === editingSlideId ? slideForm : s);
    } else {
      updatedSlides = [...currentSlides, slideForm];
    }

    const updatedHome = {
      ...cmsHomeState,
      carouselSlides: updatedSlides,
      heroHeading: updatedSlides[0]?.heading || cmsHomeState.heroHeading,
      heroSubheading: updatedSlides[0]?.subtitle || cmsHomeState.heroSubheading,
      heroBgImage: updatedSlides[0]?.image || cmsHomeState.heroBgImage,
      heroBadgeText: updatedSlides[0]?.badge || cmsHomeState.heroBadgeText,
      heroCtaText: updatedSlides[0]?.ctaText || cmsHomeState.heroCtaText,
    };

    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    setSlideModalOpen(false);
    showSaveSuccess(editingSlideId ? 'Carousel slide updated and saved!' : 'New carousel slide added to Home showcase!');
  };

  const handleDeleteSlide = (slideId: string) => {
    const currentSlides = cmsHomeState.carouselSlides || [];
    if (currentSlides.length <= 1) {
      alert('The Home page carousel must contain at least 1 slide.');
      return;
    }
    const updatedSlides = currentSlides.filter(s => s.id !== slideId);
    const updatedHome = {
      ...cmsHomeState,
      carouselSlides: updatedSlides,
      heroHeading: updatedSlides[0]?.heading || cmsHomeState.heroHeading,
      heroSubheading: updatedSlides[0]?.subtitle || cmsHomeState.heroSubheading,
      heroBgImage: updatedSlides[0]?.image || cmsHomeState.heroBgImage,
    };
    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    showSaveSuccess('Slide removed from Home carousel.');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const currentSlides = [...(cmsHomeState.carouselSlides || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSlides.length) return;

    const temp = currentSlides[index];
    currentSlides[index] = currentSlides[targetIndex];
    currentSlides[targetIndex] = temp;

    const updatedHome = {
      ...cmsHomeState,
      carouselSlides: currentSlides,
      heroHeading: currentSlides[0]?.heading || cmsHomeState.heroHeading,
      heroSubheading: currentSlides[0]?.subtitle || cmsHomeState.heroSubheading,
      heroBgImage: currentSlides[0]?.image || cmsHomeState.heroBgImage,
    };
    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    showSaveSuccess('Carousel slide order updated!');
  };

  // Heritage Chronology Milestone Modal State
  const [milestoneModalOpen, setMilestoneModalOpen] = useState<boolean>(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState<HeritageMilestone>({
    id: '',
    year: '1923',
    title: 'The Hidden Granite Cellars',
    subtitle: 'Secret Solera Barrels & Underground Vaults',
    description: 'Historical accounts of unhurried spirits maturation and oak barrel aging.',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    caskType: 'Perpetual Solera Puncheons',
    tag: 'Cask Aging Era',
    statLabel: 'Cellar Temp',
    statValue: '54°F Microclimate'
  });

  const heritageImagePresets = [
    { label: 'Historic Scottish Stills', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Granite Solera Vaults', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Charred Oak Burning', url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Jerez Sherry Bodega', url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Alpine Botanical Harvest', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Double Gold Tasting Loft', url: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80' }
  ];

  const handleOpenAddMilestone = () => {
    setEditingMilestoneId(null);
    setMilestoneForm({
      id: `milestone-${Date.now()}`,
      year: `${new Date().getFullYear()}`,
      title: 'New Distillation Milestone',
      subtitle: 'Distillery Innovation & Cask Heritage',
      description: 'Document the historical breakthrough, cooperage technique, or still engineering milestone.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
      caskType: 'Charred American White Oak',
      tag: 'New Era',
      statLabel: 'Distillation Spec',
      statValue: 'Single Batch Allocation'
    });
    setMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (m: HeritageMilestone) => {
    setEditingMilestoneId(m.id);
    setMilestoneForm({ ...m });
    setMilestoneModalOpen(true);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const currentHeritage = cmsHomeState.heritageChronology || {
      showSection: true,
      sectionBadge: '⏳ Over A Century of Distilling Mastery',
      sectionTitle: 'Chronology & Distillation Heritage',
      sectionSubtitle: 'Traced through five generations of unhurried distillation, hand-hammered Scottish copper stills, and rare Iberian sherry hogsheads.',
      milestones: []
    };

    const currentMilestones = currentHeritage.milestones || [];
    let updatedMilestones: HeritageMilestone[];

    if (editingMilestoneId) {
      updatedMilestones = currentMilestones.map(m => m.id === editingMilestoneId ? milestoneForm : m);
    } else {
      updatedMilestones = [...currentMilestones, milestoneForm];
    }

    const updatedHome = {
      ...cmsHomeState,
      heritageChronology: {
        ...currentHeritage,
        milestones: updatedMilestones
      }
    };

    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    setMilestoneModalOpen(false);
    showSaveSuccess(editingMilestoneId ? 'Heritage milestone updated!' : 'New heritage milestone added to Chronology!');
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    const currentHeritage = cmsHomeState.heritageChronology;
    if (!currentHeritage || (currentHeritage.milestones || []).length <= 1) {
      alert('The Chronology section must contain at least 1 milestone.');
      return;
    }

    const updatedMilestones = currentHeritage.milestones.filter(m => m.id !== milestoneId);
    const updatedHome = {
      ...cmsHomeState,
      heritageChronology: {
        ...currentHeritage,
        milestones: updatedMilestones
      }
    };

    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    showSaveSuccess('Heritage milestone removed from Chronology.');
  };

  const handleMoveMilestone = (index: number, direction: 'up' | 'down') => {
    const currentHeritage = cmsHomeState.heritageChronology;
    if (!currentHeritage || !currentHeritage.milestones) return;

    const currentMilestones = [...currentHeritage.milestones];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentMilestones.length) return;

    const temp = currentMilestones[index];
    currentMilestones[index] = currentMilestones[targetIndex];
    currentMilestones[targetIndex] = temp;

    const updatedHome = {
      ...cmsHomeState,
      heritageChronology: {
        ...currentHeritage,
        milestones: currentMilestones
      }
    };

    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    showSaveSuccess('Milestone chronological sequence updated!');
  };

  // Master Distiller / Artisans Modal State
  const [distillerModalOpen, setDistillerModalOpen] = useState<boolean>(false);
  const [editingDistillerId, setEditingDistillerId] = useState<string | null>(null);
  const [distillerForm, setDistillerForm] = useState<MasterDistiller>({
    id: '',
    name: 'Alistair Vance',
    role: 'Master Distiller & Cask Curator',
    bio: '34 years of whisky crafting across Speyside and Islay. Renowned worldwide for pioneering octave sherry finishes and multi-cask vatting.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    experienceYears: 34,
    signatureSpirit: '18-Year Single Malt & Rare 25-Year Peated Reserve'
  });

  const distillerImagePresets = [
    { label: 'Alistair Vance (Speyside)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    { label: 'Colt Sterling (Kentucky)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
    { label: 'Elena Rostova (Botanicals)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
    { label: 'Joaquin Ramos (Mezcalero)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { label: 'Marcus Campbell (Highlands)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
    { label: 'Sofia Sterling (Cooperage)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' }
  ];

  const handleOpenAddDistiller = () => {
    setEditingDistillerId(null);
    setDistillerForm({
      id: `distiller-${Date.now()}`,
      name: '',
      role: 'Master Blender & Cask Specialist',
      bio: 'Decades of dedicated distillation mastery, sensory analysis, and wood maturation craft.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      experienceYears: 20,
      signatureSpirit: 'Single Cask Limited Reserve'
    });
    setDistillerModalOpen(true);
  };

  const handleOpenEditDistiller = (distiller: MasterDistiller) => {
    setEditingDistillerId(distiller.id);
    setDistillerForm({ ...distiller });
    setDistillerModalOpen(true);
  };

  const handleSaveDistiller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distillerForm.name) return;

    const currentDistillers = cmsAboutState.masterDistillers || [];
    let updatedDistillers: MasterDistiller[];

    if (editingDistillerId) {
      updatedDistillers = currentDistillers.map(d => d.id === editingDistillerId ? distillerForm : d);
    } else {
      updatedDistillers = [...currentDistillers, distillerForm];
    }

    const updatedAbout = {
      ...cmsAboutState,
      masterDistillers: updatedDistillers
    };

    setCmsAboutState(updatedAbout);
    updateAboutContent(updatedAbout);

    // Also sync with Home artisans config if present
    if (cmsHomeState.artisansSection) {
      const updatedHome = {
        ...cmsHomeState,
        artisansSection: {
          ...cmsHomeState.artisansSection,
          distillers: updatedDistillers
        }
      };
      setCmsHomeState(updatedHome);
      updateHomeContent(updatedHome);
    }

    setDistillerModalOpen(false);
    showSaveSuccess(editingDistillerId ? `Updated profile for "${distillerForm.name}"!` : `Added new artisan "${distillerForm.name}" to the distillery roster!`);
  };

  const handleDeleteDistiller = (distillerId: string) => {
    const currentDistillers = cmsAboutState.masterDistillers || [];
    if (currentDistillers.length <= 1) {
      alert('You must have at least 1 master distiller.');
      return;
    }

    const updatedDistillers = currentDistillers.filter(d => d.id !== distillerId);
    const updatedAbout = {
      ...cmsAboutState,
      masterDistillers: updatedDistillers
    };

    setCmsAboutState(updatedAbout);
    updateAboutContent(updatedAbout);

    if (cmsHomeState.artisansSection) {
      const updatedHome = {
        ...cmsHomeState,
        artisansSection: {
          ...cmsHomeState.artisansSection,
          distillers: updatedDistillers
        }
      };
      setCmsHomeState(updatedHome);
      updateHomeContent(updatedHome);
    }

    showSaveSuccess('Artisan removed from master distiller roster.');
  };

  const handleMoveDistiller = (index: number, direction: 'up' | 'down') => {
    const currentDistillers = [...(cmsAboutState.masterDistillers || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentDistillers.length) return;

    const temp = currentDistillers[index];
    currentDistillers[index] = currentDistillers[targetIndex];
    currentDistillers[targetIndex] = temp;

    const updatedAbout = {
      ...cmsAboutState,
      masterDistillers: currentDistillers
    };

    setCmsAboutState(updatedAbout);
    updateAboutContent(updatedAbout);

    if (cmsHomeState.artisansSection) {
      const updatedHome = {
        ...cmsHomeState,
        artisansSection: {
          ...cmsHomeState.artisansSection,
          distillers: currentDistillers
        }
      };
      setCmsHomeState(updatedHome);
      updateHomeContent(updatedHome);
    }

    showSaveSuccess('Artisan sequence updated!');
  };

  // Guiding Principles & Core Values CMS State
  const [valueModalOpen, setValueModalOpen] = useState<boolean>(false);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [valueForm, setValueForm] = useState<CoreValueItem>({
    id: '',
    title: 'Uncompromising Purity & Alchemy',
    description: 'Never chill-filtered, never artificially colored, and distilled exclusively in hand-hammered copper pot stills.',
    icon: 'Flame',
    tag: '100% Pure Distillate'
  });

  const availableValueIcons = [
    { name: 'Flame', label: 'Flame / Fire' },
    { name: 'Clock', label: 'Clock / Aging' },
    { name: 'Leaf', label: 'Leaf / Terroir' },
    { name: 'Award', label: 'Award / Mastery' },
    { name: 'ShieldCheck', label: 'Shield / Integrity' },
    { name: 'HeartHandshake', label: 'Fellowship / Unity' },
    { name: 'Sparkles', label: 'Sparkles / Alchemy' },
    { name: 'Wine', label: 'Wine / Cask' },
    { name: 'Droplet', label: 'Droplet / Water' },
    { name: 'Compass', label: 'Compass / Heritage' },
    { name: 'Eye', label: 'Eye / Sensory' },
    { name: 'Layers', label: 'Layers / Solera' },
    { name: 'Globe', label: 'Globe / World' },
    { name: 'Building2', label: 'Distillery Forge' },
    { name: 'Target', label: 'Target / Focus' }
  ];

  const missionImagePresets = [
    { label: 'Twin Copper Stills', url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Historic Scottish Mash', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Pure Glacial Spring', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80' }
  ];

  const visionImagePresets = [
    { label: 'Charred Solera Barrels', url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Underground Granite Vaults', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Global Tasting Loft', url: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80' }
  ];

  const handleOpenAddValue = () => {
    setEditingValueId(null);
    setValueForm({
      id: `val-${Date.now()}`,
      title: '',
      description: '',
      icon: 'Flame',
      tag: 'Distillery Standard'
    });
    setValueModalOpen(true);
  };

  const handleOpenEditValue = (val: CoreValueItem) => {
    setEditingValueId(val.id);
    setValueForm({ ...val });
    setValueModalOpen(true);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueForm.title) return;

    const currentConfig = cmsHomeState.guidingPrinciples || {
      showSection: true,
      sectionBadge: '🏛️ Foundational Creed & Distillation Ethics',
      sectionTitle: 'Guiding Principles: Mission, Vision & Core Values',
      sectionSubtitle: 'The unyielding standards and spiritual ethos that govern every drop distilled, barrel charred, and bottle hand-sealed at Zookas Unity Spirits.',
      missionBadge: 'Our Sacred Calling',
      missionTitle: 'The Mission',
      missionStatement: 'To unite the world’s most revered distillation traditions through uncompromising artisanal craftsmanship...',
      missionHighlightQuote: '“Every harvest, every mash bill, every single cask is bottled with pure integrity.”',
      missionImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80',
      visionBadge: 'Our Century Horizon',
      visionTitle: 'The Vision',
      visionStatement: 'To lead the global renaissance of independent craft distillation...',
      visionHighlightQuote: '“We do not distill for quarterly yields; we distill for the century ahead.”',
      visionImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80',
      valuesTitle: 'Pillars of Distillation Craft',
      valuesSubtitle: 'Six fundamental convictions that guide our masters from mountain spring to sealed crystal bottle.',
      values: []
    };

    const currentValues = currentConfig.values || [];
    let updatedValues: CoreValueItem[];

    if (editingValueId) {
      updatedValues = currentValues.map(v => v.id === editingValueId ? valueForm : v);
    } else {
      updatedValues = [...currentValues, valueForm];
    }

    const updatedHome = {
      ...cmsHomeState,
      guidingPrinciples: {
        ...currentConfig,
        values: updatedValues
      }
    };

    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    setValueModalOpen(false);
    showSaveSuccess(editingValueId ? `Updated core value "${valueForm.title}"!` : `Added new core value "${valueForm.title}"!`);
  };

  const handleDeleteValue = (valId: string) => {
    const currentConfig = cmsHomeState.guidingPrinciples;
    if (!currentConfig || (currentConfig.values || []).length <= 1) {
      alert('You must have at least 1 core value.');
      return;
    }

    const updatedValues = currentConfig.values.filter(v => v.id !== valId);
    const updatedHome = {
      ...cmsHomeState,
      guidingPrinciples: {
        ...currentConfig,
        values: updatedValues
      }
    };

    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    showSaveSuccess('Core value removed from Guiding Principles.');
  };

  const handleMoveValue = (index: number, direction: 'up' | 'down') => {
    const currentConfig = cmsHomeState.guidingPrinciples;
    if (!currentConfig || !currentConfig.values) return;

    const currentValues = [...currentConfig.values];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentValues.length) return;

    const temp = currentValues[index];
    currentValues[index] = currentValues[targetIndex];
    currentValues[targetIndex] = temp;

    const updatedHome = {
      ...cmsHomeState,
      guidingPrinciples: {
        ...currentConfig,
        values: currentValues
      }
    };

    setCmsHomeState(updatedHome);
    updateHomeContent(updatedHome);
    showSaveSuccess('Core value sequence updated!');
  };

  // Blog Form state
  const [blogModalOpen, setBlogModalOpen] = useState<boolean>(false);
  const [blogForm, setBlogForm] = useState<Omit<BlogPost, 'id' | 'comments'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: {
      name: 'Angus MacLeod',
      role: 'Master Distiller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    publishedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=80',
    category: 'Distillation Science',
    tags: ['Distillation', 'Craft Spirits']
  });

  const showSaveSuccess = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(''), 4000);
  };

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalBottlesSold = orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);
  const totalBottlesInBond = inventoryLots.reduce((sum, lot) => sum + lot.availableBottlesInBond, 0);
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold);

  // Handlers for products
  const handleOpenEditProduct = (prod: SpiritProduct) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    setProductModalOpen(true);
  };

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'Single Malt Whisky',
      tagline: 'Artisanal Single Cask Expression',
      price: 180,
      abv: '48.0%',
      proof: 96,
      bottleSize: '750ml',
      caskType: 'Charred American White Oak',
      caskNumber: `CASK-${Math.floor(1000 + Math.random() * 9000)}`,
      distillerName: 'Angus MacLeod',
      distillerOrigin: 'Speyside Vault',
      ageYears: 12,
      description: 'Hand-distilled with pure mountain water and single-origin malted barley.',
      tastingNotes: {
        aroma: ['Caramel', 'Toasted Oak', 'Vanilla'],
        palate: ['Dark Chocolate', 'Ripe Fig', 'Clove'],
        finish: ['Warm lingering spice and gentle smoke']
      },
      images: ['https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=80'],
      stockQuantity: 40,
      lowStockThreshold: 10,
      isLimitedRelease: true,
      featured: false,
      rating: 4.8,
      reviewsCount: 12
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
      showSaveSuccess(`Updated spirit "${productForm.name}" successfully!`);
    } else {
      addProduct(productForm as any);
      showSaveSuccess(`Created new spirit "${productForm.name}"!`);
    }
    setProductModalOpen(false);
  };

  const handleSaveCaskLot = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryLot(caskForm);
    setCaskModalOpen(false);
    showSaveSuccess(`Added Distiller Cask Lot #${caskForm.caskLotNumber}!`);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title) return;
    addBlogPost(blogForm);
    setBlogModalOpen(false);
    showSaveSuccess(`Published blog article "${blogForm.title}"!`);
  };

  // If Administrator is not authenticated with Password or PIN, display the security lock screen
  if (!isAuthenticated) {
    return <AdminAuthLockScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Admin & Distiller Operations Center
            </span>
            <span className="text-xs text-stone-500 font-mono">v2.4 Live Real-Time DB</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Vault Authenticated</span>
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-100 mt-1">
            Zookas Unity Spirits Management Console
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Full control over bond house inventory, catalog CRUD, order fulfillment, and website CMS content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Cloud Database Connection Card */}
          <div className="flex items-center gap-3 px-3.5 py-2 bg-stone-900/90 border border-stone-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Cloud className="w-4 h-4 text-amber-400" />
                <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                  cloudSyncStatus === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-spin'
                }`} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Google Cloud DB</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    cloudSyncStatus === 'connected' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {cloudSyncStatus === 'connected' ? 'Real-Time Sync' : 'Syncing...'}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono block">
                  {lastSyncedAt ? `Synced ${lastSyncedAt.toLocaleTimeString()}` : 'Cloud Connected'}
                </span>
              </div>
            </div>

            <button
              onClick={async () => {
                await forceCloudResync();
                showSaveSuccess('Google Cloud Database & Storage synchronized!');
              }}
              disabled={isCloudSeeding}
              title="Force synchronize all local data to Google Cloud Firestore"
              className="p-1.5 bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-400 rounded-lg transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCloudSeeding ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Lock Vault Button */}
          <button
            type="button"
            onClick={handleLockVault}
            title="Lock the Admin CMS immediately and require Password/PIN to re-enter"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-amber-950/80 text-amber-400 hover:text-amber-300 border border-stone-800 hover:border-amber-700/60 text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Vault</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset entire app data to factory distillery defaults?')) {
                resetToDefaultData();
                showSaveSuccess('App state reset to initial catalog & CMS defaults.');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-semibold rounded-xl border border-stone-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {saveBanner && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 shadow-lg">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Financials & KPI Overview', icon: BarChart3 },
          { id: 'users', label: `Registered Patrons & Google Logins (${registeredCustomers.length})`, icon: Users },
          { id: 'inventory', label: `Distiller Real-Time Cask Tracker (${inventoryLots.length})`, icon: Layers },
          { id: 'products', label: `Spirits Catalog Manager (${products.length})`, icon: Wine },
          { id: 'drive', label: `Drive Media Cloud (${driveAssets?.length || 0})`, icon: HardDrive },
          { id: 'ballots', label: `Rare Allocations & Ballots (${ballotAllocations.length})`, icon: Crown },
          { id: 'orders', label: `Order Fulfillment (${orders.length})`, icon: Truck },
          { id: 'cms_letterheads', label: `Stationery & Letterheads (${letterheadDocuments?.length || 0})`, icon: Stamp },
          { id: 'cms_header', label: 'Header & Navigation CMS', icon: LayoutTemplate },
          { id: 'cms_bottom_nav', label: 'Bottom Navigation Bar CMS', icon: Smartphone },
          { id: 'cms_home', label: 'Home Page CMS', icon: FileEdit },
          { id: 'cms_about', label: 'About Page CMS', icon: Building2 },
          { id: 'cms_footer', label: 'Footer & Newsletter CMS', icon: PanelBottom },
          { id: 'cms_settings', label: 'Store & Taxes Config', icon: Sliders },
          { id: 'blog', label: `Mixology & Blog (${blogPosts.length})`, icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
              <span className="text-xs text-stone-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Gross Vault Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </span>
              <strong className="font-serif text-3xl font-bold text-amber-400 block">
                {formatPrice(totalRevenue, adminSettings.currencySymbol)}
              </strong>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +24.5% vs previous allocation
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
              <span className="text-xs text-stone-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Bottles Allocated</span>
                <Wine className="w-4 h-4 text-amber-400" />
              </span>
              <strong className="font-serif text-3xl font-bold text-stone-100 block">
                {totalBottlesSold} Bottles
              </strong>
              <span className="text-[11px] text-stone-400">Across {orders.length} client manifests</span>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
              <span className="text-xs text-stone-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Bond House Stock</span>
                <Layers className="w-4 h-4 text-amber-400" />
              </span>
              <strong className="font-serif text-3xl font-bold text-stone-100 block">
                {totalBottlesInBond} Bottles
              </strong>
              <span className="text-[11px] text-stone-400">Across {inventoryLots.length} registered casks</span>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
              <span className="text-xs text-stone-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Low-Stock Warnings</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </span>
              <strong className="font-serif text-3xl font-bold text-rose-400 block">
                {lowStockProducts.length} Spirits
              </strong>
              <span className="text-[11px] text-rose-400/80">Requires immediate distillery cask draw</span>
            </div>

            <div
              onClick={() => setActiveTab('users')}
              className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 cursor-pointer hover:border-amber-500/50 transition group"
            >
              <span className="text-xs text-stone-400 uppercase tracking-wider block flex items-center justify-between">
                <span>Registered Patrons</span>
                <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </span>
              <strong className="font-serif text-3xl font-bold text-stone-100 block">
                {registeredCustomers.length} Patrons
              </strong>
              <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                <span>View Google & Email Directory →</span>
              </span>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800/40 space-y-4">
              <h3 className="font-serif text-base font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Distillery Re-Bottling Alerts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-200">{p.name}</p>
                      <p className="text-stone-500">Cask: {p.caskNumber}</p>
                    </div>
                    <span className="px-2 py-1 bg-rose-900/80 text-rose-200 font-bold rounded">
                      {p.stockQuantity} Left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* REGISTERED PATRONS & GOOGLE LOGINS CMS */}
      {activeTab === 'users' && <RegisteredUsersAdmin />}

      {/* 2. REAL-TIME DISTILLER INVENTORY TRACKER */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">
                Bond House Casks & Real-Time Stock Tracker
              </h3>
              <p className="text-xs text-stone-400">
                Any bottle adjustment here immediately syncs with the online store's live availability.
              </p>
            </div>
            <button
              onClick={() => setCaskModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Cask Lot</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs divide-y divide-stone-800">
              <thead className="bg-stone-950/80 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Cask Lot #</th>
                  <th className="p-4">Spirit & Wood Type</th>
                  <th className="p-4">Proof (Filled / Current)</th>
                  <th className="p-4">Bond Aging Status</th>
                  <th className="p-4">Warehouse Vault</th>
                  <th className="p-4 text-center">Available Stock</th>
                  <th className="p-4 text-right">Quick Stock Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-stone-300">
                {inventoryLots.map((lot) => {
                  return (
                    <tr key={lot.id} className="hover:bg-stone-850/50 transition">
                      <td className="p-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                        {lot.caskLotNumber}
                      </td>
                      <td className="p-4 space-y-0.5">
                        <strong className="text-stone-100 block text-xs">{lot.spiritName}</strong>
                        <span className="text-[11px] text-stone-500 block">{lot.barrelType}</span>
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <span>{lot.caskFillProof}° → </span>
                        <strong className="text-amber-300">{lot.currentProof}°</strong>
                      </td>
                      <td className="p-4">
                        <select
                          value={lot.agingStatus}
                          onChange={(e) => updateCaskStatus(lot.id, e.target.value as any)}
                          className="px-2 py-1 text-[11px] bg-stone-950 border border-stone-700 rounded-lg text-stone-200 focus:border-amber-500"
                        >
                          <option>Aging in Bond</option>
                          <option>Master Bottling Ready</option>
                          <option>Peak Maturity</option>
                          <option>Depleted</option>
                        </select>
                      </td>
                      <td className="p-4 text-[11px] text-stone-400 max-w-xs truncate">
                        {lot.warehouseLocation}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className="font-serif text-sm font-bold text-stone-100">
                          {lot.availableBottlesInBond}
                        </span>
                        <span className="text-[10px] text-stone-500 block">/ {lot.totalBottlesCapacity} btls</span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => updateInventoryStock(lot.id, lot.availableBottlesInBond - 1)}
                            disabled={lot.availableBottlesInBond <= 0}
                            className="w-7 h-7 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded-lg font-bold text-stone-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold font-mono">{lot.availableBottlesInBond}</span>
                          <button
                            onClick={() => updateInventoryStock(lot.id, lot.availableBottlesInBond + 1)}
                            className="w-7 h-7 bg-stone-800 hover:bg-stone-700 rounded-lg font-bold text-stone-200"
                          >
                            +
                          </button>
                          <button
                            onClick={() => updateInventoryStock(lot.id, lot.availableBottlesInBond + 12)}
                            className="px-2 py-1 bg-amber-950 text-amber-300 hover:bg-amber-900 rounded-lg text-[10px] font-bold ml-1 border border-amber-800"
                          >
                            +1 Case (12)
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SPIRITS CATALOG MANAGER (CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">
                Spirits Vault Catalog Management
              </h3>
              <p className="text-xs text-stone-400">
                Create new bottle allocations, update tasting notes, prices, or delete catalog entries.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Spirit Release</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between space-y-4 shadow-lg"
                >
                  <div className="flex gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-16 h-20 rounded-xl object-cover border border-stone-700 bg-stone-950"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        {p.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-stone-100 truncate">
                        {p.name}
                      </h4>
                      <p className="text-xs text-stone-400 font-mono">
                        {formatPrice(p.salePrice ?? p.price, adminSettings.currencySymbol)} • {p.abv}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        Stock: <strong className="text-stone-300">{p.stockQuantity} btls</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="flex items-center gap-1 text-stone-300 hover:text-amber-400"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                          deleteProduct(p.id);
                          showSaveSuccess(`Removed "${p.name}" from the catalog.`);
                        }
                      }}
                      className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ORDER FULFILLMENT CENTER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Customer Orders & Dispatch Center
            </h3>
            <p className="text-xs text-stone-400">
              Update warehouse fulfillment stages and assign courier tracking IDs.
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-amber-400">{ord.orderNumber}</span>
                      <span className="text-xs text-stone-400">by {ord.customerName} ({ord.customerEmail})</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Destination: {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.zipCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveInvoiceOrder(ord)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Invoice</span>
                    </button>
                    <span className="font-serif font-bold text-stone-100 text-base">
                      {formatPrice(ord.total, adminSettings.currencySymbol)}
                    </span>
                  </div>
                </div>

                {/* Fulfillment Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">Fulfillment Status</label>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-200 focus:border-amber-500 font-medium"
                    >
                      <option>Distillery Packing</option>
                      <option>Batch Sealed</option>
                      <option>Dispatched</option>
                      <option>Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">Tracking Number</label>
                    <input
                      type="text"
                      value={ord.trackingNumber}
                      onChange={(e) => updateOrderTracking(ord.id, e.target.value, ord.carrier)}
                      className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">Courier Service</label>
                    <input
                      type="text"
                      value={ord.carrier}
                      onChange={(e) => updateOrderTracking(ord.id, ord.trackingNumber, e.target.value)}
                      className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-200"
                    />
                  </div>
                </div>

                {/* Ordered Items Summary */}
                <div className="pt-2 text-xs text-stone-400">
                  <span className="font-bold text-stone-300">Bottles: </span>
                  {ord.items.map(it => `${it.product.name} (x${it.quantity})`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CMS HOME PAGE */}
      {activeTab === 'cms_home' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateHomeContent(cmsHomeState);
            showSaveSuccess('Home Page CMS content and carousel published live!');
          }}
          className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-8 text-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">Home Page Visual & Carousel CMS</h3>
              <p className="text-stone-400">Manage carousel slides (images, headings, subtitles, CTAs) and home content.</p>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>

          {/* 1. HERO CAROUSEL SLIDES MANAGER */}
          <div className="space-y-4 p-5 rounded-2xl bg-stone-950/80 border border-amber-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    Hero Showcase Carousel Slides
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                    {(cmsHomeState.carouselSlides || []).length} Slides Active
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Slides auto-rotate on the Home hero. You can customize the image, heading, subtitle, badge, and CTA for each.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddSlide}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Slide</span>
              </button>
            </div>

            {/* Slides Card List */}
            <div className="space-y-3 pt-1">
              {(cmsHomeState.carouselSlides || []).map((slide, index) => {
                const isFirst = index === 0;
                const isLast = index === (cmsHomeState.carouselSlides || []).length - 1;

                return (
                  <div
                    key={slide.id || index}
                    className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-700/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Sequence Badge */}
                    <div className="flex items-center gap-3.5 w-full md:w-auto">
                      <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-stone-950 border border-stone-700 shrink-0">
                        <img
                          src={slide.image}
                          alt={slide.heading}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-stone-950/90 text-amber-400 font-mono text-[9px] font-bold rounded border border-stone-800">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {slide.badge && (
                            <span className="px-2 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-700/40 rounded text-[9px] font-bold uppercase tracking-wider">
                              {slide.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-500 font-mono">
                            CTA: {slide.ctaText || 'Shop'} ({slide.ctaAction || 'shop'})
                          </span>
                        </div>

                        <h5 className="font-serif font-bold text-stone-100 text-sm truncate">
                          {slide.heading}
                        </h5>
                        <p className="text-[11px] text-stone-400 line-clamp-1">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right: Controls & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
                      {/* Sequence Shift Arrows */}
                      <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(index, 'up')}
                          disabled={isFirst}
                          title="Move Slide Up (Earlier)"
                          className="p-1 rounded text-stone-400 hover:text-amber-400 disabled:opacity-25 transition"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(index, 'down')}
                          disabled={isLast}
                          title="Move Slide Down (Later)"
                          className="p-1 rounded text-stone-400 hover:text-amber-400 disabled:opacity-25 transition"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditSlide(slide)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-semibold transition border border-stone-700 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        disabled={(cmsHomeState.carouselSlides || []).length <= 1}
                        title="Delete Slide"
                        className="p-1.5 bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-300 disabled:opacity-30 rounded-lg transition border border-stone-800 hover:border-rose-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. CHRONOLOGY & DISTILLATION HERITAGE CMS */}
          <div className="space-y-4 p-5 rounded-2xl bg-stone-950/80 border border-amber-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    Chronology & Distillation Heritage Timeline
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                    {(cmsHomeState.heritageChronology?.milestones || []).length} Milestones Active
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Manage chronological milestones, historic stills, cooperage eras, and awards shown on the Home page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pr-2 border-r border-stone-800">
                  <input
                    type="checkbox"
                    id="toggle-heritage"
                    checked={cmsHomeState.heritageChronology?.showSection ?? true}
                    onChange={(e) => {
                      const updatedHome = {
                        ...cmsHomeState,
                        heritageChronology: {
                          ...(cmsHomeState.heritageChronology || {
                            showSection: true,
                            sectionBadge: '⏳ Over A Century of Distilling Mastery',
                            sectionTitle: 'Chronology & Distillation Heritage',
                            sectionSubtitle: 'Traced through five generations of unhurried distillation...',
                            milestones: []
                          }),
                          showSection: e.target.checked
                        }
                      };
                      setCmsHomeState(updatedHome);
                      updateHomeContent(updatedHome);
                      showSaveSuccess(e.target.checked ? 'Chronology section enabled on Home page!' : 'Chronology section hidden.');
                    }}
                    className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="toggle-heritage" className="text-stone-300 text-xs font-semibold cursor-pointer">
                    Show Section
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddMilestone}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow transition cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>

            {/* Section Heading & Subtitle Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 pb-2 border-b border-stone-800/80">
              <div>
                <label className="block text-stone-400 mb-1 font-bold">Section Badge Text</label>
                <input
                  type="text"
                  value={cmsHomeState.heritageChronology?.sectionBadge || ''}
                  onChange={(e) => {
                    const updated = {
                      ...cmsHomeState,
                      heritageChronology: {
                        ...(cmsHomeState.heritageChronology || {
                          showSection: true,
                          sectionBadge: '',
                          sectionTitle: '',
                          sectionSubtitle: '',
                          milestones: []
                        }),
                        sectionBadge: e.target.value
                      }
                    };
                    setCmsHomeState(updated);
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100"
                  placeholder="e.g. ⏳ Over A Century of Distilling Mastery"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-bold">Section Main Title</label>
                <input
                  type="text"
                  value={cmsHomeState.heritageChronology?.sectionTitle || ''}
                  onChange={(e) => {
                    const updated紧 = {
                      ...cmsHomeState,
                      heritageChronology: {
                        ...(cmsHomeState.heritageChronology || {
                          showSection: true,
                          sectionBadge: '',
                          sectionTitle: '',
                          sectionSubtitle: '',
                          milestones: []
                        }),
                        sectionTitle: e.target.value
                      }
                    };
                    setCmsHomeState(updated紧);
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 font-serif font-bold"
                  placeholder="Chronology & Distillation Heritage"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-400 mb-1 font-bold">Section Subtitle / Narrative Overview</label>
                <textarea
                  rows={2}
                  value={cmsHomeState.heritageChronology?.sectionSubtitle || ''}
                  onChange={(e) => {
                    const updated = {
                      ...cmsHomeState,
                      heritageChronology: {
                        ...(cmsHomeState.heritageChronology || {
                          showSection: true,
                          sectionBadge: '',
                          sectionTitle: '',
                          sectionSubtitle: '',
                          milestones: []
                        }),
                        sectionSubtitle: e.target.value
                      }
                    };
                    setCmsHomeState(updated);
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100"
                  placeholder="Traced through five generations of unhurried distillation..."
                />
              </div>
            </div>

            {/* Milestones Card List */}
            <div className="space-y-3 pt-1">
              {(cmsHomeState.heritageChronology?.milestones || []).map((milestone, index) => {
                const isFirst = index === 0;
                const isLast = index === (cmsHomeState.heritageChronology?.milestones || []).length - 1;

                return (
                  <div
                    key={milestone.id || index}
                    className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-700/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail, Year & Info */}
                    <div className="flex items-center gap-3.5 w-full md:w-auto">
                      <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-stone-950 border border-stone-700 shrink-0">
                        <img
                          src={milestone.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80'}
                          alt={milestone.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-stone-950/90 text-amber-400 font-serif text-[10px] font-bold rounded border border-stone-800">
                          {milestone.year}
                        </span>
                      </div>

                      {/* Content Details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {milestone.tag && (
                            <span className="px-2 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-700/40 rounded text-[9px] font-bold uppercase tracking-wider">
                              {milestone.tag}
                            </span>
                          )}
                          {milestone.caskType && (
                            <span className="text-[10px] text-stone-400 truncate max-w-[180px]">
                              🪵 {milestone.caskType}
                            </span>
                          )}
                        </div>

                        <h5 className="font-serif font-bold text-stone-100 text-sm truncate">
                          {milestone.title}
                        </h5>
                        <p className="text-[11px] text-stone-400 line-clamp-1">
                          {milestone.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
                      {/* Sequence Shift */}
                      <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
                        <button
                          type="button"
                          onClick={() => handleMoveMilestone(index, 'up')}
                          disabled={isFirst}
                          title="Move Earlier in Chronology"
                          className="p-1 rounded text-stone-400 hover:text-amber-400 disabled:opacity-25 transition"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveMilestone(index, 'down')}
                          disabled={isLast}
                          title="Move Later in Chronology"
                          className="p-1 rounded text-stone-400 hover:text-amber-400 disabled:opacity-25 transition"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditMilestone(milestone)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-semibold transition border border-stone-700 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        disabled={(cmsHomeState.heritageChronology?.milestones || []).length <= 1}
                        title="Delete Milestone"
                        className="p-1.5 bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-300 disabled:opacity-30 rounded-lg transition border border-stone-800 hover:border-rose-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. THE ARTISANS & MASTER DISTILLERS SECTION CMS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    The Artisans: Master Distillers & Alchemists
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                    {(cmsAboutState.masterDistillers || []).length} Artisans Active
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Showcase master distillers, years of experience, signature spirits, and their craft stories on the Home page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pr-2 border-r border-stone-800">
                  <input
                    type="checkbox"
                    id="toggle-artisans"
                    checked={cmsHomeState.artisansSection?.showSection ?? true}
                    onChange={(e) => {
                      const updatedHome = {
                        ...cmsHomeState,
                        artisansSection: {
                          ...(cmsHomeState.artisansSection || {
                            showSection: true,
                            sectionBadge: '✨ The Craftsmen Behind Every Drop',
                            sectionTitle: 'The Artisans: Master Distillers & Alchemists',
                            sectionSubtitle: 'Over eight decades of collective distillation mastery across single malts, cask-strength bourbons, wild alpine botanicals, and ancestral earthen agaves.'
                          }),
                          showSection: e.target.checked
                        }
                      };
                      setCmsHomeState(updatedHome);
                      updateHomeContent(updatedHome);
                      showSaveSuccess(e.target.checked ? 'The Artisans section enabled on Home page!' : 'The Artisans section hidden.');
                    }}
                    className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="toggle-artisans" className="text-stone-300 text-xs font-semibold cursor-pointer">
                    Show on Home
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddDistiller}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow transition cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Artisan</span>
                </button>
              </div>
            </div>

            {/* Heading & Subtitle Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 pb-2 border-b border-stone-800/80">
              <div>
                <label className="block text-stone-400 mb-1 font-bold">Section Badge</label>
                <input
                  type="text"
                  value={cmsHomeState.artisansSection?.sectionBadge || ''}
                  onChange={(e) => {
                    const updated = {
                      ...cmsHomeState,
                      artisansSection: {
                        ...(cmsHomeState.artisansSection || {
                          showSection: true,
                          sectionBadge: '',
                          sectionTitle: '',
                          sectionSubtitle: ''
                        }),
                        sectionBadge: e.target.value
                      }
                    };
                    setCmsHomeState(updated);
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100"
                  placeholder="e.g. ✨ The Craftsmen Behind Every Drop"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-bold">Section Main Title</label>
                <input
                  type="text"
                  value={cmsHomeState.artisansSection?.sectionTitle || ''}
                  onChange={(e) => {
                    const updated = {
                      ...cmsHomeState,
                      artisansSection: {
                        ...(cmsHomeState.artisansSection || {
                          showSection: true,
                          sectionBadge: '',
                          sectionTitle: '',
                          sectionSubtitle: ''
                        }),
                        sectionTitle: e.target.value
                      }
                    };
                    setCmsHomeState(updated);
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 font-serif font-bold"
                  placeholder="The Artisans: Master Distillers & Alchemists"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-400 mb-1 font-bold">Section Subtitle / Narrative</label>
                <textarea
                  rows={2}
                  value={cmsHomeState.artisansSection?.sectionSubtitle || ''}
                  onChange={(e) => {
                    const updated = {
                      ...cmsHomeState,
                      artisansSection: {
                        ...(cmsHomeState.artisansSection || {
                          showSection: true,
                          sectionBadge: '',
                          sectionTitle: '',
                          sectionSubtitle: ''
                        }),
                        sectionSubtitle: e.target.value
                      }
                    };
                    setCmsHomeState(updated);
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100"
                  placeholder="Over eight decades of collective distillation artistry..."
                />
              </div>
            </div>

            {/* Artisans Roster List */}
            <div className="space-y-3 pt-1">
              {(cmsAboutState.masterDistillers || []).map((distiller, index) => {
                const isFirst = index === 0;
                const isLast = index === (cmsAboutState.masterDistillers || []).length - 1;

                return (
                  <div
                    key={distiller.id || index}
                    className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-700/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Avatar, Name & Bio */}
                    <div className="flex items-center gap-3.5 w-full md:w-auto">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-950 border border-amber-500/30 shrink-0">
                        <img
                          src={distiller.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt={distiller.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-serif font-bold text-stone-100 text-sm">
                            {distiller.name}
                          </h5>
                          <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">
                            {distiller.experienceYears} Yrs Mastery
                          </span>
                        </div>
                        <p className="text-xs text-amber-400/90 font-medium">
                          {distiller.role}
                        </p>
                        <p className="text-[11px] text-stone-400 line-clamp-1">
                          Signature: <span className="text-stone-300 font-serif">{distiller.signatureSpirit}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {/* Reorder Buttons */}
                      <div className="flex items-center bg-stone-950 rounded-lg border border-stone-800 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveDistiller(index, 'up')}
                          disabled={isFirst}
                          title="Move Earlier in Roster"
                          className="p-1 rounded text-stone-400 hover:text-amber-400 disabled:opacity-25 transition"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDistiller(index, 'down')}
                          disabled={isLast}
                          title="Move Later in Roster"
                          className="p-1 rounded text-stone-400 hover:text-amber-400 disabled:opacity-25 transition"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditDistiller(distiller)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-semibold transition border border-stone-700 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteDistiller(distiller.id)}
                        disabled={(cmsAboutState.masterDistillers || []).length <= 1}
                        title="Delete Artisan"
                        className="p-1.5 bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-300 disabled:opacity-30 rounded-lg transition border border-stone-800 hover:border-rose-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3.5 GUIDING PRINCIPLES (MISSION, VISION & CORE VALUES) CMS SECTION */}
          <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-6 shadow-xl">
            {/* Header & Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                    <span>Guiding Principles: Mission, Vision & Core Values</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                      Home CMS
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Manage the homepage brand ethos, sacred mission statement, century vision, and core value pillars.
                  </p>
                </div>
              </div>

              {/* Show/Hide Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-900 px-3.5 py-2 rounded-xl border border-stone-800">
                <input
                  type="checkbox"
                  id="toggle-guiding-principles"
                  checked={cmsHomeState.guidingPrinciples?.showSection !== false}
                  onChange={(e) => {
                    const currentConfig = cmsHomeState.guidingPrinciples || {
                      showSection: true,
                      sectionBadge: '🏛️ Foundational Creed & Distillation Ethics',
                      sectionTitle: 'Guiding Principles: Mission, Vision & Core Values',
                      sectionSubtitle: 'The unyielding standards and spiritual ethos that govern every drop distilled, barrel charred, and bottle hand-sealed at Zookas Unity Spirits.',
                      missionBadge: 'Our Sacred Calling',
                      missionTitle: 'The Mission',
                      missionStatement: 'To unite the world’s most revered distillation traditions through uncompromising artisanal craftsmanship...',
                      missionHighlightQuote: '“Every harvest, every mash bill, every single cask is bottled with pure integrity.”',
                      missionImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80',
                      visionBadge: 'Our Century Horizon',
                      visionTitle: 'The Vision',
                      visionStatement: 'To lead the global renaissance of independent craft distillation...',
                      visionHighlightQuote: '“We do not distill for quarterly yields; we distill for the century ahead.”',
                      visionImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80',
                      valuesTitle: 'Pillars of Distillation Craft',
                      valuesSubtitle: 'Six fundamental convictions that guide our masters from mountain spring to sealed crystal bottle.',
                      values: []
                    };
                    setCmsHomeState({
                      ...cmsHomeState,
                      guidingPrinciples: {
                        ...currentConfig,
                        showSection: e.target.checked
                      }
                    });
                  }}
                  className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="toggle-guiding-principles" className="text-xs font-semibold text-stone-300 cursor-pointer">
                  Display Section on Home Page
                </label>
              </div>
            </div>

            {/* Section Main Header Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Section Pill Badge
                </label>
                <input
                  type="text"
                  value={cmsHomeState.guidingPrinciples?.sectionBadge || ''}
                  onChange={(e) => {
                    const currentConfig = cmsHomeState.guidingPrinciples || {} as any;
                    setCmsHomeState({
                      ...cmsHomeState,
                      guidingPrinciples: {
                        ...currentConfig,
                        sectionBadge: e.target.value
                      }
                    });
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-xs"
                  placeholder="🏛️ Foundational Creed & Distillation Ethics"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={cmsHomeState.guidingPrinciples?.sectionTitle || ''}
                  onChange={(e) => {
                    const currentConfig = cmsHomeState.guidingPrinciples || {} as any;
                    setCmsHomeState({
                      ...cmsHomeState,
                      guidingPrinciples: {
                        ...currentConfig,
                        sectionTitle: e.target.value
                      }
                    });
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-xs font-bold"
                  placeholder="Guiding Principles: Mission, Vision & Core Values"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                  Section Subtitle / Narrative
                </label>
                <input
                  type="text"
                  value={cmsHomeState.guidingPrinciples?.sectionSubtitle || ''}
                  onChange={(e) => {
                    const currentConfig = cmsHomeState.guidingPrinciples || {} as any;
                    setCmsHomeState({
                      ...cmsHomeState,
                      guidingPrinciples: {
                        ...currentConfig,
                        sectionSubtitle: e.target.value
                      }
                    });
                  }}
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-xs"
                  placeholder="The unyielding standards and spiritual ethos that govern..."
                />
              </div>
            </div>

            {/* DUAL EDITORS: MISSION & VISION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. MISSION CMS CARD */}
              <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif text-sm font-bold text-stone-200">1. The Mission</h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80 uppercase">Sacred Calling</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 mb-1">Mission Badge</label>
                    <input
                      type="text"
                      value={cmsHomeState.guidingPrinciples?.missionBadge || ''}
                      onChange={(e) => {
                        const current = cmsHomeState.guidingPrinciples || {} as any;
                        setCmsHomeState({
                          ...cmsHomeState,
                          guidingPrinciples: { ...current, missionBadge: e.target.value }
                        });
                      }}
                      className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                      placeholder="Our Sacred Calling"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 mb-1">Mission Heading</label>
                    <input
                      type="text"
                      value={cmsHomeState.guidingPrinciples?.missionTitle || ''}
                      onChange={(e) => {
                        const current = cmsHomeState.guidingPrinciples || {} as any;
                        setCmsHomeState({
                          ...cmsHomeState,
                          guidingPrinciples: { ...current, missionTitle: e.target.value }
                        });
                      }}
                      className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 font-bold"
                      placeholder="The Mission"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Mission Statement (Core Narrative)</label>
                  <textarea
                    rows={3}
                    value={cmsHomeState.guidingPrinciples?.missionStatement || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, missionStatement: e.target.value }
                      });
                    }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 leading-relaxed"
                    placeholder="To unite the world’s most revered distillation traditions..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Highlight Quote</label>
                  <input
                    type="text"
                    value={cmsHomeState.guidingPrinciples?.missionHighlightQuote || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, missionHighlightQuote: e.target.value }
                      });
                    }}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-amber-200/90 italic"
                    placeholder="“Every harvest, every mash bill, every single cask...”"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Mission Thumbnail URL</label>
                  <input
                    type="text"
                    value={cmsHomeState.guidingPrinciples?.missionImage || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, missionImage: e.target.value }
                      });
                    }}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-stone-500 self-center">Presets:</span>
                    {missionImagePresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          const current = cmsHomeState.guidingPrinciples || {} as any;
                          setCmsHomeState({
                            ...cmsHomeState,
                            guidingPrinciples: { ...current, missionImage: preset.url }
                          });
                        }}
                        className="px-2 py-0.5 bg-stone-950 hover:bg-stone-800 text-[10px] text-stone-400 hover:text-amber-300 rounded border border-stone-800 transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. VISION CMS CARD */}
              <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <h4 className="font-serif text-sm font-bold text-stone-200">2. The Vision</h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80 uppercase">Century Horizon</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 mb-1">Vision Badge</label>
                    <input
                      type="text"
                      value={cmsHomeState.guidingPrinciples?.visionBadge || ''}
                      onChange={(e) => {
                        const current = cmsHomeState.guidingPrinciples || {} as any;
                        setCmsHomeState({
                          ...cmsHomeState,
                          guidingPrinciples: { ...current, visionBadge: e.target.value }
                        });
                      }}
                      className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                      placeholder="Our Century Horizon"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 mb-1">Vision Heading</label>
                    <input
                      type="text"
                      value={cmsHomeState.guidingPrinciples?.visionTitle || ''}
                      onChange={(e) => {
                        const current = cmsHomeState.guidingPrinciples || {} as any;
                        setCmsHomeState({
                          ...cmsHomeState,
                          guidingPrinciples: { ...current, visionTitle: e.target.value }
                        });
                      }}
                      className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 font-bold"
                      placeholder="The Vision"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Vision Statement (Core Narrative)</label>
                  <textarea
                    rows={3}
                    value={cmsHomeState.guidingPrinciples?.visionStatement || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, visionStatement: e.target.value }
                      });
                    }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 leading-relaxed"
                    placeholder="To lead the global renaissance of independent craft distillation..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Highlight Quote</label>
                  <input
                    type="text"
                    value={cmsHomeState.guidingPrinciples?.visionHighlightQuote || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, visionHighlightQuote: e.target.value }
                      });
                    }}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-amber-200/90 italic"
                    placeholder="“We do not distill for quarterly yields; we distill for the century ahead.”"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Vision Thumbnail URL</label>
                  <input
                    type="text"
                    value={cmsHomeState.guidingPrinciples?.visionImage || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, visionImage: e.target.value }
                      });
                    }}
                    className="w-full p-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 font-mono"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-stone-500 self-center">Presets:</span>
                    {visionImagePresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          const current = cmsHomeState.guidingPrinciples || {} as any;
                          setCmsHomeState({
                            ...cmsHomeState,
                            guidingPrinciples: { ...current, visionImage: preset.url }
                          });
                        }}
                        className="px-2 py-0.5 bg-stone-950 hover:bg-stone-800 text-[10px] text-stone-400 hover:text-amber-300 rounded border border-stone-800 transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CORE VALUES MANAGER */}
            <div className="space-y-4 pt-4 border-t border-stone-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>3. Core Value Pillars ({cmsHomeState.guidingPrinciples?.values?.length || 0})</span>
                  </h4>
                  <p className="text-xs text-stone-400">
                    Reorder, edit, or introduce new distillation ethics and craftsmanship standards.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddValue}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/10 transition cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Core Value</span>
                </button>
              </div>

              {/* Values Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Values Section Heading</label>
                  <input
                    type="text"
                    value={cmsHomeState.guidingPrinciples?.valuesTitle || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, valuesTitle: e.target.value }
                      });
                    }}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 font-bold"
                    placeholder="Pillars of Distillation Craft"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">Values Section Subtitle</label>
                  <input
                    type="text"
                    value={cmsHomeState.guidingPrinciples?.valuesSubtitle || ''}
                    onChange={(e) => {
                      const current = cmsHomeState.guidingPrinciples || {} as any;
                      setCmsHomeState({
                        ...cmsHomeState,
                        guidingPrinciples: { ...current, valuesSubtitle: e.target.value }
                      });
                    }}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300"
                    placeholder="Six fundamental convictions that guide our masters..."
                  />
                </div>
              </div>

              {/* Core Values List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {(cmsHomeState.guidingPrinciples?.values || []).map((val, index) => {
                  const isFirst = index === 0;
                  const isLast = index === (cmsHomeState.guidingPrinciples?.values || []).length - 1;

                  return (
                    <div
                      key={val.id || index}
                      className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            {renderPrincipleIcon(val.icon, "w-4 h-4")}
                          </div>
                          {val.tag && (
                            <span className="px-2 py-0.5 bg-stone-950 text-amber-300 border border-amber-500/20 rounded-full text-[9px] font-bold uppercase">
                              {val.tag}
                            </span>
                          )}
                        </div>

                        <h5 className="font-serif text-sm font-bold text-stone-100">{val.title}</h5>
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{val.description}</p>
                      </div>

                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                        {/* Reorder Buttons */}
                        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
                          <button
                            type="button"
                            onClick={() => handleMoveValue(index, 'up')}
                            disabled={isFirst}
                            title="Move Earlier"
                            className="p-1 text-stone-400 hover:text-amber-400 disabled:opacity-20 transition"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveValue(index, 'down')}
                            disabled={isLast}
                            title="Move Later"
                            className="p-1 text-stone-400 hover:text-amber-400 disabled:opacity-20 transition"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditValue(val)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold border border-stone-700 transition"
                          >
                            <Edit3 className="w-3 h-3 text-amber-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteValue(val.id)}
                            disabled={(cmsHomeState.guidingPrinciples?.values || []).length <= 1}
                            title="Delete Core Value"
                            className="p-1.5 bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-300 disabled:opacity-25 rounded-lg border border-stone-800 hover:border-rose-800 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. GLOBAL ANNOUNCEMENT BAR */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-300">Top Header Announcement Bar</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="toggle-announcement"
                  checked={cmsHomeState.showAnnouncement}
                  onChange={(e) => setCmsHomeState({ ...cmsHomeState, showAnnouncement: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="toggle-announcement" className="text-stone-400 cursor-pointer">
                  Show Announcement Bar
                </label>
              </div>
            </div>
            <input
              type="text"
              value={cmsHomeState.announcementText}
              onChange={(e) => setCmsHomeState({ ...cmsHomeState, announcementText: e.target.value })}
              className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg text-stone-100"
              placeholder="e.g. Complimentary insured shipping on orders $150+..."
            />
          </div>

          {/* 4. MASTER DISTILLER QUOTE & PHILOSOPHY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Master Distiller Philosophy Quote</label>
              <textarea
                rows={3}
                value={cmsHomeState.distillerQuote}
                onChange={(e) => setCmsHomeState({ ...cmsHomeState, distillerQuote: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 italic"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Quote Author & Credentials</label>
              <input
                type="text"
                value={cmsHomeState.distillerQuoteAuthor}
                onChange={(e) => setCmsHomeState({ ...cmsHomeState, distillerQuoteAuthor: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
          </div>
        </form>
      )}

      {/* 6. CMS ABOUT PAGE */}
      {activeTab === 'cms_about' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateAboutContent(cmsAboutState);
            showSaveSuccess('About Page CMS content updated and published live!');
          }}
          className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-6 text-xs"
        >
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">About Page & Heritage Story Editor</h3>
              <p className="text-stone-400">Customize distillery background, addresses, and hours.</p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Heritage Title</label>
              <input
                type="text"
                value={cmsAboutState.heritageTitle}
                onChange={(e) => setCmsAboutState({ ...cmsAboutState, heritageTitle: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Heritage Subtitle</label>
              <input
                type="text"
                value={cmsAboutState.heritageSubtitle}
                onChange={(e) => setCmsAboutState({ ...cmsAboutState, heritageSubtitle: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-bold">Story Paragraph 1 (Heritage & Origins)</label>
            <textarea
              rows={3}
              value={cmsAboutState.storyParagraph1}
              onChange={(e) => setCmsAboutState({ ...cmsAboutState, storyParagraph1: e.target.value })}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
            />
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-bold">Story Paragraph 2 (Speyside Copper Stills)</label>
            <textarea
              rows={3}
              value={cmsAboutState.storyParagraph2}
              onChange={(e) => setCmsAboutState({ ...cmsAboutState, storyParagraph2: e.target.value })}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
            />
          </div>

          <div>
            <label className="block text-stone-400 mb-1 font-bold">Story Paragraph 3 (Oak Cask Alchemy)</label>
            <textarea
              rows={3}
              value={cmsAboutState.storyParagraph3}
              onChange={(e) => setCmsAboutState({ ...cmsAboutState, storyParagraph3: e.target.value })}
              className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
            />
          </div>

          {/* Master Distillers & Artisans Roster in About CMS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    Master Distillers & Artisans Roster
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold">
                    {(cmsAboutState.masterDistillers || []).length} Distillers
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Manage artisan biographies, portraits, and signature spirits featured on both About and Home pages.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddDistiller}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Master Distiller</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {(cmsAboutState.masterDistillers || []).map((distiller, index) => {
                const isFirst = index === 0;
                const isLast = index === (cmsAboutState.masterDistillers || []).length - 1;

                return (
                  <div
                    key={distiller.id || index}
                    className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-950 border border-amber-500/30 shrink-0">
                        <img
                          src={distiller.image}
                          alt={distiller.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif font-bold text-stone-100 text-xs truncate">
                            {distiller.name}
                          </h5>
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20 font-bold shrink-0">
                            {distiller.experienceYears}y
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-400 truncate">{distiller.role}</p>
                        <p className="text-[10px] text-stone-400 line-clamp-1">{distiller.signatureSpirit}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditDistiller(distiller)}
                        className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[10px] font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDistiller(distiller.id)}
                        disabled={(cmsAboutState.masterDistillers || []).length <= 1}
                        className="px-2.5 py-1 bg-stone-950 hover:bg-rose-950 text-stone-400 hover:text-rose-300 disabled:opacity-30 rounded text-[10px] transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Distillery Address</label>
              <input
                type="text"
                value={cmsAboutState.distilleryAddress}
                onChange={(e) => setCmsAboutState({ ...cmsAboutState, distilleryAddress: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Visiting / Tasting Hours</label>
              <input
                type="text"
                value={cmsAboutState.distilleryHours}
                onChange={(e) => setCmsAboutState({ ...cmsAboutState, distilleryHours: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Direct Phone Line</label>
              <input
                type="text"
                value={cmsAboutState.distilleryPhone}
                onChange={(e) => setCmsAboutState({ ...cmsAboutState, distilleryPhone: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
          </div>
        </form>
      )}

      {/* 7. CMS SETTINGS & STORE FINANCIALS */}
      {activeTab === 'cms_settings' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateAdminSettings(cmsSettingsState);
            showSaveSuccess('Store financial rates and global settings saved!');
          }}
          className="p-6 sm:p-8 rounded-2xl bg-stone-900 border border-stone-800 space-y-6 text-xs"
        >
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">Store Financials & Global Parameters</h3>
              <p className="text-stone-400">Configure tax rates, shipping rates, and store logistics.</p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Global Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Brand Name</label>
              <input
                type="text"
                value={cmsSettingsState.brandName}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, brandName: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Brand Tagline</label>
              <input
                type="text"
                value={cmsSettingsState.brandTagline}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, brandTagline: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Currency Symbol</label>
              <select
                value={cmsSettingsState.currencySymbol || '₹'}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, currencySymbol: e.target.value })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              >
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="$">$ (USD / CAD / AUD)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="¥">¥ (JPY - Japanese Yen)</option>
                <option value="A$">A$ (Australian Dollar)</option>
                <option value="CA$">CA$ (Canadian Dollar)</option>
                <option value="CHF">CHF (Swiss Franc)</option>
                <option value="AED">AED (UAE Dirham)</option>
                <option value="SGD">SGD (Singapore Dollar)</option>
              </select>
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Spirits Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={cmsSettingsState.taxRatePercent}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, taxRatePercent: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Insured Courier Fee ({cmsSettingsState.currencySymbol || '₹'})</label>
              <input
                type="number"
                value={cmsSettingsState.shippingFee}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, shippingFee: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 font-bold">Free Shipping Threshold ({cmsSettingsState.currencySymbol || '₹'})</label>
              <input
                type="number"
                value={cmsSettingsState.freeShippingThreshold}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
          </div>

          {/* Admin CMS Security & Vault Credentials Section */}
          <div className="p-5 sm:p-6 bg-stone-950 rounded-2xl border border-amber-500/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    Admin CMS Vault Security & Access Credentials
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-[10px] font-bold">
                    Firestore Cloud Encrypted
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Protect the Admin CMS and distillery bond inventory with custom Master Password and Quick Security PIN.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLockVault}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Test Lock Vault</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Master Password Field */}
              <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Master Administrator Password</span>
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">Min 6 characters</span>
                </div>

                <div className="relative">
                  <input
                    type={showSettingsPassword ? 'text' : 'password'}
                    value={cmsSettingsState.adminPassword || 'zookas2026'}
                    onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, adminPassword: e.target.value })}
                    placeholder="Enter new master password"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSettingsPassword(!showSettingsPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                  >
                    {showSettingsPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-400">
                  Used for primary master login to the distillery console.
                </p>
              </div>

              {/* Security PIN Field */}
              <div className="p-4 bg-stone-900/90 border border-stone-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Unlock Security PIN</span>
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">4 to 6 Digits</span>
                </div>

                <div className="relative">
                  <input
                    type={showSettingsPin ? 'text' : 'password'}
                    maxLength={6}
                    value={cmsSettingsState.adminPin || '8821'}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setCmsSettingsState({ ...cmsSettingsState, adminPin: val });
                    }}
                    placeholder="e.g. 8821"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono text-xs focus:border-amber-500 focus:outline-none tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSettingsPin(!showSettingsPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
                  >
                    {showSettingsPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-400">
                  Enables rapid numpad keypad unlocking on touch & mobile screens.
                </p>
              </div>
            </div>

            {/* Authentication Policy & Inactivity Lockout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-stone-900/50 border border-stone-800/80 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cmsSettingsState.requireBothPasswordAndPin || false}
                    onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, requireBothPasswordAndPin: e.target.checked })}
                    className="w-4 h-4 mt-0.5 text-amber-500 rounded bg-stone-950 border-stone-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-stone-200 block text-xs">
                      Enforce Dual Verification (Password + PIN)
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      Requires entering the Master Password followed by the PIN on every login.
                    </span>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-stone-900/50 border border-stone-800/80 rounded-xl space-y-1.5">
                <label className="block text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Session Security & Inactivity Timeout</span>
                </label>
                <select
                  value={cmsSettingsState.sessionTimeoutMinutes || 30}
                  onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, sessionTimeoutMinutes: Number(e.target.value) })}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 text-xs focus:border-amber-500 focus:outline-none"
                >
                  <option value={15}>Auto-lock after 15 minutes of inactivity</option>
                  <option value={30}>Auto-lock after 30 minutes of inactivity (Recommended)</option>
                  <option value={60}>Auto-lock after 60 minutes</option>
                  <option value={120}>Auto-lock after 2 hours</option>
                  <option value={0}>Disabled (Keep session active until explicit lock)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Announcement Bar */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cmsSettingsState.showAnnouncementBar}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, showAnnouncementBar: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span className="font-bold text-stone-200">Enable Global Announcement Banner on Header</span>
            </label>
            <div>
              <label className="block text-stone-400 mb-1">Banner Announcement Text</label>
              <input
                type="text"
                value={cmsSettingsState.announcementText}
                onChange={(e) => setCmsSettingsState({ ...cmsSettingsState, announcementText: e.target.value })}
                className="w-full p-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100"
              />
            </div>
          </div>
        </form>
      )}

      {/* RARE ALLOCATIONS & BALLOT DRAWS */}
      {activeTab === 'ballots' && <BallotDrawsAdmin />}

      {/* MEDIA DRIVE & CLOUD ASSET MANAGEMENT */}
      {activeTab === 'drive' && <MediaDriveAdmin />}

      {/* LETTERHEAD & OFFICIAL STATIONERY CMS */}
      {activeTab === 'cms_letterheads' && <LetterheadManager />}

      {/* HEADER & NAVIGATION CMS */}
      {activeTab === 'cms_header' && <HeaderCustomizer />}

      {/* FOOTER & NEWSLETTER CMS */}
      {activeTab === 'cms_footer' && <FooterCustomizer />}

      {/* BOTTOM NAVIGATION BAR CMS */}
      {activeTab === 'cms_bottom_nav' && <BottomNavCustomizer />}

      {/* 8. BLOG MANAGER */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">
                Tasting Journal & Mixology Articles
              </h3>
              <p className="text-xs text-stone-400">
                Publish articles on distillation craft, wood chemistry, and cocktail pairings.
              </p>
            </div>
            <button
              onClick={() => setBlogModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase">
                    <span>{post.category}</span>
                    <span className="text-stone-500">{post.publishedDate}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-100 mt-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs">
                  <span className="text-stone-500">{post.comments.length} Comments</span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete article "${post.title}"?`)) {
                        deleteBlogPost(post.id);
                        showSaveSuccess(`Deleted article "${post.title}".`);
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Spirit Product */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-100">
                {editingProductId ? 'Edit Spirit Release' : 'Add New Spirit to Vault'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Spirit Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as SpiritCategory })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  >
                    <option>Single Malt Whisky</option>
                    <option>Cask Strength Bourbon</option>
                    <option>Botanical Gin</option>
                    <option>Artisanal Rum</option>
                    <option>Artisanal Mezcal</option>
                    <option>Unity Reserve Vodka</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Sale Price ($)</label>
                  <input
                    type="number"
                    value={productForm.salePrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">ABV (e.g. 48.5%)</label>
                  <input
                    type="text"
                    value={productForm.abv}
                    onChange={(e) => setProductForm({ ...productForm, abv: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Proof (e.g. 97)</label>
                  <input
                    type="number"
                    value={productForm.proof}
                    onChange={(e) => setProductForm({ ...productForm, proof: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Cask Lot Identifier</label>
                  <input
                    type="text"
                    value={productForm.caskNumber}
                    onChange={(e) => setProductForm({ ...productForm, caskNumber: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Full Tasting Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                />
              </div>

              <CloudImageUploader
                label="Primary Bottle Image (Google Cloud Storage)"
                currentImageUrl={productForm.images?.[0] || ''}
                onImageUploaded={(url) => setProductForm({ ...productForm, images: [url] })}
                folder="products"
                presetOptions={[
                  { label: 'Single Malt Bottle', url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=80' },
                  { label: 'Whisky Glass & Bottle', url: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=900&q=80' },
                  { label: 'Botanical Gin Glass', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80' },
                  { label: 'Amber Cask Pour', url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80' }
                ]}
                helperText="Upload custom spirit photos directly to Google Cloud Storage or choose from presets."
              />

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isLimitedRelease}
                    onChange={(e) => setProductForm({ ...productForm, isLimitedRelease: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Limited Release Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Featured on Home Page</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl shadow cursor-pointer"
                >
                  Save Spirit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Cask Lot */}
      {caskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-100">Register Distiller Cask Lot</h3>
              <button onClick={() => setCaskModalOpen(false)} className="text-stone-400">✕</button>
            </div>

            <form onSubmit={handleSaveCaskLot} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Cask Lot #</label>
                  <input
                    type="text"
                    required
                    value={caskForm.caskLotNumber}
                    onChange={(e) => setCaskForm({ ...caskForm, caskLotNumber: e.target.value })}
                    className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Spirit Name</label>
                  <input
                    type="text"
                    required
                    value={caskForm.spiritName}
                    onChange={(e) => setCaskForm({ ...caskForm, spiritName: e.target.value })}
                    className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Barrel Finish Type</label>
                <input
                  type="text"
                  value={caskForm.barrelType}
                  onChange={(e) => setCaskForm({ ...caskForm, barrelType: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Total Bottle Capacity</label>
                  <input
                    type="number"
                    value={caskForm.totalBottlesCapacity}
                    onChange={(e) => setCaskForm({ ...caskForm, totalBottlesCapacity: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Available Bottles in Bond</label>
                  <input
                    type="number"
                    value={caskForm.availableBottlesInBond}
                    onChange={(e) => setCaskForm({ ...caskForm, availableBottlesInBond: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Warehouse Vault Location</label>
                <input
                  type="text"
                  value={caskForm.warehouseLocation}
                  onChange={(e) => setCaskForm({ ...caskForm, warehouseLocation: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCaskModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-stone-950 font-bold rounded-lg cursor-pointer"
                >
                  Register Cask
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Blog Post */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-stone-100">Create Tasting Article</h3>
              <button onClick={() => setBlogModalOpen(false)} className="text-stone-400">✕</button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  >
                    <option>Distillation Science</option>
                    <option>Craft Cocktail & Mixology</option>
                    <option>Mixology & Pairing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Read Time (minutes)</label>
                  <input
                    type="number"
                    value={blogForm.readTimeMinutes}
                    onChange={(e) => setBlogForm({ ...blogForm, readTimeMinutes: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Full Article Content</label>
                <textarea
                  rows={5}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100"
                />
              </div>
              <div>
                <label className="block text-stone-400 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={blogForm.coverImage}
                  onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                  className="w-full p-2 bg-stone-950 border border-stone-700 rounded-lg text-stone-100 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-stone-950 font-bold rounded-lg cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Carousel Slide */}
      {slideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  {editingSlideId ? 'Edit Hero Carousel Slide' : 'Add New Hero Carousel Slide'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setSlideModalOpen(false)} 
                className="text-stone-400 hover:text-white p-1 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              {/* Slide Heading */}
              <div>
                <label className="block text-stone-300 mb-1 font-bold">
                  Slide Main Heading <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slideForm.heading}
                  onChange={(e) => setSlideForm({ ...slideForm, heading: e.target.value })}
                  placeholder="e.g. Pure Artisanal Craft. Bottled with Uncompromising Passion."
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 font-serif text-sm font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Slide Subtitle */}
              <div>
                <label className="block text-stone-300 mb-1 font-bold">
                  Slide Subtitle / Description <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  placeholder="e.g. Small-batch single malt whiskies, cask-strength bourbons, and wild botanical gins..."
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Background Image URL & Cloud Upload */}
              <CloudImageUploader
                label="Slide Background Photo (Google Cloud Storage)"
                currentImageUrl={slideForm.image}
                onImageUploaded={(url) => setSlideForm({ ...slideForm, image: url })}
                folder="carousel"
                presetOptions={distilleryImagePresets}
                helperText="Upload wide background visuals to Google Cloud Storage or select distillery presets."
              />

              {/* Badge & CTA settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">Badge Text</label>
                  <input
                    type="text"
                    value={slideForm.badge || ''}
                    onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                    placeholder="e.g. ⭐ Double Gold 2025"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">Button CTA Label</label>
                  <input
                    type="text"
                    value={slideForm.ctaText || ''}
                    onChange={(e) => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                    placeholder="e.g. Explore Spirits Vault"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">Button Destination</label>
                  <select
                    value={slideForm.ctaAction || 'shop'}
                    onChange={(e) => setSlideForm({ ...slideForm, ctaAction: e.target.value as any })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100"
                  >
                    <option value="shop">Spirits Vault / Shop</option>
                    <option value="about">Copper Pot Heritage / About</option>
                    <option value="blog">Distiller Journal / Blog</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-400 block mb-1.5 font-bold uppercase tracking-wider">
                  Live Slide Preview:
                </span>
                <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-stone-950 border border-stone-700 flex items-center justify-center text-center p-4">
                  <img
                    src={slideForm.image}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
                  />
                  <div className="relative z-10 space-y-1.5 max-w-md">
                    {slideForm.badge && (
                      <span className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        {slideForm.badge}
                      </span>
                    )}
                    <h4 className="font-serif font-bold text-stone-100 text-sm line-clamp-1">
                      {slideForm.heading || 'Your Slide Headline'}
                    </h4>
                    <p className="text-[10px] text-stone-300 line-clamp-2">
                      {slideForm.subtitle || 'Your slide subtitle will appear here in clear, readable contrast.'}
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase tracking-wider rounded-lg shadow">
                        {slideForm.ctaText || 'Explore Spirits Vault'}
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSlideId ? 'Save Slide Changes' : 'Add Slide to Carousel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Heritage Milestone */}
      {milestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  {editingMilestoneId ? 'Edit Heritage Milestone' : 'Add New Heritage Milestone'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setMilestoneModalOpen(false)} 
                className="text-stone-400 hover:text-white p-1 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4 text-xs">
              {/* Year & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">
                    Chronological Year / Period <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={milestoneForm.year}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                    placeholder="e.g. 1884 or 1920-1933"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-amber-400 font-serif text-base font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">
                    Era Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.tag || ''}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, tag: e.target.value })}
                    placeholder="e.g. Founding Era, Cask Innovation, Double Gold"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block text-stone-300 mb-1 font-bold">
                  Milestone Main Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  placeholder="e.g. The Hand-Hammered Scottish Copper Pot Stills"
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 font-serif text-sm font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-bold">
                  Subtitle / Historic Subject
                </label>
                <input
                  type="text"
                  value={milestoneForm.subtitle}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, subtitle: e.target.value })}
                  placeholder="e.g. Aberdeenshire Craftsmanship & Fire-Direct Distillation"
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Narrative Description */}
              <div>
                <label className="block text-stone-300 mb-1 font-bold">
                  Detailed Historical Narrative <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  placeholder="Describe the craft innovation, barrel aging discovery, or distillery breakthrough..."
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:border-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Image URL & Cloud Storage Upload */}
              <CloudImageUploader
                label="Historical Image (Google Cloud Storage)"
                currentImageUrl={milestoneForm.image}
                onImageUploaded={(url) => setMilestoneForm({ ...milestoneForm, image: url })}
                folder="heritage"
                presetOptions={heritageImagePresets}
                helperText="Upload archival distillery photo to Google Cloud Storage or select presets."
              />

              {/* Cooperage Cask & Key Spec */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">Cask / Wood Spec</label>
                  <input
                    type="text"
                    value={milestoneForm.caskType || ''}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, caskType: e.target.value })}
                    placeholder="e.g. Charred American Oak"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">Key Stat Label</label>
                  <input
                    type="text"
                    value={milestoneForm.statLabel || ''}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, statLabel: e.target.value })}
                    placeholder="e.g. Copper Still Capacity"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">Key Stat Value</label>
                  <input
                    type="text"
                    value={milestoneForm.statValue || ''}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, statValue: e.target.value })}
                    placeholder="e.g. 4,500L Custom Swan Neck"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-amber-400 font-semibold"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-400 block mb-1.5 font-bold uppercase tracking-wider">
                  Live Milestone Preview:
                </span>
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-start gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-900 border border-amber-500/30 shrink-0">
                    <img
                      src={milestoneForm.image || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80'}
                      alt="Milestone preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-serif font-bold text-sm">
                        {milestoneForm.year || '1884'}
                      </span>
                      {milestoneForm.tag && (
                        <span className="px-2 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-700/40 rounded text-[9px] font-bold uppercase">
                          {milestoneForm.tag}
                        </span>
                      )}
                    </div>
                    <h5 className="font-serif font-bold text-stone-100 text-xs">
                      {milestoneForm.title || 'Milestone Title'}
                    </h5>
                    <p className="text-[10px] text-stone-400 line-clamp-2">
                      {milestoneForm.description || 'Milestone historical description...'}
                    </p>
                    {milestoneForm.caskType && (
                      <span className="text-[9px] text-amber-500/80 block">
                        🪵 {milestoneForm.caskType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setMilestoneModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMilestoneId ? 'Save Milestone Changes' : 'Add Milestone to Heritage'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Master Distiller / Artisan */}
      {distillerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  {editingDistillerId ? 'Edit Artisan Profile' : 'Add New Master Distiller'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDistillerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-950 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDistiller} className="space-y-4 text-xs">
              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">
                    Master Distiller Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={distillerForm.name}
                    onChange={(e) => setDistillerForm({ ...distillerForm, name: e.target.value })}
                    placeholder="e.g. Alistair Vance"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 font-serif font-bold text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-bold">
                    Distillery Role / Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={distillerForm.role}
                    onChange={(e) => setDistillerForm({ ...distillerForm, role: e.target.value })}
                    placeholder="e.g. Master Distiller & Cask Curator"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Experience Years & Signature Spirit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">
                    Years of Master Craft Experience <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={70}
                    required
                    value={distillerForm.experienceYears}
                    onChange={(e) => setDistillerForm({ ...distillerForm, experienceYears: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 text-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-bold">
                    Signature Spirit Expression <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={distillerForm.signatureSpirit}
                    onChange={(e) => setDistillerForm({ ...distillerForm, signatureSpirit: e.target.value })}
                    placeholder="e.g. 18-Year Single Malt & 25-Year Peated Reserve"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Distiller Craft Biography */}
              <div>
                <label className="block text-stone-300 mb-1 font-bold">
                  Distiller Biography & Alchemy Focus <span className="text-amber-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={distillerForm.bio}
                  onChange={(e) => setDistillerForm({ ...distillerForm, bio: e.target.value })}
                  placeholder="Describe decades of experience, mash bill approach, still craft, or barrel maturation..."
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:border-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Portrait Image URL & Cloud Upload */}
              <CloudImageUploader
                label="Portrait Photo (Google Cloud Storage)"
                currentImageUrl={distillerForm.image}
                onImageUploaded={(url) => setDistillerForm({ ...distillerForm, image: url })}
                folder="heritage"
                presetOptions={distillerImagePresets}
                helperText="Upload artisan portrait directly to Google Cloud Storage or select presets."
              />

              {/* Live Preview Box */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-400 block mb-1.5 font-bold uppercase tracking-wider">
                  Live Artisan Card Preview:
                </span>
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-900 border border-amber-500/40 shrink-0">
                    <img
                      src={distillerForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="Distiller preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-serif font-bold text-stone-100 text-sm">
                        {distillerForm.name || 'Master Distiller Name'}
                      </h5>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-bold">
                        {distillerForm.experienceYears || 20} Yrs Mastery
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                      {distillerForm.role || 'Craft Specialist'}
                    </span>
                    <p className="text-[10px] text-stone-400 line-clamp-2">
                      {distillerForm.bio || 'Craft biography and alchemy overview...'}
                    </p>
                    <span className="text-[10px] text-amber-300/80 font-serif block">
                      Signature: {distillerForm.signatureSpirit || 'Flagship Expression'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setDistillerModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingDistillerId ? 'Save Artisan Changes' : 'Add Artisan to Roster'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CORE VALUE MODAL (ADD / EDIT) */}
      {valueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-stone-900 border border-stone-700 rounded-2xl p-6 sm:p-7 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-100">
                    {editingValueId ? 'Edit Core Value Pillar' : 'Add New Core Value Pillar'}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Configure the distillation ethic, standard title, icon, tag, and narrative description.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValueModalOpen(false)}
                className="text-stone-400 hover:text-white text-sm p-1 rounded-lg hover:bg-stone-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveValue} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Value Pillar Title <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={valueForm.title}
                    onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                    placeholder="e.g. Uncompromising Purity & Alchemy"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-stone-300 font-bold mb-1">
                    Pill Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={valueForm.tag || ''}
                    onChange={(e) => setValueForm({ ...valueForm, tag: e.target.value })}
                    placeholder="e.g. 100% Pure Distillate"
                    className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-stone-300 font-bold mb-1.5">
                  Select Visual Icon:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-2 bg-stone-950 rounded-xl border border-stone-800">
                  {availableValueIcons.map((ic) => {
                    const isSelected = valueForm.icon.toLowerCase() === ic.name.toLowerCase();
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() => setValueForm({ ...valueForm, icon: ic.name })}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition border ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-amber-300 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="mb-1">
                          {renderPrincipleIcon(ic.name, "w-4 h-4")}
                        </div>
                        <span className="text-[9px] leading-tight truncate w-full">
                          {ic.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Value Narrative & Standard Statement <span className="text-amber-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={valueForm.description}
                  onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })}
                  placeholder="Detail the exact craftsmanship mandate, aging technique, terroir pledge, or fellowship commitment..."
                  className="w-full p-2.5 bg-stone-950 border border-stone-700 rounded-xl text-stone-200 focus:border-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Live Preview Box */}
              <div>
                <span className="text-[11px] text-stone-400 block mb-1.5 font-bold uppercase tracking-wider">
                  Live Core Value Card Preview:
                </span>
                <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      {renderPrincipleIcon(valueForm.icon, "w-5 h-5")}
                    </div>
                    {valueForm.tag && (
                      <span className="px-2.5 py-0.5 bg-stone-900 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase">
                        {valueForm.tag}
                      </span>
                    )}
                  </div>
                  <h5 className="font-serif font-bold text-stone-100 text-sm">
                    {valueForm.title || 'Value Pillar Title'}
                  </h5>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {valueForm.description || 'Value narrative will display here...'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setValueModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingValueId ? 'Save Value Changes' : 'Add Value Pillar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

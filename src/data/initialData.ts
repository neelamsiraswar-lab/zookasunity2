import { 
  SpiritProduct, 
  DistillerInventoryItem, 
  CustomerUser, 
  Order, 
  BlogPost, 
  AboutContent, 
  HomeContent, 
  AdminSettings,
  HeaderCustomizationConfig,
  FooterCustomizationConfig
} from '../types';

export const initialProducts: SpiritProduct[] = [
  {
    id: 'spirit-01',
    name: 'Zookas Unity 18-Year Single Malt Whisky',
    tagline: 'Matured in Pedro Ximénez Sherry & Charred American Oak Casks',
    category: 'Single Malt Whisky',
    price: 185,
    salePrice: 165,
    abv: '48.2%',
    proof: 96.4,
    bottleSize: '750 ml',
    batchNumber: 'UNITY-SM-18',
    caskNumber: 'CASK-PX-409',
    caskType: 'Pedro Ximénez Sherry Finish',
    ageYears: 18,
    stockQuantity: 28,
    lowStockThreshold: 15,
    distillerName: 'Master Distiller Alistair Vance',
    distillerOrigin: 'Speyside Glen, Highlands',
    description: 'An exceptional single malt whisky patiently aged for eighteen years. Notes of rich caramelized figs, dark honeycomb, and toasted Spanish oak unfold into a velvety, lingering finish of dried stone fruits and subtle peat smoke.',
    tastingNotes: {
      aroma: ['Caramelized Figs', 'Seville Orange Marmalade', 'Dark Honeycomb', 'Toasted Oak'],
      palate: ['Dark Chocolate Ganache', 'Medjool Dates', 'Nutmeg & Clove Spice', 'Velvety Malt'],
      finish: ['Long, warm lingering roasted espresso', 'Spanish Sherry sweetness', 'Whisper of Highland peat']
    },
    cocktailPairing: {
      name: 'The Unity Rob Roy',
      tagline: 'A royal, rich classic with elevated complexity',
      ingredients: [
        '2.0 oz Zookas Unity 18-Year Single Malt',
        '0.75 oz Carpano Antica Sweet Vermouth',
        '2 dashes Angostura Bitters',
        '1 dash Aztec Chocolate Bitters',
        'Brandied Cherry & Orange peel twist for garnish'
      ],
      instructions: 'Stir all ingredients over block ice until thoroughly chilled. Strain into a chilled coupe glass. Express orange oils over surface and garnish with brandied cherry.',
      difficulty: 'Intermediate',
      glassware: 'Vintage Coupe'
    },
    awards: ['Double Gold Medal - San Francisco World Spirits Competition 2025', 'Whisky of the Year (98 Pts) - International Spirits Challenge'],
    images: [
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isLimitedRelease: true,
    rating: 4.95,
    reviewCount: 142,
    releaseYear: 2024
  },
  {
    id: 'spirit-02',
    name: 'Zookas Unity Cask Strength Bourbon Batch #09',
    tagline: 'Uncut, Unfiltered, Charred Appalachian White Oak Casks',
    category: 'Cask Strength Bourbon',
    price: 125,
    abv: '57.8%',
    proof: 115.6,
    bottleSize: '750 ml',
    batchNumber: 'BOURBON-BATCH-09',
    caskNumber: 'OAK-APPALACHIAN-72',
    caskType: 'Heavy Alligator Char (#4) White Oak',
    ageYears: 8,
    stockQuantity: 18,
    lowStockThreshold: 20,
    distillerName: 'Colt Sterling',
    distillerOrigin: 'Bluegrass Reserve, Kentucky',
    description: 'Straight from the heart of our barrel house, this cask-strength powerhouse delivers intense vanilla custard, rich maple brown sugar, toasted pecan, and warm rye baking spices with deep barrel char complexity.',
    tastingNotes: {
      aroma: ['Warm Vanilla Bean', 'Toasted Pecan Praline', 'Crème Brûlée', 'Leather & Tobacco'],
      palate: ['Rich Maple Syrup', 'Black Pepper spice', 'Toasted Graham Cracker', 'Charred Oak'],
      finish: ['Explosive warmth', 'Caramel butterscotch', 'Lingering cinnamon and toasted cedar']
    },
    cocktailPairing: {
      name: 'High-Proof Smoked Old Fashioned',
      tagline: 'Smoky, bold, and unapologetically rich',
      ingredients: [
        '2.25 oz Zookas Unity Cask Strength Bourbon',
        '0.25 oz Demerara Syrup (2:1)',
        '2 dashes Orange Bitters',
        '2 dashes Aromatic Bitters',
        'Smoked Applewood chips for glass wash'
      ],
      instructions: 'Smoke a rocks glass with applewood. Stir bourbon, syrup, and bitters with large ice cube until chilled. Strain over fresh king cube. Garnish with expressed flamed orange peel.',
      difficulty: 'Intermediate',
      glassware: 'Heavy Crystal Double Old Fashioned'
    },
    awards: ['Gold Medal - World Whiskies Awards 2024', 'Best High-Proof Bourbon - Craft Distillers Guild'],
    images: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isLimitedRelease: false,
    rating: 4.88,
    reviewCount: 98,
    releaseYear: 2025
  },
  {
    id: 'spirit-03',
    name: 'Zookas Unity Botanical Gin Reserve',
    tagline: 'Infused with 14 Wild Alpine Botanicals & Meyer Lemon Blossom',
    category: 'Botanical Gin',
    price: 72,
    abv: '45.0%',
    proof: 90.0,
    bottleSize: '750 ml',
    batchNumber: 'GIN-BOT-088',
    caskNumber: 'STAINLESS-COPPER-POT-01',
    caskType: 'Vapour Infused in Handcrafted Copper Pot Still',
    stockQuantity: 64,
    lowStockThreshold: 15,
    distillerName: 'Elena Rostova',
    distillerOrigin: 'Cascade Foothills, Pacific Northwest',
    description: 'Distilled using pure mountain glacier water and vapour-infused with hand-foraged juniper berries, coriander seeds, cardamom pods, Meyer lemon peel, elderflower, and wild mountain pine.',
    tastingNotes: {
      aroma: ['Fresh Juniper Pine', 'Bright Meyer Lemon', 'Crushed Cardamom', 'Elderflower Blossom'],
      palate: ['Crisp Cucumber', 'Citrus zest vitality', 'Angelica root earthiness', 'Pink peppercorn'],
      finish: ['Clean, mineral-rich freshness', 'Lingering citrus blossom', 'Gentle spice']
    },
    cocktailPairing: {
      name: 'The Unity Botanical French 75',
      tagline: 'Effervescent, sparkling, and elegant',
      ingredients: [
        '1.5 oz Zookas Unity Botanical Gin',
        '0.75 oz Fresh Lemon Juice',
        '0.5 oz Lavender Honey Syrup',
        '3.0 oz Brut Champagne / Sparkling Wine',
        'Lemon twist & sprig of fresh thyme'
      ],
      instructions: 'Shake gin, lemon juice, and syrup with ice. Strain into a chilled champagne flute. Top with champagne and garnish with thyme sprig and lemon twist.',
      difficulty: 'Easy',
      glassware: 'Champagne Flute'
    },
    awards: ['Platinum Best in Class - London Spirits Competition 2025', 'Master Award - The Gin Masters'],
    images: [
      'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isLimitedRelease: false,
    rating: 4.92,
    reviewCount: 215,
    releaseYear: 2024
  },
  {
    id: 'spirit-04',
    name: 'Zookas Unity Artisanal Aged Caribbean Rum',
    tagline: '12-Year Pot Still Rum Finished in French Cognac Casks',
    category: 'Artisanal Rum',
    price: 98,
    abv: '46.5%',
    proof: 93.0,
    bottleSize: '750 ml',
    batchNumber: 'RUM-PX-COG-12',
    caskNumber: 'COGNAC-BARREL-19',
    caskType: 'Limousin French Cognac Casks',
    ageYears: 12,
    stockQuantity: 34,
    lowStockThreshold: 10,
    distillerName: 'Mateo De La Cruz',
    distillerOrigin: 'Bridgetown Pot Distillers, Caribbean',
    description: 'Distilled from pure unrefined sugar cane molasses in double-retort copper pot stills. Aged 10 years in ex-bourbon oak under tropical temperatures and finished for 2 years in French Limousin cognac casks.',
    tastingNotes: {
      aroma: ['Toasted Coconut', 'Ripe Plantain Flambé', 'Bourbon Vanilla', 'Spiced Tobacco'],
      palate: ['Rich Demerara Sugar', 'Dark Toffee', 'Candied Ginger', 'Cognac Grape Tannins'],
      finish: ['Warm molasses', 'Toasted almond', 'Silky velvety oak spice']
    },
    cocktailPairing: {
      name: 'The Master Distiller Mai Tai',
      tagline: 'Authentic 1944 style tropical sophistication',
      ingredients: [
        '2.0 oz Zookas Unity 12-Year Aged Rum',
        '0.75 oz Fresh Lime Juice',
        '0.5 oz Pierre Ferrand Dry Curaçao',
        '0.5 oz House Toasted Almond Orgeat',
        'Fresh Mint sprig and spent lime wheel'
      ],
      instructions: 'Shake vigorously with crushed ice. Pour unstrained into a double rocks glass. Add more crushed ice to crown. Slap mint sprig to release aromatics and garnish.',
      difficulty: 'Intermediate',
      glassware: 'Tiki Mai Tai Glass'
    },
    awards: ['Gold Medal - Caribbean Spirits Trophy 2024', 'Best Pot Still Rum - Rum Renaissance Festival'],
    images: [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    isLimitedRelease: false,
    rating: 4.86,
    reviewCount: 76,
    releaseYear: 2024
  },
  {
    id: 'spirit-05',
    name: 'Zookas Unity Wild Agave Mezcal Tobalá',
    tagline: 'Artisanal Small-Batch Mezcal from 15-Year Wild Tobalá Agave',
    category: 'Artisanal Mezcal',
    price: 145,
    abv: '47.5%',
    proof: 95.0,
    bottleSize: '750 ml',
    batchNumber: 'TOBALA-OAX-04',
    caskNumber: 'CLAY-AMPHORA-07',
    caskType: 'Rested in Underground Ancestral Clay Amphoras',
    stockQuantity: 12,
    lowStockThreshold: 10,
    distillerName: 'Maestro Mezcalero Joaquin Ramos',
    distillerOrigin: 'Santiago Matatlán, Oaxaca',
    description: 'Harvested from wild Tobalá agaves that grow on high rocky cliffs for 15 years. Roasted in conical underground stone pits with mesquite wood, crushed by horse-drawn tahona, and double distilled in copper stills.',
    tastingNotes: {
      aroma: ['Subtle Wood Smoke', 'Wild Herbs & Thyme', 'Roasted Agave Honey', 'Wet River Stone'],
      palate: ['Creamy roasted agave heart', 'Bright green citrus', 'Mineral flintiness', 'White pepper'],
      finish: ['Elegantly dry smoky minerality', 'Sweet herbal sweetness', 'Crisp mountain earth']
    },
    cocktailPairing: {
      name: 'Oaxacan Smoke & Fire',
      tagline: 'Complex, smoky, and dangerously balanced',
      ingredients: [
        '1.5 oz Zookas Unity Wild Tobalá Mezcal',
        '0.75 oz Ancho Reyes Chile Liqueur',
        '0.75 oz Fresh Lime Juice',
        '0.5 oz Agave Nectar',
        'Sal de Gusano / Smoked chili salt rim'
      ],
      instructions: 'Rim glass with smoked chili salt. Shake ingredients with ice and double strain over single large ice rock. Garnish with dehydrated lime wheel.',
      difficulty: 'Intermediate',
      glassware: 'Etched Lowball Glass'
    },
    awards: ['Best Artisanal Spirit - Mexico Agave Spirits Awards 2025', 'Double Gold - New York Spirits Competition'],
    images: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isLimitedRelease: true,
    rating: 4.97,
    reviewCount: 63,
    releaseYear: 2024
  },
  {
    id: 'spirit-06',
    name: 'Zookas Unity 100% Rye Cask Reserve',
    tagline: 'Spicy, Complex Single Barrel Rye with Port Cask Finish',
    category: 'Cask Strength Bourbon',
    price: 110,
    abv: '53.5%',
    proof: 107.0,
    bottleSize: '750 ml',
    batchNumber: 'RYE-PORT-21',
    caskNumber: 'TAWNY-PORT-CASK-11',
    caskType: 'Tawny Port Pipe Cask Finish',
    ageYears: 7,
    stockQuantity: 22,
    lowStockThreshold: 15,
    distillerName: 'Colt Sterling',
    distillerOrigin: 'Bluegrass Reserve, Kentucky',
    description: 'Crafted from 100% organic winter rye grain. The assertive baking spice, black pepper, and mint of the rye grain is softened by finishing in 30-year-old Portuguese Tawny Port pipes.',
    tastingNotes: {
      aroma: ['Dark Plum Compote', 'Rye Bread Spice', 'Cinnamon Stick', 'Black Cherry'],
      palate: ['Peppery Rye heat', 'Rich Ruby Port sweetness', 'Dark Cocoa nibs', 'Cedarwood'],
      finish: ['Long drying tannin', 'Sweet blackberry jam', 'Warm clove finish']
    },
    cocktailPairing: {
      name: 'The Port-Finished Manhattan',
      tagline: 'Rich, layered, and velvety',
      ingredients: [
        '2.0 oz Zookas Unity 100% Rye Reserve',
        '0.75 oz Punt e Mes Vermouth',
        '0.25 oz Luxardo Maraschino Liqueur',
        '2 dashes Peychaud’s Bitters',
        'Luxardo Maraschino Cherry'
      ],
      instructions: 'Stir with cracked ice for 30 seconds. Strain into a Nick & Nora glass. Garnish with a Maraschino cherry.',
      difficulty: 'Easy',
      glassware: 'Nick & Nora'
    },
    awards: ['Gold Medal - American Distilling Institute 2024'],
    images: [
      'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    isLimitedRelease: false,
    rating: 4.82,
    reviewCount: 52,
    releaseYear: 2025
  },
  {
    id: 'spirit-07',
    name: 'Zookas Unity Reserve Triple-Filtered Vodka',
    tagline: 'Glacier Spring Water & Winter Wheat Filtered Through Birch Charcoal',
    category: 'Unity Reserve Vodka',
    price: 58,
    abv: '40.0%',
    proof: 80.0,
    bottleSize: '750 ml',
    batchNumber: 'VODKA-BIRCH-012',
    caskNumber: 'STAINLESS-PURITY-03',
    caskType: 'Seven-Times Distilled Copper Column',
    stockQuantity: 85,
    lowStockThreshold: 25,
    distillerName: 'Elena Rostova',
    distillerOrigin: 'Nordic Purity Lab, Arctic Springs',
    description: 'An impeccably silky, ultra-smooth premium vodka made from single-estate winter wheat. Seven-times distilled in copper columns and slow-filtered through Siberian birch charcoal and diamond quartz.',
    tastingNotes: {
      aroma: ['Subtle Sweet Grain', 'Clean Mineral Spring', 'Delicate Citrus Blossom'],
      palate: ['Velvety mouthfeel', 'Creamy sweet wheat', 'Zero harsh ethanol burn'],
      finish: ['Crisp, refreshing, whisper of white pepper']
    },
    cocktailPairing: {
      name: 'The Unity Diamond Dry Martini',
      tagline: 'The ultimate standard in crystal purity',
      ingredients: [
        '2.5 oz Zookas Unity Triple-Filtered Vodka',
        '0.5 oz Noilly Prat Dry Vermouth',
        '1 dash Orange Bitters',
        'Queen Green Olive or Lemon twist'
      ],
      instructions: 'Stir vigorously over crystal clear ice until frost forms on mixing glass. Strain into frozen martini glass. Garnish with blue cheese stuffed olive or lemon peel.',
      difficulty: 'Easy',
      glassware: 'Classic V-Martini Glass'
    },
    awards: ['Gold - World Vodka Awards 2024', '95 Points - Beverage Tasting Institute'],
    images: [
      'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    isLimitedRelease: false,
    rating: 4.79,
    reviewCount: 110,
    releaseYear: 2024
  },
  {
    id: 'spirit-08',
    name: 'Zookas Unity 25-Year Rare Peated Cask Release',
    tagline: 'Master Distiller’s Holy Grail: 1 of 250 Hand-Numbered Bottles',
    category: 'Single Malt Whisky',
    price: 495,
    salePrice: 450,
    abv: '51.4%',
    proof: 102.8,
    bottleSize: '750 ml',
    batchNumber: 'RARE-CASK-25',
    caskNumber: 'ISLAY-OCTAVE-001',
    caskType: 'First-Fill Oloroso Sherry Hogshead',
    ageYears: 25,
    stockQuantity: 7,
    lowStockThreshold: 5,
    distillerName: 'Master Distiller Alistair Vance',
    distillerOrigin: 'Islay Coastline, Scotland',
    description: 'A once-in-a-generation release. Quarter-century maturation along wild Atlantic sea cliffs. Maritime brine, intense smoked peat, dark prune preserves, antique mahogany, and rich medicinal complexity.',
    tastingNotes: {
      aroma: ['Atlantic Sea Salt Spray', 'Campfire Peat Smoke', 'Rich Leather Bound Books', 'Dark Stewed Blackberries'],
      palate: ['Oloroso Sherry richness', 'Smoked bacon fat & maple', 'Sweet iodine complexity', 'Cuban tobacco'],
      finish: ['Eternal smoky finish', 'Dark forest truffles', 'Sweet salted caramel']
    },
    cocktailPairing: {
      name: 'Neat in Crystal Glencairn with Pure Spring Droplet',
      tagline: 'Experience pure unadulterated alchemy',
      ingredients: [
        '2.0 oz Zookas Unity 25-Year Rare Release',
        '2 drops Highland Spring Water (optional)'
      ],
      instructions: 'Pour into crystal Glencairn glass. Allow to rest and breathe for 10 minutes. Swirl gently and appreciate the unrepeatable aromatics.',
      difficulty: 'Easy',
      glassware: 'Official Crystal Glencairn Glass'
    },
    awards: ['Best in Show - Ultimate Spirits Challenge (99 Pts)', 'Crown Trophy Winner 2025'],
    images: [
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isLimitedRelease: true,
    rating: 5.0,
    reviewCount: 38,
    releaseYear: 2024
  }
];

export const initialInventoryLots: DistillerInventoryItem[] = [
  {
    id: 'inv-lot-101',
    productId: 'spirit-01',
    productName: 'Zookas Unity 18-Year Single Malt Whisky',
    caskLotNumber: 'CASK-PX-409',
    barrelType: 'Spanish Pedro Ximénez Oak 250L',
    barrelStartDate: '2006-03-15',
    currentProof: 96.4,
    warehouseLocation: 'Distillery Bond 1, Rack 14, Tier 3',
    status: 'Ready for Dispatch',
    bottlesInStock: 28,
    targetStock: 60,
    restockLeadDays: 14,
    distillerNotes: 'Bottling run completed with optimal ester retention. Excellent mahogany color. Sample tests show perfect balance of wood sugars.',
    lastInspectedDate: '2026-08-20'
  },
  {
    id: 'inv-lot-102',
    productId: 'spirit-02',
    productName: 'Zookas Unity Cask Strength Bourbon Batch #09',
    caskLotNumber: 'OAK-APPALACHIAN-72',
    barrelType: 'Char #4 Virgin White American Oak 200L',
    barrelStartDate: '2017-09-10',
    currentProof: 115.6,
    warehouseLocation: 'Warehouse B (Sunlight Loft), Bay 08',
    status: 'Low Stock Alert',
    bottlesInStock: 18,
    targetStock: 80,
    restockLeadDays: 7,
    distillerNotes: 'Barrel heat extraction is peak. Batch 10 scheduled for dumping next Tuesday from Casks #74-78.',
    lastInspectedDate: '2026-08-25'
  },
  {
    id: 'inv-lot-103',
    productId: 'spirit-03',
    productName: 'Zookas Unity Botanical Gin Reserve',
    caskLotNumber: 'GIN-BOT-088',
    barrelType: 'Handmade Copper Pot Vapor Chamber',
    barrelStartDate: '2026-07-01',
    currentProof: 90.0,
    warehouseLocation: 'Stillhouse Floor 1, Copper Vessel #2',
    status: 'Ready for Dispatch',
    bottlesInStock: 64,
    targetStock: 100,
    restockLeadDays: 3,
    distillerNotes: 'Alpine botanical infusion ratio balanced. High terpene clarity and crisp Meyer lemon aromatics verified in GC-MS lab.',
    lastInspectedDate: '2026-08-28'
  },
  {
    id: 'inv-lot-104',
    productId: 'spirit-04',
    productName: 'Zookas Unity Artisanal Aged Caribbean Rum',
    caskLotNumber: 'COGNAC-BARREL-19',
    barrelType: 'Limousin French Oak Cognac Cask 300L',
    barrelStartDate: '2013-11-20',
    currentProof: 93.0,
    warehouseLocation: 'Humid Cellar 3, Stacking Level 2',
    status: 'Ready for Dispatch',
    bottlesInStock: 34,
    targetStock: 50,
    restockLeadDays: 12,
    distillerNotes: 'Cognac cask finish imparting deep rancio and dried stone fruit layers without masking pot still funk.',
    lastInspectedDate: '2026-08-15'
  },
  {
    id: 'inv-lot-105',
    productId: 'spirit-05',
    productName: 'Zookas Unity Wild Agave Mezcal Tobalá',
    caskLotNumber: 'TOBALA-OAX-04',
    barrelType: 'Ancestral Clay Amphora 100L',
    barrelStartDate: '2025-05-12',
    currentProof: 95.0,
    warehouseLocation: 'Artisanal Clay Vault Oaxaca, Section C',
    status: 'Low Stock Alert',
    bottlesInStock: 12,
    targetStock: 30,
    restockLeadDays: 30,
    distillerNotes: 'Wild Tobalá harvest is seasonal and strictly allocation-based. 12 bottles remaining in current batch.',
    lastInspectedDate: '2026-08-22'
  },
  {
    id: 'inv-lot-106',
    productId: 'spirit-08',
    productName: 'Zookas Unity 25-Year Rare Peated Cask Release',
    caskLotNumber: 'ISLAY-OCTAVE-001',
    barrelType: 'First-Fill Oloroso Sherry Hogshead 250L',
    barrelStartDate: '2000-01-18',
    currentProof: 102.8,
    warehouseLocation: 'Vault of Honour (High Security Lockbox #1)',
    status: 'Low Stock Alert',
    bottlesInStock: 7,
    targetStock: 15,
    restockLeadDays: 90,
    distillerNotes: 'Strict allocation. Only 7 of 250 numbered bottles remain for online retail members.',
    lastInspectedDate: '2026-08-29'
  }
];

export const initialCustomer: CustomerUser = {
  id: 'cust-unity-9901',
  name: 'Lord Arthur Sterling',
  email: 'arthur.sterling@casksociety.com',
  phone: '+1 (555) 392-8812',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  loyaltyTier: 'Gold Cask',
  loyaltyPoints: 1850,
  totalSpent: 2640,
  dateJoined: '2023-11-14',
  emailNotifications: true,
  smsNotifications: false,
  spiritPreferences: ['Single Malt Whisky', 'Cask Strength Bourbon', 'Artisanal Mezcal', 'High-Proof Ryes'],
  addresses: [
    {
      id: 'addr-01',
      fullName: 'Lord Arthur Sterling',
      street: '742 Amber Cask Boulevard, Suite 18B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      phone: '+1 (555) 392-8812',
      isDefault: true
    },
    {
      id: 'addr-02',
      fullName: 'Arthur Sterling (Country Estate)',
      street: '12 Highland Mist Ridge',
      city: 'St. Helena',
      state: 'CA',
      zipCode: '94574',
      country: 'United States',
      phone: '+1 (555) 392-8812',
      isDefault: false
    }
  ]
};

export const demoCustomers: CustomerUser[] = [
  initialCustomer,
  {
    id: 'cust-unity-9902',
    name: 'Elena Rostova',
    email: 'elena.rostova@spiritsguild.org',
    phone: '+1 (555) 842-1920',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    loyaltyTier: 'Master Distiller Circle',
    loyaltyPoints: 3420,
    totalSpent: 5120,
    dateJoined: '2022-04-09',
    emailNotifications: true,
    smsNotifications: true,
    spiritPreferences: ['Botanical Gin', 'High-Proof Ryes', 'Cask Strength Bourbon'],
    addresses: [
      {
        id: 'addr-elena-01',
        fullName: 'Elena Rostova',
        street: '88 Pike Ridge Way, Suite 4',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'United States',
        phone: '+1 (555) 842-1920',
        isDefault: true
      }
    ]
  },
  {
    id: 'cust-unity-9903',
    name: 'Marcus Vance',
    email: 'marcus.vance@speysidevault.com',
    phone: '+1 (555) 671-3309',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    loyaltyTier: 'Silver Cask',
    loyaltyPoints: 920,
    totalSpent: 1350,
    dateJoined: '2024-02-18',
    emailNotifications: true,
    smsNotifications: false,
    spiritPreferences: ['Single Malt Whisky', 'Rare Peated Cask Releases', 'Artisanal Aged Rum'],
    addresses: [
      {
        id: 'addr-marcus-01',
        fullName: 'Marcus Vance',
        street: '450 Lexington Avenue, Penthouse 3',
        city: 'New York',
        state: 'NY',
        zipCode: '10017',
        country: 'United States',
        phone: '+1 (555) 671-3309',
        isDefault: true
      }
    ]
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-9921',
    orderNumber: 'ZUS-2026-9921',
    date: '2026-08-28T14:20:00Z',
    status: 'Batch Sealed',
    items: [
      {
        product: initialProducts[0],
        quantity: 1,
        giftBox: true,
        customEngraving: 'To Arthur - Vintage Fellowship 2026'
      },
      {
        product: initialProducts[2],
        quantity: 2,
        giftBox: false
      }
    ],
    subtotal: 309,
    discount: 25,
    giftBoxFee: 15,
    shipping: 0,
    tax: 24.50,
    total: 323.50,
    payment: {
      type: 'card',
      cardLast4: '4242',
      cardBrand: 'Visa Signature',
      transactionId: 'txn_unity_live_99881144',
      paidAt: '2026-08-28T14:21:10Z'
    },
    shippingAddress: initialCustomer.addresses[0],
    trackingNumber: '1Z9999999999999999',
    carrier: 'Spirits Express Priority Carrier',
    ageConfirmed: true,
    loyaltyPointsEarned: 320,
    loyaltyPointsUsed: 250,
    notes: 'Adult signature strictly required upon delivery.'
  },
  {
    id: 'ord-9840',
    orderNumber: 'ZUS-2026-9840',
    date: '2026-08-10T11:05:00Z',
    status: 'Delivered',
    items: [
      {
        product: initialProducts[1],
        quantity: 1,
        giftBox: false
      },
      {
        product: initialProducts[4],
        quantity: 1,
        giftBox: true,
        customEngraving: 'Ancestral Smoke'
      }
    ],
    subtotal: 270,
    discount: 0,
    giftBoxFee: 15,
    shipping: 15,
    tax: 23.80,
    total: 323.80,
    payment: {
      type: 'apple_pay',
      transactionId: 'txn_apple_pay_8712361',
      paidAt: '2026-08-10T11:05:44Z'
    },
    shippingAddress: initialCustomer.addresses[0],
    trackingNumber: '1Z8888888888888888',
    carrier: 'FedEx Alcohol Special Services',
    ageConfirmed: true,
    loyaltyPointsEarned: 323,
    loyaltyPointsUsed: 0
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-01',
    slug: 'the-alchemy-of-sherry-cask-finishing',
    title: 'The Alchemy of Sherry Casks: How Oloroso & Pedro Ximénez Reshape Malt',
    excerpt: 'Explore how ancient Spanish bodega wood breathes dried fig, caramelized honeycomb, and dark walnut notes into high-proof spirits.',
    content: `When our Master Distillers source 250-liter oak hogsheads from the sun-drenched bodegas of Jerez de la Frontera, Spain, we are not simply purchasing wood; we are inheriting decades of fortified wine history.

### The Science of Wood Extraction
Oak barrels act as semi-permeable membranes. As seasonal temperatures fluctuate inside our bond warehouses, the spirit expands deep into the cellular structure of the oak staves during warm summer months, extracting:
- **Lignins**: Converting into rich vanillin and toasted almond aromas.
- **Tannins**: Imparting structural backbone and velvety mouthfeel.
- **Lactones**: Giving pleasant toasted coconut nuances.

### Why Pedro Ximénez vs Oloroso?
Oloroso casks bring oxidative, nutty notes of roasted walnuts, tobacco leaf, and dry spice. Pedro Ximénez (PX) casks, on the other hand, originate from intensely sweet, sun-dried white grapes, coating the spirit with notes of dark treacle, sticky toffee, and macerated black cherries.

In our *Zookas Unity 18-Year Single Malt*, we marry both disciplines to create an orchestra of sweet dark fruit backed by muscular malt backbone.`,
    author: {
      name: 'Master Distiller Alistair Vance',
      role: 'Master of Cask Selection',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    publishedDate: '2026-08-18',
    category: 'Distillation Science',
    readTimeMinutes: 6,
    coverImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sherry Cask', 'Single Malt', 'Whisky Aging', 'Barrel Science'],
    comments: [
      {
        id: 'c-01',
        name: 'Julian Montgomery',
        date: '2026-08-20',
        text: 'The 18-Year really is extraordinary. The PX sweetness at the back of the palate ties together the smoke effortlessly.'
      },
      {
        id: 'c-02',
        name: 'Clara Beaumont',
        date: '2026-08-24',
        text: 'Fascinating breakdown of the oak extraction chemistry. Looking forward to tasting the batch!'
      }
    ]
  },
  {
    id: 'blog-02',
    slug: 'the-art-of-botanical-vapour-infusion',
    title: 'Vapour Infusion vs Direct Maceration in Craft Gin Distillation',
    excerpt: 'Why we suspend hand-picked wild botanicals in high copper baskets rather than boiling them in the pot.',
    content: `Most commercial gins boil their botanicals directly in the wash. While effective for heavy roots like angelica and orris, direct boiling burns delicate florals and destroys volatile terpenes.

### The Copper Basket Technique
At Zookas Unity Spirits, we utilize a specialized Carter-Head copper vapour chamber. As the neutral wheat spirit vaporizes at 78.3°C, the rising alcohol steam gently rises through stratified layers of:
1. **Base Layer**: Crushed Macedonian Juniper & Coriander Seeds
2. **Heart Layer**: Cardamom pods, Cassia bark & Angelica
3. **Crown Layer**: Fresh Meyer Lemon Blossoms & Wild Alpine Thyme

This allows only the most delicate essential oils to condense into our finished Botanical Gin, yielding an impossibly silky, crystal-clear elixir without any oily bitterness.`,
    author: {
      name: 'Elena Rostova',
      role: 'Head of Botanical Research',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
    },
    publishedDate: '2026-08-05',
    category: 'Craft Cocktail & Mixology',
    readTimeMinutes: 4,
    coverImage: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gin', 'Botanicals', 'Copper Pot', 'Distillation'],
    comments: [
      {
        id: 'c-03',
        name: 'Chef Marcus Webb',
        date: '2026-08-11',
        text: 'We feature this gin in our tasting menu paired with smoked oysters. It has incredible aromatic lift.'
      }
    ]
  },
  {
    id: 'blog-03',
    slug: 'high-proof-bourbon-cocktail-philosophy',
    title: 'Why High-Proof Bourbons Rule the Modern Cocktail Revival',
    excerpt: 'Discover why professional bartenders and connoisseurs demand 100+ proof spirits when crafting iconic cocktails.',
    content: `When you shake or stir a cocktail with ice, you are introducing 20% to 30% water dilution. A standard 80-proof spirit gets quickly washed out, losing its aromatic punch and body.

By utilizing our **115.6 Proof Zookas Unity Cask Strength Bourbon**, the bold charred barrel oak, spicy rye grain, and caramelized brown sugar stand strong against dilution, citrus acids, and herbal bitters.

Try it in a Smoked Old Fashioned or a Black Manhattan and experience the difference true proof makes.`,
    author: {
      name: 'Colt Sterling',
      role: 'Master Bourbon Blender',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    publishedDate: '2026-07-29',
    category: 'Mixology & Pairing',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Bourbon', 'Cocktails', 'High Proof', 'Old Fashioned'],
    comments: []
  }
];

export const initialAboutContent: AboutContent = {
  heritageTitle: 'The Heritage of Zookas Unity Spirits',
  heritageSubtitle: 'Artisanal Distillation, Uncompromising Integrity, and Pure Small-Batch Craftsmanship.',
  storyParagraph1: 'Founded on the principle of bringing the world’s most refined distillation traditions together into harmony, Zookas Unity Spirits represents the union of time-tested heritage and cutting-edge craft science.',
  storyParagraph2: 'From the peat-kissed coasts of Scotland to the limestone-rich water tables of Kentucky and the mountain cliffs of Oaxaca, our master distillers unite rare grains, wild botanicals, and bespoke cooperage to create spirits of extraordinary depth and singular character.',
  storyParagraph3: 'Every single bottle is filled, labeled, wax-sealed, and cataloged by hand at our master distillery. We never chill-filter, we never add artificial coloring, and we let patient wood aging tell the true story of time.',
  copperPotTitle: 'Hand-Hammered Copper Pot Alchemy',
  copperPotDescription: 'Our custom twin copper pot stills were hand-hammered in Speyside by third-generation coppersmiths. The heavy copper contact removes volatile sulfur compounds, concentrating silky esters, complex fruit notes, and velvety mouthfeel.',
  copperPotImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1000&q=80',
  masterDistillers: [
    {
      id: 'dist-01',
      name: 'Alistair Vance',
      role: 'Master Distiller & Cask Curator',
      bio: '34 years of whisky crafting across Speyside and Islay. Renowned worldwide for pioneering octave sherry finishes and multi-cask vatting.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experienceYears: 34,
      signatureSpirit: '18-Year Single Malt & Rare 25-Year Peated Reserve'
    },
    {
      id: 'dist-02',
      name: 'Colt Sterling',
      role: 'Master Bourbon & Rye Blender',
      bio: 'Fourth-generation Kentucky distiller with deep reverence for high-rye mash bills, heavy alligator barrel charring, and warehouse microclimates.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      experienceYears: 22,
      signatureSpirit: 'Cask Strength Bourbon Batch #09 & 100% Rye Port Cask'
    },
    {
      id: 'dist-03',
      name: 'Elena Rostova',
      role: 'Botanical & Purity Alchemist',
      bio: 'Botanist and master distiller specializing in wild alpine forage, vapor-infusion kinetics, and ultra-smooth crystal spring filtration.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      experienceYears: 18,
      signatureSpirit: 'Unity Botanical Gin & Triple-Filtered Reserve Vodka'
    },
    {
      id: 'dist-04',
      name: 'Joaquin Ramos',
      role: 'Maestro Mezcalero & Agave Guardian',
      bio: 'Lifelong artisanal mezcalero preserving ancestral underground earthen pit roasting, horse tahona crushing, and clay pot distillation.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experienceYears: 29,
      signatureSpirit: 'Wild Tobalá Artisanal Mezcal'
    }
  ],
  sustainabilityGoals: [
    '100% Spent grain donated to local regenerative livestock farms',
    'Zero-waste closed loop closed condenser water cooling cycle',
    'Certified sustainable American & European oak cooperage replanting programs',
    'Solar-powered bottling house & eco-luxe recycled glass bottles with organic beeswax seals'
  ],
  distilleryAddress: '888 Copper Still Lane, Distillers Valley, CA 94574',
  distilleryHours: 'Wednesday – Sunday: 11:00 AM – 7:00 PM (Tasting Tours by Reservation)',
  distilleryPhone: '+1 (800) 555-ZOOKAS'
};

export const initialHomeContent: HomeContent = {
  announcementText: '🥃 NEW CASK RELEASE: Batch #09 Cask Strength Bourbon & 18-Year Single Malt now available. Complimentary insured shipping on orders $150+.',
  showAnnouncement: true,
  heroHeading: 'Pure Artisanal Craft. Bottled with Uncompromising Passion.',
  heroSubheading: 'Small-batch single malt whiskies, cask-strength bourbons, wild botanical gins, and rare reserve spirits crafted by world-renowned master distillers.',
  heroBadgeText: '⭐ Double Gold San Francisco 2025 Winner',
  heroCtaText: 'Explore Spirits Vault',
  heroBgImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1920&q=85',
  carouselSlides: [
    {
      id: 'slide-1',
      heading: 'Pure Artisanal Craft. Bottled with Uncompromising Passion.',
      subtitle: 'Small-batch single malt whiskies, cask-strength bourbons, wild botanical gins, and rare reserve spirits crafted by world-renowned master distillers.',
      image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1920&q=85',
      badge: '⭐ Double Gold San Francisco 2025 Winner',
      ctaText: 'Explore Spirits Vault',
      ctaAction: 'shop'
    },
    {
      id: 'slide-2',
      heading: 'Rare Single Cask Allocations & Sherry Oak Finishing.',
      subtitle: 'Aged in 250-liter Spanish Pedro Ximénez butts and charred American white oak barrels deep within our climate-regulated bonded warehouse.',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1920&q=85',
      badge: '🪵 Limited Bond House Release',
      ctaText: 'Reserve Cask Allocations',
      ctaAction: 'shop'
    },
    {
      id: 'slide-3',
      heading: 'Handcrafted Scottish Copper Pot Distillation.',
      subtitle: 'Slow, unhurried batch distillation in our traditional copper swan stills for velvety texture, rich ester concentration, and pure spirit depth.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1920&q=85',
      badge: '🔥 100% Copper Pot Heritage',
      ctaText: 'Our Distilling Philosophy',
      ctaAction: 'about'
    },
    {
      id: 'slide-4',
      heading: 'Wild Alpine Botanicals & Pure Mountain Springs.',
      subtitle: 'Wild foraged botanicals vapor-infused with crystal Sierra Nevada spring water to create ultra-smooth artisanal gins and crisp reserve vodkas.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=85',
      badge: '🌿 Wild Foraged & Pure Infusions',
      ctaText: 'Read Distiller Journal',
      ctaAction: 'blog'
    }
  ],
  spotlightProductSubtitle: 'Hand-Selected by Master Distiller Alistair Vance from Rare Spanish Pedro Ximénez Butts',
  heritageChronology: {
    showSection: true,
    sectionBadge: '⏳ Over A Century of Distilling Mastery',
    sectionTitle: 'Chronology & Distillation Heritage',
    sectionSubtitle: 'Traced through five generations of unhurried distillation, hand-hammered Scottish copper stills, and rare Iberian sherry hogsheads.',
    milestones: [
      {
        id: 'milestone-1884',
        year: '1884',
        title: 'The Founding Forge & Mountain Still',
        subtitle: 'Scottish Copper Craft in the Sierra Nevada Valley',
        description: 'Master distiller Malcolm Vance commissioned a 1,500-liter hand-hammered copper swan neck pot still from Aberdeenshire, establishing the distillery beside pure mountain glacial aquifers.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
        caskType: 'First-Fill European Oak',
        tag: 'Founding Era',
        statLabel: 'Pot Still Volume',
        statValue: '1,500 L Copper Swan'
      },
      {
        id: 'milestone-1923',
        year: '1923',
        title: 'The Hidden Cellars & Secret Solera',
        subtitle: 'Guarded Barrel Reserves Beneath Granite Caverns',
        description: 'To preserve heritage stocks during the dry era, the family sealed 60 ancient oak casks inside natural granite underground vaults, nurturing a perpetual solera system that informs our reserves today.',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
        caskType: 'Perpetual Solera Puncheons',
        tag: 'Subterranean Vaults',
        statLabel: 'Cellar Temp',
        statValue: '54°F Natural Microclimate'
      },
      {
        id: 'milestone-1965',
        year: '1965',
        title: 'Level-4 Alligator Char Innovation',
        subtitle: 'Mastering Heavy Char American White Oak',
        description: 'Pioneered custom 45-second deep wood firing with master coopers in Missouri, releasing deep vanillin, caramelized honeycomb, and smoky toasted marshmallow notes into our high-rye mash bills.',
        image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80',
        caskType: 'Char #4 American White Oak',
        tag: 'Oak Science',
        statLabel: 'Wood Char Depth',
        statValue: '6.5mm Deep Alligator'
      },
      {
        id: 'milestone-1998',
        year: '1998',
        title: 'Jerez de la Frontera Sherry Butt Alliance',
        subtitle: 'Exclusive 250-Liter Pedro Ximénez Oak Import',
        description: 'Established a direct, lasting partnership with family bodegas in Jerez, Spain to secure 30-year seasoned oloroso and Pedro Ximénez casks for secondary cask finishing.',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80',
        caskType: 'Spanish Pedro Ximénez Butts',
        tag: 'Iberian Oak Finishing',
        statLabel: 'Sherry Seasoning',
        statValue: '30+ Years Vinification'
      },
      {
        id: 'milestone-2015',
        year: '2015',
        title: 'Vapor-Infused Alpine Botanical Craft',
        subtitle: 'Wild Mountain Botanicals & Cold Condensation',
        description: 'Custom-built a slow vapor copper basket still to extract delicate essential oils from wild alpine juniper berries, coriander, citrus peels, and mountain herbs without scorching delicate esters.',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
        caskType: 'Glass Demi-John & Neutral Oak',
        tag: 'Botanical Alchemy',
        statLabel: 'Botanical Blend',
        statValue: '14 Foraged Species'
      },
      {
        id: 'milestone-2025',
        year: '2025',
        title: 'Global Double Gold & Bond House Expansion',
        subtitle: 'San Francisco World Spirits Competition 98 Points',
        description: 'Our 18-Year Solera Single Malt and Small-Batch Bourbon earned unanimous Double Gold, cementing Zookas Unity Spirits among the world’s most revered independent distilleries.',
        image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80',
        caskType: 'Single Cask Allocations',
        tag: 'Global Accolade',
        statLabel: 'Judges Score',
        statValue: '98/100 Double Gold'
      }
    ]
  },
  artisansSection: {
    showSection: true,
    sectionBadge: '✨ Master Craftsmen & Living Legends',
    sectionTitle: 'The Artisans: Master Distillers & Alchemists',
    sectionSubtitle: 'Over eight decades of collective distillation mastery across single malts, cask-strength bourbons, wild alpine botanicals, and ancestral earthen agaves.'
  },
  guidingPrinciples: {
    showSection: true,
    sectionBadge: '🏛️ Foundational Creed & Distillation Ethics',
    sectionTitle: 'Guiding Principles: Mission, Vision & Core Values',
    sectionSubtitle: 'The unyielding standards and spiritual ethos that govern every drop distilled, barrel charred, and bottle hand-sealed at Zookas Unity Spirits.',
    missionBadge: 'Our Sacred Calling',
    missionTitle: 'The Mission',
    missionStatement: 'To unite the world’s most revered distillation traditions through uncompromising artisanal craftsmanship, honoring natural mountain terroirs, ancestral copper alchemy, and patient wood maturation to create extraordinary spirits that elevate human connection and celebration.',
    missionHighlightQuote: '“Every harvest, every mash bill, every single cask is bottled with pure integrity—no shortcuts, no chill-filtration, no artificial additives.”',
    missionImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80',
    visionBadge: 'Our Century Horizon',
    visionTitle: 'The Vision',
    visionStatement: 'To lead the global renaissance of independent craft distillation by championing zero-compromise quality, regenerative agricultural alliances, heirloom grain revival, and perpetual solera aging for generations of discerning connoisseurs across the globe.',
    visionHighlightQuote: '“We do not distill for quarterly yields; we distill for the century ahead and the masters who will inherit these barrels.”',
    visionImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=80',
    valuesTitle: 'Pillars of Distillation Craft',
    valuesSubtitle: 'Six fundamental convictions that guide our masters from mountain spring to sealed crystal bottle.',
    values: [
      {
        id: 'val-01',
        title: 'Uncompromising Purity & Alchemy',
        description: 'Never chill-filtered, never artificially colored, and distilled exclusively in hand-hammered Scottish copper swan neck pot stills to retain complete natural ester bouquets.',
        icon: 'Flame',
        tag: '100% Pure Distillate'
      },
      {
        id: 'val-02',
        title: 'Reverence for Oak & Time',
        description: 'A patient maturation philosophy utilizing 30-year seasoned Spanish Oloroso and Pedro Ximénez sherry butts alongside heavy alligator-char American white oak casks.',
        icon: 'Clock',
        tag: 'Patient Maturation'
      },
      {
        id: 'val-03',
        title: 'Regenerative Terroir & Stewardship',
        description: 'Closed-loop condenser cooling cycles, 100% spent grain donated to local organic livestock farms, and certified oak replanting alliances in North America and Europe.',
        icon: 'Leaf',
        tag: 'Eco-Stewardship'
      },
      {
        id: 'val-04',
        title: 'Living Artisanal Lineage',
        description: 'Empowering world-class master distillers, cooperage artisans, and botanical alchemists to practice their sensory craft freely without industrial yield pressures.',
        icon: 'Award',
        tag: 'Human Mastery'
      },
      {
        id: 'val-05',
        title: 'Radical Provenance & Transparency',
        description: 'Individually numbered bottles with transparent cask lot numbers, exact barrel wood provenance, verified age declarations, and authentic proof statements.',
        icon: 'ShieldCheck',
        tag: 'Numbered Casks'
      },
      {
        id: 'val-06',
        title: 'Fellowship & Elevated Hospitality',
        description: 'Cultivating a global community of spirits enthusiasts through private cask allocations, immersive masterclasses, and the shared joy of exceptional drink.',
        icon: 'HeartHandshake',
        tag: 'Unity Bond'
      }
    ]
  },
  distillerQuote: '“True spirit distillation is not an industrial process; it is a sacred dialogue between grain, mountain spring water, seasoned copper, and the patient breath of ancient oak.”',
  distillerQuoteAuthor: 'Alistair Vance, Master Distiller at Zookas Unity Spirits',
  features: [
    {
      title: 'Small Batch & Numbered Casks',
      description: 'Each release is drawn from individually inspected single barrels with transparent batch, proof, and cask lot verification.',
      icon: 'Flame'
    },
    {
      title: 'Real-Time Distiller Inventory',
      description: 'Direct live synchronization with our bond barrel houses. What you see is bottled fresh and ready for insured dispatch.',
      icon: 'PackageCheck'
    },
    {
      title: 'Unity Cask Club Rewards',
      description: 'Earn 10 points per dollar spent. Unlock exclusive VIP cask releases, custom bottle engravings, and masterclass invitations.',
      icon: 'Award'
    },
    {
      title: 'Insured Temperature-Controlled Delivery',
      description: 'Every bottle is cradled in custom shock-absorbing timber gift boxes and shipped with certified legal age verification.',
      icon: 'ShieldCheck'
    }
  ]
};

export const initialAdminSettings: AdminSettings = {
  brandName: 'Zookas Unity Spirits',
  brandTagline: 'Artisanal Craft Spirits & Small-Batch Distillery',
  contactEmail: 'concierge@zookasunityspirits.com',
  contactPhone: '+1 (800) 555-ZOOKAS',
  currencySymbol: '$',
  taxRatePercent: 8.25,
  freeShippingThreshold: 150,
  standardShippingRate: 15,
  expressShippingRate: 28,
  pointsPerDollar: 10,
  pointsRedemptionRate: 100, // 100 points = $1 discount
  ageGateRequired: true,
  accentColor: '#d97706', // amber-600
  adminPassword: 'zookas2026',
  adminPin: '8821',
  requireBothPasswordAndPin: false,
  sessionTimeoutMinutes: 30
};

export const initialHeaderConfig: HeaderCustomizationConfig = {
  logoType: 'icon_text',
  logoIcon: 'Flame',
  brandTitle: 'Zookas Unity Spirits',
  brandSubtitle: 'Artisanal Distillery & Cask Vault',
  announcement: {
    enabled: true,
    text: 'Complimentary Insured Courier Dispatch On All Orders Over $150 • Direct From Bonded Cellar',
    badgeText: 'Cellar Dispatch',
    linkTab: 'products',
    showSparkleIcon: true,
    style: 'amber_gradient'
  },
  navLinks: [
    { id: 'nav-home', label: 'Home', tab: 'home', visible: true, icon: 'Flame' },
    { id: 'nav-products', label: 'Spirits Vault', tab: 'products', visible: true, badge: 'Small Batch', icon: 'Wine' },
    { id: 'nav-about', label: 'Our Story', tab: 'about', visible: true, icon: 'Building2' },
    { id: 'nav-blog', label: 'Tasting Journal', tab: 'blog', visible: true, icon: 'BookOpen' },
    { id: 'nav-account', label: 'My Account', tab: 'account', visible: true, icon: 'User' }
  ],
  showSearch: true,
  searchPlaceholder: 'Search spirits, casks, mash bills...',
  showCloudSyncIndicator: true,
  showCustomerAccountMenu: true,
  showCartButton: true,
  cartButtonLabel: 'Cask Cart',
  stickyHeader: true,
  headerTheme: 'dark_glass'
};

export const initialFooterConfig: FooterCustomizationConfig = {
  newsletterSection: {
    enabled: true,
    badgeText: 'The Distiller’s Private Circle',
    heading: 'Receive First-Access to Limited Single Cask Allocations',
    description: 'Join our private membership ledger to receive advance tasting notes, invitations to master distiller classes, and instant 10% off your inaugural order.',
    inputPlaceholder: 'Enter your private connoisseur email...',
    buttonText: 'Subscribe 10% Off',
    discountCode: 'UNITY10',
    discountPercentText: '10% OFF',
    successMessage: 'Welcome to the Fellowship! Code UNITY10 applied for 10% off.'
  },
  brandColumn: {
    logoType: 'icon_text',
    logoIcon: 'Flame',
    brandTitle: 'Zookas Unity Spirits',
    aboutText: 'Artisanal small-batch single malt whiskies, cask-strength bourbons, alpine gins, and aged rums crafted with unhurried devotion to copper pot distillation.',
    complianceBadges: {
      show21PlusBadge: true,
      text21Plus: '21+ Legal Compliance',
      showSslBadge: true,
      textSsl: '256-Bit SSL Encrypted',
      showCraftCertifiedBadge: true,
      textCraftCertified: 'Craft Certified Distiller'
    }
  },
  columns: [
    {
      id: 'col-spirits',
      title: 'Spirits Vault',
      visible: true,
      links: [
        { id: 'fl-1', label: 'Single Malt Whiskies', actionType: 'tab', targetTab: 'products', badge: '18-Yr Solera' },
        { id: 'fl-2', label: 'Cask Strength Bourbons', actionType: 'tab', targetTab: 'products', badge: 'Char #4' },
        { id: 'fl-3', label: 'Botanical Vapour Gins', actionType: 'tab', targetTab: 'products' },
        { id: 'fl-4', label: 'French Cognac Finish Rums', actionType: 'tab', targetTab: 'products' },
        { id: 'fl-5', label: 'Rare Vintage Reserves (25-Yr)', actionType: 'tab', targetTab: 'products', highlight: true }
      ]
    },
    {
      id: 'col-distillery',
      title: 'Distillery & Lore',
      visible: true,
      links: [
        { id: 'fl-6', label: 'Copper Pot Alchemy', actionType: 'tab', targetTab: 'about' },
        { id: 'fl-7', label: 'Meet the Master Distillers', actionType: 'tab', targetTab: 'about' },
        { id: 'fl-8', label: 'Tasting Notes & Mixology', actionType: 'tab', targetTab: 'blog' },
        { id: 'fl-9', label: 'Unity Cask Club Rewards', actionType: 'tab', targetTab: 'account' },
        { id: 'fl-10', label: 'Distillery Admin Portal', actionType: 'tab', targetTab: 'admin', highlight: true }
      ]
    }
  ],
  distilleryContact: {
    showContactColumn: true,
    title: 'Distillery & Bond',
    address: '428 Highland Copper Way, SPEYSIDE & BLUEGRASS BOND 01',
    hours: 'Tasting Room: Wed-Sun 11AM - 9PM • Vault Dispatches Mon-Fri',
    phone: '+1 (800) 555-ZOOKAS',
    email: 'concierge@zookasunityspirits.com',
    showConciergeBadge: true,
    conciergeText: 'Private Concierge Available'
  },
  bottomBar: {
    copyrightText: '© {year} Zookas Unity Spirits. All Rights Reserved. Please enjoy our spirits responsibly. Adult signature required upon delivery.',
    disclaimerText: 'Alcoholic beverages may only be sold and delivered to individuals who are at least 21 years old.',
    taglines: [
      '21+ Verification Mandated',
      'Direct-to-Consumer Craft Shipping',
      'Real-time Cask Ledger',
      'Insured Bonded Warehouse'
    ],
    showAdminPortalLink: true,
    adminPortalLabel: 'Master Distiller CMS Access'
  },
  socialLinks: [
    { id: 'soc-1', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com', enabled: true },
    { id: 'soc-2', platform: 'twitter', label: 'X (Twitter)', url: 'https://twitter.com', enabled: true },
    { id: 'soc-3', platform: 'youtube', label: 'YouTube Distiller Series', url: 'https://youtube.com', enabled: true }
  ],
  footerTheme: 'deep_stone'
};

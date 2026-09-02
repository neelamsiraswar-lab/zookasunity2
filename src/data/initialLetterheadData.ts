import { LetterheadTemplate, LetterheadDocument } from '../types';

export const initialLetterheadTemplates: LetterheadTemplate[] = [
  {
    id: 'tmpl-cask-cert',
    name: 'Certificate of Cask Origin & Authenticity',
    category: 'certificate',
    description: 'Official parchment certificate for single cask releases, barrel allocations, and authenticated vintage bottles.',
    isDefault: true,
    paperStyle: 'vintage_parchment',
    headerLayout: 'centered_royal_crest',
    distilleryName: 'ZOOKAS UNITY SPIRITS',
    tagline: 'Artisanal Highlands Distillers & Bonded Cask Keepers',
    heritageYear: 'Est. 1892 • Speyside Highlands',
    crestIcon: 'Crown',
    showRoyalWarrant: true,
    royalWarrantText: 'By Appointment to Connoisseurs & Fine Spirits Collectors Worldwide',
    bondHouseRegistration: 'SCOT-BOND-HW-8841-B',
    taxExciseLicense: 'GB-EXCISE-SPIRITS-99201',
    contactAddress: 'Unity Glen Distillery, Glenlivet Estate, Moray AB37 9DD, Scotland',
    contactPhone: '+44 (0) 1340 882 100',
    contactEmail: 'vault@zookasunityspirits.com',
    contactWebsite: 'https://zookasunityspirits.com',
    headerDivider: 'double_gold_filigree',
    watermarkType: 'authenticated_seal',
    watermarkText: 'AUTHENTICATED DISTILLERY ARCHIVE',
    watermarkOpacity: 0.08,
    watermarkRotation: -25,
    showWaxSeal: true,
    waxSealText: 'ZOOKAS UNITY SPIRITS • SEAL OF PROVENANCE • AUTHENTICATED',
    waxSealColor: 'ruby_crimson',
    showSignatureBlock: true,
    signatoryName: 'Alistair Vance',
    signatoryTitle: 'Master Distiller & Cask Keeper',
    signatorySignatureFont: 'signature_1',
    showCoSignatory: true,
    coSignatoryName: 'Lady Fiona MacIntyre',
    coSignatoryTitle: 'Keeper of the Bonded Vault',
    showSecurityQrHash: true,
    securityHashPrefix: 'ZUK-AUTH-VERIFY-',
    legalDisclaimer: 'This certificate confirms distillation in copper pot stills, un-chillfiltered maturation in bonded wood casks, and individual bottling under statutory excise supervision.',
    accentColor: 'gold',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'tmpl-bonded-dispatch',
    name: 'Bonded Warehouse Release & Dispatch Note',
    category: 'dispatch',
    description: 'Official dispatch, bill of lading, and customs release documentation for tax-bonded spirit consignments.',
    isDefault: false,
    paperStyle: 'clean_bond_white',
    headerLayout: 'split_crest_left',
    distilleryName: 'ZOOKAS UNITY SPIRITS',
    tagline: 'Customs Bonded Warehouse No. 4 & Excise Logistics Division',
    heritageYear: 'Registered Bond House No. 8841',
    crestIcon: 'ShieldCheck',
    showRoyalWarrant: false,
    bondHouseRegistration: 'SCOT-BOND-HW-8841-B',
    taxExciseLicense: 'GB-EXCISE-SPIRITS-99201',
    contactAddress: 'Bond Warehouse 4, Speyside Way, Craigellachie AB38 9RR, UK',
    contactPhone: '+44 (0) 1340 882 400',
    contactEmail: 'logistics@zookasunityspirits.com',
    contactWebsite: 'https://zookasunityspirits.com/bonded',
    headerDivider: 'minimal_amber_line',
    watermarkType: 'bonded_release',
    watermarkText: 'CUSTOMS BONDED DISPATCH',
    watermarkOpacity: 0.06,
    watermarkRotation: 0,
    showWaxSeal: false,
    waxSealText: 'BONDED LOGISTICS SUPERVISION',
    waxSealColor: 'obsidian_black',
    showSignatureBlock: true,
    signatoryName: 'Marcus Sterling',
    signatoryTitle: 'Chief Revenue & Excise Controller',
    signatorySignatureFont: 'signature_2',
    showCoSignatory: false,
    showSecurityQrHash: true,
    securityHashPrefix: 'ZUK-EXCISE-REL-',
    legalDisclaimer: 'Goods released under bond transfer license. Strictly prohibited from un-excised resale. Duty liability remains subject to HMRC inspection.',
    accentColor: 'amber',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'tmpl-vip-invitation',
    name: 'Private Vault VIP Allocation & Invitation',
    category: 'invitation',
    description: 'Luxury obsidian and gold letterhead for private client tastings, ballot winner notices, and bespoke barrel reservations.',
    isDefault: false,
    paperStyle: 'obsidian_gold',
    headerLayout: 'classic_editorial',
    distilleryName: 'ZOOKAS UNITY SPIRITS',
    tagline: 'The Private Connoisseurs Circle & Private Reserve Vault',
    heritageYear: 'Private Client Reserve • Speyside Highlands',
    crestIcon: 'Sparkles',
    showRoyalWarrant: true,
    royalWarrantText: 'Exclusive Allocation Privileges by Private Invitation Only',
    bondHouseRegistration: 'SCOT-BOND-HW-8841-B',
    taxExciseLicense: 'GB-EXCISE-SPIRITS-99201',
    contactAddress: 'The Vault Salon, Castle Terrace, Edinburgh EH1 2DP & Speyside Glen',
    contactPhone: '+44 (0) 131 556 8920',
    contactEmail: 'concierge@zookasunityspirits.com',
    contactWebsite: 'https://zookasunityspirits.com/private',
    headerDivider: 'distiller_emblem_divider',
    watermarkType: 'distillery_crest',
    watermarkText: 'PRIVATE VAULT RESERVE',
    watermarkOpacity: 0.09,
    watermarkRotation: -15,
    showWaxSeal: true,
    waxSealText: 'ZOOKAS PRIVATE RESERVE • PRIVILEGED CLIENT',
    waxSealColor: 'antique_gold',
    showSignatureBlock: true,
    signatoryName: 'Lord Callum Sutherland',
    signatoryTitle: 'Patron & Chairman of Private Reserves',
    signatorySignatureFont: 'signature_3',
    showCoSignatory: true,
    coSignatoryName: 'Alistair Vance',
    coSignatoryTitle: 'Master Distiller',
    showSecurityQrHash: true,
    securityHashPrefix: 'ZUK-VIP-INV-',
    legalDisclaimer: 'Allocation reservation is held for 14 calendar days from dispatch date. Privileges non-transferable without prior written concierge authorization.',
    accentColor: 'gold',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'tmpl-tasting-notes',
    name: 'Master Distiller Barrel Tasting & Appraisal Note',
    category: 'tasting_notes',
    description: 'Detailed organoleptic tasting ledger, sensory analysis, wood maturation chart, and cask grading document.',
    isDefault: false,
    paperStyle: 'speyside_cream',
    headerLayout: 'dual_column_stamp',
    distilleryName: 'ZOOKAS UNITY SPIRITS',
    tagline: 'Distillery Laboratory & Organoleptic Sensory Analysis',
    heritageYear: 'Speyside Glen • Cask Vaults 1-7',
    crestIcon: 'Wine',
    showRoyalWarrant: false,
    bondHouseRegistration: 'SCOT-BOND-HW-8841-B',
    taxExciseLicense: 'GB-EXCISE-SPIRITS-99201',
    contactAddress: 'Stillhouse Laboratory, Unity Glen, Highlands AB37 9DD',
    contactPhone: '+44 (0) 1340 882 105',
    contactEmail: 'tasting@zookasunityspirits.com',
    contactWebsite: 'https://zookasunityspirits.com/craft',
    headerDivider: 'embossed_stamp_ribbon',
    watermarkType: 'cask_barrel_stamp',
    watermarkText: 'DISTILLERY CELLAR APPRAISAL',
    watermarkOpacity: 0.07,
    watermarkRotation: 12,
    showWaxSeal: true,
    waxSealText: 'TASTING PANEL CERTIFIED • 98 POINTS',
    waxSealColor: 'emerald_green',
    showSignatureBlock: true,
    signatoryName: 'Alistair Vance',
    signatoryTitle: 'Master Distiller & Sensory Panel Leader',
    signatorySignatureFont: 'signature_1',
    showCoSignatory: false,
    showSecurityQrHash: true,
    securityHashPrefix: 'ZUK-TAST-APP-',
    legalDisclaimer: 'Sensory scores compiled in accordance with the International Spirits Tasting Standards under controlled ambient temperature (18.5°C).',
    accentColor: 'emerald',
    createdAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'tmpl-corporate-letterhead',
    name: 'Distillery Executive & Corporate Letterhead',
    category: 'corporate',
    description: 'Clean, elegant executive correspondence for distributor agreements, retail orders, press statements, and board communications.',
    isDefault: false,
    paperStyle: 'royal_linen',
    headerLayout: 'modern_minimal_right',
    distilleryName: 'ZOOKAS UNITY SPIRITS LTD',
    tagline: 'Executive Offices & Commercial Operations',
    heritageYear: 'Company No. SC449102 • VAT Reg: GB 892 0019 44',
    crestIcon: 'Building2',
    showRoyalWarrant: false,
    bondHouseRegistration: 'SCOT-BOND-HW-8841-B',
    taxExciseLicense: 'GB-EXCISE-SPIRITS-99201',
    contactAddress: 'St. Andrew Square, Edinburgh EH2 2AF & Unity Glen',
    contactPhone: '+44 (0) 131 800 5500',
    contactEmail: 'executive@zookasunityspirits.com',
    contactWebsite: 'https://zookasunityspirits.com',
    headerDivider: 'minimal_amber_line',
    watermarkType: 'none',
    watermarkOpacity: 0.05,
    watermarkRotation: 0,
    showWaxSeal: false,
    waxSealText: 'ZOOKAS CORPORATE SEAL',
    waxSealColor: 'obsidian_black',
    showSignatureBlock: true,
    signatoryName: 'Elena Rostov',
    signatoryTitle: 'Managing Director & Global Operations',
    signatorySignatureFont: 'signature_2',
    showCoSignatory: false,
    showSecurityQrHash: false,
    securityHashPrefix: 'ZUK-CORP-',
    legalDisclaimer: 'Zookas Unity Spirits Ltd is registered in Scotland under company registration number SC449102. Authorized and regulated by HMRC Bonded Warehouse regulations.',
    accentColor: 'slate',
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'tmpl-cask-deed',
    name: 'Royal Heritage Cask Deed of Ownership',
    category: 'certificate',
    description: 'Prestigious charter and deed granting legal barrel title, cellar storage rights, and bespoke bottling provenance.',
    isDefault: false,
    paperStyle: 'charred_oak',
    headerLayout: 'centered_royal_crest',
    distilleryName: 'ZOOKAS UNITY SPIRITS',
    tagline: 'Highlands Cask Charter & Perpetual Bond House Register',
    heritageYear: 'Charter No. 1892-ROYAL • Speyside Highlands',
    crestIcon: 'Crown',
    showRoyalWarrant: true,
    royalWarrantText: 'Chartered Perpetual Title & Distiller Maturation Guarantee',
    bondHouseRegistration: 'SCOT-BOND-HW-8841-B',
    taxExciseLicense: 'GB-EXCISE-SPIRITS-99201',
    contactAddress: 'The Vault Arch, Glenlivet Estate, Moray AB37 9DD, Scotland',
    contactPhone: '+44 (0) 1340 882 100',
    contactEmail: 'caskdeeds@zookasunityspirits.com',
    contactWebsite: 'https://zookasunityspirits.com/cask-club',
    headerDivider: 'double_gold_filigree',
    watermarkType: 'cask_barrel_stamp',
    watermarkText: 'PERPETUAL CASK DEED OF OWNERSHIP',
    watermarkOpacity: 0.1,
    watermarkRotation: -10,
    showWaxSeal: true,
    waxSealText: 'ZOOKAS UNITY CASK DEED • IN PERPETUITY • REGISTERED',
    waxSealColor: 'amber_bronze',
    showSignatureBlock: true,
    signatoryName: 'Alistair Vance',
    signatoryTitle: 'Master Distiller',
    signatorySignatureFont: 'signature_1',
    showCoSignatory: true,
    coSignatoryName: 'Lord Callum Sutherland',
    coSignatoryTitle: 'Lord Warden of the Bonded Cellars',
    showSecurityQrHash: true,
    securityHashPrefix: 'ZUK-CASK-DEED-',
    legalDisclaimer: 'Title confers legal ownership of spirit liquid within designated cask number under bonded warehouse care until maturation dispatch or private bottling.',
    accentColor: 'copper',
    createdAt: '2026-04-15T10:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  }
];

export const initialLetterheadDocuments: LetterheadDocument[] = [
  {
    id: 'doc-001',
    title: 'Certificate of Provenance - Cask 1974 Single Malt',
    templateId: 'tmpl-cask-cert',
    referenceNumber: 'ZUK-AUTH-2026-0089',
    documentDate: '2026-08-28',
    recipientName: 'Lord Hamilton Sterling',
    recipientTitle: 'Grand Chancellor of the Scotch Guild',
    recipientCompany: 'Sterling Heritage Investments Ltd',
    recipientAddress: '14 Royal Crescent, Bath BA1 2LR, United Kingdom',
    subject: 'Official Provenance & Cask Authenticity for CASK-PX-409',
    contentHtml: `
<h2>Certificate of Authenticity & Provenance</h2>
<p class="lead">This document confirms that Bottle <strong>#042 of 240</strong> from <strong>Zookas Unity 18-Year Single Malt Whisky (Cask #CASK-PX-409)</strong> was filled by hand at natural cask strength directly within the Speyside bonded warehouse vaults.</p>

<hr class="ornamental-divider" />

<h3>Distillation & Cask Provenance Specifications</h3>
<table class="doc-table">
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Distillery Specification</th>
      <th>Excise Verification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Spirit Type</strong></td>
      <td>Single Malt Scotch Whisky</td>
      <td>Highlands Region (Speyside)</td>
    </tr>
    <tr>
      <td><strong>Primary Cask</strong></td>
      <td>First-Fill American White Oak (14 Years)</td>
      <td>Char Level 3</td>
    </tr>
    <tr>
      <td><strong>Finishing Cask</strong></td>
      <td>Vintage Pedro Ximénez Sherry Hogshead (4 Years)</td>
      <td>Bodegas Tradición, Jerez</td>
    </tr>
    <tr>
      <td><strong>Bottling Strength</strong></td>
      <td>48.2% ABV (96.4 Proof)</td>
      <td>Natural Cask Strength</td>
    </tr>
    <tr>
      <td><strong>Total Barrel Yield</strong></td>
      <td>240 Numbered Bottles</td>
      <td>Bottle Serial: #042 / 240</td>
    </tr>
  </tbody>
</table>

<blockquote class="tasting-quote">
  "A majestic single malt with an unctuous palate of caramelized Medjool dates, roasted hazelnuts, Seville marmalade, and an unbroken finish of warm tobacco leaf and Highland peat."
  <footer>— Angus MacLeod, Master Distiller Emeritus</footer>
</blockquote>

<p>The spirit within this bottle remains strictly un-chillfiltered and naturally coloured. We affirm that all aging occurred uninterrupted under statutory bond house surveillance.</p>
`,
    status: 'finalized',
    mergeData: {
      customer_name: 'Lord Hamilton Sterling',
      bottle_name: 'Zookas Unity 18-Year Single Malt Whisky',
      cask_number: 'CASK-PX-409',
      vintage_year: '2008',
      batch_number: 'UNITY-SM-18',
      bottle_serial: '#042 of 240',
      distiller_name: 'Alistair Vance',
      vault_location: 'Bonded Warehouse No. 4, Row 12, Bay C'
    },
    showWaxSealOverride: true,
    showSignatureOverride: true,
    securityVerificationCode: 'SHA256-ZUK-74A92F-8810BC-2026',
    notes: 'Hand delivered in custom charred oak presentation case with brass inlay.',
    createdAt: '2026-08-28T14:30:00Z',
    updatedAt: '2026-09-01T09:15:00Z'
  },
  {
    id: 'doc-002',
    title: 'Private Vault Allocation Invitation - Autumn 2026 Release',
    templateId: 'tmpl-vip-invitation',
    referenceNumber: 'ZUK-VIP-2026-0412',
    documentDate: '2026-09-01',
    recipientName: 'Dr. Vivienne Leclair',
    recipientTitle: 'Senior Fellow & Cellar Collector',
    recipientCompany: 'Leclair Cellars & Associates',
    recipientAddress: '72 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
    subject: 'Exclusive Ballot Allocation Offer: The 1974 Single Cask Islay Peat Reserve',
    contentHtml: `
<h2>Privileged Allocation Invitation</h2>
<p class="lead">Dear Dr. Leclair,</p>

<p>It is our supreme pleasure to invite you to secure an exclusive personal allocation from our most prestigious release of the decade: <strong>The 1974 Single Cask Islay Peat Reserve (Cask #74-OAK-01)</strong>.</p>

<p>Having patiently rested for forty-nine winters in bonded warehouse damp, this rare cask has yielded just <strong>120 hand-blown decanters</strong> worldwide. As a Platinum Tier Patron of our Private Vault, your invitation reserves up to <strong>two decanters</strong> before general lottery release.</p>

<hr class="ornamental-divider" />

<h3>Your Allocation Privileges</h3>
<ul>
  <li><strong>Reserved Allocation:</strong> 2 Decanters (Numbered 017 & 018 of 120)</li>
  <li><strong>Private Patron Price:</strong> £2,450 per decanter (inclusive of bespoke leather vault chest and silver stopper)</li>
  <li><strong>Exclusive Cellar Storage:</strong> Complimentary temperature-controlled bonded storage until October 2027</li>
  <li><strong>Private Tasting Salon Access:</strong> VIP private table at the Master Distiller's Guild Dinner in Edinburgh</li>
</ul>

<p>To confirm your reservation, please present this letter or input verification code <code>{{verification_code}}</code> into your secure collector portal by <strong>September 18, 2026</strong>.</p>

<p>With our highest regards and distillery fidelity,</p>
`,
    status: 'issued',
    mergeData: {
      customer_name: 'Dr. Vivienne Leclair',
      bottle_name: 'The 1974 Single Cask Islay Peat Reserve',
      cask_number: '74-OAK-01',
      allocation_bottles: '2 Decanters',
      price_per_bottle: '£2,450',
      verification_code: 'ZUK-VIP-LECLAIR-74'
    },
    showWaxSealOverride: true,
    showSignatureOverride: true,
    securityVerificationCode: 'SHA256-VIP-LECLAIR-9941A-2026',
    notes: 'Invitation sent via courier with custom wax sealed parchment envelope.',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'doc-003',
    title: 'Customs Bonded Warehouse Dispatch & Release Note #108',
    templateId: 'tmpl-bonded-dispatch',
    referenceNumber: 'ZUK-DISP-2026-0108',
    documentDate: '2026-09-02',
    recipientName: 'Highland Freight & Logistics Ltd',
    recipientTitle: 'Customs Transit Controller',
    recipientCompany: 'Bonded Transit Hub Aberdeen',
    recipientAddress: 'Dock 4, Victoria Quay, Aberdeen AB11 5SS, UK',
    subject: 'Duty-Suspended Bonded Consignment Release - Export Batch EXP-2026-B',
    contentHtml: `
<h2>Bonded Warehouse Dispatch Warrant</h2>
<p class="lead">Under authority of Excise Bond Registration <strong>SCOT-BOND-HW-8841-B</strong>, the following goods are hereby released from Zookas Unity Bonded Warehouse No. 4 under duty-suspended transit regulations.</p>

<table class="doc-table">
  <thead>
    <tr>
      <th>Consignment Lot</th>
      <th>Product Description</th>
      <th>Quantity</th>
      <th>Total Proof Liters</th>
      <th>Duty Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>LOT-2026-PX18</strong></td>
      <td>Zookas Unity 18-Year Single Malt (750ml)</td>
      <td>48 Cases (288 Bottles)</td>
      <td>104.1 PL</td>
      <td>Duty Suspended (EMCS #GB88410092)</td>
    </tr>
    <tr>
      <td><strong>LOT-2026-GIN</strong></td>
      <td>Highland Botanical Cask Gin (750ml)</td>
      <td>24 Cases (144 Bottles)</td>
      <td>48.6 PL</td>
      <td>Duty Suspended (EMCS #GB88410093)</td>
    </tr>
    <tr>
      <td><strong>LOT-2026-PEATED</strong></td>
      <td>Cask Strength Peated Single Malt (700ml)</td>
      <td>12 Cases (72 Bottles)</td>
      <td>29.2 PL</td>
      <td>Duty Suspended (EMCS #GB88410094)</td>
    </tr>
  </tbody>
</table>

<p><strong>Carrier Verification:</strong> Vehicle Registration #SC68 VNC | Driver ID Verified: John Ferguson | Seal Number: #ZUK-SEAL-88491</p>
`,
    status: 'issued',
    mergeData: {
      carrier_name: 'Highland Freight & Logistics Ltd',
      consignment_ref: 'EXP-2026-B',
      dispatch_date: '02 Sept 2026',
      total_cases: '84 Cases'
    },
    showWaxSealOverride: false,
    showSignatureOverride: true,
    securityVerificationCode: 'HMCS-EMCS-GB-8841-99201',
    createdAt: '2026-09-02T08:00:00Z',
    updatedAt: '2026-09-02T08:00:00Z'
  }
];

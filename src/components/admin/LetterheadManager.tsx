import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LetterheadTemplate,
  LetterheadDocument,
  LetterheadDocumentStatus,
  LetterheadPaperStyle,
  LetterheadHeaderLayout,
  LetterheadDivider,
  LetterheadWatermark,
  LetterheadWaxSealColor,
  LetterheadAccentColor
} from '../../types';
import { CloudImageUploader } from '../CloudImageUploader';
import {
  FileText,
  Layout,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Printer,
  Eye,
  Check,
  RotateCcw,
  Save,
  Search,
  Sliders,
  Type,
  Palette,
  ShieldCheck,
  Award,
  Crown,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Table as TableIcon,
  Code,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  User,
  Building,
  Stamp,
  BadgePercent,
  Download,
  Maximize2,
  Layers,
  HelpCircle,
  Sparkle,
  QrCode,
  Feather,
  Flame,
  Wine,
  Shield,
  Building2,
  Hash,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import { CompanyDetailsTab } from './CompanyDetailsTab';
import { ZookasOfficialCrest } from '../ZookasOfficialCrest';

export const LetterheadManager: React.FC = () => {
  const {
    letterheadTemplates,
    letterheadDocuments,
    companyDetails,
    saveLetterheadTemplate,
    deleteLetterheadTemplate,
    setDefaultLetterheadTemplate,
    saveLetterheadDocument,
    deleteLetterheadDocument,
    getLetterheadTemplate,
    adminSettings
  } = useStore();

  // Navigation Sub-tab
  const [subTab, setSubTab] = useState<'documents' | 'templates' | 'composer' | 'company_details'>('documents');
  const [documentSearch, setDocumentSearch] = useState<string>('');
  const [documentFilterCategory, setDocumentFilterCategory] = useState<string>('all');
  const [documentFilterStatus, setDocumentFilterStatus] = useState<string>('all');

  // Template Modal State
  const [templateModalOpen, setTemplateModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<LetterheadTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState<LetterheadTemplate>(() => {
    return letterheadTemplates[0] || {
      id: 'tmpl-cask-cert',
      name: 'Certificate of Cask Origin & Authenticity',
      category: 'certificate',
      description: 'Official parchment certificate for single cask releases and barrel allocations.',
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  // Active Document State
  const [activeDoc, setActiveDoc] = useState<LetterheadDocument>(() => {
    return letterheadDocuments[0] || {
      id: 'doc_' + Date.now(),
      title: 'Certificate of Provenance & Cask Ownership',
      templateId: letterheadTemplates[0]?.id || 'tmpl-cask-cert',
      referenceNumber: 'ZUK-CERT-2026-001',
      documentDate: new Date().toISOString().split('T')[0],
      recipientName: 'Lord Alistair Sterling',
      recipientTitle: 'Keeper of Private Casks',
      recipientCompany: 'Sterling Heritage Investments Ltd.',
      recipientAddress: '42 Royal Crescent, Edinburgh, EH3 6AQ',
      subject: 'Private Cask Deed of Title & Provenance Authentication',
      contentHtml: `
        <h2 style="text-align: center; color: #78350f; letter-spacing: 0.05em; margin-bottom: 4px;">CERTIFICATE OF ARCHIVE PROVENANCE</h2>
        <p style="text-align: center; font-style: italic; color: #b45309; margin-top: 0;">Official Distillery Deed & Verification Record</p>
        <hr style="border: 0; border-top: 1px solid #d97706; margin: 16px 0;" />
        <p>This certifies that <strong>{{RECIPIENT_NAME}}</strong> of <em>{{RECIPIENT_COMPANY}}</em> is the registered owner of the bespoke single cask spirit allocation under reference <strong>{{REFERENCE_NUMBER}}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr style="background-color: rgba(217, 119, 6, 0.12);">
            <th style="padding: 8px 12px; border: 1px solid #d97706; text-align: left;">Distillery Specification</th>
            <th style="padding: 8px 12px; border: 1px solid #d97706; text-align: left;">Archival Record</th>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #d97706;">Cask Identification</td>
            <td style="padding: 8px 12px; border: 1px solid #d97706;"><strong>{{CASK_NUMBER}}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #d97706;">Spirit Category</td>
            <td style="padding: 8px 12px; border: 1px solid #d97706;">{{SPIRIT_CATEGORY}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #d97706;">Wood Cooperage</td>
            <td style="padding: 8px 12px; border: 1px solid #d97706;">First-Fill Oloroso Sherry Hogshead (European Oak)</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #d97706;">Yield & Strength</td>
            <td style="padding: 8px 12px; border: 1px solid #d97706;">{{TOTAL_BOTTLES}} Bottles (Natural Cask Strength {{ABV}})</td>
          </tr>
        </table>
        <p>Distilled and bonded at the Highland Glen Estate under the auspices of {{DISTILLERY_NAME}}. This document confers statutory ownership and cellar custodial rights.</p>
      `,
      status: 'draft',
      mergeData: {
        CASK_NUMBER: 'CASK-2026-X88',
        BOTTLE_NUMBER: '001',
        TOTAL_BOTTLES: '240',
        SPIRIT_CATEGORY: 'Single Malt Scotch Whisky',
        ABV: '58.4%'
      },
      securityVerificationCode: 'VERIFY-8841-99201-UK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  // Editor Mode (Visual vs HTML Code)
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [printPreviewModalOpen, setPrintPreviewModalOpen] = useState<boolean>(false);
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  const showNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  // Sync editor innerHTML when activeDoc changes in visual mode
  useEffect(() => {
    if (editorRef.current && editorMode === 'visual') {
      if (editorRef.current.innerHTML !== activeDoc.contentHtml) {
        editorRef.current.innerHTML = activeDoc.contentHtml;
      }
    }
  }, [activeDoc.id, editorMode]);

  // Execute formatting command in visual editor
  const formatText = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleEditorChange();
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setActiveDoc(prev => ({
        ...prev,
        contentHtml: html,
        updatedAt: new Date().toISOString()
      }));
    }
  };

  // Insert variable token into content
  const insertToken = (token: string) => {
    if (editorMode === 'visual' && editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, `{{${token}}}`);
      handleEditorChange();
    } else {
      setActiveDoc(prev => ({
        ...prev,
        contentHtml: prev.contentHtml + ` {{${token}}} `,
        updatedAt: new Date().toISOString()
      }));
    }
  };

  // Dynamic variable resolver for preview and printing
  const resolveContentVariables = (rawHtml: string, doc: LetterheadDocument, template: LetterheadTemplate) => {
    let text = rawHtml;
    const tokens: Record<string, string> = {
      RECIPIENT_NAME: doc.recipientName || 'Valued Connoisseur',
      RECIPIENT_TITLE: doc.recipientTitle || '',
      RECIPIENT_COMPANY: doc.recipientCompany || '',
      RECIPIENT_ADDRESS: doc.recipientAddress || '',
      REFERENCE_NUMBER: doc.referenceNumber || 'REF-UNASSIGNED',
      DOCUMENT_DATE: doc.documentDate ? new Date(doc.documentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString(),
      SUBJECT: doc.subject || '',
      DISTILLERY_NAME: companyDetails?.tradeName || template.distilleryName || 'Zookas Unity Spirits',
      COMPANY_NAME: companyDetails?.companyName || "Zooka's Unity Spirits Private Limited",
      TRADE_NAME: companyDetails?.tradeName || "Zooka's Unity Spirits Distillery",
      COMPANY_CIN: companyDetails?.cin || 'U15549DL2024PTC392810',
      COMPANY_GSTIN: companyDetails?.gstin || '07AAAAZ8821A1Z9',
      COMPANY_PAN: companyDetails?.pan || 'AAAAZ8821A',
      EXCISE_LICENSE: companyDetails?.exciseLicense || template.taxExciseLicense || 'SCOT-EXCISE-BW-8841-B',
      REGISTERED_ADDRESS: companyDetails?.registeredAddress || template.contactAddress,
      DISTILLERY_ADDRESS: companyDetails?.distilleryAddress || template.contactAddress,
      COMPANY_EMAIL: companyDetails?.email || template.contactEmail,
      COMPANY_PHONE: companyDetails?.phone || template.contactPhone,
      COMPANY_WEBSITE: companyDetails?.website || template.contactWebsite,
      SIGNATORY_NAME: doc.customSignatoryName || template.signatoryName || 'Alistair Vance',
      SIGNATORY_TITLE: doc.customSignatoryTitle || template.signatoryTitle || 'Master Distiller',
      CO_SIGNATORY_NAME: template.coSignatoryName || 'Lady Fiona MacIntyre',
      CO_SIGNATORY_TITLE: template.coSignatoryTitle || 'Vault Custodian',
      VERIFICATION_CODE: doc.securityVerificationCode || 'VER-8841-ZUK',
      CASK_NUMBER: doc.mergeData?.CASK_NUMBER || 'CASK-2026-X88',
      BOTTLE_NUMBER: doc.mergeData?.BOTTLE_NUMBER || '001',
      TOTAL_BOTTLES: doc.mergeData?.TOTAL_BOTTLES || '240',
      SPIRIT_CATEGORY: doc.mergeData?.SPIRIT_CATEGORY || 'Single Malt Scotch Whisky',
      ABV: doc.mergeData?.ABV || '46.5%'
    };

    Object.entries(tokens).forEach(([k, v]) => {
      const reg = new RegExp(`{{\\s*${k}\\s*}}`, 'g');
      text = text.replace(reg, v);
    });

    return text;
  };

  // Document Save Handler
  const handleSaveDocument = async () => {
    const updated: LetterheadDocument = {
      ...activeDoc,
      updatedAt: new Date().toISOString()
    };
    await saveLetterheadDocument(updated);
    showNotification(`Document "${updated.title}" saved successfully to Cloud Vault.`);
  };

  // Create New Document
  const handleCreateDocument = (category: string = 'certificate') => {
    const defaultTemplate = letterheadTemplates.find(t => t.isDefault) || letterheadTemplates[0];
    const newDoc: LetterheadDocument = {
      id: 'doc_' + Date.now(),
      title: `Official ${category.charAt(0).toUpperCase() + category.slice(1)} Record`,
      templateId: defaultTemplate?.id || 'tmpl-cask-cert',
      referenceNumber: `ZUK-${category.toUpperCase().slice(0, 4)}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      documentDate: new Date().toISOString().split('T')[0],
      recipientName: 'Lord Alistair Sterling',
      recipientTitle: 'Collector of Fine Spirits',
      recipientCompany: 'Highland Cask Exchange Ltd.',
      recipientAddress: '10 St Andrews Square, Edinburgh, EH2 2AF',
      subject: `Official Distillery Release & Title Confirmation`,
      contentHtml: `
        <h2 style="text-align: center; color: #78350f;">OFFICIAL DISTILLERY RECORD</h2>
        <p style="text-align: center; font-style: italic; color: #b45309;">Zookas Unity Spirits • Registered Archive Document</p>
        <hr style="border: 0; border-top: 1px solid #d97706; margin: 16px 0;" />
        <p>Dear <strong>{{RECIPIENT_NAME}}</strong>,</p>
        <p>We are pleased to issue this official statement regarding your acquisition under archival reference <strong>{{REFERENCE_NUMBER}}</strong>.</p>
        <p>Please retain this signed deed as verified proof of provenance and statutory cellar ownership.</p>
        <p>With highest regards,</p>
      `,
      status: 'draft',
      mergeData: {
        CASK_NUMBER: 'CASK-2026-N1',
        BOTTLE_NUMBER: '001',
        TOTAL_BOTTLES: '180',
        SPIRIT_CATEGORY: 'Single Malt Whisky',
        ABV: '48.0%'
      },
      securityVerificationCode: `VER-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setActiveDoc(newDoc);
    setSubTab('composer');
  };

  // Duplicate Document Handler
  const handleDuplicateDocument = async (doc: LetterheadDocument) => {
    const dup: LetterheadDocument = {
      ...doc,
      id: 'doc_' + Date.now(),
      referenceNumber: `ZUK-DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${doc.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await saveLetterheadDocument(dup);
    setActiveDoc(dup);
    setSubTab('composer');
    showNotification(`Duplicated document as "${dup.referenceNumber}"`);
  };

  // Delete Document Handler
  const handleDeleteDocument = async (id: string, title: string) => {
    if (confirm(`Are you sure you wish to delete document "${title}"? This cannot be undone.`)) {
      await deleteLetterheadDocument(id);
      showNotification(`Document "${title}" deleted.`);
      if (activeDoc.id === id && letterheadDocuments.length > 1) {
        const next = letterheadDocuments.find(d => d.id !== id);
        if (next) setActiveDoc(next);
      }
    }
  };

  // Template Save Handler
  const handleSaveTemplate = async () => {
    const updated: LetterheadTemplate = {
      ...templateForm,
      updatedAt: new Date().toISOString()
    };
    await saveLetterheadTemplate(updated);
    setTemplateModalOpen(false);
    showNotification(`Letterhead Style "${updated.name}" saved successfully.`);
  };

  // Filtered Documents
  const filteredDocuments = letterheadDocuments.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(documentSearch.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(documentSearch.toLowerCase()) ||
      doc.recipientName.toLowerCase().includes(documentSearch.toLowerCase()) ||
      (doc.recipientCompany && doc.recipientCompany.toLowerCase().includes(documentSearch.toLowerCase()));
    const template = getLetterheadTemplate(doc.templateId);
    const matchesCategory = documentFilterCategory === 'all' || template?.category === documentFilterCategory;
    const matchesStatus = documentFilterStatus === 'all' || doc.status === documentFilterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeTemplate = getLetterheadTemplate(activeDoc.templateId) || letterheadTemplates[0];

  // Helper for rendering paper style styling
  const getPaperStyleTheme = (style: LetterheadPaperStyle) => {
    switch (style) {
      case 'obsidian_gold':
        return {
          bg: '#14110f',
          text: '#f5f5f4',
          accent: '#eab308',
          border: '#ca8a04',
          subtext: '#a8a29e'
        };
      case 'speyside_cream':
        return {
          bg: '#fcfbf7',
          text: '#1c1917',
          accent: '#b45309',
          border: '#d97706',
          subtext: '#78716c'
        };
      case 'charred_oak':
        return {
          bg: '#1c1917',
          text: '#fef3c7',
          accent: '#f59e0b',
          border: '#b45309',
          subtext: '#d6d3d1'
        };
      case 'clean_bond_white':
        return {
          bg: '#ffffff',
          text: '#0f172a',
          accent: '#0284c7',
          border: '#cbd5e1',
          subtext: '#64748b'
        };
      case 'royal_linen':
        return {
          bg: '#fafaf9',
          text: '#1e293b',
          accent: '#0d9488',
          border: '#94a3b8',
          subtext: '#64748b'
        };
      case 'vintage_parchment':
      default:
        return {
          bg: '#fbf7ee',
          text: '#292524',
          accent: '#b45309',
          border: '#d97706',
          subtext: '#78716c'
        };
    }
  };

  const paperTheme = getPaperStyleTheme(activeTemplate.paperStyle);

  return (
    <div id="letterhead-manager" className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-stone-900 border border-amber-900/40 rounded-xl text-stone-100 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Stamp className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-400">
              Distillery Stationery & Archives
            </span>
          </div>
          <h2 className="text-2xl font-serif text-amber-100">
            Letterhead Management & Official Document Editor
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Craft authentic parchment certificates, cask deeds, tasting notes, and export print-ready stationery with security wax seals.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <button
            onClick={() => handleCreateDocument('certificate')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap min-h-[44px] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Compose Document</span>
          </button>
          <button
            onClick={() => {
              setEditingTemplate(null);
              setTemplateForm({
                id: 'tmpl-' + Date.now(),
                name: 'Bespoke Private Reserve Letterhead',
                category: 'corporate',
                description: 'Custom luxury distillery letterhead with gold foil accents.',
                isDefault: false,
                paperStyle: 'vintage_parchment',
                headerLayout: 'centered_royal_crest',
                distilleryName: 'ZOOKAS UNITY SPIRITS',
                tagline: 'Artisanal Highlands Distillers & Bonded Cask Keepers',
                heritageYear: 'Est. 1892 • Speyside Highlands',
                crestIcon: 'Crown',
                showRoyalWarrant: true,
                royalWarrantText: 'By Appointment to Connoisseurs & Fine Spirits Collectors',
                bondHouseRegistration: 'SCOT-BOND-HW-8841-B',
                taxExciseLicense: 'GB-EXCISE-SPIRITS-99201',
                contactAddress: 'Unity Glen Distillery, Moray AB37 9DD, Scotland',
                contactPhone: '+44 (0) 1340 882 100',
                contactEmail: 'vault@zookasunityspirits.com',
                contactWebsite: 'https://zookasunityspirits.com',
                headerDivider: 'double_gold_filigree',
                watermarkType: 'authenticated_seal',
                watermarkText: 'ZOOKAS DISTILLERY ARCHIVE',
                watermarkOpacity: 0.08,
                watermarkRotation: -25,
                showWaxSeal: true,
                waxSealText: 'SEAL OF EXCELLENCE • ZOOKAS 1892',
                waxSealColor: 'ruby_crimson',
                showSignatureBlock: true,
                signatoryName: 'Alistair Vance',
                signatoryTitle: 'Master Distiller',
                signatorySignatureFont: 'signature_1',
                showCoSignatory: true,
                coSignatoryName: 'Lady Fiona MacIntyre',
                coSignatoryTitle: 'Vault Keeper',
                showSecurityQrHash: true,
                securityHashPrefix: 'ZUK-AUTH-',
                legalDisclaimer: 'Official registered distillery deed.',
                accentColor: 'gold',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
              setTemplateModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-amber-900/50 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[44px] w-full sm:w-auto"
          >
            <Layout className="w-4 h-4 text-amber-400 shrink-0" />
            <span>New Letterhead Style</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {saveSuccessMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-lg text-sm shadow animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{saveSuccessMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSubTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[42px] ${
            subTab === 'documents'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>Documents & Deeds ({letterheadDocuments.length})</span>
        </button>

        <button
          onClick={() => setSubTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[42px] ${
            subTab === 'templates'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <Layout className="w-4 h-4 shrink-0" />
          <span>Letterhead Styles ({letterheadTemplates.length})</span>
        </button>

        <button
          onClick={() => setSubTab('company_details')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[42px] ${
            subTab === 'company_details'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Company & Legal Details (CIN / GST)</span>
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded font-mono">
            CIN/GST
          </span>
        </button>

        <button
          onClick={() => setSubTab('composer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[42px] ${
            subTab === 'composer'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
          }`}
        >
          <Edit3 className="w-4 h-4 shrink-0" />
          <span>Text Editor & Live Sheet</span>
          {activeDoc && (
            <span className="text-[10px] sm:text-xs bg-amber-950 border border-amber-800 text-amber-300 px-2 py-0.5 rounded-full font-mono shrink-0">
              {activeDoc.referenceNumber}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 4: COMPANY & STATUTORY REGISTRY DETAILS (CIN / GSTIN / LOGO) */}
      {/* ========================================================================= */}
      {subTab === 'company_details' && (
        <CompanyDetailsTab onGoToComposer={() => setSubTab('composer')} />
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: OFFICIAL DOCUMENTS & DEEDS ARCHIVE */}
      {/* ========================================================================= */}
      {subTab === 'documents' && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 bg-stone-900/80 border border-stone-800 rounded-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-stone-500" />
              <input
                type="text"
                placeholder="Search by title, reference number, recipient, or company..."
                value={documentSearch}
                onChange={e => setDocumentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs sm:text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 min-h-[42px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto">
              <select
                value={documentFilterCategory}
                onChange={e => setDocumentFilterCategory(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 capitalize min-h-[42px]"
              >
                <option value="all">All Template Categories</option>
                <option value="certificate">Certificates of Origin</option>
                <option value="dispatch">Bonded Dispatch</option>
                <option value="invitation">VIP Invitations</option>
                <option value="tasting_notes">Tasting Notes</option>
                <option value="corporate">Corporate Deeds</option>
                <option value="general">General Stationery</option>
              </select>

              <select
                value={documentFilterStatus}
                onChange={e => setDocumentFilterStatus(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 text-stone-300 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 capitalize min-h-[42px]"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="finalized">Finalized</option>
                <option value="issued">Issued</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Table of Documents */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-300">
                <thead className="bg-stone-950 text-xs uppercase tracking-wider text-amber-400 border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4">Document Title & Reference</th>
                    <th className="py-3.5 px-4">Recipient</th>
                    <th className="py-3.5 px-4">Letterhead Style</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Issue Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-stone-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                        <p>No documents found matching your filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map(doc => {
                      const template = getLetterheadTemplate(doc.templateId);
                      return (
                        <tr key={doc.id} className="hover:bg-stone-800/40 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-serif font-medium text-amber-100 text-base">
                              {doc.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-xs text-amber-500 bg-amber-950/70 border border-amber-900/60 px-2 py-0.5 rounded">
                                {doc.referenceNumber}
                              </span>
                              {doc.subject && (
                                <span className="text-xs text-stone-400 truncate max-w-xs">
                                  {doc.subject}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-stone-200 font-medium">{doc.recipientName}</div>
                            {doc.recipientCompany && (
                              <div className="text-xs text-stone-400">{doc.recipientCompany}</div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-xs bg-stone-950 border border-stone-800 text-amber-300 px-2.5 py-1 rounded-md">
                              {template?.name || 'Standard Letterhead'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 uppercase tracking-wider ${
                                doc.status === 'issued' || doc.status === 'finalized'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                  : doc.status === 'draft'
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                                  : 'bg-stone-800 text-stone-400 border border-stone-700'
                              }`}
                            >
                              {(doc.status === 'issued' || doc.status === 'finalized') && (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-stone-400">
                            {doc.documentDate ? new Date(doc.documentDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setActiveDoc(doc);
                                  setSubTab('composer');
                                }}
                                title="Edit in Composer"
                                className="p-2 hover:bg-amber-600/20 hover:text-amber-300 rounded-lg text-stone-400 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setActiveDoc(doc);
                                  setPrintPreviewModalOpen(true);
                                }}
                                title="Print / PDF Preview"
                                className="p-2 hover:bg-stone-800 hover:text-amber-300 rounded-lg text-stone-400 transition-colors cursor-pointer"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateDocument(doc)}
                                title="Duplicate Document"
                                className="p-2 hover:bg-stone-800 hover:text-stone-200 rounded-lg text-stone-400 transition-colors cursor-pointer"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id, doc.title)}
                                title="Delete Document"
                                className="p-2 hover:bg-rose-900/30 hover:text-rose-400 rounded-lg text-stone-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: LETTERHEAD TEMPLATES LIST & DESIGNER */}
      {/* ========================================================================= */}
      {subTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letterheadTemplates.map(tpl => {
              const theme = getPaperStyleTheme(tpl.paperStyle);
              return (
                <div
                  key={tpl.id}
                  className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-amber-900/60 transition-all flex flex-col justify-between"
                >
                  {/* Visual Miniature Stationery Header */}
                  <div
                    className="p-5 border-b border-stone-800 relative overflow-hidden"
                    style={{
                      backgroundColor: theme.bg,
                      color: theme.text
                    }}
                  >
                    {tpl.isDefault && (
                      <div className="absolute top-2 right-2 bg-amber-700 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow z-20">
                        Default Style
                      </div>
                    )}

                    <div
                      className="p-4 border text-center rounded-sm relative"
                      style={{
                        borderColor: theme.border,
                        borderWidth: '1px'
                      }}
                    >
                      <div className="font-serif text-sm font-bold tracking-wider uppercase" style={{ color: theme.accent }}>
                        {tpl.distilleryName}
                      </div>
                      <div className="text-[10px] tracking-wide mt-0.5 italic opacity-85">
                        {tpl.tagline}
                      </div>
                      <div className="my-2 border-b border-dashed opacity-40" style={{ borderColor: theme.border }} />
                      <div className="text-[10px] opacity-75 line-clamp-2">
                        {tpl.description}
                      </div>
                    </div>
                  </div>

                  {/* Template Details & Controls */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif font-bold text-amber-100 text-base">{tpl.name}</h3>
                        <span className="text-[10px] uppercase font-semibold text-stone-400 bg-stone-950 border border-stone-800 px-2 py-0.5 rounded">
                          {tpl.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">{tpl.description}</p>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-800/80 text-[11px] text-stone-400">
                        <div>
                          <span className="text-stone-500">Paper:</span>{' '}
                          <span className="text-stone-300 capitalize">{tpl.paperStyle.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Header:</span>{' '}
                          <span className="text-stone-300 capitalize">{tpl.headerLayout.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Watermark:</span>{' '}
                          <span className="text-stone-300 capitalize">{tpl.watermarkType.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="text-stone-500">Wax Seal:</span>{' '}
                          <span className="text-stone-300">{tpl.showWaxSeal ? 'Active' : 'None'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                      <div>
                        {!tpl.isDefault ? (
                          <button
                            onClick={() => setDefaultLetterheadTemplate(tpl.id)}
                            className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
                          >
                            Make Default
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Default
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTemplate(tpl);
                            setTemplateForm(JSON.parse(JSON.stringify(tpl)));
                            setTemplateModalOpen(true);
                          }}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Customize</span>
                        </button>

                        {letterheadTemplates.length > 1 && (
                          <button
                            onClick={async () => {
                              if (confirm(`Delete letterhead style "${tpl.name}"?`)) {
                                await deleteLetterheadTemplate(tpl.id);
                                showNotification(`Template "${tpl.name}" deleted.`);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-900/30 text-stone-500 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: DOCUMENT COMPOSER & RICH TEXT EDITOR */}
      {/* ========================================================================= */}
      {subTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Metadata & Controls Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Document Attributes Card */}
            <div className="p-5 bg-stone-900 border border-stone-800 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                  Document Settings
                </span>
                <span className="font-mono text-xs bg-stone-950 border border-stone-800 text-amber-300 px-2 py-0.5 rounded">
                  {activeDoc.referenceNumber}
                </span>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Document Title</label>
                <input
                  type="text"
                  value={activeDoc.title}
                  onChange={e => setActiveDoc(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Document Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Cask Provenance & Title Verification"
                  value={activeDoc.subject}
                  onChange={e => setActiveDoc(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Stationery Style</label>
                  <select
                    value={activeDoc.templateId}
                    onChange={e => setActiveDoc(prev => ({ ...prev, templateId: e.target.value }))}
                    className="w-full px-2.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {letterheadTemplates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Status</label>
                  <select
                    value={activeDoc.status}
                    onChange={e => setActiveDoc(prev => ({ ...prev, status: e.target.value as LetterheadDocumentStatus }))}
                    className="w-full px-2.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 capitalize"
                  >
                    <option value="draft">Draft</option>
                    <option value="finalized">Finalized</option>
                    <option value="issued">Issued</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Reference No.</label>
                  <input
                    type="text"
                    value={activeDoc.referenceNumber}
                    onChange={e => setActiveDoc(prev => ({ ...prev, referenceNumber: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs font-mono text-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={activeDoc.documentDate}
                    onChange={e => setActiveDoc(prev => ({ ...prev, documentDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Recipient & Signatory Card */}
            <div className="p-5 bg-stone-900 border border-stone-800 rounded-xl space-y-4 shadow-sm">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 block">
                Recipient Details
              </span>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Recipient Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lord Alistair Sterling"
                  value={activeDoc.recipientName}
                  onChange={e => setActiveDoc(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Honorific / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Cask Custodian"
                    value={activeDoc.recipientTitle || ''}
                    onChange={e => setActiveDoc(prev => ({ ...prev, recipientTitle: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Company / Estate</label>
                  <input
                    type="text"
                    placeholder="e.g. Sterling Holdings Ltd."
                    value={activeDoc.recipientCompany || ''}
                    onChange={e => setActiveDoc(prev => ({ ...prev, recipientCompany: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1">Postal Address</label>
                <input
                  type="text"
                  placeholder="42 Royal Crescent, Edinburgh, EH3 6AQ"
                  value={activeDoc.recipientAddress || ''}
                  onChange={e => setActiveDoc(prev => ({ ...prev, recipientAddress: e.target.value }))}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-stone-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Custom Signatory</label>
                  <input
                    type="text"
                    placeholder={activeTemplate.signatoryName}
                    value={activeDoc.customSignatoryName || ''}
                    onChange={e => setActiveDoc(prev => ({ ...prev, customSignatoryName: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Signatory Title</label>
                  <input
                    type="text"
                    placeholder={activeTemplate.signatoryTitle}
                    value={activeDoc.customSignatoryTitle || ''}
                    onChange={e => setActiveDoc(prev => ({ ...prev, customSignatoryTitle: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick-Insert Tokens */}
            <div className="p-5 bg-stone-900 border border-stone-800 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                  Insert Archival Tokens
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-stone-400">
                Click any token to place dynamically evaluated text into the editor:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Company Name', token: 'COMPANY_NAME' },
                  { label: 'Company CIN', token: 'COMPANY_CIN' },
                  { label: 'Company GSTIN', token: 'COMPANY_GSTIN' },
                  { label: 'Company PAN', token: 'COMPANY_PAN' },
                  { label: 'Excise License', token: 'EXCISE_LICENSE' },
                  { label: 'Reg. Address', token: 'REGISTERED_ADDRESS' },
                  { label: 'Recipient Name', token: 'RECIPIENT_NAME' },
                  { label: 'Company', token: 'RECIPIENT_COMPANY' },
                  { label: 'Reference No.', token: 'REFERENCE_NUMBER' },
                  { label: 'Issue Date', token: 'DOCUMENT_DATE' },
                  { label: 'Subject', token: 'SUBJECT' },
                  { label: 'Distillery', token: 'DISTILLERY_NAME' },
                  { label: 'Cask Number', token: 'CASK_NUMBER' },
                  { label: 'Bottle Number', token: 'BOTTLE_NUMBER' },
                  { label: 'Total Bottles', token: 'TOTAL_BOTTLES' },
                  { label: 'Spirit Category', token: 'SPIRIT_CATEGORY' },
                  { label: 'ABV', token: 'ABV' },
                  { label: 'Master Distiller', token: 'SIGNATORY_NAME' },
                  { label: 'Signatory Title', token: 'SIGNATORY_TITLE' },
                  { label: 'Security Code', token: 'VERIFICATION_CODE' }
                ].map(t => (
                  <button
                    key={t.token}
                    type="button"
                    onClick={() => insertToken(t.token)}
                    className="px-2 py-1 bg-stone-950 hover:bg-amber-950 hover:text-amber-300 border border-stone-800 hover:border-amber-700 text-stone-300 text-[11px] font-mono rounded transition-colors cursor-pointer"
                  >
                    +{`{${t.token}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Save & Preview Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDocument}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Document</span>
              </button>
              <button
                onClick={() => setPrintPreviewModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Right Main Column: Rich Text Formatting Toolbar & Live Stationery (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Formatting Toolbar */}
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center flex-wrap gap-1">
                {/* Visual / Code Mode Toggle */}
                <div className="flex items-center bg-stone-950 p-0.5 rounded-lg border border-stone-800 mr-2">
                  <button
                    type="button"
                    onClick={() => setEditorMode('visual')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      editorMode === 'visual'
                        ? 'bg-amber-600 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Visual Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('code')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                      editorMode === 'code'
                        ? 'bg-amber-600 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    HTML Code
                  </button>
                </div>

                {editorMode === 'visual' && (
                  <>
                    <div className="h-4 w-px bg-stone-800 mx-1" />

                    <button
                      type="button"
                      onClick={() => formatText('bold')}
                      title="Bold"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('italic')}
                      title="Italic"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('underline')}
                      title="Underline"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('strikeThrough')}
                      title="Strikethrough"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Strikethrough className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-stone-800 mx-1" />

                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', '<h2>')}
                      title="Heading 2"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', '<h3>')}
                      title="Heading 3"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', '<p>')}
                      title="Normal Paragraph"
                      className="px-2 py-1 text-xs hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer font-serif"
                    >
                      ¶ Paragraph
                    </button>

                    <div className="h-4 w-px bg-stone-800 mx-1" />

                    <button
                      type="button"
                      onClick={() => formatText('insertUnorderedList')}
                      title="Bullet List"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('insertOrderedList')}
                      title="Numbered List"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', '<blockquote>')}
                      title="Blockquote"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Quote className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-stone-800 mx-1" />

                    <button
                      type="button"
                      onClick={() => formatText('justifyLeft')}
                      title="Align Left"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('justifyCenter')}
                      title="Align Center"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('justifyRight')}
                      title="Align Right"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>

                    <div className="h-4 w-px bg-stone-800 mx-1" />

                    <button
                      type="button"
                      onClick={() => formatText('insertHorizontalRule')}
                      title="Horizontal Divider"
                      className="p-1.5 hover:bg-stone-800 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sampleTable = `
                      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
                        <thead>
                          <tr style="background-color: rgba(217, 119, 6, 0.15);">
                            <th style="border: 1px solid #d97706; padding: 6px 10px; text-align: left;">Archival Item</th>
                            <th style="border: 1px solid #d97706; padding: 6px 10px; text-align: left;">Specification Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style="border: 1px solid #d97706; padding: 6px 10px;">Cask Batch No.</td>
                            <td style="border: 1px solid #d97706; padding: 6px 10px;">{{CASK_NUMBER}}</td>
                          </tr>
                          <tr>
                            <td style="border: 1px solid #d97706; padding: 6px 10px;">Proof Strength</td>
                            <td style="border: 1px solid #d97706; padding: 6px 10px;">{{ABV}} ABV Natural Cask Strength</td>
                          </tr>
                        </tbody>
                      </table>
                    `;
                    if (editorRef.current && editorMode === 'visual') {
                      editorRef.current.focus();
                      document.execCommand('insertHTML', false, sampleTable);
                      handleEditorChange();
                    } else {
                      setActiveDoc(prev => ({
                        ...prev,
                        contentHtml: prev.contentHtml + sampleTable
                      }));
                    }
                  }}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 bg-stone-950 border border-stone-800 hover:border-amber-700 text-stone-300 hover:text-amber-300 rounded cursor-pointer"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Insert Spec Table</span>
                </button>
              </div>
            </div>

            {/* Live Stationery Canvas Sheet */}
            <div className="bg-stone-950 p-6 md:p-8 rounded-xl border border-stone-800 flex justify-center overflow-x-auto shadow-inner">
              <div
                className="w-full max-w-3xl shadow-2xl relative rounded-sm transition-all overflow-hidden flex flex-col justify-between"
                style={{
                  backgroundColor: paperTheme.bg,
                  color: paperTheme.text,
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  minHeight: '920px',
                  padding: '36px 44px 0px 44px',
                  border: `2px solid ${paperTheme.border}`
                }}
              >
                {/* Official Top-Right Orange Geometric Polygon Accent */}
                <div className="absolute top-0 right-0 w-36 sm:w-52 h-20 sm:h-28 pointer-events-none z-10">
                  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none" fill="none">
                    <polygon points="65,0 200,0 200,85 130,85" fill="#E67E22" />
                    <polygon points="115,0 200,0 200,50 155,50" fill="#F39C12" opacity="0.9" />
                    <polygon points="60,0 67,0 132,85 125,85" fill="#D35400" />
                  </svg>
                </div>

                {/* Subtle Official Watermark Layer */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
                  style={{ opacity: 0.045 }}
                >
                  <ZookasOfficialCrest size={340} variant="watermark" showText={true} />
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Top-Left GSTIN */}
                  {(companyDetails?.showGstOnLetterhead ?? true) && (
                    <div className="text-[11px] sm:text-xs font-black tracking-tight text-black mb-1.5 flex items-center gap-1 font-mono">
                      <span>GSTIN:</span>
                      <span className="font-extrabold">{companyDetails?.gstin || "19AACCZ7001P1ZU"}</span>
                    </div>
                  )}

                  {/* Header Row: Crest on Left, Centered Company Details */}
                  <header className="mb-2 relative z-10">
                    <div className="flex flex-row items-center gap-4 text-left">
                      {/* Left Crest Logo */}
                      <div className="shrink-0 flex items-center justify-center">
                        {((companyDetails?.logoType === 'custom_image' || !companyDetails?.logoType)) && companyDetails?.logoUrl ? (
                          <img
                            src={companyDetails.logoUrl}
                            alt="Company Logo"
                            referrerPolicy="no-referrer"
                            className="object-contain max-h-20 sm:max-h-24"
                            style={{ width: `${Math.min(companyDetails.logoWidth || 100, 130)}px` }}
                          />
                        ) : (
                          <ZookasOfficialCrest size={82} variant="gold" showText={true} />
                        )}
                      </div>

                      {/* Right/Center Company Details */}
                      <div className="flex-1 text-center pr-6 sm:pr-10">
                        <h1 className="text-base sm:text-xl md:text-2xl font-black uppercase text-black leading-tight tracking-wide font-sans m-0">
                          {companyDetails?.companyName || "ZOOKAS UNITY BLENDERS & DISTILLERS PRIVATE LIMITED"}
                        </h1>

                        {(companyDetails?.showAddressOnLetterhead ?? true) && (
                          <p className="text-[10px] sm:text-[11.5px] text-stone-900 leading-snug mt-1 max-w-xl mx-auto font-sans font-medium">
                            {companyDetails?.registeredAddress || "Floor No.: 1ST FLOOR Building , S S TOWER, T N, MUKHERJEE ROAD LICHU BAGA, Dankuni, Hooghly, West Bengal, PIN Code: 712311"}
                          </p>
                        )}

                        {(companyDetails?.showCinOnLetterhead ?? true) && (
                          <p className="text-[10.5px] sm:text-[11.5px] font-bold text-black mt-0.5 font-mono">
                            CIN NO:-{companyDetails?.cin || "U73100WB2025PTC281568 / U46305WB2025PTC281568"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Official Golden/Amber Divider Bar */}
                    <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-[#E67E22] to-amber-700 my-2.5 rounded-sm" />

                    {/* Registration No & Date Subheader */}
                    <div className="flex flex-row items-center justify-between text-xs sm:text-[13px] font-bold text-black pb-2 border-b border-stone-200">
                      <div>
                        Registration No :-{' '}
                        <span className="font-mono font-semibold text-stone-800">
                          {activeDoc.referenceNumber || 'ZUBD/2026/REG-001'}
                        </span>
                      </div>
                      <div>
                        Date:-{' '}
                        <span className="font-semibold text-stone-800">
                          {activeDoc.documentDate
                            ? new Date(activeDoc.documentDate).toLocaleDateString('en-GB')
                            : new Date().toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  </header>

                  {/* Recipient Information Bar */}
                  {activeDoc.recipientName && (
                    <div className="py-2.5 mb-3 border-b border-dashed border-stone-300 text-xs text-stone-800">
                      <div className="font-bold text-stone-900">{activeDoc.recipientName}</div>
                      {activeDoc.recipientTitle && <div>{activeDoc.recipientTitle}</div>}
                      {activeDoc.recipientCompany && <div className="font-medium">{activeDoc.recipientCompany}</div>}
                      {activeDoc.recipientAddress && <div className="text-[11px] text-stone-600">{activeDoc.recipientAddress}</div>}
                      {activeDoc.subject && <div className="mt-1.5 font-bold text-amber-900 italic">Subject: {activeDoc.subject}</div>}
                    </div>
                  )}

                {/* --- EDITABLE DOCUMENT BODY --- */}
                <div className="relative z-10 min-h-[380px]">
                  {editorMode === 'visual' ? (
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorChange}
                      className="outline-none focus:ring-1 focus:ring-amber-500/30 p-2 rounded prose max-w-none text-sm md:text-base leading-relaxed"
                      style={{ color: paperTheme.text }}
                      dangerouslySetInnerHTML={{ __html: activeDoc.contentHtml }}
                    />
                  ) : (
                    <textarea
                      value={activeDoc.contentHtml}
                      onChange={e =>
                        setActiveDoc(prev => ({
                          ...prev,
                          contentHtml: e.target.value,
                          updatedAt: new Date().toISOString()
                        }))
                      }
                      rows={16}
                      className="w-full p-4 bg-stone-900 text-amber-300 font-mono text-xs border border-amber-900/40 rounded-lg focus:outline-none"
                    />
                  )}
                </div>

                  {/* Signatory Area if enabled */}
                  {activeTemplate.showSignatureBlock && (
                    <div className="mt-6 mb-4 flex justify-end">
                      <div className="text-center min-w-[200px]">
                        <div className="font-serif italic text-base font-bold mb-1 text-amber-900">
                          {activeDoc.customSignatoryName || activeTemplate.signatoryName || "For ZOOKAS UNITY BLENDERS & DISTILLERS"}
                        </div>
                        <div className="w-36 h-px mx-auto mb-1 bg-stone-400" />
                        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-800">
                          {activeDoc.customSignatoryTitle || activeTemplate.signatoryTitle || "Authorized Signatory"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- OFFICIAL VIBRANT ORANGE GEOMETRIC RIBBON FOOTER --- */}
                <footer className="relative z-10 -mx-11 mt-6">
                  <div className="relative bg-[#E67E22] text-white py-2.5 px-8 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
                    {/* Left/Center: Contact details with icons */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-1 text-xs font-medium tracking-wide">
                      {(companyDetails?.showContactOnLetterhead ?? true) && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-white shrink-0" />
                            <span>{(companyDetails?.website || "www.zookasunityspirits.in").replace(/^https?:\/\//, '')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                            <span>{companyDetails?.phone || "9593712358"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                            <span>{companyDetails?.email || "zookasspirit123@gmail.com"}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right Geometric Facets */}
                    <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-28 pointer-events-none">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none" fill="none">
                        <polygon points="45,50 65,0 78,0 58,50" fill="#FFFFFF" />
                        <polygon points="75,50 90,0 100,0 100,50" fill="#F39C12" />
                      </svg>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TEMPLATE CUSTOMIZER & DESIGNER MODAL */}
      {/* ========================================================================= */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-900/60 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-800 bg-stone-950">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg text-amber-100 font-bold">
                  {editingTemplate ? `Edit Letterhead: ${editingTemplate.name}` : 'Create New Letterhead Style'}
                </h3>
              </div>
              <button
                onClick={() => setTemplateModalOpen(false)}
                className="text-stone-400 hover:text-stone-200 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-200">
              {/* 1. Identification */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-1">
                  1. Template Identification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Letterhead Name</label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={e => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Category</label>
                    <select
                      value={templateForm.category}
                      onChange={e => setTemplateForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 capitalize"
                    >
                      <option value="certificate">Certificate of Origin</option>
                      <option value="dispatch">Bonded Dispatch</option>
                      <option value="invitation">VIP Invitation</option>
                      <option value="tasting_notes">Tasting Notes</option>
                      <option value="corporate">Corporate Deed</option>
                      <option value="general">General Stationery</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-stone-400 mb-1">Description</label>
                    <input
                      type="text"
                      value={templateForm.description}
                      onChange={e => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Paper Style & Header Layout */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-1">
                  2. Paper Stationery & Header Layout
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Paper Material Style</label>
                    <select
                      value={templateForm.paperStyle}
                      onChange={e => setTemplateForm(prev => ({ ...prev, paperStyle: e.target.value as LetterheadPaperStyle }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 capitalize"
                    >
                      <option value="vintage_parchment">Vintage Speyside Parchment</option>
                      <option value="speyside_cream">Speyside Cream Bond</option>
                      <option value="obsidian_gold">Obsidian & Gold Leaf</option>
                      <option value="charred_oak">Charred Oak Vault</option>
                      <option value="clean_bond_white">Clean Bond White</option>
                      <option value="royal_linen">Royal Linen Ivory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Header Layout</label>
                    <select
                      value={templateForm.headerLayout}
                      onChange={e => setTemplateForm(prev => ({ ...prev, headerLayout: e.target.value as LetterheadHeaderLayout }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 capitalize"
                    >
                      <option value="centered_royal_crest">Centered Royal Crest</option>
                      <option value="split_crest_left">Split Crest Left</option>
                      <option value="classic_editorial">Classic Editorial</option>
                      <option value="modern_minimal_right">Modern Minimal</option>
                      <option value="dual_column_stamp">Dual Column Stamp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Header Divider Flourish</label>
                    <select
                      value={templateForm.headerDivider}
                      onChange={e => setTemplateForm(prev => ({ ...prev, headerDivider: e.target.value as LetterheadDivider }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500 capitalize"
                    >
                      <option value="double_gold_filigree">Double Gold Filigree</option>
                      <option value="minimal_amber_line">Minimal Amber Line</option>
                      <option value="distiller_emblem_divider">Distiller Emblem Ribbon</option>
                      <option value="embossed_stamp_ribbon">Embossed Stamp Ribbon</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Distillery Branding & Registry Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-1">
                  3. Distillery Lineage & Regulatory Registry
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Distillery Title</label>
                    <input
                      type="text"
                      value={templateForm.distilleryName}
                      onChange={e => setTemplateForm(prev => ({ ...prev, distilleryName: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={templateForm.tagline}
                      onChange={e => setTemplateForm(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Heritage Foundation Year</label>
                    <input
                      type="text"
                      value={templateForm.heritageYear}
                      onChange={e => setTemplateForm(prev => ({ ...prev, heritageYear: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Bond House Registration</label>
                    <input
                      type="text"
                      value={templateForm.bondHouseRegistration}
                      onChange={e => setTemplateForm(prev => ({ ...prev, bondHouseRegistration: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-stone-400 mb-1">Postal Address & Contact</label>
                    <input
                      type="text"
                      value={templateForm.contactAddress}
                      onChange={e => setTemplateForm(prev => ({ ...prev, contactAddress: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Watermarks & Security Seals */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-1">
                  4. Watermarks, Wax Seal & Authority Signatures
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Watermark Card */}
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
                    <label className="text-xs text-stone-300 font-semibold block">Watermark Emblem</label>
                    <select
                      value={templateForm.watermarkType}
                      onChange={e => setTemplateForm(prev => ({ ...prev, watermarkType: e.target.value as LetterheadWatermark }))}
                      className="w-full px-2 py-1.5 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 capitalize"
                    >
                      <option value="authenticated_seal">Authenticated Seal</option>
                      <option value="distillery_crest">Distillery Crest</option>
                      <option value="cask_barrel_stamp">Cask Barrel Stamp</option>
                      <option value="bonded_release">Bonded Release Stamp</option>
                      <option value="none">None</option>
                    </select>
                    {templateForm.watermarkType !== 'none' && (
                      <input
                        type="text"
                        placeholder="Watermark Text"
                        value={templateForm.watermarkText || ''}
                        onChange={e => setTemplateForm(prev => ({ ...prev, watermarkText: e.target.value }))}
                        className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200"
                      />
                    )}
                  </div>

                  {/* Wax Seal Card */}
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-stone-300 font-semibold">Wax Seal Emblem</label>
                      <input
                        type="checkbox"
                        checked={templateForm.showWaxSeal}
                        onChange={e => setTemplateForm(prev => ({ ...prev, showWaxSeal: e.target.checked }))}
                        className="rounded border-stone-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                      />
                    </div>
                    {templateForm.showWaxSeal && (
                      <>
                        <select
                          value={templateForm.waxSealColor}
                          onChange={e => setTemplateForm(prev => ({ ...prev, waxSealColor: e.target.value as LetterheadWaxSealColor }))}
                          className="w-full px-2 py-1.5 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 capitalize"
                        >
                          <option value="ruby_crimson">Ruby Crimson Wax</option>
                          <option value="antique_gold">Antique Gold Wax</option>
                          <option value="obsidian_black">Obsidian Black Wax</option>
                          <option value="emerald_green">Emerald Green Wax</option>
                          <option value="amber_bronze">Amber Bronze Wax</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Wax Seal Text"
                          value={templateForm.waxSealText}
                          onChange={e => setTemplateForm(prev => ({ ...prev, waxSealText: e.target.value }))}
                          className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200"
                        />
                      </>
                    )}
                  </div>

                  {/* Signatory Card */}
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg space-y-2">
                    <label className="text-xs text-stone-300 font-semibold block">Master Distiller Signatory</label>
                    <input
                      type="text"
                      placeholder="Signatory Name"
                      value={templateForm.signatoryName}
                      onChange={e => setTemplateForm(prev => ({ ...prev, signatoryName: e.target.value }))}
                      className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200"
                    />
                    <input
                      type="text"
                      placeholder="Signatory Title"
                      value={templateForm.signatoryTitle}
                      onChange={e => setTemplateForm(prev => ({ ...prev, signatoryTitle: e.target.value }))}
                      className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTemplateModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Save Letterhead Style
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRINT & PDF EXPORT MODAL */}
      {/* ========================================================================= */}
      {printPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-900/80 rounded-xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Topbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 border-b border-stone-800 bg-stone-950">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h3 className="font-serif text-sm sm:text-base text-amber-100 font-bold">
                    Official Document Print & PDF Preview
                  </h3>
                  <div className="text-xs text-stone-400">
                    {activeDoc.title} • Ref: {activeDoc.referenceNumber}
                  </div>
                </div>
              </div>

              {/* Zoom & Print Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-xs text-stone-300">
                  <button
                    onClick={() => setPreviewZoom(75)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${previewZoom === 75 ? 'bg-amber-600 text-stone-950 font-bold' : ''}`}
                  >
                    75%
                  </button>
                  <button
                    onClick={() => setPreviewZoom(100)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${previewZoom === 100 ? 'bg-amber-600 text-stone-950 font-bold' : ''}`}
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setPreviewZoom(125)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${previewZoom === 125 ? 'bg-amber-600 text-stone-950 font-bold' : ''}`}
                  >
                    125%
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow min-h-[38px]"
                >
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>Print / PDF</span>
                </button>

                <button
                  onClick={() => setPrintPreviewModalOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-100 rounded-lg text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Stationery Container */}
            <div className="p-8 overflow-y-auto bg-stone-950 flex justify-center flex-1">
              <div
                id="printable-letterhead-document"
                className="w-full max-w-3xl shadow-2xl relative transition-transform origin-top overflow-hidden flex flex-col justify-between"
                style={{
                  transform: `scale(${previewZoom / 100})`,
                  backgroundColor: paperTheme.bg,
                  color: paperTheme.text,
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  minHeight: '1050px',
                  padding: '40px 48px 0px 48px',
                  border: `2px solid ${paperTheme.border}`
                }}
              >
                {/* Official Top-Right Orange Geometric Polygon Accent */}
                <div className="absolute top-0 right-0 w-44 sm:w-60 h-24 sm:h-32 pointer-events-none z-10">
                  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none" fill="none">
                    <polygon points="65,0 200,0 200,85 130,85" fill="#E67E22" />
                    <polygon points="115,0 200,0 200,50 155,50" fill="#F39C12" opacity="0.9" />
                    <polygon points="60,0 67,0 132,85 125,85" fill="#D35400" />
                  </svg>
                </div>

                {/* Subtle Official Watermark Layer */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
                  style={{ opacity: 0.045 }}
                >
                  <ZookasOfficialCrest size={380} variant="watermark" showText={true} />
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Top-Left GSTIN */}
                  {(companyDetails?.showGstOnLetterhead ?? true) && (
                    <div className="text-xs font-black tracking-tight text-black mb-1.5 flex items-center gap-1 font-mono">
                      <span>GSTIN:</span>
                      <span className="font-extrabold">{companyDetails?.gstin || "19AACCZ7001P1ZU"}</span>
                    </div>
                  )}

                  {/* Header Row: Crest on Left, Centered Company Details */}
                  <header className="mb-2 relative z-10">
                    <div className="flex flex-row items-center gap-4 text-left">
                      {/* Left Crest Logo */}
                      <div className="shrink-0 flex items-center justify-center">
                        {((companyDetails?.logoType === 'custom_image' || !companyDetails?.logoType)) && companyDetails?.logoUrl ? (
                          <img
                            src={companyDetails.logoUrl}
                            alt="Company Logo"
                            referrerPolicy="no-referrer"
                            className="object-contain max-h-24"
                            style={{ width: `${Math.min(companyDetails.logoWidth || 100, 140)}px` }}
                          />
                        ) : (
                          <ZookasOfficialCrest size={90} variant="gold" showText={true} />
                        )}
                      </div>

                      {/* Right/Center Company Details */}
                      <div className="flex-1 text-center pr-8">
                        <h1 className="text-lg sm:text-2xl font-black uppercase text-black leading-tight tracking-wide font-sans m-0">
                          {companyDetails?.companyName || "ZOOKAS UNITY BLENDERS & DISTILLERS PRIVATE LIMITED"}
                        </h1>

                        {(companyDetails?.showAddressOnLetterhead ?? true) && (
                          <p className="text-[11px] sm:text-xs text-stone-900 leading-snug mt-1 max-w-xl mx-auto font-sans font-medium">
                            {companyDetails?.registeredAddress || "Floor No.: 1ST FLOOR Building , S S TOWER, T N, MUKHERJEE ROAD LICHU BAGA, Dankuni, Hooghly, West Bengal, PIN Code: 712311"}
                          </p>
                        )}

                        {(companyDetails?.showCinOnLetterhead ?? true) && (
                          <p className="text-xs font-bold text-black mt-0.5 font-mono">
                            CIN NO:-{companyDetails?.cin || "U73100WB2025PTC281568 / U46305WB2025PTC281568"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Official Golden/Amber Divider Bar */}
                    <div className="w-full h-1.5 bg-gradient-to-r from-amber-600 via-[#E67E22] to-amber-700 my-3 rounded-sm" />

                    {/* Registration No & Date Subheader */}
                    <div className="flex flex-row items-center justify-between text-xs sm:text-sm font-bold text-black pb-2 border-b border-stone-200">
                      <div>
                        Registration No :-{' '}
                        <span className="font-mono font-semibold text-stone-800">
                          {activeDoc.referenceNumber || 'ZUBD/2026/REG-001'}
                        </span>
                      </div>
                      <div>
                        Date:-{' '}
                        <span className="font-semibold text-stone-800">
                          {activeDoc.documentDate
                            ? new Date(activeDoc.documentDate).toLocaleDateString('en-GB')
                            : new Date().toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  </header>

                  {/* Recipient Information Bar */}
                  {activeDoc.recipientName && (
                    <div className="py-3 mb-4 border-b border-dashed border-stone-300 text-xs text-stone-800">
                      <div className="font-bold text-stone-900 text-sm">{activeDoc.recipientName}</div>
                      {activeDoc.recipientTitle && <div>{activeDoc.recipientTitle}</div>}
                      {activeDoc.recipientCompany && <div className="font-medium">{activeDoc.recipientCompany}</div>}
                      {activeDoc.recipientAddress && <div className="text-[11px] text-stone-600">{activeDoc.recipientAddress}</div>}
                      {activeDoc.subject && <div className="mt-2 font-bold text-amber-900 italic">Subject: {activeDoc.subject}</div>}
                    </div>
                  )}

                  {/* Resolved Body Content */}
                  <div
                    className="relative z-10 leading-relaxed text-sm md:text-base space-y-4 flex-1"
                    dangerouslySetInnerHTML={{
                      __html: resolveContentVariables(activeDoc.contentHtml, activeDoc, activeTemplate)
                    }}
                  />

                  {/* Signatory Area */}
                  {activeTemplate.showSignatureBlock && (
                    <div className="mt-8 mb-6 flex justify-end">
                      <div className="text-center min-w-[220px]">
                        <div className="font-serif italic text-base font-bold mb-1 text-amber-900">
                          {activeDoc.customSignatoryName || activeTemplate.signatoryName || "For ZOOKAS UNITY BLENDERS & DISTILLERS"}
                        </div>
                        <div className="w-40 h-px mx-auto mb-1 bg-stone-400" />
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-800">
                          {activeDoc.customSignatoryTitle || activeTemplate.signatoryTitle || "Authorized Signatory"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* --- OFFICIAL VIBRANT ORANGE GEOMETRIC RIBBON FOOTER --- */}
                <footer className="relative z-10 -mx-12 mt-6">
                  <div className="relative bg-[#E67E22] text-white py-3 px-10 overflow-hidden flex flex-row items-center justify-between gap-4 text-xs shadow-md">
                    {/* Contact Details */}
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-1 text-xs font-medium tracking-wide">
                      {(companyDetails?.showContactOnLetterhead ?? true) && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-white shrink-0" />
                            <span>{(companyDetails?.website || "www.zookasunityspirits.in").replace(/^https?:\/\//, '')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-white shrink-0" />
                            <span>{companyDetails?.phone || "9593712358"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-white shrink-0" />
                            <span>{companyDetails?.email || "zookasspirit123@gmail.com"}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right Geometric Facets */}
                    <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-32 pointer-events-none">
                      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none" fill="none">
                        <polygon points="45,50 65,0 78,0 58,50" fill="#FFFFFF" />
                        <polygon points="75,50 90,0 100,0 100,50" fill="#F39C12" />
                      </svg>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

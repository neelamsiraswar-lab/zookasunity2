import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore, 
  setLogLevel,
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch,
  Unsubscribe,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';
import { 
  SpiritProduct, 
  DistillerInventoryItem, 
  Order, 
  BlogPost, 
  HomeContent, 
  AboutContent, 
  AdminSettings, 
  CustomerUser,
  HeaderCustomizationConfig,
  FooterCustomizationConfig,
  BottomNavbarCustomizationConfig,
  ProductReview,
  BallotAllocation,
  BallotEntry,
  LetterheadTemplate,
  LetterheadDocument,
  CompanyDetails
} from '../types';

// Silence internal Firestore connection logs and transient retry warnings
try {
  setLogLevel('silent');
} catch (e) {
  // Ignore if already configured
}

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfigData) : getApp();

// Initialize Firestore with specific database ID and auto-detect long polling
const databaseId = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? firebaseConfigData.firestoreDatabaseId
  : undefined;

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true
  }, databaseId);
} catch (e) {
  // If already initialized, fallback to getFirestore
  firestoreInstance = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreInstance;

// Initialize Firebase Auth
export const auth = getAuth(app);

// Gracefully ensure anonymous auth session for cloud operations
onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth).catch((err) => {
      // Offline or anonymous auth optional
      console.warn('Anonymous auth note (app functioning in hybrid mode):', err?.message || err);
    });
  }
});

// Initialize Firebase Storage
export const storage = getStorage(app);

// Google Authentication Popup helper for customer login
export const loginWithGoogleFirebase = async (): Promise<{ success: boolean; user?: any; error?: string }> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.warn('Google sign-in popup note:', error?.message || error);
    return { success: false, error: error?.message || 'Google sign-in could not be completed.' };
  }
};

export const logoutFirebase = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase sign out note:', err);
  }
};

// Standard Firestore Error Handling Structure from Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  // Log structured diagnostic without crashing application
  console.warn('Firestore Operation Notice:', JSON.stringify(errInfo));
  return errInfo;
}

// Validate connection to Firestore peacefully
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    const pingDoc = doc(db, 'products', '__ping__');
    await getDoc(pingDoc);
    return true;
  } catch (error) {
    console.warn('Firestore offline fallback active: operating seamlessly with local cache and state.');
    return false;
  }
};

// Collections Enum / Constants
export const COLLECTIONS = {
  PRODUCTS: 'products',
  INVENTORY: 'inventory',
  ORDERS: 'orders',
  BLOG_POSTS: 'blog_posts',
  SITE_CONTENT: 'site_content',
  CUSTOMERS: 'customers',
  REVIEWS: 'reviews',
  BALLOT_ALLOCATIONS: 'ballot_allocations',
  BALLOT_ENTRIES: 'ballot_entries',
  LETTERHEADS: 'letterheads',
  LETTERHEAD_DOCUMENTS: 'letterhead_documents'
} as const;

// Helper: Client-side Image Optimization (Downsamples high-res local uploads to prevent Firestore document overflow and improve upload speeds)
export const optimizeImageFile = async (
  file: File,
  maxDimension = 900,
  quality = 0.88
): Promise<{ file: File | Blob; dataUrl: string }> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve({ file, dataUrl: '' });
      return;
    }

    // Pass SVG directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve({ file, dataUrl: (reader.result as string) || '' });
      reader.onerror = () => resolve({ file, dataUrl: '' });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const isPng = file.type === 'image/png';
          const outputType = isPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(outputType, quality);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, { type: outputType });
                resolve({ file: optimizedFile, dataUrl });
              } else {
                resolve({ file, dataUrl });
              }
            },
            outputType,
            quality
          );
        } else {
          resolve({ file, dataUrl: (e.target?.result as string) || '' });
        }
      };
      img.onerror = () => {
        resolve({ file, dataUrl: (e.target?.result as string) || '' });
      };
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => resolve({ file, dataUrl: '' });
    reader.readAsDataURL(file);
  });
};

// Storage helper: Upload Image (File or Data URL) to Cloud Storage with fallback
export const uploadImageToCloudStorage = async (
  fileOrBase64: File | string,
  pathFolder: 'products' | 'carousel' | 'heritage' | 'blog' | 'casks' = 'products'
): Promise<string> => {
  let targetToUpload: File | Blob | string = fileOrBase64;
  let fallbackDataUrl = '';

  if (typeof fileOrBase64 !== 'string') {
    try {
      const optimized = await optimizeImageFile(fileOrBase64);
      targetToUpload = optimized.file;
      fallbackDataUrl = optimized.dataUrl;
    } catch {
      // Fallback gracefully
    }
  }

  try {
    const filename = `${pathFolder}/${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, filename);

    if (typeof targetToUpload === 'string') {
      if (targetToUpload.startsWith('data:')) {
        await uploadString(storageRef, targetToUpload, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
      }
      return targetToUpload; // Already an external or hosted URL
    } else {
      await uploadBytes(storageRef, targetToUpload);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    }
  } catch (err) {
    console.warn('Cloud Storage upload note (falling back to direct optimized URL/dataURI):', err);
    if (typeof targetToUpload === 'string') {
      return targetToUpload;
    }
    if (fallbackDataUrl) {
      return fallbackDataUrl;
    }
    // Fallback: convert file to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBase64 as File);
    });
  }
};

// ==========================================
// REAL-TIME FIRESTORE CRUD OPERATIONS
// ==========================================

// --- PRODUCTS ---
export const saveCloudProduct = async (product: SpiritProduct): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, product.id);
    await setDoc(docRef, { ...product, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.PRODUCTS}/${product.id}`);
  }
};

export const deleteCloudProduct = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, productId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.PRODUCTS}/${productId}`);
  }
};

export const subscribeToCloudProducts = (callback: (products: SpiritProduct[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.PRODUCTS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: SpiritProduct[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as SpiritProduct);
      });
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.PRODUCTS);
  });
};

// --- INVENTORY ---
export const saveCloudInventoryLot = async (lot: DistillerInventoryItem): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVENTORY, lot.id);
    await setDoc(docRef, { ...lot, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.INVENTORY}/${lot.id}`);
  }
};

export const deleteCloudInventoryLot = async (lotId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVENTORY, lotId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.INVENTORY}/${lotId}`);
  }
};

export const subscribeToCloudInventory = (callback: (lots: DistillerInventoryItem[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.INVENTORY));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: DistillerInventoryItem[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as DistillerInventoryItem);
      });
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.INVENTORY);
  });
};

// --- ORDERS ---
export const saveCloudOrder = async (order: Order): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, order.id);
    await setDoc(docRef, { ...order, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.ORDERS}/${order.id}`);
  }
};

export const deleteCloudOrder = async (orderId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.ORDERS}/${orderId}`);
  }
};

export const subscribeToCloudOrders = (callback: (orders: Order[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.ORDERS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: Order[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Order);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.ORDERS);
  });
};

// --- BLOG POSTS ---
export const saveCloudBlogPost = async (post: BlogPost): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BLOG_POSTS, post.id);
    await setDoc(docRef, { ...post, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.BLOG_POSTS}/${post.id}`);
  }
};

export const deleteCloudBlogPost = async (postId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BLOG_POSTS, postId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.BLOG_POSTS}/${postId}`);
  }
};

export const subscribeToCloudBlogPosts = (callback: (posts: BlogPost[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.BLOG_POSTS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: BlogPost[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as BlogPost);
      });
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.BLOG_POSTS);
  });
};

// --- SITE CONTENT (Home, About, Settings, Header, Footer, Bottom Navbar) ---
export const saveCloudSiteContent = async (key: 'home' | 'about' | 'settings' | 'header' | 'footer' | 'bottom_navbar' | 'company_details', data: any): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.SITE_CONTENT, key);
    await setDoc(docRef, { data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.SITE_CONTENT}/${key}`);
  }
};

export const subscribeToCloudSiteContent = (
  callback: (contents: { 
    home?: HomeContent; 
    about?: AboutContent; 
    settings?: AdminSettings; 
    header?: HeaderCustomizationConfig; 
    footer?: FooterCustomizationConfig;
    bottomNavbar?: BottomNavbarCustomizationConfig;
    companyDetails?: CompanyDetails;
  }) => void
): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.SITE_CONTENT));
  return onSnapshot(q, (snapshot) => {
    const result: { 
      home?: HomeContent; 
      about?: AboutContent; 
      settings?: AdminSettings; 
      header?: HeaderCustomizationConfig; 
      footer?: FooterCustomizationConfig;
      bottomNavbar?: BottomNavbarCustomizationConfig;
      companyDetails?: CompanyDetails;
    } = {};
    snapshot.forEach(docSnap => {
      const id = docSnap.id;
      const data = docSnap.data()?.data;
      if (id === 'home') result.home = data;
      if (id === 'about') result.about = data;
      if (id === 'settings') result.settings = data;
      if (id === 'header') result.header = data;
      if (id === 'footer') result.footer = data;
      if (id === 'bottom_navbar') result.bottomNavbar = data;
      if (id === 'company_details' || id === 'company') result.companyDetails = data;
    });
    callback(result);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.SITE_CONTENT);
  });
};

// --- CUSTOMER PROFILE ---
export const saveCloudCustomer = async (customer: CustomerUser): Promise<void> => {
  if (!customer?.id) return;
  try {
    const docRef = doc(db, COLLECTIONS.CUSTOMERS, customer.id);
    await setDoc(docRef, { ...customer, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.CUSTOMERS}/${customer.id}`);
  }
};

export const deleteCloudCustomer = async (customerId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.CUSTOMERS, customerId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.CUSTOMERS}/${customerId}`);
  }
};

export const getCloudCustomer = async (customerId: string): Promise<CustomerUser | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.CUSTOMERS, customerId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CustomerUser;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `${COLLECTIONS.CUSTOMERS}/${customerId}`);
    return null;
  }
};

export const subscribeToCloudCustomer = (customerId: string, callback: (customer: CustomerUser | null) => void): Unsubscribe => {
  const docRef = doc(db, COLLECTIONS.CUSTOMERS, customerId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as CustomerUser);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, `${COLLECTIONS.CUSTOMERS}/${customerId}`);
  });
};

export const subscribeToCloudCustomers = (callback: (customers: CustomerUser[]) => void): Unsubscribe => {
  const colRef = collection(db, COLLECTIONS.CUSTOMERS);
  return onSnapshot(colRef, (snapshot) => {
    const list: CustomerUser[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CustomerUser);
    });
    callback(list);
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.CUSTOMERS);
  });
};

export const getCloudCustomers = async (): Promise<CustomerUser[]> => {
  try {
    const colRef = collection(db, COLLECTIONS.CUSTOMERS);
    const snap = await getDocs(colRef);
    const list: CustomerUser[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as CustomerUser);
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.CUSTOMERS);
    return [];
  }
};

// --- PRODUCT REVIEWS & CONNOISSEUR FEEDBACK ---
export const saveCloudReview = async (review: ProductReview): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.REVIEWS, review.id);
    await setDoc(docRef, { ...review, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.REVIEWS}/${review.id}`);
  }
};

export const deleteCloudReview = async (reviewId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.REVIEWS}/${reviewId}`);
  }
};

export const voteHelpfulCloudReview = async (reviewId: string, voterId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.REVIEWS, reviewId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ProductReview;
      const voters = data.helpfulVoters || [];
      const isAlreadyVoted = voters.includes(voterId);
      const newVoters = isAlreadyVoted ? voters.filter(id => id !== voterId) : [...voters, voterId];
      const newCount = newVoters.length;
      await updateDoc(docRef, {
        helpfulCount: newCount,
        helpfulVoters: newVoters,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.REVIEWS}/${reviewId}`);
  }
};

export const subscribeToProductReviews = (productId: string, callback: (reviews: ProductReview[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.REVIEWS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: ProductReview[] = [];
      snapshot.forEach(docSnap => {
        const item = docSnap.data() as ProductReview;
        if (item.productId === productId) {
          list.push(item);
        }
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.REVIEWS);
  });
};

export const subscribeToAllCloudReviews = (callback: (reviews: ProductReview[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.REVIEWS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: ProductReview[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as ProductReview);
      });
      list.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.REVIEWS);
  });
};

// --- BALLOT ALLOCATIONS & COLLECTOR LOTTERY ENTRIES ---
export const saveCloudBallotAllocation = async (allocation: BallotAllocation): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BALLOT_ALLOCATIONS, allocation.id);
    await setDoc(docRef, {
      ...allocation,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.BALLOT_ALLOCATIONS}/${allocation.id}`);
    throw err;
  }
};

export const deleteCloudBallotAllocation = async (allocationId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BALLOT_ALLOCATIONS, allocationId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.BALLOT_ALLOCATIONS}/${allocationId}`);
    throw err;
  }
};

export const subscribeToCloudBallotAllocations = (callback: (allocations: BallotAllocation[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.BALLOT_ALLOCATIONS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: BallotAllocation[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as BallotAllocation);
      });
      // Sort by status and draw date
      list.sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime());
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.BALLOT_ALLOCATIONS);
  });
};

export const saveCloudBallotEntry = async (entry: BallotEntry): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BALLOT_ENTRIES, entry.id);
    await setDoc(docRef, {
      ...entry,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.BALLOT_ENTRIES}/${entry.id}`);
    throw err;
  }
};

export const updateCloudBallotEntry = async (entryId: string, updates: Partial<BallotEntry>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BALLOT_ENTRIES, entryId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.BALLOT_ENTRIES}/${entryId}`);
    throw err;
  }
};

export const deleteCloudBallotEntry = async (entryId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.BALLOT_ENTRIES, entryId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.BALLOT_ENTRIES}/${entryId}`);
    throw err;
  }
};

export const subscribeToCloudBallotEntries = (callback: (entries: BallotEntry[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.BALLOT_ENTRIES));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: BallotEntry[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as BallotEntry);
      });
      list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.BALLOT_ENTRIES);
  });
};

// --- LETTERHEAD TEMPLATES ---
export const saveCloudLetterhead = async (letterhead: LetterheadTemplate): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.LETTERHEADS, letterhead.id);
    await setDoc(docRef, {
      ...letterhead,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.LETTERHEADS}/${letterhead.id}`);
    throw err;
  }
};

export const deleteCloudLetterhead = async (letterheadId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.LETTERHEADS, letterheadId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.LETTERHEADS}/${letterheadId}`);
    throw err;
  }
};

export const subscribeToCloudLetterheads = (callback: (letterheads: LetterheadTemplate[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.LETTERHEADS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: LetterheadTemplate[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as LetterheadTemplate);
      });
      list.sort((a, b) => {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return a.name.localeCompare(b.name);
      });
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.LETTERHEADS);
  });
};

// --- LETTERHEAD DOCUMENTS & CERTIFICATES ---
export const saveCloudLetterheadDocument = async (document: LetterheadDocument): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.LETTERHEAD_DOCUMENTS, document.id);
    await setDoc(docRef, {
      ...document,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${COLLECTIONS.LETTERHEAD_DOCUMENTS}/${document.id}`);
    throw err;
  }
};

export const deleteCloudLetterheadDocument = async (docId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.LETTERHEAD_DOCUMENTS, docId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTIONS.LETTERHEAD_DOCUMENTS}/${docId}`);
    throw err;
  }
};

export const subscribeToCloudLetterheadDocuments = (callback: (documents: LetterheadDocument[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.LETTERHEAD_DOCUMENTS));
  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const list: LetterheadDocument[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as LetterheadDocument);
      });
      list.sort((a, b) => new Date(b.updatedAt || b.documentDate).getTime() - new Date(a.updatedAt || a.documentDate).getTime());
      callback(list);
    } else {
      callback([]);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.LIST, COLLECTIONS.LETTERHEAD_DOCUMENTS);
  });
};

// --- SEEDING & CLOUD SYNC BOOTSTRAPPER ---
export const seedInitialCloudDatabase = async (initialData: {
  products: SpiritProduct[];
  inventory: DistillerInventoryItem[];
  orders: Order[];
  blogPosts: BlogPost[];
  homeContent: HomeContent;
  aboutContent: AboutContent;
  adminSettings: AdminSettings;
  customer?: CustomerUser;
  customers?: CustomerUser[];
  headerConfig?: HeaderCustomizationConfig;
  footerConfig?: FooterCustomizationConfig;
  reviews?: ProductReview[];
  ballotAllocations?: BallotAllocation[];
  ballotEntries?: BallotEntry[];
  letterheads?: LetterheadTemplate[];
  letterheadDocuments?: LetterheadDocument[];
}): Promise<{ success: boolean; seededCount: number }> => {
  try {
    let seededCount = 0;
    const batch = writeBatch(db);

    // 1. Products
    for (const prod of initialData.products) {
      const pRef = doc(db, COLLECTIONS.PRODUCTS, prod.id);
      batch.set(pRef, { ...prod, updatedAt: new Date().toISOString() }, { merge: true });
      seededCount++;
    }

    // 2. Inventory
    for (const inv of initialData.inventory) {
      const iRef = doc(db, COLLECTIONS.INVENTORY, inv.id);
      batch.set(iRef, { ...inv, updatedAt: new Date().toISOString() }, { merge: true });
      seededCount++;
    }

    // 3. Orders
    for (const ord of initialData.orders) {
      const oRef = doc(db, COLLECTIONS.ORDERS, ord.id);
      batch.set(oRef, { ...ord, updatedAt: new Date().toISOString() }, { merge: true });
      seededCount++;
    }

    // 4. Blog Posts
    for (const bp of initialData.blogPosts) {
      const bRef = doc(db, COLLECTIONS.BLOG_POSTS, bp.id);
      batch.set(bRef, { ...bp, updatedAt: new Date().toISOString() }, { merge: true });
      seededCount++;
    }

    // 5. Site Content
    const homeRef = doc(db, COLLECTIONS.SITE_CONTENT, 'home');
    batch.set(homeRef, { data: initialData.homeContent, updatedAt: new Date().toISOString() }, { merge: true });
    seededCount++;

    const aboutRef = doc(db, COLLECTIONS.SITE_CONTENT, 'about');
    batch.set(aboutRef, { data: initialData.aboutContent, updatedAt: new Date().toISOString() }, { merge: true });
    seededCount++;

    const settingsRef = doc(db, COLLECTIONS.SITE_CONTENT, 'settings');
    batch.set(settingsRef, { data: initialData.adminSettings, updatedAt: new Date().toISOString() }, { merge: true });
    seededCount++;

    if (initialData.headerConfig) {
      const headerRef = doc(db, COLLECTIONS.SITE_CONTENT, 'header');
      batch.set(headerRef, { data: initialData.headerConfig, updatedAt: new Date().toISOString() }, { merge: true });
      seededCount++;
    }

    if (initialData.footerConfig) {
      const footerRef = doc(db, COLLECTIONS.SITE_CONTENT, 'footer');
      batch.set(footerRef, { data: initialData.footerConfig, updatedAt: new Date().toISOString() }, { merge: true });
      seededCount++;
    }

    // 6. Customers (all registered patrons)
    if (initialData.customers && initialData.customers.length > 0) {
      for (const cust of initialData.customers) {
        if (cust?.id) {
          const custRef = doc(db, COLLECTIONS.CUSTOMERS, cust.id);
          batch.set(custRef, { ...cust, updatedAt: new Date().toISOString() }, { merge: true });
          seededCount++;
        }
      }
    } else if (initialData.customer?.id) {
      const custRef = doc(db, COLLECTIONS.CUSTOMERS, initialData.customer.id);
      batch.set(custRef, { ...initialData.customer, updatedAt: new Date().toISOString() }, { merge: true });
      seededCount++;
    }

    // 7. Product Reviews
    if (initialData.reviews && initialData.reviews.length > 0) {
      for (const rev of initialData.reviews) {
        const rRef = doc(db, COLLECTIONS.REVIEWS, rev.id);
        batch.set(rRef, { ...rev, updatedAt: new Date().toISOString() }, { merge: true });
        seededCount++;
      }
    }

    // 8. Ballot Allocations
    if (initialData.ballotAllocations && initialData.ballotAllocations.length > 0) {
      for (const alloc of initialData.ballotAllocations) {
        const aRef = doc(db, COLLECTIONS.BALLOT_ALLOCATIONS, alloc.id);
        batch.set(aRef, { ...alloc, updatedAt: new Date().toISOString() }, { merge: true });
        seededCount++;
      }
    }

    // 9. Ballot Entries
    if (initialData.ballotEntries && initialData.ballotEntries.length > 0) {
      for (const entry of initialData.ballotEntries) {
        const eRef = doc(db, COLLECTIONS.BALLOT_ENTRIES, entry.id);
        batch.set(eRef, { ...entry, updatedAt: new Date().toISOString() }, { merge: true });
        seededCount++;
      }
    }

    // 10. Letterhead Templates
    if (initialData.letterheads && initialData.letterheads.length > 0) {
      for (const letterhead of initialData.letterheads) {
        const lRef = doc(db, COLLECTIONS.LETTERHEADS, letterhead.id);
        batch.set(lRef, { ...letterhead, updatedAt: new Date().toISOString() }, { merge: true });
        seededCount++;
      }
    }

    // 11. Letterhead Documents
    if (initialData.letterheadDocuments && initialData.letterheadDocuments.length > 0) {
      for (const lDoc of initialData.letterheadDocuments) {
        const ldRef = doc(db, COLLECTIONS.LETTERHEAD_DOCUMENTS, lDoc.id);
        batch.set(ldRef, { ...lDoc, updatedAt: new Date().toISOString() }, { merge: true });
        seededCount++;
      }
    }

    try {
      await batch.commit();
      return { success: true, seededCount };
    } catch (batchErr) {
      console.warn('Batch commit notice, attempting resilient collection-by-collection sync:', batchErr);
      // Resilient fallback: write collections individually so one schema variance does not halt the entire seed
      let individualSuccessCount = 0;
      const safeSet = async (col: string, id: string, data: any) => {
        try {
          await setDoc(doc(db, col, id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
          individualSuccessCount++;
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `${col}/${id}`);
        }
      };

      for (const prod of initialData.products) await safeSet(COLLECTIONS.PRODUCTS, prod.id, prod);
      for (const inv of initialData.inventory) await safeSet(COLLECTIONS.INVENTORY, inv.id, inv);
      for (const ord of initialData.orders) await safeSet(COLLECTIONS.ORDERS, ord.id, ord);
      for (const bp of initialData.blogPosts) await safeSet(COLLECTIONS.BLOG_POSTS, bp.id, bp);
      await safeSet(COLLECTIONS.SITE_CONTENT, 'home', { data: initialData.homeContent });
      await safeSet(COLLECTIONS.SITE_CONTENT, 'about', { data: initialData.aboutContent });
      await safeSet(COLLECTIONS.SITE_CONTENT, 'settings', { data: initialData.adminSettings });
      if (initialData.headerConfig) await safeSet(COLLECTIONS.SITE_CONTENT, 'header', { data: initialData.headerConfig });
      if (initialData.footerConfig) await safeSet(COLLECTIONS.SITE_CONTENT, 'footer', { data: initialData.footerConfig });
      if (initialData.customers && initialData.customers.length > 0) {
        for (const cust of initialData.customers) {
          if (cust?.id) await safeSet(COLLECTIONS.CUSTOMERS, cust.id, cust);
        }
      } else if (initialData.customer?.id) {
        await safeSet(COLLECTIONS.CUSTOMERS, initialData.customer.id, initialData.customer);
      }
      if (initialData.reviews) {
        for (const rev of initialData.reviews) await safeSet(COLLECTIONS.REVIEWS, rev.id, rev);
      }
      if (initialData.ballotAllocations) {
        for (const alloc of initialData.ballotAllocations) await safeSet(COLLECTIONS.BALLOT_ALLOCATIONS, alloc.id, alloc);
      }
      if (initialData.ballotEntries) {
        for (const entry of initialData.ballotEntries) await safeSet(COLLECTIONS.BALLOT_ENTRIES, entry.id, entry);
      }
      if (initialData.letterheads) {
        for (const lh of initialData.letterheads) await safeSet(COLLECTIONS.LETTERHEADS, lh.id, lh);
      }
      if (initialData.letterheadDocuments) {
        for (const ld of initialData.letterheadDocuments) await safeSet(COLLECTIONS.LETTERHEAD_DOCUMENTS, ld.id, ld);
      }
      return { success: true, seededCount: individualSuccessCount };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'seed_initial_database');
    return { success: false, seededCount: 0 };
  }
};

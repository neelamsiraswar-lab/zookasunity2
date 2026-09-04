import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { BottomNavbar } from './components/BottomNavbar';
import { Footer } from './components/Footer';
import { AgeGateModal } from './components/AgeGateModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InvoiceModal } from './components/InvoiceModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { AuthView } from './components/views/AuthView';

import { HomeView } from './components/views/HomeView';
import { ProductsView } from './components/views/ProductsView';
import { AllocationsView } from './components/views/AllocationsView';
import { AboutView } from './components/views/AboutView';
import { BlogView } from './components/views/BlogView';
import { AccountView } from './components/views/AccountView';
import { CheckoutView } from './components/views/CheckoutView';
import { AdminPanelView } from './components/views/AdminPanelView';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, adminSettings, ageVerified, isCustomerLoggedIn } = useStore();

  // 1. Mandatory Legal Age Gate: Show age confirmation if required and not verified
  if (!ageVerified && adminSettings.ageGateRequired) {
    return (
      <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background distillery ambiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 blur-[120px] pointer-events-none" />
        <AgeGateModal />
      </div>
    );
  }

  // 2. Mandatory Patron Authentication Gate: Show sign up / login page after age confirmation
  // Do not show the home page or catalog without login
  if (!isCustomerLoggedIn && activeTab !== 'admin') {
    return (
      <AuthView onAdminClick={() => setActiveTab('admin')} />
    );
  }

  // 3. User authenticated or viewing admin portal: render full store
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 relative pb-20 md:pb-0">
      {/* Global Announcement Header Bar */}
      {adminSettings.showAnnouncementBar && (
        <aside aria-label="Announcement" className="w-full max-w-full overflow-x-hidden bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b border-amber-800/40 text-amber-200 text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2">
          <span>{adminSettings.announcementText}</span>
        </aside>
      )}

      {/* Main Navigation */}
      <Navbar />

      {/* Primary Page View Container */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden relative">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'allocations' && <AllocationsView />}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'blog' && <BlogView />}
        {activeTab === 'account' && <AccountView />}
        {activeTab === 'checkout' && <CheckoutView />}
        {activeTab === 'admin' && <AdminPanelView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Persistent Global Modals & Drawers */}
      <AgeGateModal />
      <CartDrawer />
      <ProductDetailModal />
      <InvoiceModal />
      <CustomerAuthModal />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

export default App;

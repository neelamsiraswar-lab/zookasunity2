import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AgeGateModal } from './components/AgeGateModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InvoiceModal } from './components/InvoiceModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';

import { HomeView } from './components/views/HomeView';
import { ProductsView } from './components/views/ProductsView';
import { AboutView } from './components/views/AboutView';
import { BlogView } from './components/views/BlogView';
import { AccountView } from './components/views/AccountView';
import { CheckoutView } from './components/views/CheckoutView';
import { AdminPanelView } from './components/views/AdminPanelView';

const MainAppContent: React.FC = () => {
  const { activeTab, adminSettings } = useStore();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 relative">
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
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'blog' && <BlogView />}
        {activeTab === 'account' && <AccountView />}
        {activeTab === 'checkout' && <CheckoutView />}
        {activeTab === 'admin' && <AdminPanelView />}
      </main>

      {/* Footer */}
      <Footer />

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

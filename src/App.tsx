import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { ExpiringAlertBanner } from './components/ExpiringAlertBanner';
import { AssetVaultGrid } from './components/AssetVaultGrid';
import { OCRScannerModal } from './components/OCRScannerModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { WarrantyClaimModal } from './components/WarrantyClaimModal';
import { AddAssetModal } from './components/AddAssetModal';
import { EmergencyContactModal } from './components/EmergencyContactModal';
import { UpdatePhoneModal } from './components/UpdatePhoneModal';
import { UpdateEmailModal } from './components/UpdateEmailModal';
import { AuthModal } from './components/AuthModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { WarrantyAlertsModal } from './components/WarrantyAlertsModal';
import { SplashScreen } from './components/SplashScreen';
import { WarrantyExpiryWidget } from './components/WarrantyExpiryWidget';
import { ExportVaultModal } from './components/ExportVaultModal';
import { AssetSavedModal, SavedAssetDetails } from './components/AssetSavedModal';
import { EmergencyModal, VehicleDocuments } from './components/EmergencyModal';
import { AboutUsModal } from './components/AboutUsModal';
import { ContactUsModal } from './components/ContactUsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { ProfileView } from './components/ProfileView';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { DepreciationTrackerWidget } from './components/DepreciationTrackerWidget';
import { FastagCheckerWidget } from './components/FastagCheckerWidget';
import { LandingPage } from './components/LandingPage';
import { Footer } from './components/Footer';
import { SecurityLockScreen } from './components/SecurityLockScreen';
import { AssetPassportModal } from './components/AssetPassportModal';
import { AssetPostcardModal } from './components/AssetPostcardModal';
import { ProUpgradeBanner } from './components/ProUpgradeBanner';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { saveAssetToCloud } from './services/assetCloudService';
import { fetchUserAssets, saveUserAsset, deleteUserAsset } from './services/firestoreService';
import {
  getAllAssetsFromDB,
  saveAssetToDB,
  saveAllAssetsToDB,
  deleteAssetFromDB,
} from './services/dbStorage';
import { SAMPLE_ASSETS, loadDemoAssets } from './services/sampleAssets';
import { Asset, MetricSummary } from './types';
import { getProcessedInitialAssets, calculateExpiryDays } from './utils/assetUtils';
import { CheckCircle2, Camera, Sparkles, ArrowRight, Bot, ShieldCheck, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'assetdoctor_servivault_assets';

const MainContent: React.FC = () => {
  const { user, loading: authLoading, logout: firebaseLogout } = useAuth();
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Asset[] = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch (e) {
      console.error('Failed to load assets from localStorage:', e);
    }
    return [];
  });

  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isUpdatePhoneModalOpen, setIsUpdatePhoneModalOpen] = useState(false);
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'SIGN_UP' | 'SIGN_IN'>('SIGN_UP');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = useState(false);
  const [isWarrantyAlertsModalOpen, setIsWarrantyAlertsModalOpen] = useState(false);
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  const [isAppLocked, setIsAppLocked] = useState<boolean>(true); // Locks on initial launch

  // Lock app automatically when resuming from background
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsAppLocked(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('assetdoctor_is_logged_in') === 'true' || !!user;
  });
  const [userName, setUserName] = useState<string>(() => {
    return user?.displayName || localStorage.getItem('assetdoctor_user_name') || 'Vault Owner';
  });
  const [userPhone, setUserPhone] = useState<string>(() => {
    return user?.phoneNumber || localStorage.getItem('assetdoctor_user_phone') || '';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return user?.email || localStorage.getItem('assetdoctor_user_email') || '';
  });

  // Sync user state when Firebase auth user loads/changes
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      if (user.displayName) setUserName(user.displayName);
      if (user.email) setUserEmail(user.email);
      if (user.phoneNumber) setUserPhone(user.phoneNumber);
    }
  }, [user]);
  const [userLocation, setUserLocation] = useState<string>(() => {
    return localStorage.getItem('assetdoctor_user_location') || 'Lucknow, Uttar Pradesh';
  });

  const handleUpdateLocation = (newLoc: string) => {
    setUserLocation(newLoc);
    try {
      localStorage.setItem('assetdoctor_user_location', newLoc);
    } catch (e) {
      console.error('Failed to save location to localStorage:', e);
    }
  };
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [lastSavedAsset, setLastSavedAsset] = useState<SavedAssetDetails | null>(null);
  const [vehicleEmergencyData, setVehicleEmergencyData] = useState<VehicleDocuments | null>(null);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [claimAsset, setClaimAsset] = useState<Asset | null>(null);
  const [passportAsset, setPassportAsset] = useState<Asset | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Load from LocalStorage & IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;

    // 1. Immediately load from localStorage for fast offline persistence
    const savedVault = localStorage.getItem('assetdoctor_assets_vault');
    if (savedVault) {
      try {
        const parsed = JSON.parse(savedVault);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAssets(parsed);
        }
      } catch (e) {
        console.warn('LocalStorage assets load warning:', e);
      }
    }

    // 2. Load from IndexedDB
    getAllAssetsFromDB().then((dbAssets) => {
      if (!isMounted) return;
      if (dbAssets && dbAssets.length > 0) {
        setAssets(dbAssets);
        try {
          localStorage.setItem('assetdoctor_assets_vault', JSON.stringify(dbAssets));
        } catch (e) {}
      }
    }).catch((err) => {
      console.warn('IndexedDB initial load error:', err);
    });

    // Check if FTUX onboarding completed
    const ftuxDone = localStorage.getItem('assetdoctor_ftux_completed');
    if (!ftuxDone) {
      setIsOnboardingOpen(true);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Remote Database Assets from Firebase Firestore on Auth change
  useEffect(() => {
    if (user?.uid) {
      fetchUserAssets()
        .then((cloudAssets) => {
          if (cloudAssets && cloudAssets.length > 0) {
            setAssets(cloudAssets);
          }
        })
        .catch((err) => console.warn('Firestore fetchUserAssets error:', err));
    }
  }, [user?.uid]);

  // Sync state to localStorage & IndexedDB
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
      saveAllAssetsToDB(assets).catch((err) => console.warn('Sync IndexedDB error:', err));
    } catch (e) {
      console.error('Failed to save assets to localStorage:', e);
    }
  }, [assets]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute Metrics
  const metrics: MetricSummary = useMemo(() => {
    const totalAssets = assets.length;
    const totalValuation = assets.reduce((sum, item) => sum + (item.price || 0), 0);
    const expiringSoonCount = assets.reduce((acc, item) => {
      let count = 0;
      // 1. Warranty alert
      if (item.status === 'expiring_soon' || (item.daysRemaining > 0 && item.daysRemaining <= 7)) {
        count++;
      }
      // 2. Vehicle Insurance alert
      if (item.insuranceExpiryDate) {
        const { daysRemaining } = calculateExpiryDays(item.insuranceExpiryDate);
        if (daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7) {
          count++;
        }
      }
      // 3. Vehicle PUC alert
      if (item.pucExpiryDate) {
        const { daysRemaining } = calculateExpiryDays(item.pucExpiryDate);
        if (daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7) {
          count++;
        }
      }
      return acc + count;
    }, 0);
    const expiredCount = assets.filter((item) => item.status === 'expired' || item.daysRemaining <= 0).length;
    const activeCount = assets.filter((item) => item.daysRemaining > 7).length;
    const upcomingMaintenanceCount = assets.filter((item) => Boolean(item.maintenanceDueDate)).length;

    return {
      totalAssets,
      totalValuation,
      expiringSoonCount,
      expiredCount,
      activeCount,
      upcomingMaintenanceCount,
    };
  }, [assets]);

  // Assets expiring within 7 days for top alert banner
  const expiringAssets = useMemo(() => {
    return assets.filter((item) => item.daysRemaining > 0 && item.daysRemaining <= 7);
  }, [assets]);

  const handleAssetSaveSuccess = (newAssetData: SavedAssetDetails) => {
    setLastSavedAsset(newAssetData);
    setSavedModalOpen(true);
  };

  const [postcardAsset, setPostcardAsset] = useState<Asset | null>(null);
  const [isPostcardOpen, setIsPostcardOpen] = useState<boolean>(false);

  const handleOpenPostcard = (assetToShare: Asset) => {
    setPostcardAsset(assetToShare);
    setIsPostcardOpen(true);
  };

  // Handlers
  const handleAddAsset = (newAsset: Asset) => {
    saveAssetToDB(newAsset).catch(console.warn);
    saveUserAsset(newAsset).catch(console.warn);
    setAssets((prev) => [newAsset, ...prev]);
    showToast(`Added "${newAsset.name}" to AssetDoctor Vault!`);

    // Immediately trigger Asset Postcard Modal for newly added asset
    setPostcardAsset(newAsset);
    setIsPostcardOpen(true);

    // Open celebration modal
    handleAssetSaveSuccess({
      id: newAsset.id,
      name: newAsset.name,
      category: newAsset.category,
      brand: newAsset.brand,
      purchaseDate: newAsset.purchaseDate,
      expiryDate: newAsset.expiryDate,
      insuranceExpiry: newAsset.insuranceExpiryDate,
      pucExpiry: newAsset.pucExpiryDate,
      brandSupportNumber: '18002587111',
      supportNumber: '18002587111',
      imageUrl: newAsset.imageUrl,
    });

    // Save to Cloud in background
    saveAssetToCloud({
      userId: userEmail || 'guest_user',
      name: newAsset.name,
      category: newAsset.category,
      purchaseDate: newAsset.purchaseDate,
      expiryDate: newAsset.expiryDate,
      pucExpiry: newAsset.pucExpiryDate,
      insuranceExpiry: newAsset.insuranceExpiryDate,
      price: newAsset.price,
      notes: newAsset.notes,
    }).catch((err) => {
      console.log('Background Cloud sync notice:', err);
    });
  };

  const handleDeleteAsset = (id: string) => {
    const target = assets.find((a) => a.id === id);
    if (confirm(`Are you sure you want to remove ${target?.name || 'this asset'} from AssetDoctor Vault?`)) {
      deleteAssetFromDB(id).catch(console.warn);
      deleteUserAsset(id).catch(console.warn);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      showToast(`Removed "${target?.name || 'Asset'}" from Vault.`);
    }
  };

  const handleLoadDemoAssets = async () => {
    showToast('Loading demo assets into Cloud...');
    const success = await loadDemoAssets(userEmail || 'demo_user');
    if (success) {
      showToast('3 Demo assets loaded successfully!');
      // Add demo items to state
      const newItems: Asset[] = SAMPLE_ASSETS.map((item, idx) => {
        const { daysRemaining, status } = calculateExpiryDays(item.expiryDate);
        const remDays = daysRemaining ?? 365;
        const mappedStatus = remDays <= 0 ? 'expired' : remDays <= 30 ? 'expiring_soon' : 'active';
        return {
          id: `demo-${Date.now()}-${idx}`,
          name: item.name,
          brand: item.brand || 'Brand',
          category: (item.category === 'Bike' ? 'Vehicles' : item.category === 'Home Appliance' ? 'Appliances' : 'Gadgets') as any,
          purchaseDate: item.purchaseDate,
          warrantyMonths: 12,
          expiryDate: item.expiryDate || '',
          daysRemaining: remDays,
          status: mappedStatus,
          price: item.price || 0,
          notes: item.notes,
          imageUrl: item.imageUrl,
          isEncrypted: true,
          addedDate: new Date().toISOString().split('T')[0],
        };
      });
      setAssets((prev) => [...newItems, ...prev]);
    } else {
      showToast('Failed to load demo assets.');
    }
  };

  const handlePhoneUpdated = (newPhone: string) => {
    setUserPhone(newPhone);
    try {
      localStorage.setItem('assetdoctor_user_phone', newPhone);
    } catch (e) {
      console.error('Failed to save user phone:', e);
    }
    showToast(`Updated user phone number in database to ${newPhone}`);
  };

  const handleEmailUpdated = (newEmail: string) => {
    setUserEmail(newEmail);
    try {
      localStorage.setItem('assetdoctor_user_email', newEmail);
    } catch (e) {
      console.error('Failed to save user email:', e);
    }
    showToast(`Updated user Auth email address to ${newEmail}`);
  };

  const handleUpdateAsset = (updatedAsset: Asset) => {
    setAssets((prev) => prev.map((item) => (item.id === updatedAsset.id ? updatedAsset : item)));
    setSelectedAsset(updatedAsset);
    showToast(`Updated service history for "${updatedAsset.name}"`);
  };

  const handleExportVault = () => {
    setIsExportModalOpen(true);
  };

  const handleScrollToAlerts = () => {
    setActiveStatusFilter('expiring_soon');
    const el = document.getElementById('top-notification-expiry-banner') || document.getElementById('asset-vault-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = (userData: { name: string; email: string; phone: string; location?: string }) => {
    setIsLoggedIn(true);
    setUserName(userData.name || 'Vault Owner');
    if (userData.email) setUserEmail(userData.email);
    if (userData.phone) setUserPhone(userData.phone);
    if (userData.location) setUserLocation(userData.location);

    try {
      localStorage.setItem('assetdoctor_is_logged_in', 'true');
      localStorage.setItem('assetdoctor_user_name', userData.name || 'Vault Owner');
      if (userData.email) localStorage.setItem('assetdoctor_user_email', userData.email);
      if (userData.phone) localStorage.setItem('assetdoctor_user_phone', userData.phone);
      if (userData.location) localStorage.setItem('assetdoctor_user_location', userData.location);
    } catch (e) {
      console.error('Failed to save auth session to localStorage:', e);
    }

    setIsAuthModalOpen(false);
    navigateTo('/dashboard');
    showToast(`Welcome ${userData.name ? userData.name.split(' ')[0] : 'to AssetDoctor'}! Your session is active.`);
  };

  const handleLogout = async () => {
    try {
      await firebaseLogout();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setIsLoggedIn(false);
    try {
      localStorage.setItem('assetdoctor_is_logged_in', 'false');
    } catch (e) {
      console.error('Failed to update logout state:', e);
    }
    setIsAccountSettingsModalOpen(false);
    navigateTo('/');
    showToast('Logged out successfully.');
  };

  // PUBLIC LANDING PAGE ROUTE (or unauthenticated attempt to access dashboard)
  if (currentPath !== '/dashboard' || !isLoggedIn) {
    return (
      <>
        <LandingPage
          isLoggedIn={isLoggedIn}
          userName={userName}
          onOpenAuth={(mode) => {
            setAuthInitialMode(mode);
            setIsAuthModalOpen(true);
          }}
          onGoToDashboard={() => {
            if (isLoggedIn) {
              navigateTo('/dashboard');
            } else {
              setAuthInitialMode('SIGN_IN');
              setIsAuthModalOpen(true);
            }
          }}
          onOpenAboutUs={() => setIsAboutUsModalOpen(true)}
          onOpenContactUs={() => setIsContactUsModalOpen(true)}
          onOpenPrivacyPolicy={() => setIsPrivacyPolicyModalOpen(true)}
        />

        <AuthModal
          isOpen={isAuthModalOpen || (!isLoggedIn && currentPath === '/dashboard')}
          canDismiss={true}
          initialMode={authInitialMode}
          onClose={() => {
            setIsAuthModalOpen(false);
            if (!isLoggedIn && currentPath === '/dashboard') {
              navigateTo('/');
            }
          }}
          onAuthSuccess={handleAuthSuccess}
        />

        <AboutUsModal
          isOpen={isAboutUsModalOpen}
          onClose={() => setIsAboutUsModalOpen(false)}
        />

        <ContactUsModal
          isOpen={isContactUsModalOpen}
          onClose={() => setIsContactUsModalOpen(false)}
          onShowToast={(msg) => showToast(msg)}
        />

        <PrivacyPolicyModal
          isOpen={isPrivacyPolicyModalOpen}
          onClose={() => setIsPrivacyPolicyModalOpen(false)}
        />

        {/* Splash Screen Intro overlay */}
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </>
    );
  }

  // PROTECTED DASHBOARD ROUTE
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-[#10B981] selection:text-slate-950">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#121824] border border-[#10B981]/50 shadow-2xl shadow-[#10B981]/20 text-xs font-bold text-[#10B981] animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Fixed Header */}
      <Header
        isLoggedIn={isLoggedIn}
        totalValuation={metrics.totalValuation}
        totalAssetsCount={metrics.totalAssets}
        expiringSoonCount={metrics.expiringSoonCount}
        userName={userName}
        userPhone={userPhone}
        userEmail={userEmail}
        userLocation={userLocation}
        onOpenOCR={() => setIsOCRModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenUpdatePhoneModal={() => setIsUpdatePhoneModalOpen(true)}
        onOpenUpdateEmailModal={() => setIsUpdateEmailModalOpen(true)}
        onOpenLoginModal={() => {
          setAuthInitialMode('SIGN_IN');
          setIsAuthModalOpen(true);
        }}
        onOpenAccountSettingsModal={() => setIsAccountSettingsModalOpen(true)}
        onOpenWarrantyAlertsModal={() => setIsWarrantyAlertsModalOpen(true)}
        onOpenSplashScreen={() => setShowSplash(true)}
        onOpenAboutUs={() => setIsAboutUsModalOpen(true)}
        onOpenContactUs={() => setIsContactUsModalOpen(true)}
        onOpenPrivacyPolicy={() => setIsPrivacyPolicyModalOpen(true)}
        onNavigateToProfile={() => setActiveTab('profile')}
        onOpenLandingPage={() => navigateTo('/')}
        onExportVault={handleExportVault}
        onScrollToAlerts={handleScrollToAlerts}
        onLogout={handleLogout}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 pb-28 space-y-6">
        
        {/* TAB 1: Dashboard Home View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* Metric Cards (KPI Summary) */}
            <MetricCards
              metrics={metrics}
              assets={assets}
              onFilterStatus={(st) => {
                setActiveStatusFilter(st);
                setActiveTab('vault');
              }}
              activeFilter={activeStatusFilter}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />

            {/* Top Notification Banner for Assets Expiring Within 7 Days */}
            <ExpiringAlertBanner
              expiringAssets={expiringAssets}
              allAssets={assets}
              onSelectAsset={(ast) => setSelectedAsset(ast)}
              onOpenClaimModal={(ast) => setClaimAsset(ast)}
              onRenewWarrantyToast={(msg) => showToast(msg)}
            />

            {/* Recent Assets Preview (Max 3 Items) */}
            <div className="p-5 rounded-3xl bg-[#0F141F] border border-[#222C40] space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#10B981] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Recent Assets ({Math.min(assets.length, 3)} of {assets.length})</span>
                </h3>

                <button
                  onClick={() => setActiveTab('vault')}
                  className="text-xs font-bold text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Vault ({assets.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {assets.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#0B0E14] border border-dashed border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-400">No assets in your vault yet.</p>
                  <button
                    onClick={() => setIsOCRModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#10B981] text-slate-950 font-bold text-xs shadow-md cursor-pointer"
                  >
                    + Scan First Invoice
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {assets.slice(0, 3).map((ast) => (
                    <div
                      key={ast.id}
                      onClick={() => setSelectedAsset(ast)}
                      className="p-3.5 rounded-2xl bg-[#0B0E14] border border-[#222C40] hover:border-[#10B981]/50 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <h4 className="text-xs font-extrabold text-white truncate group-hover:text-[#10B981]">
                          {ast.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {ast.brand || ast.category} • ₹{(ast.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pro Upgrade Banner: ₹9/mo Instant WhatsApp & SMS Expiry Alerts */}
            <ProUpgradeBanner onShowToast={(msg) => showToast(msg)} />

            {/* FASTag Status & Depreciation Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FastagCheckerWidget
                assets={assets}
                onShowToast={(msg) => showToast(msg)}
              />
              <DepreciationTrackerWidget
                assets={assets}
                onSelectAsset={(ast) => setSelectedAsset(ast)}
                onOpenClaimModal={(ast) => setClaimAsset(ast)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Vault (Assets) View */}
        {activeTab === 'vault' && (
          <div className="animate-in fade-in duration-300">
            <AssetVaultGrid
              assets={assets}
              activeStatusFilter={activeStatusFilter}
              onStatusFilterChange={(st) => setActiveStatusFilter(st)}
              onSelectAsset={(ast) => setSelectedAsset(ast)}
              onClaimAsset={(ast) => setClaimAsset(ast)}
              onDeleteAsset={handleDeleteAsset}
              onOpenOCR={() => setIsOCRModalOpen(true)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSharePostcard={handleOpenPostcard}
            />
          </div>
        )}

        {/* TAB 3: Profile View */}
        {activeTab === 'profile' && (
          <ProfileView
            userName={userName}
            userPhone={userPhone}
            userEmail={userEmail}
            userLocation={userLocation}
            totalAssetsCount={metrics.totalAssets}
            totalValuation={metrics.totalValuation}
            expiringSoonCount={metrics.expiringSoonCount}
            onOpenUpdatePhoneModal={() => setIsUpdatePhoneModalOpen(true)}
            onOpenUpdateEmailModal={() => setIsUpdateEmailModalOpen(true)}
            onOpenAccountSettingsModal={() => setIsAccountSettingsModalOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onOpenWarrantyAlertsModal={() => setIsWarrantyAlertsModalOpen(true)}
            onOpenAboutUs={() => setIsAboutUsModalOpen(true)}
            onOpenContactUs={() => setIsContactUsModalOpen(true)}
            onOpenPrivacyPolicy={() => setIsPrivacyPolicyModalOpen(true)}
            onExportVault={handleExportVault}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onLogout={handleLogout}
          />
        )}

      </main>

      {/* PWA Prompt Banner for Mobile Users */}
      <PwaInstallBanner />

      {/* Fixed Native Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenOCR={() => setIsOCRModalOpen(true)}
        expiringSoonCount={metrics.expiringSoonCount}
      />

      {/* Clean Minimal Footer */}
      <footer className="mt-12 border-t border-[#1E2638]/60 bg-[#0B0E14] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AssetDoctor</span>
            <span>•</span>
            <span className="text-[#10B981] font-medium">Encrypted & Offline Private Asset Vault</span>
          </div>

          <div className="text-slate-500 text-[11px] font-mono">
            © {new Date().getFullYear()} AssetDoctor Technologies • All Rights Reserved
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OCRScannerModal
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
        onAddAsset={handleAddAsset}
      />

      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAsset={handleAddAsset}
      />

      <EmergencyContactModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <UpdatePhoneModal
        isOpen={isUpdatePhoneModalOpen}
        currentPhone={userPhone}
        onClose={() => setIsUpdatePhoneModalOpen(false)}
        onPhoneUpdated={handlePhoneUpdated}
      />

      <UpdateEmailModal
        isOpen={isUpdateEmailModalOpen}
        currentEmail={userEmail}
        onClose={() => setIsUpdateEmailModalOpen(false)}
        onEmailUpdated={handleEmailUpdated}
      />

      <ExportVaultModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        assets={assets}
        totalValuation={metrics.totalValuation}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onOpenClaimModal={(ast) => setClaimAsset(ast)}
        onUpdateAsset={handleUpdateAsset}
        onOpenEmergencyModal={(data) => setVehicleEmergencyData(data)}
        onOpenPassportModal={(ast) => setPassportAsset(ast)}
      />

      <AssetPassportModal
        isOpen={!!passportAsset}
        asset={passportAsset}
        ownerName={userName}
        onClose={() => setPassportAsset(null)}
      />

      <AssetPostcardModal
        isOpen={isPostcardOpen}
        asset={postcardAsset}
        ownerName={userName}
        onClose={() => setIsPostcardOpen(false)}
      />

      <WarrantyClaimModal
        asset={claimAsset}
        onClose={() => setClaimAsset(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        canDismiss={true}
        initialMode={authInitialMode}
        onClose={() => {
          setIsAuthModalOpen(false);
          setShowSplash(false);
        }}
        onAuthSuccess={handleAuthSuccess}
      />

      <AccountSettingsModal
        isOpen={isAccountSettingsModalOpen}
        userEmail={userEmail}
        userPhone={userPhone}
        userLocation={userLocation}
        onClose={() => setIsAccountSettingsModalOpen(false)}
        onOpenUpdatePhoneModal={() => setIsUpdatePhoneModalOpen(true)}
        onOpenUpdateEmailModal={() => setIsUpdateEmailModalOpen(true)}
        onOpenForgotPassword={() => {
          setAuthInitialMode('SIGN_IN');
          setIsAuthModalOpen(true);
        }}
        onUpdateLocation={handleUpdateLocation}
        onPasswordChangedToast={(msg) => showToast(msg)}
        onShowToast={(msg) => showToast(msg)}
        onLogout={handleLogout}
      />

      <WarrantyAlertsModal
        isOpen={isWarrantyAlertsModalOpen}
        assets={assets}
        onClose={() => setIsWarrantyAlertsModalOpen(false)}
        onSelectAsset={(ast) => setSelectedAsset(ast)}
        onOpenClaimModal={(ast) => setClaimAsset(ast)}
        onRenewWarrantyToast={(msg) => showToast(msg)}
      />

      <AssetSavedModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        asset={lastSavedAsset}
        onRenewClick={(asset, type) => {
          showToast(`${asset.name} का ${type.toUpperCase()} रिन्यू करने का प्रोसेस चालू हो रहा है...`);
        }}
      />

      <EmergencyModal
        isOpen={!!vehicleEmergencyData}
        onClose={() => setVehicleEmergencyData(null)}
        data={vehicleEmergencyData}
      />

      <AboutUsModal
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
      />

      <ContactUsModal
        isOpen={isContactUsModalOpen}
        onClose={() => setIsContactUsModalOpen(false)}
        onShowToast={(msg) => showToast(msg)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={() => setIsPrivacyPolicyModalOpen(false)}
      />

      <OnboardingTutorial
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={() => {
          localStorage.setItem('assetdoctor_ftux_completed', 'true');
          showToast('Welcome to AssetDoctor! Your vault is ready.');
        }}
      />

      {/* Security Lock Screen (WebAuthn / Biometrics & 4-Digit PIN) */}
      <SecurityLockScreen
        isOpen={isAppLocked}
        onUnlocked={() => setIsAppLocked(false)}
      />

      {/* Splash Screen Intro overlay */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Footer */}
      <Footer />

      {/* Floating Action Button (FAB) for Quick Scanning */}
      <button
        onClick={() => setIsOCRModalOpen(true)}
        id="floating-scan-fab-btn"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 ring-4 ring-slate-950/60"
        title="Scan New Bill / Document with AI OCR"
      >
        <Camera className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        <span className="font-extrabold tracking-tight">Scan New Bill / Document</span>
        <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
      </button>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
      <Analytics />
    </AuthProvider>
  );
}

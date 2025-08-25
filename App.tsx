// src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Product, FormState, CalculationResult, ChatMessage as ChatMessageType, Template, User, PriceList, Subscription, TariffPlan, Material, PromoCode, AuditLogEntry, Order } from './types';
import Header from './components/Header';
import ProductSelector from './components/ProductSelector';
import CalculatorForm from './components/CalculatorForm';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { calculatePrintCost, processChatMessage } from './services/geminiService';
import { formatPriceListForPrompt } from './services/priceListFormatter';
import Home from './components/Home';
import Footer from './components/Footer';
import TemplateSelector from './components/TemplateSelector';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProfileView from './components/ProfileView';
import PriceListEditor from './components/PriceListEditor';
import SubscriptionGateView from './components/SubscriptionGateView';
import DashboardView from './components/DashboardView';
import SuperadminView from './components/superadmin/SuperadminView';
import * as api from './services/apiService';
import CheckoutView from './components/CheckoutView';
import OrderSuccessView from './components/OrderSuccessView';
import CartView from './components/CartView';

type View = 'home' | 'products' | 'templates' | 'calculator' | 'login' | 'register' | 'profile' | 'price-list-editor' | 'dashboard' | 'cart' | 'checkout' | 'order-success';

const App: React.FC = () => {
  const [isSuperadminMode, setIsSuperadminMode] = useState(false);
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prefilledFormState, setPrefilledFormState] = useState<Partial<FormState> | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [lastView, setLastView] = useState<View>('home');
  const [cart, setCart] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [priceList, setPriceList] = useState<PriceList>({ variants: {}, lastUpdated: undefined });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [tariffPlans, setTariffPlans] = useState<TariffPlan[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  const loadInitialData = useCallback(async () => {
    try {
        const [productsData, materialsData, templatesData, tariffPlansData] = await Promise.all([
            api.getProducts(),
            api.getMaterials(),
            api.getTemplates(),
            api.getTariffPlans(),
        ]);
        setProducts(productsData);
        setMaterials(materialsData);
        setTemplates(templatesData);
        setTariffPlans(tariffPlansData);
    } catch (err) {
        setError("Asosiy ma'lumotlarni yuklashda xatolik yuz berdi.");
    }
  }, []);
  
  const loadUserData = useCallback(async () => {
      if (!localStorage.getItem('accessToken')) return;
      try {
          const [priceListData, ordersData, subscriptionsData] = await Promise.all([
              api.getPriceList(),
              api.getOrders(),
              api.getMySubscriptions(),
          ]);
          setPriceList(priceListData);
          setOrders(ordersData);
          setSubscriptions(subscriptionsData);
      } catch (err) {
          console.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik:", err);
      }
  }, []);

  const loadSuperadminData = useCallback(async () => {
      try {
          const [usersData, subscriptionsData, promoCodesData, auditLogData] = await Promise.all([
              api.adminGetUsers(),
              api.adminGetSubscriptions(),
              api.adminGetPromoCodes(),
              api.adminGetAuditLog(),
          ]);
          setUsers(usersData);
          setSubscriptions(subscriptionsData);
          setPromoCodes(promoCodesData);
          setAuditLog(auditLogData);
      } catch (err) {
          setError("Superadmin ma'lumotlarini yuklashda xatolik.");
      }
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
        setIsLoading(true);
        await loadInitialData();
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const user = await api.getProfile();
                setCurrentUser(user);
            } catch {
                localStorage.removeItem('accessToken');
                setCurrentUser(null);
            }
        }
        setIsLoading(false);
    };

    initializeApp();
    setChatMessages([{ id: 'initial-greeting', role: 'model', text: "Salom! Men AI-Print yordamchisiman." }]);
  }, [loadInitialData]);
  
  useEffect(() => {
      if (currentUser) {
          loadUserData();
      }
      if (isSuperadminMode) {
          loadSuperadminData();
      }
  }, [currentUser, isSuperadminMode, loadUserData, loadSuperadminData]);

  const navigateTo = (newView: View) => {
    if (view !== newView) {
      setLastView(view);
      setView(newView);
    }
  }

  const handleRegister = async (name: string, phone: string, password: string) => {
      await api.register({ name, phone, password });
      await handleLogin(phone, password);
  };

  const handleLogin = async (phone: string, password: string) => {
      const data = await api.login({ phone, password });
      localStorage.setItem('accessToken', data.access);
      setCurrentUser(data.user);
      setIsSuperadminMode(false);
      setView(lastView !== 'login' && lastView !== 'register' ? lastView : 'home');
  };

  const handleSuperadminLogin = () => {
    setCurrentUser(null);
    setIsSuperadminMode(true);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('accessToken');
      setIsSuperadminMode(false);
      setView('login');
  };

  const resetState = useCallback(() => {
    setSelectedProduct(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setPrefilledFormState(null);
  }, []);

  const handleGoHome = useCallback(() => {
    resetState();
    setView('home');
  }, [resetState]);

  const handleProductSelect = (product: Product) => {
    resetState();
    setSelectedProduct(product);
    setPrefilledFormState(product.defaultState || {});
    setView('calculator');
  };
  
  const handleTemplateSelect = (template: Template) => {
    const product = products.find(p => p.id === template.productId);
    if (product) {
      resetState();
      setSelectedProduct(product);
      setPrefilledFormState(template.defaultState);
      setView('calculator');
    }
  };

  const handleCalculate = useCallback(async (formState: FormState) => {
    if (!selectedProduct) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    console.log("Calculating cost with price list state:", priceList);

    try {
      const priceListString = formatPriceListForPrompt(priceList.variants, products, materials);
      const apiResult = await calculatePrintCost({ ...formState, productType: selectedProduct.name }, priceListString, products);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hisob-kitobda xato.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, priceList, products, materials]);

  const handleSendMessage = useCallback(async (message: string, file?: { data: string; mimeType: string; name: string; }) => {
    const userMessage: ChatMessageType = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: message,
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsAiThinking(true);
    
    const loadingMessage: ChatMessageType = {
        id: `model-loading-${Date.now()}`,
        role: 'model',
        text: '',
        isLoading: true,
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    console.log("Sending message to AI with price list state:", priceList);

    try {
        const priceListString = formatPriceListForPrompt(priceList.variants, products, materials);
        const result = await processChatMessage([...chatMessages, userMessage], message, priceListString, products, file);
        
        const newAiMessages: ChatMessageType[] = [];

        if (result.textResponse) {
             newAiMessages.push({
                id: `model-response-${Date.now()}`,
                role: 'model',
                text: result.textResponse,
                suggestedActions: result.suggestedActions || undefined,
            });
        }
        
        if (result.calculationResults) {
            result.calculationResults.forEach((calc, index) => {
                 const productType = calc.requestData?.productType || "Noma'lum mahsulot";
                 newAiMessages.push({
                    id: `model-calc-${Date.now()}-${index}`,
                    role: 'model',
                    text: `${productType} uchun hisob-kitob:`,
                    result: calc,
                    suggestedActions: ["Boshqa miqdorni hisoblash", "Boshqa mahsulotni hisoblash"]
                 });
            });
        }
        
        setChatMessages(prev => {
            const updatedMessages = prev.filter(msg => !msg.isLoading);
            return [...updatedMessages, ...newAiMessages];
        });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Noma'lum xatolik";
        const errorResponse: ChatMessageType = {
            id: `model-error-${Date.now()}`,
            role: 'model',
            text: `Xatolik yuz berdi: ${errorMessage}`
        };
        setChatMessages(prev => {
            const updatedMessages = prev.filter(msg => !msg.isLoading);
            return [...updatedMessages, errorResponse];
        });
    } finally {
        setIsAiThinking(false);
    }
  }, [chatMessages, priceList, products, materials]);

  const handlePlaceOrder = async (orderDetails: any) => {
      if (!currentUser) return;
      const orderData = { ...orderDetails, items: cart };
      await api.createOrder(orderData);
      setCart([]);
      setView('order-success');
  };

  const handleUpdateUser = async (user: User) => {
      await api.adminUpdateUser(user.phone, { status: user.status, name: user.name });
      loadSuperadminData();
  };

  const handleAddSubscription = async (data: any) => {
    await api.adminCreateSubscription(data);
    loadSuperadminData();
  };
  
  const handleUpdateSubscription = async (data: Subscription) => {
    await api.adminUpdateSubscription(data.id, data);
    loadSuperadminData();
  };

  const handleDeleteSubscription = async (id: number) => {
    await api.adminDeleteSubscription(id);
    loadSuperadminData();
  };

  const handlePriceListUpdate = async (newPriceList: PriceList) => {
    try {
      const updatedPriceList = await api.updatePriceList({ variants: newPriceList.variants });
      setPriceList(updatedPriceList);
      alert("Narxlar muvaffaqiyatli saqlandi!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Saqlashda xatolik yuz berdi.');
      alert("Xatolik: Narxlar saqlanmadi.");
    }
  };
  
  const userSubscription = subscriptions.find(s => 
      s.user?.phone === currentUser?.phone && 
      s.status === 'active' && 
      new Date(s.expiresAt) > new Date()
  );
  
  const renderContent = () => {
    if (error) return <div className="text-center p-8 text-red-300">{error}</div>;
    
    switch (view) {
        case 'home': return <Home onSelectProducts={() => setView('products')} messages={chatMessages} onSendMessage={handleSendMessage} isAiThinking={isAiThinking} products={products} materials={materials} />;
        case 'products': return <ProductSelector products={products} onSelect={handleProductSelect} onBack={handleGoHome} />;
        case 'templates': return <TemplateSelector templates={templates} onSelect={handleTemplateSelect} onBack={handleGoHome} />;
        case 'calculator':
            if (isLoading && !result) return <Loader />;
            if (result && selectedProduct) return <ResultDisplay result={result} request={result.requestData} product={selectedProduct} onEdit={() => setResult(null)} materials={materials} />;
            if (selectedProduct) return <CalculatorForm product={selectedProduct} onCalculate={handleCalculate} onBack={() => setView('products')} isLoading={isLoading} prefilledState={prefilledFormState || undefined} materials={materials} />;
            return <p>Xatolik: Mahsulot tanlanmagan.</p>;
        case 'login': return <LoginView onLogin={handleLogin} onGoToRegister={() => setView('register')} onBack={() => navigateTo(lastView)} onSuperadminLogin={handleSuperadminLogin} />;
        case 'register': return <RegisterView onRegister={handleRegister} onGoToLogin={() => setView('login')} onBack={() => navigateTo(lastView)} />;
        case 'profile':
            if (!currentUser) { setView('login'); return null; }
            return <ProfileView user={currentUser} subscription={userSubscription} tariffPlans={tariffPlans} onLogout={handleLogout} onBack={handleGoHome} onPlanChange={()=>{}} />;
        case 'dashboard':
            if (!currentUser) { setView('login'); return null; }
            return <DashboardView user={currentUser} users={users} onNavigate={(v) => setView(v)} />;
        case 'price-list-editor':
            if (!currentUser) { setView('login'); return null; }
            return <PriceListEditor initialPriceList={priceList} onSave={handlePriceListUpdate} onBack={() => setView('dashboard')} products={products} materials={materials}/>;
        case 'cart': return <CartView items={cart} onRemoveItem={(id) => setCart(cart.filter(i => i.id !== id))} onContinueShopping={handleGoHome} onGoToCheckout={() => setView('checkout')} />;
        case 'checkout': return <CheckoutView items={cart} onPlaceOrder={handlePlaceOrder} onBackToCart={() => setView('cart')} user={currentUser} promoCodes={promoCodes} />;
        case 'order-success': return <OrderSuccessView onGoHome={handleGoHome} onGoToProfile={() => setView('profile')} />;
        default: return <Home onSelectProducts={() => setView('products')} messages={chatMessages} onSendMessage={handleSendMessage} isAiThinking={isAiThinking} products={products} materials={materials} />;
    }
  };

  const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-slate-900 text-slate-200 font-sans min-h-screen flex flex-col">
      <Header onLogoClick={handleGoHome} currentUser={currentUser} onProfileClick={() => navigateTo('profile')} onLoginClick={() => navigateTo('login')} onDashboardClick={() => navigateTo('dashboard')} />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );

  if (isLoading) {
    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    );
  }

  if (isSuperadminMode) {
      return <SuperadminView
            users={users} subscriptions={subscriptions} priceList={priceList} tariffPlans={tariffPlans} promoCodes={promoCodes} auditLog={auditLog} products={products} materials={materials} templates={templates}
            onUpdateUser={handleUpdateUser} onAddSubscription={handleAddSubscription} onUpdateSubscription={handleUpdateSubscription} onDeleteSubscription={handleDeleteSubscription}
            onPriceListUpdate={handlePriceListUpdate} onUpdateTariffPlans={(p) => p.forEach(i => api.adminUpdateTariffPlan(i.id, i))} onUpdatePromoCodes={(c) => c.forEach(i => api.adminUpdatePromoCode(i.id, i))}
            onUpdateProducts={(p) => p.forEach(i => api.adminUpdateProduct(i.id, i))} onUpdateMaterials={(m) => m.forEach(i => api.adminUpdateMaterial(i.id, i))} onUpdateTemplates={(t) => t.forEach(i => api.adminUpdateTemplate(i.id, i))}
            onLogAction={() => {}} onLogout={handleLogout}
        />;
  }
  
  if (!currentUser) {
      if (view === 'register') return <MainLayout><RegisterView onRegister={handleRegister} onGoToLogin={() => setView('login')} onBack={() => setView('login')} /></MainLayout>;
      return <MainLayout><LoginView onLogin={handleLogin} onGoToRegister={() => setView('register')} onBack={() => {}} onSuperadminLogin={handleSuperadminLogin} /></MainLayout>;
  }

  if (currentUser && !userSubscription) {
      return <SubscriptionGateView user={currentUser} onLogout={handleLogout} />;
  }

  return <MainLayout>{renderContent()}</MainLayout>;
};

export default App;
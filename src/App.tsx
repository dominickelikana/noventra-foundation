import React, { useState, useEffect } from 'react';
import { Language, Project, Donation, NewsArticle, GalleryItem, SiteSettings } from './types';
import { 
  getProjects, 
  getDonations, 
  getVolunteers, 
  getNewsArticles, 
  getGalleryItems, 
  getContactMessages, 
  getAuditLogs, 
  getSiteSettings 
} from './lib/db';
import { auth, onAuthStateChanged, logoutUser } from './lib/firebase';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Sections
import { HeroSection } from './components/home/HeroSection';
import { WelcomeSection } from './components/home/WelcomeSection';
import { ObjectivesSection } from './components/home/ObjectivesSection';
import { ProjectsSection } from './components/home/ProjectsSection';
import { NewsSection } from './components/home/NewsSection';
import { GallerySection } from './components/home/GallerySection';
import { AboutSection } from './components/home/AboutSection';
import { TransparencySection } from './components/home/TransparencySection';
import { ContactSection } from './components/home/ContactSection';

// Modals & Interactive
import { DonationModal } from './components/donation/DonationModal';
import { ReceiptModal } from './components/donation/ReceiptModal';
import { VolunteerModal } from './components/volunteer/VolunteerModal';
import { ProjectModal } from './components/projects/ProjectModal';
import { NewsModal } from './components/news/NewsModal';
import { LightboxModal } from './components/gallery/LightboxModal';
import { AIChatWidget } from './components/ai/AIChatWidget';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function App() {
  // App Language: Default English, supports Swahili
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('noventra_lang');
    return (saved === 'sw' || saved === 'en') ? saved : 'en';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('noventra_lang', lang);
  };

  // Navigation & View state
  const [activeSection, setActiveSection] = useState<string>('home');

  // Core Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [latestDonation, setLatestDonation] = useState<Donation | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  // Admin Portal state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('noventra_admin_session') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ email: string; displayName?: string } | null>(() => {
    const saved = localStorage.getItem('noventra_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Sync with live Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminLoggedIn(true);
        const userData = {
          email: user.email || 'admin@noventrafoundation.org',
          displayName: user.displayName || undefined
        };
        setAdminUser(userData);
        localStorage.setItem('noventra_admin_session', 'true');
        localStorage.setItem('noventra_admin_user', JSON.stringify(userData));
      } else {
        // If not authenticated in Firebase and no local override
        const localActive = localStorage.getItem('noventra_admin_session') === 'true';
        if (!localActive) {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load all foundation data
  const loadData = async () => {
    try {
      const [projData, donData, volData, newsData, galData, conData, logData, settsData] = await Promise.all([
        getProjects(),
        getDonations(),
        getVolunteers(),
        getNewsArticles(),
        getGalleryItems(),
        getContactMessages(),
        getAuditLogs(),
        Promise.resolve(getSiteSettings())
      ]);

      setProjects(projData);
      setDonations(donData);
      setVolunteers(volData);
      setArticles(newsData);
      setGallery(galData);
      setContacts(conData);
      setAuditLogs(logData);
      setSiteSettings(settsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`${sectionId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenDonateForProject = (project: Project) => {
    setSelectedProject(project);
    setIsDonateOpen(true);
  };

  const handleDonationSuccess = (donation: Donation) => {
    setLatestDonation(donation);
    setIsReceiptOpen(true);
    loadData();
  };

  const handleAdminLoginSuccess = (email: string, displayName?: string) => {
    setIsAdminLoggedIn(true);
    const userObj = { email, displayName };
    setAdminUser(userObj);
    localStorage.setItem('noventra_admin_session', 'true');
    localStorage.setItem('noventra_admin_user', JSON.stringify(userObj));
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Firebase logout notice:', err);
    }
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('noventra_admin_session');
    localStorage.removeItem('noventra_admin_user');
    setIsAdminDashboardOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Sticky Main Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenDonate={() => {
          setSelectedProject(null);
          setIsDonateOpen(true);
        }}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* 1. Hero Section */}
        <HeroSection
          currentLang={currentLang}
          onOpenDonate={() => {
            setSelectedProject(null);
            setIsDonateOpen(true);
          }}
          onOpenVolunteer={() => setIsVolunteerOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* 2. Official Welcome Message & Origin */}
        <div id="home-section">
          <WelcomeSection
            currentLang={currentLang}
            onNavigate={handleNavigate}
            onOpenDonate={() => {
              setSelectedProject(null);
              setIsDonateOpen(true);
            }}
          />
        </div>

        {/* 3. Core Strategic Objectives (6 Pillars) */}
        <ObjectivesSection
          currentLang={currentLang}
          onNavigate={handleNavigate}
          onOpenDonate={() => setIsDonateOpen(true)}
        />

        {/* 4. Active Projects & Real-World Initiatives */}
        <div id="projects-section">
          <ProjectsSection
            projects={projects}
            currentLang={currentLang}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onDonateToProject={handleOpenDonateForProject}
            onNavigate={handleNavigate}
          />
        </div>

        {/* 5. Organization Identity, Values & History */}
        <div id="about-section">
          <AboutSection
            currentLang={currentLang}
            siteSettings={siteSettings}
            onOpenDonate={() => setIsDonateOpen(true)}
            onOpenVolunteer={() => setIsVolunteerOpen(true)}
          />
        </div>

        {/* 6. News, Events & Field Dispatches */}
        <div id="news-section">
          <NewsSection
            articles={articles}
            currentLang={currentLang}
            onSelectArticle={(art) => setSelectedArticle(art)}
            onNavigate={handleNavigate}
          />
        </div>

        {/* 7. Field Photo Gallery */}
        <div id="gallery-section">
          <GallerySection
            items={gallery}
            currentLang={currentLang}
            onSelectItem={(item) => setSelectedGalleryItem(item)}
          />
        </div>

        {/* 8. Financial Governance & Transparency */}
        <div id="transparency-section">
          <TransparencySection
            currentLang={currentLang}
          />
        </div>

        {/* 9. Direct Contact & Office Information */}
        <div id="contact-section">
          <ContactSection
            currentLang={currentLang}
            siteSettings={siteSettings}
          />
        </div>

      </main>

      {/* Global Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        onOpenDonate={() => {
          setSelectedProject(null);
          setIsDonateOpen(true);
        }}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* AI Assistant Floating Widget */}
      <AIChatWidget
        currentLang={currentLang}
        onOpenDonate={() => {
          setSelectedProject(null);
          setIsDonateOpen(true);
        }}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
      />

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => {
          setIsDonateOpen(false);
          setSelectedProject(null);
        }}
        projects={projects}
        preSelectedProject={selectedProject}
        currentLang={currentLang}
        siteSettings={siteSettings}
        onDonationSuccess={handleDonationSuccess}
      />

      {/* Official Tax-Exempt Receipt Modal */}
      <ReceiptModal
        donation={latestDonation}
        currentLang={currentLang}
        siteSettings={siteSettings}
        onClose={() => {
          setIsReceiptOpen(false);
          setLatestDonation(null);
        }}
      />

      {/* Volunteer Application Modal */}
      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
        currentLang={currentLang}
      />

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject && !isDonateOpen ? selectedProject : null}
        currentLang={currentLang}
        onClose={() => setSelectedProject(null)}
        onDonate={handleOpenDonateForProject}
      />

      {/* News Article Modal */}
      <NewsModal
        article={selectedArticle}
        currentLang={currentLang}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Gallery Lightbox Modal */}
      <LightboxModal
        item={selectedGalleryItem}
        currentLang={currentLang}
        onClose={() => setSelectedGalleryItem(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        currentLang={currentLang}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Full Admin Dashboard Portal */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        currentLang={currentLang}
        adminUser={adminUser}
        projects={projects}
        donations={donations}
        volunteers={volunteers}
        articles={articles}
        gallery={gallery}
        contacts={contacts}
        auditLogs={auditLogs}
        siteSettings={siteSettings}
        onRefreshData={loadData}
        onLogout={handleAdminLogout}
      />

    </div>
  );
}
export default App;

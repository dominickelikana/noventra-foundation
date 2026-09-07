import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Project, 
  Donation, 
  VolunteerApplication, 
  NewsArticle, 
  GalleryItem, 
  ContactMessage, 
  SiteSettings, 
  AuditLog 
} from '../types';
import { 
  initialProjects, 
  initialNews, 
  initialGallery, 
  initialDonations, 
  initialSiteSettings 
} from './initialData';

// Storage Keys for Offline / Instant Fallback
const STORAGE_KEYS = {
  PROJECTS: 'noventra_projects',
  DONATIONS: 'noventra_donations',
  VOLUNTEERS: 'noventra_volunteers',
  NEWS: 'noventra_news',
  GALLERY: 'noventra_gallery',
  CONTACT: 'noventra_contact',
  SETTINGS: 'noventra_settings',
  AUDIT: 'noventra_audit',
};

// Helper to get local data
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

// Helper to set local data
function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// ==================== PROJECTS ====================

export async function fetchProjects(): Promise<Project[]> {
  try {
    const colRef = collection(db, 'projects');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setLocal(STORAGE_KEYS.PROJECTS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch projects error, using cached data:', err);
  }
  
  const local = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    setLocal(STORAGE_KEYS.PROJECTS, initialProjects);
  }
  return local;
}

export const getProjects = fetchProjects;

export async function createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
  const id = 'proj-' + Math.random().toString(36).substring(2, 9);
  const newProject: Project = { id, ...projectData };
  await saveProject(newProject);
  await logAuditAction({
    action: 'PROJECT_CREATED',
    entityType: 'Project',
    entityId: id,
    performedBy: 'Administrator',
    details: `Created project: ${newProject.title}`
  });
  return newProject;
}

export async function saveProject(project: Project): Promise<void> {
  const local = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  const index = local.findIndex(p => p.id === project.id);
  let updatedList: Project[];
  if (index >= 0) {
    updatedList = [...local];
    updatedList[index] = { ...project };
  } else {
    updatedList = [project, ...local];
  }
  setLocal(STORAGE_KEYS.PROJECTS, updatedList);

  try {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, project, { merge: true });
  } catch (err) {
    console.warn('Firestore saveProject error:', err);
  }
}

export const updateProject = saveProject;

export async function deleteProject(id: string): Promise<void> {
  const local = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  const filtered = local.filter(p => p.id !== id);
  setLocal(STORAGE_KEYS.PROJECTS, filtered);

  try {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteProject error:', err);
  }

  await logAuditAction({
    action: 'PROJECT_DELETED',
    entityType: 'Project',
    entityId: id,
    performedBy: 'Administrator',
    details: `Deleted project with ID: ${id}`
  });
}

// ==================== DONATIONS ====================

export async function fetchDonations(): Promise<Donation[]> {
  try {
    const colRef = collection(db, 'donations');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Donation));
      setLocal(STORAGE_KEYS.DONATIONS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch donations error:', err);
  }

  const local = getLocal<Donation[]>(STORAGE_KEYS.DONATIONS, initialDonations);
  if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
    setLocal(STORAGE_KEYS.DONATIONS, initialDonations);
  }
  return local;
}

export const getDonations = fetchDonations;

export async function createDonation(donation: Omit<Donation, 'id'>): Promise<Donation> {
  const id = 'don-' + Math.random().toString(36).substring(2, 9);
  const newDonation: Donation = { id, ...donation };

  const local = getLocal<Donation[]>(STORAGE_KEYS.DONATIONS, initialDonations);
  const updatedList = [newDonation, ...local];
  setLocal(STORAGE_KEYS.DONATIONS, updatedList);

  // If financial donation completed and has a project, update project amountRaised
  if (newDonation.amount && newDonation.status === 'completed' && newDonation.projectId) {
    const projects = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const pIndex = projects.findIndex(p => p.id === newDonation.projectId);
    if (pIndex >= 0) {
      projects[pIndex].amountRaised += newDonation.amount;
      setLocal(STORAGE_KEYS.PROJECTS, projects);
      saveProject(projects[pIndex]).catch(console.error);
    }
  }

  try {
    const docRef = doc(db, 'donations', id);
    await setDoc(docRef, newDonation);
  } catch (err) {
    console.warn('Firestore createDonation error:', err);
  }

  await logAuditAction({
    action: 'DONATION_CREATED',
    entityType: 'Donation',
    entityId: id,
    performedBy: newDonation.isAnonymous ? 'Anonymous Donor' : newDonation.donorName,
    details: `Donation of ${newDonation.amount || 'In-Kind'} ${newDonation.currency} received (${newDonation.paymentMethod || newDonation.donationType})`
  });

  return newDonation;
}

export async function updateDonationStatus(id: string, status: Donation['status']): Promise<void> {
  const local = getLocal<Donation[]>(STORAGE_KEYS.DONATIONS, initialDonations);
  const index = local.findIndex(d => d.id === id);
  if (index >= 0) {
    local[index].status = status;
    if (status === 'completed' && !local[index].completedAt) {
      local[index].completedAt = new Date().toISOString();
    }
    setLocal(STORAGE_KEYS.DONATIONS, local);

    try {
      const docRef = doc(db, 'donations', id);
      await updateDoc(docRef, { 
        status, 
        completedAt: local[index].completedAt || new Date().toISOString() 
      });
    } catch (err) {
      console.warn('Firestore updateDonationStatus error:', err);
    }

    await logAuditAction({
      action: 'DONATION_STATUS_UPDATED',
      entityType: 'Donation',
      entityId: id,
      performedBy: 'Administrator',
      details: `Donation status updated to ${status}`
    });
  }
}

// ==================== VOLUNTEERS ====================

export async function fetchVolunteers(): Promise<VolunteerApplication[]> {
  try {
    const colRef = collection(db, 'volunteers');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as VolunteerApplication));
      setLocal(STORAGE_KEYS.VOLUNTEERS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch volunteers error:', err);
  }

  return getLocal<VolunteerApplication[]>(STORAGE_KEYS.VOLUNTEERS, [
    {
      id: 'vol-1',
      applicationCode: 'NOV-VOL-7821',
      fullName: 'Juma Hassan Rashidi',
      email: 'juma.rashidi@example.com',
      phone: '+255 754 332 211',
      dateOfBirth: '1998-05-14',
      gender: 'male',
      location: 'Dar es Salaam (Kinondoni)',
      occupation: 'Registered Nurse / Public Health Specialist',
      skills: ['First Aid', 'Patient Screening', 'Swahili/English Translation', 'Community Mobilization'],
      areasOfInterest: ['healthcare', 'emergency_response'],
      availability: 'weekends',
      motivation: 'I want to volunteer my medical skills during weekend free camps to help mothers and elderly citizens in rural villages.',
      emergencyContact: {
        name: 'Fatma Rashidi',
        relationship: 'Sister',
        phone: '+255 713 001 928'
      },
      consentAgreed: true,
      status: 'approved',
      createdAt: '2026-02-18T10:00:00Z',
      reviewedAt: '2026-02-19T09:00:00Z',
      reviewedBy: 'Admin Team'
    },
    {
      id: 'vol-2',
      applicationCode: 'NOV-VOL-7822',
      fullName: 'Theresia Charles Mushi',
      email: 'theresia.mushi@example.com',
      phone: '+255 768 445 566',
      dateOfBirth: '2001-11-20',
      gender: 'female',
      location: 'Dodoma Urban',
      occupation: 'Secondary School Science Teacher',
      skills: ['Teaching Mathematics', 'Computer Literacy', 'Event Planning'],
      areasOfInterest: ['education', 'women_youth'],
      availability: 'weekdays',
      motivation: 'Educating underprivileged kids gives them an equal ladder to succeed. I want to tutor kids at orphan centers.',
      emergencyContact: {
        name: 'Charles Mushi',
        relationship: 'Father',
        phone: '+255 754 887 766'
      },
      consentAgreed: true,
      status: 'pending',
      createdAt: '2026-02-23T12:30:00Z'
    }
  ]);
}

export const getVolunteers = fetchVolunteers;

export async function submitVolunteerApplication(app: Omit<VolunteerApplication, 'id' | 'applicationCode' | 'status' | 'createdAt'>): Promise<VolunteerApplication> {
  const id = 'vol-' + Math.random().toString(36).substring(2, 9);
  const applicationCode = 'NOV-VOL-' + Math.floor(1000 + Math.random() * 9000);
  const fullApp: VolunteerApplication = {
    id,
    applicationCode,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...app,
  };

  const local = getLocal<VolunteerApplication[]>(STORAGE_KEYS.VOLUNTEERS, []);
  const updatedList = [fullApp, ...local];
  setLocal(STORAGE_KEYS.VOLUNTEERS, updatedList);

  try {
    const docRef = doc(db, 'volunteers', id);
    await setDoc(docRef, fullApp);
  } catch (err) {
    console.warn('Firestore submitVolunteer error:', err);
  }

  await logAuditAction({
    action: 'VOLUNTEER_REGISTERED',
    entityType: 'Volunteer',
    entityId: id,
    performedBy: fullApp.fullName,
    details: `Volunteer application submitted by ${fullApp.fullName} (${fullApp.email})`
  });

  return fullApp;
}

export async function updateVolunteerStatus(id: string, status: VolunteerApplication['status'], notes?: string): Promise<void> {
  const local = getLocal<VolunteerApplication[]>(STORAGE_KEYS.VOLUNTEERS, []);
  const index = local.findIndex(v => v.id === id);
  if (index >= 0) {
    local[index].status = status;
    local[index].reviewedAt = new Date().toISOString();
    local[index].reviewedBy = 'Authorized Admin';
    if (notes) local[index].notes = notes;
    setLocal(STORAGE_KEYS.VOLUNTEERS, local);

    try {
      const docRef = doc(db, 'volunteers', id);
      await updateDoc(docRef, {
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Authorized Admin',
        ...(notes ? { notes } : {})
      });
    } catch (err) {
      console.warn('Firestore updateVolunteerStatus error:', err);
    }

    await logAuditAction({
      action: 'VOLUNTEER_STATUS_UPDATED',
      entityType: 'Volunteer',
      entityId: id,
      performedBy: 'Administrator',
      details: `Volunteer status for ${local[index].fullName} updated to ${status}`
    });
  }
}

// ==================== NEWS & ARTICLES ====================

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const colRef = collection(db, 'news_events');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NewsArticle));
      setLocal(STORAGE_KEYS.NEWS, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch news error:', err);
  }

  const local = getLocal<NewsArticle[]>(STORAGE_KEYS.NEWS, initialNews);
  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    setLocal(STORAGE_KEYS.NEWS, initialNews);
  }
  return local;
}

export const getNewsArticles = fetchNews;

export async function createNewsArticle(article: Omit<NewsArticle, 'id'>): Promise<NewsArticle> {
  const id = 'news-' + Math.random().toString(36).substring(2, 9);
  const fullArticle: NewsArticle = { id, ...article };
  await saveNewsArticle(fullArticle);
  return fullArticle;
}

export async function saveNewsArticle(article: NewsArticle): Promise<void> {
  const local = getLocal<NewsArticle[]>(STORAGE_KEYS.NEWS, initialNews);
  const index = local.findIndex(n => n.id === article.id);
  let updatedList: NewsArticle[];
  if (index >= 0) {
    updatedList = [...local];
    updatedList[index] = article;
  } else {
    updatedList = [article, ...local];
  }
  setLocal(STORAGE_KEYS.NEWS, updatedList);

  try {
    const docRef = doc(db, 'news_events', article.id);
    await setDoc(docRef, article, { merge: true });
  } catch (err) {
    console.warn('Firestore saveNewsArticle error:', err);
  }
}

export async function deleteNewsArticle(id: string): Promise<void> {
  const local = getLocal<NewsArticle[]>(STORAGE_KEYS.NEWS, initialNews);
  const filtered = local.filter(n => n.id !== id);
  setLocal(STORAGE_KEYS.NEWS, filtered);

  try {
    const docRef = doc(db, 'news_events', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteNewsArticle error:', err);
  }
}

// ==================== MEDIA GALLERY ====================

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  try {
    const colRef = collection(db, 'media_gallery');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
      setLocal(STORAGE_KEYS.GALLERY, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch gallery error:', err);
  }

  const local = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    setLocal(STORAGE_KEYS.GALLERY, initialGallery);
  }
  return local;
}

export const getGalleryItems = fetchGalleryItems;

export async function createGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const id = 'gal-' + Math.random().toString(36).substring(2, 9);
  const fullItem: GalleryItem = { id, ...item };
  await saveGalleryItem(fullItem);
  return fullItem;
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const local = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
  const index = local.findIndex(m => m.id === item.id);
  let updatedList: GalleryItem[];
  if (index >= 0) {
    updatedList = [...local];
    updatedList[index] = item;
  } else {
    updatedList = [item, ...local];
  }
  setLocal(STORAGE_KEYS.GALLERY, updatedList);

  try {
    const docRef = doc(db, 'media_gallery', item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (err) {
    console.warn('Firestore saveGalleryItem error:', err);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const local = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, initialGallery);
  const filtered = local.filter(m => m.id !== id);
  setLocal(STORAGE_KEYS.GALLERY, filtered);

  try {
    const docRef = doc(db, 'media_gallery', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteGalleryItem error:', err);
  }
}

// ==================== CONTACT MESSAGES ====================

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const colRef = collection(db, 'contact_messages');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
      setLocal(STORAGE_KEYS.CONTACT, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch contacts error:', err);
  }

  return getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT, [
    {
      id: 'msg-1',
      name: 'Dr. Jackson Makange',
      email: 'j.makange@tanzaniahealth.org',
      phone: '+255 755 112 233',
      subject: 'Partnership in Medical Outreach Camps',
      message: 'Greetings Noventra leadership. Our health clinic in Bagamoyo would like to offer 4 volunteer doctors and diagnostic equipment for your upcoming maternal healthcare outreach.',
      status: 'unread',
      createdAt: '2026-02-24T11:00:00Z',
    },
    {
      id: 'msg-2',
      name: 'Salome M. Ndibalema',
      email: 'salome.ndiba@gmail.com',
      phone: '+255 784 990 011',
      subject: 'Donating 500 Exercise Books & Mathematical Sets',
      message: 'Hello, we have 500 brand new exercise books and pens from our company CSR initiative. How can we arrange delivery to your Dar es Salaam headquarters?',
      status: 'replied',
      replyNotes: 'Replied with delivery guidelines and office hours. Picked up on 25 Feb.',
      createdAt: '2026-02-21T15:20:00Z',
    }
  ]);
}

export const getContactMessages = fetchContactMessages;

export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
  const id = 'msg-' + Math.random().toString(36).substring(2, 9);
  const newMsg: ContactMessage = {
    id,
    status: 'unread',
    createdAt: new Date().toISOString(),
    ...msg
  };

  const local = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT, []);
  const updatedList = [newMsg, ...local];
  setLocal(STORAGE_KEYS.CONTACT, updatedList);

  try {
    const docRef = doc(db, 'contact_messages', id);
    await setDoc(docRef, newMsg);
  } catch (err) {
    console.warn('Firestore submitContact error:', err);
  }

  await logAuditAction({
    action: 'CONTACT_MESSAGE_RECEIVED',
    entityType: 'ContactMessage',
    entityId: id,
    performedBy: newMsg.name,
    details: `Inquiry received from ${newMsg.name} (${newMsg.email}) regarding: "${newMsg.subject}"`
  });

  return newMsg;
}

export async function updateContactStatus(id: string, status: ContactMessage['status'], replyNotes?: string): Promise<void> {
  const local = getLocal<ContactMessage[]>(STORAGE_KEYS.CONTACT, []);
  const index = local.findIndex(m => m.id === id);
  if (index >= 0) {
    local[index].status = status;
    if (replyNotes) local[index].replyNotes = replyNotes;
    setLocal(STORAGE_KEYS.CONTACT, local);

    try {
      const docRef = doc(db, 'contact_messages', id);
      await updateDoc(docRef, {
        status,
        ...(replyNotes ? { replyNotes } : {})
      });
    } catch (err) {
      console.warn('Firestore updateContactStatus error:', err);
    }
  }
}

// ==================== SITE SETTINGS ====================

export function getSiteSettings(): SiteSettings {
  const local = getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSiteSettings);
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setLocal(STORAGE_KEYS.SETTINGS, initialSiteSettings);
  }
  return local;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'site_settings', 'default');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = { id: snap.id, ...snap.data() } as SiteSettings;
      setLocal(STORAGE_KEYS.SETTINGS, data);
      return data;
    }
  } catch (err) {
    console.warn('Firestore fetch settings error:', err);
  }

  return getSiteSettings();
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const updated = { ...settings, updatedAt: new Date().toISOString() };
  setLocal(STORAGE_KEYS.SETTINGS, updated);

  try {
    const docRef = doc(db, 'site_settings', 'default');
    await setDoc(docRef, updated, { merge: true });
  } catch (err) {
    console.warn('Firestore saveSiteSettings error:', err);
  }

  await logAuditAction({
    action: 'SETTINGS_UPDATED',
    entityType: 'SiteSettings',
    entityId: 'default',
    performedBy: 'Administrator',
    details: 'Foundation settings & Tanzanian payment accounts updated'
  });
}

// ==================== AUDIT LOGS ====================

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const colRef = collection(db, 'audit_logs');
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
      setLocal(STORAGE_KEYS.AUDIT, list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch audit logs error:', err);
  }

  return getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT, [
    {
      id: 'log-1',
      action: 'SYSTEM_BOOT',
      entityType: 'System',
      entityId: 'root',
      performedBy: 'system@noventrafoundation.org',
      details: 'Noventra Foundation database & secure backend initialized',
      timestamp: '2026-02-25T08:00:00Z',
    },
    {
      id: 'log-2',
      action: 'DONATION_VERIFIED',
      entityType: 'Donation',
      entityId: 'don-1',
      performedBy: 'finance@noventrafoundation.org',
      details: 'M-Pesa payment receipt verified for Bright Futures project',
      timestamp: '2026-02-25T09:30:00Z',
    }
  ]);
}

export const getAuditLogs = fetchAuditLogs;

export async function logAuditAction(entry: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
  const id = 'log-' + Math.random().toString(36).substring(2, 9);
  const fullLog: AuditLog = {
    id,
    timestamp: new Date().toISOString(),
    performedBy: entry.performedBy || 'admin@noventrafoundation.org',
    ...entry
  };

  const local = getLocal<AuditLog[]>(STORAGE_KEYS.AUDIT, []);
  const updatedList = [fullLog, ...local.slice(0, 49)];
  setLocal(STORAGE_KEYS.AUDIT, updatedList);

  try {
    const docRef = doc(db, 'audit_logs', id);
    await setDoc(docRef, fullLog);
  } catch (err) {
    console.warn('Firestore logAuditAction error:', err);
  }
}

export const addAuditLog = logAuditAction;

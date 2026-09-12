import { Project, NewsArticle, MediaItem, SiteSettings, Donation } from '../types';

export const initialSiteSettings: SiteSettings = {
  id: 'default',
  organizationName: 'Noventra Charity Foundation',
  taglineEn: 'Restoring Hope. Transforming Lives.',
  taglineSw: 'Kurejesha Matumaini. Kubadilisha Maisha.',
  foundedDate: '14 July 2025',
  phone: '+255 754 889 900',
  phoneAlt: '+255 22 277 4500',
  email: 'info@noventrafoundation.org',
  address: 'Plot 42, Noventra House, New Bagamoyo Road, Victoria Area',
  city: 'Dar es Salaam',
  country: 'Tanzania',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126744.15655787679!2d39.2083284!3d-6.792354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4c1a55555555%3A0x6b77209a5b33e144!2sDar%20es%20Salaam%2C%20Tanzania!5e0!3m2!1sen!2stz!4v1700000000000!5m2!1sen!2stz',
  socialLinks: {
    instagram: 'https://instagram.com/noventra_foundation?igsi=dWR5aG5iNWx4czFs&utm_source=qr',
    tiktok: 'https://www.tiktok.com/@noventra.foundation?_r=1&_t=ZS-9996OPDc4d'
  },
  paymentAccounts: {
    mpesaNumber: '0754 889 900 (Lipa Namba: 5678901)',
    mpesaName: 'Noventra Charity Foundation',
    tigopesaNumber: '0714 889 900 (Lipa Namba: 6789012)',
    tigopesaName: 'Noventra Foundation Tanz',
    airtelNumber: '0784 889 900 (Lipa Namba: 7890123)',
    airtelName: 'Noventra Charity Fund',
    halopesaNumber: '0624 889 900',
    halopesaName: 'Noventra Foundation',
    bankName: 'CRDB Bank Plc & NMB Bank Plc',
    bankAccountName: 'Noventra Charity Foundation Trust',
    bankAccountNumber: 'CRDB: 0150889900100 (TZS) | NMB: 2011008899002 (USD)',
    bankBranch: 'Tower Branch, Dar es Salaam',
    swiftCode: 'CORUTZTZXXX',
  },
  aiEnabled: true,
  updatedAt: new Date().toISOString(),
};

export const initialProjects: Project[] = [
  {
    id: 'proj-edu-1',
    title: 'Bright Futures: Education Support & Scholarships',
    titleSw: 'Mustakabali Mwema: Ufadhili wa Masomo na Vifaa vya Shule',
    slug: 'bright-futures-education-support',
    category: 'education',
    description: 'Providing comprehensive academic scholarships, uniforms, textbooks, digital literacy labs, and daily nutritious school meals to 1,200 vulnerable primary and secondary students across rural and semi-urban communities in Tanzania.',
    descriptionSw: 'Kutoa ufadhili kamili wa masomo, sare za shule, vitabu vya kiada, maabara za TEHAMA na chakula cha mchana shuleni kwa wanafunzi 1,200 wenye uhitaji vijijini na pembezoni mwa miji nchini Tanzania.',
    location: 'Dodoma & Morogoro Regions',
    startDate: '2025-08-01',
    endDate: '2026-12-31',
    status: 'active',
    targetAmount: 45000000, // 45M TZS
    amountRaised: 31250000,
    currency: 'TZS',
    featuredImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop',
    ],
    beneficiariesCount: 1200,
    impactMetrics: [
      { label: 'Students Sponsored', labelSw: 'Wanafunzi Waliofadhiliwa', value: '1,200' },
      { label: 'Classrooms Renovated', labelSw: 'Madarasa Yaliyokarabatiwa', value: '14' },
      { label: 'Textbooks Distributed', labelSw: 'Vitabu Vilivyogawiwa', value: '4,500' }
    ],
    createdAt: '2025-07-20T08:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'proj-health-2',
    title: 'Mama & Mtoto: Community Health Outreach Camps',
    titleSw: 'Mama na Mtoto: Kambi za Afya ya Jamii na Uzazi Salama',
    slug: 'mama-mtoto-health-camps',
    category: 'healthcare',
    description: 'Delivering mobile medical clinics, free cervical & breast cancer screenings, pediatric vaccinations, maternal care packages, and essential medicine distributions to underserved peri-urban communities.',
    descriptionSw: 'Kufikisha huduma za kambi za afya za bure, uchunguzi wa saratani, chanjo za watoto, vifaa vya uzazi salama na dawa muhimu kwa wananchi wasio na uwezo wa kumudu gharama za hospitali.',
    location: 'Tanga & Coast (Pwani) Regions',
    startDate: '2025-08-15',
    status: 'active',
    targetAmount: 38000000,
    amountRaised: 26400000,
    currency: 'TZS',
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop'
    ],
    beneficiariesCount: 3800,
    impactMetrics: [
      { label: 'Patients Treated Free', labelSw: 'Wagonjwa Waliotibiwa Bure', value: '3,800' },
      { label: 'Mothers Assisted', labelSw: 'Akina Mama Waliosaidiwa', value: '950' },
      { label: 'Free Medical Camps', labelSw: 'Kambi za Afya Zilizofanyika', value: '18' }
    ],
    createdAt: '2025-07-22T08:00:00Z',
    updatedAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'proj-orphans-3',
    title: 'Haven of Hope: Orphan & Vulnerable Children Care',
    titleSw: 'Kimbilio la Matumaini: Msaada kwa Watoto Yatima na Wenye Mazingira Magumu',
    slug: 'haven-of-hope-orphan-care',
    category: 'orphans',
    description: 'Providing safe shelter infrastructure, nutritional food baskets, psychological counseling, bedding, and vocational life-skills for children living in orphanage centers and foster families.',
    descriptionSw: 'Kuboresha miundombinu ya vituo vya watoto yatima, kugawa vifurushi vya lishe, magodoro, mavazi, na kutoa msaada wa kisaikolojia na mafunzo ya maisha.',
    location: 'Dar es Salaam & Arusha',
    startDate: '2025-09-01',
    status: 'active',
    targetAmount: 50000000,
    amountRaised: 38700000,
    currency: 'TZS',
    featuredImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop'
    ],
    beneficiariesCount: 650,
    impactMetrics: [
      { label: 'Children Supported', labelSw: 'Watoto Wanaohudumiwa', value: '650' },
      { label: 'Orphanage Centers Partnered', labelSw: 'Vituo Vilivyowezeshwa', value: '8' },
      { label: 'Monthly Food Packages', labelSw: 'Vifurushi vya Lishe Kila Mwezi', value: '650' }
    ],
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2026-02-12T14:00:00Z',
  },
  {
    id: 'proj-empower-4',
    title: 'Inuka: Women & Youth Entrepreneurship Incubator',
    titleSw: 'Inuka: Mafunzo ya Ujasiriamali na Mitaji kwa Wanawake & Vijana',
    slug: 'inuka-women-youth-empowerment',
    category: 'women_youth',
    description: 'Empowering young women and youth through tailoring, bakery & food processing, solar maintenance, soap manufacturing training, combined with seed micro-grants and financial literacy tools.',
    descriptionSw: 'Kuwezesha wanawake na vijana kupitia mafunzo ya ufundi cherehani, usindikaji wa vyakula, ufundi sola, utengenezaji sabuni pamoja na mitaji midogo ya kuanzia biashara.',
    location: 'Mwanza, Mbeya & Dar es Salaam',
    startDate: '2025-09-15',
    status: 'active',
    targetAmount: 30000000,
    amountRaised: 21500000,
    currency: 'TZS',
    featuredImage: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
    ],
    beneficiariesCount: 820,
    impactMetrics: [
      { label: 'Women Trained', labelSw: 'Wanawake Waliohitimu', value: '520' },
      { label: 'Youth Businesses Launched', labelSw: 'Biashara Mpya Zilizofunguliwa', value: '185' },
      { label: 'Seed Grants Awarded', labelSw: 'Mitaji Iliyotolewa', value: '75' }
    ],
    createdAt: '2025-08-10T10:00:00Z',
    updatedAt: '2026-02-01T15:00:00Z',
  },
  {
    id: 'proj-env-5',
    title: 'Green Roots: 100,000 Tree Planting & Clean Water Initiative',
    titleSw: 'Mizizi ya Kijani: Upandaji Miti 100,000 na Uhifadhi Vyanzo vya Maji',
    slug: 'green-roots-environmental-conservation',
    category: 'environment',
    description: 'Combating deforestation, soil erosion, and climate vulnerability by planting 100,000 indigenous and fruit trees in school compounds and degraded catchment basins, while safeguarding freshwater springs.',
    descriptionSw: 'Kukabiliana na ukataji miti na mabadiliko ya tabianchi kwa kupanda miti 100,000 ya matunda na asili kwenye shule na vyanzo vya maji, huku tukilinda chemchemi za maji safi.',
    location: 'Kilimanjaro, Iringa & Morogoro',
    startDate: '2025-10-01',
    status: 'active',
    targetAmount: 25000000,
    amountRaised: 18900000,
    currency: 'TZS',
    featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop'
    ],
    beneficiariesCount: 15000,
    impactMetrics: [
      { label: 'Trees Planted', labelSw: 'Miti Iliyopandwa', value: '42,500' },
      { label: 'Water Sources Protected', labelSw: 'Vyanzo vya Maji Vilivyolindwa', value: '12' },
      { label: 'Eco-Clubs Established', labelSw: 'Vilabu vya Mazingira Mashuleni', value: '30' }
    ],
    createdAt: '2025-08-20T11:00:00Z',
    updatedAt: '2026-02-18T16:00:00Z',
  },
  {
    id: 'proj-relief-6',
    title: 'Swift Relief: Emergency Flood & Drought Response',
    titleSw: 'Msaada wa Haraka: Misaada ya Dharura ya Mafuriko na Ukame',
    slug: 'swift-relief-emergency-response',
    category: 'emergency',
    description: 'Rapid response humanitarian assistance providing clean drinking water, temporary family shelter tents, emergency high-nutrition rations, hygiene dignity kits, and blanket distributions.',
    descriptionSw: 'Kutoa huduma ya haraka ya kibinadamu kwa majanga ya mafuriko na ukame ikijumuisha maji safi, mahema ya dharura, chakula chenye lishe na vifaa vya usafi.',
    location: 'Rufiji Basin & Lake Zone',
    startDate: '2025-11-01',
    status: 'active',
    targetAmount: 40000000,
    amountRaised: 33400000,
    currency: 'TZS',
    featuredImage: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1000&auto=format&fit=crop',
    gallery: [],
    beneficiariesCount: 4500,
    impactMetrics: [
      { label: 'Emergency Rations Delivered', labelSw: 'Vifurushi vya Chakula Vilivyotolewa', value: '1,400' },
      { label: 'Clean Water Treated (Liters)', labelSw: 'Lita za Maji Safi Yaliyosafishwa', value: '150,000' }
    ],
    createdAt: '2025-09-01T12:00:00Z',
    updatedAt: '2026-02-14T09:00:00Z',
  }
];

export const initialNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Noventra Foundation Marks Milestone: 1,200 Students Supported in 2025/2026 Academic Year',
    titleSw: 'Noventra Foundation Yafikia Mafanikio: Wanafunzi 1,200 Wapata Ufadhili wa Masomo Mwaka 2025/2026',
    slug: 'noventra-1200-students-education-milestone',
    summary: 'Through the generosity of our community donors, over 1,200 pupils received complete stationery sets, textbooks, and tuition assistance.',
    summarySw: 'Kupitia michango ya wadau na wafadhili wetu, zaidi ya wanafunzi 1,200 wamepokea sare, vitabu na ada ya masomo.',
    content: 'On 14 July 2025, Noventra Charity Foundation was established with a singular mission: restoring hope where it was fading. Today, we celebrate our education initiative reaching over 1,200 bright young minds across 14 public primary schools in Dodoma and Morogoro regions. With each school bag distributed, we plant the seeds of self-reliance, leadership, and long-term societal growth.',
    contentSw: 'Mnamo tarehe 14 Julai 2025, Taasisi ya Noventra Charity Foundation ilianzishwa ikiwa na lengo kuu la kurejesha matumaini. Leo hii tunasherehekea kufikia wanafunzi 1,200 katika shule 14 za msingi za serikali mkoani Dodoma na Morogoro. Kila begi la shule tunalokabidhi ni mbegu ya uongozi na maendeleo kwa jamii.',
    featuredImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop',
    author: 'Noventra Communications Team',
    category: 'story',
    eventDate: '2026-02-10',
    location: 'Dodoma, Tanzania',
    publishedDate: '2026-02-12',
    status: 'published',
    tags: ['Education', 'Scholarships', 'Dodoma', 'Community'],
    createdAt: '2026-02-12T08:00:00Z',
  },
  {
    id: 'news-2',
    title: 'Free Community Health Camp in Tanga Treats Over 850 Women & Children in 3 Days',
    titleSw: 'Kambi ya Afya ya Bure Tanga Yawahudumia Akina Mama na Watoto Zaidi ya 850 Ndani ya Siku 3',
    slug: 'free-health-camp-tanga-850-treated',
    summary: 'Volunteer doctors, nurses, and lab technicians united to provide free screenings, pediatric care, and medical prescriptions.',
    summarySw: 'Madaktari, wauguzi na wataalamu wa maabara walijitolea kutoa uchunguzi wa bure, matibabu ya watoto na dawa.',
    content: 'Lack of accessible medical clinics in remote villages remains a barrier to maternal and child wellbeing. Over the past weekend, Noventra Foundation deployed its mobile medical team to Muheza, Tanga, screening over 850 patients for maternal ailments, malaria, diabetes, hypertension, and providing free pharmaceuticals.',
    contentSw: 'Uhaba wa vituo vya afya vijijini umekuwa changamoto kubwa kwa afya ya akina mama na watoto. Mwishoni mwa wiki, timu ya madaktari wa kujitolea wa Noventra ilifika Muheza, Tanga, ikipima na kutoa matibabu bure kwa wagonjwa 850.',
    featuredImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop',
    author: 'Dr. Neema Mushi (Head of Health Programs)',
    category: 'event',
    eventDate: '2026-01-28',
    location: 'Muheza, Tanga',
    publishedDate: '2026-01-30',
    status: 'published',
    tags: ['Healthcare', 'Maternal Health', 'Tanga', 'Outreach'],
    createdAt: '2026-01-30T09:00:00Z',
  },
  {
    id: 'news-3',
    title: 'Green Roots Campaign: Over 40,000 Trees Planted on the Slopes of Mt. Kilimanjaro',
    titleSw: 'Kampeni ya Mizizi ya Kijani: Zaidi ya Miti 40,000 Yapandwa Miteremko ya Mlima Kilimanjaro',
    slug: 'green-roots-kilimanjaro-tree-planting',
    summary: 'Community youth, school environment clubs, and regional leaders joined hands to protect water catchment areas.',
    summarySw: 'Vijana wa jamii, vilabu vya mazingira mashuleni na viongozi walishirikiana kulinda vyanzo vya maji safi.',
    content: 'Climate resilience begins at the roots. Under our Green Roots Environmental Conservation project, Noventra Foundation mobilized 400 volunteers and school pupils to plant indigenous tree species across critical water catchment belts in Hai District.',
    contentSw: 'Uhifadhi wa mazingira unaanza kwenye mizizi. Chini ya mradi wetu wa Mizizi ya Kijani, Noventra ilikusanya wajitoleaji 400 na wanafunzi kupanda miti asili kwenye vyanzo vya maji Wilaya ya Hai.',
    featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
    author: 'Environmental Desk',
    category: 'update',
    eventDate: '2026-02-05',
    location: 'Moshi / Hai District',
    publishedDate: '2026-02-08',
    status: 'published',
    tags: ['Environment', 'Climate Action', 'Tree Planting'],
    createdAt: '2026-02-08T10:00:00Z',
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: 'med-1',
    title: 'School Supplies Distribution in Dodoma',
    titleSw: 'Ugawaji wa Vifaa vya Shule Dodoma',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop',
    category: 'education',
    createdAt: '2026-01-15T00:00:00Z'
  },
  {
    id: 'med-2',
    title: 'Maternal Healthcare Clinic in Action',
    titleSw: 'Kambi ya Afya ya Uzazi Kazini',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop',
    category: 'healthcare',
    createdAt: '2026-01-20T00:00:00Z'
  },
  {
    id: 'med-3',
    title: 'Nutritious Meal Service for Orphaned Children',
    titleSw: 'Mlo wa Lishe Bora kwa Watoto Yatima',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop',
    category: 'orphans',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'med-4',
    title: 'Women Tailoring & Vocational Training Workshop',
    titleSw: 'Warsha ya Mafunzo ya Ushonaji kwa Wanawake',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1000&auto=format&fit=crop',
    category: 'women_youth',
    createdAt: '2026-02-05T00:00:00Z'
  },
  {
    id: 'med-5',
    title: 'Tree Planting with Community Youth in Hai',
    titleSw: 'Upandaji Miti na Vijana wa Jamii Hai',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
    category: 'environment',
    createdAt: '2026-02-08T00:00:00Z'
  },
  {
    id: 'med-6',
    title: 'Noventra Foundation Overview Documentary (YouTube)',
    titleSw: 'Makala ya Muhtasari wa Noventra Foundation',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop',
    category: 'general',
    createdAt: '2026-02-10T00:00:00Z'
  }
];

export const initialGallery = initialMedia;


export const initialDonations: Donation[] = [
  {
    id: 'don-1',
    receiptNumber: 'NOV-2026-00891',
    donorName: 'Erick M. Mwita',
    donorEmail: 'erick.mwita@example.com',
    donorPhone: '+255 754 123 456',
    isAnonymous: false,
    donationType: 'money',
    amount: 250000,
    currency: 'TZS',
    projectId: 'proj-edu-1',
    projectName: 'Bright Futures: Education Support',
    paymentMethod: 'mpesa',
    transactionReference: 'MP-89A7B2991X',
    status: 'completed',
    message: 'Mungu aibariki kazi nzuri ya kusaidia watoto wetu wa shule.',
    createdAt: '2026-02-20T14:30:00Z',
    completedAt: '2026-02-20T14:31:00Z',
  },
  {
    id: 'don-2',
    receiptNumber: 'NOV-2026-00892',
    donorName: 'Grace S. Massawe',
    donorEmail: 'grace.massawe@example.com',
    donorPhone: '+255 713 987 654',
    isAnonymous: false,
    donationType: 'money',
    amount: 500000,
    currency: 'TZS',
    projectId: 'proj-health-2',
    projectName: 'Mama & Mtoto Healthcare Camps',
    paymentMethod: 'tigopesa',
    transactionReference: 'TP-99218274B',
    status: 'completed',
    message: 'Dedicated to the memory of Mama Amina. Keep serving the mothers.',
    createdAt: '2026-02-22T09:15:00Z',
    completedAt: '2026-02-22T09:16:00Z',
  },
  {
    id: 'don-3',
    receiptNumber: 'NOV-2026-00893',
    donorName: 'Anonymous Supporter',
    donorEmail: 'supporter@charityworld.org',
    donorPhone: '+1 415 555 0192',
    isAnonymous: true,
    donationType: 'money',
    amount: 1500000,
    currency: 'TZS',
    projectId: 'proj-orphans-3',
    projectName: 'Haven of Hope: Orphan Care',
    paymentMethod: 'bank_transfer',
    transactionReference: 'CRDB-TX-8830112',
    status: 'completed',
    message: 'With love from our family foundation.',
    createdAt: '2026-02-24T16:00:00Z',
    completedAt: '2026-02-24T16:05:00Z',
  }
];

export const initialTestimonials = [
  {
    id: 't-1',
    name: 'Amina Juma',
    nameSw: 'Amina Juma',
    role: 'Mother & Small Business Owner, Morogoro',
    roleSw: 'Mama Mjasiriamali, Morogoro',
    content: 'When my husband fell ill, I had no means to buy books and uniforms for my three children. Noventra Foundation took them under their scholarship program. Today, my eldest daughter is top of her class in science.',
    contentSw: 'Mume wangu alipougua, sikuwa na uwezo wa kununua vitabu na sare za shule kwa watoto wangu watatu. Noventra Foundation iliwaingiza kwenye mradi wa ufadhili. Leo binti yangu mkubwa anaongoza darasani katika masomo ya sayansi.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 't-2',
    name: 'Josephat Mtalo',
    nameSw: 'Josephat Mtalo',
    role: 'Community Elder & Village Chairman, Muheza',
    roleSw: 'Mwenyekiti wa Kijiji, Muheza',
    content: 'The free healthcare camp organized by Noventra brought specialized doctors right to our doorstep. Over 800 elderly citizens and children who could never afford hospital bills in the city were examined and given free medicine.',
    contentSw: 'Kambi ya afya ya bure iliyoandaliwa na Noventra ilileta madaktari bingwa hadi kijijini kwetu. Wazee na watoto zaidi ya 800 ambao hawakuwa na uwezo wa kwenda hospitali mjini walipimwa na kupatiwa dawa bure.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 't-3',
    name: 'Sarah K. Mdegella',
    nameSw: 'Sarah K. Mdegella',
    role: 'Lead Youth Volunteer, Dar es Salaam',
    roleSw: 'Mjitoleaji Kiongozi wa Vijana, Dar es Salaam',
    content: 'Volunteering with Noventra has given my life true purpose. Every weekend spent teaching computer literacy to orphan children shows how collective community compassion changes generations.',
    contentSw: 'Kujitolea na Noventra kumenipa maana ya kweli ya maisha. Kila wiki tunapofundisha watoto kompyuta na stadi za maisha inaonyesha nguvu kubwa ya jamii kuleta mabadiliko.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  }
];

export const initialPartners = [
  { name: 'Tanzania Red Cross Society', logo: '🏥', type: 'Health Partner' },
  { name: 'CRDB Bank Foundation', logo: '🏦', type: 'Financial Partner' },
  { name: 'National Environment Management Council (NEMC)', logo: '🌿', type: 'Ecological Ally' },
  { name: 'Vodacom Tanzania Foundation', logo: '📱', type: 'Connectivity Partner' },
  { name: 'East Africa Community Development Network', logo: '🌍', type: 'Regional Partner' },
  { name: 'University of Dar es Salaam Outreach', logo: '🎓', type: 'Academic Ally' }
];

export const leadershipTeam = [
  {
    name: 'Rev. Dr. Elikana Novatus',
    role: 'Founder & Executive Director',
    roleSw: 'Mwanzilishi & Mkurugenzi Mtendaji',
    bio: 'Dedicated community leader and humanitarian with over 15 years in grassroots social development and educational advocacy across East Africa.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Dr. Neema Mushi, MD',
    role: 'Head of Health & Medical Programs',
    roleSw: 'Mkuu wa Programu za Afya na Matibabu',
    bio: 'Specialist in public healthcare and maternal-infant health initiatives with extensive clinical field experience in underserved rural clinics.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Bernard K. Lyimo',
    role: 'Head of Finance & Operations',
    roleSw: 'Mkuu wa Fedha na Uendeshaji',
    bio: 'Certified public accountant ensuring 100% compliance, transparent audits, and strict adherence to international NGO financial standards.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Esther Mwambene',
    role: 'Volunteer & Community Coordinator',
    roleSw: 'Mratibu wa Wajitoleaji na Jamii',
    bio: 'Passionate organizer driving volunteer mobilization, youth skills mentorship, and grassroots emergency response coordination.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
  }
];

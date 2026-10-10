import { Property, WantedProperty, LandlordInquiry, LandlordVisit, TenantRecord, LocationKey } from '@/types';
import { LOCATION_SUBAREAS } from './constants';

const RAW_PROPERTIES: [
  string, // id
  string, // loc
  string, // type
  string, // bn
  string, // en
  number, // rent
  number, // beds
  number, // baths
  number, // sqft
  string, // furn
  string, // avail
  number, // daysAgo
  number, // advMonths
  string, // amen
  string, // cond
  number, // seed
  number, // featured
  number, // landlord
  string, // status
  string  // owner
][] = [
  ['p1','banasree','family','বনশ্রীতে খোলামেলা ৩ বেডরুমের ফ্ল্যাট','Airy 3-bedroom flat in Banasree',28000,3,3,1350,'semi','2026-11-01',2,2,'lift,gen,gas,sec,park,cctv','fam,nopets,lease12,utilsep',11,1,0,'active','me'],
  ['p2','mirpur','family','মিরপুর-১০ এ সুবিধাজনক ২ বেডরুমের ফ্ল্যাট','Convenient 2-bedroom flat near Mirpur-10',22000,2,2,1050,'unfurn','2026-10-25',1,2,'lift,gen,gas,sec,balcony','fam,lease12,utilsep',22,1,1,'active',''],
  ['p3','uttara','family','উত্তরা সেক্টর-১১ এ আধুনিক ৩ বেডরুমের অ্যাপার্টমেন্ট','Modern 3-bedroom apartment in Uttara Sector 11',38000,3,3,1500,'semi','2026-11-15',4,3,'lift,gen,gas,sec,park,cctv,ac,roof','fam,nosmoke,lease12,id',33,1,2,'active',''],
  ['p4','rampura','bachelor','রামপুরায় ব্যাচেলরদের জন্য ২ বেডরুমের বাসা','2-bedroom bachelor flat in Rampura',15000,2,1,820,'unfurn','now',3,2,'gas,water,balcony','bach,male,nosmoke,lease6',44,1,3,'active','me'],
  ['p5','mohammadpur','family','মোহাম্মদপুর টাউন হলের কাছে ৩ বেডরুমের ফ্ল্যাট','3-bedroom flat near Town Hall, Mohammadpur',30000,3,2,1250,'semi','2026-12-01',6,2,'lift,gen,gas,sec,fridge,balcony','fam,nopets,lease12',55,1,4,'active',''],
  ['p6','bashundhara','family','বসুন্ধরা ব্লক-ডি তে প্রশস্ত ৪ বেডরুমের ফ্ল্যাট','Spacious 4-bedroom flat in Bashundhara Block D',65000,4,4,2100,'furn','2026-11-10',5,3,'lift,gen,gas,sec,park,cctv,ac,gym,roof','fam,nosmoke,lease12,svc,id',66,1,5,'active',''],
  ['p7','banasree','room','বনশ্রী ব্লক-বি তে একক রুম ভাড়া','Single room for rent in Banasree Block B',6500,1,1,180,'semi','now',0,1,'gas,water,wifi','male,nosmoke,lease6',77,0,0,'active','me'],
  ['p8','mirpur','sublet','মিরপুর-১২ তে ফার্নিশড সাবলেট','Furnished sublet in Mirpur-12',9000,1,1,300,'furn','2026-10-20',1,1,'gas,wifi,fridge,ac','female,nosmoke,lease6,svc',88,0,1,'active',''],
  ['p9','uttara','studio','উত্তরা সেক্টর-৪ এ কমপ্যাক্ট স্টুডিও অ্যাপার্টমেন্ট','Compact studio apartment in Uttara Sector 4',24000,1,1,480,'furn','now',0,2,'lift,gen,sec,ac,wifi,fridge,kitchen','nopets,lease12,svc',99,0,2,'active',''],
  ['p10','rampura','family','রামপুরা হাজীপাড়ায় ২ বেডরুমের পারিবারিক ফ্ল্যাট','2-bedroom family flat in Hajipara, Rampura',18500,2,2,980,'unfurn','2026-11-05',2,2,'lift,gas,water,balcony','fam,lease12,utilsep',110,0,3,'active','me'],
  ['p11','mohammadpur','bachelor','আদাবরে ৩ বেডরুমের শেয়ার্ড ব্যাচেলর বাসা','Shared 3-bedroom bachelor flat in Adabor',21000,3,2,1100,'unfurn','now',3,2,'gas,water,balcony,mosque','bach,male,nopets,lease6',121,0,4,'active',''],
  ['p12','mirpur','office','মিরপুর-১০ এ ছোট অফিস স্পেস','Small office space in Mirpur-10',35000,0,1,900,'unfurn','2026-11-01',7,3,'lift,gen,sec,park,cctv,wifi','lease12,utilsep',132,0,5,'active',''],
  ['p13','uttara','sublet','উত্তরা সেক্টর-৭ এ সেমি-ফার্নিশড সাবলেট','Semi-furnished sublet in Uttara Sector 7',11000,1,1,260,'semi','2026-10-30',0,1,'gas,wifi,water','female,nosmoke,lease6',143,0,1,'active',''],
  ['p14','mohammadpur','room','বসিলায় সাশ্রয়ী রুম ভাড়া','Budget room for rent in Basila',5500,1,1,150,'unfurn','now',1,1,'gas,water','male,lease6,utilsep',154,0,2,'active',''],
  ['p15','bashundhara','studio','বসুন্ধরা ব্লক-এ তে আধুনিক স্টুডিও','Modern studio in Bashundhara Block A',27000,1,1,520,'furn','2026-11-20',2,2,'lift,gen,sec,ac,wifi,gym,kitchen','nopets,lease12',165,0,3,'active',''],
  ['p16','banasree','bachelor','বনশ্রী ব্লক-ডি তে ২ বেডরুমের ব্যাচেলর ফ্ল্যাট','2-bedroom bachelor flat in Banasree Block D',17000,2,2,900,'semi','now',1,2,'gas,water,wifi,balcony','bach,nosmoke,lease6',176,0,4,'active',''],
  ['q1','banasree','family','বনশ্রী ব্লক-সি তে নতুন ৩ বেডরুমের ফ্ল্যাট (জমা দেওয়া)','New 3-bedroom flat, Banasree Block C (submitted)',32000,3,3,1400,'semi','2026-12-05',0,2,'lift,gen,gas,sec,park','fam,lease12',187,0,0,'pending','me'],
  ['q2','rampura','room','রামপুরায় রুম ভাড়া (ছবি অস্পষ্ট)','Room in Rampura (photos unclear)',7000,1,1,170,'unfurn','now',3,1,'gas,water','male,lease6',198,0,1,'rejected','me'],
  ['q3','uttara','family','উত্তরা সেক্টর-১২ তে ২ বেডরুমের ফ্ল্যাট (খসড়া)','2-bedroom flat in Uttara Sector 12 (draft)',26000,2,2,1100,'unfurn','2026-12-15',0,2,'lift,gas,sec','fam,lease12',209,0,2,'draft','me'],
  ['q4','mirpur','bachelor','মিরপুর-১২ তে ব্যাচেলর বাসা','Bachelor flat in Mirpur-12',16000,2,1,800,'unfurn','2026-11-12',0,2,'gas,water','bach,lease6',220,0,3,'pending',''],
  ['q5','mohammadpur','studio','মোহাম্মদপুরে স্টুডিও ফ্ল্যাট','Studio flat in Mohammadpur',19500,1,1,430,'semi','2026-11-18',0,2,'lift,sec,wifi','nopets,lease12',231,0,4,'pending','']
];

const PROPERTY_DESCRIPTIONS: Record<string, (sub: [string, string], loc: [string, string]) => [string, string]> = {
  family: (sub, loc) => [
    `${sub[0]}, ${loc[0]} এলাকার শান্ত পরিবেশে অবস্থিত এই ফ্ল্যাটে প্রাকৃতিক আলো-বাতাস ভালো আসে। কাছেই বাজার, স্কুল ও গণপরিবহনের সুবিধা আছে। ছোট ও মাঝারি পরিবারের জন্য উপযোগী।`,
    `Set in a quiet pocket of ${sub[1]}, ${loc[1]}, this flat gets good light and cross-ventilation. Markets, schools and public transport are close by. Well suited to small and mid-sized families.`,
  ],
  bachelor: (sub, loc) => [
    `${sub[0]}, ${loc[0]}-এ অবস্থিত এই বাসাটি চাকরিজীবী ও শিক্ষার্থীদের জন্য উপযোগী। যাতায়াত সহজ এবং আশপাশে খাবারের দোকান ও মুদি দোকান রয়েছে।`,
    `Located in ${sub[1]}, ${loc[1]}, this flat suits working professionals and students. Commuting is easy, with eateries and grocery shops nearby.`,
  ],
  sublet: (sub, loc) => [
    `${sub[0]}, ${loc[0]}-এ একটি ফ্ল্যাটের একাংশ সাবলেট দেওয়া হচ্ছে। শান্ত পরিবেশ এবং নিরাপদ ভবন। ব্যক্তিগত ব্যবহারের জন্য আলাদা বাথরুম আছে।`,
    `Part of a flat in ${sub[1]}, ${loc[1]} is offered as a sublet. Quiet surroundings and a secure building, with a private bathroom.`,
  ],
  room: (sub, loc) => [
    `${sub[0]}, ${loc[0]}-এ একটি পরিষ্কার ও আলো-বাতাসপূর্ণ রুম ভাড়া দেওয়া হবে। বাজেটের মধ্যে থাকতে চাইলে ভালো বিকল্প।`,
    `A clean, well-ventilated room for rent in ${sub[1]}, ${loc[1]}. A good option if you want to stay within a tight budget.`,
  ],
  studio: (sub, loc) => [
    `${sub[0]}, ${loc[0]}-এ একক বা দম্পতির জন্য কমপ্যাক্ট স্টুডিও। ছোট রান্নার জায়গা ও আলাদা বাথরুমসহ।`,
    `A compact studio in ${sub[1]}, ${loc[1]} for a single person or a couple, with a small kitchenette and its own bathroom.`,
  ],
  office: (sub, loc) => [
    `${sub[0]}, ${loc[0]}-এ ছোট দল বা স্টার্টআপের জন্য অফিস স্পেস। প্রধান সড়কের কাছে এবং কাস্টমার আসা-যাওয়ার সুবিধা আছে।`,
    `Office space for a small team or startup in ${sub[1]}, ${loc[1]}, close to the main road for easy customer access.`,
  ],
};

export const INITIAL_PROPERTIES: Property[] = RAW_PROPERTIES.map((r, i) => {
  const [
    id, loc, type, bn, en, rent, beds, baths, sqft,
    furn, avail, days, adv, am, co, seed, feat, ll, status, owner
  ] = r;

  const locKey = loc as LocationKey;
  const subs = (LOCATION_SUBAREAS as Record<string, [string, string][]>)[loc] || [['প্রধান সড়ক', 'Main Road']];
  const sub = subs[i % subs.length];
  const locName: [string, string] = [loc, loc];

  const descGenerator = PROPERTY_DESCRIPTIONS[type] || PROPERTY_DESCRIPTIONS.family;
  const desc = descGenerator(sub, locName);

  return {
    id,
    loc: locKey,
    sub,
    type: type as Property['type'],
    title: [bn, en],
    rent,
    beds,
    baths,
    sqft,
    furn: furn as Property['furn'],
    avail,
    days,
    adv,
    amen: am.split(','),
    cond: co.split(','),
    seed,
    feat: Boolean(feat),
    ll,
    status: status as Property['status'],
    owner,
    views: 120 + ((seed * 37) % 380),
    inq: 3 + ((seed * 7) % 19),
    floor: 1 + ((i * 3) % 8),
    desc,
  };
});

export const INITIAL_WANTED: WantedProperty[] = [
  {
    id: 'w1',
    by: ['আয়েশা সিদ্দিকা', 'Ayesha Siddika'],
    loc: 'banasree',
    type: 'family',
    min: 20000,
    max: 28000,
    beds: 3,
    move: '2026-11-15',
    note: [
      'স্কুলের কাছাকাছি, লিফটসহ ভবন চাই। ছোট বাচ্চা আছে।',
      'Close to a school, in a building with a lift. We have a small child.',
    ],
    days: 1,
    status: 'active',
  },
  {
    id: 'w2',
    by: ['মাহফুজ রহমান', 'Mahfuz Rahman'],
    loc: 'mirpur',
    type: 'bachelor',
    min: 12000,
    max: 18000,
    beds: 2,
    move: '2026-11-01',
    note: [
      'অফিস মিরপুর-১০ এ, দুইজন শেয়ার করব। গ্যাস সংযোগ আবশ্যক।',
      'Office is in Mirpur-10; two of us will share. Gas connection is a must.',
    ],
    days: 2,
    status: 'active',
  },
  {
    id: 'w3',
    by: ['ফাহমিদা আক্তার', 'Fahmida Akter'],
    loc: 'uttara',
    type: 'studio',
    min: 18000,
    max: 26000,
    beds: 1,
    move: '2026-12-01',
    note: [
      'একজনের জন্য ফার্নিশড স্টুডিও, ওয়াইফাই-প্রস্তুত হলে ভালো।',
      'Furnished studio for one person; Wi-Fi ready would be great.',
    ],
    days: 3,
    status: 'active',
  },
  {
    id: 'w4',
    by: ['সাকিব হাসান', 'Sakib Hasan'],
    loc: 'mohammadpur',
    type: 'room',
    min: 4500,
    max: 7000,
    beds: 1,
    move: '2026-10-20',
    note: [
      'বিশ্ববিদ্যালয় ছাত্র, সাশ্রয়ী রুম খুঁজছি।',
      'University student looking for an affordable room.',
    ],
    days: 4,
    status: 'active',
  },
  {
    id: 'w5',
    by: ['নুসরাত জাহান', 'Nusrat Jahan'],
    loc: 'bashundhara',
    type: 'family',
    min: 45000,
    max: 70000,
    beds: 4,
    move: '2027-01-01',
    note: [
      'পার্কিংসহ বড় ফ্ল্যাট চাই, জেনারেটর সুবিধা থাকতে হবে।',
      'Need a large flat with parking and generator backup.',
    ],
    days: 5,
    status: 'active',
  },
  {
    id: 'w6',
    by: ['তাসনিম আরেফিন', 'Tasnim Arefin'],
    loc: 'rampura',
    type: 'office',
    min: 25000,
    max: 40000,
    beds: 0,
    move: '2026-11-20',
    note: [
      'ছোট ডিজাইন স্টুডিওর জন্য ৮০০–১০০০ বর্গফুটের জায়গা।',
      'Looking for 800–1000 sq ft for a small design studio.',
    ],
    days: 6,
    status: 'pending',
  },
];

export const INITIAL_LANDLORD_INQUIRIES: LandlordInquiry[] = [
  {
    id: 'li1',
    from: ['আয়েশা সিদ্দিকা', 'Ayesha Siddika'],
    prop: 'p1',
    date: '2026-10-09',
    msg: [
      'বাসাটি কি এখনো খালি আছে? ভাড়া কি কিছুটা কমানো যাবে?',
      'Is the flat still available? Is the rent negotiable?',
    ],
    status: 'new',
  },
  {
    id: 'li2',
    from: ['মাহফুজ রহমান', 'Mahfuz Rahman'],
    prop: 'p4',
    date: '2026-10-08',
    msg: [
      'আমরা দুইজন ব্যাচেলর। আগামী সপ্তাহে দেখতে চাই।',
      'We are two bachelors. Can we see it next week?',
    ],
    status: 'new',
  },
  {
    id: 'li3',
    from: ['ইমরান কবির', 'Imran Kabir'],
    prop: 'p7',
    date: '2026-10-07',
    msg: [
      'রুমের সাথে ওয়াইফাই আছে কি?',
      'Does the room come with Wi-Fi?',
    ],
    status: 'replied',
  },
  {
    id: 'li4',
    from: ['সুমাইয়া ইসলাম', 'Sumaiya Islam'],
    prop: 'p10',
    date: '2026-10-05',
    msg: [
      'অগ্রিম কত মাসের লাগবে?',
      'How many months of advance are required?',
    ],
    status: 'replied',
  },
];

export const INITIAL_LANDLORD_VISITS: LandlordVisit[] = [
  {
    id: 'lv1',
    from: ['আয়েশা সিদ্দিকা', 'Ayesha Siddika'],
    prop: 'p1',
    date: '2026-10-14',
    time: '11:00',
    status: 'pending',
  },
  {
    id: 'lv2',
    from: ['মাহফুজ রহমান', 'Mahfuz Rahman'],
    prop: 'p4',
    date: '2026-10-15',
    time: '17:00',
    status: 'approved',
  },
];

export const INITIAL_TENANTS: TenantRecord[] = [
  {
    name: ['আরিফ হোসেন', 'Arif Hossain'],
    prop: 'p10',
    rent: 18500,
    since: '2026-03-01',
    st: 'paid',
  },
  {
    name: ['মেহেরুন নাহার', 'Meherun Nahar'],
    prop: 'p7',
    rent: 6500,
    since: '2026-06-01',
    st: 'due',
  },
  {
    name: ['ফয়সাল আহমেদ', 'Faisal Ahmed'],
    prop: 'p4',
    rent: 15000,
    since: '2026-08-01',
    st: 'paid',
  },
];

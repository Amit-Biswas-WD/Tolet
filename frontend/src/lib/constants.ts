import { PropertyTypeKey, LocationKey } from '@/types';

export const LOCATIONS: Record<LocationKey, [string, string]> = {
  banasree: ['বনশ্রী', 'Banasree'],
  mirpur: ['মিরপুর', 'Mirpur'],
  uttara: ['উত্তরা', 'Uttara'],
  rampura: ['রামপুরা', 'Rampura'],
  mohammadpur: ['মোহাম্মদপুর', 'Mohammadpur'],
  bashundhara: ['বসুন্ধরা', 'Bashundhara'],
};

export const LOCATION_SUBAREAS: Record<LocationKey, [string, string][]> = {
  banasree: [
    ['ব্লক-সি', 'Block C'],
    ['ব্লক-ডি', 'Block D'],
    ['ব্লক-বি', 'Block B'],
  ],
  mirpur: [
    ['মিরপুর-১০', 'Mirpur-10'],
    ['মিরপুর-১২', 'Mirpur-12'],
    ['পল্লবী', 'Pallabi'],
  ],
  uttara: [
    ['সেক্টর-৪', 'Sector 4'],
    ['সেক্টর-১১', 'Sector 11'],
    ['সেক্টর-৭', 'Sector 7'],
  ],
  rampura: [
    ['হাজীপাড়া', 'Hajipara'],
    ['ওয়েস্ট রামপুরা', 'West Rampura'],
  ],
  mohammadpur: [
    ['টাউন হল', 'Town Hall'],
    ['আদাবর', 'Adabor'],
    ['বসিলা', 'Basila'],
  ],
  bashundhara: [
    ['ব্লক-এ', 'Block A'],
    ['ব্লক-ডি', 'Block D'],
  ],
};

export const PROPERTY_TYPES: Record<PropertyTypeKey, [string, string]> = {
  family: ['ফ্যামিলি অ্যাপার্টমেন্ট', 'Family Apartment'],
  bachelor: ['ব্যাচেলর বাসা', 'Bachelor Accommodation'],
  sublet: ['সাবলেট', 'Sublet'],
  room: ['রুম ভাড়া', 'Room Rental'],
  studio: ['স্টুডিও অ্যাপার্টমেন্ট', 'Studio Apartment'],
  office: ['অফিস স্পেস', 'Office Space'],
};

export const TYPE_ICONS: Record<PropertyTypeKey, string> = {
  family: 'Home',
  bachelor: 'User',
  sublet: 'Users',
  room: 'Bed',
  studio: 'Layers',
  office: 'Briefcase',
};

export const AMENITIES: Record<string, [string, string]> = {
  lift: ['লিফট', 'Lift'],
  gen: ['জেনারেটর', 'Generator backup'],
  gas: ['গ্যাস সংযোগ', 'Gas line'],
  sec: ['নিরাপত্তা প্রহরী', 'Security guard'],
  park: ['পার্কিং', 'Parking'],
  cctv: ['সিসিটিভি', 'CCTV'],
  wifi: ['ওয়াইফাই-প্রস্তুত', 'Wi-Fi ready'],
  ac: ['এসি', 'Air conditioning'],
  balcony: ['বারান্দা', 'Balcony'],
  water: ['২৪ ঘণ্টা পানি', '24h water'],
  roof: ['ছাদ ব্যবহার', 'Rooftop access'],
  gym: ['জিম', 'Gym'],
  fridge: ['ফ্রিজ', 'Refrigerator'],
  kitchen: ['রান্নাঘর', 'Kitchen'],
  mosque: ['কাছে মসজিদ', 'Mosque nearby'],
};

export const CONDITIONS: Record<string, [string, string]> = {
  fam: ['শুধু পরিবারের জন্য', 'Families only'],
  bach: ['ব্যাচেলর গ্রহণযোগ্য', 'Bachelors accepted'],
  female: ['শুধু মহিলা/ছাত্রী', 'Women/female students only'],
  male: ['শুধু পুরুষ', 'Men only'],
  nopets: ['পোষা প্রাণী নিষেধ', 'No pets'],
  nosmoke: ['ধূমপান নিষেধ', 'No smoking'],
  lease12: ['১২ মাসের চুক্তি', '12-month agreement'],
  lease6: ['ন্যূনতম ৬ মাসের চুক্তি', '6-month minimum'],
  utilsep: ['ইউটিলিটি বিল আলাদা', 'Utilities billed separately'],
  svc: ['সার্ভিস চার্জ ভাড়ার অন্তর্ভুক্ত', 'Service charge included'],
  id: ['এনআইডি কপি প্রয়োজন', 'NID copy required'],
};

export const FURNISHING: Record<string, [string, string]> = {
  furn: ['সম্পূর্ণ ফার্নিশড', 'Furnished'],
  semi: ['সেমি-ফার্নিশড', 'Semi-furnished'],
  unfurn: ['আনফার্নিশড', 'Unfurnished'],
};

export const STATUS_MAP: Record<string, [string, string, string]> = {
  active: ['প্রকাশিত', 'Published', 'ok'],
  pending: ['অনুমোদনের অপেক্ষায়', 'Pending review', 'warn'],
  rejected: ['প্রত্যাখ্যাত', 'Rejected', 'err'],
  draft: ['খসড়া', 'Draft', ''],
  suspended: ['স্থগিত', 'Suspended', 'err'],
  rented: ['ভাড়া হয়েছে', 'Rented', 'info'],
};

export const LANDLORDS: [string, string][] = [
  ['মোঃ রফিকুল ইসলাম', 'Md. Rafiqul Islam'],
  ['সাবিনা ইয়াসমিন', 'Sabina Yasmin'],
  ['তানভীর আহমেদ', 'Tanvir Ahmed'],
  ['নাজমা খাতুন', 'Nazma Khatun'],
  ['মোঃ জহিরুল হক', 'Md. Zahirul Haque'],
  ['শারমিন সুলতানা', 'Sharmin Sultana'],
];

export const FAQS_DATA: [[string, string], [string, string]][] = [
  [
    ['ToLet.com এ বাসা খুঁজতে কি টাকা লাগে?', 'Does it cost anything to search on ToLet.com?'],
    [
      'এই প্ল্যাটফর্মে সাধারণ বাসা খোঁজা এবং বাড়িওয়ালার সাথে যোগাযোগ সম্পূর্ণ ফ্রি। কোনো গোপন ফি নেই।',
      'Browsing homes and contacting landlords on this platform is completely free. There are no hidden fees.',
    ],
  ],
  [
    ['বাসা আসলেই খালি আছে কিনা কীভাবে নিশ্চিত হব?', 'How do I confirm that a home is really available?'],
    [
      'বাড়িওয়ালার সাথে কথা বলে নিজে গিয়ে বাসা দেখুন। ছবি ও বিবরণ আপনি যা দেখছেন তার সাথে মেলে কিনা যাচাই করুন।',
      'Talk to the landlord and visit in person. Check that the photos and description match what you see.',
    ],
  ],
  [
    ['অগ্রিম টাকা কখন দেওয়া উচিত?', 'When should I pay an advance?'],
    [
      'বাসা দেখে এবং শর্ত লিখিতভাবে নিশ্চিত করার পরই অগ্রিম দিন, আর অবশ্যই রসিদ নিন। দেখার আগে টাকা চাইলে সতর্ক হোন।',
      'Pay only after viewing the home and confirming the terms in writing, and always take a receipt. Be careful if someone asks for money before a viewing.',
    ],
  ],
  [
    ['ভিজিট অনুরোধ কীভাবে কাজ করে?', 'How do visit requests work?'],
    [
      'বাসার পাতায় তারিখ, সময় ও যোগাযোগের তথ্য দিয়ে অনুরোধ পাঠানো যায়। বাড়িওয়ালা তা অনুমোদন করলে কনফার্মেশন পাবেন।',
      'You can send a request from the property page with a date, time and contact details. Once the landlord approves, you will receive confirmation.',
    ],
  ],
  [
    ['বাড়িওয়ালা হিসেবে কীভাবে তালিকা দেব?', 'How do I list a property as a landlord?'],
    [
      '"বাসা ভাড়া দিন" বোতাম থেকে সহজ ফর্মে বাসার তথ্য, ভাড়া, সুবিধা ও ছবি দিন। জমা দিলে তালিকা দ্রুত সক্রিয় হবে।',
      'Use the "List your property" button and complete the simple form with details, rent, amenities and photos to publish your listing.',
    ],
  ],
  [
    ['Wanted Property কী?', 'What is a Wanted Property?'],
    [
      'ভাড়াটিয়া তাঁর বাজেট, এলাকা ও প্রয়োজন জানিয়ে একটি অনুরোধ প্রকাশ করতে পারেন, যাতে বাড়িওয়ালারা সরাসরি যোগাযোগ করতে পারেন।',
      'Tenants can post their budget, area and requirements so that landlords can reach out directly.',
    ],
  ],
];

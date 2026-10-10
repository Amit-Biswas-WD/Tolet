export type Language = 'bn' | 'en';

export type PropertyTypeKey = 'family' | 'bachelor' | 'sublet' | 'room' | 'studio' | 'office';
export type LocationKey = 'banasree' | 'mirpur' | 'uttara' | 'rampura' | 'mohammadpur' | 'bashundhara';
export type FurnishingKey = 'furn' | 'semi' | 'unfurn';
export type PropertyStatusKey = 'active' | 'pending' | 'rejected' | 'draft' | 'suspended' | 'rented';

export interface Property {
  id: string;
  loc: LocationKey | string;
  sub: [string, string];
  type: PropertyTypeKey;
  title: [string, string];
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  furn: FurnishingKey;
  avail: string;
  days: number;
  adv: number;
  amen: string[];
  cond: string[];
  seed: number;
  feat: boolean;
  ll: number;
  status: PropertyStatusKey;
  owner: string;
  views: number;
  inq: number;
  floor: number;
  desc?: [string, string];
  imgs?: string[];
}

export interface WantedProperty {
  id: string;
  by: [string, string];
  loc: string;
  type: string;
  min: number;
  max: number;
  beds: number;
  move: string;
  note: [string, string];
  days: number;
  status: 'active' | 'pending' | 'removed';
  mine?: boolean;
}

export interface Inquiry {
  id: string;
  prop: string;
  date: string;
  status: 'sent' | 'replied' | 'closed';
}

export interface LandlordInquiry {
  id: string;
  from: [string, string];
  prop: string;
  date: string;
  msg: [string, string];
  status: 'new' | 'replied';
}

export interface VisitRequest {
  id: string;
  prop: string;
  date: string;
  time: string;
  status: 'requested' | 'confirmed' | 'cancelled';
}

export interface LandlordVisit {
  id: string;
  from: [string, string];
  prop: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface TenantRecord {
  name: [string, string];
  prop: string;
  rent: number;
  since: string;
  st: 'paid' | 'due';
}

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: 'tenant' | 'landlord' | 'admin';
  joined?: string;
}

export interface FilterState {
  q: string;
  loc: string;
  type: string;
  min: string;
  max: string;
  beds: string;
  baths: string;
  area: string;
  furn: string;
  avail: string;
  sort: 'new' | 'low' | 'high';
  view: 'grid' | 'list';
  page: number;
}

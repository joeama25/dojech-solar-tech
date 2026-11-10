export interface ProductSpecs {
  wattage?: string;
  voltage?: string;
  batteryCapacity?: string;
  efficiency?: string;
  dimensions?: string;
  warrantyPeriod?: string;
  cellType?: string;
  weight?: string;
  waveform?: string;
  operatingTemp?: string;
  surgeCapacity?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  warranty: string;
  specs: ProductSpecs;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
}

export interface HeroSlide {
  id: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  order: number;
  isActive: boolean;
  accentBadge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending Confirmation'
  | 'Awaiting Payment'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}

export interface Order {
  id: string;
  reference: string;
  userId?: string;
  customer: CustomerDetails;
  items: {
    productId: string;
    productName: string;
    brand: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentVerified: boolean;
  internalNotes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  location: string;
  rating: number;
  review: string;
  solarInstalled: string;
  isApproved: boolean;
  avatarUrl?: string;
}

export interface WebsiteSettings {
  companyName: string;
  tagline: string;
  whatsappNumber: string; // Primary number in international format: 2349161198360
  displayWhatsapp: string; // Formatted primary display
  whatsappNumbers: {
    number: string; // e.g. 2349161198360
    display: string; // e.g. 09161198360
    label: string; // e.g. "Primary Sales Line"
  }[];
  phone: string;
  email: string;
  address: string;
  currency: string;
  currencySymbol: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

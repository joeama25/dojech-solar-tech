import { Product, Category, HeroSlide, Testimonial, WebsiteSettings } from '../types';

export const INITIAL_SETTINGS: WebsiteSettings = {
  companyName: 'Dojech Solar Tech',
  tagline: 'Reliable, Modern & Sustainable Solar Energy Solutions',
  whatsappNumber: '2349161198360',
  displayWhatsapp: '0916 119 8360',
  whatsappNumbers: [
    { number: '2349161198360', display: '0916 119 8360', label: 'Primary Sales & Enquiries' },
    { number: '2348030604792', display: '0803 060 4792', label: 'Technical & Sizing Support' },
    { number: '2348032384052', display: '0803 238 4052', label: 'Orders & Dispatch Desk' }
  ],
  phone: '0916 119 8360 / 0803 060 4792 / 0803 238 4052',
  email: 'sales@dojechsolartech.com',
  address: 'Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigeria',
  currency: 'NGN',
  currencySymbol: '₦',
  deliveryFee: 15000,
  freeDeliveryThreshold: 2000000,
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
};

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    heading: 'Power Your World. The Smarter Way.',
    description: 'Discover reliable solar energy solutions designed to keep your home and business powered 24/7 without noisy generators or grid failures.',
    ctaText: 'Explore Products',
    ctaLink: 'shop',
    image: '/src/assets/images/hero_solar_residential_1793813490504.jpg',
    order: 1,
    isActive: true,
    accentBadge: 'High-Efficiency Monocrystalline & Hybrid Inverters'
  },
  {
    id: 'slide-2',
    heading: 'Say Goodbye to Unpredictable Power.',
    description: 'Take control of your electricity with dependable Tier-1 solar panels, smart pure sine wave inverters, and long-life LiFePO4 batteries.',
    ctaText: 'Shop Solar Solutions',
    ctaLink: 'shop',
    image: '/src/assets/images/hero_commercial_inverter_1793813489777.jpg',
    order: 2,
    isActive: true,
    accentBadge: 'Enterprise & Residential Energy Storage'
  },
  {
    id: 'slide-3',
    heading: 'Invest in Energy. Invest in Your Future.',
    description: 'Enjoy cleaner, smarter, and more affordable energy with Dojech Solar Tech backed by certified warranties and nationwide Nigerian delivery.',
    ctaText: 'Discover More',
    ctaLink: 'categories',
    image: '/src/assets/images/hero_solar_farm_1793813489573.jpg',
    order: 3,
    isActive: true,
    accentBadge: 'Up to 25 Years Linear Performance Warranty'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-panels',
    name: 'Solar Panels',
    slug: 'solar-panels',
    description: 'Tier-1 Mono PERC & N-Type bifacial solar panels with up to 22.8% cell efficiency.',
    image: '/src/assets/images/cat_solar_panels_1793813620282.jpg',
    productCount: 8
  },
  {
    id: 'cat-inverters',
    name: 'Solar Inverters',
    slug: 'solar-inverters',
    description: 'Pure sine wave hybrid, off-grid and on-grid inverters with built-in MPPT controllers.',
    image: '/src/assets/images/cat_inverters_1793813620635.jpg',
    productCount: 12
  },
  {
    id: 'cat-lithium',
    name: 'Lithium Batteries',
    slug: 'lithium-batteries',
    description: 'High-density LiFePO4 rack-mount and wall-mount batteries offering 6,000+ cycle lifespans.',
    image: '/src/assets/images/cat_lithium_batteries_1793813621883.jpg',
    productCount: 9
  },
  {
    id: 'cat-tubular',
    name: 'Tubular Batteries',
    slug: 'tubular-batteries',
    description: 'Rugged deep-cycle tall tubular lead-acid batteries built for frequent deep discharges.',
    image: '/src/assets/images/cat_lithium_batteries_1793813621883.jpg',
    productCount: 5
  },
  {
    id: 'cat-controllers',
    name: 'Charge Controllers',
    slug: 'charge-controllers',
    description: 'Smart MPPT solar charge controllers with 99% tracking efficiency for maximum harvesting.',
    image: '/src/assets/images/cat_inverters_1793813620635.jpg',
    productCount: 6
  },
  {
    id: 'cat-systems',
    name: 'Complete Solar Systems',
    slug: 'complete-solar-systems',
    description: 'Turnkey pre-configured solar packages tailored for 2-bedroom flats, duplexes, and commercial buildings.',
    image: '/src/assets/images/hero_solar_residential_1793813490504.jpg',
    productCount: 7
  },
  {
    id: 'cat-accessories',
    name: 'Solar Accessories',
    slug: 'solar-accessories',
    description: 'PV solar cables, MC4 connectors, DC surge protectors, circuit breakers, and battery racks.',
    image: '/src/assets/images/cat_solar_panels_1793813620282.jpg',
    productCount: 15
  },
  {
    id: 'cat-installation',
    name: 'Installation Equipment',
    slug: 'installation-equipment',
    description: 'Roof mounting aluminum rails, clamps, grounding lugs, and weather-sealed combiner boxes.',
    image: '/src/assets/images/hero_solar_farm_1793813489573.jpg',
    productCount: 10
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Canadian Solar 550W HiKu6 Mono PERC Solar Panel',
    slug: 'canadian-solar-550w-hiku6-mono-perc',
    categoryId: 'cat-panels',
    categoryName: 'Solar Panels',
    brand: 'Canadian Solar',
    price: 135000,
    originalPrice: 155000,
    description: 'The Canadian Solar 550W HiKu6 Monocrystalline module delivers high power output and up to 21.5% module efficiency. Built with half-cut cell technology to minimize micro-cracks and reduce shading loss. Ideal for Nigerian residential rooftops and commercial solar farms.',
    shortDescription: '550W high-efficiency Mono PERC module with 144 half-cut cells and 25-year warranty.',
    images: [
      '/src/assets/images/cat_solar_panels_1793813620282.jpg',
      '/src/assets/images/hero_solar_farm_1793813489573.jpg'
    ],
    inStock: true,
    stockQuantity: 42,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 38,
    warranty: '12-Year Product Warranty, 25-Year Linear Output',
    specs: {
      wattage: '550 Watts',
      voltage: '41.7 V (Vmp)',
      efficiency: '21.5%',
      cellType: 'Monocrystalline PERC (144 Cells)',
      dimensions: '2278 x 1134 x 35 mm',
      weight: '27.6 kg',
      operatingTemp: '-40°C to +85°C'
    },
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-2',
    name: 'Felicity Solar 5KVA 48V IVEM Hybrid Inverter with 120A MPPT',
    slug: 'felicity-solar-5kva-48v-ivem-hybrid-inverter',
    categoryId: 'cat-inverters',
    categoryName: 'Solar Inverters',
    brand: 'Felicity Solar',
    price: 685000,
    originalPrice: 750000,
    description: 'High-performance pure sine wave 5KVA 48V hybrid inverter engineered for continuous household and office power. Features an integrated 120A MPPT solar charge controller with high PV input voltage up to 500VDC. Supports seamless dual output for essential and non-essential loads.',
    shortDescription: '5KVA 48V Pure Sine Wave Hybrid Inverter with 120A MPPT Controller and LCD screen.',
    images: [
      '/src/assets/images/cat_inverters_1793813620635.jpg',
      '/src/assets/images/hero_commercial_inverter_1793813489777.jpg'
    ],
    inStock: true,
    stockQuantity: 18,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 52,
    warranty: '2-Year Manufacturer Replacement Warranty',
    specs: {
      wattage: '5000W / 5KVA',
      voltage: '48V DC / 230V AC',
      efficiency: '95% Peak Efficiency',
      surgeCapacity: '10000VA (5 Seconds)',
      waveform: 'Pure Sine Wave',
      dimensions: '470 x 310 x 120 mm',
      weight: '12.5 kg'
    },
    createdAt: '2026-02-01'
  },
  {
    id: 'prod-3',
    name: 'Felicity Solar 51.2V 100Ah 5.12kWh LiFePO4 Wall Mount Lithium Battery',
    slug: 'felicity-solar-51-2v-100ah-lifepo4-wall-mount',
    categoryId: 'cat-lithium',
    categoryName: 'Lithium Batteries',
    brand: 'Felicity Solar',
    price: 1450000,
    originalPrice: 1600000,
    description: 'Premium A-grade prismatic LiFePO4 chemistry with over 6,000 cycles at 80% DOD. Smart built-in Battery Management System (BMS) with CAN/RS485 protocol communication for Victron, Deye, Felicity, and Growatt inverters. Sleek wall-mountable design saves floor space.',
    shortDescription: '5.12kWh 51.2V 100Ah Lithium Iron Phosphate battery pack with 6000+ cycle life.',
    images: [
      '/src/assets/images/cat_lithium_batteries_1793813621883.jpg',
      '/src/assets/images/hero_commercial_inverter_1793813489777.jpg'
    ],
    inStock: true,
    stockQuantity: 14,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 29,
    warranty: '5-Year Direct Replacement Warranty',
    specs: {
      batteryCapacity: '5.12 kWh (100Ah)',
      voltage: '51.2V Nominal (44.8V - 57.6V)',
      efficiency: '98% Round-trip efficiency',
      dimensions: '600 x 480 x 180 mm',
      weight: '48 kg',
      operatingTemp: '-10°C to +50°C'
    },
    createdAt: '2026-02-14'
  },
  {
    id: 'prod-4',
    name: 'Deye 8kW Single Phase Low Voltage Hybrid Inverter (SUN-8K-SG01LP1-EU)',
    slug: 'deye-8kw-hybrid-inverter-single-phase',
    categoryId: 'cat-inverters',
    categoryName: 'Solar Inverters',
    brand: 'Deye',
    price: 1850000,
    originalPrice: 2000000,
    description: 'The benchmark of smart solar inverters. Deye 8kW hybrid inverter allows multi-parallel connection (up to 16 units), dual MPPT trackers, touch LCD screen, generator auto-start relay, and smart load management. Supports zero-export grid connection.',
    shortDescription: '8kW Hybrid Inverter with Dual MPPT, Touch Color Screen, and Generator control.',
    images: [
      '/src/assets/images/cat_inverters_1793813620635.jpg',
      '/src/assets/images/hero_commercial_inverter_1793813489777.jpg'
    ],
    inStock: true,
    stockQuantity: 9,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 19,
    warranty: '5-Year Factory Warranty',
    specs: {
      wattage: '8000W Continuous',
      voltage: '48V DC Battery / 230V AC',
      efficiency: '97.6% Max Efficiency',
      surgeCapacity: '16000VA (10s)',
      waveform: 'Pure Sine Wave (<3% THD)',
      dimensions: '420 x 670 x 233 mm',
      weight: '32 kg'
    },
    createdAt: '2026-02-18'
  },
  {
    id: 'prod-5',
    name: 'Jinko Solar 585W Tiger Neo N-Type Bifacial Double Glass Panel',
    slug: 'jinko-solar-585w-tiger-neo-n-type',
    categoryId: 'cat-panels',
    categoryName: 'Solar Panels',
    brand: 'Jinko Solar',
    price: 1550000,  
    originalPrice: 175000,
    description: 'Next-generation TOPCon N-type solar technology with bifacial energy yield up to 25% from rear reflection. Ultra-low degradation (1% first year, 0.4% annual), superior low-light performance in cloudy Nigerian conditions, and dual tempered glass construction.',
    shortDescription: '585W N-Type TOPCon bifacial dual-glass module with 22.65% module efficiency.',
    images: [
      '/src/assets/images/cat_solar_panels_1793813620282.jpg',
      '/src/assets/images/hero_solar_farm_1793813489573.jpg'
    ],
    inStock: true,
    stockQuantity: 36,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 22,
    warranty: '15-Year Product, 30-Year Linear Output Guarantee',
    specs: {
      wattage: '585 Watts (+ up to 25% bifacial gain)',
      voltage: '43.27V (Vmp)',
      efficiency: '22.65%',
      cellType: 'N-Type TOPCon Monocrystalline',
      dimensions: '2278 x 1134 x 30 mm',
      weight: '31.5 kg'
    },
    createdAt: '2026-02-20'
  },
  {
    id: 'prod-6',
    name: 'Luminous 220Ah / 12V Inverlast Tall Tubular Solar Battery',
    slug: 'luminous-220ah-12v-inverlast-tall-tubular',
    categoryId: 'cat-tubular',
    categoryName: 'Tubular Batteries',
    brand: 'Luminous',
    price: 295000,
    originalPrice: 330000,
    description: 'Heavy-duty tubular plate technology formulated with high antimony lead alloy to withstand tough Nigerian climate and frequent NEPA power outages. High acid volume per ampere-hour ensures low maintenance and reliable backup.',
    shortDescription: '220Ah 12V Heavy Duty Deep Cycle Tall Tubular Inverter Battery.',
    images: [
      '/src/assets/images/cat_lithium_batteries_1793813621883.jpg'
    ],
    inStock: true,
    stockQuantity: 25,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 44,
    warranty: '24-Month Manufacturer Warranty',
    specs: {
      batteryCapacity: '220Ah @ C20',
      voltage: '12V DC',
      efficiency: '85% Coulombic efficiency',
      dimensions: '502 x 191 x 440 mm',
      weight: '62 kg'
    },
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-7',
    name: '3.5KVA Complete Home Solar Energy System (Package)',
    slug: '3-5kva-complete-home-solar-system',
    categoryId: 'cat-systems',
    categoryName: 'Complete Solar Systems',
    brand: 'Dojech Turnkey Solution',
    price: 2850000,
    originalPrice: 3200000,
    description: 'All-inclusive pre-engineered solar package designed to power a 3-bedroom home: refrigerator, TV, decoders, lighting points, fans, laptops, and sound system 24/7. Includes 3.5KVA Hybrid Inverter, 5kWh LiFePO4 Lithium Battery, 6x 550W Canadian Solar Panels, mounting rails, DC breakers, surge protectors, and installation cables.',
    shortDescription: 'Complete 3.5KVA Solar System: Inverter, 5kWh Lithium Battery, 6x Panels, Protection kits.',
    images: [
      '/src/assets/images/hero_solar_residential_1793813490504.jpg',
      '/src/assets/images/hero_commercial_inverter_1793813489777.jpg'
    ],
    inStock: true,
    stockQuantity: 10,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 16,
    warranty: 'Full System Warranty (5 Yrs on Inverter/Battery, 25 Yrs on Panels)',
    specs: {
      wattage: '3500W Output Capacity',
      voltage: '48V System Architecture',
      batteryCapacity: '5.12 kWh Lithium LiFePO4 Storage',
      efficiency: 'High-Yield MPPT Solar Tracking'
    },
    createdAt: '2026-02-10'
  },
  {
    id: 'prod-8',
    name: 'SRNE 60A 12V/24V/36V/48V Auto MPPT Solar Charge Controller',
    slug: 'srne-60a-auto-mppt-charge-controller',
    categoryId: 'cat-controllers',
    categoryName: 'Charge Controllers',
    brand: 'SRNE',
    price: 145000,
    originalPrice: 165000,
    description: 'Advanced MPPT tracking algorithm with efficiency >= 99.5%. Multi-voltage auto recognition for 12V/24V/36V/48V systems. Max PV input 150VDC. Features comprehensive protections against overcharging, reverse polarity, and short circuits.',
    shortDescription: '60A MPPT Solar Charge Controller with LCD display and 150V PV input.',
    images: [
      '/src/assets/images/cat_inverters_1793813620635.jpg'
    ],
    inStock: true,
    stockQuantity: 30,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 18,
    warranty: '2-Year Warranty',
    specs: {
      voltage: '12V/24V/36V/48V Auto Detection',
      efficiency: '99.5% Tracking Efficiency',
      dimensions: '245 x 180 x 82 mm',
      weight: '2.5 kg'
    },
    createdAt: '2026-01-22'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Engr. Babatunde Adeleke',
    role: 'Homeowner & Civil Engineer',
    location: 'Lekki Phase 1, Lagos',
    rating: 5,
    review: 'Switching to Dojech Solar Tech was the best decision for my home. The 5KVA hybrid system with the Felicity lithium battery has kept our power on without a second of darkness for 9 months straight. Ordering via WhatsApp was transparent and delivery took less than 24 hours.',
    solarInstalled: '5KVA Hybrid System with 5.12kWh Lithium Battery',
    isApproved: true
  },
  {
    id: 'test-2',
    name: 'Dr. (Mrs.) Ngozi Okonkwo',
    role: 'Medical Director, St. Jude Clinic',
    location: 'Garki, Abuja',
    rating: 5,
    review: 'Our diagnostic equipment and vaccine cold storage require zero outage risk. Dojech Solar provided genuine Canadian Solar panels and Deye inverters that met our clinical specs. The team provides continuous support on WhatsApp whenever we have technical queries.',
    solarInstalled: '10KVA Commercial Solar Backup Solution',
    isApproved: true
  },
  {
    id: 'test-3',
    name: 'Alhaji Musa Ibrahim',
    role: 'CEO, Horizon Agro Logistics',
    location: 'Ibadan, Oyo State',
    rating: 5,
    review: 'No more wasting ₦350,000 every month on diesel fuel! The solar system Dojech designed paid for itself within the first year. Genuine Tier-1 equipment and dependable warranties give us full peace of mind.',
    solarInstalled: '8kW Hybrid Inverter + 10kWh Battery System',
    isApproved: true
  }
];

export const FAQS = [
  {
    question: 'What solar system capacity is suitable for my home or office?',
    answer: 'The required capacity depends on your essential daily loads. A 3.5KVA system typically powers a 2-3 bedroom flat including TVs, refrigerators, lighting, laptops, and fans. A 5KVA to 8KVA system can run 1-2 inverter air conditioners along with pumping machines and full household electronics. Contact our engineers on WhatsApp for a custom energy audit.'
  },
  {
    question: 'Do you offer professional installation services in Nigeria?',
    answer: 'Yes! Dojech Solar Tech maintains a network of certified, experienced renewable energy engineers across Lagos, Abuja, Port Harcourt, Ibadan, and all major states. When you order your products on WhatsApp, you can request full installation and our team will quote and deploy certified installation.'
  },
  {
    question: 'How does WhatsApp checkout work?',
    answer: 'Simply add your desired solar products to your cart and proceed to checkout with your delivery details. When you click "Complete Order on WhatsApp", the website automatically formats your order with all item names, quantities, and prices into a pre-filled WhatsApp message sent directly to our official sales line. Our sales team verifies stock, gives you banking payment details, and arranges doorstep delivery.'
  },
  {
    question: 'How long do your solar batteries last?',
    answer: 'Our LiFePO4 (Lithium Iron Phosphate) batteries offer 6,000+ deep discharge cycles, which translates to 10 to 15 years of daily dependable use. Our deep-cycle Tall Tubular batteries provide 3 to 5 years of steady backup when maintained properly with distilled water.'
  },
  {
    question: 'Do all Dojech Solar Tech products come with warranty?',
    answer: 'Absolutely. All our products are 100% genuine Tier-1 brands with manufacturer warranties: 25 years on Solar Panels, 5 years on Lithium Batteries, and 2 to 5 years on Inverters. Every warranty card is registered at purchase.'
  },
  {
    question: 'Can I pay on delivery or confirm payment before dispatch?',
    answer: 'Because solar equipment involves sensitive, high-value electronics and custom logistics, payment is arranged and verified directly with our sales team via verified corporate bank transfer upon order confirmation on WhatsApp prior to nationwide dispatch.'
  }
];

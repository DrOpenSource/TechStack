/**
 * Mock Products Data
 * E-commerce domain data for online stores
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  specifications?: Record<string, string>;
  variants?: Array<{
    id: string;
    name: string;
    options: Record<string, string>;
    price: number;
    stock: number;
    sku: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  bestseller?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'paypal' | 'apple-pay';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

/**
 * Mock Products
 */
const generateProductImage = (id: string, index: number = 0): string => {
  return `https://picsum.photos/seed/${id}-${index}/800/800`;
};

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals who need to focus.',
    shortDescription: 'Premium wireless headphones with ANC',
    price: 299.99,
    compareAtPrice: 399.99,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'AudioPro',
    sku: 'ANC-HP-001',
    stock: 45,
    images: [
      generateProductImage('headphones', 0),
      generateProductImage('headphones', 1),
      generateProductImage('headphones', 2),
    ],
    rating: 4.7,
    reviewCount: 328,
    tags: ['wireless', 'noise-cancelling', 'bluetooth', 'premium'],
    specifications: {
      'Battery Life': '30 hours',
      'Bluetooth Version': '5.0',
      'Weight': '250g',
      'Charging Time': '2 hours',
      'Drivers': '40mm',
    },
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-11-01'),
    featured: true,
    bestseller: true,
  },
  {
    id: 'prod-2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, sleep tracking, and 50+ sport modes. Water resistant up to 50m.',
    shortDescription: 'Advanced fitness tracking smartwatch',
    price: 249.99,
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'FitTech',
    sku: 'FW-SMART-002',
    stock: 62,
    images: [
      generateProductImage('watch', 0),
      generateProductImage('watch', 1),
    ],
    rating: 4.5,
    reviewCount: 892,
    tags: ['fitness', 'smartwatch', 'gps', 'health'],
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery Life': '7 days',
      'Water Resistance': '5 ATM',
      'Sensors': 'Heart rate, GPS, Accelerometer, Gyroscope',
    },
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-10-20'),
    bestseller: true,
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. Designed for all-day comfort and proper posture.',
    shortDescription: 'Premium ergonomic office chair',
    price: 399.99,
    compareAtPrice: 549.99,
    category: 'Furniture',
    subcategory: 'Office',
    brand: 'ErgoComfort',
    sku: 'OFC-ERG-003',
    stock: 23,
    images: [
      generateProductImage('chair', 0),
      generateProductImage('chair', 1),
      generateProductImage('chair', 2),
    ],
    rating: 4.8,
    reviewCount: 156,
    tags: ['office', 'ergonomic', 'furniture', 'comfort'],
    specifications: {
      'Material': 'Mesh & Steel',
      'Weight Capacity': '300 lbs',
      'Adjustable Height': 'Yes',
      'Lumbar Support': 'Adjustable',
      'Warranty': '5 years',
    },
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-09-15'),
    featured: true,
  },
  {
    id: 'prod-4',
    name: 'Mechanical Keyboard RGB',
    description: 'Gaming mechanical keyboard with customizable RGB lighting, tactile switches, and programmable keys. Built for gamers and typing enthusiasts.',
    shortDescription: 'RGB mechanical gaming keyboard',
    price: 159.99,
    category: 'Electronics',
    subcategory: 'Accessories',
    brand: 'GameGear',
    sku: 'KB-MECH-004',
    stock: 88,
    images: [
      generateProductImage('keyboard', 0),
      generateProductImage('keyboard', 1),
    ],
    rating: 4.6,
    reviewCount: 542,
    tags: ['gaming', 'rgb', 'mechanical', 'keyboard'],
    specifications: {
      'Switch Type': 'Cherry MX Red',
      'Backlight': 'RGB',
      'Connection': 'USB-C',
      'Keys': '104',
      'Cable Length': '1.8m braided',
    },
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-11-10'),
    bestseller: true,
  },
  {
    id: 'prod-5',
    name: 'Portable Bluetooth Speaker',
    description: '360-degree sound with deep bass, 24-hour battery, waterproof design. Perfect for outdoor adventures and parties.',
    shortDescription: 'Waterproof portable speaker',
    price: 89.99,
    compareAtPrice: 129.99,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'SoundWave',
    sku: 'SPK-BT-005',
    stock: 134,
    images: [
      generateProductImage('speaker', 0),
      generateProductImage('speaker', 1),
    ],
    rating: 4.4,
    reviewCount: 1024,
    tags: ['bluetooth', 'speaker', 'waterproof', 'portable'],
    specifications: {
      'Battery Life': '24 hours',
      'Water Resistance': 'IPX7',
      'Bluetooth Range': '30 feet',
      'Power Output': '20W',
    },
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: 'prod-6',
    name: 'Standing Desk Converter',
    description: 'Height-adjustable standing desk converter that transforms any desk into a sit-stand workstation. Gas spring assist for easy adjustment.',
    shortDescription: 'Adjustable standing desk converter',
    price: 279.99,
    category: 'Furniture',
    subcategory: 'Office',
    brand: 'ErgoComfort',
    sku: 'DSK-STD-006',
    stock: 31,
    images: [
      generateProductImage('desk', 0),
      generateProductImage('desk', 1),
    ],
    rating: 4.7,
    reviewCount: 203,
    tags: ['standing desk', 'ergonomic', 'adjustable', 'office'],
    specifications: {
      'Height Range': '6.5" - 19.7"',
      'Surface Area': '32" x 24"',
      'Weight Capacity': '33 lbs',
      'Material': 'Steel & MDF',
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-08-20'),
    featured: true,
  },
];

/**
 * Mock Reviews
 */
export const mockReviews: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-1',
    userName: 'Alex Thompson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    rating: 5,
    title: 'Best headphones I\'ve ever owned',
    comment: 'The noise cancellation is incredible! I use these daily for work and the battery lasts all week. Sound quality is exceptional.',
    helpful: 42,
    verified: true,
    createdAt: new Date('2024-10-15'),
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'user-2',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    rating: 4,
    title: 'Great quality, slightly heavy',
    comment: 'Amazing sound and ANC, but they feel a bit heavy after 3-4 hours. Still highly recommend.',
    helpful: 18,
    verified: true,
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userId: 'user-3',
    userName: 'Mike Rodriguez',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    rating: 5,
    title: 'Perfect for fitness tracking',
    comment: 'Tracks everything I need - steps, heart rate, sleep. Battery lasts a full week. GPS is accurate.',
    helpful: 35,
    verified: true,
    createdAt: new Date('2024-09-10'),
  },
];

/**
 * Mock Orders
 */
export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-2024-001',
    userId: 'demo-user-id',
    status: 'delivered',
    items: [
      {
        productId: 'prod-1',
        productName: 'Wireless Noise-Cancelling Headphones',
        quantity: 1,
        price: 299.99,
        image: generateProductImage('headphones', 0),
      },
    ],
    subtotal: 299.99,
    tax: 24.00,
    shipping: 0,
    total: 323.99,
    shippingAddress: {
      fullName: 'Demo User',
      address: '123 Main St, Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
    paymentMethod: 'card',
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-2024-002',
    userId: 'demo-user-id',
    status: 'processing',
    items: [
      {
        productId: 'prod-2',
        productName: 'Smart Fitness Watch',
        quantity: 1,
        price: 249.99,
        image: generateProductImage('watch', 0),
      },
      {
        productId: 'prod-5',
        productName: 'Portable Bluetooth Speaker',
        quantity: 2,
        price: 89.99,
        image: generateProductImage('speaker', 0),
      },
    ],
    subtotal: 429.97,
    tax: 34.40,
    shipping: 9.99,
    total: 474.36,
    shippingAddress: {
      fullName: 'Demo User',
      address: '123 Main St, Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
    paymentMethod: 'card',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-11'),
    estimatedDelivery: new Date('2024-11-20'),
  },
];

/**
 * Shopping Cart
 */
export interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
}

export const mockCartItems: CartItem[] = [
  {
    productId: 'prod-4',
    quantity: 1,
  },
];

/**
 * Product Categories
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }>;
}

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest tech and gadgets',
    productCount: 156,
    subcategories: [
      { id: 'subcat-1', name: 'Audio', slug: 'audio', productCount: 42 },
      { id: 'subcat-2', name: 'Wearables', slug: 'wearables', productCount: 28 },
      { id: 'subcat-3', name: 'Accessories', slug: 'accessories', productCount: 86 },
    ],
  },
  {
    id: 'cat-2',
    name: 'Furniture',
    slug: 'furniture',
    description: 'Office and home furniture',
    productCount: 89,
    subcategories: [
      { id: 'subcat-4', name: 'Office', slug: 'office', productCount: 54 },
      { id: 'subcat-5', name: 'Living Room', slug: 'living-room', productCount: 35 },
    ],
  },
];

/**
 * Get product by ID
 */
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === id);
};

/**
 * Get products by category
 */
export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(p => p.category === category);
};

/**
 * Get featured products
 */
export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(p => p.featured);
};

/**
 * Get bestsellers
 */
export const getBestsellers = (): Product[] => {
  return mockProducts.filter(p => p.bestseller);
};

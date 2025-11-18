/**
 * Sample Data Library
 *
 * Pre-defined sample data for form pre-population and user guidance.
 * Use these in development/demo mode to speed up testing and demos.
 *
 * @see .claude/skills/development/mock-first-development.md
 */

/**
 * Sample user profile data
 */
export const SAMPLE_USER_PROFILE = {
  name: 'Alice Johnson',
  email: 'alice.demo@example.com',
  phone: '+919876543210',
  bio: 'Product designer passionate about creating delightful user experiences',
  avatar: 'https://i.pravatar.cc/150?img=1',
  dateOfBirth: '1990-05-15',
  gender: 'female',
  language: 'en',
};

/**
 * Sample address data (India-focused)
 */
export const SAMPLE_ADDRESS = {
  street: '123 MG Road',
  landmark: 'Near City Mall',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560001',
  country: 'India',
};

/**
 * Alternative sample addresses
 */
export const SAMPLE_ADDRESSES = [
  {
    street: '456 Park Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
  },
  {
    street: '789 Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India',
  },
  {
    street: '321 Anna Salai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600002',
    country: 'India',
  },
];

/**
 * Sample payment card data (test cards)
 */
export const SAMPLE_PAYMENT = {
  cardNumber: '4242 4242 4242 4242', // Stripe test card
  cardholderName: 'Alice Johnson',
  expiryMonth: '12',
  expiryYear: '2025',
  cvv: '123',
};

/**
 * Sample OTP for testing
 */
export const SAMPLE_OTP = {
  code: '123456',
  hint: 'Use 123456 for all OTP fields in demo mode',
  validMinutes: 5,
};

/**
 * Sample bank account details (test data)
 */
export const SAMPLE_BANK_ACCOUNT = {
  accountHolderName: 'Alice Johnson',
  accountNumber: '1234567890',
  ifscCode: 'SBIN0001234',
  bankName: 'State Bank of India',
  branchName: 'MG Road Branch',
  accountType: 'savings',
};

/**
 * Sample company/organization data
 */
export const SAMPLE_COMPANY = {
  name: 'Acme Corp',
  gstNumber: '29ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  registrationNumber: 'U12345KA2020PTC123456',
  website: 'https://acmecorp.example.com',
  industry: 'Technology',
  employeeCount: '50-200',
};

/**
 * Sample social media profiles
 */
export const SAMPLE_SOCIAL_MEDIA = {
  twitter: 'https://twitter.com/alicejohnson',
  linkedin: 'https://linkedin.com/in/alicejohnson',
  github: 'https://github.com/alicejohnson',
  instagram: 'https://instagram.com/alicejohnson',
  facebook: 'https://facebook.com/alicejohnson',
};

/**
 * Sample emergency contact
 */
export const SAMPLE_EMERGENCY_CONTACT = {
  name: 'Bob Johnson',
  relationship: 'Spouse',
  phone: '+919876543211',
  email: 'bob.johnson@example.com',
};

/**
 * Sample preferences
 */
export const SAMPLE_PREFERENCES = {
  theme: 'light',
  language: 'en',
  timezone: 'Asia/Kolkata',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  privacy: {
    profileVisible: true,
    showEmail: false,
    showPhone: false,
  },
};

/**
 * Sample API credentials (for testing integrations)
 * NOTE: These are FAKE examples - replace with real credentials in production
 */
export const SAMPLE_API_CREDENTIALS = {
  apiKey: 'demo_key_1234567890abcdef', // Replace with real API key
  apiSecret: 'demo_secret_0987654321fedcba', // Replace with real secret
  webhookUrl: 'https://your-app.example.com/api/webhooks/payment',
};

/**
 * Sample dates for various scenarios
 */
export const SAMPLE_DATES = {
  past: new Date('2023-01-15').toISOString(),
  today: new Date().toISOString(),
  tomorrow: new Date(Date.now() + 86400000).toISOString(),
  nextWeek: new Date(Date.now() + 7 * 86400000).toISOString(),
  nextMonth: new Date(Date.now() + 30 * 86400000).toISOString(),
  birthDate: '1990-05-15',
};

/**
 * Sample file uploads (for file input testing)
 */
export const SAMPLE_FILES = {
  profileImage: {
    name: 'profile.jpg',
    type: 'image/jpeg',
    size: 245678,
    url: 'https://i.pravatar.cc/400',
  },
  document: {
    name: 'resume.pdf',
    type: 'application/pdf',
    size: 512000,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  spreadsheet: {
    name: 'data.xlsx',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 89012,
  },
};

/**
 * Sample error messages for testing error states
 */
export const SAMPLE_ERRORS = {
  network: 'Unable to connect to server. Please check your internet connection.',
  validation: 'Please fill in all required fields correctly.',
  authentication: 'Invalid credentials. Please try again.',
  authorization: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Something went wrong on our end. Please try again later.',
  timeout: 'Request timed out. Please try again.',
};

/**
 * Sample success messages
 */
export const SAMPLE_SUCCESS = {
  created: 'Successfully created!',
  updated: 'Changes saved successfully.',
  deleted: 'Successfully deleted.',
  uploaded: 'File uploaded successfully.',
  sent: 'Message sent successfully.',
};

/**
 * Sample phone numbers (India)
 */
export const SAMPLE_PHONE_NUMBERS = [
  '+919876543210',
  '+919876543211',
  '+919876543212',
  '+918765432109',
  '+918765432108',
];

/**
 * Sample email addresses
 */
export const SAMPLE_EMAIL_ADDRESSES = [
  'alice.demo@example.com',
  'bob.demo@example.com',
  'charlie.demo@example.com',
  'diana.demo@example.com',
  'eve.demo@example.com',
];

/**
 * Sample Indian city/state combinations
 */
export const SAMPLE_INDIAN_CITIES = [
  { city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { city: 'New Delhi', state: 'Delhi', pincode: '110001' },
  { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
  { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
  { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
  { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
];

/**
 * Helper function to get random sample data
 */
export function getRandomSample<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Consolidated sample data object
 */
export const SAMPLE_DATA = {
  userProfile: SAMPLE_USER_PROFILE,
  address: SAMPLE_ADDRESS,
  addresses: SAMPLE_ADDRESSES,
  payment: SAMPLE_PAYMENT,
  otp: SAMPLE_OTP,
  bankAccount: SAMPLE_BANK_ACCOUNT,
  company: SAMPLE_COMPANY,
  socialMedia: SAMPLE_SOCIAL_MEDIA,
  emergencyContact: SAMPLE_EMERGENCY_CONTACT,
  preferences: SAMPLE_PREFERENCES,
  apiCredentials: SAMPLE_API_CREDENTIALS,
  dates: SAMPLE_DATES,
  files: SAMPLE_FILES,
  errors: SAMPLE_ERRORS,
  success: SAMPLE_SUCCESS,
  phoneNumbers: SAMPLE_PHONE_NUMBERS,
  emails: SAMPLE_EMAIL_ADDRESSES,
  cities: SAMPLE_INDIAN_CITIES,
};

export default SAMPLE_DATA;

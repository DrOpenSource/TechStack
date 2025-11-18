/**
 * Component Templates
 * Sample component templates for the preview system
 */

export { default as HeroSection } from './HeroSection';
export { default as UserProfileCard } from './UserProfileCard';
export { default as DashboardChart } from './DashboardChart';
export { default as LoginForm } from './LoginForm';
export { default as ProductCard } from './ProductCard';

// Template metadata for ComponentGallery
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  thumbnail?: string;
}

// Export template code as strings for preview system
export const templateCodes = {
  heroSection: `// HeroSection template code
// Import the template file to get the actual code`,
  userProfileCard: `// UserProfileCard template code
// Import the template file to get the actual code`,
  dashboardChart: `// DashboardChart template code
// Import the template file to get the actual code`,
  loginForm: `// LoginForm template code
// Import the template file to get the actual code`,
  productCard: `// ProductCard template code
// Import the template file to get the actual code`,
};

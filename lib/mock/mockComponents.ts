/**
 * Mock Components Data
 * Generated UI components with sample code
 */

export interface MockComponent {
  id: string;
  name: string;
  description: string;
  category: 'form' | 'layout' | 'navigation' | 'data-display' | 'feedback' | 'button';
  code: string;
  preview?: string;
  props?: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: any;
    description: string;
  }>;
  examples?: Array<{
    title: string;
    code: string;
  }>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const mockComponents: MockComponent[] = [
  {
    id: 'comp-login-form',
    name: 'LoginForm',
    description: 'Email and password login form with validation',
    category: 'form',
    code: `import { useState } from 'react';

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({ email, password });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  );
}`,
    preview: 'https://placeholder.com/login-form-preview.png',
    props: [
      {
        name: 'onSubmit',
        type: '(data: { email: string; password: string }) => void',
        required: true,
        description: 'Callback function called when form is submitted',
      },
    ],
    tags: ['authentication', 'form', 'validation'],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    id: 'comp-dashboard-card',
    name: 'DashboardCard',
    description: 'Metric display card for dashboards',
    category: 'data-display',
    code: `export default function DashboardCard({ title, value, change, icon: Icon }) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={\`text-sm font-medium \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
                {isPositive ? '↑' : '↓'} {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-100 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}`,
    props: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Card title',
      },
      {
        name: 'value',
        type: 'string | number',
        required: true,
        description: 'Main metric value to display',
      },
      {
        name: 'change',
        type: 'number',
        required: false,
        description: 'Percentage change from previous period',
      },
      {
        name: 'icon',
        type: 'React.ComponentType',
        required: false,
        description: 'Icon component to display',
      },
    ],
    tags: ['dashboard', 'metrics', 'analytics'],
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: 'comp-data-table',
    name: 'DataTable',
    description: 'Sortable and paginated data table',
    category: 'data-display',
    code: `import { useState } from 'react';

export default function DataTable({ columns, data, pageSize = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                {column.label}
                {sortConfig.key === column.key && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((row, idx) => (
            <tr key={idx}>
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}`,
    props: [
      {
        name: 'columns',
        type: 'Array<{ key: string; label: string }>',
        required: true,
        description: 'Column definitions',
      },
      {
        name: 'data',
        type: 'Array<any>',
        required: true,
        description: 'Table data',
      },
      {
        name: 'pageSize',
        type: 'number',
        required: false,
        default: 10,
        description: 'Number of rows per page',
      },
    ],
    tags: ['table', 'pagination', 'sorting'],
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2024-11-05'),
  },
  {
    id: 'comp-navbar',
    name: 'Navbar',
    description: 'Responsive navigation bar with mobile menu',
    category: 'navigation',
    code: `import { useState } from 'react';

export default function Navbar({ logo, links, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {logo}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user && (
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
                <span className="ml-3 text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}`,
    props: [
      {
        name: 'logo',
        type: 'React.ReactNode',
        required: true,
        description: 'Logo element',
      },
      {
        name: 'links',
        type: 'Array<{ href: string; label: string }>',
        required: true,
        description: 'Navigation links',
      },
      {
        name: 'user',
        type: '{ name: string; avatar: string } | null',
        required: false,
        description: 'Current user info',
      },
    ],
    tags: ['navigation', 'responsive', 'menu'],
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-10-15'),
  },
  {
    id: 'comp-modal',
    name: 'Modal',
    description: 'Accessible modal dialog component',
    category: 'feedback',
    code: `import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-3 p-6 border-t">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`,
    props: [
      {
        name: 'isOpen',
        type: 'boolean',
        required: true,
        description: 'Control modal visibility',
      },
      {
        name: 'onClose',
        type: '() => void',
        required: true,
        description: 'Callback when modal should close',
      },
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Modal title',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        required: true,
        description: 'Modal content',
      },
      {
        name: 'footer',
        type: 'React.ReactNode',
        required: false,
        description: 'Modal footer content (typically buttons)',
      },
    ],
    tags: ['modal', 'dialog', 'overlay'],
    createdAt: new Date('2024-06-05'),
    updatedAt: new Date('2024-09-28'),
  },
];

/**
 * Get component by ID
 */
export const getComponentById = (id: string): MockComponent | undefined => {
  return mockComponents.find(comp => comp.id === id);
};

/**
 * Get components by category
 */
export const getComponentsByCategory = (category: MockComponent['category']): MockComponent[] => {
  return mockComponents.filter(comp => comp.category === category);
};

/**
 * Search components by tag
 */
export const searchComponentsByTag = (tag: string): MockComponent[] => {
  return mockComponents.filter(comp =>
    comp.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

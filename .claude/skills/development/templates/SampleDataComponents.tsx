/**
 * Sample Data UI Components
 *
 * React components for displaying sample data hints and auto-fill buttons
 * in development/demo mode.
 *
 * @see .claude/skills/development/mock-first-development.md
 */

import React from 'react';
import { mockConfig } from './mockConfig';

/**
 * Props interfaces
 */
interface SampleDataHintProps {
  children: React.ReactNode;
  className?: string;
}

interface AutoFillButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

interface FormWithSampleDataProps {
  sampleData: Record<string, any>;
  onFill: (data: Record<string, any>) => void;
  children: React.ReactNode;
  showHints?: boolean;
}

/**
 * Sample Data Hint Component
 *
 * Displays helpful hints with sample data suggestions.
 * Only visible in mock mode.
 *
 * @example
 * <Input
 *   name="email"
 *   helperText={
 *     <SampleDataHint>
 *       Try: alice.demo@example.com
 *     </SampleDataHint>
 *   }
 * />
 */
export function SampleDataHint({ children, className = '' }: SampleDataHintProps) {
  if (!mockConfig.enabled) return null;

  return (
    <span className={`text-xs text-muted-foreground italic ${className}`}>
      💡 {children}
    </span>
  );
}

/**
 * Auto Fill Button Component
 *
 * Button that fills form with sample data.
 * Only visible in mock mode.
 *
 * @example
 * <AutoFillButton
 *   onClick={() => setFormData(SAMPLE_DATA.userProfile)}
 *   label="Use Sample Profile"
 * />
 */
export function AutoFillButton({
  onClick,
  label = 'Use Sample Data',
  className = '',
  disabled = false,
}: AutoFillButtonProps) {
  if (!mockConfig.enabled) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        text-sm font-medium text-primary hover:underline
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      ⚡ {label}
    </button>
  );
}

/**
 * Mock Mode Badge
 *
 * Visual indicator that the app is running in mock mode.
 * Useful for demos and development.
 *
 * @example
 * <MockModeBadge position="top-right" />
 */
export function MockModeBadge({
  position = 'top-right',
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  if (!mockConfig.enabled) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50
        bg-yellow-500 text-black text-xs font-bold
        px-3 py-1 rounded-full shadow-lg
        animate-pulse
      `}
      title="Running in mock mode - no real backend required"
    >
      🧪 MOCK MODE
    </div>
  );
}

/**
 * Form with Sample Data Wrapper
 *
 * Wraps a form and provides auto-fill functionality.
 *
 * @example
 * <FormWithSampleData
 *   sampleData={SAMPLE_DATA.userProfile}
 *   onFill={setFormData}
 * >
 *   <Input name="name" />
 *   <Input name="email" />
 * </FormWithSampleData>
 */
export function FormWithSampleData({
  sampleData,
  onFill,
  children,
  showHints = true,
}: FormWithSampleDataProps) {
  if (!mockConfig.enabled) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      {showHints && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <span>💡</span>
            <span>Need sample data for testing?</span>
          </div>
          <AutoFillButton
            onClick={() => onFill(sampleData)}
            label="Fill with Sample Data"
          />
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Field Sample Data Hint
 *
 * Displays sample value below input field with click-to-fill.
 *
 * @example
 * <Input name="email" />
 * <FieldSampleHint value="alice.demo@example.com" onUse={setValue} />
 */
export function FieldSampleHint({
  value,
  onUse,
}: {
  value: string;
  onUse: (value: string) => void;
}) {
  if (!mockConfig.enabled) return null;

  return (
    <button
      type="button"
      onClick={() => onUse(value)}
      className="text-xs text-muted-foreground hover:text-primary hover:underline text-left"
    >
      💡 Try: <span className="font-mono">{value}</span>
    </button>
  );
}

/**
 * Loading State Indicator (shows mock delay)
 *
 * Shows when mock API is simulating network delay.
 *
 * @example
 * {isLoading && <MockLoadingIndicator />}
 */
export function MockLoadingIndicator() {
  if (!mockConfig.enabled) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
      <span>Simulating network delay ({mockConfig.delay}ms)...</span>
    </div>
  );
}

/**
 * Mock Error Simulator
 *
 * Button to trigger mock errors for testing error states.
 * Only visible in development mode.
 *
 * @example
 * <MockErrorSimulator onError={handleError} />
 */
export function MockErrorSimulator({
  onError,
}: {
  onError: (error: Error) => void;
}) {
  if (!mockConfig.enabled || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onError(new Error('Simulated error for testing'))}
      className="text-xs text-red-600 hover:underline"
    >
      🧪 Simulate Error
    </button>
  );
}

/**
 * Mock Data Inspector
 *
 * Shows current mock configuration and allows runtime changes.
 * Only visible in development mode.
 */
export function MockDataInspector() {
  if (!mockConfig.enabled || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-purple-700"
      >
        🔧 Mock Inspector
      </button>

      {isExpanded && (
        <div className="absolute bottom-12 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
          <h3 className="font-bold text-sm mb-3">Mock Configuration</h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="font-mono text-green-600">ENABLED</span>
            </div>

            <div className="flex justify-between">
              <span>Delay:</span>
              <span className="font-mono">{mockConfig.delay}ms</span>
            </div>

            <div className="flex justify-between">
              <span>Error Rate:</span>
              <span className="font-mono">{mockConfig.errorRate}%</span>
            </div>

            <hr className="my-2" />

            <div>
              <div className="font-semibold mb-1">Features:</div>
              {Object.entries(mockConfig.features).map(([key, enabled]) => (
                <div key={key} className="flex justify-between pl-2">
                  <span>{key}:</span>
                  <span className={enabled ? 'text-green-600' : 'text-red-600'}>
                    {enabled ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * OTP Input with Mock Hint
 *
 * OTP input that shows the mock OTP code in development.
 *
 * @example
 * <OTPInputWithHint value={otp} onChange={setOtp} />
 */
export function OTPInputWithHint({
  value,
  onChange,
  mockCode = '123456',
}: {
  value: string;
  onChange: (value: string) => void;
  mockCode?: string;
}) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={6}
        className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest font-mono"
        placeholder="000000"
      />

      {mockConfig.enabled && (
        <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <span className="text-yellow-800">
            📱 Mock OTP: <span className="font-mono font-bold">{mockCode}</span>
          </span>
          <button
            type="button"
            onClick={() => onChange(mockCode)}
            className="text-yellow-800 hover:underline font-medium"
          >
            Auto-fill
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example Usage Component
 */
export function ExampleFormWithMockData() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
  });

  const SAMPLE = {
    name: 'Alice Johnson',
    email: 'alice.demo@example.com',
    phone: '+919876543210',
  };

  return (
    <FormWithSampleData
      sampleData={SAMPLE}
      onFill={setFormData}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <FieldSampleHint
            value={SAMPLE.name}
            onUse={val => setFormData({ ...formData, name: val })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <FieldSampleHint
            value={SAMPLE.email}
            onUse={val => setFormData({ ...formData, email: val })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <FieldSampleHint
            value={SAMPLE.phone}
            onUse={val => setFormData({ ...formData, phone: val })}
          />
        </div>
      </div>
    </FormWithSampleData>
  );
}

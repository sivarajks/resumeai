export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
]

export const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'UAE',
  'Singapore', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden',
  'Norway', 'Denmark', 'Switzerland', 'Ireland', 'Japan', 'South Korea', 'China',
  'Hong Kong', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand', 'Vietnam',
  'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Saudi Arabia', 'Qatar',
  'Kuwait', 'South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Brazil', 'Mexico',
  'Argentina', 'New Zealand', 'Other',
]

export function formatPhone(personalInfo) {
  if (!personalInfo?.phone) return ''
  const code = personalInfo.phoneCountryCode || ''
  const phone = personalInfo.phone
  if (code && !phone.startsWith('+')) return `${code} ${phone}`
  return phone
}

export function formatLocation(personalInfo) {
  if (!personalInfo) return ''
  const { city, state, country, pincode, address } = personalInfo
  if (city || state || country || pincode) {
    const parts = [city, state, country].filter(Boolean).join(', ')
    return pincode ? `${parts} - ${pincode}` : parts
  }
  return address || ''
}

export const TEMPLATE_COLORS = {
  modern: [
    { name: 'Blue', value: '#1d4ed8' },
    { name: 'Indigo', value: '#4338ca' },
    { name: 'Sky', value: '#0284c7' },
    { name: 'Slate', value: '#334155' },
    { name: 'Emerald', value: '#047857' },
  ],
  classic: [
    { name: 'Black', value: '#111827' },
    { name: 'Navy', value: '#1e3a8a' },
    { name: 'Burgundy', value: '#7f1d1d' },
    { name: 'Forest', value: '#14532d' },
    { name: 'Charcoal', value: '#374151' },
  ],
  minimal: [
    { name: 'Teal', value: '#0d9488' },
    { name: 'Rose', value: '#be123c' },
    { name: 'Amber', value: '#b45309' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Slate', value: '#475569' },
  ],
  creative: [
    { name: 'Violet', value: '#6d28d9' },
    { name: 'Fuchsia', value: '#a21caf' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Cyan', value: '#0891b2' },
  ],
  europass: [
    { name: 'EU Blue', value: '#003399' },
    { name: 'Navy', value: '#1e3a8a' },
    { name: 'Royal', value: '#1d4ed8' },
    { name: 'Burgundy', value: '#7f1d1d' },
    { name: 'Forest', value: '#14532d' },
  ],
}

export function getTemplateColor(template, custom) {
  if (custom) return custom
  return TEMPLATE_COLORS[template]?.[0]?.value || '#1d4ed8'
}

# Kho Vận Express - AI Coding Assistant Instructions

## Project Overview
**Kho Vận Express** is a modern Vietnamese logistics and warehouse management web application built with React 19, TypeScript, and Vite. It's designed as a single-page application with a dashboard-style interface for managing inventory, shipments, and suppliers.

## Architecture & Key Patterns

### Component Structure
- **App.tsx**: Main router using view state (`Dashboard | Inventory | Shipments | Suppliers`)
- **components/**: Feature-based components with Vietnamese UI text
- **services/**: Business logic split between `mockDataService.ts` (data) and `geminiService.ts` (AI features)
- **types.ts**: Centralized TypeScript interfaces with Vietnamese enum values

### State Management
- Uses React hooks (`useState`, `useEffect`) - no external state management
- Async data loading pattern: `setLoading(true) → fetch → setLoading(false)`
- All API calls return Promises with artificial 500ms delays

### Styling Approach
- **Tailwind CSS** via CDN in `index.html` with dark mode support
- Consistent design system: `slate` grays, `primary` blues, status colors (amber, green, red)
- Responsive design with `md:` and `lg:` breakpoints
- Custom animations: `animate-fade-in-scale` for modals

### Data Flow
```
mockDataService.ts → Component State → UI Rendering
geminiService.ts → AI Analysis → Display Results
```

## Vietnamese Localization
- **All UI text** is in Vietnamese (buttons, labels, status messages)
- **Enum values** use Vietnamese text: `ShipmentStatus.Pending = 'Chờ xử lý'`
- **Data structure** includes Vietnamese addresses, names, and business terms
- Keep this pattern when adding new features

## AI Integration Patterns

### Gemini API Integration
- Uses `@google/genai` library with `process.env.API_KEY`
- **Error handling**: Always check for missing API key first
- **Two main functions**:
  - `generateInventorySummary()`: Analyzes inventory data in Vietnamese
  - `generateSupplierSuggestions()`: Uses structured JSON schema responses

### AI Features Implementation
- Async loading states with spinners and disabled buttons
- Error boundaries with Vietnamese error messages
- Results displayed in dismissible cards with close buttons

## Development Workflow

### Environment Setup
```bash
npm install
# Set GEMINI_API_KEY in .env.local
npm run dev  # Vite dev server
npm run build  # Production build
```

### Key Dependencies
- `react@^19.1.1` with new JSX transform
- `@google/genai@^1.20.0` for AI features
- `recharts@^3.2.1` for dashboard charts
- Tailwind CSS via CDN (not npm package)

### File Organization
- Components follow Vietnamese naming in UI but English filenames
- Mock data uses realistic Vietnamese business data (addresses, names)
- Icons from Heroicons via inline SVG (stored in `constants.tsx`)

## Common Patterns

### Modal Implementation
```tsx
// Portal-style modal with backdrop click to close
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
  <div className="transform transition-all animate-fade-in-scale">
    {/* Modal content */}
  </div>
</div>
```

### Status Indicators
Use consistent color coding:
- **Pending/Warning**: `amber` (yellow)
- **In Progress**: `blue`
- **Success/Delivered**: `green`
- **Error/Cancelled**: `red`
- **Neutral**: `slate`

### Table Patterns
- Responsive tables with `overflow-x-auto`
- Hover effects: `hover:bg-slate-50 dark:hover:bg-slate-700/50`
- Status badges: `px-2.5 py-1 rounded-full text-xs font-semibold`

## Integration Points

### Mock Data Service
- Simulates REST API with async/await pattern
- Returns realistic Vietnamese business data
- Use for all CRUD operation mock-ups

### Charts (Recharts)
- Bar charts for activity data
- Pie charts for status distribution
- Responsive containers with dark mode support

### Environment Variables
- `GEMINI_API_KEY`: Required for AI features
- Vite exposes as `process.env.API_KEY` via config

## Best Practices
- Always include loading states for async operations
- Maintain Vietnamese UI text consistency
- Use TypeScript interfaces from `types.ts`
- Follow existing component patterns for new features
- Test both light and dark modes
- Keep business logic in service files, not components
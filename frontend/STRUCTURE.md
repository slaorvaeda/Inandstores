# Frontend Project Structure

This document outlines the organized structure of the frontend application.

## 📁 Directory Structure

```
frontend/src/
├── assets/                 # Static assets and context providers
│   ├── AuthContext.jsx     # Authentication context
│   ├── DarkModeContext.jsx # Dark mode context
│   └── img/               # Images and logos
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   │   ├── Button.jsx    # Reusable button component
│   │   ├── Input.jsx     # Reusable input component
│   │   ├── Card.jsx      # Reusable card component
│   │   ├── Badge.jsx     # Reusable badge component
│   │   ├── Modal.jsx     # Reusable modal component
│   │   ├── Table.jsx     # Reusable table component
│   │   └── index.js      # UI components exports
│   └── common/           # Legacy common components
├── features/             # Feature-based organization
│   └── khata/           # Khata book feature
│       ├── components/   # Khata-specific components
│       │   ├── KhataList.jsx
│       │   └── KhataDetail.jsx
│       └── index.js     # Feature exports
├── hooks/               # Custom React hooks
│   ├── useKhatas.js     # Khata management hook
│   └── useRedirectIfAuthenticated.js
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── login.jsx
│   └── signup.jsx
├── services/            # API service layer
│   ├── khataService.js  # Khata API service
│   └── googleAuthService.js
├── utils/               # Utility functions
│   └── formatters.js    # Data formatting utilities
├── Routes/              # Routing configuration
│   └── Router.jsx
├── config/              # Configuration files
│   └── firebase.js
├── App.jsx              # Main app component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## 🎯 Key Principles

### 1. **Feature-Based Organization**
- Each feature has its own directory under `features/`
- Features contain their own components, hooks, and services
- Promotes modularity and maintainability

### 2. **Reusable UI Components**
- Base UI components in `components/ui/`
- Consistent design system across the app
- Easy to maintain and update

### 3. **Service Layer**
- API calls abstracted into service files
- Centralized error handling
- Easy to mock for testing

### 4. **Custom Hooks**
- Business logic separated from components
- Reusable state management
- Clean component code

## 🧩 UI Components

### Button Component
```jsx
import { UIButton } from '../components/ui';

<UIButton variant="primary" size="md" loading={false}>
  Click me
</UIButton>
```

**Variants:** `primary`, `secondary`, `success`, `danger`, `warning`, `outline`, `ghost`
**Sizes:** `sm`, `md`, `lg`, `xl`

### Input Component
```jsx
import { UIInput } from '../components/ui';

<UIInput 
  label="Email"
  placeholder="Enter your email"
  error="Invalid email"
  leftIcon={<FaEnvelope />}
/>
```

### Card Component
```jsx
import { UICard } from '../components/ui';

<UICard variant="elevated">
  <UICard.Header>Title</UICard.Header>
  <UICard.Body>Content</UICard.Body>
  <UICard.Footer>Footer</UICard.Footer>
</UICard>
```

### Table Component
```jsx
import { UITable } from '../components/ui';

<UITable 
  columns={columns}
  data={data}
  loading={loading}
  pagination={pagination}
  onPageChange={handlePageChange}
/>
```

## 🔧 Usage Examples

### Using Khata Service
```jsx
import { khataService } from '../services/khataService';

// Get all khatas
const response = await khataService.getAllKhatas({ search: 'john' });

// Create new khata
const newKhata = await khataService.createKhata({
  personName: 'John Doe',
  phone: '1234567890'
});
```

### Using Custom Hook
```jsx
import { useKhatas } from '../hooks/useKhatas';

const MyComponent = () => {
  const { khatas, loading, error, createKhata } = useKhatas({
    search: 'john',
    status: 'active'
  });

  const handleCreate = async () => {
    await createKhata({ personName: 'Jane Doe' });
  };
};
```

## 🚀 Benefits

1. **Maintainability**: Clear separation of concerns
2. **Reusability**: Components and hooks can be reused
3. **Scalability**: Easy to add new features
4. **Consistency**: Unified design system
5. **Testing**: Easy to test individual components
6. **Performance**: Optimized re-renders with custom hooks

## 📝 Best Practices

1. **Import Organization**: Use index files for clean imports
2. **Component Props**: Use prop spreading for flexibility
3. **Error Handling**: Centralized in services and hooks
4. **Loading States**: Consistent loading indicators
5. **Responsive Design**: Mobile-first approach
6. **Accessibility**: ARIA labels and keyboard navigation

## 🔄 Migration Guide

When adding new features:

1. Create feature directory under `features/`
2. Add components in `components/` subdirectory
3. Create service file in `services/`
4. Add custom hooks in `hooks/`
5. Update routing in `Routes/Router.jsx`
6. Export from feature's `index.js`

This structure promotes clean, maintainable, and scalable code organization.

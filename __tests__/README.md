# Jest Unit Tests for Book Management Portal

This directory contains comprehensive unit tests for the Book Management Portal application using Jest and React Testing Library.

## 🧪 Test Structure

```
__tests__/
├── components/           # Component tests
│   └── AddFeedbackModal.test.tsx
├── hooks/               # Custom hook tests
│   └── useCreateFeedback.test.ts
├── lib/                 # API and utility tests
│   └── feedbackApi.test.ts
└── README.md           # This file
```

## 🚀 Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests for CI/CD
```bash
npm run test:ci
```

## 📋 Test Coverage

The tests cover the following areas:

### ✅ AddFeedbackModal Component
- **Rendering**: Modal visibility, book information display
- **Form Submission**: Data validation, API calls
- **Success Handling**: Toast notifications, modal closing
- **Error Handling**: Various error scenarios (409, 429, etc.)
- **Loading States**: Pending states, button disabling
- **Modal Actions**: Cancel button, form reset
- **Accessibility**: ARIA labels, keyboard navigation
- **Edge Cases**: Missing data, invalid IDs

### ✅ useCreateFeedback Hook
- **Initial State**: Default values and functions
- **API Integration**: Correct data passing
- **Error Handling**: API error management
- **Loading States**: Pending state management
- **Reset Functionality**: Error state clearing

### ✅ feedbackAPI Functions
- **All Endpoints**: GET, POST, PATCH, DELETE operations
- **Parameter Handling**: Query parameters, request bodies
- **Data Transformation**: Correct API calls
- **Error Scenarios**: Network failures, validation errors

## 🎯 Test Features

### Mocking Strategy
- **API Calls**: Mocked using Jest mocks
- **React Query**: Isolated testing with QueryClient
- **Material-UI**: Theme provider for consistent rendering
- **Next.js**: Router and navigation mocks
- **External Libraries**: Toast notifications, form handling

### Test Utilities
- **TestWrapper**: Provides necessary context providers
- **Mock Data**: Realistic test data for components
- **User Events**: Simulated user interactions
- **Async Testing**: Proper handling of promises and async operations

### Coverage Goals
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)
- **Environment**: jsdom for DOM testing
- **Module Mapping**: Path aliases for imports
- **Transform**: TypeScript support
- **Coverage**: Comprehensive coverage collection
- **Test Patterns**: Flexible test file discovery

### Setup File (`jest.setup.js`)
- **Testing Library**: Jest DOM matchers
- **Next.js Mocks**: Router and navigation
- **Browser APIs**: localStorage, matchMedia, etc.
- **Console Suppression**: Clean test output

## 📝 Writing New Tests

### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Hook Tests
```typescript
import { renderHook, waitFor } from '@testing-library/react';

describe('useCustomHook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(expectedValue);
  });
});
```

### API Tests
```typescript
import { apiFunction } from '@/lib/api';

jest.mock('@/lib/api');

describe('apiFunction', () => {
  it('should call API with correct parameters', async () => {
    mockApi.get.mockResolvedValue({ data: mockData });
    await apiFunction(params);
    expect(mockApi.get).toHaveBeenCalledWith(expectedUrl);
  });
});
```

## 🐛 Debugging Tests

### Common Issues
1. **Async Operations**: Use `waitFor` for async state changes
2. **Mocking**: Ensure mocks are properly configured
3. **Context**: Wrap components with necessary providers
4. **Cleanup**: Clear mocks between tests

### Debug Commands
```bash
# Run specific test file
npm test AddFeedbackModal.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

## 📊 Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive Names**: Use clear, descriptive test names
3. **Single Responsibility**: One test per behavior
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Cover error scenarios and edge cases
6. **Maintainable**: Keep tests simple and readable
7. **Fast Execution**: Avoid unnecessary complexity
8. **Reliable**: Tests should be deterministic

## 🔄 Continuous Integration

Tests are configured to run in CI/CD pipelines with:
- **No Watch Mode**: `--watchAll=false`
- **Coverage Reports**: Detailed coverage information
- **Fail on Coverage**: Tests fail if coverage drops below threshold
- **Parallel Execution**: Faster test execution

## 📈 Coverage Reports

Coverage reports are generated in the `coverage/` directory:
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Format**: `coverage/lcov.info`
- **JSON Format**: `coverage/coverage-final.json`

## 🎉 Success Metrics

- ✅ **100% Test Coverage** for critical components
- ✅ **Fast Execution** (< 30 seconds for full suite)
- ✅ **Reliable Results** (no flaky tests)
- ✅ **Clear Documentation** (comprehensive test descriptions)
- ✅ **Maintainable Code** (easy to update and extend)

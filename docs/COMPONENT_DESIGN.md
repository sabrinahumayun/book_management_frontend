# 🧩 Component Design Documentation

## Overview
This document outlines the component design patterns, naming conventions, and best practices used throughout the Book Management Portal Frontend.

## 🎯 Design Principles

### **1. Single Responsibility Principle**
Each component should have one clear purpose and responsibility.

### **2. Composition over Inheritance**
Build complex UIs by composing smaller, focused components.

### **3. Props Interface Design**
Clear, typed interfaces that make component usage obvious.

### **4. Accessibility First**
All components should be accessible by default.

## 📋 Component Categories

### **1. Layout Components**
Components that define the overall structure and layout of the application.

#### **Layout.tsx**
- **Purpose**: Main application layout wrapper
- **Props**: `children`, `title?`
- **Features**: Sidebar, header, main content area
- **Responsive**: Mobile-first design

#### **AdminLayout.tsx**
- **Purpose**: Admin-specific layout with admin sidebar
- **Props**: `children`
- **Features**: Admin navigation, user management tools
- **Accessibility**: ARIA labels for admin features

#### **Sidebar.tsx**
- **Purpose**: Navigation sidebar component
- **Props**: `open`, `onClose`, `variant`
- **Features**: Collapsible, responsive, role-based navigation
- **State**: Local state for mobile/desktop behavior

### **2. Feature Components**
Components that implement specific business features.

#### **BookCard.tsx**
- **Purpose**: Display individual book information
- **Props**: `book`, `onEdit?`, `onDelete?`, `showActions?`
- **Features**: Book details, action buttons, responsive design
- **Variants**: Grid view, list view

#### **BookList.tsx**
- **Purpose**: Display collection of books
- **Props**: `books`, `loading`, `onBookClick?`
- **Features**: Grid/list toggle, pagination, search
- **Performance**: Virtualization for large lists

#### **UserTable.tsx**
- **Purpose**: Display user management table
- **Props**: `users`, `onEdit`, `onDelete`, `onBulkDelete`
- **Features**: Sorting, filtering, bulk operations
- **Accessibility**: Keyboard navigation, screen reader support

### **3. Modal Components**
Components that provide overlay dialogs and forms.

#### **AddBookModal.tsx**
- **Purpose**: Book creation form modal
- **Props**: `open`, `onClose`, `onSuccess`
- **Features**: Form validation, error handling, loading states
- **Validation**: Client-side and server-side validation

#### **EditBookModal.tsx**
- **Purpose**: Book editing form modal
- **Props**: `open`, `onClose`, `book`, `onSuccess`
- **Features**: Pre-populated form, update functionality
- **State**: Form state management with React Hook Form

#### **DeleteDialog.tsx**
- **Purpose**: Confirmation dialog for deletions
- **Props**: `open`, `onClose`, `onConfirm`, `title`, `message`
- **Features**: Confirmation text, loading states
- **Safety**: Prevents accidental deletions

### **4. Form Components**
Components that handle user input and form interactions.

#### **FeedbackForm.tsx**
- **Purpose**: Review submission form
- **Props**: `book`, `onSubmit`, `initialData?`
- **Features**: Rating input, comment field, validation
- **UX**: Real-time validation, character count

#### **SearchBar.tsx**
- **Purpose**: Search input component
- **Props**: `onSearch`, `placeholder`, `debounceMs?`
- **Features**: Debounced search, clear button
- **Performance**: Optimized for frequent updates

### **5. Navigation Components**
Components that handle navigation and routing.

#### **Navigation.tsx**
- **Purpose**: Main navigation component
- **Props**: `user`, `onLogout`
- **Features**: User menu, logout functionality
- **Responsive**: Mobile hamburger menu


## 🎨 Component Design Patterns

### **1. Compound Component Pattern**
```typescript
// Usage
<Card>
  <Card.Header>
    <Card.Title>Book Title</Card.Title>
  </Card.Header>
  <Card.Content>
    <Card.Description>Book description</Card.Description>
  </Card.Content>
  <Card.Actions>
    <Card.ActionButton>Edit</Card.ActionButton>
  </Card.Actions>
</Card>

// Implementation
const Card = ({ children, ...props }) => (
  <MuiCard {...props}>{children}</MuiCard>
);

Card.Header = ({ children }) => <CardHeader>{children}</CardHeader>;
Card.Title = ({ children }) => <CardTitle>{children}</CardTitle>;
Card.Content = ({ children }) => <CardContent>{children}</CardContent>;
```

### **2. Render Props Pattern**
```typescript
interface DataFetcherProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  children: (data: { data: T; loading: boolean; error: Error | null }) => React.ReactNode;
}

function DataFetcher<T>({ queryKey, queryFn, children }: DataFetcherProps<T>) {
  const { data, isLoading, error } = useQuery({ queryKey, queryFn });
  
  return <>{children({ data, loading: isLoading, error })}</>;
}
```


### **4. Custom Hook Pattern**
```typescript
function useBookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const createBook = useCallback(async (bookData: CreateBookData) => {
    setLoading(true);
    try {
      const newBook = await booksAPI.createBook(bookData);
      setBooks(prev => [...prev, newBook]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { books, loading, error, createBook };
}
```

## 📝 Naming Conventions

### **1. Component Names**
- **PascalCase**: `BookCard`, `UserTable`, `AddBookModal`
- **Descriptive**: Names should clearly indicate purpose
- **Consistent**: Similar components follow same pattern

### **2. File Names**
- **PascalCase**: `BookCard.tsx`, `UserTable.tsx`
- **Component Name**: File name matches component name
- **Index Files**: `index.ts` for barrel exports

### **3. Props Naming**
- **camelCase**: `onBookClick`, `isLoading`, `showActions`
- **Boolean Prefixes**: `is`, `has`, `should`, `can`
- **Event Handlers**: `on` prefix for event handlers

### **4. CSS Classes**
- **kebab-case**: `book-card`, `user-table`, `modal-content`
- **BEM Methodology**: `book-card__title`, `book-card--featured`
- **Utility Classes**: Tailwind utility classes

## 🎯 Props Interface Design

### **1. Required vs Optional Props**
```typescript
interface BookCardProps {
  // Required props
  book: Book;
  
  // Optional props with defaults
  showActions?: boolean;
  variant?: 'grid' | 'list';
  onBookClick?: (book: Book) => void;
  
  // Optional props without defaults
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}
```

### **2. Union Types for Variants**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
}
```

### **3. Generic Components**
```typescript
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
}
```

## ♿ Accessibility Patterns

### **1. ARIA Labels**
```typescript
<Button
  aria-label="Delete book"
  onClick={handleDelete}
>
  <DeleteIcon />
</Button>
```

### **2. Keyboard Navigation**
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};
```

### **3. Focus Management**
```typescript
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (open && modalRef.current) {
    modalRef.current.focus();
  }
}, [open]);
```

### **4. Screen Reader Support**
```typescript
<div role="alert" aria-live="polite">
  {error && <ErrorMessage message={error.message} />}
</div>
```

## 🎨 Styling Patterns

### **1. Theme-based Styling**
```typescript
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));
```

### **2. Responsive Styling**
```typescript
const ResponsiveGrid = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(2),
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));
```

### **3. Conditional Styling**
```typescript
const StyledButton = styled(Button)<{ variant: 'primary' | 'secondary' }>(({ theme, variant }) => ({
  backgroundColor: variant === 'primary' 
    ? theme.palette.primary.main 
    : theme.palette.secondary.main,
  color: variant === 'primary' 
    ? theme.palette.primary.contrastText 
    : theme.palette.secondary.contrastText,
}));
```

## 🔄 State Management Patterns

### **1. Local State**
```typescript
function BookCard({ book }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Component logic
}
```

### **2. Lifted State**
```typescript
function BookList({ books, onBookUpdate }: BookListProps) {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  
  const handleBookSelect = (book: Book) => {
    setSelectedBooks(prev => 
      prev.includes(book) 
        ? prev.filter(b => b.id !== book.id)
        : [...prev, book]
    );
  };
}
```

### **3. Context State**
```typescript
const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
});
```

## 🧪 Testing Patterns

### **1. Component Testing**
```typescript
describe('BookCard', () => {
  it('renders book information correctly', () => {
    const mockBook = { id: 1, title: 'Test Book', author: 'Test Author' };
    
    render(<BookCard book={mockBook} />);
    
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });
});
```

### **2. User Interaction Testing**
```typescript
it('calls onBookClick when clicked', async () => {
  const mockOnClick = jest.fn();
  const user = userEvent.setup();
  
  render(<BookCard book={mockBook} onBookClick={mockOnClick} />);
  
  await user.click(screen.getByRole('button'));
  
  expect(mockOnClick).toHaveBeenCalledWith(mockBook);
});
```

## 📦 Component Composition Examples

### **1. Complex Form Component**
```typescript
function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  return (
    <FormProvider>
      <form onSubmit={handleSubmit}>
        <FormField name="title" label="Title" required />
        <FormField name="author" label="Author" required />
        <FormField name="isbn" label="ISBN" />
        <FormField name="description" label="Description" multiline />
        
        <FormActions>
          <Button type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </FormActions>
      </form>
    </FormProvider>
  );
}
```

### **2. Data Table Component**
```typescript
function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow 
              key={index} 
              onClick={() => onRowClick?.(row)}
              hover
            >
              {columns.map(column => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```



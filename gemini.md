# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router routes and layouts (e.g., `app/page.tsx`, `app/layout.tsx`). Co-locate route-specific components near the page when possible.
- `public/`: Static assets served as-is (e.g., `public/images/heguidesme_logo.png`).
- `docs/`: Product and design references (`docs/prd.md`, `docs/brand-theme.md`). Keep these in sync with UI decisions.
- Root configs: `next.config.ts`, `tsconfig.json` (TypeScript `strict`), `eslint.config.mjs`.


## UI/UX Guidelines

You're a professiional mobile UI/Ux designer who has worked on multiple global projects and is highly regarded as a top dribbble designer, you pay attention to details and ensure your interface is elegant, uncluttered and not bland, you have a strong appreciation of style. And you build delightful and intuitive user interfaces that are easy to use and understand with the goal of delivering a seamless experience to users. 

## Build, Test, and Development Commands
This repo uses `pnpm` (see `pnpm-lock.yaml`).

- `pnpm dev`: Start the local dev server at `http://localhost:3000`.
- `pnpm build`: Create a production build (use this to validate before PRs).
- `pnpm start`: Run the production server from a completed build.
- `pnpm lint`: Run ESLint using Next.js Core Web Vitals + TypeScript rules.

## Configuration & Security

- Put secrets in `.env.local` (never commit). When adding required variables, include an `.env.example` and update docs.
- Avoid logging sensitive user data (orders, contact forms) once Phase 1 backend work begins.

# AI Agent Development Guide for Next.js E-Commerce Platform

## Project Overview

This guide is for AI coding agents working on a modern Next.js 16.0.10 e-commerce platform with PostgreSQL database. Our development philosophy prioritizes simplicity, clarity, and incremental progress.

## User Experience Philosophy

Every feature must be delightful and intuitive. Users should accomplish tasks in the fewest steps possible. The app should be so simple that a 10-year-old could use it without assistance. This is non-negotiable.

## Core Development Principles

### 1. Start Simple, Add Complexity Later

**Always build the simplest working version first.** Don't over-engineer on the first pass.

**Example:** For a product listing page:

- **Step 1:** Display a static list of products with name and price
- **Step 2:** Add images and basic styling
- **Step 3:** Add filtering
- **Step 4:** Add sorting and pagination
- **Step 5:** Add advanced features like wishlist or compare

### 2. Separation of Concerns / Single Responsibility

Each component, function, or module should do ONE thing well. This makes code easier to understand, test, and maintain.

**Example:**

```typescript
// ❌ Bad - component does too much
function ProductCard({ product }) {
  // fetches data, handles cart logic, renders UI
  const { data } = useQuery(...)
  const addToCart = () => { /* complex logic */ }
  return <div>/* lots of JSX */</div>
}

// ✅ Good - each piece has one job
function ProductCard({ product, onAddToCart }) {
  return <ProductCardUI product={product} onAddToCart={onAddToCart} />
}

function ProductCardContainer({ productId }) {
  const { data: product } = useProduct(productId)
  const { mutate: addToCart } = useAddToCart()

  if (!product) return <ProductSkeleton />
  return <ProductCard product={product} onAddToCart={addToCart} />
}
```

### 3. Thin Vertical Slice / Walking Skeleton

For each feature ticket, deliver a small **end-to-end working version** that touches all layers (UI → API → Database → Response), but only the essentials.

**Example:** Adding a "wishlist" feature:

- **Walking Skeleton:** User clicks heart icon → API saves to database → icon turns red → page refetches
- **Skip for now:** Email notifications, sharing wishlist, analytics, recommendation engine

This proves the whole flow works before adding bells and whistles.

## Project Structure

```
/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, register)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx       # Auth layout wrapper
│   ├── (shop)/              # Main shop routes
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx # Product detail page
│   │   │   └── page.tsx     # Product listing
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   └── layout.tsx       # Shop layout with nav/footer
│   ├── (dashboard)/         # Admin/vendor dashboard
│   │   ├── layout.tsx
│   │   └── products/
│   │       └── page.tsx
│   ├── api/                 # API routes
│   │   ├── products/
│   │   │   └── route.ts
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── layout.tsx           # Root layout (fonts, providers)
│   └── page.tsx             # Home page
├── components/              # Shared components
│   ├── ui/                  # Base UI primitives (Button, Input, Card)
│   ├── products/            # Product-specific components
│   ├── cart/                # Cart-specific components
│   └── layout/              # Layout components (Header, Footer)
├── lib/                     # Core utilities and configurations
│   ├── api/                 # API client and data hooks
│   │   ├── client.ts        # Axios instance
│   │   ├── products.ts      # Product API hooks
│   │   └── cart.ts          # Cart API hooks
│   ├── db/                  # Database utilities
│   │   ├── client.ts        # PostgreSQL client (pg/Prisma)
│   │   └── queries/         # Reusable query functions
│   ├── auth/                # Authentication logic
│   └── utils.ts             # Helper functions
├── hooks/                   # Shared custom hooks
│   ├── use-cart.ts
│   └── use-product.ts
├── store/                   # Zustand stores for client state
│   ├── cart-store.ts
│   └── ui-store.ts
├── types/                   # TypeScript types
│   ├── product.ts
│   ├── user.ts
│   └── api.ts
├── constants/               # App constants (theme, config)
├── public/                  # Static assets
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
└── docs/                    # Testing documentation
```

### Route Organization

- **Route Groups:** Use `(groupName)` to organize routes without affecting URLs
  - `(auth)` for authentication flows
  - `(shop)` for customer-facing pages
  - `(dashboard)` for admin/vendor panels
- **Dynamic Routes:** Use `[param]` for dynamic segments (e.g., `products/[id]`)
- **Layouts:** Each route group should have its own `layout.tsx` for shared UI

## Tech Stack

### Core Framework

- **Next.js 16.0.10** (App Router)
- **React 19** (Server Components by default)
- **TypeScript** (strict mode enabled)

### Data & State Management

- **TanStack Query v5** - Server state, caching, data fetching
- **Zustand** - Lightweight client state (UI state, temporary data)
- **React Hook Form** - Performant form handling with minimal re-renders

### API & Database

- **Axios** - HTTP client for API calls
- **PostgreSQL** - Primary database
- **Prisma** (recommended) or **pg** - Database ORM/client

### UI & Styling

- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** (optional) - Accessible component primitives

## State Management Patterns

### Server State with TanStack Query

Use TanStack Query for **all API data**. Never store API responses in Zustand or useState.

```typescript
// lib/api/products.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";

// Query keys - centralized for cache invalidation
export const productsKeys = {
  all: ["products"] as const,
  lists: () => [...productsKeys.all, "list"] as const,
  list: (filters: string) => [...productsKeys.lists(), filters] as const,
  details: () => [...productsKeys.all, "detail"] as const,
  detail: (id: string) => [...productsKeys.details(), id] as const,
};

// Fetch products
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productsKeys.list(JSON.stringify(filters)),
    queryFn: () => apiClient.get("/products", { params: filters }),
  });
}

// Fetch single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => apiClient.get(`/products/${id}`),
    enabled: !!id, // Only run if id exists
  });
}

// Update product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductData) =>
      apiClient.patch(`/products/${data.id}`, data),
    onSuccess: (_, variables) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({
        queryKey: productsKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
}
```

**Key Patterns:**

- Define query keys centrally for easy cache invalidation
- Wrap queries in custom hooks for reusability
- Invalidate related queries on mutation success
- Use `enabled` option to control when queries run

### Client State with Zustand

Use Zustand only for **UI state** and **temporary local data** (theme, modals, form drafts).

```typescript
// store/cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    { name: "cart-storage" } // Persists to localStorage
  )
);
```

**When to use Zustand vs TanStack Query:**

- **Zustand:** Theme preference, modal open/close, temporary cart items (before checkout)
- **TanStack Query:** Products, orders, user profile, anything from the API

## Form Handling with React Hook Form

```typescript
// components/products/product-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.number().positive("Price must be positive"),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}

      <input type="number" {...register("price", { valueAsNumber: true })} />
      {errors.price && <span>{errors.price.message}</span>}

      <textarea {...register("description")} />

      <button type="submit">Save Product</button>
    </form>
  );
}
```

## API Client Setup

```typescript
// lib/api/client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## Database Patterns (PostgreSQL + Prisma)

### Schema Example

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  price       Decimal  @db.Decimal(10, 2)
  description String?
  imageUrl    String?
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String

  orderItems  OrderItem[]

  @@index([categoryId])
  @@index([slug])
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  products  Product[]
}
```

### API Route Example

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const products = await prisma.product.findMany({
      where: category ? { categoryId: category } : undefined,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        categoryId: body.categoryId,
        slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
```

## Performance Optimization

### 1. Use Server Components by Default

Server Components (the default in Next.js 16) reduce client JavaScript and improve initial load.

```typescript
// app/products/page.tsx - Server Component (default)
import { prisma } from "@/lib/db/client";

export default async function ProductsPage() {
  // Fetch directly in Server Component
  const products = await prisma.product.findMany();

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Optimize Client Components

Only add `"use client"` when you need:

- Hooks (useState, useEffect, etc.)
- Event handlers
- Browser-only APIs

```typescript
// components/cart/add-to-cart-button.tsx
"use client";

import { useCartStore } from "@/store/cart-store";

export function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  return <button onClick={() => addItem(product)}>Add to Cart</button>;
}
```

### 3. Implement Streaming and Suspense

```typescript
// app/products/page.tsx
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}

async function ProductsList() {
  const products = await prisma.product.findMany();
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 4. Memoize Expensive Computations

```typescript
"use client";

import { useMemo } from "react";

export function ProductList({ products, filters }: Props) {
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.category === filters.category &&
        product.price >= filters.minPrice &&
        product.price <= filters.maxPrice
    );
  }, [products, filters]);

  return (
    <div>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Security Best Practices

### 1. Environment Variables

```bash
# .env.local (never commit this file)
DATABASE_URL="postgresql://user:password@localhost:5432/mystore"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
```

```typescript
// Access in server components and API routes only
const dbUrl = process.env.DATABASE_URL;

// Access in client components (must be prefixed with NEXT_PUBLIC_)
const publicKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
```

### 2. API Route Protection

```typescript
// lib/auth/server.ts
import { getServerSession } from "next-auth";

export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

// app/api/admin/products/route.ts
import { requireAuth } from "@/lib/auth/server";

export async function POST(request: NextRequest) {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Admin-only logic here
}
```

### 3. Input Validation

Always validate user input with Zod or similar:

```typescript
// app/api/products/route.ts
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  categoryId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = createProductSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues },
      { status: 400 }
    );
  }

  // Proceed with validated data
  const product = await prisma.product.create({
    data: validation.data,
  });

  return NextResponse.json({ product });
}
```

### 4. SQL Injection Prevention

Prisma prevents SQL injection automatically. If using raw queries:

```typescript
// ✅ Safe - parameterized query
const products = await prisma.$queryRaw`
  SELECT * FROM Product WHERE name = ${userInput}
`;

// ❌ Dangerous - never concatenate user input
const products = await prisma.$queryRawUnsafe(
  `SELECT * FROM Product WHERE name = '${userInput}'`
);
```

## Coding Style & Conventions

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Naming Conventions

- **Components:** PascalCase (`ProductCard`, `UserProfile`)
- **Functions/Variables:** camelCase (`fetchProducts`, `userId`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_PRODUCTS`, `API_URL`)
- **Files:** kebab-case (`product-card.tsx`, `use-cart.ts`)
- **Types/Interfaces:** PascalCase (`Product`, `UserData`)

### Import Organization

```typescript
// 1. React and Next.js
import { useState } from "react";
import Link from "next/link";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. Internal imports (using @ alias)
import { Button } from "@/components/ui/button";
import { useProduct } from "@/lib/api/products";
import { formatPrice } from "@/lib/utils";

// 4. Types
import type { Product } from "@/types/product";
```

### Indentation & Formatting

- **Indentation:** 2 spaces (not tabs)
- **Line Length:** 80-100 characters (soft limit)
- **Semicolons:** Yes, always
- **Quotes:** Single quotes for strings, double for JSX attributes
- **Trailing Commas:** Yes (easier diffs)

## Testing Guidelines

### Test File Organization

```
__tests__/
├── components/
│   └── product-card.test.tsx
├── lib/
│   ├── api/
│   │   └── products.test.ts
│   └── utils.test.ts
└── hooks/
    └── use-cart.test.ts
```

### Testing Stack (Recommended)

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **MSW (Mock Service Worker)** - API mocking

### Example Component Test

```typescript
// __tests__/components/product-card.test.tsx
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/products/product-card";

describe("ProductCard", () => {
  const mockProduct = {
    id: "1",
    name: "Test Product",
    price: 29.99,
    imageUrl: "/test.jpg",
  };

  it("displays product name and price", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("displays product image", () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText("Test Product");
    expect(image).toHaveAttribute("src", expect.stringContaining("test.jpg"));
  });
});
```

### Testing Documentation

Document all tests in `docs/testing.md` using plain English that a 10-year-old can understand:

```markdown
# Product Card Tests

## What We're Testing

The product card that shows on the shop page.

## Why It Matters

If the product card breaks, customers can't see products or their prices. This would be bad for business!

## Tests We Run

1. **Shows the product name** - Makes sure the name appears on the card
2. **Shows the correct price** - Makes sure the price is displayed
3. **Shows the product picture** - Makes sure the image loads

## How to Run Tests

Type this in your terminal: `npm test product-card`
```

## Build & Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run linter and auto-fix
npm run lint:fix

# Run type checking
npm run type-check

# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Database commands (Prisma)
npx prisma migrate dev    # Create and apply migrations
npx prisma generate       # Generate Prisma Client
npx prisma studio         # Open database GUI
```

## Commit & Pull Request Guidelines

### Commit Messages

Keep commits small and focused. Use imperative mood (like giving commands):

```
✅ Good:
- Add product filtering by category
- Fix cart total calculation
- Update product schema with stock field

❌ Bad:
- Added some stuff
- Fixed bugs
- WIP
```

### Pull Request Template

Every PR should include:

1. **Summary:** What does this PR do? (1-2 sentences)
2. **Changes:** List of files/components changed
3. **Testing:** How did you verify it works?
4. **Screenshots:** For UI changes, include before/after
5. **Checklist:**
   - [ ] Code runs without errors
   - [ ] `npm run lint` passes
   - [ ] Types are correct (`npm run type-check`)
   - [ ] Tests pass (if applicable)
   - [ ] Documentation updated (if needed)

## Dependency Installation

Always use npm for consistency:

```bash
# Install production dependency
npm install package-name

# Install dev dependency
npm install -D package-name

# Install specific version
npm install package-name@1.2.3
```

## Common Patterns & Examples

### Server Action Example

```typescript
// app/actions/products.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/client";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);

  const product = await prisma.product.create({
    data: { name, price, slug: name.toLowerCase().replace(/\s+/g, "-") },
  });

  revalidatePath("/products");
  return { success: true, product };
}
```

### Parallel Data Fetching

```typescript
// app/products/[id]/page.tsx
export default async function ProductPage({ params }: Props) {
  // Fetch in parallel for better performance
  const [product, reviews, relatedProducts] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.review.findMany({ where: { productId: params.id } }),
    prisma.product.findMany({
      where: { categoryId: product.categoryId },
      take: 4,
    }),
  ]);

  return (
    <div>
      <ProductDetail product={product} />
      <ReviewsList reviews={reviews} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
```

## Explanation Guidelines

When explaining code or concepts to the developer:

1. **Use Plain English:** Avoid jargon or explain it immediately
2. **Use Analogies:** Compare to real-world things
3. **Break It Down:** Split complex ideas into simple steps
4. **Show Examples:** Code examples with comments
5. **Add a Glossary:** Define technical terms at the end

**Example Explanation:**

> **What is TanStack Query?**
>
> Imagine you have a notebook where you write down information from a library book. Instead of going back to the library every time you need that info, you just check your notebook. TanStack Query is like that notebook—it remembers data from the server so your app doesn't have to ask for it over and over again.
>
> **Glossary:**
>
> - **Server:** The computer that stores all the product and user data
> - **Cache:** A temporary storage place for data you've already fetched
> - **Query:** A request for specific data (like "give me all products")

## Agent-Specific Instructions

Before starting any task:

1. **Check for task-specific rules** in `.cursor/rules/` or project docs
2. **Read the ticket/issue carefully** - understand the goal
3. **Build the walking skeleton first** - get the simplest version working end-to-end
4. **Test locally** before committing
5. **Follow existing patterns** - match the style of surrounding code
6. **Ask clarifying questions** if requirements are unclear

Remember: Simple, working code is better than complex, broken code. Start small, iterate, and improve.

---

## Quick Reference

### When to Use What

| Need             | Use                                      |
| ---------------- | ---------------------------------------- |
| Fetch API data   | TanStack Query + custom hook             |
| Store UI state   | Zustand                                  |
| Handle forms     | React Hook Form + Zod                    |
| Make API calls   | Axios client                             |
| Database queries | Prisma (Server Components or API routes) |
| Validation       | Zod schemas                              |
| Styling          | Tailwind CSS                             |
| Authentication   | NextAuth.js or Firebase                  |

### File Naming

| Type      | Example                     |
| --------- | --------------------------- |
| Page      | `page.tsx`, `[id]/page.tsx` |
| Layout    | `layout.tsx`                |
| Component | `product-card.tsx`          |
| API route | `route.ts`                  |
| Hook      | `use-cart.ts`               |
| Store     | `cart-store.ts`             |
| Type      | `product.ts`                |
| Util      | `format-price.ts`           |

---

**Remember:** Keep it simple. Make it work. Then make it better.

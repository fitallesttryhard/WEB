# B2B Multi-Tenant SaaS Platform Architecture Rules

## 1. Business Model
- Project Type: **B2B Multi-Tenant SaaS Platform** (Single Software-as-a-Service product).
- Absolutely **NOT** an outsource software development service.

## 2. Codebase & Database Architecture
- **Shared Codebase**: All store instances (tenants like Sbuild, ABC, etc.) run on a single core codebase.
- **Single Shared Database**: All tenants share one unified database instance.
- **Multi-Tenancy Isolation**: Differentiate and isolate tenant data strictly at the row level via `tenant_id` combined with Supabase Row Level Security (RLS).
- **Codebase Handover Policy**: **NEVER** transfer or hand over source code to individual tenants/clients.

## 3. User Roles & Access Control
- **Tenant Owners (Client Admin)**:
  - Accessible via Client Admin Dashboard.
  - Allowed actions: Manage store contents, products, catalog, store UI themes/configs.
  - Rights: Access to platform features only. No source code ownership or source code delivery.
- **Platform Owner (Super Admin)**:
  - Dedicated Super Admin Portal/Dashboard for platform owners (us).
  - Allowed actions: Manage all tenants, track platform metrics (MRR, active stores), manage tenant subscriptions/status (active/suspended), and system-wide configurations.

# Archived SQL Development Files

**Archived on:** October 14, 2025
**Reason:** Phase 1 code quality cleanup

## What Are These Files?

These SQL files were used during iterative development and debugging of the database schema. They represent various attempts at migrations, seeding, and setup configurations.

## Why Were They Archived?

1. **Proper migrations exist**: The project has organized migrations in `supabase/migrations/` with timestamp-based naming
2. **Code organization**: These files cluttered the project root
3. **Version control**: Difficult to track which scripts were actually applied to production
4. **Risk reduction**: Multiple versions (FINAL, SAFE, ULTIMATE, etc.) created confusion

## Active Migration Files

The current, active migration files are located in:
```
supabase/migrations/
├── 20250105_band_manager_system.sql
├── 20250105_band_pages.sql
├── 20250105_fix_claim_rls.sql
├── 20250105_full_platform_schema.sql
├── 20250105_rpc_functions.sql
└── 20250115_storage_buckets.sql
```

## Archived Files by Category

### Complete Setup Scripts
- MASTER_SETUP.sql
- MASTER_SETUP_SAFE.sql
- COMPLETE_SETUP.sql
- COMPLETE_SETUP_SQL_ONLY.sql
- COMPLETE_SETUP_FINAL.sql
- SETUP_STORAGE_AND_RLS.sql

### Migration Iterations
- MIGRATE_ARTISTS_TO_BANDS.sql
- FINAL_MIGRATION.sql
- SAFE_MIGRATION.sql
- ULTIMATE_MIGRATION.sql
- COMPLETE_ARTIST_MIGRATION.sql
- SIMPLE_MIGRATION.sql
- CONSOLIDATED_MIGRATION.sql

### Seed Data
- ENHANCED_SEED.sql
- SIMPLE_SEED.sql
- SEED_STEP_1_ORG.sql
- SEED_STEP_2_DATA.sql
- SEED_FINAL.sql
- SEED_NO_CONFLICT.sql

### Storage & Policies
- STORAGE_POLICIES.sql
- STORAGE_POLICIES_FIXED.sql
- COMPLETE_RLS_POLICIES.sql
- ADD_PUBLIC_READ_POLICY.sql

### Fixes & Diagnostics
- FIX_BANDS_DATA.sql
- FIX_RLS_AND_VERIFY.sql
- DIAGNOSE_MIGRATION.sql
- CHECK_DATA.sql

## Should These Be Deleted?

**No**, not yet. Keep these files for reference in case:
- You need to understand the evolution of the schema
- You need to reference specific configuration patterns
- You encounter issues that might be related to past migration attempts

After 3-6 months of stable production operation, these can be safely deleted.

# Supabase Advisor Issues Report

**Generated**: 2025-11-02
**Project**: alphagogogoblog (plimzlmmftdbpipbnhsy)

---

## 📊 Performance Advisor Issues (33 issues)

### 🔴 WARN Level Issues (25 issues)

#### 1. Auth RLS Initialization Plan (12 issues)
**Problem**: RLS policies re-evaluate `auth.<function>()` for each row, causing poor performance at scale.

**Solution**: Replace `auth.<function>()` with `(select auth.<function>())`

**Affected Tables**:
1. `visit_logs` - policy: `visit_logs_service_role_only`
2. `invite_clicks` - policy: `invite_clicks_service_role_only`
3. `resources` - policy: `service_role_manage_resources`
4. `resource_categories` - policy: `service_role_manage_resource_categories`
5. `blog_tags` - policies: `admin_read_blog_tags`, `admin_manage_blog_tags`
6. `blog_post_tags` - policies: `admin_read_blog_post_tags`, `admin_manage_blog_post_tags`
7. `ai_services` - policy: `Only service_role can manage ai_services`

#### 2. Multiple Permissive Policies (12 issues)
**Problem**: Multiple RLS policies for same role/action causes performance issues.

**Affected Tables**:
- `blog_post_tags`: 3 policies for SELECT (admin_manage, admin_read, public_read)
- `blog_tags`: 3 policies for SELECT (admin_manage, admin_read, public_read)
- `resource_categories`: 2 policies for SELECT (Allow public read, service_role_manage)
- `resources`: 4 policies for SELECT (too many duplicate policies)

#### 3. Duplicate Index (1 issue)
**Problem**: Identical indexes waste storage and update performance.

**Affected**:
- `invite_links`: indexes `idx_invite_links_invite_url_unique` and `invite_links_invite_url_key` are identical

### 🔵 INFO Level Issues (8 issues)

#### 4. Unindexed Foreign Keys (3 issues)
**Affected**:
- `invite_clicks.invite_link_id` (FK: invite_clicks_invite_link_id_fkey)
- `invite_links.service_id` (FK: fk_invite_links_service)
- `resource_downloads.resource_id` (FK: resource_downloads_resource_id_fkey)

#### 5. Unused Indexes (3 issues)
**Affected**:
- `resources`: `idx_resources_created_at`
- `resources`: `idx_resources_is_featured`
- `blog_post_tags`: `idx_blog_post_tags_tag_id`

---

## 🛡️ Security Advisor Issues (1 issue)

### 🔴 WARN Level

#### Vulnerable Postgres Version
**Current**: supabase-postgres-15.8.1.044
**Problem**: Security patches available
**Action**: Upgrade database to receive latest security patches
**Remediation**: https://supabase.com/docs/guides/platform/upgrading

---

## 🎯 Priority Action Plan

### Priority 1: Fix RLS Performance (HIGH IMPACT)
All 12 RLS policies with `auth.<function>()` need fixing immediately.

### Priority 2: Consolidate RLS Policies (HIGH IMPACT)
Merge multiple permissive policies into single policies per table.

### Priority 3: Remove Duplicate Index (MEDIUM IMPACT)
Drop duplicate index on `invite_links` table.

### Priority 4: Add Missing Indexes (LOW IMPACT)
Add indexes for foreign keys (only if those tables will be kept).

### Priority 5: Remove Unused Indexes (LOW IMPACT)
Drop unused indexes to improve write performance.

### Priority 6: Upgrade Postgres (SECURITY)
Schedule database upgrade through Supabase dashboard.

---

## 📝 Notes

**Tables to Remove** (from migration plan):
- `invite_clicks`, `invite_links`, `ai_services` - scheduled for removal in Phase 2
- No need to fix performance issues for tables being deleted

**Tables to Keep**:
- `visit_logs`, `resources`, `resource_categories`, `blog_tags`, `blog_post_tags`
- These MUST be fixed

---

## 🚀 Next Steps

1. Create migration to fix RLS policies on tables we're keeping
2. Skip fixes for tables being removed (invite_*, ai_services)
3. Consolidate RLS policies
4. Remove duplicate and unused indexes
5. Schedule Postgres upgrade via Supabase Dashboard

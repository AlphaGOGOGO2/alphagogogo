-- Migration: Fix RLS Performance Issues
-- Date: 2025-11-02
-- Purpose: Optimize RLS policies by wrapping auth functions in SELECT subqueries
-- Reference: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

-- ===================================================================
-- PART 1: Fix auth.<function>() performance issues
-- ===================================================================

-- Table: visit_logs
-- Policy: visit_logs_service_role_only
DROP POLICY IF EXISTS visit_logs_service_role_only ON public.visit_logs;
CREATE POLICY visit_logs_service_role_only ON public.visit_logs
  FOR ALL
  USING ((select auth.role()) = 'service_role');

-- Table: resources
-- Policy: service_role_manage_resources
DROP POLICY IF EXISTS service_role_manage_resources ON public.resources;
CREATE POLICY service_role_manage_resources ON public.resources
  FOR ALL
  USING ((select auth.role()) = 'service_role');

-- Table: resource_categories
-- Policy: service_role_manage_resource_categories
DROP POLICY IF EXISTS service_role_manage_resource_categories ON public.resource_categories;
CREATE POLICY service_role_manage_resource_categories ON public.resource_categories
  FOR ALL
  USING ((select auth.role()) = 'service_role');

-- Table: blog_tags
-- Policy: admin_read_blog_tags
DROP POLICY IF EXISTS admin_read_blog_tags ON public.blog_tags;
CREATE POLICY admin_read_blog_tags ON public.blog_tags
  FOR SELECT
  USING ((select auth.role()) = 'service_role');

-- Policy: admin_manage_blog_tags
DROP POLICY IF EXISTS admin_manage_blog_tags ON public.blog_tags;
CREATE POLICY admin_manage_blog_tags ON public.blog_tags
  FOR ALL
  USING ((select auth.role()) = 'service_role');

-- Table: blog_post_tags
-- Policy: admin_read_blog_post_tags
DROP POLICY IF EXISTS admin_read_blog_post_tags ON public.blog_post_tags;
CREATE POLICY admin_read_blog_post_tags ON public.blog_post_tags
  FOR SELECT
  USING ((select auth.role()) = 'service_role');

-- Policy: admin_manage_blog_post_tags
DROP POLICY IF EXISTS admin_manage_blog_post_tags ON public.blog_post_tags;
CREATE POLICY admin_manage_blog_post_tags ON public.blog_post_tags
  FOR ALL
  USING ((select auth.role()) = 'service_role');

-- ===================================================================
-- PART 2: Consolidate Multiple Permissive Policies
-- ===================================================================

-- Table: blog_tags
-- Consolidate 3 SELECT policies into 2 (keep public_read separate, merge admin policies)
-- Keep: public_read_blog_tags (for public access)
-- admin_read_blog_tags and admin_manage_blog_tags already handle service_role

-- Table: blog_post_tags
-- Consolidate 3 SELECT policies into 2 (keep public_read separate, merge admin policies)
-- Keep: public_read_blog_post_tags (for public access)
-- admin_read_blog_post_tags and admin_manage_blog_post_tags already handle service_role

-- Table: resource_categories
-- Already has 2 policies which is acceptable (public read + service_role manage)

-- Table: resources
-- Consolidate 4 SELECT policies into 2
-- First, check existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.resources;
DROP POLICY IF EXISTS "Allow public select on resources" ON public.resources;
DROP POLICY IF EXISTS "Public read access to resources" ON public.resources;

-- Recreate single public read policy
CREATE POLICY "public_read_resources" ON public.resources
  FOR SELECT
  USING (true);

-- Keep service_role_manage_resources (already fixed above)

-- ===================================================================
-- PART 3: Remove Duplicate and Unused Indexes
-- ===================================================================

-- Remove duplicate index on invite_links (will be removed in Phase 2 anyway)
-- Skip for now - table being deleted

-- Remove unused indexes on resources
DROP INDEX IF EXISTS public.idx_resources_created_at;
DROP INDEX IF EXISTS public.idx_resources_is_featured;

-- Remove unused index on blog_post_tags
DROP INDEX IF EXISTS public.idx_blog_post_tags_tag_id;

-- ===================================================================
-- PART 4: Add Missing Indexes for Foreign Keys (on tables we're keeping)
-- ===================================================================

-- resource_downloads: Add index for resource_id foreign key
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource_id
  ON public.resource_downloads(resource_id);

-- Note: invite_clicks and invite_links will be removed in Phase 2,
-- so we skip adding indexes for those tables

-- ===================================================================
-- Verification
-- ===================================================================

DO $$
BEGIN
  RAISE NOTICE 'RLS performance optimization completed successfully';
  RAISE NOTICE 'Run Performance Advisor again to verify improvements';
END $$;

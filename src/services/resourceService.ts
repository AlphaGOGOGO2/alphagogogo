
import { supabase } from "@/integrations/supabase/client";
import { Resource, ResourceCategory } from "@/types/resources";

// 데이터베이스 결과를 Resource 타입으로 변환하는 헬퍼 함수
const transformDatabaseResource = (dbResource: any): Resource => {
  return {
    ...dbResource,
    tags: Array.isArray(dbResource.tags) ? dbResource.tags : 
          (dbResource.tags ? JSON.parse(dbResource.tags) : [])
  };
};

export const resourceService = {
  // 모든 자료 조회
  async getAllResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }

    return (data || []).map(transformDatabaseResource);
  },

  // 카테고리별 자료 조회
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources by category:', error);
      throw error;
    }

    return (data || []).map(transformDatabaseResource);
  },

  // 추천 자료 조회
  async getFeaturedResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching featured resources:', error);
      throw error;
    }

    return (data || []).map(transformDatabaseResource);
  },

  // 자료 검색
  async searchResources(query: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching resources:', error);
      throw error;
    }

    return (data || []).map(transformDatabaseResource);
  },

  // 다운로드 수 증가
  async incrementDownloadCount(resourceId: string, ipAddress?: string) {
    // 다운로드 로그 추가
    if (ipAddress) {
      await supabase
        .from('resource_downloads')
        .insert({
          resource_id: resourceId,
          ip_address: ipAddress
        });
    }

    // 다운로드 수 증가
    const { error } = await supabase.rpc('increment_download_count', {
      resource_id: resourceId
    });

    if (error) {
      console.error('Error incrementing download count:', error);
    }
  },

  // 카테고리 조회
  async getCategories(): Promise<ResourceCategory[]> {
    const { data, error } = await supabase
      .from('resource_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  }
};


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

  // 자료 생성
  async createResource(resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'download_count'>): Promise<Resource> {
    const { data, error } = await supabase
      .from('resources')
      .insert({
        ...resourceData,
        tags: JSON.stringify(resourceData.tags)
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating resource:', error);
      throw error;
    }

    return transformDatabaseResource(data);
  },

  // 자료 수정
  async updateResource(id: string, resourceData: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>): Promise<Resource> {
    const updateData = { ...resourceData };
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags) as any;
    }

    const { data, error } = await supabase
      .from('resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating resource:', error);
      throw error;
    }

    return transformDatabaseResource(data);
  },

  // 자료 삭제
  async deleteResource(id: string): Promise<void> {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  // 다운로드 수 증가
  async incrementDownloadCount(resourceId: string, ipAddress?: string) {
    // 개인정보 보호 경고
    if (ipAddress) {
      console.warn(
        'PRIVACY WARNING: IP address collection detected. ' +
        'Consider using incrementDownloadCountSafely() from downloadPrivacy.ts instead.'
      );
    }

    // 다운로드 로그 추가 (IP 주소가 제공된 경우 익명화)
    if (ipAddress) {
      const anonymizeIp = (ip: string): string => {
        if (ip.includes('.')) {
          const parts = ip.split('.');
          if (parts.length === 4) {
            parts[3] = '0';
            return parts.join('.');
          }
        }
        return ip;
      };

      await supabase
        .from('resource_downloads')
        .insert({
          resource_id: resourceId,
          ip_address: anonymizeIp(ipAddress)
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
  },

  // 카테고리 생성
  async createCategory(categoryData: Omit<ResourceCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ResourceCategory> {
    const { data, error } = await supabase
      .from('resource_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    return data;
  },

  // 카테고리 수정
  async updateCategory(id: string, categoryData: Partial<Omit<ResourceCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<ResourceCategory> {
    const { data, error } = await supabase
      .from('resource_categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    return data;
  },

  // 카테고리 삭제
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('resource_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

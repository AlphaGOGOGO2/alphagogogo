
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

  // 자료 생성 (Edge Function 사용 - 관리자 전용)
  async createResource(resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'download_count'>): Promise<Resource> {
    const { getAdminToken } = await import('./secureAuthService');
    const token = await getAdminToken();
    if (!token) {
      throw new Error('관리자 인증이 필요합니다. 다시 로그인해주세요.');
    }

    const { data, error } = await supabase.functions.invoke('manage-resources', {
      headers: { 'admin-token': token },
      body: {
        action: 'create',
        resource_data: {
          title: resourceData.title,
          description: resourceData.description,
          category: resourceData.category,
          file_url: resourceData.file_url,
          file_type: resourceData.file_type,
          file_size: resourceData.file_size,
          tags: Array.isArray(resourceData.tags) ? resourceData.tags : [],
          is_featured: resourceData.is_featured,
          author_name: resourceData.author_name,
        },
      },
    } as any);

    if (error || !data?.success) {
      console.error('Error creating resource via function:', error || data);
      throw (error as any) || new Error(data?.message || '생성 실패');
    }

    return transformDatabaseResource(data.data);
  },

  // 자료 수정 (Edge Function 사용)
  async updateResource(id: string, resourceData: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>): Promise<Resource> {
    const { getAdminToken } = await import('./secureAuthService');
    const token = await getAdminToken();
    if (!token) {
      throw new Error('관리자 인증이 필요합니다. 다시 로그인해주세요.');
    }

    const { data, error } = await supabase.functions.invoke('manage-resources', {
      headers: { 'admin-token': token },
      body: {
        action: 'update',
        id,
        resource_data: resourceData,
      },
    } as any);

    if (error || !data?.success) {
      console.error('Error updating resource via function:', error || data);
      throw (error as any) || new Error(data?.message || '수정 실패');
    }

    return transformDatabaseResource(data.data);
  },

  // 자료 삭제 (Edge Function 사용)
  async deleteResource(id: string): Promise<void> {
    const { getAdminToken } = await import('./secureAuthService');
    const token = await getAdminToken();
    if (!token) {
      throw new Error('관리자 인증이 필요합니다. 다시 로그인해주세요.');
    }

    const { data, error } = await supabase.functions.invoke('manage-resources', {
      headers: { 'admin-token': token },
      body: { action: 'delete', id },
    } as any);

    if (error || !data?.success) {
      console.error('Error deleting resource via function:', error || data);
      throw (error as any) || new Error(data?.message || '삭제 실패');
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

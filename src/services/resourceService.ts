
import { Resource, ResourceCategory } from "@/types/resources";
import {
  resources as localResources,
  resourceCategories as localCategories,
  getDownloadCount,
  incrementDownloadCount as incrementLocalDownloadCount
} from "@/data/resources";

export const resourceService = {
  // 모든 자료 조회
  async getAllResources(): Promise<Resource[]> {
    return Promise.resolve(
      [...localResources].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    );
  },

  // 카테고리별 자료 조회
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Promise.resolve(
      localResources
        .filter(r => r.category === category)
        .sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    );
  },

  // 추천 자료 조회
  async getFeaturedResources(): Promise<Resource[]> {
    return Promise.resolve(
      localResources
        .filter(r => r.is_featured)
        .sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 6)
    );
  },

  // 자료 검색
  async searchResources(query: string): Promise<Resource[]> {
    const lowerQuery = query.toLowerCase();
    return Promise.resolve(
      localResources
        .filter(r =>
          r.title.toLowerCase().includes(lowerQuery) ||
          r.description?.toLowerCase().includes(lowerQuery)
        )
        .sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    );
  },

  // 자료 생성 (로컬 - 실제 프로덕션에서는 불가능)
  async createResource(resourceData: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'download_count'>): Promise<Resource> {
    throw new Error('로컬 모드에서는 자료 생성이 불가능합니다. 데이터 파일을 직접 수정해주세요.');
  },

  // 자료 수정 (로컬 - 실제 프로덕션에서는 불가능)
  async updateResource(id: string, resourceData: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>): Promise<Resource> {
    throw new Error('로컬 모드에서는 자료 수정이 불가능합니다. 데이터 파일을 직접 수정해주세요.');
  },

  // 자료 삭제 (로컬 - 실제 프로덕션에서는 불가능)
  async deleteResource(id: string): Promise<void> {
    throw new Error('로컬 모드에서는 자료 삭제가 불가능합니다. 데이터 파일을 직접 수정해주세요.');
  },

  // 다운로드 수 증가
  async incrementDownloadCount(resourceId: string, ipAddress?: string) {
    incrementLocalDownloadCount(resourceId);
  },

  // 카테고리 조회
  async getCategories(): Promise<ResourceCategory[]> {
    return Promise.resolve(
      [...localCategories].sort((a, b) => a.name.localeCompare(b.name))
    );
  },

  // 카테고리 생성 (로컬 - 실제 프로덕션에서는 불가능)
  async createCategory(categoryData: Omit<ResourceCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ResourceCategory> {
    throw new Error('로컬 모드에서는 카테고리 생성이 불가능합니다. 데이터 파일을 직접 수정해주세요.');
  },

  // 카테고리 수정 (로컬 - 실제 프로덕션에서는 불가능)
  async updateCategory(id: string, categoryData: Partial<Omit<ResourceCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<ResourceCategory> {
    throw new Error('로컬 모드에서는 카테고리 수정이 불가능합니다. 데이터 파일을 직접 수정해주세요.');
  },

  // 카테고리 삭제 (로컬 - 실제 프로덕션에서는 불가능)
  async deleteCategory(id: string): Promise<void> {
    throw new Error('로컬 모드에서는 카테고리 삭제가 불가능합니다. 데이터 파일을 직접 수정해주세요.');
  }
};

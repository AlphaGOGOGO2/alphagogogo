/**
 * Blog Category Service - 로컬 데이터 기반
 */

// 로컬 카테고리 데이터
const categories = [
  { name: '전체보기', slug: 'all' },
  { name: '최신 AI소식', slug: 'latest-updates' },
  { name: '화제의 이슈', slug: 'trending' },
  { name: '라이프스타일', slug: 'lifestyle' }
];

export const getAllBlogCategories = async () => {
  return Promise.resolve(categories);
};

export const getBlogCategoryBySlug = async (slug: string) => {
  const category = categories.find(cat => cat.slug === slug);
  return Promise.resolve(category || null);
};

export const createBlogCategory = async () => {
  throw new Error('로컬 모드에서는 카테고리 생성이 불가능합니다.');
};

export const updateBlogCategory = async () => {
  throw new Error('로컬 모드에서는 카테고리 수정이 불가능합니다.');
};

export const deleteBlogCategory = async () => {
  throw new Error('로컬 모드에서는 카테고리 삭제가 불가능합니다.');
};

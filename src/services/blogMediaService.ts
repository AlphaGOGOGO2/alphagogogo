/**
 * Blog Media Service - 로컬 모드에서는 비활성화
 *
 * 로컬 모드에서는 미디어 업로드 기능이 비활성화되어 있습니다.
 */

export const uploadBlogImage = async () => {
  throw new Error('로컬 모드에서는 이미지 업로드가 불가능합니다.');
};

export const deleteBlogMedia = async () => {
  throw new Error('로컬 모드에서는 미디어 삭제가 불가능합니다.');
};

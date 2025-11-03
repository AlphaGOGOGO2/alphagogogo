/**
 * Blog Secure Service - 로컬 모드에서는 비활성화
 *
 * 로컬 모드에서는 블로그 글쓰기 기능이 비활성화되어 있습니다.
 */

export const secureCreateBlogPost = async () => {
  throw new Error('로컬 모드에서는 블로그 포스트 생성이 불가능합니다.');
};

export const secureUpdateBlogPost = async () => {
  throw new Error('로컬 모드에서는 블로그 포스트 수정이 불가능합니다.');
};

export const secureDeleteBlogPost = async () => {
  throw new Error('로컬 모드에서는 블로그 포스트 삭제가 불가능합니다.');
};

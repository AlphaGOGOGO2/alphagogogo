import { Resource, ResourceCategory } from "@/types/resources";

export const resourceCategories: ResourceCategory[] = [
  {
    id: "169f0ffb-604d-4c28-a456-39eae172f28b",
    name: "이미지",
    description: "AI 관련 이미지 자료",
    created_at: "2025-05-26T07:54:48.757158Z",
    updated_at: "2025-05-26T07:54:48.757158Z"
  },
  {
    id: "050ff620-5de7-4a69-9041-e3b88fcc258b",
    name: "문서",
    description: "PDF, 워드 등 문서 자료",
    created_at: "2025-05-26T07:54:48.757158Z",
    updated_at: "2025-05-26T07:54:48.757158Z"
  },
  {
    id: "f2c04aba-06d2-4806-880e-ef2de561d5ce",
    name: "템플릿",
    description: "활용 가능한 템플릿",
    created_at: "2025-05-26T07:54:48.757158Z",
    updated_at: "2025-05-26T07:54:48.757158Z"
  },
  {
    id: "796898f5-0a16-45fb-83a1-f1cfe9983896",
    name: "가이드",
    description: "사용 가이드 및 매뉴얼",
    created_at: "2025-05-26T07:54:48.757158Z",
    updated_at: "2025-05-26T07:54:48.757158Z"
  },
  {
    id: "62414b0e-b2ea-4106-b445-87e11c2c1d72",
    name: "기타",
    description: "기타 자료",
    created_at: "2025-05-26T07:54:48.757158Z",
    updated_at: "2025-05-26T07:54:48.757158Z"
  }
];

export const resources: Resource[] = [
  {
    id: "8pl52y6ae-mvsg-482r-hml7-7lydiihdv2h",
    title: "알파뮤직AI",
    description: "음원 대량생성프로그램",
    file_url: "/files/AlphaMusic AI-amd64-installer.exe",
    file_type: "document",
    file_size: 10266134,
    category: "음원생성AI",
    tags: [
      "수노AI",
      "음원생성AI",
      "수노API",
      "프로그램"
    ],
    download_count: 0,
    is_featured: false,
    author_name: "알파GOGOGO",
    created_at: "2025-11-20T13:10:04.227Z",
    updated_at: "2025-11-20T13:10:04.227Z"
  },

  {
    id: "c3656634-704a-4435-b3a8-24e2eb2f7fe2",
    title: "유튜브 데이터 수집 + 분석 + ai 챗봇 어시스턴트 프로그램 무료 배포",
    description: "",
    file_url: "https://github.com/AlphaGOGOGO2/alphagogogo/releases/download/files-v1.0/alphatube-v4.exe",
    file_type: "document",
    file_size: 43411123,
    category: "템플릿",
    tags: ["유튜브", "AI", "무료"],
    download_count: 1838,
    is_featured: true,
    author_name: "알파GOGOGO",
    created_at: "2025-09-11T08:45:24.549391Z",
    updated_at: "2025-09-11T08:45:24.549391Z"
  },
  {
    id: "af5da4f5-5568-4885-b586-4935bae7e3f1",
    title: "블로그 자동화 프로그램",
    description: "",
    file_url: "https://github.com/AlphaGOGOGO2/alphagogogo/releases/download/files-v1.0/AlphaBlog.exe",
    file_type: "document",
    file_size: 132797468,
    category: "기타",
    tags: ["AI", "프리미엄", "무료"],
    download_count: 3802,
    is_featured: true,
    author_name: "알파GOGOGO",
    created_at: "2025-08-28T09:13:00.037482Z",
    updated_at: "2025-09-11T08:45:37.154Z"
  },
  {
    id: "76fab42c-f1eb-455e-9317-7add150a2884",
    title: "AdSense SEO 블로그 글쓰기 마스터 GPT 지침",
    description: `<p># AdSense SEO 블로그 글쓰기 마스터 GPT 지침 (수정)</p><p>당신은 구글 애드센스 승인을 위한 최고의 SEO 블로그 글쓰기 전문가입니다. 현재 인공지능 생성 콘텐츠가 범람하는 환경에서 실제 사람이 작성한 것 같은 고품질 콘텐츠를 작성하여 사용자의 블로그가 애드센스 승인을 받을 수 있도록 돕는 역할을 합니다.</p><p>## 주요 임무<br>1. 사용자가 제공한 키워드 또는 주제를 기반으로 Google AdSense 승인에 최적화된 블로그 글을 작성합니다.<br>2. AI 탐지를 피하는 자연스러운 문체와 구조로 콘텐츠를 구성합니다.<br>3. 검색엔진 최적화(SEO)를 위한 모든 요소를 통합합니다.<br>4. 독자와 검색엔진 모두에게 가치 있는 정보를 제공합니다.</p><p>## 콘텐츠 작성 규칙</p><p>### 1. 구조와 형식<br>- 마크다운 형식으로 작성합니다.<br>- 글의 길이는 최소 1,500자 이상 2,000자 이하로 작성합니다.<br>- 서론, 본론, 결론의 명확한 구조를 갖추며, 각 섹션은 자연스럽게 연결됩니다.<br>- H1, H2, H3 등의 헤딩 태그를 적절히 사용하여 계층 구조를 만듭니다.<br>- 단락은 2-4문장으로 구성하여 가독성을 높입니다.<br>- 불필요한 반복을 피하고 다양한 문장 구조를 사용합니다.<br>- 글머리 기호(•)와 번호 목록을 적절히 활용하여 정보를 구조화합니다.</p><p>### 2. 콘텐츠 품질<br>- 주제에 대한 깊이 있는 정보와 독창적인 인사이트를 제공합니다.<br>- 문제 해결 중심의 접근 방식을 취합니다.<br>- 구체적인 예시와 사례를 포함합니다.<br>- 신뢰할 수 있는 최신 데이터와 통계를 인용합니다.<br>- 실용적인 팁과 단계별 가이드를 제공합니다.<br>- 주제와 관련된 논쟁점이나 다양한 관점을 균형 있게 다룹니다.<br>- 글을 읽는 독자의 지식 수준을 고려한 적절한 전문성을 유지합니다.</p><p>### 3. 자연스러운 문체 (AI 탐지 회피)<br>- 구어체와 문어체를 적절히 혼합하여 사용합니다.<br>- "음", "아", "그런데", "사실" 등의 말버릇과 접속사를 자연스럽게 사용합니다.<br>- 비유, 은유, 속담과 같은 창의적인 표현을 적절히 활용합니다.<br>- 반어법, 과장법 등 다양한 수사적 기법을 사용합니다.<br>- 감정을 표현하는 단어와 개인적인 느낌을 자연스럽게 포함합니다.<br>- 불규칙한 문장 길이와 다양한 문체를 사용하여 리듬감을 만듭니다.<br>- "제 생각에는", "개인적으로", "경험상" 등의 개인화된 표현을 사용합니다.</p><p>### 4. SEO 최적화 요소<br>- 주요 키워드를 제목(H1)에 포함시킵니다.<br>- 첫 단락에 주요 키워드와 LSI 키워드(의미적 연관 키워드)를 자연스럽게 포함시킵니다.<br>- 키워드 밀도를 1.5-2% 수준으로 유지하며, 과도한 반복은 피합니다.<br>- 부제목(H2, H3)에 보조 키워드를 포함시켜 주제의 범위를 확장합니다.<br>- 검색자의 검색 의도를 정확히 충족시키는 콘텐츠를 제공합니다.<br>- 특정 키워드에 대한 질문과 답변 섹션을 포함하여 피처드 스니펫을 노립니다.<br>- 네이버, 다음 등 국내 검색엔진에 최적화된 요소도 고려합니다.</p><p>### 5. 애드센스 승인 최적화<br>- 저품질 키워드와 금지된 주제를 피합니다(도박, 성인 콘텐츠, 불법 활동 등).<br>- 과도한 키워드 스터핑이나 은닉 텍스트 같은 블랙햇 기법을 사용하지 않습니다.<br>- 사용자 경험을 최우선으로 고려한 콘텐츠를 작성합니다.<br>- 저작권 침해 가능성이 있는 콘텐츠를 피하고 원본 콘텐츠만 제공합니다.<br>- 글의 전문성, 권위성, 신뢰성(E-A-T) 요소를 강화합니다.<br>- 애드센스 정책에 부합하는 콘텐츠 가이드라인을 준수합니다.<br>- 콘텐츠가 특정 이익 집단이나 제품을 홍보하지 않도록 주의합니다.</p><p>## 출력 형식</p><p>### 본문 구조만 마크다운 형식으로 출력합니다.<br>- 사용자의 요청에 따라 작성된 블로그 글 본문만 마크다운 형식으로 출력합니다.<br>- 불필요한 설명, 제안, 질문 등은 포함하지 않고 순수하게 본문 내용만 제공합니다.<br>- 이미지 삽입 제안이나 기타 메타 정보는 포함하지 않습니다.<br>- 글의 가독성을 최우선으로 고려하여 정리합니다.</p><p>## 응답 방식<br>1. 사용자가 제공한 키워드나 주제에 대해 마크다운 형식으로 완성된 블로그 글만 출력합니다.<br>2. 추가적인 설명, SEO 제안, 질문 등은 포함하지 않습니다.<br>3. 코드 블록 외부에는 어떤 텍스트도 포함하지 않습니다.<br>4.태그는 마지막에 항상 포함하여 #이아닌 ,으로 구분 지어 생성합니다.<br>예시: 육아, 육아맘, 워킹맘, 육아꿀팁<br>5.가상의 인물을 따로 생성하거나, 예시로 생성하지 않습니다. 이는 독자들의 신뢰성을 우선적으로 생각하기 때문입니다.</p>`,
    file_url: "",
    file_type: "document",
    file_size: 0,
    category: "가이드",
    tags: [],
    download_count: 0,
    is_featured: false,
    author_name: "알파GOGOGO",
    created_at: "2025-06-28T06:46:07.162967Z",
    updated_at: "2025-06-28T06:46:07.162967Z"
  },
  {
    id: "b16ac92f-65db-47ed-94d9-5529df66f49d",
    title: "누구나 쉽게 xx만원짜리 크롤링 프로그램 만들기,올리브영 크롤링 프롬프트",
    description: `<p>&nbsp;</p><p>&nbsp;</p><p>프롬프트:</p><p>&nbsp;</p><p>올리브영 사이트를 웹 크롤링 하려고 해.</p><p>검색어를 내가 입력하면 그 검색어를 토대로 스크립해서 결과를 크롤링 해서 엑셀 파일로 정리해서 저장하면 좋겠어</p><p>파이썬으로 만들어주고, 플레이라이트를 사용해서 만들어줘.</p><p>올리브영에 검색어를 선크림으로 예시로 내가 검색했을 때 첫 번째 검색 결과 페이지 URL 구조가 이렇게 나와</p><p>&nbsp;</p><p>여기에 선크림이 아닌 내가 원하는 검색어가 입력되면, 그 검색어를 토대로 검색되어야 하는데</p><p>2페이지부터는 구조가 좀 다른것 같아. startcount를 사용하고 있어. 한 페이지당 24개의 상품이 있고, 2페이지의 URL은 아래와 같아.</p><p><br>2페이지url:<br><br>https://www.oliveyoung.co.kr/store/search/getSearchMain.do?startCount=24&amp;sort=RANK%2FDESC&amp;goods_sort=WEIGHT%2FDESC%2CRANK%2FDESC&amp;collection=ALL&amp;realQuery=%EC%84%A0%ED%81%AC%EB%A6%BC&amp;reQuery=&amp;viewtype=image&amp;category=&amp;catename=LCTG_ID&amp;catedepth=1&amp;rt=&amp;setMinPrice=&amp;setMaxPrice=&amp;listnum=24&amp;tmp_requery=&amp;tmp_requery2=&amp;categoryDepthValue=&amp;cateId=&amp;cateId2=&amp;BenefitAll_CHECK=&amp;query=%EC%84%A0%ED%81%AC%EB%A6%BC&amp;selectCateNm=%EC%A0%84%EC%B2%B4&amp;firstTotalCount=572&amp;typeChk=thum&amp;branChk=&amp;brandTop=&amp;attrChk=&amp;attrTop=&amp;onlyOneBrand=&amp;quickYn=N&amp;cateChk=&amp;benefitChk=&amp;attrCheck0=&amp;attrCheck1=&amp;attrCheck2=&amp;attrCheck3=&amp;attrCheck4=&amp;brandChkList=&amp;benefitChkList=&amp;_displayImgUploadUrl=https%3A%2F%2Fimage.oliveyoung.co.kr%2Fuploads%2Fimages%2Fdisplay%2F&amp;recobellMbrNo=null&amp;recobellCuid=8b47cf9f-efd1-48e4-8f83-10ee8a07945b&amp;t_page=&amp;t_click=&amp;t_search_name=&amp;sale_below_price=&amp;sale_over_price=&amp;reChk=</p><p>&nbsp;</p><p>여기에서 24&amp;sort 처럼 3페이지는 48&amp;sort로 나오고 있어.</p><p>구조를 한번 파악해보고 이걸 통해서 크롤링 코드를 작성해주고, 마지막으로 아래는 상품 구조이니 참고해</p><p>&nbsp;</p><p>상품구조:<br><br>&lt;li class="flag li_result"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;div class="prd_info"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- 이미지 영역 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY) --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;a class="prd_thumb" href="https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000219488&amp;amp;dispCatNo=1000001001100060001&amp;amp;trackingCd=Result_1" onclick="javascript:gtm.goods.callGoodsGtmInfo('A000000219488',null, 'ee-productClick', '통합검색결과페이지_검색결과상품_인기순', '1');moveGoodsDetailForSearch('A000000219488','1000001001100060001', 'Result_1' , '선크림' , &nbsp;'1' ); return false;" data-attr="통합검색결과페이지^검색결과상품_인기순^[품절대란/원지선크림] NEW 라네즈 워터뱅크 UV 베리어 선크림^1" data-trk="/" data-impression="A000000219488^통합검색결과페이지_검색결과상품_인기순^1" data-impression-visibility="1"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;span class="thumb_flag best"&gt;베스트&lt;/span&gt;&lt;!-- 베스트/신상 Flag | best : 베스트 / new : 신상 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;img src="https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0021/A00000021948824ko.jpg?l=ko" onerror="this.src='https://static.oliveyoung.co.kr/pc-static-root/image/comm/noimg_550.gif';this.onerror='';" alt="이미지 썸네일"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;/a&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!--// 이미지 영역 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- 상품명 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;div class="prd_name"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- [3389141] (영역별 매출분석) 오특, 검색, 베스트, 메인 추가(CHY) --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;a href="javascript:gtm.goods.callGoodsGtmInfo('A000000219488',null, 'ee-productClick', '통합검색결과페이지_검색결과상품_인기순', '1');moveGoodsDetailForSearch('A000000219488','1000001001100060001', 'Result_1' , &nbsp;'선크림' , '1' );" data-attr="통합검색결과페이지^검색결과상품_인기순^[품절대란/원지선크림] NEW 라네즈 워터뱅크 UV 베리어 선크림^1" data-trk="/"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;span class="tx_brand"&gt;라네즈&lt;/span&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;p class="tx_name"&gt;[품절대란/원지선크림] NEW 라네즈 워터뱅크 UV 베리어 선크림&lt;/p&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;/a&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;/div&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!--// 상품명 &nbsp;--&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- 찜버튼 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;button class="btn_zzim jeem" data-ref-goodsno="A000000219488" data-ref-goodsnm="[품절대란/원지선크림] NEW 라네즈 워터뱅크 UV 베리어 선크림" data-ref-goodsbrand="라네즈" data-ref-goodscategory="기초화장품&gt;선케어&gt;선블록" data-ref-goodstype="" data-ref-goodstrackingno="1" data-ref-entrysource="통합검색결과페이지" data-ref-cornernm="검색상품상세" onclick="zzimWebLog();"&gt;&lt;span&gt;찜하기전&lt;/span&gt;&lt;/button&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!--// 찜버튼 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- 상품가격 영역 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;p class="prd_price"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;span class="tx_org"&gt;&lt;span class="tx_num"&gt;28,000&lt;/span&gt;원&lt;/span&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;span class="tx_cur"&gt;&lt;span class="tx_num"&gt;23,800&lt;/span&gt;원&lt;/span&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;/p&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!--// 상품가격 영역 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- 상품 쿠폰 및 플러스 추가 영역 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- icon 사이 공백으로 인해 다 붙여서 한줄로 만들것 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;p class="prd_flag"&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;span class="icon_flag gift"&gt;증정&lt;/span&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;span class="icon_flag delivery"&gt;오늘드림&lt;/span&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;/p&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!--// 상품 쿠폰 및 플러스 추가 영역 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- &nbsp;상품평 및 장바구니버튼 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;p class="prd_point_area tx_num"&gt;&lt;span class="review_point"&gt;&lt;span class="point" style="width:96%"&gt;488&lt;/span&gt;&lt;/span&gt;(488)&lt;/p&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;p class="prd_btn_area"&gt;&lt;button class="cartBtn" data-ref-goodsno="A000000219488" data-ref-dispcatno="1000001001100060001" data-ref-itemno="001" data-ref-cnt="0" data-ref-prstyn="Y" name="Result_1" data-ref-goodsnm="[품절대란/원지선크림] NEW 라네즈 워터뱅크 UV 베리어 선크림" data-ref-goodsbrand="라네즈" data-ref-goodscategory="기초화장품&gt;선케어&gt;선블록" data-ref-goodstype="" data-ref-goodstrackingno="1" data-ref-entrysource="통합검색결과페이지" data-ref-cornernm="검색상품상세"&gt;장바구니&lt;/button&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;!-- // 상품평 및 장바구니버튼 --&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;/p&gt;&lt;/div&gt; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;/li&gt;</p><p>&nbsp;</p>`,
    file_url: "",
    file_type: "document",
    file_size: 0,
    category: "기타",
    tags: [],
    download_count: 0,
    is_featured: false,
    author_name: "알파GOGOGO",
    created_at: "2025-05-27T07:27:29.347933Z",
    updated_at: "2025-05-27T07:27:29.347933Z"
  }
];

// 인메모리 다운로드 카운트 관리
const downloadCounts = new Map<string, number>(
  resources.map(r => [r.id, r.download_count])
);

export const getDownloadCount = (resourceId: string): number => {
  return downloadCounts.get(resourceId) || 0;
};

export const incrementDownloadCount = (resourceId: string): void => {
  const current = downloadCounts.get(resourceId) || 0;
  downloadCounts.set(resourceId, current + 1);
};

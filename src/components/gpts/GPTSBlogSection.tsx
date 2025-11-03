
import { GPTSCard } from "./GPTSCard";

// Using consistent purple shades for Blog GPTS section
const blogCardColors = [
  "bg-soft-purple",
  "bg-purple-100",
  "bg-purple-50",
];

// 블로그 관련 GPTS 데이터
const blogGPTS = [
  {
    id: 1,
    title: "블로그 아이디어 생성기 - SEO 최적화 버젼",
    description: "SEO에 최적화된 블로그 아이디어를 생성해주는 도구입니다. 트렌드와 키워드를 분석하여 효과적인 콘텐츠 아이디어를 제공합니다.",
    url: "https://chatgpt.com/g/g-67ab7234630c819193cb31829a73553d-beulrogeu-aidieo-saengseonggi-seo-coejeoghwa-beojyeon",
    imageUrl: "/images/logo.png",
    isHot: false
  },
  {
    id: 2,
    title: "블로그 글쓰기, 사람이 써줍니다",
    description: "마치 전문 작가가 작성한 것처럼 자연스럽고 매력적인 블로그 콘텐츠를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-67ab6eb554f8819193e7e6db4685c5ff-beulrogeu-geulsseugi-sarami-sseojubnida",
    imageUrl: "/images/logo.png",
    isHot: true
  },
  {
    id: 3,
    title: "블로그 1단계, 키워드 검색&분석",
    description: "효과적인 블로그 작성을 위한 첫 단계로, 관련 키워드를 검색하고 분석해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-vyVVIK1Ba-beulrogeu-1dangye-kiweodeu-geomsaeg-bunseog",
    imageUrl: "/images/logo.png",
    isHot: false
  },
  {
    id: 4,
    title: "블로그 2단계, SEO 블로그 글 생성기",
    description: "검색 엔진 최적화를 고려한 블로그 콘텐츠를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-OEMSu2Dyw-beulrogeu-2dangye-seo-beulrogeu-geul-saengseonggi",
    imageUrl: "/images/logo.png",
    isHot: true
  },
  {
    id: 5,
    title: "블로그 2단계++, SEO 블로그 글 +이미지 생성기(HTML 버젼)",
    description: "SEO 최적화된 블로그 글과 함께 관련 이미지까지 HTML 형식으로 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-6749bdc3af3881919a6b73a4f6f7172c-beulrogeu-2dangye-seo-beulrogeu-geul-imiji-saengseonggi-html-beojyeon",
    imageUrl: "/images/logo.png",
    isHot: false
  },
  {
    id: 6,
    title: "블로그 +단계, 고급형 SEO블로그 글 생성기[HTML형식]",
    description: "전문적인 수준의 SEO 최적화 블로그 콘텐츠를 HTML 형식으로 생성해주는 고급 도구입니다.",
    url: "https://chatgpt.com/g/g-67799bfcb9d88191b1d272362e36454a-beulrogeu-dangye-gogeubhyeong-seobeulrogeu-geul-saengseonggi-htmlhyeongsig",
    imageUrl: "/images/logo.png",
    isHot: true
  },
  {
    id: 7,
    title: "블로그 3-1단계, 블로그 글 이미지 생성기",
    description: "블로그 콘텐츠에 어울리는 맞춤형 이미지를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-yfnEmWED1-beulrogeu-3-1dangye-beulrogeu-geul-imiji-saengseonggi",
    imageUrl: "/images/logo.png",
    isHot: false
  },
  {
    id: 8,
    title: "블로그 3-2단계, 링크 버튼 생성기",
    description: "블로그에 삽입할 수 있는 매력적인 링크 버튼을 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-fhG2LPNNv-beulrogeu-3-2dangye-ringkeu-beoteun-saengseonggi",
    imageUrl: "/images/logo.png",
    isHot: false
  }
];

export function GPTSBlogSection() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">블로그 GPTS</h2>
        <p className="text-gray-600">
          블로그 작성과 SEO 최적화를 위한 다양한 AI 도구들을 제공합니다. 각 단계별로 필요한 도구를 선택하여 사용해보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogGPTS.map((gpts, index) => (
          <GPTSCard
            key={gpts.id}
            title={gpts.title}
            description={gpts.description}
            url={gpts.url}
            imageUrl={gpts.imageUrl}
            colorClass={blogCardColors[index % blogCardColors.length]}
            isHot={gpts.isHot}
          />
        ))}
      </div>
    </section>
  );
}

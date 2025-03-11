
import { GPTSCard } from "./GPTSCard";

// Using a blue-tinted color scheme for beginner cards to differentiate from other sections
const beginnerCardColors = [
  "bg-blue-50",
  "bg-blue-100",
  "bg-soft-blue",
];

// 초보자를 위한 GPTS 데이터 - selected from the existing blogGPTS array
const beginnerGPTS = [
  {
    id: 1,
    title: "블로그 1단계, 키워드 검색&분석",
    description: "효과적인 블로그 작성을 위한 첫 단계로, 관련 키워드를 검색하고 분석해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-vyVVIK1Ba-beulrogeu-1dangye-kiweodeu-geomsaeg-bunseog",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
    isHot: false
  },
  {
    id: 2,
    title: "블로그 2단계, SEO 블로그 글 생성기",
    description: "검색 엔진 최적화를 고려한 블로그 콘텐츠를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-OEMSu2Dyw-beulrogeu-2dangye-seo-beulrogeu-geul-saengseonggi",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
    isHot: true
  },
  {
    id: 3,
    title: "블로그 +단계, 고급형 SEO블로그 글 생성기[HTML형식]",
    description: "전문적인 수준의 SEO 최적화 블로그 콘텐츠를 HTML 형식으로 생성해주는 고급 도구입니다.",
    url: "https://chatgpt.com/g/g-67799bfcb9d88191b1d272362e36454a-beulrogeu-dangye-gogeubhyeong-seobeulrogeu-geul-saengseonggi-htmlhyeongsig",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
    isHot: true
  },
  {
    id: 4,
    title: "블로그 3-1단계, 블로그 글 이미지 생성기",
    description: "블로그 콘텐츠에 어울리는 맞춤형 이미지를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-yfnEmWED1-beulrogeu-3-1dangye-beulrogeu-geul-imiji-saengseonggi",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
    isHot: false
  }
];

export function GPTSBeginnerSection() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">초보자분들은 이렇게 접근해보세요!</h2>
        <p className="text-gray-600">
          블로그 작성이 처음이신가요? 아래 순서대로 GPTS를 사용해보세요. 단계별로 블로그 콘텐츠를 쉽게 만들 수 있습니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {beginnerGPTS.map((gpts, index) => (
          <GPTSCard
            key={gpts.id}
            title={gpts.title}
            description={gpts.description}
            url={gpts.url}
            imageUrl={gpts.imageUrl}
            colorClass={beginnerCardColors[index % beginnerCardColors.length]}
            buttonColorClass="bg-blue-600 hover:bg-blue-700" // Blue buttons for beginner section
            isHot={gpts.isHot}
          />
        ))}
      </div>
    </section>
  );
}

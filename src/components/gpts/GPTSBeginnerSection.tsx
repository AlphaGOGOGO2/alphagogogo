
import { GPTSCard } from "./GPTSCard";

// Using a purple-tinted color scheme for beginner cards 
const beginnerCardColors = [
  "bg-purple-50",
  "bg-purple-100",
  "bg-soft-purple",
];

// 초보자를 위한 GPTS 데이터
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
        <h2 className="text-2xl font-bold text-purple-800 mb-4">초보자분들은 이렇게 접근해보세요!</h2>
        <p className="text-gray-600">
          블로그 작성이 처음이신가요? 아래 순서대로 GPTS를 사용해보세요. 단계별로 블로그 콘텐츠를 쉽게 만들 수 있습니다.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 1단계 */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-purple-700 mb-2 text-left">1단계</h3>
          <p className="text-gray-600 mb-4 text-sm">키워드를 검색하고 주차별 키워드를 생성합니다.</p>
          <div className="flex-1 flex">
            <GPTSCard
              key={beginnerGPTS[0].id}
              title={beginnerGPTS[0].title}
              description={beginnerGPTS[0].description}
              url={beginnerGPTS[0].url}
              imageUrl={beginnerGPTS[0].imageUrl}
              colorClass={beginnerCardColors[0]}
              buttonColorClass="bg-purple-600 hover:bg-purple-700"
              isHot={beginnerGPTS[0].isHot}
            />
          </div>
        </div>
        
        {/* 구분선 */}
        <div className="hidden md:block w-0.5 bg-purple-300 self-stretch mx-2" />
        
        {/* 2단계 */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-purple-700 mb-2 text-left">2단계</h3>
          <p className="text-gray-600 mb-4 text-sm">1단계에서 나온 키워드를 토대로 글을 작성합니다.(마크다운과 HTML 중 선호하는 스타일 진행)</p>
          <div className="space-y-6">
            {beginnerGPTS.slice(1, 3).map((gpts, index) => (
              <GPTSCard
                key={gpts.id}
                title={gpts.title}
                description={gpts.description}
                url={gpts.url}
                imageUrl={gpts.imageUrl}
                colorClass={beginnerCardColors[index + 1]}
                buttonColorClass="bg-purple-600 hover:bg-purple-700"
                isHot={gpts.isHot}
              />
            ))}
          </div>
        </div>
        
        {/* 구분선 */}
        <div className="hidden md:block w-0.5 bg-purple-300 self-stretch mx-2" />
        
        {/* 3단계 */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-purple-700 mb-2 text-left">3단계</h3>
          <p className="text-gray-600 mb-4 text-sm">이제 블로그 이미지를 생성합니다.</p>
          <div className="flex-1 flex">
            <GPTSCard
              key={beginnerGPTS[3].id}
              title={beginnerGPTS[3].title}
              description={beginnerGPTS[3].description}
              url={beginnerGPTS[3].url}
              imageUrl={beginnerGPTS[3].imageUrl}
              colorClass={beginnerCardColors[0]}
              buttonColorClass="bg-purple-600 hover:bg-purple-700"
              isHot={beginnerGPTS[3].isHot}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

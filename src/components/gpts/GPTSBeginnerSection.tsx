
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
    <section className="mb-16 py-6 bg-purple-50 rounded-xl border border-purple-200 shadow-sm">
      <div className="mb-6 px-6">
        <h2 className="text-2xl font-bold text-purple-800 mb-3">초보자분들은 이렇게 접근해보세요!</h2>
        <p className="text-gray-600 text-sm">
          블로그 작성이 처음이신가요? 아래 순서대로 GPTS를 사용해보세요. 단계별로 블로그 콘텐츠를 쉽게 만들 수 있습니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
        {/* 1단계 컬럼 */}
        <div>
          <h3 className="text-lg font-bold text-purple-700 mb-3 text-center">1단계</h3>
          <GPTSCard
            key={beginnerGPTS[0].id}
            title={beginnerGPTS[0].title}
            description={beginnerGPTS[0].description}
            url={beginnerGPTS[0].url}
            imageUrl={beginnerGPTS[0].imageUrl}
            colorClass={beginnerCardColors[0]}
            buttonColorClass="bg-purple-600 hover:bg-purple-700"
            isHot={beginnerGPTS[0].isHot}
            className="h-full"
          />
        </div>
        
        {/* 2단계 컬럼 */}
        <div>
          <h3 className="text-lg font-bold text-purple-700 mb-3 text-center">2단계</h3>
          <div className="space-y-4">
            <GPTSCard
              key={beginnerGPTS[1].id}
              title={beginnerGPTS[1].title}
              description={beginnerGPTS[1].description}
              url={beginnerGPTS[1].url}
              imageUrl={beginnerGPTS[1].imageUrl}
              colorClass={beginnerCardColors[1]}
              buttonColorClass="bg-purple-600 hover:bg-purple-700"
              isHot={beginnerGPTS[1].isHot}
              className="h-full"
            />
            <GPTSCard
              key={beginnerGPTS[2].id}
              title={beginnerGPTS[2].title}
              description={beginnerGPTS[2].description}
              url={beginnerGPTS[2].url}
              imageUrl={beginnerGPTS[2].imageUrl}
              colorClass={beginnerCardColors[2]}
              buttonColorClass="bg-purple-600 hover:bg-purple-700"
              isHot={beginnerGPTS[2].isHot}
              className="h-full"
            />
          </div>
        </div>
        
        {/* 3단계 컬럼 */}
        <div>
          <h3 className="text-lg font-bold text-purple-700 mb-3 text-center">3단계</h3>
          <GPTSCard
            key={beginnerGPTS[3].id}
            title={beginnerGPTS[3].title}
            description={beginnerGPTS[3].description}
            url={beginnerGPTS[3].url}
            imageUrl={beginnerGPTS[3].imageUrl}
            colorClass={beginnerCardColors[0]}
            buttonColorClass="bg-purple-600 hover:bg-purple-700"
            isHot={beginnerGPTS[3].isHot}
            className="h-full"
          />
        </div>
      </div>
    </section>
  );
}

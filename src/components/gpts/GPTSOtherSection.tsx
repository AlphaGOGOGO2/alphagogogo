import { GPTSCard } from "./GPTSCard";

// Using consistent navy/blue shades for Other GPTS section
const otherCardColors = [
  "bg-soft-blue",
  "bg-blue-100",
  "bg-blue-50",
];

// 그 외 GPTS 데이터
const otherGPTS = [
  {
    id: 1,
    title: "유튜브 1단계 - 채널 개설 만능 GPT",
    description: "유튜브 채널 개설을 위한 모든 단계를 도와주는 GPT로, 효과적인 채널 설정 및 전략 수립에 도움을 줍니다.",
    url: "https://chatgpt.com/g/g-ULLDP2JeO-yutyubeu-1dangye-caeneol-gaeseol-manneung-gpt",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
  },
  {
    id: 2,
    title: "유튜브 2단계 - 벤치마킹 대본 생성기(+제목,썸네일 문구 생성기)",
    description: "성공적인 유튜브 채널들을 벤치마킹하여 효과적인 대본, 제목, 썸네일 문구를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-673614752bec81909570c8219c70d3cc-yutyubeu-2dangye-bencimaking-daebon-saengseonggi-jemog-sseomneil-mungu-saengseonggi",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
  },
  {
    id: 3,
    title: "🛸상품 리뷰 지피티,생동감 있게!",
    description: "상품 리뷰를 생동감 있고 설득력 있게 작성해주는 GPT입니다. 제품의 장단점을 자연스럽게 설명합니다.",
    url: "https://chatgpt.com/g/g-67a95e0362808191b1d088a7c80f9cc3-sangpum-ribyu-jipiti-saengdonggam-issge",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
  },
  {
    id: 4,
    title: "리미널 스페이스 이미지 생성기",
    description: "독특한 리미널 스페이스(중간 공간) 컨셉의 이미지를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-6769a1c7034c8191833c0cab842eb27e-rimineol-seupeiseu-imiji-saengseonggi",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
  },
  {
    id: 5,
    title: "클레이스타일 이미지 생성기",
    description: "점토 조형물 스타일의 독특하고 창의적인 이미지를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-67699771577c81918aff77fb73c10191-keulreiseutail-imiji-saengseonggi",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
  },
  {
    id: 6,
    title: "동화책용 동물 일러스트 이미지 생성기",
    description: "동화책에 어울리는 귀엽고 친근한 동물 일러스트레이션을 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-67699364eeac8191a0f15f4e01e03967-donghwacaegyong-dongmul-ilreoseuteu-imiji",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
  },
  {
    id: 7,
    title: "흑백 초상화 인물 이미지 생성 GPT",
    description: "클래식하고 예술적인 흑백 초상화 스타일의 인물 이미지를 생성해주는 도구입니다.",
    url: "https://chatgpt.com/g/g-674ee52be85c8191a3d776d969ef8fda-heugbaeg-cosanghwa-inmul-imiji-saengseong-gpt",
    imageUrl: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
  }
];

export function GPTSOtherSection() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">그 외 GPTS</h2>
        <p className="text-gray-600">
          유튜브 채널 운영과 이미지 생성을 위한 다양한 AI 도구들을 사용해보세요. 각각의 용도에 맞는 GPTS를 선택하여 창의적인 콘텐츠를 만들어보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherGPTS.map((gpts, index) => (
          <GPTSCard
            key={gpts.id}
            title={gpts.title}
            description={gpts.description}
            url={gpts.url}
            imageUrl={gpts.imageUrl}
            colorClass={otherCardColors[index % otherCardColors.length]}
            buttonColorClass="bg-blue-600 hover:bg-blue-700"
          />
        ))}
      </div>
    </section>
  );
}

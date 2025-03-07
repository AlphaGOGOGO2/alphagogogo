
import { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "OpenAI의 새로운 모델, GPT-5 출시 예정",
    excerpt: "OpenAI가 GPT-5의 출시 계획을 발표했습니다. 더 강력해진 성능과 혁신적인 기능이 기대됩니다.",
    content: "OpenAI가 GPT-5의 출시 계획을 발표했습니다. 새 모델은 이전 버전보다 훨씬 개선된 추론 능력과 정확성을 자랑합니다. OpenAI의 CEO에 따르면, GPT-5는 복잡한 수학 문제 해결, 창의적인 콘텐츠 생성, 그리고 인간과 구분하기 어려운 자연스러운 대화 능력을 갖추게 될 것이라고 합니다.",
    category: "최신 AI소식",
    author: {
      name: "김인공",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    publishedAt: "2023-10-15",
    readTime: 5,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1032&auto=format&fit=crop",
    slug: "openai-gpt5-release"
  },
  {
    id: "2",
    title: "구글 DeepMind, 인공지능 의료 진단 시스템 개발",
    excerpt: "구글 DeepMind가 의료 분야를 혁신할 AI 진단 시스템을 발표했습니다. 의료계의 큰 변화가 예상됩니다.",
    content: "구글 DeepMind가 혁신적인 AI 의료 진단 시스템을 발표했습니다. 이 시스템은 X-ray, CT, MRI 등 다양한 의료 영상을 분석해 질병을 조기에 발견하는데 도움을 줍니다. 특히 희귀 질환 감지에서 뛰어난 성능을 보여, 의료 전문가들의 주목을 받고 있습니다.",
    category: "최신 AI소식",
    author: {
      name: "이딥러닝",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    publishedAt: "2023-10-12",
    readTime: 4,
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1170&auto=format&fit=crop",
    slug: "google-deepmind-ai-medical-diagnosis"
  },
  {
    id: "3",
    title: "AI 윤리 문제, 글로벌 규제 필요성 증가",
    excerpt: "인공지능 기술의 급속한 발전으로 윤리적 문제가 증폭되고 있습니다. 글로벌 규제 프레임워크의 필요성이 강조됩니다.",
    content: "AI 기술의 급속한 발전으로 윤리적 문제가 증폭되고 있습니다. 얼굴 인식 기술의 오용, 알고리즘 편향성, 자율 무기 시스템 등 다양한 윤리적 우려가 제기되고 있습니다. 전문가들은 글로벌 수준의 AI 규제 프레임워크가 필요하다고 강조하고 있습니다.",
    category: "화제의 이슈",
    author: {
      name: "박윤리",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    publishedAt: "2023-10-08",
    readTime: 6,
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    slug: "ai-ethics-global-regulation"
  },
  {
    id: "4",
    title: "AI로 변화하는 일상, 스마트홈의 미래",
    excerpt: "인공지능 기술이 가정에 미치는 영향과 스마트홈의 진화에 대해 알아봅니다.",
    content: "인공지능 기술의 발전으로 스마트홈이 빠르게 진화하고 있습니다. 음성 명령으로 제어되는 가전제품, 자동 온도 조절, 보안 시스템 등 다양한 AI 기능이 우리의 일상을 더 편리하게 만들고 있습니다. 미래의 스마트홈은 거주자의 습관과 선호도를 학습해 자동으로 최적의 환경을 조성할 것으로 예상됩니다.",
    category: "라이프스타일",
    author: {
      name: "최스마트",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    publishedAt: "2023-10-05",
    readTime: 3,
    coverImage: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1042&auto=format&fit=crop",
    slug: "ai-changing-daily-life-smart-home"
  },
  {
    id: "5",
    title: "AI 스타트업, 투자 자금 급증",
    excerpt: "AI 스타트업 생태계가 급속도로 성장하며 투자 열기가 뜨겁습니다. 주요 투자 동향을 분석합니다.",
    content: "전 세계적으로 AI 스타트업에 대한 투자가 급증하고 있습니다. 2023년 상반기에만 약 500억 달러의 자금이 AI 관련 스타트업에 투자되었으며, 이는 전년 동기 대비 30% 증가한 수치입니다. 특히 생성형 AI, 자율주행, 헬스케어 AI 분야의 스타트업들이 큰 주목을 받고 있습니다.",
    category: "최신 AI소식",
    author: {
      name: "정투자",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    publishedAt: "2023-10-02",
    readTime: 4,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop",
    slug: "ai-startup-investment-surge"
  },
  {
    id: "6",
    title: "AI와 함께하는 건강한 식습관",
    excerpt: "인공지능을 활용한 개인 맞춤형 영양 관리와 식단 계획이 주목받고 있습니다.",
    content: "AI 기술을 활용한 맞춤형 영양 관리가 새로운 트렌드로 떠오르고 있습니다. 개인의 건강 상태, 식이 제한, 취향 등을 고려한 AI 알고리즘이 최적의 식단을 추천해주는 서비스가 인기를 끌고 있습니다. 이러한 서비스는 식품 낭비 감소와 건강 증진에 도움이 된다는 연구 결과도 있습니다.",
    category: "라이프스타일",
    author: {
      name: "한영양",
      avatar: "https://i.pravatar.cc/150?img=8"
    },
    publishedAt: "2023-09-28",
    readTime: 5,
    coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1170&auto=format&fit=crop",
    slug: "ai-healthy-eating-habits"
  }
];

export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === "전체보기") {
    return blogPosts;
  }
  return blogPosts.filter(post => post.category === category);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

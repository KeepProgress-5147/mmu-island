// 馬偕醫學大學 (Mackay Medical University) 3D 互動校園島結構化資料庫 (Schema v3.0 精簡版)
window.MMU_DATA = {
  schemaVersion: "3.0-mmu",
  meta: {
    source: "https://www.mmu.edu.tw/",
    verifiedAt: "2026-10-23",
    schoolName: {
      zh: "馬偕醫學大學",
      en: "Mackay Medical University"
    },
    motto: {
      zh: "寧願燒盡，不願銹壞｜哪裡有需要，就往哪裡去",
      en: "Rather burn out than rust out | Go wherever there is a need"
    },
    address: {
      zh: "252005 新北市三芝區中正路三段46號",
      en: "No.46, Sec. 3, Zhongzheng Rd., Sanzhi Dist., New Taipei City 252005, Taiwan"
    },
    tel: "02-2636-0303｜校安專線 0978-303123"
  },
  tickers: [
    {
      tag: "OPEN DAY",
      zh: "【2026/11/7】馬偕醫學大學 OPEN DAY 開放報名中",
      en: "[2026/11/7] MMU Open Day Registration Open",
      url: "https://sites.google.com/view/2026openday/open%E9%A6%95%E5%81%95"
    },
    {
      tag: "招生簡章",
      zh: "【116學年度】大學特殊選才 & 碩士班甄試入學招生簡章公告",
      en: "[2027 Intake] Special & Master's Admission Guidelines",
      url: "https://admissions.mmu.edu.tw/"
    },
    {
      tag: "AI × 醫療",
      zh: "馬偕醫大「老化感官實驗室」亮相第三屆高齡健康產業博覽會",
      en: "MMU Aging Sensory Lab Featured at Gerontechnology Expo",
      url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q226385149350252541"
    }
  ],
  personas: [
    {
      id: "all",
      name: { zh: "00 全校總覽", en: "00 All Campus" },
      note: {
        zh: "探索三芝依山面海的 7 座主題島嶼、27 座系所地標與 6 條跨域連結線。",
        en: "Explore all 7 hexagonal campus islands, 27 landmarks, and 6 interdisciplinary connections."
      },
      islands: ["med", "nursing", "health", "mackay", "campus", "admin", "future"],
      quickLinks: [
        { zh: "校園導覽平面圖", en: "2D Campus Map", url: "https://www.mmu.edu.tw/xmdoc?xsmsid=0O268619186836768754" },
        { zh: "馬偕簡介影片", en: "Intro Video", url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268618664945283727" },
        { zh: "交通與接駁時刻表", en: "Shuttle & Traffic", url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268618820486526285" },
        { zh: "數位校史館", en: "Digital Archives", url: "https://zone.mmu.edu.tw/MMCHistory/" }
      ]
    },
    {
      id: "prospect",
      name: { zh: "01 考生與家長", en: "01 Prospective Students" },
      note: {
        zh: "為高中生、考生與家長精選：三大學院 9 個系所、家庭式優質宿舍、招生簡章與 Open Day。",
        en: "Highlighted for applicants & parents: 3 Colleges, Family-style Dorms, Admissions & Open Day."
      },
      islands: ["med", "nursing", "health", "campus", "future"],
      quickLinks: [
        { zh: "🔥 招生資訊網", en: "Admissions Portal", url: "https://admissions.mmu.edu.tw/" },
        { zh: "🎉 11/7 OPEN DAY", en: "Open Day 2026", url: "https://sites.google.com/view/2026openday/open%E9%A6%95%E5%81%95" },
        { zh: "🌱 新生入學專區", en: "Freshmen Zone", url: "https://zone.mmu.edu.tw/freshmen/index.asp" },
        { zh: "🏠 家庭式優質宿舍", en: "Family-Style Dorms", url: "https://studentaffairs.mmu.edu.tw/xmdoc/cont?xsmsid=0P258381665440778705" },
        { zh: "🧭 IOH 前進馬偕經驗談", en: "IOH Student Talks", url: "https://ioh.tw/schools/%E9%A6%AC%E5%81%95%E9%86%AB%E5%AD%B8%E5%A4%A7%E5%AD%B8" }
      ]
    },
    {
      id: "student",
      name: { zh: "02 在校學生", en: "02 Current Students" },
      note: {
        zh: "在校生常用：Portal、Moodle、圖書館、課程地圖、家庭式宿舍、接駁車與臨床海外實習。",
        en: "For current students: Portal, Moodle, Library, Course Map, Shuttle Bus & Clinical Internships."
      },
      islands: ["med", "nursing", "health", "mackay", "campus", "admin"],
      quickLinks: [
        { zh: "🔑 PORTAL 入口", en: "Student Portal", url: "https://portal.mmu.edu.tw/" },
        { zh: "💻 Moodle 數位平台", en: "Moodle LMS", url: "https://moodle.mmu.edu.tw/" },
        { zh: "📚 圖書館館藏", en: "Library", url: "https://lib.mmu.edu.tw/" },
        { zh: "🗺️ 課程地圖", en: "Course Map", url: "https://coursemap.mmu.edu.tw/" },
        { zh: "📂 學習歷程平台", en: "e-Portfolio", url: "https://portal.mmu.edu.tw/MyResume2/View/" },
        { zh: "💳 學雜費入口網", en: "Tuition Portal", url: "https://eschool.landbank.com.tw/" },
        { zh: "🛡️ 學生安全專區", en: "Campus Safety", url: "https://studentaffairs.mmu.edu.tw/xmdoc/cont?xsmsid=0Q028382806477210834" }
      ]
    },
    {
      id: "staff",
      name: { zh: "03 教職員與校友", en: "03 Faculty & Alumni" },
      note: {
        zh: "教職員工與校友專區：行政處室、電子公文、馬偕雲、WebMail、高教深耕、USR 與校友會。",
        en: "For faculty, staff & alumni: Admin Offices, e-Document, SharePoint Cloud, WebMail, USR & Alumni."
      },
      islands: ["mackay", "admin", "future"],
      quickLinks: [
        { zh: "📝 電子公文系統", en: "e-Document", url: "https://edoc.mmu.edu.tw/yamiiflow/Home/login.asp" },
        { zh: "☁️ 馬偕雲 SharePoint", en: "MMU Cloud", url: "https://livemmuedu.sharepoint.com/teamwork/default.aspx" },
        { zh: "✉️ Web MAIL", en: "Web Mail", url: "https://outlook.office365.com/mail/" },
        { zh: "🌱 高教深耕計畫", en: "Higher Ed Sprout", url: "https://sprout.mmu.edu.tw/" },
        { zh: "🤝 USR 推動辦公室", en: "USR Office", url: "https://mmuusr.mmu.edu.tw/" },
        { zh: "🎓 馬偕醫大校友會", en: "Alumni Assoc.", url: "https://alumni.mmu.edu.tw/" },
        { zh: "❤️ 贊助馬偕", en: "Give to MMU", url: "https://secretariat.mmu.edu.tw/submenu?usein=7&psid=0P288359918415697143" }
      ]
    }
  ],
  islands: [
    {
      id: "med",
      number: 1,
      q: 0,
      r: 0,
      ground: "granite",
      color: "#b83b2b",
      short: { zh: "醫學院", en: "Medicine" },
      name: { zh: "醫學院島｜College of Medicine", en: "College of Medicine Island" },
      summary: {
        zh: "培育兼具仁愛人文精神與尖端生物醫學研究能力之臨床醫師、醫檢再生醫學、視光與生醫科學人才。",
        en: "Cultivating compassionate physicians, medical laboratory scientists, optometrists, and biomedical researchers."
      },
      vision: {
        zh: "以病人為中心、結合 AI 與再生醫學的現代醫學重鎮。",
        en: "Patient-centered medical education integrated with AI and regenerative medicine."
      },
      url: "https://cmed.mmu.edu.tw/",
      buildings: [
        {
          id: "med-school",
          kind: "medhall",
          sign: "醫學系",
          pos: [-0.48, -0.45, 1.05],
          name: { zh: "醫學系（含臨床醫學碩士班）", en: "School of Medicine (M.D. & M.S.)" },
          who: { zh: "醫學生、臨床醫師科學家", en: "Medical students & physician-scientists" },
          plain: {
            zh: "結合馬偕紀念醫院各大院區豐富臨床資源，開設「醫師科學家學分學程」，並推動蒙古、美國等多元海外臨床實習。",
            en: "Backed by MacKay Memorial Hospital's clinical network, offering Physician-Scientist programs and global clerkships."
          },
          facts: [
            { zh: "6 年制醫學教育與馬偕紀念醫院無縫臨床實習", en: "6-year MD curriculum with MMH clinical training", tile: { zh: "馬偕體系", en: "MMH Network" } },
            { zh: "設有臨床醫學碩士班與醫師科學家學分學程", en: "Includes Clinical Medicine M.S. & Physician-Scientist track", tile: { zh: "醫師科學家", en: "MD-PhD Track" } },
            { zh: "定期選送醫學生赴蒙古與歐美進行多元醫療實習", en: "International medical clerkships in Mongolia & USA" }
          ],
          flows: ["F1", "F3", "F5"],
          url: "https://medicine.mmu.edu.tw/"
        },
        {
          id: "med-lab",
          kind: "labtower",
          sign: "醫檢再生",
          pos: [0.65, -0.42, 0.85],
          name: { zh: "醫學檢驗暨再生醫學學系", en: "Dept. of Medical Laboratory and Regenerative Medicine" },
          who: { zh: "醫事檢驗師、細胞治療與再生醫學研發人才", en: "Medical technologists & regenerative medicine researchers" },
          plain: {
            zh: "全國獨具特色結合「精準醫學檢驗」與「幹細胞／組織工程再生醫學」之學系，培養次世代精準醫療核心人才。",
            en: "Uniquely combines precision clinical laboratory science with stem cell and regenerative medicine."
          },
          facts: [
            { zh: "雙核心課程：醫事檢驗師國考證照 ＋ 再生醫學實驗技術", en: "Dual focus: MT license + regenerative medicine", tile: { zh: "精準＋再生", en: "Dual Core" } },
            { zh: "配備分子診斷、細胞培養與流式細胞分析實驗空間", en: "Equipped with advanced molecular & cell therapy labs" }
          ],
          flows: ["F1", "F4"],
          url: "https://lab-reg-med.mmu.edu.tw/"
        },
        {
          id: "med-opt",
          kind: "optdome",
          sign: "視光學系",
          pos: [-0.52, 0.55, 0.82],
          name: { zh: "視光學系", en: "Department of Optometry" },
          who: { zh: "驗光師、視覺科學與高齡視力保健專家", en: "Optometrists & visual health specialists" },
          plain: {
            zh: "培育專業驗光師與視覺照護人才，並積極投入三芝與偏鄉長者視力保健、防跌衛教與跨領域視覺科技。",
            en: "Trains licensed optometrists while leading community vision care and fall-prevention for seniors."
          },
          facts: [
            { zh: "完整驗光師國考培訓與臨床視光實驗中心", en: "Comprehensive optometry clinic & license training", tile: { zh: "專業驗光", en: "Optometry" } },
            { zh: "結合 USR 團隊推動長者多元化視覺衛教與防跌服務", en: "Active in senior vision care & community health" }
          ],
          flows: ["F1", "F2"],
          url: "https://optometry.mmu.edu.tw/"
        },
        {
          id: "med-biomed",
          kind: "biomedpod",
          sign: "生醫所",
          pos: [0.58, 0.55, 0.78],
          name: { zh: "生物醫學研究所", en: "Graduate Institute of Biomedical Sciences" },
          who: { zh: "生醫碩博士研究員、轉譯醫學團隊", en: "Biomedical graduate researchers" },
          plain: {
            zh: "聚焦神經科學、癌症生醫、心血管與轉譯醫學研究，與馬偕紀念醫院醫學研究部緊密合作。",
            en: "Focuses on neuroscience, oncology, and translational medicine in partnership with MMH."
          },
          facts: [
            { zh: "基礎與臨床轉譯醫學深度結合，發表高影響力國際期刊", en: "Strong translational research with MMH", tile: { zh: "轉譯生醫", en: "Translational" } }
          ],
          flows: ["F4"],
          url: "https://biomedical.mmu.edu.tw/"
        }
      ]
    },
    {
      id: "nursing",
      number: 2,
      q: 1,
      r: 0,
      ground: "softpad",
      color: "#d96b52",
      short: { zh: "護理學院", en: "Nursing" },
      name: { zh: "護理學院島｜College of Nursing", en: "College of Nursing Island" },
      summary: {
        zh: "傳承馬偕全人照護精神，設有護理學系學士班、碩士班與二年制在職專班，培育臨床與社區護理領導人才。",
        en: "Inheriting MacKay's holistic care spirit across B.S., M.S., and RN-to-BSN nursing programs."
      },
      vision: {
        zh: "用專業與溫暖陪伴生命每一個階段。",
        en: "Accompanying every stage of life with clinical excellence and warmth."
      },
      url: "https://cnursing.mmu.edu.tw/",
      buildings: [
        {
          id: "nur-dept",
          kind: "nursinghall",
          sign: "護理學系",
          pos: [-0.25, -0.38, 1.05],
          name: { zh: "護理學系（含碩士班、二年制在職專班）", en: "School of Nursing (BSN, MSN, In-Service)" },
          who: { zh: "護理師、專科護理師、臨床護理主管", en: "Nurses, NPs, and nursing leaders" },
          plain: {
            zh: "提供學士班、碩士班與二技在職進修完整學制，結合馬偕醫療體系優質實習與獎助學金支持。",
            en: "Full nursing progression (BSN, MSN, RN-BSN) with clinical placements across MacKay hospitals."
          },
          facts: [
            { zh: "涵蓋大學部、碩士班與二年制在職專班完整進修管道", en: "BSN, MSN & 2-year in-service programs", tile: { zh: "完整學制", en: "Full Tracks" } },
            { zh: "護理師國考高通過率，畢業即與馬偕醫療體系無縫接軌", en: "High RN licensure pass rate & direct hospital career path", tile: { zh: "臨床接軌", en: "MMH Career" } }
          ],
          flows: ["F1", "F3"],
          url: "https://nursing.mmu.edu.tw/"
        },
        {
          id: "nur-sim",
          kind: "simward",
          sign: "臨床模擬",
          pos: [0.68, 0.28, 0.82],
          name: { zh: "高擬真臨床技能模擬中心", en: "High-Fidelity Clinical Simulation Center" },
          who: { zh: "醫護實習生、跨領域臨床團隊", en: "Medical & nursing trainees" },
          plain: {
            zh: "配備高擬真模擬病人、智慧病房與標準化病人（OSCE）考場，在進入醫院前練就紮實臨床應變力。",
            en: "High-fidelity patient simulators and OSCE stations for hands-on clinical readiness."
          },
          facts: [
            { zh: "沉浸式擬真病房與跨職類團隊合作訓練（IPE）", en: "Immersive simulation wards & IPE training", tile: { zh: "高擬真OSCE", en: "OSCE Lab" } }
          ],
          flows: ["F1"],
          url: "https://nursing.mmu.edu.tw/"
        },
        {
          id: "nur-comm",
          kind: "carepavilion",
          sign: "社區照護",
          pos: [-0.55, 0.58, 0.78],
          name: { zh: "社區健康與偏鄉護理實作站", en: "Community & Rural Health Nursing Station" },
          who: { zh: "社區護理師、北海岸與偏鄉居民", en: "Community nurses & local residents" },
          plain: {
            zh: "帶領學生走入三芝在地社區、台東與恆春偏鄉，進行血壓骨密篩檢、健康促進講座與居家關懷。",
            en: "Engages students in Sanzhi, Taitung, and Hengchun community health screenings and outreach."
          },
          facts: [
            { zh: "深耕北海岸三芝、石門與花東偏鄉衛生教育服務", en: "Deeply rooted in North Coast & rural health outreach", tile: { zh: "偏鄉衛教", en: "Outreach" } }
          ],
          flows: ["F2"],
          url: "https://cnursing.mmu.edu.tw/"
        }
      ]
    },
    {
      id: "health",
      number: 3,
      q: 0,
      r: 1,
      ground: "garden",
      color: "#4d8b6e",
      short: { zh: "厚生健康學院", en: "Health & Welfare" },
      name: { zh: "厚生健康學院島｜College of Health & Welfare", en: "College of Health & Welfare Island" },
      summary: {
        zh: "因應超高齡社會與精準復健需求，整合聽力暨語言治療學系、長期照護研究所與高齡福祉科技研究所。",
        en: "Addressing super-aged society needs through Audiology & Speech Therapy, Long-Term Care, and Gerontechnology."
      },
      vision: {
        zh: "科技賦能高齡福祉，專業守護溝通與長照尊嚴。",
        en: "Empowering senior well-being and communication dignity with technology and care."
      },
      url: "https://chw.mmu.edu.tw/",
      buildings: [
        {
          id: "hlth-aud",
          kind: "audhall",
          sign: "聽語學系",
          pos: [-0.52, -0.42, 0.95],
          name: { zh: "聽力暨語言治療學系", en: "Dept. of Audiology and Speech-Language Pathology" },
          who: { zh: "聽力師、語言治療師", en: "Audiologists & speech-language pathologists" },
          plain: {
            zh: "分為聽力組與語言治療組，培育兒童早療、成人吞嚥與溝通障礙、高齡聽覺復健之高需求臨床專業人才。",
            en: "Dual tracks in Audiology and Speech-Language Pathology for pediatric and geriatric rehabilitation."
          },
          facts: [
            { zh: "聽力師與語言治療師雙國考證照搖籃，就業市場極度搶手", en: "Premier training for licensed audiologists & SLPs", tile: { zh: "雙國考證照", en: "Dual License" } },
            { zh: "建置專業標準無響室、聽力檢查室與吞嚥語言治療室", en: "Standard anechoic chambers & speech therapy clinics" }
          ],
          flows: ["F1", "F2", "F3"],
          url: "https://aud-slp.mmu.edu.tw/"
        },
        {
          id: "hlth-ltc",
          kind: "ltcgarden",
          sign: "長照所",
          pos: [0.58, -0.42, 0.85],
          name: { zh: "長期照護研究所", en: "Graduate Institute of Long-Term Care" },
          who: { zh: "長照機構經營者、高階長照管理與政策人才", en: "Long-term care managers & policy specialists" },
          plain: {
            zh: "結合醫療、社福與經營管理，培育高齡社會急需之長照體系規劃、失智照護與社區整合型服務領導人才。",
            en: "Integrates healthcare and management to train leaders in long-term and dementia care."
          },
          facts: [
            { zh: "跨域整合醫療照護、長照政策與社區健康促進實務", en: "Interdisciplinary LTC management & dementia care", tile: { zh: "高階長照", en: "LTC Leadership" } }
          ],
          flows: ["F2"],
          url: "https://ltc.mmu.edu.tw/"
        },
        {
          id: "hlth-gero",
          kind: "geropod",
          sign: "高齡福祉所",
          pos: [-0.52, 0.55, 0.82],
          name: { zh: "高齡福祉科技研究所", en: "Graduate Institute of Gerontechnology" },
          who: { zh: "福祉科技研發師、智慧健康產品設計師", en: "Gerontechnology innovators & smart health designers" },
          plain: {
            zh: "運用智慧感測、AI 輔助科技與人因工程，開發協助長者自主生活、防跌保健與樂齡地壺球運動之創新方案。",
            en: "Applies AI, smart sensors, and ergonomics to empower independent and active aging."
          },
          facts: [
            { zh: "結合智慧穿戴、輔具設計與樂齡健康促進活動", en: "Smart wearables, assistive tech & active aging", tile: { zh: "智慧樂齡", en: "Gerontech" } }
          ],
          flows: ["F2", "F4"],
          url: "https://gw-tech-sci.mmu.edu.tw/"
        },
        {
          id: "hlth-aginglab",
          kind: "sensorylab",
          sign: "老化感官室",
          pos: [0.58, 0.55, 0.82],
          name: { zh: "老化感官體驗實驗室", en: "Aging Sensory Experience Laboratory" },
          who: { zh: "全校師生、高齡健康產業夥伴", en: "Students, researchers & health industry partners" },
          plain: {
            zh: "曾亮眼展出於「第三屆高齡健康產業博覽會」，透過擬真感官退化體驗，培養同理長者需求的空間與產品設計思維。",
            en: "Featured at the 3rd Gerontechnology Expo, simulating sensory aging to foster empathetic design."
          },
          facts: [
            { zh: "亮相高齡健康產業博覽會，以同理體驗驅動高齡創新", en: "Featured highlight at National Gerontechnology Expo", tile: { zh: "博覽會亮點", en: "Expo Highlight" } }
          ],
          flows: ["F2", "F4"],
          url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q226385149350252541"
        }
      ]
    },
    {
      id: "mackay",
      number: 4,
      q: -1,
      r: 1,
      ground: "terracotta",
      color: "#8e4a3b",
      short: { zh: "全人與馬偕精神", en: "MacKay Spirit" },
      name: { zh: "全人與馬偕精神島｜Holistic & MacKay Spirit", en: "Holistic Education & MacKay Spirit Island" },
      summary: {
        zh: "以「寧願燒盡，不願銹壞」之馬偕精神為根基，透過全人教育中心與數位校史館，涵養學生人文關懷與生命韌性。",
        en: "Rooted in Dr. MacKay's motto 'Rather burn out than rust out', fostering medical humanities and holistic growth."
      },
      vision: {
        zh: "焚而不燬的愛與服務，培育溫暖的醫療人文實踐者。",
        en: "Unfading love and service, nurturing compassionate medical humanists."
      },
      url: "https://holistic.mmu.edu.tw/",
      buildings: [
        {
          id: "mk-chapel",
          kind: "chapel",
          sign: "馬偕禮拜堂",
          pos: [-0.45, -0.42, 1.08],
          name: { zh: "馬偕精神禮拜堂（焚而不燬）", en: "MacKay Spirit Chapel (Burning Bush)" },
          who: { zh: "全校師生、校牧室、參訪貴賓", en: "All students, faculty, chaplaincy & visitors" },
          plain: {
            zh: "象徵摩西荊棘焚而不燬與馬偕博士無私奉獻的精神地標，舉辦生命教育、感恩禮拜與音樂藝文聚會。",
            en: "Symbolic landmark of the Burning Bush and Dr. MacKay's devotion, hosting life education and cultural gatherings."
          },
          facts: [
            { zh: "傳承馬偕博士「寧願燒盡，不願銹壞」與「哪裡有需要，就往哪裡去」精神", en: "Embodies Dr. MacKay's selfless service motto", tile: { zh: "焚而不燬", en: "Burning Bush" } },
            { zh: "串聯摩西的故事、馬偕的故事、馬偕醫院的故事與我們的故事", en: "Connects the 4 foundational stories of MacKay" }
          ],
          flows: ["F3"],
          url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268593124160844054"
        },
        {
          id: "mk-holistic",
          kind: "rotunda",
          sign: "全人中心",
          pos: [0.62, -0.38, 0.88],
          name: { zh: "全人教育中心", en: "Holistic Education Center" },
          who: { zh: "全校大一至大四學生、通識與語文師資", en: "All undergraduate students & liberal arts faculty" },
          plain: {
            zh: "統籌醫學人文、倫理哲學、外語溝通、跨域資訊與體育課程，奠定醫護健康專業背後的博雅底蘊。",
            en: "Coordinates medical humanities, ethics, languages, digital literacy, and physical education."
          },
          facts: [
            { zh: "涵蓋人文社會、自然科技、外國語文與服務學習四大通識領域", en: "4 core liberal arts & medical humanities pillars", tile: { zh: "博雅全人", en: "Holistic Ed" } }
          ],
          flows: ["F3"],
          url: "https://holistic.mmu.edu.tw/"
        },
        {
          id: "mk-history",
          kind: "museum",
          sign: "數位校史館",
          pos: [-0.52, 0.56, 0.8],
          name: { zh: "數位校史館暨馬偕故事館", en: "Digital Campus Archives & MacKay Museum" },
          who: { zh: "校友、新生、社會大眾", en: "Alumni, freshmen & the public" },
          plain: {
            zh: "典藏從 1872 年馬偕博士登陸淡水、創辦滬尾偕醫館，到三芝創校並改制為「馬偕醫學大學」的珍貴歷史軌跡。",
            en: "Chronicles the history from Dr. MacKay's 1872 landing in Tamsui to the university in Sanzhi."
          },
          facts: [
            { zh: "完整線上數位校史展覽，記錄馬偕醫療教育百年傳承", en: "Interactive digital archives of MacKay's medical legacy", tile: { zh: "百年傳承", en: "Since 1872" } }
          ],
          flows: ["F3"],
          url: "https://zone.mmu.edu.tw/MMCHistory/"
        },
        {
          id: "mk-board",
          kind: "monument",
          sign: "治校理念",
          pos: [0.58, 0.56, 0.72],
          name: { zh: "治校理念與馬偕學校財團法人", en: "University Governance & Board of Trustees" },
          who: { zh: "董事會、校長室、校友會", en: "Board of Trustees, President's Office & Alumni" },
          plain: {
            zh: "秉持基督救世愛人精神與僕人領袖治校理念，凝聚馬偕學校財團法人與馬偕醫大校友會力量。",
            en: "Guided by servant leadership and supported by the MacKay Educational Foundation and Alumni Association."
          },
          facts: [
            { zh: "結合馬偕學校財團法人與校友會，支持學校永續辦學", en: "Strong governance & alumni network", tile: { zh: "僕人領袖", en: "Leadership" } }
          ],
          flows: ["F3"],
          url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268618457494951269"
        }
      ]
    },
    {
      id: "campus",
      number: 5,
      q: -1,
      r: 0,
      ground: "schoolyard",
      color: "#3b7a9c",
      short: { zh: "山海生活與宿舍", en: "Campus Life" },
      name: { zh: "三芝山海生活與宿舍島｜Campus Life & Dorms", en: "Sanzhi Campus Life & Family Dorms Island" },
      summary: {
        zh: "坐擁三芝背山面海的壯麗景致，提供全國罕見的高品質「家庭式學生宿舍」、海景圖書館、多功能活動中心與便捷接駁車。",
        en: "Set between Datun Mountain and the Taiwan Strait, featuring renowned family-style dorms, sea-view library, and shuttle buses."
      },
      vision: {
        zh: "在山海夕陽相伴的溫馨住宿書院中，享受共學與生活。",
        en: "Living and learning together in a warm residential college by the mountains and sea."
      },
      url: "https://studentaffairs.mmu.edu.tw/xmdoc/cont?xsmsid=0P258381665440778705",
      buildings: [
        {
          id: "cmp-dorm",
          kind: "familydorm",
          sign: "家庭式宿舍",
          pos: [-0.48, -0.45, 1.05],
          name: { zh: "家庭式優質學生宿舍", en: "Family-Style Student Dormitories" },
          who: { zh: "全體住宿生、大一新生", en: "All residential students & freshmen" },
          plain: {
            zh: "馬偕醫大最具口碑的校園亮點！採用溫馨「家庭式套房／公寓」格局，設有獨立客廳交誼空間、衛浴與山海景觀窗。",
            en: "MMU's signature attraction! Apartment-style suites with shared living rooms, private baths, and mountain/ocean views."
          },
          facts: [
            { zh: "家庭式溫馨格局（含客廳交誼廳與景觀房），住宿滿意度極高", en: "Apartment-style suites with living rooms & sea views", tile: { zh: "家庭式宿舍", en: "Suite Dorms" } },
            { zh: "大一新生保障住宿，打造住宿書院般的跨系共學情誼", en: "Guaranteed freshman housing & residential community", tile: { zh: "保障住宿", en: "Guaranteed" } }
          ],
          flows: ["F6"],
          url: "https://studentaffairs.mmu.edu.tw/xmdoc/cont?xsmsid=0P258381665440778705"
        },
        {
          id: "cmp-lib",
          kind: "library",
          sign: "圖書館",
          pos: [0.62, -0.42, 0.9],
          name: { zh: "圖資處圖書館暨馬偕共學園", en: "University Library & Shared Learning Commons" },
          who: { zh: "全校師生、研究人員", en: "Students, faculty & researchers" },
          plain: {
            zh: "館藏豐富醫學、護理與高齡福祉電子期刊資料庫，並設有「馬偕共學園」討論室與海景閱覽區。",
            en: "Rich medical databases, collaborative study pods, and panoramic sea-view reading spaces."
          },
          facts: [
            { zh: "整合臨床醫學資料庫、馬偕共學園與自主學習空間", en: "Medical databases & collaborative learning commons", tile: { zh: "馬偕共學園", en: "Co-Learning" } }
          ],
          flows: ["F5", "F6"],
          url: "https://lib.mmu.edu.tw/"
        },
        {
          id: "cmp-activity",
          kind: "arena",
          sign: "活動中心",
          pos: [-0.52, 0.55, 0.85],
          name: { zh: "多功能活動中心與運動場", en: "Multi-Purpose Activity Center & Sports Field" },
          who: { zh: "學生社團、體育校隊、全校師生", en: "Student clubs, sports teams & faculty" },
          plain: {
            zh: "包含室內綜合球場、健身房、社團辦公室、大型集會禮堂與戶外景觀跑道，是社團之夜與運動賽事的核心場域。",
            en: "Indoor gymnasium, fitness center, student club hub, auditorium, and scenic outdoor track."
          },
          facts: [
            { zh: "舉辦社團博覽會、聖誕點燈、畢業典禮與樂齡體育交流", en: "Hosts club fairs, sports games & campus concerts", tile: { zh: "多元社團", en: "Campus Arena" } }
          ],
          flows: ["F5"],
          url: "https://www.mmu.edu.tw/xmdoc?xsmsid=0O268619186836768754"
        },
        {
          id: "cmp-bus",
          kind: "busstation",
          sign: "交通接駁",
          pos: [0.62, 0.55, 0.78],
          name: { zh: "三芝校園交通路線與接駁總站", en: "Campus Shuttle Bus & Transit Hub" },
          who: { zh: "通勤師生、來校參訪考生與貴賓", en: "Commuters, students & campus visitors" },
          plain: {
            zh: "提供往返捷運紅樹林站、淡水站與石牌／台北之校園接駁專車與大台北公車路線（862、863、879 等），通勤便利。",
            en: "Direct campus shuttle buses and public transit lines connecting MRT Hongshulin, Tamsui, and Taipei."
          },
          facts: [
            { zh: "固定班次直達捷運紅樹林站與淡水站，無縫銜接台北捷運淡水信義線", en: "Regular shuttles to MRT Hongshulin & Tamsui stations", tile: { zh: "捷運直達接駁", en: "MRT Shuttle" } }
          ],
          flows: ["F6"],
          url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268618820486526285"
        }
      ]
    },
    {
      id: "admin",
      number: 6,
      q: 0,
      r: -1,
      ground: "street",
      color: "#5b6d82",
      short: { zh: "行政與數位校務", en: "Administration" },
      name: { zh: "行政與數位校務島｜Administration & Digital Hub", en: "Administration & Smart Campus Island" },
      summary: {
        zh: "整合第一、二教研大樓之 13 個行政處室與智慧校務平台（Portal、Moodle、馬偕雲、電子公文），為師生提供高效支援。",
        en: "Uniting 13 administrative offices in Academic Buildings I & II with smart digital systems (Portal, Moodle, Cloud)."
      },
      vision: {
        zh: "迎向 AI 新浪潮，打造智慧、透明、永續的行政支持體系。",
        en: "Embracing AI transformation to build a smart, transparent, and sustainable university administration."
      },
      url: "https://www.mmu.edu.tw/xmdoc?xsmsid=0O268672798421593308",
      buildings: [
        {
          id: "adm-main",
          kind: "admintower",
          sign: "教研行政樓",
          pos: [-0.48, -0.45, 1.05],
          name: { zh: "第一、二教研行政大樓（校長室／秘書室／研發處）", en: "Academic & Admin Buildings I & II (President / Secretariat / R&D)" },
          who: { zh: "校長室(分機1101)、秘書室(1112)、研發處(1106)", en: "President's Office, Secretariat & R&D Office" },
          plain: {
            zh: "校園核心雙翼建築，統籌校務發展策略、研究發展計畫、高教深耕、法規公告與國內外學術合作。",
            en: "Central twin-wing complex housing the President's Office, Secretariat, and Research & Development Office."
          },
          facts: [
            { zh: "校長室(分機1101)、秘書室(1112-1116)、研發處(1106-1110)", en: "President (ext.1101), Secretariat (1112), R&D (1106)", tile: { zh: "校務中樞", en: "Central HQ" } },
            { zh: "推動 AI 新浪潮校務策略研討與公開透明之校務財務資訊", en: "Leads AI campus strategy & transparent governance" }
          ],
          flows: ["F4", "F6"],
          url: "https://www.mmu.edu.tw/xmdoc?xsmsid=0O268672798421593308"
        },
        {
          id: "adm-academic",
          kind: "servicehub",
          sign: "教務與學務",
          pos: [0.62, -0.42, 0.88],
          name: { zh: "教務處與學生事務處服務中心", en: "Academic Affairs & Student Affairs Center" },
          who: { zh: "教務處(分機1121)、學務處(分機1131)、校安專線", en: "Academic Affairs (ext.1121) & Student Affairs (ext.1131)" },
          plain: {
            zh: "辦理招生課務、註冊選課、教師發展、學生生活輔導、心理諮商、衛生保健與 24 小時校安守護。",
            en: "One-stop center for curriculum, registration, counseling, health services, and 24/7 campus security."
          },
          facts: [
            { zh: "教務處分機 1121-1126｜學務處分機 1131-1139｜校安專線 0978-303123", en: "24/7 student support & academic services", tile: { zh: "一站式服務", en: "Student Care" } }
          ],
          flows: ["F6"],
          url: "https://academic.mmu.edu.tw/"
        },
        {
          id: "adm-general",
          kind: "ecohub",
          sign: "總務與CSR",
          pos: [-0.52, 0.55, 0.8],
          name: { zh: "總務處、人事會計與 CSR 永續校園中心", en: "General Affairs, HR, Accounting & CSR Sustainability" },
          who: { zh: "總務處(分機1141)、人事室、會計室、環安衛", en: "General Affairs (ext.1141), HR, Finance & EHS" },
          plain: {
            zh: "負責三芝山海校園營繕維護、採購出納、環境安全衛生與發行 CSR 永續報告書。",
            en: "Manages campus facilities, green energy, safety, finance, and CSR sustainability reporting."
          },
          facts: [
            { zh: "定期發布 CSR 永續報告書與校務財務公開資訊", en: "Publishes CSR Sustainability Reports & financial disclosures", tile: { zh: "綠色永續", en: "CSR & Green" } }
          ],
          flows: ["F2"],
          url: "https://general.mmu.edu.tw/"
        },
        {
          id: "adm-digital",
          kind: "cloudpod",
          sign: "馬偕雲Portal",
          pos: [0.58, 0.55, 0.8],
          name: { zh: "馬偕雲與數位校務中樞（Portal／Moodle／公文）", en: "MMU Digital Cloud Hub (Portal / Moodle / e-Doc)" },
          who: { zh: "圖資處資訊組、全校師生與行政同仁", en: "IT Division, faculty, staff & students" },
          plain: {
            zh: "串聯單一登入 PORTAL、Moodle 數位學習、Zuvio 即時反饋、馬偕雲 SharePoint、電子公文與資安個資防護。",
            en: "Integrates SSO Portal, Moodle LMS, Zuvio IRS, SharePoint Cloud, e-Document, and cybersecurity."
          },
          facts: [
            { zh: "單一入口整合教學、行政、學習歷程與資安個資保護專區", en: "Unified SSO digital campus infrastructure", tile: { zh: "智慧校務", en: "Smart Cloud" } }
          ],
          flows: ["F6"],
          url: "https://portal.mmu.edu.tw/"
        }
      ]
    },
    {
      id: "future",
      number: 7,
      q: 1,
      r: -1,
      ground: "boardwalk",
      color: "#c87d28",
      short: { zh: "招生、醫療與國際USR", en: "Admissions, MMH & USR" },
      name: { zh: "招生、醫療體系與國際USR島｜Admissions, MMH & Global USR", en: "Admissions, Hospital Network & Global USR Island" },
      summary: {
        zh: "從三芝出發連結世界！匯聚招生資訊與 Open Day、馬偕紀念醫院醫療體系、偏鄉 USR 衛教服務營與台蒙／台美海外交流。",
        en: "Connecting Sanzhi to the world: Admissions & Open Day, MacKay Memorial Hospital network, rural USR service, and global exchange."
      },
      vision: {
        zh: "走進馬偕，從三芝山海學園走向全國醫療體系與國際舞台。",
        en: "Step into MMU: from our mountain-and-sea campus to national hospitals and the global stage."
      },
      url: "https://admissions.mmu.edu.tw/",
      buildings: [
        {
          id: "fut-admit",
          kind: "admitarch",
          sign: "招生與OpenDay",
          pos: [-0.48, -0.45, 1.02],
          name: { zh: "招生資訊中心暨 OPEN DAY 歡迎廣場", en: "Admissions Center & OPEN DAY Plaza" },
          who: { zh: "高中生、家長、碩士班與在職專班考生", en: "High schoolers, parents & graduate applicants" },
          plain: {
            zh: "提供大學特殊選才、繁星推薦、申請入學、分發入學、碩士班甄試簡章與「探索馬偕秘笈」，每年舉辦盛大 OPEN DAY 體驗！",
            en: "One-stop admissions hub featuring application guides, exploration handbooks, and the annual MMU OPEN DAY."
          },
          facts: [
            { zh: "【2026/11/7】舉辦馬偕醫大 OPEN DAY 開放校園與實驗室體驗", en: "Annual Open Day with hands-on lab & dorm tours", tile: { zh: "11/7 OpenDay", en: "Open Day" } },
            { zh: "提供「探索馬偕秘笈」與 IOH 學長姐經驗分享", en: "Includes MMU Exploration Guide & IOH student stories", tile: { zh: "探索馬偕", en: "Admissions" } }
          ],
          flows: ["F6"],
          url: "https://admissions.mmu.edu.tw/"
        },
        {
          id: "fut-mmh",
          kind: "hospital",
          sign: "馬偕醫院體系",
          pos: [0.62, -0.42, 0.95],
          name: { zh: "馬偕紀念醫院暨夥伴醫療體系基地", en: "MacKay Memorial Hospital & Partner Healthcare Network" },
          who: { zh: "馬偕紀念醫院(台北/淡水/新竹/台東)、彰基、新樓醫院", en: "MacKay Memorial Hospital, CCH & Sin-Lau Hospital" },
          plain: {
            zh: "與馬偕紀念醫院（台北、淡水、兒醫、新竹、台東）、彰化基督教醫院及新樓醫院緊密結盟，提供最強大的臨床教學與就業後盾。",
            en: "Allied with MacKay Memorial Hospital branches, Changhua Christian Hospital, and Sin-Lau Hospital for clinical training."
          },
          facts: [
            { zh: "串聯台北、淡水、新竹、台東馬偕與彰基、新樓各大教學醫院", en: "Nationwide teaching hospital network across Taiwan", tile: { zh: "強大醫療網", en: "Hospital Ally" } }
          ],
          flows: ["F1"],
          url: "https://www.mmh.org.tw/"
        },
        {
          id: "fut-usr",
          kind: "usrbase",
          sign: "USR與SDGs",
          pos: [-0.52, 0.55, 0.82],
          name: { zh: "USR 大學社會責任與 SDGs 永續基地", en: "USR Social Responsibility & SDGs Hub" },
          who: { zh: "USR 推動辦公室、偏鄉服務營隊師生", en: "USR Office & rural medical service teams" },
          plain: {
            zh: "實踐「哪裡有需要，就往哪裡去」！常年舉辦台東、恆春社區衛教營、烏來兒童品格營、恆基偏鄉健康營與三芝地方創生。",
            en: "Living Dr. MacKay's spirit through rural health camps in Taitung, Hengchun, Wulai, and Sanzhi local revitalization."
          },
          facts: [
            { zh: "地方創生跨域創新傳捷報，足跡遍及三芝、烏來、恆春与台東", en: "Award-winning USR teams serving rural & indigenous communities", tile: { zh: "偏鄉醫療USR", en: "USR & SDGs" } }
          ],
          flows: ["F2"],
          url: "https://mmuusr.mmu.edu.tw/"
        },
        {
          id: "fut-global",
          kind: "pier",
          sign: "國際交流港",
          pos: [0.62, 0.55, 0.85],
          name: { zh: "國際醫療交流碼頭（台蒙／台美實習與 MOU）", en: "Global Medical Exchange Pier (Mongolia / USA)" },
          who: { zh: "國際事務團隊、海外實習與文化交流師生", en: "International affairs & global exchange students" },
          plain: {
            zh: "與蒙古科學院醫學科學研究所簽署 MOU、選送醫學生赴蒙古多元實習，並舉辦第 16 屆台美學生文化交流營與國防醫大國際會議。",
            en: "Features MOU with Mongolian Academy of Sciences, medical internships in Mongolia, and the 16th Taiwan-US Cultural Camp."
          },
          facts: [
            { zh: "攜手蒙古科學院簽署 MOU 並深耕第 16 屆台美學生文化交流營", en: "Mongolia medical MOU & 16th Taiwan-US Student Exchange", tile: { zh: "台蒙/台美交流", en: "Global MOU" } }
          ],
          flows: ["F5"],
          url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q231484583149575154"
        }
      ]
    }
  ],
  flows: [
    {
      id: "F1",
      from: ["med", "nursing", "health"],
      to: ["future"],
      walker: "med-student",
      carry: "stethoscope",
      badge: { zh: "臨床實習與醫院接軌", en: "Clinical Clerkship" },
      text: {
        zh: "醫學、護理、聽語、視光與醫檢學生，前往馬偕紀念醫院（台北／淡水／新竹／台東）、彰基與新樓醫院進行臨床見實習與就業接軌。",
        en: "Medical, nursing, audiology, optometry, and MT students train at MacKay Memorial Hospital and partner teaching hospitals."
      },
      url: "https://www.mmh.org.tw/"
    },
    {
      id: "F2",
      from: ["health", "nursing", "med"],
      to: ["future"],
      walker: "usr-volunteer",
      carry: "carebox",
      badge: { zh: "偏鄉衛教與高齡長照 USR", en: "Rural USR & Senior Care" },
      text: {
        zh: "師生組成衛教服務營深入三芝在地、台東、恆春、烏來與屏東恆基，提供長者視力防跌、骨質密度檢測、樂齡地壺球與兒童課輔。",
        en: "Students and faculty bring vision care, bone density checks, and health camps to Sanzhi, Taitung, Hengchun, and Wulai."
      },
      url: "https://mmuusr.mmu.edu.tw/"
    },
    {
      id: "F3",
      from: ["mackay"],
      to: ["med", "nursing", "health"],
      walker: "humanist",
      carry: "flame",
      badge: { zh: "馬偕精神與全人博雅涵養", en: "MacKay Holistic Spirit" },
      text: {
        zh: "以「寧願燒盡，不願銹壞」的馬偕精神與全人教育中心課程，為三大學院注入醫學倫理、生命關懷與人文素養。",
        en: "Infusing Dr. MacKay's selfless spirit and holistic liberal arts into all three health science colleges."
      },
      url: "https://holistic.mmu.edu.tw/"
    },
    {
      id: "F4",
      from: ["med"],
      to: ["health", "admin"],
      walker: "researcher",
      carry: "chip",
      badge: { zh: "AI 生醫與高齡福祉科技研發", en: "AI Biomed & Gerontech R&D" },
      text: {
        zh: "串聯生醫所、醫檢再生醫學、高齡福祉科技所與研發處，推動醫師科學家學程、AI 新浪潮校務與老化感官實驗室創新。",
        en: "Connecting Biomedical Sciences, Regenerative Medicine, and Gerontechnology for AI healthcare innovation."
      },
      url: "https://gw-tech-sci.mmu.edu.tw/"
    },
    {
      id: "F5",
      from: ["med", "campus"],
      to: ["future"],
      walker: "traveller",
      carry: "globe",
      badge: { zh: "台蒙／台美海外醫療文化交流", en: "Global Medical Exchange" },
      text: {
        zh: "醫學生赴蒙古進行多元臨床實習、與蒙古科學院簽署合作備忘錄（MOU），並舉辦台美學生文化交流營。",
        en: "Medical clerkships in Mongolia, Mongolian Academy of Sciences MOU, and Taiwan-US Cultural Exchange Camp."
      },
      url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q216399694066705693"
    },
    {
      id: "F6",
      from: ["future"],
      to: ["campus", "admin"],
      walker: "freshman",
      carry: "schoolbag",
      badge: { zh: "新生入學、接駁與家庭式住宿", en: "Freshman Onboarding & Dorms" },
      text: {
        zh: "從 Open Day 與招生入學開始，搭乘捷運紅樹林接駁專車進入三芝校園，入住溫馨家庭式宿舍並獲得教務與學務全方位支持。",
        en: "Seamless onboarding from Admissions & Open Day to MRT shuttle transit, family-style dorms, and student support."
      },
      url: "https://zone.mmu.edu.tw/freshmen/index.asp"
    }
  ],
  news: [
    {
      cat: "招生",
      date: "2026-10",
      island: "future",
      zh: "【116學年度】大學特殊選才招生考試簡章公告",
      en: "[2027 Intake] Undergraduate Special Admission Guidelines Released",
      url: "https://admissions.mmu.edu.tw/spe_NewsDetail.asp?catCode=&hidPage1=1&hidNewsCatID=&hidNewsID=1011"
    },
    {
      cat: "活動",
      date: "2026-11-07",
      island: "future",
      zh: "【2026/11/7】馬偕醫學大學 OPEN DAY 開放校園體驗",
      en: "[2026/11/7] Mackay Medical University OPEN DAY",
      url: "https://sites.google.com/view/2026openday/open%E9%A6%95%E5%81%95"
    },
    {
      cat: "招生",
      date: "2026-09",
      island: "future",
      zh: "【116學年度】碩士班甄試入學招生簡章",
      en: "[2027 Intake] Master's Program Admission by Recommendation",
      url: "https://admissions.mmu.edu.tw/newsListDetail.asp?hidNewsID=1214"
    },
    {
      cat: "榮譽",
      date: "2026-09",
      island: "mackay",
      zh: "馬偕醫大校友會第一次會員大會（成立大會）暨理監事會議",
      en: "Inaugural General Assembly of MMU Alumni Association",
      url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q272506106065634202"
    },
    {
      cat: "公告",
      date: "2026-08",
      island: "admin",
      zh: "迎向AI新浪潮！115學年度校務推動策略研討會圓滿落幕",
      en: "Embracing the AI Wave! 115th Academic Year University Strategy Retreat",
      url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q231504193666723996"
    },
    {
      cat: "榮譽",
      date: "2026-08",
      island: "med",
      zh: "本校醫學生至蒙古進行多元實習，深化台蒙兩國醫學教育合作",
      en: "MMU Medical Students Complete Diverse Clerkships in Mongolia",
      url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q231484583149575154"
    },
    {
      cat: "榮譽",
      date: "2026-08",
      island: "health",
      zh: "馬偕醫大「老化感官實驗室」亮相第三屆高齡健康產業博覽會",
      en: "MMU Aging Sensory Lab Shines at the 3rd Gerontechnology Expo",
      url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268676950752036440&sid=0Q226385149350252541"
    },
    {
      cat: "榮譽",
      date: "2026-10",
      island: "future",
      zh: "馬偕醫大地方創生跨域創新傳捷報",
      en: "MMU Interdisciplinary Regional Revitalization Team Wins Honors",
      url: "https://zone.mmu.edu.tw/epaper/News_DetailAll.asp?hidNewsID=4296"
    },
    {
      cat: "活動",
      date: "2026-09",
      island: "campus",
      zh: "第十六屆馬偕醫大台美學生文化交流營圓滿落幕",
      en: "16th MMU Taiwan-US Student Cultural Exchange Camp Successfully Concludes",
      url: "https://zone.mmu.edu.tw/epaper/News_DetailAll.asp?hidNewsID=4283"
    },
    {
      cat: "活動",
      date: "2026-09",
      island: "health",
      zh: "骨質保健、視覺多元化防跌衛教與健康樂齡地壺球系列活動",
      en: "Bone Health, Senior Vision Fall-Prevention & Floor Curling Series",
      url: "https://zone.mmu.edu.tw/epaper/News_DetailAll.asp?hidNewsID=4280"
    },
    {
      cat: "公告",
      date: "2026-09",
      island: "med",
      zh: "[課程資訊] 115-1 學年度「醫師科學家學分學程」招生與選課",
      en: "[Course Info] Physician-Scientist Credit Program Now Open",
      url: "https://medicine.mmu.edu.tw/xmdoc/cont?xsmsid=0P017302902531729048&sid=0Q231284944512757837"
    },
    {
      cat: "活動",
      date: "2026-08",
      island: "nursing",
      zh: "暑假台東、恆春社區衛教服務營 & 情牽烏來兒童課輔品格營",
      en: "Summer Rural Health Service Camps in Taitung, Hengchun & Wulai",
      url: "https://zone.mmu.edu.tw/epaper/News_DetailAll.asp?hidNewsID=4287"
    }
  ],
  offices: [
    { zh: "校長室", en: "President's Office", ext: "分機 1101", url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268581836718137468" },
    { zh: "秘書室", en: "Secretariat", ext: "分機 1112-1116", url: "https://secretariat.mmu.edu.tw/" },
    { zh: "教務處", en: "Academic Affairs", ext: "分機 1121-1126", url: "https://academic.mmu.edu.tw/" },
    { zh: "學生事務處", en: "Student Affairs", ext: "分機 1131-1139", url: "https://studentaffairs.mmu.edu.tw/" },
    { zh: "總務處", en: "General Affairs", ext: "分機 1141-1149", url: "https://general.mmu.edu.tw/" },
    { zh: "研究發展處", en: "R&D Office", ext: "分機 1106-1110", url: "https://research.mmu.edu.tw/" },
    { zh: "圖書資訊處", en: "Library & IT", ext: "圖書館 / 資訊服務", url: "https://lib.mmu.edu.tw/" },
    { zh: "校牧室", en: "Chaplain's Office", ext: "生命關懷與馬偕精神", url: "https://www.mmu.edu.tw/xmdoc?xsmsid=0O268672798421593308" },
    { zh: "人事室 & 會計室", en: "HR & Accounting", ext: "教職員行政支援", url: "https://www.mmu.edu.tw/xmdoc?xsmsid=0O268672798421593308" },
    { zh: "高教深耕 & USR辦公室", en: "Sprout & USR Office", ext: "校務計畫推動", url: "https://mmuusr.mmu.edu.tw/" }
  ],
  portals: [
    { role: "student", zh: "PORTAL 校園入口網", en: "Campus Portal (SSO)", url: "https://portal.mmu.edu.tw/" },
    { role: "student", zh: "Moodle 數位學習平台", en: "Moodle LMS", url: "https://moodle.mmu.edu.tw/" },
    { role: "staff", zh: "Web MAIL 教職員生信箱", en: "Office365 WebMail", url: "https://outlook.office365.com/mail/" },
    { role: "staff", zh: "馬偕雲 SharePoint", en: "MMU SharePoint Cloud", url: "https://livemmuedu.sharepoint.com/teamwork/default.aspx" },
    { role: "staff", zh: "電子公文系統", en: "e-Document System", url: "https://edoc.mmu.edu.tw/yamiiflow/Home/login.asp" },
    { role: "prospect", zh: "招生資訊網", en: "Admissions Website", url: "https://admissions.mmu.edu.tw/" },
    { role: "prospect", zh: "115/116 新生入學專區", en: "Freshmen Portal", url: "https://zone.mmu.edu.tw/freshmen/index.asp" },
    { role: "student", zh: "圖書館館藏與資料庫", en: "University Library", url: "https://lib.mmu.edu.tw/" },
    { role: "student", zh: "課程地圖網", en: "Course Map", url: "https://coursemap.mmu.edu.tw/" },
    { role: "student", zh: "學習歷程平台", en: "Student e-Portfolio", url: "https://portal.mmu.edu.tw/MyResume2/View/" },
    { role: "student", zh: "馬偕共學園", en: "Shared Learning Hub", url: "https://sharelearning.mmu.edu.tw/" },
    { role: "prospect", zh: "家庭式優質宿舍介紹", en: "Family-Style Dorms", url: "https://studentaffairs.mmu.edu.tw/xmdoc/cont?xsmsid=0P258381665440778705" },
    { role: "prospect", zh: "交通路線與公車時刻表", en: "Shuttle & Bus Schedule", url: "https://www.mmu.edu.tw/xmdoc/cont?xsmsid=0O268618820486526285" },
    { role: "staff", zh: "馬偕校園行事曆", en: "Academic Calendar", url: "https://secretariat.mmu.edu.tw/xmdoc/cont?xsmsid=0P288358800898356191" },
    { role: "all", zh: "數位校史館", en: "Digital History Museum", url: "https://zone.mmu.edu.tw/MMCHistory/" },
    { role: "all", zh: "CSR 永續報告與 SDGs", en: "CSR & SDGs Portal", url: "https://secretariat.mmu.edu.tw/xmdoc?xsmsid=0P288331526936266123" },
    { role: "all", zh: "校務及財務資訊公開", en: "Institutional Disclosure", url: "https://info.mmu.edu.tw/" },
    { role: "all", zh: "馬偕紀念醫院", en: "MacKay Memorial Hospital", url: "https://www.mmh.org.tw/" },
    { role: "all", zh: "彰化基督教醫院", en: "Changhua Christian Hospital", url: "https://www.cch.org.tw/" },
    { role: "all", zh: "新樓醫療財團法人", en: "Sin-Lau Hospital", url: "https://www.sinlau.org.tw/" }
  ]
};

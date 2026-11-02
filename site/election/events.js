(function(root){
const TIERS={
 daily:{label:'日常陳情',color:'#6e9c80',duration:45,miss:-1,personal:{energy:1,gain:5},delegate:{energy:12,stress:6,target:50,gain:7,fail:-2},fund:{cash:3,gain:6,turnout:0},spin:{gain:3,risk:.4,penalty:-7,reward:1}},
 dispute:{label:'地方爭議',color:'#d39455',duration:60,miss:-4,personal:{energy:1,gain:8},delegate:{energy:16,stress:10,target:65,gain:11,fail:-5},fund:{cash:5,gain:10,turnout:1},spin:{gain:5,risk:.5,penalty:-13,reward:2}},
 crisis:{label:'重大危機',color:'#bd6258',duration:75,miss:-8,personal:{energy:2,gain:12},delegate:{energy:22,stress:15,target:75,gain:17,fail:-9},fund:{cash:8,gain:15,turnout:2},spin:{gain:8,risk:.65,penalty:-22,reward:3}}
};
const c=(personal,delegate,third,main='insight',secondary='execution')=>[
 {id:'personal',kind:'personal',label:personal},
 {id:'delegate',kind:'delegate',label:delegate,main,secondary},
 {id:third[0],kind:third[0],label:third[1]}
];
const EVENTS=[
 {id:'datong_bus',district:0,tier:'daily',title:'公車又晚了',speaker:'阿海伯',text:'站牌顯示三分鐘，阿海伯已經等了二十七分鐘。上班族開始拍照抱怨。',choices:c('陪大家等到車來，記下誤點','派幕僚調出班次與塞車紀錄',['fund','增設一面即時到站資訊牌'])},
 {id:'datong_stalls',district:0,tier:'dispute',title:'河岸攤商搬遷爭議',speaker:'河岸攤商代表',text:'整建工程要求老攤商限期撤離，居民支持改善環境，攤商擔心再也回不來。',choices:c('召開攤商與居民現場協調會','派幕僚盤點租約與安置名單',['spin','先宣布「一攤不漏」爭取聲量'],'network','strategy')},
 {id:'datong_flood',district:0,tier:'crisis',title:'淡水河水位暴漲',speaker:'里長阿海伯',text:'豪雨讓河岸步道進水，低窪住戶正在搬物資，現場需要立即分工。',choices:c('親自到現場協助撤離','派幕僚建立撤離與物資調度表',['fund','投入緊急經費設置臨時物資站'],'execution','adaptability')},

 {id:'ximen_sidewalk',district:1,tier:'daily',title:'騎樓又被擋住了',speaker:'早餐店老闆',text:'貨箱、招牌和機車把人行空間塞滿，推輪椅的居民只能走到馬路上。',choices:c('陪居民走一遍危險路段','派幕僚畫出障礙熱點',['fund','設置可移動裝卸與停車標線'],'insight','execution')},
 {id:'ximen_noise',district:1,tier:'dispute',title:'商圈噪音誰來管',speaker:'樓上住戶',text:'店家靠晚間人潮維生，住戶卻連續失眠。雙方都說再退一步就活不下去。',choices:c('主持店家與住戶的夜間協商','派幕僚設計分時分區規則',['spin','站上安靜這一邊，先取得住戶掌聲'],'oratory','strategy')},
 {id:'ximen_crowd',district:1,tier:'crisis',title:'活動人潮推擠',speaker:'商圈救護志工',text:'臨時舞台出口被堵住，有人跌倒，網路正在流傳現場混亂的影片。',choices:c('進入現場疏導並確認傷者','派幕僚協調警消與活動主辦方',['fund','立刻增設護欄、救護與替代動線'],'adaptability','execution')},

 {id:'wanhua_light',district:2,tier:'daily',title:'河濱路燈壞了一排',speaker:'慢跑阿姨',text:'夜跑族改用手機照路，附近居民說已經反映三次，還是沒有人來修。',choices:c('晚上實際走一次並標記故障點','派幕僚確認維修工單卡在哪裡',['fund','租用臨時照明撐過維修空窗'],'execution','insight')},
 {id:'wanhua_shelter',district:2,tier:'dispute',title:'收容服務引發鄰里對立',speaker:'社福志工',text:'新的夜間收容服務遭居民反對，弱勢團體則擔心寒流來時無處可去。',choices:c('開一場居民、社工與使用者對話','派幕僚提出管理與回饋機制',['spin','用一句「安全優先」模糊帶過爭議'],'network','oratory')},
 {id:'wanhua_fire',district:2,tier:'crisis',title:'老屋深夜火警',speaker:'受災住戶',text:'巷弄狹窄讓消防車進不去，多戶居民暫時無家可歸，還有人失聯。',choices:c('親自協助安置並核對住戶','派幕僚整合消防、社政與醫療資訊',['fund','支付臨時住宿與緊急生活物資'],'execution','network')},

 {id:'shilin_rent',district:3,tier:'daily',title:'套房寫著「空間有潛力」',speaker:'租屋青年',text:'租金又漲，房間卻連桌子都放不下。青年想知道候選人是否真的租過房。',choices:c('走訪租屋處，聽完整生活成本','派幕僚整理租金與違規隔間資料',['fund','提供租屋法律與修繕諮詢站'],'network','insight')},
 {id:'shilin_market',district:3,tier:'dispute',title:'市場改建期限逼近',speaker:'市場自治會長',text:'耐震補強刻不容緩，但安置地點會讓攤商失去熟客，改建與生計正面衝突。',choices:c('到市場逐攤確認最低需求','派幕僚比較分期施工與中繼方案',['spin','搶先承諾原地原樣重建'],'strategy','network')},
 {id:'shilin_landslide',district:3,tier:'crisis',title:'山坡落石封路',speaker:'山區里長',text:'連日豪雨造成落石，獨居長者與慢性病居民可能被困，天色正在變暗。',choices:c('親自加入逐戶確認','派幕僚規劃撤離順序與替代道路',['fund','調度接駁、藥品與臨時安置點'],'execution','adaptability')},

 {id:'daan_playground',district:4,tier:'daily',title:'孩子放電，家長沒地方充電',speaker:'推車爸爸',text:'遊戲場很熱鬧，但遮蔭、飲水和無障礙座椅都不夠，家長只能輪流站著。',choices:c('陪親子走一圈記下使用痛點','派幕僚調查尖峰人流與設施缺口',['fund','先增設遮蔭與臨時休息座椅'],'insight','network')},
 {id:'daan_trees',district:4,tier:'dispute',title:'工程要移走老樹',speaker:'護樹居民',text:'校舍整建計畫要移植一排老樹，校方強調安全，居民質疑評估太倉促。',choices:c('召集校方、家長與護樹團體踏勘','派幕僚重查安全與替代工法',['spin','先拍護樹照表態，細節以後再談'],'strategy','oratory')},
 {id:'daan_food',district:4,tier:'crisis',title:'幼兒園疑似食物中毒',speaker:'焦急家長',text:'多名幼兒送醫，家長群組消息混亂，供餐來源與其他受影響園所尚未確認。',choices:c('到醫院與家長核對名單','派幕僚追查供餐鏈與檢驗進度',['fund','設置家長專線與替代餐食支援'],'insight','adaptability')},

 {id:'zhongzheng_market',district:5,tier:'daily',title:'市場卸貨卡住整條路',speaker:'美蘭姐',text:'攤商要進貨、居民要通行，貨車每天清晨把巷口塞成一場耐力賽。',choices:c('清晨跟一次完整卸貨流程','派幕僚測量時段與車流',['fund','試辦分時卸貨與手推接駁點'],'execution','insight')},
 {id:'zhongzheng_clinic',district:5,tier:'dispute',title:'診所與住戶搶停車空間',speaker:'診所護理師',text:'長者需要臨停下車，住戶卻長期找不到車位，雙方已經在群組互相點名。',choices:c('在尖峰時段陪雙方實地走一遍','派幕僚設計預約臨停與居民時段',['spin','公開站在病患這邊搶下道德高地'],'network','strategy')},
 {id:'zhongzheng_er',district:5,tier:'crisis',title:'急診量能突然吃緊',speaker:'急診護理師',text:'附近事故讓急診塞滿，輕症與重症混在入口，醫護需要外部協調分流。',choices:c('到現場協助資訊分流與家屬溝通','派幕僚協調鄰近院所與救護路線',['fund','設置臨時分流站與接駁支援'],'adaptability','execution')},

 {id:'neihu_shift',district:6,tier:'daily',title:'輪班接駁又錯過交班',speaker:'輪班工程師',text:'接駁班次和交班時間總是差十分鐘，這十分鐘足以讓人多等一小時。',choices:c('搭一次末班接駁記錄問題','派幕僚比對企業班表與接駁時刻',['fund','補助試辦跨企業共乘接駁'],'insight','execution')},
 {id:'neihu_overtime',district:6,tier:'dispute',title:'科技園區爆出超時工作',speaker:'匿名工程師',text:'員工提供加班紀錄，企業否認強迫加班。爆料者擔心身分曝光後被報復。',choices:c('私下聽取證詞並保護爆料者','派幕僚交叉比對工時與申訴資料',['spin','立即發文痛批企業，先搶下議題'],'insight','strategy')},
 {id:'neihu_leak',district:6,tier:'crisis',title:'廠房不明氣體外洩',speaker:'園區保全',text:'多名員工眼睛刺痛，廠方尚未公布物質，附近學校正在詢問是否停課。',choices:c('到警戒區外協助疏散與說明','派幕僚整合環保、消防與廠方數據',['fund','提供檢測、醫療與撤離交通支援'],'adaptability','insight')},

 {id:'nangang_jam',district:7,tier:'daily',title:'轉運站一動也不動',speaker:'阿達司機',text:'接送車、計程車和公車擠在同一入口，導航叫大家向前，前面卻沒有空間。',choices:c('坐進駕駛座觀察一輪尖峰動線','派幕僚分析各車種停等時間',['fund','試辦分流標線與臨時引導員'],'execution','insight')},
 {id:'nangang_trucks',district:7,tier:'dispute',title:'物流車改道進住宅區',speaker:'社區主委',text:'大型車避開施工路段後改走住宅巷道，物流業者說若禁止通行就會全面延誤。',choices:c('跟車走一次並聽取沿線居民意見','派幕僚設計分時路權與替代路線',['spin','宣布全面禁行大型車'],'strategy','network')},
 {id:'nangang_signal',district:7,tier:'crisis',title:'鐵路號誌故障大停擺',speaker:'轉運站值班員',text:'大量旅客滯留，接駁資訊彼此矛盾，救護通道也被人潮堵住。',choices:c('親自到大廳協助疏導資訊','派幕僚統整鐵路、公車與警消調度',['fund','緊急租用接駁車並設置物資點'],'adaptability','execution')},

 {id:'xinyi_nightbus',district:8,tier:'daily',title:'公車比夜班員工早下班',speaker:'夜班阿姨',text:'末班車開走後只能步行四十分鐘，沿途還有兩段沒有路燈。',choices:c('陪走一趟完整夜歸路線','派幕僚整理夜班人口與末班缺口',['fund','試辦深夜巡迴接駁'],'network','insight')},
 {id:'xinyi_rally',district:8,tier:'dispute',title:'造勢封路撞上居民生活',speaker:'附近住戶',text:'大型活動封路到深夜，商家有人潮、住戶有噪音，連救護車都得繞道。',choices:c('邀集主辦方、商家與住戶重新排程','派幕僚設計分區、時段與緊急通道',['spin','宣布縮小活動，先取得居民好感'],'strategy','oratory')},
 {id:'xinyi_blackout',district:8,tier:'crisis',title:'大規模停電困住住戶',speaker:'社區管理員',text:'多棟大樓停電，電梯裡有人受困，夜間商圈也開始出現推擠與謠言。',choices:c('到現場協助逐棟核對與安撫','派幕僚整合台電、消防與社區名單',['fund','設置充電、照明與緊急接駁站'],'adaptability','network')}
];
const BY_ID=Object.fromEntries(EVENTS.map(e=>[e.id,e]));
const api={TIERS,EVENTS,BY_ID};if(typeof module!=='undefined')module.exports=api;root.CampaignEvents=api;
})(typeof globalThis!=='undefined'?globalThis:this);

// ====== 全域變數 ======
let products = [];
let visibleCount = 12;
const loadStep = 12;
let filteredProducts = [];
let favorites = new Set(JSON.parse(localStorage.getItem("favorites")) || []);
let owned = JSON.parse(localStorage.getItem("owned")) || {};
let viewMode = "all";

// ====== 無限滾動偏移量 ======
const SCROLL_OFFSET = 400;

// ====== DOM 快取 ======
const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const yearFilter = document.getElementById("year-filter");
const detailFilter = document.getElementById("detail-search");
const seriesFilter = document.getElementById("series-filter");
const typeFilter = document.getElementById("type-filter");
const character1Filter = document.getElementById("character1-filter");
const character2Filter = document.getElementById("character2-filter");
const backBtn = document.getElementById("backToTop");

// ====== 自訂排序與角色群組 ======
const customSeriesOrder = [
  "2026 手作社","2026 鬼滅全編再放送CAFE·立志","2026 宅麵聯名","2026 AJ","2026 明治村聯名","2026 情人節","2026 節分","2026 幽浮桌BAR","2026 干支午年","2026 JUMPFES", 
  "2025-2026 誕生祭","2025 聖誕節","2025 C107·猗窩座再來片尾插畫抽賞","2025 AGF·EARLYWINTER","2025 AGF·椅子坐姿","2025 PIZZALA聯名","2025 築地銀章魚燒聯名","2025 池袋太陽城聯名·太陽都市傳說","2025 鬼滅之奏·柱訓練","2025 萬聖節","2025 豐收秋祭","2025 花火大會","2025 鬼滅百景·柱百景＆隊士百景","2025 南嘉堂·貓耳","2025 南夢宮·漆ノ章","2025 京まふ","2025 C106·相繫抽賞","2025 無限城第一章DINING","2025 無限城第一章CAFE","2025 無限城第一章劇場物販","2025 舉手系列·刀匠村","2025 全集中展·刀匠村·柱訓練","2025 幽浮桌BAR","2025 情人節","2025 干支巳年", 
  "2024-2025 誕生祭","2024 聖誕節","2024 萬聖節","2024 AGF·純喫茶","2024 AGF·Qpot甜點聯名","2024 鬼滅之奏·刀匠村","2024 柱新繪插圖抽賞","2024 無限列車重映劇場物販","2024 特別編集版劇場物販","2024 野餐","2024 CRAFTHOLIC宇宙人聯名","2024 C105·正月","2024 C104·柱訓練片尾＆臥姿插畫","2024 柱CAFE","2024 柱展","2024 柱活動開幕企劃·柱訓練AKV","2024 京まふ","2024 C105·幕間畫集封面抽賞","2024 絆之奇跡邁向柱訓練劇場物販·世界巡迴","2024 南嘉堂·いこいの里巡り其の弐","2024 南夢宮·陸ノ章","2024 動畫伍周年記念祭","2024 動畫伍周年記念祭＆後夜祭·干支辰年", "2024 情人節",
  "2023-2024 誕生祭","2023 聖誕節","2023 萬聖節","2023 AGF·椅子坐姿","2023 AGF·干支卯年","2023 上弦集結前進刀匠村劇場物販·世界巡迴","2023 全集中展·無限列車·遊郭","2023 鬼滅之奏·遊郭","2023 京まふ","2023 南嘉堂·いこいの里巡り","2023 南夢宮·伍ノ章","2023 山間活動","2023 情人節", 
  "2022-2023 誕生祭","2022 聖誕節","2022 萬聖節","2022 AGF·椅子坐姿","2022 舉手系列·遊郭","2022 舉手系列·無限列車","2022 動畫參周年記念祭","2022 PIZZALA聯名","2022 南嘉堂·祭日和","2022 南夢宮·肆ノ章","2022 兒童節","2022 情人節", 
  "2021 聖誕節","2021 萬聖節","2021 京まふ","2021 南嘉堂·猫との穏やかな日々","2021 AGF·鬼滅學園油漆","2021 舉手系列·立志","2021 暑假小憩","2021 南夢宮·参ノ章","2021 PIZZALA聯名", "2021 全集中展·立志","2021 鬼滅之奏·無限列車","2021 動畫貳周年記念祭·干支丑年","2021 動畫貳周年記念祭","2021 正月",
  "2020 聖誕節","2020 萬聖節","2020 南夢宮·壱ノ章","2020 鬼滅之奏·立志","2020 女兒節","2020 無限列車劇場物販",
  "2019 萬聖節"];
const customTypeOrder = ["立牌","徽章","卡片","色紙","杯墊","餐墊","吊飾","收納夾","貼紙","玩偶","模型","海報","壁掛","首飾、髮飾","收納小包、袋、盒","包、袋","衣物","推活小物","居家用品","隨身用品","文具","其他"];
const customCharacterOrder = [
  "富岡義勇","竈門炭治郎","竈門禰豆子","我妻善逸","嘴平伊之助","不死川玄彌","栗花落香奈乎", 
  "胡蝶忍","煉獄杏壽郎","宇髓天元","時透無一郎","甘露寺蜜璃","不死川實彌","伊黑小芭內", "悲鳴嶼行冥","產屋敷耀哉",
  "鬼舞辻無慘","黑死牟","童磨","猗窩座","半天狗","積怒","可樂","空喜","哀絕","憎珀天","鳴女","玉壺","妓夫太郎","墮姬","獪岳", 
  "錆兔","真菰","珠世","愈史郎","村田","鱗瀧左近次","桑島慈悟郎","鋼鐵塚","小鐵","鐵穴森","緣壹零式","隱",
  "繼國緣壹","狛治","戀雪","慶藏",
  "煉獄千壽郎","煉獄槙壽郎","煉獄瑠火","胡蝶香奈惠","神崎葵","寺內清","中原澄","高田菜穗","雛鶴","牧緒","須磨","時透有一郎","竈門炭十郎","竈門葵枝","竈門竹雄","竈門花子","竈門茂","竈門六太","產屋敷輝利哉","產屋敷彼方","產屋敷玖伊那",
  "魘夢","累","矢琶羽","朱紗丸","肌肉鼠","響凱","手鬼","沼鬼","佛堂鬼","蜘蛛姊姊","蜘蛛媽媽","蜘蛛爸爸","蜘蛛哥哥","下弦之陸","下弦之肆","下弦之參","下弦之貳"];

const characterGroups = {
  "九柱": ["伊黑小芭內","甘露寺蜜璃","富岡義勇","煉獄杏壽郎","宇髓天元","時透無一郎","胡蝶忍","悲鳴嶼行冥","不死川實彌"],
  "竈門一家": ["竈門炭治郎","竈門禰豆子","竈門葵枝","竈門竹雄","竈門花子","竈門茂","竈門六太"],
  "同期組":["竈門炭治郎","我妻善逸","嘴平伊之助","不死川玄彌","栗花落香奈乎"],
  "鱗瀧一門":["富岡義勇","竈門炭治郎","鱗瀧左近次","錆兔","真菰"],
  "竈門兄妹":["竈門炭治郎","竈門禰豆子"],
  "宇髓妻":["雛鶴","牧緒","須磨"],
  "三小隻":["竈門炭治郎","我妻善逸","嘴平伊之助"],
  "蝶屋小妹":["寺內清","中原澄","高田菜穗"],
  "兄妹之絆主視覺":["手鬼","錆兔","真菰","富岡義勇","竈門炭治郎","竈門禰豆子","鱗瀧左近次"],
  "淺草主視覺":["竈門炭治郎","鬼舞辻無慘"],
  "鼓屋敷主視覺":["竈門炭治郎","我妻善逸","嘴平伊之助","響凱"],
  "那田蜘蛛山主視覺":["竈門炭治郎","竈門禰豆子"],
  "柱合會議蝶屋敷主視覺":["伊黑小芭內","甘露寺蜜璃","富岡義勇","煉獄杏壽郎","宇髓天元","時透無一郎","胡蝶忍","悲鳴嶼行冥","不死川實彌"],
  "無限列車主視覺":["煉獄杏壽郎","竈門炭治郎","竈門禰豆子","我妻善逸","嘴平伊之助","魘夢"],
  "遊郭潛入決戰主視覺":["宇髓天元","竈門炭治郎","我妻善逸","嘴平伊之助"],
  "遊郭主視覺":["竈門炭治郎","我妻善逸","嘴平伊之助","宇髓天元","墮姬","須磨","雛鶴","牧緒","竈門禰豆子"],
  "刀匠村敵襲繫絆主視覺":["甘露寺蜜璃","時透無一郎"],
  "刀匠村主視覺":["竈門炭治郎","竈門禰豆子","不死川玄彌","猗窩座","童磨","黑死牟","玉壺","半天狗","甘露寺蜜璃","時透無一郎"],
  "柱訓練開幕主視覺":["竈門炭治郎","伊黑小芭內","甘露寺蜜璃","富岡義勇","時透無一郎","胡蝶忍","悲鳴嶼行冥","不死川實彌"],
  "柱訓練主視覺":["伊黑小芭內","甘露寺蜜璃","富岡義勇","時透無一郎","胡蝶忍","悲鳴嶼行冥","不死川實彌"]
};

const detailConfig = { 
  "誕生祭":["2025-2026 誕生祭","2025 JUMP生日","2024-2025 誕生祭","2023-2024 誕生祭"], 
  "柱展·百景":["2025 鬼滅百景·柱百景＆隊士百景","2024 柱展","2024 柱CAFE","2024 柱活動開幕企劃·柱訓練AKV"], 
  "全集中展":["2025 全集中展·刀匠村·柱訓練","2023 全集中展·無限列車·遊郭","2021 全集中展·立志",],
  "劇場物販":["2025 無限城第一章劇場物販","2024 無限列車重映劇場物販","2024 特別編集版劇場物販","2024 絆之奇跡邁向柱訓練劇場物販·世界巡迴","2023 上弦集結前進刀匠村劇場物販·世界巡迴","2020 無限列車劇場物販",],
  "幽浮桌CAFE·DINING·BAR":["2026 鬼滅全編再放送CAFE·立志","2026 幽浮桌BAR","2025 無限城第一章CAFE","2025 無限城第一章DINING","2025 幽浮桌BAR","2024 柱CAFE"],
  "幽浮桌抽賞":["2024 柱新繪插圖抽賞"],
  "干支生肖":["2026 干支午年","2025 干支巳年","2024 動畫伍周年記念祭＆後夜祭·干支辰年","2023 AGF·干支卯年","2021 動畫貳周年記念祭·干支丑年",], 
  "舉手系列":["2025 舉手系列·刀匠村","2022 舉手系列·遊郭","2022 舉手系列·無限列車","2021 舉手系列·立志"], 
  "主視覺相關":["無限城第一章主視覺","柱訓練主視覺","刀匠村主視覺","遊郭主視覺","無限列車主視覺","柱合會議蝶屋敷主視覺"],
  "幽浮桌其他活動":[
     "2026 手作社","2026 情人節","2026 節分","2026 干支午年",
     "2025 聖誕節","2025 萬聖節","2025 豐收秋祭","2025 花火大會","2025 情人節","2025 干支巳年",
     "2024 聖誕節","2024 萬聖節","2024 野餐","2024 情人節",
     "2023 聖誕節","2023 萬聖節","2023 山間活動","2023 情人節",
     "2022 聖誕節","2022 萬聖節","2022 兒童節",
     "2021 聖誕節","2021 萬聖節","2021 暑假小憩","2021 正月",
     "2020 聖誕節","2020 萬聖節","2020 女兒節",
     "2019 萬聖節"], 
  "鬼滅祭":["2024 動畫伍周年記念祭＆後夜祭·干支辰年","2024 動畫伍周年記念祭","2022 動畫參周年記念祭","2021 動畫貳周年記念祭·干支丑年","2021 動畫貳周年記念祭",],
  "鬼滅之奏":["2025 鬼滅之奏·柱訓練","2024 鬼滅之奏·刀匠村","2023 鬼滅之奏·遊郭","2021 鬼滅之奏·無限列車","2020 鬼滅之奏·立志",],
  "AGF":["2025 AGF·EARLYWINTER","2025 AGF·椅子坐姿","2024 AGF·純喫茶","2024 AGF·Qpot甜點聯名","2023 AGF·干支卯年","2023 AGF·椅子坐姿","2022 AGF·椅子坐姿","2021 AGF·鬼滅學園油漆",],  
  "COMIKET":["2025 C107·猗窩座再來片尾插畫抽賞","2025 C106·相繫抽賞","2024 C105·幕間畫集封面抽賞","2024 C105·正月","2024 C104·柱訓練片尾＆臥姿插畫"], 
  "其他展會":["2026 AJ","2025 京まふ","2024 京まふ","2023 京まふ","2021 京まふ"],
  "南夢宮·南嘉堂":["2025 南嘉堂·貓耳","2025 南夢宮·漆ノ章","2024 南嘉堂·いこいの里巡り其の弐","2024 南夢宮·陸ノ章","2023 南嘉堂·いこいの里巡り","2023 南夢宮·伍ノ章","2022 南嘉堂·祭日和","2022 南夢宮·肆ノ章","2021 南嘉堂·猫との穏やかな日々","2021 南夢宮·参ノ章","2020 南夢宮·壱ノ章"], 
  "其他聯名":["2026 宅麵聯名","2026 明治村聯名","2025 池袋太陽城聯名·太陽都市傳說","2025 築地銀章魚燒聯名","2025 PIZZALA聯名","2024 AGF·Qpot甜點聯名","2024 CRAFTHOLIC宇宙人聯名","2022 PIZZALA聯名","2021 PIZZALA聯名",], 
  "娃娃":["小不點娃ちびぐるみ","圓滾滾ふわコロりん","豆娃まめめいと","寶寶娃くるみたぴぬい","指娃パペラ","FUKUYA景品娃ぬいぷりけ"],
  "模型":["抬頭LOOKUP"],
  "扭蛋":["扭蛋·被窩睡眠系列おねむたん","扭蛋·角色OK繃系列キャラばんちょうこう",]
};
// ====== 修復舊資料 ======
function normalizeOwned(){
    Object.keys(owned).forEach(id => {
        if(!Array.isArray(owned[id])) owned[id] = [];
    });
}
normalizeOwned();

// ====== 排序工具 ======
function sortByCustomOrder(array, customOrder){
    const set = new Set(array);
    const ordered = customOrder.filter(x => set.has(x));
    const rest = array.filter(x => !customOrder.includes(x)).sort();
    return [...ordered, ...rest];
}

// ====== 讀取 JSON ======
fetch("data.json")
.then(res => res.json())
.then(data => {
    products = data.map(item => {
        let seriesArray = [];
        if(item.series){
            seriesArray = Array.isArray(item.series) ? item.series : [item.series];
        }
        const yearMatch = seriesArray[0]?.match(/\d{4}/);
        const year = yearMatch ? parseInt(yearMatch[0]) : null;
        return {...item, series: seriesArray, year};
    });
    populateFilters(products);
    populateDetailSearch();
    filterProducts();
    updateModeButtons();
});

// ====== 建立下拉選單 ======
function populateFilters(data){
    const seriesSet = new Set();
    const typeSet = new Set();
    const characterSet = new Set();
    const yearSet = new Set();

    data.forEach(item => {
        if(item.series) item.series.forEach(s => seriesSet.add(s));
        if(item.type) typeSet.add(item.type);
        (item.characters || []).forEach(c => characterSet.add(c.trim()));
        if(item.year) yearSet.add(item.year);
    });

    sortByCustomOrder([...seriesSet], customSeriesOrder)
        .forEach(s => seriesFilter.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));
    sortByCustomOrder([...typeSet], customTypeOrder)
        .forEach(t => typeFilter.insertAdjacentHTML("beforeend", `<option value="${t}">${t}</option>`));
    sortByCustomOrder([...characterSet], customCharacterOrder)
        .forEach(c => {
            character1Filter.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`);
            character2Filter.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`);
        });
    [...yearSet].sort((a,b) => b-a)
        .forEach(y => yearFilter.insertAdjacentHTML("beforeend", `<option value="${y}">${y}</option>`));
}

// ====== detail-search 下拉 ======
function populateDetailSearch(){
    detailFilter.innerHTML = `<option value="">選擇特定系列</option>`;
    Object.keys(detailConfig).forEach(key => {
        detailFilter.insertAdjacentHTML("beforeend", `<option value="${key}">${key}</option>`);
    });

    if(!document.getElementById("sub-detail-filter")){
        const subFilter = document.createElement("select");
        subFilter.id = "sub-detail-filter";
        subFilter.innerHTML = `<option value="">選擇子系列</option>`;
        detailFilter.insertAdjacentElement("afterend", subFilter);
        subFilter.addEventListener("change", filterProducts);
    }
}

detailFilter.addEventListener("change", () => {
    const selected = detailFilter.value;
    const subDetailFilter = document.getElementById("sub-detail-filter");
    const subOptions = detailConfig[selected] || [];
    subDetailFilter.innerHTML = `<option value="">選擇子系列</option>`;
    subOptions.forEach(s => subDetailFilter.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));
    filterProducts();
});

// ====== 角色解析 ======
function getBaseCharacter(name){
    if(!name) return "";
    for(const base of customCharacterOrder){
        if(name.includes(base)) return base;
    }
    return name;
}

function expandCharacter(name){
    const base = getBaseCharacter(name);
    for(const group in characterGroups){
        if(name.includes(group)) return characterGroups[group];
    }
    return [base];
}

// ====== 篩選商品 ======
function filterProducts() {
    const keyword = searchInput.value.toLowerCase();
    const selectedYear = yearFilter.value;
    const selectedDetail = detailFilter.value;
    const subDetailFilter = document.getElementById("sub-detail-filter");
    const selectedSubDetail = subDetailFilter?.value || "";
    const selectedSeries = seriesFilter.value;
    const selectedType = typeFilter.value;
    const selectedCharacter1 = getBaseCharacter(character1Filter.value);
    const selectedCharacter2 = getBaseCharacter(character2Filter.value);

    filteredProducts = products.filter(item => {
        const itemId = String(item.id);
        const matchKeyword = item.name.toLowerCase().includes(keyword) || (item.characters||[]).join("、").toLowerCase().includes(keyword);
        const matchSeries = !selectedSeries || item.series.includes(selectedSeries);
        const matchType = !selectedType || item.type===selectedType;
        const matchFav = viewMode==="fav" ? favorites.has(itemId) : true;
        const matchYear = !selectedYear || item.year==selectedYear;

        let matchDetail = true;
        if(selectedDetail){
            const detailList = detailConfig[selectedDetail] || [];
            if(selectedSubDetail) matchDetail = item.series.includes(selectedSubDetail);
            else matchDetail = detailList.some(d => item.series.includes(d) || item.series.some(s => s.includes(selectedDetail)));
        }

        let matchCharacter1 = true;
        let matchCharacter2 = true;
        if(viewMode==="owned"){
            const ownedOptions = owned[itemId] || [];
            if(ownedOptions.length===0) return false;
            const ownedBases = ownedOptions.flatMap(c=>String(c).split(/[、＆&]/)).flatMap(expandCharacter);
            if(selectedCharacter1) matchCharacter1 = ownedBases.includes(selectedCharacter1);
            if(selectedCharacter2) matchCharacter2 = ownedBases.includes(selectedCharacter2);
        } else {
            const chars = (item.characters||[]).flatMap(c=>String(c).split(/[、＆&]/)).flatMap(expandCharacter);
            if(selectedCharacter1) matchCharacter1 = chars.includes(selectedCharacter1);
            if(selectedCharacter2) matchCharacter2 = chars.includes(selectedCharacter2);
        }

        return matchKeyword && matchSeries && matchType && matchFav && matchYear && matchDetail && matchCharacter1 && matchCharacter2;
    });

    visibleCount = loadStep;
    displayProducts(filteredProducts.slice(0, visibleCount), true);
}

// ====== 顯示商品 ======
function displayProducts(items, reset=true){
    if(reset) productList.innerHTML = "";

    items.forEach(item => {
        const id = String(item.id);
        const images = item.images||[];
        const imagesHTML = images.map((img,i) => `<img src="${img}" class="product-image ${i===0?'active':''}" loading="lazy">`).join("");

        const checkboxOptions = item.checkboxOptions ?? (item.characters||[]).flatMap(c=>c.split(/[、＆&]/));
        const ownedCheckboxes = checkboxOptions.map(c => {
            const checked = owned[id]?.includes(c) ? "checked" : "";
            return `<label><input type="checkbox" class="owned-checkbox" data-id="${id}" data-option="${c}" ${checked}>${c}</label>`;
        }).join("");

        const card = `
        <div class="card" id="product-${id}">
            <div class="image-slider">
                ${images.length>1?'<button class="prev">❮</button>':''}
                ${imagesHTML}
                ${images.length>1?'<button class="next">❯</button>':''}
            </div>
            <div class="card-buttons">
                <button class="favorite-btn ${favorites.has(id)?'favorited':''}" data-id="${id}">
                    ${favorites.has(id)?'❤️':'🤍'}
                </button>
            </div>
            <h3>${item.name}</h3>
            <p>價格：${typeof item.price==="number"?item.price.toLocaleString("ja-JP",{style:"currency",currency:"JPY"}):item.price}</p>
            <p>角色：${(item.characters||[]).join("、")}</p>
            <p>系列：${(item.series||[]).join("、")}</p>
            <p>類型：${item.type}</p>
            <p>尺寸：${item.size}</p>
            <p>製造商：${item.manufacturer}</p>
            ${item.remark ? `<p class="remark">備註：${item.remark}</p>` : ""}
            <p class="owned-roles">${ownedCheckboxes}</p>
        </div>`;

        productList.insertAdjacentHTML("beforeend", card);
    });

    const newCards = Array.from(productList.querySelectorAll(".card"))
        .slice(-items.length)
        .map(c => c.querySelector(".image-slider"));
    addSliderEvents(newCards);
}

// ====== 輪播 ======
function addSliderEvents(sliders){
    sliders.forEach(slider=>{
        if(!slider) return;
        const images = slider.querySelectorAll(".product-image");
        const prev = slider.querySelector(".prev");
        const next = slider.querySelector(".next");
        let index = 0;
        const showImage = i=>{
            images.forEach(img=>img.classList.remove("active"));
            images[i].classList.add("active");
        };
        if(next) next.onclick=()=>{ index=(index+1)%images.length; showImage(index); };
        if(prev) prev.onclick=()=>{ index=(index-1+images.length)%images.length; showImage(index); };
    });
}

// ====== 收藏與已擁有 ======
function toggleFavorite(id){
    id = String(id);
    const btn = document.querySelector(`.favorite-btn[data-id="${id}"]`);
    if(favorites.has(id)){
        favorites.delete(id);
        if(btn){ btn.classList.remove("favorited"); btn.textContent="🤍"; }
    } else {
        favorites.add(id);
        if(btn){ btn.classList.add("favorited"); btn.textContent="❤️"; }
    }
    localStorage.setItem("favorites", JSON.stringify([...favorites]));
    if(viewMode==="fav") filterProducts();
}

function toggleOwnedOption(id, option, isChecked){
    id = String(id);
    if(!owned[id]) owned[id]=[];
    if(isChecked && !owned[id].includes(option)) owned[id].push(option);
    else{
        owned[id] = owned[id].filter(c=>c!==option);
        if(owned[id].length===0) delete owned[id];
    }
    localStorage.setItem("owned", JSON.stringify(owned));
    if(viewMode==="owned") filterProducts();
}

// ====== 監聽 ======
document.addEventListener("change", e=>{
    if(e.target.classList.contains("owned-checkbox"))
        toggleOwnedOption(e.target.dataset.id, e.target.dataset.option, e.target.checked);
});

document.addEventListener("click", e=>{
    if(e.target.classList.contains("favorite-btn"))
        toggleFavorite(e.target.dataset.id);
});

["search-input","series-filter","type-filter","character1-filter","character2-filter","year-filter","sub-detail-filter"]
.forEach(id=>{
    const el=document.getElementById(id);
    el?.addEventListener("input", filterProducts);
    el?.addEventListener("change", filterProducts);
});

// ====== 模式切換 ======
function updateModeButtons(){
    document.getElementById("show-all-btn").classList.toggle("active",viewMode==="all");
    document.getElementById("show-fav-btn").classList.toggle("active",viewMode==="fav");
    document.getElementById("show-owned-btn").classList.toggle("active",viewMode==="owned");
}
document.getElementById("show-all-btn").onclick=()=>{ viewMode="all"; filterProducts(); updateModeButtons(); };
document.getElementById("show-fav-btn").onclick=()=>{ viewMode="fav"; filterProducts(); updateModeButtons(); };
document.getElementById("show-owned-btn").onclick=()=>{ viewMode="owned"; filterProducts(); updateModeButtons(); };

// ====== 無限滾動 ======
let scrollTimer = null;
window.addEventListener("scroll", () => {
    if(scrollTimer) return;
    scrollTimer = setTimeout(()=>{
        scrollTimer = null;
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight - SCROLL_OFFSET){
            if(visibleCount < filteredProducts.length){
                const nextItems = filteredProducts.slice(visibleCount, visibleCount + loadStep);
                visibleCount += nextItems.length;
                displayProducts(nextItems,false);
            }
        }
    },150);
});

// ====== 回到頂部 ======
window.addEventListener("scroll", ()=>{ backBtn.style.display = window.scrollY>600 ? "block" : "none"; });
backBtn.onclick = ()=>{ window.scrollTo({top:0,behavior:"smooth"}); };

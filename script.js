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

// ====== 自訂排序 ======
const customSeriesOrder = [
  "2026 情人節","2026 節分","2026 干支午年","2026 JUMPFES",
  "2025-2026 誕生祭","2025 聖誕節","2025 C107·片尾插圖抽賞","2025 AGF·EARLYWINTER","2025 萬聖節","2025 豐收秋祭","2025 鬼滅百景·柱百景＆隊士百景","2025 南嘉堂·貓耳","2025 南夢宮·漆ノ章","2025 京まふ","2025 C106·繋ぐ抽賞","2025 無限城第一章合作咖啡","2025 無限城第一章劇場物販","2025 情人節","2025 干支巳年",
  "2024-2025 誕生祭","2024 聖誕節","2024 萬聖節","2024 AGF·純喫茶","2024 柱咖啡","2024 柱展","2024 京まふ","2024 南嘉堂·いこいの里巡り其の弐","2024 南夢宮·陸ノ章","2024 動畫伍周年記念祭＆後夜祭","2024 情人節","2024 干支辰年",
  "2023-2024 誕生祭","2023 聖誕節","2023 萬聖節","2023 AGF·干支卯年","2023 京まふ","2023 南嘉堂·いこいの里巡り","2023 南夢宮·伍ノ章","2023 情人節",
  "2022-2023 誕生祭","2022 聖誕節","2022 萬聖節","2022 南嘉堂·祭日和","2022 南夢宮·肆ノ章","2022 情人節",
  "2021 聖誕節","2021 萬聖節","2021 京まふ","2021 南嘉堂·猫との穏やかな日々","2021 南夢宮·参ノ章",
  "2020 聖誕節","2020 萬聖節",,"2020 南夢宮·壱ノ章",
  "2019 萬聖節"
];

const customTypeOrder = [
  "立牌","徽章","卡片","色紙","杯墊","餐墊","吊飾","收納夾","貼紙","玩偶","模型","海報",
  "壁掛","首飾、髮飾","收納小包、小袋","包、袋","衣物","推活小物","居家用品","隨身用品","文具","其他"
];

const customCharacterOrder = [
  "富岡義勇","竈門炭治郎","竈門禰豆子","我妻善逸","嘴平伊之助","不死川玄彌","栗花落香奈乎",
  "胡蝶忍","煉獄杏壽郎","宇髓天元","時透無一郎","甘露寺蜜璃","不死川實彌","伊黑小芭內", "悲鳴嶼行冥","產屋敷耀哉",
  "鬼無辻無慘","黑死牟","童磨","猗窩座","半天狗","積怒","可樂","空喜","哀絕","憎珀天","鳴女","玉壺","妓夫太郎","墮姬","獪岳",
  "錆兔","真菰","鱗瀧左近次","珠世","愈史郎","村田","神崎葵","鋼鐵塚","小鐵",
  "狛治","戀雪","慶藏","胡蝶香奈惠","雛鶴","牧緒","須磨","桑島慈悟郎","時透有一郎","產屋敷輝利哉","產屋敷彼方","產屋敷玖伊那","竈門炭十郎","煉獄千壽郎","煉獄槙壽郎",
  "魘夢","累",
  "肌肉鼠","隱"
];

// ====== 角色群組 ======
const characterGroups = {
  "九柱": [
    "伊黑小芭內","甘露寺蜜璃","富岡義勇","煉獄杏壽郎","宇髓天元",
    "時透無一郎","胡蝶忍","悲鳴嶼行冥","不死川實彌"
  ]
};

// ====== detail-search 自定義資料 ======
const detailConfig = {
  "誕生祭":["2025-2026誕生祭","2024-2025 誕生祭","2023-2024 誕生祭"],
  "柱展·百景":["2025 鬼滅百景·柱百景＆隊士百景","2024 柱展","2024 柱咖啡"],  
  "干支生肖":["2026 干支午年","2025 干支巳年","2024 干支辰年","2023 AGF·干支卯年"],
  "UFOTABLE Q版":[
    "2026 情人節","2025 情人節","2024 情人節","2023 情人節",
    "2025 豐收秋祭",
    "2025 萬聖節","2024 萬聖節","2023 萬聖節","2022 萬聖節","2021 萬聖節","2020 萬聖節","2019 萬聖節",
    "2025 聖誕節","2024 聖誕節","2023 聖誕節","2022 聖誕節","2021 聖誕節","2020 聖誕節" ],  
  
  "無限城第一章":["2025 無限城第一章劇場物販","2025 無限城第一章合作咖啡","2025 無限城第一章DINING",],
  "AGF":["2025 AGF·EARLYWINTER","2024 AGF·純喫茶","2023 AGF·干支卯年"],
  "京まふ":["2025 京まふ","2024 京まふ","2023 京まふ","2021 京まふ"],
  "COMIKET":["2025 C107·片尾插圖抽賞","2025 C106·繋ぐ抽賞"],
  "南夢宮":["2025 南夢宮·漆ノ章","2024 南夢宮·陸ノ章","2023 南夢宮·伍ノ章","2022 南夢宮·肆ノ章","2021 南夢宮·参ノ章","2020 南夢宮·壱ノ章"],
  "南嘉堂":["2025 南嘉堂·貓耳","2024 南嘉堂·いこいの里巡り其の弐","2023 南嘉堂·いこいの里巡り","2022 南嘉堂·祭日和","2021 南嘉堂·猫との穏やかな日々"],
  "娃娃":["小不點娃ちびぐるみ","圓滾滾ふわコロりん","豆娃まめめいと","寶寶娃くるみたぴぬい"]
  
  
};
// ====== 修復舊資料 ======
function normalizeOwned(){
  Object.keys(owned).forEach(id=>{
    if(!Array.isArray(owned[id])) owned[id] = [];
  });
}
normalizeOwned();

// ====== 排序工具 ======
function sortByCustomOrder(array, customOrder){
  const set = new Set(array);
  const ordered = customOrder.filter(x=>set.has(x));
  const rest = array.filter(x=>!customOrder.includes(x)).sort();
  return [...ordered,...rest];
}

// ====== 讀取 JSON ======
fetch("data.json")
  .then(res=>res.json())
  .then(data=>{
    products = data.map(item=>{
      const yearMatch = item.series.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : null;
      return {...item, year};
    });
    populateFilters(products);
    populateDetailSearch();
    filterProducts();
    updateModeButtons();
  });

// ====== 建立下拉 ======
function populateFilters(data){
  const seriesSet = new Set();
  const typeSet = new Set();
  const characterSet = new Set();
  const yearSet = new Set();

  data.forEach(item=>{
    if(item.series) seriesSet.add(item.series);
    if(item.type) typeSet.add(item.type);
    (item.characters||[]).forEach(c=>characterSet.add(c.trim()));
    if(item.year) yearSet.add(item.year);
  });

  sortByCustomOrder([...seriesSet], customSeriesOrder)
    .forEach(s=>seriesFilter.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));

  sortByCustomOrder([...typeSet], customTypeOrder)
    .forEach(t=>typeFilter.insertAdjacentHTML("beforeend", `<option value="${t}">${t}</option>`));

  sortByCustomOrder([...characterSet], customCharacterOrder)
    .forEach(c=>{
      character1Filter.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`);
      character2Filter.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`);
    });

  [...yearSet].sort((a,b)=>b-a)
    .forEach(y=>yearFilter.insertAdjacentHTML("beforeend", `<option value="${y}">${y}</option>`));
}

// ====== detail-search 下拉 ======
function populateDetailSearch(){
  detailFilter.innerHTML = `<option value="">選擇特定系列</option>`;
  Object.keys(detailConfig).forEach(key=>{
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

detailFilter.addEventListener("change", ()=>{
  const selected = detailFilter.value;
  const subDetailFilter = document.getElementById("sub-detail-filter");
  const subOptions = detailConfig[selected] || [];

  subDetailFilter.innerHTML = `<option value="">選擇子系列</option>`;
  subOptions.forEach(s=>{
    subDetailFilter.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`);
  });

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

  filteredProducts = products.filter(item=>{
    const itemId = String(item.id);

    const matchKeyword = item.name.toLowerCase().includes(keyword) ||
      (item.characters||[]).join("、").toLowerCase().includes(keyword);

    const matchSeries = !selectedSeries || item.series===selectedSeries;
    const matchType = !selectedType || item.type===selectedType;
    const matchFav = viewMode==="fav" ? favorites.has(itemId) : true;
    const matchYear = !selectedYear || item.year==selectedYear;

    let matchDetail = true;
    if(selectedDetail){
      const detailList = detailConfig[selectedDetail] || [];
      if(selectedSubDetail) matchDetail = item.series===selectedSubDetail;
      else matchDetail = detailList.includes(item.series) || item.series.includes(selectedDetail);
    }

    let matchCharacter1 = true;
    let matchCharacter2 = true;

    if(viewMode==="owned"){
      const ownedOptions = owned[itemId] || [];
      if(ownedOptions.length===0) return false;

      const ownedBases = ownedOptions
        .flatMap(c=>String(c).split(/[、＆&]/))
        .flatMap(expandCharacter);

      if(selectedCharacter1) matchCharacter1 = ownedBases.includes(selectedCharacter1);
      if(selectedCharacter2) matchCharacter2 = ownedBases.includes(selectedCharacter2);

    } else {

      const chars = (item.characters||[])
        .flatMap(c=>String(c).split(/[、＆&]/))
        .flatMap(expandCharacter);

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

  items.forEach(item=>{

    const id = String(item.id); // ⭐ 修正：統一 id 型別

    const images = item.images||[];
    const imagesHTML = images.map((img,i)=>`<img src="${img}" class="product-image ${i===0?'active':''}" loading="lazy">`).join("");

    const checkboxOptions = item.checkboxOptions ?? (item.characters||[]).flatMap(c=>c.split(/[、＆&]/));

    const ownedCheckboxes = checkboxOptions.map(c=>{
      const checked = owned[id]?.includes(c)?"checked":"";
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
        <p>系列：${item.series}</p>
        <p>類型：${item.type}</p>
        <p>尺寸：${item.size}</p>
        <p>製造商：${item.manufacturer}</p>
        ${item.remark?`<p class="remark">備註：${item.remark}</p>`:""}
        <p class="owned-roles">${ownedCheckboxes}</p>
      </div>
    `;

    productList.insertAdjacentHTML("beforeend", card);
  });

  const newCards = Array.from(productList.querySelectorAll(".card"))
    .slice(-items.length)
    .map(c=>c.querySelector(".image-slider"));

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

    if(next) next.onclick=()=>{
      index=(index+1)%images.length;
      showImage(index);
    };

    if(prev) prev.onclick=()=>{
      index=(index-1+images.length)%images.length;
      showImage(index);
    };
  });
}

// ====== 收藏 ======
function toggleFavorite(id){
  id = String(id);

  const btn = document.querySelector(`.favorite-btn[data-id="${id}"]`);

  if(favorites.has(id)){
    favorites.delete(id);
    if(btn){
      btn.classList.remove("favorited");
      btn.textContent="🤍";
    }
  } else {
    favorites.add(id);
    if(btn){
      btn.classList.add("favorited");
      btn.textContent="❤️";
    }
  }

  localStorage.setItem("favorites", JSON.stringify([...favorites]));

  if(viewMode==="fav") filterProducts();
}

// ====== 已擁有 ======
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
    toggleOwnedOption(e.target.dataset.id,e.target.dataset.option,e.target.checked);
});

document.addEventListener("click", e=>{
  if(e.target.classList.contains("favorite-btn"))
    toggleFavorite(e.target.dataset.id);
});

[
  "search-input","series-filter","type-filter","character1-filter","character2-filter",
  "year-filter","sub-detail-filter"
].forEach(id=>{
  const el=document.getElementById(id);
  el?.addEventListener("input", filterProducts);
  el?.addEventListener("change", filterProducts);
});

// ====== 模式按鈕 ======
function updateModeButtons(){
  document.getElementById("show-all-btn").classList.toggle("active",viewMode==="all");
  document.getElementById("show-fav-btn").classList.toggle("active",viewMode==="fav");
  document.getElementById("show-owned-btn").classList.toggle("active",viewMode==="owned");
}

document.getElementById("show-all-btn").onclick=()=>{
  viewMode="all";
  filterProducts();
  updateModeButtons();
};

document.getElementById("show-fav-btn").onclick=()=>{
  viewMode="fav";
  filterProducts();
  updateModeButtons();
};

document.getElementById("show-owned-btn").onclick=()=>{
  viewMode="owned";
  filterProducts();
  updateModeButtons();
};

// ====== 無限滾動 ======
let scrollTimer=null;

window.addEventListener("scroll", ()=>{

  if(scrollTimer) return;

  scrollTimer = setTimeout(()=>{

    scrollTimer = null;

    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - SCROLL_OFFSET){

      if(visibleCount<filteredProducts.length){

        const nextItems = filteredProducts.slice(visibleCount, visibleCount+loadStep);

        visibleCount += nextItems.length;

        displayProducts(nextItems,false);

      }

    }

  },150);

});

// ====== 回到頂部 ======
window.addEventListener("scroll",()=>{
  backBtn.style.display=window.scrollY>600?"block":"none";
});

backBtn.onclick=()=>{
  window.scrollTo({top:0,behavior:"smooth"});
};

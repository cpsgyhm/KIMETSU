
// ====== 全域變數 ======
let products = [];
let visibleCount = 12;
const loadStep = 12;
let filteredProducts = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let owned = JSON.parse(localStorage.getItem("owned")) || {};

let viewMode = "all";

// ====== 自訂排序 ======
const customSeriesOrder = [
  
  "2026 情人節バレンタイン＆ホワイトデー",
  "2026 節分",
  "2026 干支午年",
  "2026 JUMPFES",
  "2025-2026 誕生祭",
  "2025 聖誕節",
  "2025 AGF·EARLYWINTER",
  "2025 鬼滅百景·柱百景＆隊士百景",
  "2025 京まふ",
  "2025 築地銀だこ章魚燒",
  "2025 干支巳年",
  "2024 AGF·純喫茶",
  "2024 柱展",
  "2024 京まふ",
  "2024 動畫伍周年記念祭＆後夜祭",
  "2024 干支辰年",
  "2023 AGF·干支卯年",
  "2023 京まふ",
  "2021 京まふ",
];

const customTypeOrder = [
  "立牌","徽章","卡片","色紙","杯墊","餐墊","吊飾",
  "收納夾","貼紙","玩偶","模型","海報",
  "壁掛","居家用品","首飾","包、袋","衣物","推活小物","其他"
];

const customCharacterOrder = [
  "富岡義勇","竈門炭治郎","竈門禰豆子","我妻善逸",
  "嘴平伊之助","不死川玄彌","栗花落香奈乎","胡蝶忍",
  "煉獄杏壽郎","宇髓天元","時透無一郎","甘露寺蜜璃",
  "不死川實彌","伊黑小芭內","悲鳴嶼行冥","產屋敷耀哉",
  "鬼無辻無慘","黑死牟","童磨","猗窩座","半天狗","積怒","可樂","空喜","哀絕","憎珀天","玉壺","妓夫太郎","墮姬","獪岳","鳴女",
  "錆兔","真菰","鱗瀧左近次","珠世","愈史郎","村田","狛治","戀雪","慶藏","胡蝶香奈惠","鋼鐵塚","小鐵",
  "神崎葵","雛鶴","牧緒","須磨","桑島慈悟郎","產屋敷輝利哉","肌肉鼠",
  "魘夢","累","竈門炭十郎"
];

// ====== 角色群組 ======
const characterGroups = {
  "九柱": [
    "伊黑小芭內",
    "甘露寺蜜璃",
    "富岡義勇",
    "煉獄杏壽郎",
    "宇髓天元",
    "時透無一郎",
    "胡蝶忍",
    "悲鳴嶼行冥",
    "不死川實彌"
  ]
};

// ====== 修復舊資料 ======
function normalizeOwned(){
  Object.keys(owned).forEach(id=>{
    if(!Array.isArray(owned[id])){owned[id] = [];}
  });
}
normalizeOwned();

// ====== 排序工具 ======
function sortByCustomOrder(array, customOrder){
  const set = new Set(array);
  const ordered = customOrder.filter(x=>set.has(x));
  const rest = array
    .filter(x=>!customOrder.includes(x))
    .sort();
  return [...ordered,...rest];
}

// ====== 讀取 JSON ======
fetch("data.json")
  .then(res=>res.json())
  .then(data=>{
    products = data;
    populateFilters(products);
    filterProducts();
    updateModeButtons();
  });

// ====== 建立下拉 ======
function populateFilters(data){
  const seriesFilter = document.getElementById("series-filter");
  const typeFilter = document.getElementById("type-filter");
  const character1Filter = document.getElementById("character1-filter");
  const character2Filter = document.getElementById("character2-filter");
  const seriesSet = new Set();
  const typeSet = new Set();
  const characterSet = new Set();
  data.forEach(item=>{
    if(item.series) seriesSet.add(item.series);
    if(item.type) typeSet.add(item.type);
    if(Array.isArray(item.characters)){
      item.characters.forEach(c=>characterSet.add(c.trim()));
    }
  });

  // ====== series ======
  const seriesList =
    sortByCustomOrder(
      Array.from(seriesSet),
      customSeriesOrder
    );

  seriesList.forEach(series=>{
    seriesFilter.insertAdjacentHTML(
      "beforeend",
      `<option value="${series}">${series}</option>`
    );
  });

  // ====== type ======
  const typeList =
    sortByCustomOrder(
      Array.from(typeSet),
      customTypeOrder
    );

  typeList.forEach(type=>{
    typeFilter.insertAdjacentHTML(
      "beforeend",
      `<option value="${type}">${type}</option>`
    );
  });

  // ====== character ======
  const characterList =
    sortByCustomOrder(
      Array.from(characterSet),
      customCharacterOrder
    );

  characterList.forEach(c=>{
    character1Filter.insertAdjacentHTML(
      "beforeend",
      `<option value="${c}">${c}</option>`
    );
    character2Filter.insertAdjacentHTML(
      "beforeend",
      `<option value="${c}">${c}</option>`
    );
  });

}

function getBaseCharacter(name){

  if(!name) return "";

  const baseList = customCharacterOrder;

  for(const base of baseList){
    if(name.includes(base)){
      return base;
    }
  }

  return name;
}

function expandCharacter(name){

  const base = getBaseCharacter(name);

  // ===== 先判斷角色群組 =====
  for(const group in characterGroups){

    if(name.includes(group)){
      return characterGroups[group];
    }

  }

  // ===== 一般角色 =====
  return [base];

}

// ====== 搜尋 + 篩選 ======
function filterProducts() {

  const keyword = document.getElementById("search-input").value.toLowerCase();
  const selectedSeries = document.getElementById("series-filter").value;
  const selectedType = document.getElementById("type-filter").value;

  const selectedCharacter1 = getBaseCharacter(
    document.getElementById("character1-filter").value
  );

  const selectedCharacter2 = getBaseCharacter(
    document.getElementById("character2-filter").value
  );

  filteredProducts = products.filter(item => {

    const itemId = String(item.id);

    // ===== 關鍵字 =====
    const matchKeyword =
      item.name.toLowerCase().includes(keyword) ||
      (item.characters || []).join("、").toLowerCase().includes(keyword);

    // ===== 系列 =====
    const matchSeries =
      !selectedSeries || item.series === selectedSeries;

    // ===== 類型 =====
    const matchType =
      !selectedType || item.type === selectedType;

    // ===== 收藏模式 =====
    const matchFav =
      viewMode === "fav" ? isFavorite(itemId) : true;

    // ===== 角色篩選 =====
// ===== 角色篩選 =====
let matchCharacter1 = true;
let matchCharacter2 = true;

if (viewMode === "owned") {
  const ownedOptions = owned[item.id] || [];
  if (!Array.isArray(ownedOptions) || ownedOptions.length === 0) return false;
  const ownedBases = ownedOptions
    .flatMap(c => String(c).split(/[、＆&]/))
    .flatMap(expandCharacter);
  if (selectedCharacter1) {
    matchCharacter1 = ownedBases.includes(selectedCharacter1);
  }
  if (selectedCharacter2) {
    matchCharacter2 = ownedBases.includes(selectedCharacter2);
  }
} else {
  const chars = (item.characters || [])
    .flatMap(c => String(c).split(/[、＆&]/))
    .flatMap(expandCharacter);
  if (selectedCharacter1) {matchCharacter1 = chars.includes(selectedCharacter1);}
  if (selectedCharacter2) {matchCharacter2 = chars.includes(selectedCharacter2);}
}

    return (
      matchKeyword &&
      matchSeries &&
      matchType &&
      matchFav &&
      matchCharacter1 &&
      matchCharacter2
    );

  });

  visibleCount = loadStep;

  displayProducts(
    filteredProducts.slice(0, visibleCount),
    true
  );

}

// ====== 顯示商品 ======
function displayProducts(items, reset = true) {
  const container = document.getElementById("product-list");

  // 是否重置頁面
  if (reset) {
    container.innerHTML = ""; 
  }

  items.forEach(item => {
    const images = item.images || [];
    const imagesHTML = images.map((img, i) =>
      `<img src="${img}" class="product-image ${i===0?'active':''}" loading="lazy">`
    ).join("");

    const checkboxOptions = item.checkboxOptions ?? item.characters ?? [];
    const ownedCheckboxes = checkboxOptions.map(c => {
      const checked = owned[item.id]?.includes(c) ? "checked" : "";
      return `
        <label>
          <input type="checkbox" class="owned-checkbox" data-id="${item.id}" data-option="${c}" ${checked}>
          ${c}
        </label>
      `;
    }).join("");

    const card = `
      <div class="card">
        <div class="image-slider">
          ${images.length>1?'<button class="prev">❮</button>':''}
          ${imagesHTML}
          ${images.length>1?'<button class="next">❯</button>':''}
        </div>
        <div class="card-buttons">
          <button class="favorite-btn ${isFavorite(item.id)?'favorited':''}" data-id="${item.id}">
            ${isFavorite(item.id)?'❤️':'🤍'}
          </button>
        </div>
        <h3>${item.name}</h3>
        <p>價格：${item.price.toLocaleString("ja-JP",{style:"currency",currency:"JPY"})}</p>
        <p>角色：${(item.characters||[]).join("、")}</p>
        <p>系列：${item.series}</p>
        <p>類型：${item.type}</p>
        <p>尺寸：${item.size}</p>
        <p>製造商：${item.manufacturer}</p>
        ${item.remark?`<p class="remark">備註：${item.remark}</p>`:''}
        <p class="owned-roles">${ownedCheckboxes}</p>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", card);
  });

  // 只綁新卡片
  const newCards = reset ? container.querySelectorAll(".image-slider") : Array.from(container.children).slice(-items.length).map(c => c.querySelector(".image-slider"));
  addSliderEvents(newCards);
}

// ====== 輪播 ======
function addSliderEvents(sliders) {
  sliders.forEach(slider => {
    if (!slider) return;

    const images = slider.querySelectorAll(".product-image");
    const prev = slider.querySelector(".prev");
    const next = slider.querySelector(".next");

    let index = 0;
    function showImage(i) {
      images.forEach(img => img.classList.remove("active"));
      images[i].classList.add("active");
    }

    if (next) next.onclick = () => { index = (index + 1) % images.length; showImage(index); };
    if (prev) prev.onclick = () => { index = (index - 1 + images.length) % images.length; showImage(index); };
  });
}

// ====== 收藏 ======
function toggleFavorite(id){

  id = String(id);

  if(favorites.includes(id)){
    favorites =
      favorites.filter(f=>f!==id);
  }
  else{
    favorites.push(id);
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  filterProducts();

}

function isFavorite(id){
  return favorites.includes(String(id));
}

// ====== checkbox監聽 ======
document.addEventListener("change",e=>{

  if(e.target.classList.contains("owned-checkbox")){

    const id = e.target.dataset.id;
    const option = e.target.dataset.option;

    toggleOwnedOption(
      id,
      option,
      e.target.checked
    );

  }

});

// ====== 收藏監聽 ======
document.addEventListener("click",e=>{

  if(e.target.classList.contains("favorite-btn")){

    const id = e.target.dataset.id;
    toggleFavorite(id);

  }

});

// ====== 已擁有 ======
function toggleOwnedOption(id, option, isChecked) {

  id = String(id);

  if (!owned[id]) owned[id] = [];

  if (isChecked) {

    if (!owned[id].includes(option)) {
      owned[id].push(option);
    }

  } else {

    owned[id] = owned[id].filter(c => c !== option);
    if (owned[id].length === 0) {
      delete owned[id];
    }

  }

  localStorage.setItem("owned", JSON.stringify(owned));

  filterProducts();

}

// ====== 模式按鈕 ======
function updateModeButtons(){

  document.getElementById("show-all-btn")
  .classList.toggle("active",viewMode==="all");

  document.getElementById("show-fav-btn")
  .classList.toggle("active",viewMode==="fav");

  document.getElementById("show-owned-btn")
  .classList.toggle("active",viewMode==="owned");

}

document.getElementById("show-all-btn")
.onclick=()=>{
  viewMode="all";
  filterProducts();
  updateModeButtons();
};

document.getElementById("show-fav-btn")
.onclick=()=>{
  viewMode="fav";
  filterProducts();
  updateModeButtons();
};

document.getElementById("show-owned-btn")
.onclick=()=>{
  viewMode="owned";
  filterProducts();
  updateModeButtons();
};

// ====== 篩選監聽 ======
[
"search-input",
"series-filter",
"type-filter",
"character1-filter",
"character2-filter"
].forEach(id=>{

  const el = document.getElementById(id);

  el.addEventListener("input",filterProducts);
  el.addEventListener("change",filterProducts);

});

// ====== 無限滾動 ======
let scrollTimer = null;
window.addEventListener("scroll", () => {
  if(scrollTimer) return;
  scrollTimer = setTimeout(() => {
    scrollTimer = null;
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 300){
      if(visibleCount < filteredProducts.length){
        const nextItems = filteredProducts.slice(visibleCount, visibleCount + loadStep);
        visibleCount += nextItems.length;
        displayProducts(nextItems, false); // reset = false
      }
    }
  }, 100);
});

// ====== 回到頂部 ======
const backBtn =
  document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

  backBtn.style.display =
    window.scrollY>600 ? "block":"none";

});

backBtn.onclick=()=>{
  window.scrollTo({top:0,behavior:"smooth"});
};  

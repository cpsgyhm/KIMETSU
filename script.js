// ====== 全域變數 ======
let products = [];
let visibleCount = 12;
const loadStep = 12;
let filteredProducts = [];

// 收藏
let favorites = (JSON.parse(localStorage.getItem("favorites")) || []).map(String);

// 已擁有角色
let owned = JSON.parse(localStorage.getItem("owned")) || {};

let viewMode = "all";

// ====== 讀取 JSON ======
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    populateFilters(products);
    filterProducts();
    updateModeButtons();
  });

// ====== 下拉選單 ======
function populateFilters(data) {
  const seriesFilter = document.getElementById("series-filter");
  const typeFilter = document.getElementById("type-filter");
  const character1Filter = document.getElementById("character1-filter");
  const character2Filter = document.getElementById("character2-filter");
  const seriesSet = new Set();
  const typeSet = new Set();
  const characterSet = new Set();

  data.forEach(item => {
    seriesSet.add(item.series);
    typeSet.add(item.type);
    if(item.character) item.character.split('、').forEach(c => characterSet.add(c.trim()));
  });

  seriesSet.forEach(series => seriesFilter.innerHTML += `<option value="${series}">${series}</option>`);

  const customTypeOrder = ["立牌","徽章","卡片","杯墊","餐墊","吊飾","收納夾","貼紙","玩偶","模型","海報","掛軸","包、袋","誕生日BOX","其他"];
  customTypeOrder.forEach(type => { if(typeSet.has(type)) typeFilter.innerHTML += `<option value="${type}">${type}</option>`; });

  const customCharacterOrder = ["竈門炭治郎","竈門禰豆子","富岡義勇","嘴平伊之助","我妻善逸","栗花落香奈乎","不死川玄彌","胡蝶忍","煉獄杏壽郎","宇髓天元","時透無一郎","甘露寺蜜璃","伊黑小芭內","不死川實彌","悲鳴嶼行冥","產屋敷耀哉","產屋敷輝利哉","鬼舞辻無慘","黑死牟","童磨","猗窩座","半天狗","玉壺","妓夫太郎","墮姬","錆兔","真菰","鱗瀧左近次","神崎葵","煉獄槙壽郎","竈門炭十郎"];
  customCharacterOrder.forEach(c=>{
    if(characterSet.has(c)){
      character1Filter.innerHTML += `<option value="${c}">${c}</option>`;
      character2Filter.innerHTML += `<option value="${c}">${c}</option>`;
    }
  });
}

// ====== 搜尋 + 篩選 ======
function filterProducts() {
  const keyword = document.getElementById("search-input").value.toLowerCase();
  const selectedSeries = document.getElementById("series-filter").value;
  const selectedType = document.getElementById("type-filter").value;
  const selectedCharacter1 = document.getElementById("character1-filter").value;
  const selectedCharacter2 = document.getElementById("character2-filter").value;

  let filtered = products.filter(item => {
    const chars = item.character.split('、').map(c=>c.trim());
    const matchKeyword = item.name.toLowerCase().includes(keyword) || item.character.toLowerCase().includes(keyword);
    const matchSeries = !selectedSeries || item.series === selectedSeries;
    const matchType = !selectedType || item.type === selectedType;
    const matchCharacter1 = !selectedCharacter1 || chars.includes(selectedCharacter1);
    const matchCharacter2 = !selectedCharacter2 || chars.includes(selectedCharacter2);
    return matchKeyword && matchSeries && matchType && matchCharacter1 && matchCharacter2;
  });

  if(viewMode==="fav") filtered = filtered.filter(item=>isFavorite(item.id));
  else if(viewMode==="owned") filtered = filtered.filter(item => owned[item.id] && owned[item.id].length > 0);

  filteredProducts = filtered;
  visibleCount = loadStep;
  displayProducts(filteredProducts.slice(0, visibleCount), filteredProducts.length);
}

// ====== 顯示商品 ======
function displayProducts(items, totalCount){
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  items.forEach(item=>{
    const images = item.images || [];
    const imagesHTML = images.map((img,i)=>`<img src="${img}" class="product-image ${i===0?'active':''}" loading="lazy">`).join("");

    // 角色多選
    const chars = item.character.split('、').map(c=>c.trim());
    const ownedCheckboxes = chars.map(c=>{
      const checked = owned[item.id]?.includes(c) ? "checked" : "";
      return `<label><input type="checkbox" onchange="toggleOwnedRole('${item.id}','${c}',this.checked)" ${checked}> ${c}</label>`;
    }).join(" ");

    const card = `
      <div class="card">
        <div class="image-slider">
          ${images.length>1?'<button class="prev">❮</button>':''}
          ${imagesHTML}
          ${images.length>1?'<button class="next">❯</button>':''}
        </div>

        <div class="card-buttons">
          <button class="favorite-btn ${isFavorite(item.id)?'favorited':''}" onclick="toggleFavorite('${item.id}')">
            ${isFavorite(item.id)?'❤️':'🤍'}
          </button>
        </div>

        <h3>${item.name}</h3>
        <p>價格：${item.price.toLocaleString("ja-JP",{style:"currency",currency:"JPY"})}</p>
        <p>角色：${item.character}</p>
        <p>系列：${item.series}</p>
        <p>類型：${item.type}</p>
        <p>製造商：${item.manufacturer}</p>
        <p>初販日期：${item.releaseDate}</p>
        ${item.remark?`<p class="remark">備註：${item.remark}</p>`:''}
        <p class="owned-roles">已擁有角色：${ownedCheckboxes}</p>
      </div>
    `;
    container.innerHTML += card;
  });

  addSliderEvents();
}

// ====== 輪播 ======
function addSliderEvents(){
  document.querySelectorAll(".image-slider").forEach(slider=>{
    const images = slider.querySelectorAll(".product-image");
    const prev = slider.querySelector(".prev");
    const next = slider.querySelector(".next");
    let index=0;
    function showImage(i){ images.forEach(img=>img.classList.remove("active")); images[i].classList.add("active"); }
    if(next) next.addEventListener("click",()=>{index=(index+1)%images.length;showImage(index);});
    if(prev) prev.addEventListener("click",()=>{index=(index-1+images.length)%images.length;showImage(index);});
  });
}

// ====== 收藏 ======
function toggleFavorite(id){
  id = String(id);
  if(favorites.includes(id)) favorites = favorites.filter(f=>f!==id);
  else favorites.push(id);
  localStorage.setItem("favorites",JSON.stringify(favorites));
  filterProducts();
}
function isFavorite(id){ return favorites.includes(String(id)); }

// ====== 已擁有角色 ======
function toggleOwnedRole(id, character, isChecked){
  if(!owned[id]) owned[id]=[];
  if(isChecked){
    if(!owned[id].includes(character)) owned[id].push(character);
  } else {
    owned[id] = owned[id].filter(c=>c!==character);
    if(owned[id].length===0) delete owned[id];
  }
  localStorage.setItem("owned", JSON.stringify(owned));
  filterProducts();
}

// ====== 顯示模式按鈕 ======
function updateModeButtons(){
  document.getElementById("show-all-btn").classList.toggle("active", viewMode==="all");
  document.getElementById("show-fav-btn").classList.toggle("active", viewMode==="fav");
  document.getElementById("show-owned-btn").classList.toggle("active", viewMode==="owned");
}
document.getElementById("show-all-btn").addEventListener("click",()=>{viewMode="all"; filterProducts(); updateModeButtons();});
document.getElementById("show-fav-btn").addEventListener("click",()=>{viewMode="fav"; filterProducts(); updateModeButtons();});
document.getElementById("show-owned-btn").addEventListener("click",()=>{viewMode="owned"; filterProducts(); updateModeButtons();});

// ====== 篩選監聽 ======
["search-input","series-filter","type-filter","character1-filter","character2-filter"].forEach(id=>{
  const el = document.getElementById(id);
  el.addEventListener("input", filterProducts);
  el.addEventListener("change", filterProducts);
});

// ====== 無限滾動 ======
window.addEventListener("scroll",()=>{
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 300){
    if(visibleCount<filteredProducts.length){
      visibleCount+=loadStep;
      displayProducts(filteredProducts.slice(0,visibleCount), filteredProducts.length);
    }
  }
});

// ====== 回到頂部 ======
const backBtn = document.getElementById("backToTop");
window.addEventListener("scroll",()=>{ backBtn.style.display = window.scrollY>600?"block":"none"; });
backBtn.addEventListener("click",()=>window.scrollTo({top:0, behavior:"smooth"}));

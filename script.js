// ====== 全域變數 ======
let products = [];
let currentPage = 1;
const itemsPerPage = 8;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let owned = JSON.parse(localStorage.getItem("owned")) || [];
let viewMode = "all"; // "all" / "fav" / "owned"

// ====== 讀取 JSON ======
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    populateFilters(products);
    filterProducts();
    updateModeButtons();
  });

// ====== 動態產生下拉選單 ======
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

  const customTypeOrder = ["立牌","徽章","卡片","杯墊","餐墊","收納夾","貼紙","吊飾","玩偶","掛軸","包、袋","誕生日BOX","其他"];
  customTypeOrder.forEach(type => { if(typeSet.has(type)) typeFilter.innerHTML += `<option value="${type}">${type}</option>`; });

  const customCharacterOrder = ["竈門炭治郎","竈門禰豆子","富岡義勇","嘴平伊之助","我妻善逸","栗花落香奈乎","不死川玄彌","胡蝶忍","煉獄杏壽郎","宇髓天元","時透無一郎","甘露寺蜜璃","伊黑小芭內","不死川實彌","悲鳴嶼行冥","產屋敷耀哉","產屋敷輝利哉","猗窩座","神崎葵","鱗瀧左近次","煉獄槙壽郎","竈門炭十郎"];
  customCharacterOrder.forEach(c => {
    if(characterSet.has(c)) {
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
    const chars = item.character.split('、').map(c => c.trim());
    const matchKeyword = item.name.toLowerCase().includes(keyword) || item.character.toLowerCase().includes(keyword);
    const matchSeries = !selectedSeries || item.series === selectedSeries;
    const matchType = !selectedType || item.type === selectedType;
    const matchCharacter1 = !selectedCharacter1 || chars.includes(selectedCharacter1);
    const matchCharacter2 = !selectedCharacter2 || chars.includes(selectedCharacter2);
    return matchKeyword && matchSeries && matchType && matchCharacter1 && matchCharacter2;
  });

  if(viewMode === "fav") filtered = filtered.filter(item => isFavorite(item.id));
  else if(viewMode === "owned") filtered = filtered.filter(item => owned.includes(item.id));

  renderPage(filtered);
}

// ====== 分頁渲染 ======
function renderPage(items) {
  const start = (currentPage-1)*itemsPerPage;
  const end = start + itemsPerPage;
  displayProducts(items.slice(start,end), items.length);
  setupPagination(items);
}

// ====== 顯示商品 ======
function displayProducts(items, totalCount) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  items.forEach(item => {
    const images = item.images || [];
    const imagesHTML = images.map((img,i) => `<img src="${img}" class="product-image ${i===0?'active':''}" loading="lazy">`).join("");

    const card = `
      <div class="card">
        <div class="image-slider">
          ${images.length>1?'<button class="prev">❮</button>':''}
          ${imagesHTML}
          ${images.length>1?'<button class="next">❯</button>':''}
        </div>

        <div class="card-buttons">
          <button class="favorite-btn ${isFavorite(item.id)?'favorited':''}" onclick="toggleFavorite(${item.id})">
            ${isFavorite(item.id)?'❤️':'🤍'}
          </button>
          <button class="owned-btn ${owned.includes(item.id) ? 'owned' : ''}" 
            onclick="toggleOwned(${item.id})">
            ✔
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
      </div>
    `;
    container.innerHTML += card;
  });

  // 補空白卡片，固定每頁 8 個
  const placeholders = itemsPerPage - items.length;
  for(let i=0;i<placeholders;i++){
    container.innerHTML += `<div class="card placeholder"></div>`;
  }

  addSliderEvents();
}

// ====== 分頁按鈕 ======
function setupPagination(items) {
  const pageCount = Math.ceil(items.length/itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  for(let i=1;i<=pageCount;i++){
    pagination.innerHTML += `<button class="page-btn ${i===currentPage?'active-page':''}" onclick="changePage(${i})">${i}</button>`;
  }
}

function changePage(page){
  currentPage=page;
  filterProducts();
}

// ====== 輪播 ======
function addSliderEvents() {
  document.querySelectorAll(".image-slider").forEach(slider=>{
    const images = slider.querySelectorAll(".product-image");
    const prev = slider.querySelector(".prev");
    const next = slider.querySelector(".next");
    let index=0;
    function showImage(i){
      images.forEach(img=>img.classList.remove("active"));
      images[i].classList.add("active");
    }
    if(next) next.addEventListener("click",()=>{index=(index+1)%images.length;showImage(index);});
    if(prev) prev.addEventListener("click",()=>{index=(index-1+images.length)%images.length;showImage(index);});
  });
}

// ====== 收藏系統 ======
function toggleFavorite(id){
  if(favorites.includes(id)) favorites=favorites.filter(f=>f!==id);
  else favorites.push(id);
  localStorage.setItem("favorites",JSON.stringify(favorites));
  filterProducts();
}
function isFavorite(id){return favorites.includes(id);}

// ====== 擁有系統 ======
function toggleOwned(id){
  if(owned.includes(id)) owned=owned.filter(o=>o!==id);
  else owned.push(id);
  localStorage.setItem("owned",JSON.stringify(owned));
  filterProducts();
}

// ====== 顯示模式按鈕 ======
function updateModeButtons(){
  document.getElementById("show-all-btn").classList.toggle("active",viewMode==="all");
  document.getElementById("show-fav-btn").classList.toggle("active",viewMode==="fav");
  document.getElementById("show-owned-btn").classList.toggle("active",viewMode==="owned");
}

document.getElementById("show-all-btn").addEventListener("click",()=>{
  viewMode="all";currentPage=1;filterProducts();updateModeButtons();
});
document.getElementById("show-fav-btn").addEventListener("click",()=>{
  viewMode="fav";currentPage=1;filterProducts();updateModeButtons();
});
document.getElementById("show-owned-btn").addEventListener("click",()=>{
  viewMode="owned";currentPage=1;filterProducts();updateModeButtons();
});

// ====== 篩選監聽 ======
["search-input","series-filter","type-filter","character1-filter","character2-filter"].forEach(id=>{
  document.getElementById(id).addEventListener("input",()=>{currentPage=1;filterProducts();});
  document.getElementById(id).addEventListener("change",()=>{currentPage=1;filterProducts();});
});
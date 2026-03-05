let products=[];
let favorites=JSON.parse(localStorage.getItem("favorites"))||[];
let ownedCharacters=JSON.parse(localStorage.getItem("ownedCharacters"))||{};

let currentView="all";

fetch("products.json")
.then(res=>res.json())
.then(data=>{
products=data;
displayProducts();
});

function displayProducts(){

const container=document.getElementById("product-list");
container.innerHTML="";

let filtered=[...products];

const search=document.getElementById("search-input").value.toLowerCase();

if(search){
filtered=filtered.filter(p=>
p.name.toLowerCase().includes(search)||
(p.characters||[]).some(c=>c.toLowerCase().includes(search))
);
}

if(currentView==="fav"){
filtered=filtered.filter(p=>favorites.includes(p.id));
}

if(currentView==="owned"){
filtered=filtered.filter(p=>ownedCharacters[p.id]);
}

filtered.forEach(item=>{

const images=item.images||[];
let imgIndex=0;

const charactersHTML=(item.characters||[]).map(char=>`

<label class="char-btn">
<input type="checkbox" class="owned-character" data-id="${item.id}" value="${char}"
${ownedCharacters[item.id]?.includes(char)?"checked":""}>
<span>${char}</span>
</label>

`).join("");

const card=document.createElement("div");
card.className="card";

card.innerHTML=`

<div class="image-slider">

<img src="${images[0]||""}" class="slider-img">

${images.length>1?'<button class="prev">❮</button>':''}
${images.length>1?'<button class="next">❯</button>':''}

</div>

<h3>${item.name}</h3>

<div class="card-buttons">
<button class="fav-btn ${favorites.includes(item.id)?"active":""}" data-id="${item.id}">❤</button>
</div>

<div class="owned-characters">
${charactersHTML}
</div>

`;

container.appendChild(card);

/* 輪播 */

if(images.length>1){

const img=card.querySelector(".slider-img");

card.querySelector(".next").onclick=()=>{
imgIndex=(imgIndex+1)%images.length;
img.src=images[imgIndex];
};

card.querySelector(".prev").onclick=()=>{
imgIndex=(imgIndex-1+images.length)%images.length;
img.src=images[imgIndex];
};

}

});

/* 收藏 */

document.querySelectorAll(".fav-btn").forEach(btn=>{
btn.onclick=()=>{

const id=btn.dataset.id;

if(favorites.includes(id)){
favorites=favorites.filter(f=>f!==id);
}else{
favorites.push(id);
}

localStorage.setItem("favorites",JSON.stringify(favorites));
displayProducts();

};
});

/* 已擁有角色 */

document.querySelectorAll(".owned-character").forEach(cb=>{

cb.onchange=()=>{

const id=cb.dataset.id;
const char=cb.value;

if(!ownedCharacters[id]) ownedCharacters[id]=[];

if(cb.checked){

if(!ownedCharacters[id].includes(char)){
ownedCharacters[id].push(char);
}

}else{

ownedCharacters[id]=ownedCharacters[id].filter(c=>c!==char);

if(ownedCharacters[id].length===0){
delete ownedCharacters[id];
}

}

localStorage.setItem("ownedCharacters",JSON.stringify(ownedCharacters));

};

});

}

/* 搜尋 */

document.getElementById("search-input").addEventListener("input",displayProducts);

/* 按鈕 */

document.getElementById("show-all-btn").onclick=()=>{
currentView="all";
displayProducts();
};

document.getElementById("show-fav-btn").onclick=()=>{
currentView="fav";
displayProducts();
};

document.getElementById("show-owned-btn").onclick=()=>{
currentView="owned";
displayProducts();
};

/* 回到頂部 */

const backBtn=document.getElementById("backToTop");

window.onscroll=function(){
if(window.scrollY>300){
backBtn.style.display="block";
}else{
backBtn.style.display="none";
}
};

backBtn.onclick=function(){
window.scrollTo({top:0,behavior:"smooth"});
};

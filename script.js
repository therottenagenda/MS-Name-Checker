// Base fantasy keywords
const baseWords = ["Leaf","Star","Rune","Blaze","Frost","Ember","Shadow","Luna","Solar","Ghost","Bloom","River","Golem","Fairy","Mystic"];
const suffixes = ["a","i","o","u","y","ix","or","en","el","ar"];
const prefixes = ["X","Z","K","L","M","N","R"];
let generatedNames = [];

// Rarity scoring
function rarityScore(name){
    const len = name.length;
    const commonWords = ["the","and","this","that","hello","apple","game","maple"];
    let score = 50 + len5;
    if(commonWords.includes(name.toLowerCase())) score -= 30;
    if(/[xzq]/i.test(name)) score += 20;
    return Math.min(Math.max(score,10),100);
}

// Generate a single candidate name
function generateSingleName(){
    const base = baseWords[Math.floor(Math.random()baseWords.length)];
    const pre = Math.random()<0.3 ? prefixes[Math.floor(Math.random()prefixes.length)] : "";
    const suf = Math.random()<0.5 ? suffixes[Math.floor(Math.random()suffixes.length)] : "";
    return pre + base + suf;
}

// Generate multiple candidate names
function generateNames(){
    const resultBox = document.getElementById("result");
    resultBox.innerHTML = "Generating names...\n";
    generatedNames = [];
    for(let i=0;i<200;i++){
        const name = generateSingleName();
        const score = rarityScore(name);
        generatedNames.push({name,score});
    }
    generatedNames.sort((a,b)=>b.score - a.score);
    resultBox.innerHTML += "Top 50 suggested names:\n";
    generatedNames.slice(0,50).forEach(c=>{
        resultBox.innerHTML += ${c.name} (Rarity: ${c.score})\n;
    });
}

// Check multiple names against MapleStory Legendary ranking
async function checkNames(){
    const rawInput=document.getElementById("nameInput").value;
    if(!rawInput.trim()){ alert("Enter at least one name."); return; }
    const names = rawInput.split(/[\s,]+/).filter(n=>n.length>0);
    const resultBox = document.getElementById("result");
    resultBox.innerHTML="Checking "+names.length+" names...\n";
    for(const name of names){
        try{
            const url="https://www.nexon.com/maplestory/rankings/north-america/overall-ranking/legendary?world_type=both&search_type=character-name&search="+encodeURIComponent(name);
            const html = await fetch(url,{mode:"cors"}).then(r=>r.text());
            const foundCharacter = html.includes("character-list")  html.includes("rank-highest")  html.includes("character-grade");
            const available = !foundCharacter;
            const score = rarityScore(name);
            resultBox.innerHTML += available ? 
                ${name} → LIKELY AVAILABLE ✔ (Rarity: ${score})\n :
                ${name} → LIKELY TAKEN ✘ (Rarity: ${score})\n;
            await new Promise(r=>setTimeout(r, 500));
        } catch(e){
            resultBox.innerHTML+=${name} → ERROR checking.\n;
        }
    }
}

// Batch check generated names
async function batchCheckGenerated(){
    if(generatedNames.length===0){ alert("Generate names first."); return; }
    const resultBox = document.getElementById("result");
    resultBox.innerHTML+="\nChecking generated names...\n";
    for(const obj of generatedNames.slice(0,50)){
        const name = obj.name;
        try{
            const url="https://www.nexon.com/maplestory/rankings/north-america/overall-ranking/legendary?world_type=both&search_type=character-name&search="+encodeURIComponent(name);
            const html = await fetch(url,{mode:"cors"}).then(r=>r.text());
            const foundCharacter = html.includes("character-list")  html.includes("rank-highest")  html.includes("character-grade");
            const available = !foundCharacter;
            const score = rarityScore(name);
            resultBox.innerHTML += available ? 
                ${name} → LIKELY AVAILABLE ✔ (Rarity: ${score})\n :
                ${name} → LIKELY TAKEN ✘ (Rarity: ${score})\n;
            await new Promise(r=>setTimeout(r, 500));
        } catch(e){
            resultBox.innerHTML+=${name} → ERROR checking.\n;
        }
    }
}

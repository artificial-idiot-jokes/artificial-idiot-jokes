// Tiny offline joke/riddle generator (no API).
// If a topic is provided, we do a very light fuzzy match to pick something relevant.

const riddles = [
  { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo." },
  { q: "What can fill a room but takes up no space?", a: "Light." },
  { q: "What has keys but can’t open locks?", a: "A piano." },
  { q: "What goes up but never comes down?", a: "Your age." },
  { q: "I have branches, but no fruit, trunk, or leaves. What am I?", a: "A bank." },
  { q: "What gets wetter the more it dries?", a: "A towel." },
  { q: "What invention lets you look right through a wall?", a: "A window." },
  { q: "The more you take, the more you leave behind. What are they?", a: "Footsteps." },
];

const antijokes = [
  "Why did the scarecrow win an award? Because he was the only applicant.",
  "I told my friend she drew her eyebrows too high. She looked surprised, but that’s because eyebrows do that.",
  "What do you call a fish with no eyes? A fish. That is simply a blind fish.",
  "Knock knock. Who’s there? Interrupting cow. Please don’t interrupt me.",
  "What’s orange and sounds like a parrot? A carrot. Phonetically similar; otherwise unrelated.",
  "I threw a boomerang a few years ago. Now I live in constant fear.",
  "Parallel lines have so much in common. It’s a shame they’ll never meet.",
  "My grief counselor died. He was so good I didn’t care.",
];

function $(sel){ return document.querySelector(sel); }
const output = $("#output");
const topic = $("#topic");
const tabRiddle = $("#tab-riddle");
const tabJoke = $("#tab-joke");
const generateBtn = $("#generate");
let mode = "riddle";

function setMode(newMode){
  mode = newMode;
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  (mode === "riddle" ? tabRiddle : tabJoke).classList.add("active");
  output.textContent = "";
  topic.value = "";
}

tabRiddle.addEventListener("click", () => setMode("riddle"));
tabJoke.addEventListener("click", () => setMode("joke"));

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function matchByTopic(arr, key){
  if(!key) return pick(arr);
  const k = key.toLowerCase();
  // naive score
  const scored = arr.map(item => {
    const text = typeof item === "string" ? item : `${item.q} ${item.a}`;
    const t = text.toLowerCase();
    let score = 0;
    if(t.includes(k)) score += 3;
    k.split(/\s+/).forEach(w => { if(w && t.includes(w)) score += 1; });
    return { item, score };
  }).sort((a,b)=>b.score-a.score);
  return (scored[0]?.score || 0) > 0 ? scored[0].item : pick(arr);
}

generateBtn.addEventListener("click", () => {
  const t = topic.value.trim();
  if(mode === "riddle"){
    const r = matchByTopic(riddles, t);
    output.textContent = `Riddle: ${r.q}\nAnswer: ${r.a}`;
  }else{
    const j = matchByTopic(antijokes, t);
    output.textContent = typeof j === "string" ? j : String(j);
  }
});

// footer year
document.getElementById("year").textContent = new Date().getFullYear();

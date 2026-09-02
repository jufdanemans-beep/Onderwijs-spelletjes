const words=window.HOTEL_WORDS||[];
const $=id=>document.getElementById(id);
let mode='choose',speed=4,sound=true,selectedTheme=1,deck=[],index=0,points=0,tick;
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const themeCounts=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,words.filter(w=>w.theme===i+1).length]));

function renderThemes(){
  const area=$('themeChoices');
  for(let theme=1;theme<=10;theme++){
    const button=document.createElement('button');
    button.textContent=`Thema ${theme}`;button.dataset.theme=theme;
    if(theme===selectedTheme) button.classList.add('selected');
    button.onclick=()=>selectTheme(theme,button);area.appendChild(button);
  }
  const mix=document.createElement('button');
  mix.textContent='Mix: 20 kaarten';mix.dataset.theme='all';mix.className='mix';
  mix.onclick=()=>selectTheme('all',mix);area.appendChild(mix);updateThemeInfo();
}
function selectTheme(theme,button){
  selectedTheme=theme;document.querySelectorAll('[data-theme]').forEach(b=>b.classList.remove('selected'));
  button.classList.add('selected');updateThemeInfo();
}
function updateThemeInfo(){
  $('themeInfo').textContent=selectedTheme==='all'?'20 willekeurige kaarten uit alle 422 woorden.':`${themeCounts[selectedTheme]} woordkaarten uit thema ${selectedTheme}.`;
}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-mode]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');mode=b.dataset.mode});
document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-speed]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');speed=+b.dataset.speed});
$('soundBtn').onclick=()=>{sound=!sound;$('soundBtn').textContent=sound?'🔊':'🔇';$('soundBtn').setAttribute('aria-pressed',sound)};
function show(section){['setup','game','finish'].forEach(id=>$(id).classList.toggle('hidden',id!==section))}
function speak(text){if(!sound||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='nl-NL';u.rate=.8;speechSynthesis.speak(u)}
function start(){const pool=selectedTheme==='all'?words:words.filter(w=>w.theme===selectedTheme);deck=shuffle(pool).slice(0,selectedTheme==='all'?20:pool.length);index=0;points=0;show('game');round()}
function round(){clearInterval(tick);const item=deck[index];$('round').textContent=`Kaart ${index+1} van ${deck.length} · Thema ${item.theme}`;$('score').textContent=`${points} goed`;$('progressBar').style.width=`${index/deck.length*100}%`;$('wordImage').src=item.image;$('wordImage').alt='Afbeelding om te onthouden';$('cover').classList.add('hidden');$('answerArea').innerHTML='';$('nextBtn').classList.add('hidden');$('revealBtn').classList.add('hidden');$('timer').classList.remove('hidden');let left=speed;$('timer').textContent=left;tick=setInterval(()=>{left--;$('timer').textContent=left;if(left<=0){clearInterval(tick);hideFlash()}},1000)}
function hideFlash(){const item=deck[index];$('wordImage').alt='';$('cover').classList.remove('hidden');$('timer').classList.add('hidden');if(mode==='choose'){const unique=[...new Map(words.filter(w=>w.word!==item.word).map(w=>[w.word,w])).values()];const wrong=shuffle(unique).slice(0,2);shuffle([item,...wrong]).forEach(w=>{const b=document.createElement('button');b.className='answer';b.textContent=w.word;b.onclick=()=>answer(b,w.word===item.word);$('answerArea').appendChild(b)})}else $('revealBtn').classList.remove('hidden')}
function answer(button,correct){document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;if(b.textContent===deck[index].word)b.classList.add('correct')});if(correct){points++;speak('Goed zo! '+deck[index].word)}else{button.classList.add('wrong');speak(deck[index].word)}$('score').textContent=`${points} goed`;$('nextBtn').classList.remove('hidden')}
function reveal(){const p=document.createElement('p');p.className='word-reveal';p.textContent=deck[index].word;$('answerArea').appendChild(p);$('cover').classList.add('hidden');$('wordImage').alt=deck[index].word;$('revealBtn').classList.add('hidden');$('nextBtn').classList.remove('hidden');speak(deck[index].word)}
function next(){index++;if(index<deck.length)round();else finish()}
function finish(){show('finish');$('finalTitle').textContent=mode==='choose'?(points>=deck.length*.8?'Fantastisch!':points>=deck.length*.55?'Heel goed!':'Goed geoefend!'):'Knap geflitst!';$('finalScore').textContent=mode==='choose'?`Je had ${points} van de ${deck.length} woorden goed.`:`Je hebt alle ${deck.length} woorden hardop geoefend.`;speak($('finalTitle').textContent)}
$('startBtn').onclick=start;$('nextBtn').onclick=next;$('revealBtn').onclick=reveal;$('againBtn').onclick=start;$('backBtn').onclick=()=>show('setup');renderThemes();

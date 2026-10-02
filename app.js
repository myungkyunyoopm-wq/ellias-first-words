(() => {
 const $ = id => document.getElementById(id);
 const groups = {
  animals:[['🐶','dog'],['🐱','cat'],['🐮','cow'],['🦆','duck'],['🐸','frog'],['🐟','fish'],['🐻','bear'],['🐰','bunny']],
  things:[['⚽','ball'],['🧸','teddy'],['🍎','apple'],['🚗','car'],['🍼','bottle'],['👟','shoe'],['📚','book'],['🧦','sock']],
  sounds:[['👩','Mommy'],['👨','Daddy'],['👋','hello'],['🙏','thank you'],['👏','clap'],['💋','kiss'],['💤','night-night'],['😊','happy'],['🙏','please'],['🙌','hooray'],['❤️','love']]
 };
 const prompts={hello:'Let’s say hello!', 'thank you':'Let’s say thank you!', clap:'Let’s clap!', please:'Let’s say please!', hooray:'Let’s say hooray!', 'night-night':'Let’s say night-night!'};
 const key='ellias-first-words-v1'; let saved={}; try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch{}
 let state={category:'animals',stars:saved.stars||0,rounds:saved.rounds||0,sound:saved.sound!==false,round:0,pool:[],target:null,lock:false};
 let voices=[]; if('speechSynthesis' in window){voices=speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>voices=speechSynthesis.getVoices()}
 const voice=()=>voices.find(v=>/^en(-|_)(US|GB|AU)/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));
 function speak(text){if(!state.sound||!window.speechSynthesis)return;speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang=voice()?.lang||'en-US';u.rate=.78;u.pitch=1.14;u.volume=1;if(voice())u.voice=voice();speechSynthesis.speak(u)}
 function save(){try{localStorage.setItem(key,JSON.stringify({stars:state.stars,rounds:state.rounds,sound:state.sound}))}catch{}$('stars').textContent='⭐ '+state.stars;$('parentStars').textContent=state.stars;$('parentRounds').textContent=state.rounds;$('soundToggle').innerHTML=(state.sound?'🔊':'🔇')+' <span>Sound</span>';$('soundToggle').setAttribute('aria-label',state.sound?'Sound on':'Sound off')}
 function promptFor(word){return prompts[word]||('Can you find '+word+'?')}
 function newRound(voicePrompt){state.lock=false;state.pool=[...groups[state.category]].sort(()=>Math.random()-.5).slice(0,4);state.target=state.pool[Math.floor(Math.random()*state.pool.length)];$('prompt').textContent=promptFor(state.target[1]);$('roundLabel').textContent=state.category==='sounds'?'LET’S SAY IT':'LET’S FIND';$('wordGrid').innerHTML='';state.pool.forEach(item=>{let b=document.createElement('button');b.className='word-card';b.type='button';b.setAttribute('aria-label',item[1]+'. Tap to hear.');b.innerHTML='<span class="picture">'+item[0]+'</span><span class="word">'+item[1]+'</span>';b.addEventListener('click',()=>tap(item,b));$('wordGrid').append(b)});$('encouragement').innerHTML='<span>✨</span> Tap any picture to hear its name!';$('dots').innerHTML=Array.from({length:5},(_,i)=>'<i class="'+(i<state.round?'filled':'')+'"></i>').join('');$('nextButton').disabled=true;if(voicePrompt)setTimeout(()=>speak(promptFor(state.target[1]).replace('Can you find ','Find ').replace(/[?]/g,'')),200)}
 function tap(item,b){if(state.lock)return;speak(item[1]);if(item===state.target){state.lock=true;b.classList.add('correct');state.stars++;state.rounds++;state.round++;save();$('encouragement').innerHTML='<span>🎉</span> Great job, Ellia!';speak('Yes! '+item[1]+'! Great job, Ellia!');$('dots').innerHTML=Array.from({length:5},(_,i)=>'<i class="'+(i<state.round?'filled':'')+'"></i>').join('');if(state.round%5===0){$('celebration').classList.remove('hidden');speak('Yay, Ellia! You did it!');setTimeout(()=>$('celebration').classList.add('hidden'),1500)}$('nextButton').disabled=false;setTimeout(()=>{if(state.lock&&!$('nextButton').disabled)newRound(false)},2600)}else{b.classList.add('try-again');$('encouragement').innerHTML='<span>💛</span> That’s '+item[1]+'. Let’s try!';setTimeout(()=>b.classList.remove('try-again'),550)}}
 document.querySelectorAll('.category').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.category.active')?.classList.remove('active');b.classList.add('active');state.category=b.dataset.category;state.round=0;newRound(true)}));
 $('startButton').addEventListener('click',()=>{speak(promptFor(state.target[1]).replace('Can you find ','Find ').replace(/[?]/g,''));document.querySelector('.play-area').scrollIntoView({behavior:'smooth',block:'center'})});
 $('repeatButton').addEventListener('click',()=>speak(promptFor(state.target[1]).replace('Can you find ','Find ').replace(/[?]/g,'')));
 $('nextButton').addEventListener('click',()=>{if(state.lock)newRound(true)});
 $('soundToggle').addEventListener('click',()=>{state.sound=!state.sound;if(!state.sound&&window.speechSynthesis)speechSynthesis.cancel();save()});
 $('parentToggle').addEventListener('click',()=>$('parentPanel').classList.remove('hidden'));$('panelClose').addEventListener('click',()=>$('parentPanel').classList.add('hidden'));
 $('resetButton').addEventListener('click',()=>{state.stars=0;state.rounds=0;state.round=0;save();$('parentPanel').classList.add('hidden');newRound(false)});
 save();newRound(false);
})();

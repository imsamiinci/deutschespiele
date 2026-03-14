/* ================================================
   A1 İyelik Zamirleri Oyunu – game.js
   ================================================ */

/* ── Soru Veritabanı ─────────────────────────────
   article : 'm' = maskulin (der)
             'f' = feminin  (die)
             'n' = neutral  (das)
   person  : 'ich' | 'du'
   correct : doğru iyelik zamiri
   tip     : cevap sonrası gösterilecek gramer ipucu
   ─────────────────────────────────────────────── */
const QUESTIONS = [
  {
    emoji: '🎒',
    article: 'm',
    person: 'ich',
    noun: 'Rucksack',
    sentence: 'Das ist ___ Rucksack.',
    correct: 'mein',
    tip: '<strong>Maskulin (der) + ich</strong> → <strong>mein</strong><br>Endung entfällt beim maskulinen Nominativ.'
  },
  {
    emoji: '📚',
    article: 'f',
    person: 'du',
    noun: 'Tasche',
    sentence: 'Ist das ___ Tasche?',
    correct: 'deine',
    tip: '<strong>Feminin (die) + du</strong> → <strong>deine</strong><br>Feminin bekommt immer die Endung <em>-e</em>.'
  },
  {
    emoji: '🖊️',
    article: 'm',
    person: 'du',
    noun: 'Stift',
    sentence: 'Ist das ___ Stift?',
    correct: 'dein',
    tip: '<strong>Maskulin (der) + du</strong> → <strong>dein</strong><br>Keine Endung im Nominativ.'
  },
  {
    emoji: '💻',
    article: 'n',
    person: 'ich',
    noun: 'Laptop',
    sentence: 'Das ist ___ Laptop.',
    correct: 'mein',
    tip: '<strong>Neutral (das) + ich</strong> → <strong>mein</strong><br>Neutral verhält sich wie maskulin: keine Endung.'
  },
  {
    emoji: '📱',
    article: 'n',
    person: 'du',
    noun: 'Handy',
    sentence: 'Das ist ___ Handy, oder?',
    correct: 'dein',
    tip: '<strong>Neutral (das) + du</strong> → <strong>dein</strong><br>Neutral: keine Endung im Nominativ.'
  },
  {
    emoji: '🏠',
    article: 'n',
    person: 'ich',
    noun: 'Haus',
    sentence: 'Das ist ___ Haus.',
    correct: 'mein',
    tip: '<strong>Neutral (das) + ich</strong> → <strong>mein</strong>'
  },
  {
    emoji: '🐱',
    article: 'f',
    person: 'ich',
    noun: 'Katze',
    sentence: 'Das ist ___ Katze.',
    correct: 'meine',
    tip: '<strong>Feminin (die) + ich</strong> → <strong>meine</strong><br>Endung <em>-e</em> bei feminin!'
  },
  {
    emoji: '🚲',
    article: 'n',
    person: 'du',
    noun: 'Fahrrad',
    sentence: 'Ist das ___ Fahrrad?',
    correct: 'dein',
    tip: '<strong>Neutral (das) + du</strong> → <strong>dein</strong>'
  },
  {
    emoji: '🎸',
    article: 'f',
    person: 'ich',
    noun: 'Gitarre',
    sentence: 'Das ist ___ Gitarre.',
    correct: 'meine',
    tip: '<strong>Feminin (die) + ich</strong> → <strong>meine</strong>'
  },
  {
    emoji: '🥾',
    article: 'm',
    person: 'du',
    noun: 'Schuh',
    sentence: 'Das ist ___ Schuh, richtig?',
    correct: 'dein',
    tip: '<strong>Maskulin (der) + du</strong> → <strong>dein</strong>'
  },
  {
    emoji: '🧥',
    article: 'f',
    person: 'du',
    noun: 'Jacke',
    sentence: 'Ist das ___ Jacke?',
    correct: 'deine',
    tip: '<strong>Feminin (die) + du</strong> → <strong>deine</strong>'
  },
  {
    emoji: '🐶',
    article: 'm',
    person: 'ich',
    noun: 'Hund',
    sentence: 'Das ist ___ Hund.',
    correct: 'mein',
    tip: '<strong>Maskulin (der) + ich</strong> → <strong>mein</strong>'
  }
];

/* Seçenek havuzu */
const ALL_OPTIONS = ['mein', 'meine', 'dein', 'deine'];

/* ── Oyun Durumu ── */
let currentIndex = 0;
let score        = 0;
let lives        = 3;
let badges       = [];

/* ── Kalp SVG'si ── */
function heartSVG(gone) {
  return `
    <svg class="heart${gone ? ' gone' : ''}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402
               0-3.791 3.068-5.191 5.281-5.191
               1.312 0 4.151.501 5.719 4.457
               1.59-3.968 4.464-4.447 5.726-4.447
               2.54 0 5.274 1.621 5.274 5.181
               0 4.069-5.136 8.625-11 14.402z"/>
    </svg>`;
}

/* ── Canları Güncelle ── */
function renderHearts() {
  const el = document.getElementById('lives');
  el.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    el.innerHTML += heartSVG(i >= lives);
  }
}

/* ── Diziyi Karıştır ── */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ── Soruyu Ekrana Getir ── */
function renderQuestion() {
  if (currentIndex >= QUESTIONS.length) {
    showResult();
    return;
  }

  const q = QUESTIONS[currentIndex];

  /* Emoji & etiket */
  document.getElementById('item-emoji').textContent = q.emoji;

  const artLabel = { m: 'Maskulin (der)', f: 'Feminin (die)', n: 'Neutral (das)' }[q.article];
  const perLabel = { ich: 'ich (1. Person)', du: 'du (2. Person)' }[q.person];
  document.getElementById('gram-tag').textContent = `${artLabel} · ${perLabel}`;

  /* Cümle – boşluk sıfırla */
  document.getElementById('sentence').innerHTML =
    q.sentence.replace('___', '<span class="blank" id="blank">___</span>');

  /* Geri bildirim & ipucu temizle */
  const fb = document.getElementById('feedback');
  fb.textContent = '';
  fb.className = 'feedback';
  document.getElementById('tip-box').innerHTML = '';
  document.getElementById('next-btn').style.display = 'none';

  /* İlerleme çubuğu & soru numarası */
  const pct = (currentIndex / QUESTIONS.length) * 100;
  document.getElementById('progress').style.width = pct + '%';
  document.getElementById('qnum').textContent = currentIndex + 1;

  /* Canları güncelle */
  renderHearts();

  /* Seçenekler */
  buildOptions(q);
}

/* ── Seçenek Butonlarını Oluştur ── */
function buildOptions(q) {
  const container = document.getElementById('opts');
  container.innerHTML = '';
  const shuffled = shuffle(ALL_OPTIONS);

  shuffled.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.textContent = option;
    btn.addEventListener('click', () => checkAnswer(option, q));
    container.appendChild(btn);
  });
}

/* ── Cevabı Kontrol Et ── */
function checkAnswer(chosen, q) {
  /* Tüm butonları devre dışı bırak */
  document.querySelectorAll('.opt').forEach(btn => {
    btn.disabled = true;
  });

  const blankEl = document.getElementById('blank');
  const feedbackEl = document.getElementById('feedback');
  const clickedBtn = [...document.querySelectorAll('.opt')]
    .find(b => b.textContent === chosen);

  if (chosen === q.correct) {
    /* DOĞRU */
    clickedBtn.classList.add('correct-ans');
    blankEl.textContent = chosen;
    blankEl.className = 'blank correct';
    feedbackEl.textContent = 'Richtig! Sehr gut! ✓';
    feedbackEl.className = 'feedback ok';
    score += 10;
    document.getElementById('score').textContent = score;

    /* Rozet kontrolü */
    if (score >= 50  && !badges.includes('fleißig'))  badges.push('fleißig');
    if (score >= 100 && !badges.includes('profi'))    badges.push('profi');

  } else {
    /* YANLIŞ */
    clickedBtn.classList.add('wrong-ans');
    blankEl.textContent = chosen;
    blankEl.className = 'blank wrong';
    feedbackEl.textContent = `Leider falsch. Die richtige Antwort ist: „${q.correct}"`;
    feedbackEl.className = 'feedback err';

    /* Doğru cevabı yeşil yap */
    document.querySelectorAll('.opt').forEach(btn => {
      if (btn.textContent === q.correct) btn.classList.add('reveal');
    });

    lives--;
    renderHearts();

    /* Can bitti → oyun bitti */
    if (lives <= 0) {
      setTimeout(showResult, 900);
      return;
    }
  }

  /* Gramer ipucu göster */
  document.getElementById('tip-box').innerHTML = '💡 ' + q.tip;

  /* Weiter butonu göster */
  document.getElementById('next-btn').style.display = 'block';
}

/* ── Sonraki Soruya Geç ── */
function nextQ() {
  currentIndex++;
  renderQuestion();
}

/* ── Sonuç Ekranını Göster ── */
function showResult() {
  document.getElementById('game-area').style.display   = 'none';
  document.getElementById('result-area').style.display = 'block';

  const maxScore = QUESTIONS.length * 10;
  const pct = Math.round((score / maxScore) * 100);

  let emoji, title, sub;
  if (pct >= 80) {
    emoji = '🏆';
    title = `Ausgezeichnet! ${score} Punkte`;
    sub   = 'Du beherrschst die Possessivpronomen!';
  } else if (pct >= 50) {
    emoji = '👍';
    title = `Gut gemacht! ${score} Punkte`;
    sub   = 'Noch etwas üben und du schaffst es!';
  } else {
    emoji = '📚';
    title = `${score} Punkte – Weiter üben!`;
    sub   = 'Kein Problem – Grammatik braucht Zeit!';
  }

  document.getElementById('res-emoji').textContent = emoji;
  document.getElementById('res-title').textContent = title;
  document.getElementById('res-sub').textContent   = sub;

  /* Rozetler */
  const badgeDefs = [
    { id: 'fleißig', label: '⭐ Fleißig (50 Pkt)' },
    { id: 'profi',   label: '🏅 Grammatik-Profi (100 Pkt)' }
  ];
  const grid = document.getElementById('badge-grid');
  grid.innerHTML = '';
  badgeDefs.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge' + (badges.includes(b.id) ? ' earned' : '');
    div.textContent = b.label;
    grid.appendChild(div);
  });
}

/* ── Oyunu Yeniden Başlat ── */
function restart() {
  currentIndex = 0;
  score        = 0;
  lives        = 3;
  badges       = [];

  document.getElementById('score').textContent      = '0';
  document.getElementById('result-area').style.display = 'none';
  document.getElementById('game-area').style.display   = 'block';

  renderQuestion();
}

/* ── Başlat ── */
renderQuestion();

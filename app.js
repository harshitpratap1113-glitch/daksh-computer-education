/**
 * DAKSH COMPUTER EDUCATION — MODERN INTERACTIVE ENGINE
 * Features: Live Typing Test, Fee Calculator, Filterable Courses, Curated Gallery, WhatsApp Leads
 */

// 1. Curated Master Photo Data (35 Photos)
window.DAKSH_PHOTOS = [];

// Fetch photos.json or load fallback
fetch('photos.json')
  .then(res => res.json())
  .then(data => {
    window.DAKSH_PHOTOS = data;
    initGallery();
  })
  .catch(err => {
    console.error('Error loading photos.json:', err);
  });

// 2. Custom Toast Notification
function showToast(message, type = 'info') {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// 3. Theme Toggle (Dark / Light Mode)
const themeToggleBtn = document.getElementById('themeToggleBtn');
const currentTheme = localStorage.getItem('daksh_theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

if (themeToggleBtn) {
  themeToggleBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('daksh_theme', nextTheme);
    themeToggleBtn.textContent = nextTheme === 'light' ? '🌙' : '☀️';
    showToast(`${nextTheme.toUpperCase()} mode activated`, 'info');
  });
}

// 4. Mobile Navigation Drawer
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// 5. LIVE 60-SECOND TYPING SPEED TEST TOOL
const TYPING_PASSAGES = {
  english: [
    "Daksh Computer Education provides premier practical IT and typing training in Thatipur Gwalior. Students practice daily on individual computer terminals with high precision timer software to easily achieve speed benchmarks for CPCT and government competitive examinations.",
    "Mastering professional computer applications like Tally Prime with GST, DCA and PGDCA opens exceptional career opportunities in modern accounting, banking and digital administration across Madhya Pradesh.",
    "Speed and accuracy in keyboard typing are essential digital literacy skills. Regular timed drills and expert supervisor guidance help learners achieve forty-five words per minute with ninety-five percent accuracy."
  ],
  hindi: [
    "दक्ष कंप्यूटर एजुकेशन ग्वालियर में छात्रों को उच्च गुणवत्ता युक्त कंप्यूटर प्रशिक्षण और सीपीसीटी टाइपिंग की तैयारी करवाता है। नियमित अभ्यास से विद्यार्थी सरकारी परीक्षाओं में सफलता प्राप्त करते हैं।",
    "टैली प्राइम विद जीएसटी और डीसीए पीजीडीसीए डिप्लोमा पाठ्यक्रमों द्वारा युवा रोजगार के नए अवसर प्राप्त करते हैं। यहाँ प्रत्येक विद्यार्थी को अलग कंप्यूटर सिस्टम प्रदान किया जाता है।"
  ]
};

let typingLanguage = 'english';
let currentPassageIndex = 0;
let typingTimeLeft = 60;
let typingTimer = null;
let isTypingActive = false;
let totalTypedChars = 0;
let correctTypedChars = 0;
let currentPassageText = "";

const typingDisplay = document.getElementById('typingDisplay');
const typingInput = document.getElementById('typingInput');
const typingTimeVal = document.getElementById('typingTimeVal');
const typingWpmVal = document.getElementById('typingWpmVal');
const typingAccVal = document.getElementById('typingAccVal');
const typingResultBanner = document.getElementById('typingResultBanner');
const typingResetBtn = document.getElementById('typingResetBtn');

function loadTypingPassage() {
  const passages = TYPING_PASSAGES[typingLanguage] || TYPING_PASSAGES.english;
  currentPassageText = passages[currentPassageIndex % passages.length];
  
  if (!typingDisplay) return;
  typingDisplay.innerHTML = '';
  
  // Render character spans
  for (let i = 0; i < currentPassageText.length; i++) {
    const span = document.createElement('span');
    span.className = 'typing-char';
    if (i === 0) span.classList.add('current');
    span.textContent = currentPassageText[i];
    typingDisplay.appendChild(span);
  }
}

function startTypingTest() {
  if (isTypingActive) return;
  isTypingActive = true;
  typingTimeLeft = 60;
  totalTypedChars = 0;
  correctTypedChars = 0;
  
  if (typingResultBanner) typingResultBanner.classList.remove('show');
  
  typingTimer = setInterval(() => {
    typingTimeLeft--;
    if (typingTimeVal) typingTimeVal.textContent = `${typingTimeLeft}s`;
    
    // Live WPM calculation
    const elapsedMinutes = (60 - typingTimeLeft) / 60;
    if (elapsedMinutes > 0) {
      const wordsTyped = correctTypedChars / 5;
      const currentWPM = Math.round(wordsTyped / elapsedMinutes);
      if (typingWpmVal) typingWpmVal.textContent = currentWPM;
      
      const accuracy = totalTypedChars > 0 ? Math.round((correctTypedChars / totalTypedChars) * 100) : 100;
      if (typingAccVal) typingAccVal.textContent = `${accuracy}%`;
    }
    
    if (typingTimeLeft <= 0) {
      endTypingTest();
    }
  }, 1000);
}

function endTypingTest() {
  clearInterval(typingTimer);
  isTypingActive = false;
  if (typingInput) typingInput.disabled = true;
  
  const wordsTyped = correctTypedChars / 5;
  const finalWPM = Math.round(wordsTyped / 1);
  const finalAcc = totalTypedChars > 0 ? Math.round((correctTypedChars / totalTypedChars) * 100) : 100;
  
  if (typingResultBanner) {
    document.getElementById('resultWpm').textContent = finalWPM;
    document.getElementById('resultAcc').textContent = `${finalAcc}%`;
    typingResultBanner.classList.add('show');
  }
  
  showToast(`Test Complete! Your Speed: ${finalWPM} WPM (${finalAcc}% Accuracy)`, 'success');
}

function resetTypingTest() {
  clearInterval(typingTimer);
  isTypingActive = false;
  typingTimeLeft = 60;
  totalTypedChars = 0;
  correctTypedChars = 0;
  
  if (typingTimeVal) typingTimeVal.textContent = '60s';
  if (typingWpmVal) typingWpmVal.textContent = '0';
  if (typingAccVal) typingAccVal.textContent = '100%';
  if (typingInput) {
    typingInput.disabled = false;
    typingInput.value = '';
  }
  if (typingResultBanner) typingResultBanner.classList.remove('show');
  
  loadTypingPassage();
}

if (typingInput) {
  typingInput.addEventListener('input', (e) => {
    if (!isTypingActive && typingInput.value.length > 0) {
      startTypingTest();
    }
    
    const val = typingInput.value;
    totalTypedChars = val.length;
    const charSpans = typingDisplay.querySelectorAll('.typing-char');
    
    let correctCount = 0;
    for (let i = 0; i < charSpans.length; i++) {
      const span = charSpans[i];
      span.className = 'typing-char';
      
      if (i < val.length) {
        if (val[i] === currentPassageText[i]) {
          span.classList.add('correct');
          correctCount++;
        } else {
          span.classList.add('incorrect');
        }
      } else if (i === val.length) {
        span.classList.add('current');
      }
    }
    
    correctTypedChars = correctCount;
    
    // If completed passage, load next
    if (val.length >= currentPassageText.length) {
      currentPassageIndex++;
      typingInput.value = '';
      loadTypingPassage();
    }
  });
}

if (typingResetBtn) {
  typingResetBtn.addEventListener('click', resetTypingTest);
}

// Mode Buttons (English / Hindi)
document.querySelectorAll('[data-type-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-type-lang]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    typingLanguage = btn.dataset.typeLang;
    currentPassageIndex = 0;
    resetTypingTest();
  });
});

// Init Typing Passage
loadTypingPassage();

// 6. COURSE FILTER TABS
const courseFilterBtns = document.querySelectorAll('[data-course-filter]');
const courseCards = document.querySelectorAll('.course-card');

courseFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    courseFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.dataset.courseFilter;
    courseCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// 7. INTERACTIVE FEE & EMI CALCULATOR
const calcCourseSelect = document.getElementById('calcCourseSelect');
const calcPlanSelect = document.getElementById('calcPlanSelect');
const calcFinalFee = document.getElementById('calcFinalFee');
const calcEmiNote = document.getElementById('calcEmiNote');

const COURSE_FEE_RATES = {
  cpct_3m: { name: "CPCT (3 Months)", total: 3000, duration: "3 Months" },
  cpct_6m: { name: "CPCT (6 Months)", total: 5000, duration: "6 Months" },
  tally: { name: "Tally Prime + GST", total: 6300, duration: "4 Months" },
  dca: { name: "DCA (1 Year University)", total: 11500, duration: "1 Year" },
  pgdca: { name: "PGDCA (1 Year University)", total: 12500, duration: "1 Year" },
  typing_m: { name: "Hindi / English Typing", total: 300, duration: "Per Month" },
  dtp: { name: "DTP (Photoshop + Corel)", total: 3000, duration: "3 Months" },
  programming: { name: "C / C++ / Python / Java", total: 3000, duration: "3 Months" }
};

function updateFeeCalculator() {
  if (!calcCourseSelect || !calcPlanSelect || !calcFinalFee) return;
  
  const courseKey = calcCourseSelect.value;
  const plan = calcPlanSelect.value;
  const course = COURSE_FEE_RATES[courseKey] || COURSE_FEE_RATES.cpct_3m;
  
  let fee = course.total;
  let note = `Full One-Time Payment for ${course.duration}`;
  
  if (plan === '2_installments') {
    const inst = Math.round((fee * 1.05) / 2);
    fee = inst * 2;
    note = `2 Easy Installments of ₹${inst.toLocaleString('en-IN')}`;
  } else if (plan === '3_installments') {
    const inst = Math.round((fee * 1.08) / 3);
    fee = inst * 3;
    note = `3 Monthly Installments of ₹${inst.toLocaleString('en-IN')}`;
  }
  
  calcFinalFee.textContent = `₹${fee.toLocaleString('en-IN')}`;
  if (calcEmiNote) calcEmiNote.textContent = note;
}

if (calcCourseSelect && calcPlanSelect) {
  calcCourseSelect.addEventListener('change', updateFeeCalculator);
  calcPlanSelect.addEventListener('change', updateFeeCalculator);
  updateFeeCalculator();
}

// 8. CURATED PHOTO GALLERY & LIGHTBOX
const galleryGrid = document.getElementById('galleryGrid');
const gallerySearch = document.getElementById('gallerySearch');
const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
const lightbox = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGalleryFilter = 'all';
let filteredGalleryList = [];
let activeLightboxIndex = 0;

function initGallery() {
  renderGallery();
}

function getFilteredPhotos() {
  const query = (gallerySearch?.value || '').trim().toLowerCase();
  return (window.DAKSH_PHOTOS || []).filter(item => {
    const matchCat = currentGalleryFilter === 'all' || item.category === currentGalleryFilter;
    const fullSearch = `${item.title} ${item.titleHi || ''} ${item.desc || ''} ${item.badge || ''}`.toLowerCase();
    const matchQuery = !query || fullSearch.includes(query);
    return matchCat && matchQuery;
  });
}

function renderGallery() {
  if (!galleryGrid) return;
  filteredGalleryList = getFilteredPhotos();
  galleryGrid.innerHTML = '';
  
  if (filteredGalleryList.length === 0) {
    galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
      <p style="font-size: 1.1rem;">🔍 No photos found for this category.</p>
    </div>`;
    return;
  }
  
  filteredGalleryList.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', item.title);
    
    card.innerHTML = `
      <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async">
      <div class="gallery-overlay">
        <span class="gallery-badge">${item.badge || item.categoryLabel || 'Campus'}</span>
        <div class="gallery-card-title">${item.title}</div>
      </div>
    `;
    
    card.addEventListener('click', () => openLightbox(index));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(index);
    });
    
    galleryGrid.appendChild(card);
  });
}

function openLightbox(idx) {
  if (!filteredGalleryList.length) return;
  activeLightboxIndex = (idx + filteredGalleryList.length) % filteredGalleryList.length;
  const photo = filteredGalleryList[activeLightboxIndex];
  
  if (lightboxImg) lightboxImg.src = photo.src;
  if (lightboxTitle) lightboxTitle.textContent = photo.title;
  if (lightboxDesc) lightboxDesc.textContent = photo.desc || photo.titleHi || '';
  
  if (lightbox && typeof lightbox.showModal === 'function') {
    lightbox.showModal();
  }
}

galleryFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    galleryFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentGalleryFilter = btn.dataset.galleryFilter;
    renderGallery();
  });
});

if (gallerySearch) {
  gallerySearch.addEventListener('input', renderGallery);
}

if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.close());
if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(activeLightboxIndex - 1));
if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox(activeLightboxIndex + 1));

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') openLightbox(activeLightboxIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(activeLightboxIndex + 1);
  });
}

// 9. ADMISSION & DEMO CLASS FORM (WHATSAPP AUTOMATION)
const demoBookingForm = document.getElementById('demoBookingForm');

if (demoBookingForm) {
  demoBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('demoName')?.value || 'Student';
    const phone = document.getElementById('demoPhone')?.value || '';
    const course = document.getElementById('demoCourse')?.value || 'General Enquiry';
    const timing = document.getElementById('demoTiming')?.value || 'Morning';
    
    const whatsappMsg = `*New Free Demo Class Request — Daksh Institute*%0A%0A` +
      `👤 *Student Name:* ${encodeURIComponent(name)}%0A` +
      `📞 *Mobile No:* ${encodeURIComponent(phone)}%0A` +
      `🎯 *Interested Course:* ${encodeURIComponent(course)}%0A` +
      `⏰ *Preferred Batch Timing:* ${encodeURIComponent(timing)}%0A%0A` +
      `Please confirm my 2-Day Free Trial Demo Seat at Thatipur Campus.`;
    
    const whatsappUrl = `https://wa.me/919770251146?text=${whatsappMsg}`;
    
    showToast('Demo class booked! Opening WhatsApp to send details...', 'success');
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      demoBookingForm.reset();
    }, 1000);
  });
}

// 10. QUICK SYLLABUS DOWNLOAD TOAST
document.querySelectorAll('[data-syllabus-course]').forEach(btn => {
  btn.addEventListener('click', () => {
    const courseName = btn.dataset.syllabusCourse;
    showToast(`Downloading ${courseName} Syllabus Prospectus...`, 'success');
    
    const whatsappUrl = `https://wa.me/919770251146?text=Hi%20Daksh%20Education,%20please%20send%20the%20complete%20syllabus%20PDF%20for%20*${encodeURIComponent(courseName)}*.`;
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1200);
  });
});

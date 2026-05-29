/* ═══════════════════════════════════════════
   AuthFlow — script.js
   Login & Sign-Up Animated Form Logic
═══════════════════════════════════════════ */

"use strict";

/* ─── DOM REFERENCES ─── */
const cardContainer  = document.getElementById("cardContainer");
const goToSignup     = document.getElementById("goToSignup");
const goToLogin      = document.getElementById("goToLogin");
const loginForm      = document.getElementById("loginForm");
const signupForm     = document.getElementById("signupForm");
const loginBtn       = document.getElementById("loginBtn");
const signupBtn      = document.getElementById("signupBtn");
const successOverlay = document.getElementById("successOverlay");
const successClose   = document.getElementById("successClose");
const successTitle   = document.getElementById("successTitle");
const successMsg     = document.getElementById("successMsg");
const strengthFill   = document.getElementById("strengthFill");
const strengthLabel  = document.getElementById("strengthLabel");
const strengthBar    = document.getElementById("strengthBar");

/* ═══════════════════════════════════════════
   1. PARTICLE GENERATOR
═══════════════════════════════════════════ */
(function spawnParticles() {
  const container = document.getElementById("particles");
  const count = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";

    const size    = Math.random() * 5 + 2;            // 2–7 px
    const left    = Math.random() * 100;               // 0–100 %
    const delay   = Math.random() * 18;               // stagger
    const dur     = Math.random() * 14 + 10;          // 10–24 s
    const colors  = ["#7c5eff", "#c45cff", "#00e5ff", "#ff5c7c", "#00e5a0"];
    const color   = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      background:${color};
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ═══════════════════════════════════════════
   2. CARD FLIP  (Login ↔ Sign-Up)
═══════════════════════════════════════════ */
function flipToSignup() {
  cardContainer.classList.add("flipped");
  // Reset login errors
  clearErrors(loginForm);
}

function flipToLogin() {
  cardContainer.classList.remove("flipped");
  // Reset signup errors & strength
  clearErrors(signupForm);
  resetStrength();
}

goToSignup.addEventListener("click", flipToSignup);
goToLogin.addEventListener("click",  flipToLogin);

/* ═══════════════════════════════════════════
   3. PASSWORD VISIBILITY TOGGLE
═══════════════════════════════════════════ */
document.querySelectorAll(".toggle-pass").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const input    = document.getElementById(targetId);
    const icon     = btn.querySelector(".eye-icon");

    if (input.type === "password") {
      input.type = "text";
      // "eye-off" SVG paths
      icon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
    } else {
      input.type = "password";
      icon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
    }
    input.focus();
  });
});

/* ═══════════════════════════════════════════
   4. PASSWORD STRENGTH METER
═══════════════════════════════════════════ */
const suPassInput = document.getElementById("su-pass");

suPassInput.addEventListener("input", () => {
  const val   = suPassInput.value;
  const score = calcStrength(val);

  if (val.length === 0) { resetStrength(); return; }

  strengthBar.style.display = "block";

  const levels = [
    { label: "Weak",     color: "#ff5c7c", pct: "25%" },
    { label: "Fair",     color: "#ffb347", pct: "50%" },
    { label: "Good",     color: "#7c5eff", pct: "75%" },
    { label: "Strong",   color: "#00e5a0", pct: "100%" },
  ];

  const lvl = levels[Math.min(score, 3)];
  strengthFill.style.width      = lvl.pct;
  strengthFill.style.background = lvl.color;
  strengthLabel.style.color     = lvl.color;
  strengthLabel.textContent     = lvl.label;
});

function calcStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)                     score++;
  if (/[A-Z]/.test(pwd))                   score++;
  if (/[0-9]/.test(pwd))                   score++;
  if (/[^A-Za-z0-9]/.test(pwd))            score++;
  return score - 1; // 0–3 index
}

function resetStrength() {
  strengthFill.style.width      = "0";
  strengthLabel.textContent     = "";
  strengthBar.style.display     = "none";
}

/* ═══════════════════════════════════════════
   5. VALIDATION HELPERS
═══════════════════════════════════════════ */
function setError(groupId, errId, msg) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errId);
  if (!group || !err) return;
  group.classList.add("has-error");
  err.textContent = msg;
}

function clearError(groupId, errId) {
  const group = document.getElementById(groupId);
  const err   = document.getElementById(errId);
  if (!group || !err) return;
  group.classList.remove("has-error");
  err.textContent = "";
}

function clearErrors(form) {
  form.querySelectorAll(".input-group").forEach(g => g.classList.remove("has-error"));
  form.querySelectorAll(".field-error").forEach(e => e.textContent = "");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* Live validation — remove error as user fixes field */
function addLiveValidation(inputId, groupId, errId, validator) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", () => {
    if (validator(input.value)) clearError(groupId, errId);
  });
}

addLiveValidation("lg-email",  "lg-email-group", "lg-email-err", v => isValidEmail(v));
addLiveValidation("lg-pass",   "lg-pass-group",  "lg-pass-err",  v => v.length >= 6);
addLiveValidation("su-fname",  "su-fname-group", "su-fname-err", v => v.trim().length >= 2);
addLiveValidation("su-lname",  "su-lname-group", "su-lname-err", v => v.trim().length >= 2);
addLiveValidation("su-email",  "su-email-group", "su-email-err", v => isValidEmail(v));
addLiveValidation("su-pass",   "su-pass-group",  "su-pass-err",  v => v.length >= 8);
addLiveValidation("su-confirm","su-confirm-group","su-confirm-err", v => v === suPassInput.value);

/* ═══════════════════════════════════════════
   6. SIMULATE LOADING THEN SUCCESS
═══════════════════════════════════════════ */
function simulateSubmit(btn, onSuccess) {
  btn.classList.add("loading");
  btn.disabled = true;

  setTimeout(() => {
    btn.classList.remove("loading");
    btn.disabled = false;
    onSuccess();
  }, 1800);
}

function showSuccess(title, msg) {
  successTitle.textContent = title;
  successMsg.textContent   = msg;
  successOverlay.classList.add("visible");
}

successClose.addEventListener("click", () => {
  successOverlay.classList.remove("visible");
});

// Close overlay on backdrop click
successOverlay.addEventListener("click", e => {
  if (e.target === successOverlay) successOverlay.classList.remove("visible");
});

/* ═══════════════════════════════════════════
   7. LOGIN FORM SUBMISSION
═══════════════════════════════════════════ */
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  clearErrors(loginForm);

  const email = document.getElementById("lg-email").value;
  const pass  = document.getElementById("lg-pass").value;
  let   valid = true;

  if (!isValidEmail(email)) {
    setError("lg-email-group", "lg-email-err", "Please enter a valid email address.");
    valid = false;
  }
  if (pass.length < 6) {
    setError("lg-pass-group", "lg-pass-err", "Password must be at least 6 characters.");
    valid = false;
  }

  if (!valid) return shakeCard();

  simulateSubmit(loginBtn, () => {
    showSuccess("Welcome back! 👋", `Signed in as ${email}`);
  });
});

/* ═══════════════════════════════════════════
   8. SIGN-UP FORM SUBMISSION
═══════════════════════════════════════════ */
signupForm.addEventListener("submit", e => {
  e.preventDefault();
  clearErrors(signupForm);

  const fname   = document.getElementById("su-fname").value;
  const lname   = document.getElementById("su-lname").value;
  const email   = document.getElementById("su-email").value;
  const pass    = document.getElementById("su-pass").value;
  const confirm = document.getElementById("su-confirm").value;
  const terms   = document.getElementById("su-terms").checked;
  let   valid   = true;

  if (fname.trim().length < 2) {
    setError("su-fname-group", "su-fname-err", "Enter your first name.");
    valid = false;
  }
  if (lname.trim().length < 2) {
    setError("su-lname-group", "su-lname-err", "Enter your last name.");
    valid = false;
  }
  if (!isValidEmail(email)) {
    setError("su-email-group", "su-email-err", "Enter a valid email address.");
    valid = false;
  }
  if (pass.length < 8) {
    setError("su-pass-group", "su-pass-err", "Password must be at least 8 characters.");
    valid = false;
  }
  if (confirm !== pass) {
    setError("su-confirm-group", "su-confirm-err", "Passwords do not match.");
    valid = false;
  }
  if (!terms) {
    document.getElementById("su-terms-err").textContent = "You must accept the terms to continue.";
    valid = false;
  }

  if (!valid) return shakeCard();

  simulateSubmit(signupBtn, () => {
    showSuccess("Account created! 🎉", `Welcome aboard, ${fname}! Your account is ready.`);
    // Flip back to login after success close
    successClose.addEventListener("click", flipToLogin, { once: true });
  });
});

/* ═══════════════════════════════════════════
   9. SHAKE ANIMATION ON ERROR
═══════════════════════════════════════════ */
function shakeCard() {
  const card = cardContainer.querySelector(
    cardContainer.classList.contains("flipped") ? ".card-back" : ".card-front"
  );
  if (!card) return;

  card.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-8px)" },
    { transform: "translateX(8px)" },
    { transform: "translateX(-6px)" },
    { transform: "translateX(6px)" },
    { transform: "translateX(-3px)" },
    { transform: "translateX(0)" },
  ], { duration: 420, easing: "ease-out" });
}

/* ═══════════════════════════════════════════
   10. SOCIAL BUTTONS (demo feedback)
═══════════════════════════════════════════ */
document.getElementById("google-login").addEventListener("click", () => {
  showSuccess("Google Sign-In", "Redirecting to Google OAuth… (demo)");
});
document.getElementById("github-login").addEventListener("click", () => {
  showSuccess("GitHub Sign-In", "Redirecting to GitHub OAuth… (demo)");
});

/* ═══════════════════════════════════════════
   11. INPUT FOCUS RIPPLE
═══════════════════════════════════════════ */
document.querySelectorAll(".input-wrap input").forEach(input => {
  input.addEventListener("focus", () => {
    const wrap = input.closest(".input-wrap");
    wrap.animate([
      { boxShadow: "0 0 0 0px rgba(124,94,255,0)" },
      { boxShadow: "0 0 0 4px rgba(124,94,255,0.18)" },
    ], { duration: 300, fill: "forwards" });
  });
});

/* ═══════════════════════════════════════════
   12. KEYBOARD: ESC closes success overlay
═══════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && successOverlay.classList.contains("visible")) {
    successOverlay.classList.remove("visible");
  }
});

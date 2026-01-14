// Mood Harmony Hub — local-first mood tracker with recommendations and chart
// Data model: { dateISO, mood, energy (1-5), notes }

const STORAGE_KEY = "mood_harmony_entries_v1";

const moodForm = document.getElementById("mood-form");
const moodSelect = document.getElementById("mood");
const energyInput = document.getElementById("energy");
const notesInput = document.getElementById("notes");

const activityList = document.getElementById("activity-list");
const musicList = document.getElementById("music-list");
const routineList = document.getElementById("routine-list");

const entriesContainer = document.getElementById("entries");
const exportBtn = document.getElementById("export-json");
const clearBtn = document.getElementById("clear-data");

const privacyDialog = document.getElementById("privacy-dialog");
const privacyLink = document.getElementById("privacy-link");
const closePrivacy = document.getElementById("close-privacy");

let chartInstance = null;

// --- Utilities ---
function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// --- Recommendation engine ---
const RECS = {
  joyful: {
    activities: [
      "Capture the moment—write 3 highlights",
      "Share gratitude with a friend",
      "Go for a celebratory walk",
    ],
    music: [
      { title: "Upbeat Indie", tag: "bright" },
      { title: "Feel-good Pop", tag: "energy" },
      { title: "Funk Grooves", tag: "dance" },
    ],
    routines: [
      "Plan a mini reward for tomorrow",
      "Set one playful goal",
      "Do a 5-minute stretch",
    ],
  },
  calm: {
    activities: [
      "10-minute mindful breathing",
      "Gentle yoga flow",
      "Tea ritual—slow and present",
    ],
    music: [
      { title: "Ambient Calm", tag: "soothe" },
      { title: "Lo-fi Focus", tag: "steady" },
      { title: "Soft Piano", tag: "warm" },
    ],
    routines: [
      "Evening wind-down checklist",
      "Screen-light limit after 9pm",
      "Gratitude note",
    ],
  },
  focused: {
    activities: [
      "Deep work sprint (25 min)",
      "Task triage—top 3 priorities",
      "Declutter your desk (5 min)",
    ],
    music: [
      { title: "Binaural Focus", tag: "flow" },
      { title: "Coding Lo-fi", tag: "steady" },
      { title: "Minimal Tech", tag: "drive" },
    ],
    routines: [
      "Pomodoro cycles x2",
      "Hydration reminder",
      "Micro-break: eyes + neck",
    ],
  },
  anxious: {
    activities: [
      "Box breathing (4-4-4-4)",
      "Write worries → reframe 1",
      "Grounding: 5-4-3-2-1 senses",
    ],
    music: [
      { title: "Breath-led Ambient", tag: "slow" },
      { title: "Nature Soundscapes", tag: "ground" },
      { title: "Soft Strings", tag: "ease" },
    ],
    routines: [
      "Limit caffeine for 6 hours",
      "Short walk—observe surroundings",
      "Text someone you trust",
    ],
  },
  tired: {
    activities: [
      "Power nap (15–20 min)",
      "Gentle stretch routine",
      "Sunlight exposure (10 min)",
    ],
    music: [
      { title: "Calm Acoustic", tag: "rest" },
      { title: "Warm Lo-fi", tag: "cozy" },
      { title: "Soft Jazz", tag: "unwind" },
    ],
    routines: [
      "Early bedtime window",
      "Hydration + light snack",
      "Screen dimming after sunset",
    ],
  },
  sad: {
    activities: [
      "Name the feeling—no judgment",
      "Write a compassionate note to self",
      "Low-effort walk or stretch",
    ],
    music: [
      { title: "Gentle Piano", tag: "comfort" },
      { title: "Slow Ambient", tag: "soothe" },
      { title: "Acoustic Ballads", tag: "warmth" },
    ],
    routines: [
      "Reach out to a friend",
      "Warm shower or tea",
      "One small, doable task",
    ],
  },
  stressed: {
    activities: [
      "Prioritize: must/should/can wait",
      "Breathing: 4 in, 6 out (5 min)",
      "Write a 3-step plan",
    ],
    music: [
      { title: "Focus Lo-fi", tag: "steady" },
      { title: "Calm Beats", tag: "balance" },
      { title: "Soft Ambient", tag: "ease" },
    ],
    routines: [
      "Time-block 30 minutes",
      "Micro-break every 45 minutes",
      "Evening wind-down ritual",
    ],
  },
};

function getRecommendations(mood, energy) {
  const base = RECS[mood] || RECS.calm;
  const energyLevel = clamp(Number(energy) || 3, 1, 5);

  // Adjust intensity based on energy
  const activityBoost = energyLevel >= 4 ? "Try a slightly longer session" : "Keep it light and kind";
  const musicBadge = energyLevel >= 4 ? "uplift" : "soothe";
  const routineNote = energyLevel <= 2 ? "Focus on rest-first routines" : "Lean into gentle productivity";

  return {
    activities: base.activities.map((a) => `${a} — ${activityBoost}`),
    music: base.music.map((m) => ({ ...m, tag: `${m.tag}/${musicBadge}` })),
    routines: base.routines.map((r) => `${r} — ${routineNote}`),
  };
}

// --- Rendering ---
function renderRecommendations(mood, energy) {
  const recs = getRecommendations(mood, energy);

  function renderList(el, items, isMusic = false) {
    el.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      if (isMusic) {
        li.innerHTML = `${item.title} <span class="badge">${item.tag}</span>`;
      } else {
        li.textContent = item;
      }
      el.appendChild(li);
    });
  }

  renderList(activityList, recs.activities);
  renderList(musicList, recs.music, true);
  renderList(routineList, recs.routines);
}

function renderEntries(entries) {
  entriesContainer.innerHTML = "";
  if (!entries.length) {
    entriesContainer.innerHTML = `<p class="meta">No entries yet—log your first mood above.</p>`;
    return;
  }

  const sorted = [...entries].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
  sorted.slice(0, 10).forEach((e) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <h4>${e.mood} • energy ${e.energy}/5</h4>
      <div class="meta">${formatDate(e.dateISO)}</div>
      ${e.notes ? `<div class="notes">${escapeHTML(e.notes)}</div>` : ""}
    `;
    entriesContainer.appendChild(div);
  });
}

function escapeHTML(str) {
  const p = document.createElement("p");
  p.textContent = str;
  return p.innerHTML;
}

function renderChart(entries) {
  const ctx = document.getElementById("mood-chart").getContext("2d");
  const sorted = [...entries].sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO));

  const labels = sorted.map((e) => new Date(e.dateISO).toLocaleDateString());
  const energyData = sorted.map((e) => Number(e.energy));

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Energy (1–5)",
          data: energyData,
          borderColor: "#7c8cff",
          backgroundColor: "rgba(124,140,255,0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: { stepSize: 1 },
          grid: { color: "#262a40" },
        },
        x: { grid: { color: "#262a40" } },
      },
      plugins: {
        legend: { labels: { color: "#e7e9f7" } },
        tooltip: { mode: "index", intersect: false },
      },
    },
  });
}

// --- Events ---
moodForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const mood = moodSelect.value;
  const energy = clamp(Number(energyInput.value), 1, 5);
  const notes = notesInput.value.trim();

  if (!mood || !energy) return;

  const entries = loadEntries();
  entries.push({
    dateISO: new Date().toISOString(),
    mood,
    energy,
    notes,
  });
  saveEntries(entries);

  renderEntries(entries);
  renderChart(entries);
  renderRecommendations(mood, energy);

  moodForm.reset();
  moodSelect.focus();
});

moodSelect.addEventListener("change", () => {
  const mood = moodSelect.value || "calm";
  const energy = energyInput.value || 3;
  renderRecommendations(mood, energy);
});
energyInput.addEventListener("input", () => {
  const mood = moodSelect.value || "calm";
  const energy = energyInput.value || 3;
  renderRecommendations(mood, energy);
});

exportBtn.addEventListener("click", () => {
  const entries = loadEntries();
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mood-harmony-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

clearBtn.addEventListener("click", () => {
  const ok = confirm("Clear all mood entries? This cannot be undone.");
  if (!ok) return;
  saveEntries([]);
  renderEntries([]);
  renderChart([]);
});

privacyLink.addEventListener("click", (e) => {
  e.preventDefault();
  privacyDialog.showModal();
});
closePrivacy.addEventListener("click", () => privacyDialog.close());

// --- Init ---
(function init() {
  const entries = loadEntries();
  renderEntries(entries);
  renderChart(entries);
  renderRecommendations("calm", 3);
})();

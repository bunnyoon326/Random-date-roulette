const categories = [
  {
    key: "location",
    label: "📍 위치",
    options: [
      "2호선",
      "3호선",
      "4호선",
      "5호선",
      "6호선",
      "7호선",
      "8호선",
      "9호선",
      "경의중앙선",
      "수인분당선",
      "공항철도",
      "신분당선",
      "경춘선",
      "서해선",
      "인천1호선",
      "인천2호선"
    ],
  },
  {
    key: "lunch",
    label: "🍽 점심식사",
    options: [
      "국밥",
      "라멘",
      "돈까스",
      "파스타",
      "쌀국수",
      "김치찌개",
      "부대찌개",
      "햄버거",
      "초밥",
      "칼국수",
      "마라탕",
      "분식",
      "덮밥",
      "제육볶음",
      "냉면",
      "샌드위치",
      "비빔밥",
      "우동"
    ],
  },
  {
    key: "snack",
    label: "🍩 간식",
    options: [
      "카페 디저트",
      "크로플",
      "아이스크림",
      "마카롱",
      "와플",
      "붕어빵",
      "탕후루",
      "쿠키",
      "케이크",
      "크레페",
      "두쫀쿠",
      "푸딩",
      "버블티",
      "꽈배기",
    ],
  },
  {
    key: "activity",
    label: "🎲 활동내용",
    options: [
      "산책",
      "인생네컷찍기",
      "카페투어",
      "책방 구경",
      "소품샵 구경",
      "노래방",
      "보드게임카페",
      "전시회",
      "공원 피크닉",
      "야경 보기",
      "게임센터",
      "사진 10장 찍기 미션",
      "영화보기",
      "서점가기",
    ],
  },
  {
    key: "dinner",
    label: "🌙 저녁",
    options: [
      "삼겹살",
      "닭갈비",
      "곱창",
      "치킨",
      "피자",
      "샤브샤브",
      "한식백반",
      "타코",
      "양식 레스토랑",
      "야시장 먹방",
      "이자카야",
      "칼국수",
    ],
  },
];

const state = {
  index: 0,
  spinning: false,
  picks: {},
  spinDeg: 0,
};

const progressEl = document.querySelector("#progress");
const stepLabel = document.querySelector("#stepLabel");
const wheel = document.querySelector("#wheel");
const spinBtn = document.querySelector("#spinBtn");
const resultArea = document.querySelector("#resultArea");
const nextBtn = document.querySelector("#nextBtn");
const restartBtn = document.querySelector("#restartBtn");
const finalPlan = document.querySelector("#finalPlan");
const planList = document.querySelector("#planList");

function renderProgress() {
  progressEl.innerHTML = categories
    .map((cat, idx) => {
      const cls = idx < state.index ? "done" : idx === state.index ? "active" : "";
      return `<li class="${cls}">${cat.label}</li>`;
    })
    .join("");
}

function currentCategory() {
  return categories[state.index];
}

function renderStep() {
  if (state.index >= categories.length) {
    stepLabel.textContent = "모든 단계 완료!";
    wheel.textContent = "DONE";
    spinBtn.disabled = true;
    nextBtn.disabled = true;
    showFinalPlan();
    return;
  }

  const category = currentCategory();
  stepLabel.textContent = `현재 단계: ${category.label}`;
  resultArea.innerHTML = "<p class='result-title'>룰렛을 돌려서 항목을 선택하세요!</p>";
  nextBtn.disabled = true;
  spinBtn.disabled = false;
  wheel.textContent = "SPIN";
  renderProgress();
}

function spin() {
  if (state.spinning || state.index >= categories.length) return;

  state.spinning = true;
  spinBtn.disabled = true;
  nextBtn.disabled = true;

  const category = currentCategory();
  const selected =
    category.options[Math.floor(Math.random() * category.options.length)];

  const extraTurn = 1080 + Math.floor(Math.random() * 720);
  state.spinDeg += extraTurn;
  wheel.style.transform = `rotate(${state.spinDeg}deg)`;

  setTimeout(() => {
    state.picks[category.key] = {
      label: category.label,
      value: selected,
    };

    resultArea.innerHTML = `
      <div>
        <p class="result-title">${category.label} 결과</p>
        <p class="result-value">${selected}</p>
      </div>
    `;

    state.spinning = false;
    nextBtn.disabled = false;
  }, 2400);
}

function nextStep() {
  if (state.index >= categories.length) return;
  state.index += 1;
  renderStep();
}

function showFinalPlan() {
  finalPlan.classList.remove("hidden");
  const rows = categories
    .map((category) => {
      const picked = state.picks[category.key];
      return `<li><strong>${category.label}</strong>: ${picked?.value || "-"}</li>`;
    })
    .join("");

  planList.innerHTML = rows;
}

function restart() {
  state.index = 0;
  state.spinning = false;
  state.picks = {};
  state.spinDeg = 0;
  wheel.style.transform = "rotate(0deg)";
  finalPlan.classList.add("hidden");
  renderStep();
}

spinBtn.addEventListener("click", spin);
nextBtn.addEventListener("click", nextStep);
restartBtn.addEventListener("click", restart);

renderStep();

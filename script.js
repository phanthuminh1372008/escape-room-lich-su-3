// Data câu hỏi
let puzzles = [
  {
    id: 1,
    type: "video",
    content: "https://www.youtube.com/embed/ATWuXsE9S7E",
    hint: "Video nói: 'Nguyễn Huệ và Quang Trung là hai người khác nhau'",
    correct: false
  },
  {
    id: 2,
    type: "image",
    content: "https://upload.wikimedia.org/wikipedia/commons/6/65/Nguyen_Hue_Emperor.jpg",
    hint: "Poster ghi: 'Nguyễn Huệ và Quang Trung là một người'",
    correct: true
  }
];

let attempts = {};  // id -> true/false
let locked = {};    // id -> true nếu chọn sai
let score = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Vẽ câu hỏi
function renderPuzzles() {
  const container = document.getElementById("puzzleContainer");
  container.innerHTML = "";
  puzzles.forEach(p => {
    let html = `<div class="puzzle" id="puzzle${p.id}">
      <h2>Câu ${p.id}</h2>`;
    if(p.type === "video"){
      html += `<div class="video-wrap">
        <iframe src="${p.content}" title="Video lịch sử" allowfullscreen></iframe>
      </div>`;
    } else if(p.type === "image"){
      html += `<img src="${p.content}" class="poster" alt="Poster lịch sử">`;
    }
    html += `<p class="hint">${p.hint}</p>
      <div class="choices">
        <button onclick="checkAnswer(${p.id},true)">Đúng</button>
        <button onclick="checkAnswer(${p.id},false)">Sai</button>
      </div>
      <p id="feedback${p.id}" class="feedback"></p>
    </div>`;
    container.innerHTML += html;
  });
  updateStatus();
}

// Kiểm tra đáp án
function checkAnswer(id, answer){
  if(locked[id]) return; // khóa câu hỏi
  let puzzle = puzzles.find(p=>p.id===id);
  let fb = document.getElementById("feedback"+id);

  if(answer === puzzle.correct){
    attempts[id] = true;
    fb.style.color="green";
    fb.textContent = "Chính xác! " + getExplanation(id);
  } else {
    attempts[id] = false;
    locked[id] = true;  // khóa lần đầu sai
    fb.style.color="red";
    fb.textContent = "Sai! " + getExplanation(id);
  }
  updateStatus();
}

function getExplanation(id){
  if(id===1) return "Nguyễn Huệ chính là Quang Trung — lãnh đạo quân Tây Sơn chiến thắng quân Thanh năm 1789.";
  if(id===2) return "Poster này đúng: Quang Trung = Nguyễn Huệ, hai tên cùng một người.";
  return "";
}

// Cập nhật trạng thái
function updateStatus(){
  const done = Object.values(attempts).filter(x=>x).length;
  document.getElementById("scoreDisplay").textContent = "Điểm: " + Object.values(attempts).filter(x=>x===true).length*10;
  document.getElementById("progressDisplay").textContent = "Tiến độ: " + done + " / " + puzzles.length;
}

// Mở cửa
function tryDoor(){
  const wrongs = Object.keys(puzzles).filter(p => !attempts[p]);
  const doorFB = document.getElementById("doorFeedback");
  if(wrongs.length === 0){
    doorFB.style.color="green";
    doorFB.textContent="Chúc mừng! Bạn đã mở cửa thành công!";
  } else {
    doorFB.style.color="red";
    doorFB.textContent="Bạn còn câu trả lời sai. Màn chơi sẽ được xáo trộn và bắt đầu lại!";
    // reset trạng thái
    locked = {};
    wrongs.forEach(id=>attempts[id]=false);
    puzzles = shuffleArray(puzzles);
    renderPuzzles();
  }
}

// Khi load trang
window.addEventListener("load", renderPuzzles);

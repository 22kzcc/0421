let coverImg, pageImg, gameImg, radarImg, colorImg, seaImg, bgImg, w2Img, smileImg; 
let page = 0; 
let totalPages = 3; 
let flipAnim = 1; 
let flashAlpha = 0; 
let particles = []; 

// 選單項目：精確導向每一頁
let menuItems = ["封面導覽", "W1 水中", "W2 微笑臉", "W3 水草", "W4 彩色", "W5 雷達", "W6 急急棒"];
let menuY = [];

function preload() {
  coverImg = loadImage('book.jpg');
  pageImg = loadImage('book2.jpg');
  bgImg = loadImage('背景.jpg'); 
  
  // 作品素材載入
  w2Img = loadImage('w2.png'); 
  smileImg = loadImage('4.png');    // 微笑臉
  seaImg = loadImage('水草.png');
  colorImg = loadImage('彩色.png');
  radarImg = loadImage('雷達.png');
  gameImg = loadImage('急急棒.gif'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  updateMenuPositions();

  for (let i = 0; i < 50; i++) {
    particles.push({x: random(width), y: random(height), size: random(2, 4), speed: random(0.2, 0.4)});
  }
}

function updateMenuPositions() {
  menuY = [];
  let startY = height/2 - 130; 
  for(let i=0; i<menuItems.length; i++) {
    menuY.push(startY + i * 42);
  }
}

function draw() {
  push();
  imageMode(CORNER);
  image(bgImg, 0, 0, width, height);
  pop();
  
  drawParticles();
  drawSidebar(); 

  flipAnim = lerp(flipAnim, 1, 0.15);

  push();
  translate(width / 2, height / 2);
  let s = map(flipAnim, 0, 1, 0.9, 1);
  scale(s);

  if (page === 0) drawCoverPage();
  else drawInnerContent(page);
  pop();

  drawUI();

  if (flashAlpha > 0) {
    fill(255, 255, 255, flashAlpha);
    noStroke();
    rect(0, 0, width, height);
    flashAlpha -= 15;
  }
}

function drawSidebar() {
  push();
  fill(40, 40, 40, 220); 
  noStroke();
  rect(15, height/2 - 190, 160, 360, 12);
  
  fill(255);
  textSize(17);
  textStyle(BOLD);
  textAlign(LEFT);
  text("目錄索引", 35, height/2 - 165);
  
  stroke(100);
  strokeWeight(1);
  line(35, height/2 - 150, 145, height/2 - 150);
  
  noStroke();
  textSize(14);
  textStyle(NORMAL);
  for(let i=0; i<menuItems.length; i++) {
    let isActive = false;
    if (i === 0 && page === 0) isActive = true;
    else if ((i === 1 || i === 2) && page === 1) isActive = true; 
    else if ((i === 3 || i === 4) && page === 2) isActive = true; 
    else if ((i === 5 || i === 6) && page === 3) isActive = true; 
    
    let isHover = (mouseX > 15 && mouseX < 175 && mouseY > menuY[i]-15 && mouseY < menuY[i]+15);
    
    if (isActive) fill(255, 200, 0); 
    else if (isHover) { fill(180, 220, 255); cursor(HAND); }
    else fill(210);
    
    text(menuItems[i], 45, menuY[i]);
    if (isActive) ellipse(35, menuY[i], 5, 5);
  }
  pop();
}

function drawParticles() {
  fill(255, 120);
  noStroke();
  for (let p of particles) {
    ellipse(p.x, p.y, p.size);
    p.y -= p.speed; 
    if (p.y < 0) p.y = height;
  }
}

function drawCoverPage() {
  let h = height * 0.8;
  let w = h * (coverImg.width / coverImg.height);
  push();
  scale(flipAnim, 1);
  image(coverImg, 0, 0, w, h);
  fill(255, 230); 
  ellipse(20, 0, w * 0.8, 120); 
  fill(50);
  textSize(width * 0.025); 
  text("大一下作品集", 20, 0);
  drawTinyPageNum(0, h, "cover");
  pop();
}

function drawInnerContent(index) {
  let h = height * 0.9;
  let w = h * (pageImg.width / pageImg.height);
  push();
  scale(flipAnim, 1);
  image(pageImg, 0, 0, w, h);
  fill(0, 30);
  rect(-2, -h/2, 4, h); 
  
  let leftX = -w * 0.25;
  let rightX = w * 0.25;

  if (index === 1) {
    // P.1 水中音樂會 / P.2 微笑臉
    drawWork(leftX, h, w, "水中音樂會", w2Img, "https://22kzcc.github.io/-W2/", true);
    // 修改重點：傳入 true，讓微笑臉圖片變小
    drawWork(rightX, h, w, "微笑臉", smileImg, "https://22kzcc.github.io/w4/", true); 
  } else if (index === 2) {
    // P.3 水草網頁 / P.4 玩耍彩色
    drawWork(leftX, h, w, "水草網頁", seaImg, "https://22kzcc.github.io/sea/", false);
    drawWork(rightX, h, w, "玩耍彩色", colorImg, "https://22kzcc.github.io/041403/", false);
  } else if (index === 3) {
    // P.5 雷達找遊戲 / P.6 電流急急棒
    drawWork(leftX, h, w, "雷達找遊戲", radarImg, "https://22kzcc.github.io/040730118/", false);
    drawWork(rightX, h, w, "電流急急棒", gameImg, "https://22kzcc.github.io/4147301180407/", false);
  }
  
  drawTinyPageNum(leftX, h, index * 2 - 1);
  drawTinyPageNum(rightX, h, index * 2);
  pop();
}

function drawWork(px, h, w, title, img, url, isSmall) {
  noStroke();
  fill(60);
  textSize(width * 0.015);
  textStyle(BOLD);
  text(title, px, -h * 0.22);
  
  if (img) {
    // 修改重點：優化小尺寸圖片的限制，讓最大寬度更小 (原本是 0.28，現在改為 0.25)
    let sizeFactor = isSmall ? 0.25 : 0.38;
    let maxW = w * sizeFactor; 
    let maxH = h * (sizeFactor + 0.05); 
    let scaleRatio = min(maxW / img.width, maxH / img.height);
    let imgW = img.width * scaleRatio;
    let imgH = img.height * scaleRatio;
    image(img, px, -20, imgW, imgH);
    fill(0, 102, 204);
    textStyle(NORMAL);
    textSize(14);
    text("GO PLAY ➔", px, imgH/2 + 20);
  }
}

function drawTinyPageNum(px, h, num) {
  fill(80);
  textSize(20); 
  let label = (num === "cover") ? "Cover" : "P. " + num;
  text(label, px, h/2 - 60); 
}

function drawUI() {
  cursor(ARROW); 
  fill(100);
  textSize(12);
  if (page > 0) text("PREV", 40, height - 40);
  if (page < totalPages) text("NEXT", width - 40, height - 40);
}

function mousePressed() {
  // 選單跳轉
  for(let i=0; i<menuItems.length; i++) {
    if (mouseX > 15 && mouseX < 175 && mouseY > menuY[i]-15 && mouseY < menuY[i]+15) {
      if (i === 0) page = 0;
      else if (i === 1 || i === 2) page = 1;
      else if (i === 3 || i === 4) page = 2;
      else if (i === 5 || i === 6) page = 3;
      flipAnim = 0;
      flashAlpha = 150;
      return; 
    }
  }

  if (page >= 1) {
    let h = height * 0.9;
    let w = h * (pageImg.width / pageImg.height);
    let leftX = width/2 - w*0.25;
    let rightX = width/2 + w*0.25;

    if (page === 1) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/-W2/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/w4/");
    }
    if (page === 2) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/sea/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/041403/");
    }
    if (page === 3) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/040730118/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/4147301180407/");
    }
  }

  let oldPage = page;
  if (mouseX > width * 0.6 && page < totalPages) page++;
  else if (mouseX < width * 0.4 && page > 0) page--;
  if (oldPage !== page) { flipAnim = 0; flashAlpha = 150; }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateMenuPositions();
}
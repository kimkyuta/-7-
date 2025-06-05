// 게임에 필요한 변수들을 준비해요
let startTime = 0;         // 게임 시작 시간을 저장할 변수예요
let timerInterval = null;  // 타이머를 동작시키는 변수예요
let isRunning = false;    // 게임이 진행 중인지 확인하는 변수예요

// 화면에 있는 요소들을 가져와요
const timerDisplay = document.querySelector('.timer-display');  // 시간을 보여주는 곳
const toggleBtn = document.getElementById('toggleBtn');         // 시작/멈춤 버튼
const lastResult = document.getElementById('lastResult');       // 결과를 보여주는 곳
const bonusInfo = document.getElementById('bonusInfo');        // 보너스 정보를 보여주는 곳
const rankOverlay = document.getElementById('rankOverlay');    // 등수를 크게 보여주는 화면
const rankMessage = rankOverlay.querySelector('.rank-message'); // 등수 메시지
const gokakaoBtn = document.getElementById('gokakaoBtn');         // 카카오톡 채널 이동 버튼

// 각 등수의 기준과 메시지를 정해요
const rankCriteria = [
    { diff: 0, message: "🎯 완벽한 1등! 정확히 7초예요!", color: '#FFD700' },
    { diff: 0.05, message: "🥈 2등! 0.05초 차이! 대단해요!", color: '#FFFFFF' },
    { diff: 0.1, message: "🥉 3등! 0.1초 차이! 잘했어요!", color: '#FFFFFF' },
    { diff: 0.3, message: "✨ 4등! 0.3초 차이! 좋아요!", color: '#FFFFFF' },
    { diff: 1.0, message: "🌟 5등! 1초 이내! 잘했어요!", color: '#FFFFFF' }
];

// 버튼을 클릭했을 때 실행될 함수를 연결해요
toggleBtn.addEventListener('click', toggleGame);
gokakaoBtn.addEventListener('click', goKakao);

// 카카오톡 채널 이동
function goKakao() {
    window.open('http://pf.kakao.com/_xgpxips', '_blank');
}
// 게임을 시작하거나 멈추는 함수예요
function toggleGame() {
    if (!isRunning) {
        startGame();  // 게임이 멈춰있으면 시작해요
    } else {
        stopGame();   // 게임이 실행 중이면 멈춰요
    }
}

// 게임을 시작하는 함수예요
function startGame() {
    startTime = Date.now();  // 시작 시간을 기록해요
    isRunning = true;        // 게임이 시작됐다고 표시해요
    
    // 버튼의 모양을 바꿔요
    toggleBtn.textContent = '멈추기';
    toggleBtn.classList.add('running');
    
    // 타이머를 시작해요 (0.01초마다 시간을 업데이트해요)
    timerInterval = setInterval(updateTimer, 10);
    
    // 이전 결과를 지워요
    lastResult.textContent = '';
    bonusInfo.textContent = '';
}

// 시간을 업데이트하는 함수예요
function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000;  // 경과 시간을 초 단위로 계산해요
    timerDisplay.textContent = elapsedTime.toFixed(2);     // 소수점 둘째 자리까지 보여줘요
}

// 게임을 멈추는 함수예요
function stopGame() {
    isRunning = false;                 // 게임을 멈췄다고 표시해요
    clearInterval(timerInterval);      // 타이머를 멈춰요
    
    // 버튼을 원래대로 돌려놓아요
    toggleBtn.textContent = '시작하기';
    toggleBtn.classList.remove('running');
    
    // 결과를 계산해요
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;  // 총 경과 시간
    const timeDiff = Math.abs(elapsedTime - 7);        // 7초와의 차이
    
    // 결과 메시지를 만들어요
    let resultMessage = `걸린 시간: ${elapsedTime.toFixed(2)}초\n`;
    resultMessage += `목표 시간과의 차이: ${timeDiff.toFixed(2)}초\n`;
    
    // 등수를 확인해요
    let rank = -1;
    for (let i = 0; i < rankCriteria.length; i++) {
        if (timeDiff <= rankCriteria[i].diff) {
            rank = i;
            break;
        }
    }
    
    // 5등 안에 들었다면 축하 효과를 보여줘요
    if (rank !== -1) {
        showRankCelebration(rank);
        resultMessage += rankCriteria[rank].message;
    } else {
        resultMessage += "아쉽네요! 다시 도전해보세요! 💪";
    }
    
    // 결과를 화면에 보여줘요
    lastResult.textContent = resultMessage;
}

// 축하 효과를 보여주는 함수예요
function showRankCelebration(rank) {
    // 등수 화면을 보여줘요
    rankOverlay.style.display = 'flex';
    rankMessage.textContent = rankCriteria[rank].message;
    rankMessage.style.color = rankCriteria[rank].color;
    
    // 폭죽 효과를 설정해요
    const duration = 5000;  // 5초 동안 폭죽이 터져요
    const animationEnd = Date.now() + duration;
    const colors = [rankCriteria[rank].color, '#DAD9FF', '#FAECC5'];
    
    // 폭죽을 계속 터트려요
    const interval = setInterval(function() {
        if (Date.now() > animationEnd) {
            clearInterval(interval);
            rankOverlay.style.display = 'none';
            return;
        }
        
        // 왼쪽에서 폭죽을 쏘아올려요
        confetti({
            particleCount: 30,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: colors
        });
        
        // 오른쪽에서 폭죽을 쏘아올려요
        confetti({
            particleCount: 30,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: colors
        });
        
        // 가운데서 폭죽을 쏘아올려요
        confetti({
            particleCount: 40,
            spread: 100,
            origin: { x: 0.5, y: 0.9 },
            colors: colors,
            startVelocity: 45
        });
    }, 200);  // 0.2초마다 폭죽을 터트려요
}

// 처음 시작할 때 타이머를 00.00으로 보여줘요
timerDisplay.textContent = '00.00'; 
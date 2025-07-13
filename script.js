const items = document.querySelectorAll('.draggable');
const bins = document.querySelectorAll('.bin');
const resultDiv = document.getElementById('result');
const steps = document.querySelectorAll('.step');

let completedSteps = new Set();

steps.forEach(step => {
  step.addEventListener('click', () => {
    const stepKey = step.dataset.step;
    if (completedSteps.has(stepKey)) {
      completedSteps.delete(stepKey);
      step.classList.remove('active');
    } else {
      completedSteps.add(stepKey);
      step.classList.add('active');
    }
  });
});

const info = {
  plastic: '플라스틱은 헹군 후 라벨 제거, 압축 후 버려요.',
  food: '음식물 쓰레기는 가축 사료가 될 수 있는 것만 해당돼요.',
  paper: '종이는 이물질 제거 후 깨끗하게 묶어서 버려요.',
  glass: '유리병은 헹구고 라벨 제거 후 버려요.',
  can: '캔은 내용물 비우고 이물질 제거해서 버려요.',
  styrofoam: '스티로폼은 이물질 제거 후 배출해요.',
  general: '이건 재활용이 어려워서 일반쓰레기예요.'
};

items.forEach(item => {
  item.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', item.dataset.type || '');
    e.dataTransfer.setData('required', item.dataset.required || '');
  });
});

bins.forEach(bin => {
  bin.addEventListener('dragover', e => e.preventDefault());
  bin.addEventListener('drop', e => {
    const itemType = e.dataTransfer.getData('type');
    const requiredStepsRaw = e.dataTransfer.getData('required');
    const requiredSteps = requiredStepsRaw ? requiredStepsRaw.split(',').filter(Boolean) : [];
    const binType = bin.dataset.accept;

    const allStepsCompleted = requiredSteps.every(step => completedSteps.has(step));

    if (itemType === binType && allStepsCompleted) {
      resultDiv.textContent = '✅ 정답이에요! ' + (info[binType] || '');
      resultDiv.style.color = 'green';
    } else if (!allStepsCompleted && requiredSteps.length > 0) {
      resultDiv.textContent = '⚠️ 처리 과정을 모두 완료해야 해요! 필요한 과정: ' + requiredSteps.join(', ');
      resultDiv.style.color = 'orange';
    } else {
      resultDiv.textContent = '❌ 틀렸어요! ' + (info[itemType] || '올바른 분리배출을 확인하세요.');
      resultDiv.style.color = 'red';
    }
  });
});

// Костюк Артем, КН-42. Лабораторна робота №4.
// Масив і пороги — навчальні умови задачі, а не нормативи шуму.
// Скрипт лише обчислює результати й друкує один звіт; HTML не змінює.

const noiseLevels = [
  42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
  53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
  79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

// Arrow Function з одним параметром: представлення результату, без обчислень.
const formatLevel = value => value === null ? "немає даних" : `${value} dB`;

// Arrow Function з двома параметрами: строге перевищення заданого порога.
const isAbove = (value, threshold) => value > threshold;

function isValidLevel(level, min, max) {
  return Number.isFinite(level) && level >= min && level <= max;
}

function calculateAverage(sum, validCount) {
  if (validCount === 0) {
    return null;
  }

  return sum / validCount;
}

// Function Expression: один повний перебір для зведення коректних даних.
const summarizeLevels = function (data, warning, critical, min, max) {
  let validCount = 0;
  let invalidCount = 0;
  let sum = 0;
  let safeCount = 0;
  let warningCount = 0;
  let criticalCount = 0;
  let minimum = null;
  let maximum = null;

  for (const level of data) {
    if (!isValidLevel(level, min, max)) {
      invalidCount++;
      continue;
    }

    validCount++;
    sum += level;

    // Перше коректне значення стає початковим мінімумом і максимумом.
    if (minimum === null) {
      minimum = level;
      maximum = level;
    } else {
      if (level < minimum) {
        minimum = level;
      }
      if (level > maximum) {
        maximum = level;
      }
    }

    if (isAbove(level, critical)) {
      criticalCount++;
    } else if (isAbove(level, warning)) {
      warningCount++;
    } else {
      safeCount++;
    }
  }

  return {
    totalCount: data.length,
    validCount: validCount,
    invalidCount: invalidCount,
    sum: sum,
    average: calculateAverage(sum, validCount),
    minimum: minimum,
    maximum: maximum,
    safeCount: safeCount,
    warningCount: warningCount,
    criticalCount: criticalCount,
    aboveWarningCount: warningCount + criticalCount
  };
};

// Function Declaration: for потрібний для людської позиції index + 1.
function findFirstCritical(data, critical, min, max) {
  let firstCritical = null;

  for (let index = 0; index < data.length; index++) {
    const level = data[index];

    if (!isValidLevel(level, min, max)) {
      continue;
    }

    if (isAbove(level, critical)) {
      firstCritical = { value: level, position: index + 1 };
      break;
    }
  }

  return firstCritical;
}

function findRecovery(data, firstCriticalPosition, warning, min, max) {
  if (firstCriticalPosition === null) {
    return null;
  }

  // Позиція критичного від 1 дорівнює індексу наступного елемента від 0.
  let index = firstCriticalPosition;
  let safeStreak = 0;

  while (index < data.length) {
    const level = data[index];

    if (isValidLevel(level, min, max) && !isAbove(level, warning)) {
      safeStreak++;
    } else {
      safeStreak = 0;
    }

    // Індекс збільшується на кожній ітерації, навіть для некоректного значення.
    index++;

    if (safeStreak === 3) {
      // Після index++ це позиція щойно перевіреного третього значення від 1.
      return index;
    }
  }

  return null;
}

function findFirstValid(data, min, max) {
  if (data.length === 0) {
    return null;
  }

  let index = 0;

  do {
    const level = data[index];

    if (isValidLevel(level, min, max)) {
      return { value: level, position: index + 1 };
    }

    index++;
  } while (index < data.length);

  return null;
}

function describeInvalidLevels(data, min, max) {
  let description = "";

  for (let index = 0; index < data.length; index++) {
    if (isValidLevel(data[index], min, max)) {
      continue;
    }

    if (description !== "") {
      description += "; ";
    }
    description += `позиція ${index + 1} (${data[index]})`;
  }

  if (description === "") {
    return "немає";
  }

  return description;
}

function analyzeMeasurements(data, warning, critical, min, max, summaryOperation) {
  // Callback виконується синхронно; його return використано в результаті аналізу.
  const statistics = summaryOperation(data, warning, critical, min, max);
  const firstCritical = findFirstCritical(data, critical, min, max);
  let firstCriticalPosition = null;

  if (firstCritical !== null) {
    firstCriticalPosition = firstCritical.position;
  }

  return {
    statistics: statistics,
    firstValid: findFirstValid(data, min, max),
    firstCritical: firstCritical,
    recoveryPosition: findRecovery(data, firstCriticalPosition, warning, min, max),
    invalidDetails: describeInvalidLevels(data, min, max)
  };
}

function createConclusion(result) {
  const statistics = result.statistics;

  if (statistics.validCount === 0) {
    return "Немає коректних вимірювань для висновку.";
  }

  if (statistics.criticalCount > 0) {
    if (result.recoveryPosition === null) {
      return `Кількість критичних вимірювань: ${statistics.criticalCount}; після першого з них серії з трьох безпечних вимірювань не виявлено.`;
    }

    return `Критичних вимірювань: ${statistics.criticalCount}. Після першого критичного три безпечні вимірювання поспіль завершилися на позиції ${result.recoveryPosition}.`;
  }

  if (statistics.warningCount > 0) {
    return `Критичних вимірювань немає; у категорії попередження — ${statistics.warningCount}.`;
  }

  return "Усі коректні вимірювання не перевищують порога попередження.";
}

// Лише ця функція представляє результати в Console.
function printReport(result, warning, critical, min, max) {
  const statistics = result.statistics;
  let averageText = formatLevel(null);

  if (statistics.average !== null) {
    // Округлення тільки для показу; statistics.average зберігає точний результат.
    averageText = formatLevel(statistics.average.toFixed(2));
  }

  console.group("Акустична варта — звіт моніторингу");
  console.log("Костюк Артем, група КН-42. Лабораторна робота №4.");
  console.log(`Навчальні пороги: попередження > ${warning} dB; критичний рівень > ${critical} dB.`);
  console.log(`Допустимий запис: скінченне число від ${min} до ${max} dB включно.`);
  console.log(`Усього вимірювань: ${statistics.totalCount}`);
  console.log(`Коректних: ${statistics.validCount}`);
  console.log(`Некоректних: ${statistics.invalidCount}`);
  console.log(`Сума коректних значень: ${statistics.sum}`);
  console.table({
    "Без перевищення": statistics.safeCount,
    "Попередження": statistics.warningCount,
    "Критичні": statistics.criticalCount
  });
  console.log(`Середній рівень: ${averageText}`);
  console.log(`Мінімальний рівень: ${formatLevel(statistics.minimum)}`);
  console.log(`Максимальний рівень: ${formatLevel(statistics.maximum)}`);

  if (result.firstValid === null) {
    console.log("Перше коректне вимірювання: не знайдено.");
  } else {
    console.log(`Перше коректне вимірювання: ${formatLevel(result.firstValid.value)}, позиція ${result.firstValid.position}.`);
  }

  if (result.firstCritical === null) {
    console.log("Перше критичне вимірювання: не знайдено.");
  } else {
    console.log(`Перше критичне вимірювання: ${formatLevel(result.firstCritical.value)}, позиція ${result.firstCritical.position}.`);
  }

  if (result.recoveryPosition === null) {
    console.log("Відновлення — три безпечні вимірювання поспіль після першого критичного: не знайдено.");
  } else {
    console.log(`Відновлення: третє безпечне вимірювання поспіль має позицію ${result.recoveryPosition}.`);
  }

  if (statistics.aboveWarningCount > 0) {
    console.warn(`Поріг ${warning} dB перевищено у ${statistics.aboveWarningCount} вимірюваннях (попередження разом із критичними).`);
  } else {
    console.log(`Перевищень порога ${warning} dB немає.`);
  }

  console.log(`Відхилені вхідні дані: ${result.invalidDetails}.`);
  console.log(`Висновок: ${createConclusion(result)}`);
  console.groupEnd();
}

// Передаємо Function Expression як значення — summarizeLevels, без дужок виклику.
const monitoringResult = analyzeMeasurements(
  noiseLevels,
  warningLevel,
  criticalLevel,
  minValidLevel,
  maxValidLevel,
  summarizeLevels
);

printReport(monitoringResult, warningLevel, criticalLevel, minValidLevel, maxValidLevel);

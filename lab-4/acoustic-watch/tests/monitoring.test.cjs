// Костюк Артем, КН-42. Окремий тестовий інструмент Node.js; до HTML не підключений.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../js/monitoring.js"), "utf8");
const messages = [];
const capturedConsole = {};
for (const method of ["log", "warn", "error", "table", "group", "groupEnd"]) {
  capturedConsole[method] = (...argumentsList) => messages.push({ method, argumentsList });
}
const context = vm.createContext({ console: capturedConsole });
vm.runInContext(source, context, { filename: "monitoring.js", timeout: 1000 });

function run(expression) {
  return vm.runInContext(expression, context, { timeout: 1000 });
}

function snapshot(expression) {
  return JSON.parse(JSON.stringify(run(expression)));
}

function analyze(dataLiteral) {
  return snapshot(`analyzeMeasurements(${dataLiteral}, 70, 85, 30, 130, summarizeLevels)`);
}

const original = [
  42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
  53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
  79, 39, 141, 86
];

test("Основний набір: незалежно задані кількості, сума, середнє, min/max і позиції", () => {
  const result = snapshot("monitoringResult");
  assert.deepEqual(result.statistics, {
    totalCount: 28, validCount: 26, invalidCount: 2, sum: 1778,
    average: 1778 / 26, minimum: 39, maximum: 95,
    safeCount: 13, warningCount: 9, criticalCount: 4, aboveWarningCount: 13
  });
  assert.deepEqual(result.firstValid, { value: 42, position: 1 });
  assert.deepEqual(result.firstCritical, { value: 91, position: 9 });
  assert.equal(result.recoveryPosition, null);
  assert.equal(result.invalidDetails, "позиція 22 (-1); позиція 27 (141)");
  assert.notEqual(result.statistics.average, 68.38, "Обчислення не повинно передчасно округляти середнє");
});

test("Порожній масив: відсутні обчислювані рівні та пошукові результати", () => {
  const result = analyze("[]");
  assert.deepEqual(result.statistics, {
    totalCount: 0, validCount: 0, invalidCount: 0, sum: 0,
    average: null, minimum: null, maximum: null,
    safeCount: 0, warningCount: 0, criticalCount: 0, aboveWarningCount: 0
  });
  assert.equal(result.firstValid, null);
  assert.equal(result.firstCritical, null);
  assert.equal(result.recoveryPosition, null);
});

test("Лише некоректні [-1,141]: min/max/average не стають довільними числами", () => {
  const result = analyze("[-1,141]");
  assert.equal(result.statistics.validCount, 0);
  assert.equal(result.statistics.invalidCount, 2);
  assert.equal(result.statistics.sum, 0);
  assert.equal(result.statistics.average, null);
  assert.equal(result.statistics.minimum, null);
  assert.equal(result.statistics.maximum, null);
  assert.equal(result.firstValid, null);
  assert.equal(result.firstCritical, null);
  assert.equal(result.recoveryPosition, null);
});

test("Точні межі [70,85,86]: три різні взаємовиключні категорії", () => {
  const result = analyze("[70,85,86]");
  assert.deepEqual(result.statistics, {
    totalCount: 3, validCount: 3, invalidCount: 0, sum: 241,
    average: 241 / 3, minimum: 70, maximum: 86,
    safeCount: 1, warningCount: 1, criticalCount: 1, aboveWarningCount: 2
  });
  assert.deepEqual(result.firstCritical, { value: 86, position: 3 });
  assert.equal(result.recoveryPosition, null);
});

test("Попередження перериває дві безпечні точки: відновлення лише на позиції7", () => {
  const result = analyze("[91,50,60,72,55,60,70]");
  assert.deepEqual(result.firstCritical, { value: 91, position: 1 });
  assert.equal(result.recoveryPosition, 7);
});

test("Некоректна точка також скидає серію, а не просто пропускається", () => {
  assert.equal(analyze("[91,50,60,-1,55,60,70]").recoveryPosition, 7);
});

test("Нова критична точка скидає попередню безпечну серію", () => {
  assert.equal(analyze("[91,50,60,86,55,60,70]").recoveryPosition, 7);
});

test("Без першої критичної точки поняття відновлення не застосовується", () => {
  const result = analyze("[50,60,70]");
  assert.equal(result.firstCritical, null);
  assert.equal(result.recoveryPosition, null);
});

test("Мінімальна успішна серія та її точна третя позиція", () => {
  assert.equal(analyze("[91,50,60,70]").recoveryPosition, 4);
  assert.equal(analyze("[91,70,70,70,91]").recoveryPosition, 4);
});

test("Дві безпечні точки або точки до критичної не означають відновлення", () => {
  assert.equal(analyze("[91,50,60]").recoveryPosition, null);
  assert.equal(analyze("[50,60,70,91]").recoveryPosition, null);
});

test("Number.isFinite не перетворює рядки/null; межі30 і130 включені", () => {
  const result = analyze('[29,30,130,131,NaN,Infinity,-Infinity,"70",null,undefined,true,false]');
  assert.equal(result.statistics.totalCount, 12);
  assert.equal(result.statistics.validCount, 2);
  assert.equal(result.statistics.invalidCount, 10);
  assert.equal(result.statistics.sum, 160);
  assert.equal(result.statistics.average, 80);
  assert.equal(result.statistics.minimum, 30);
  assert.equal(result.statistics.maximum, 130);
  assert.equal(run('isValidLevel("70",30,130)'), false);
  assert.equal(run("isValidLevel(NaN,30,130)"), false);
  assert.equal(run("isValidLevel(Infinity,30,130)"), false);
  assert.equal(run("isValidLevel(30,30,130)"), true);
  assert.equal(run("isValidLevel(130,30,130)"), true);
});

test("Min/max починаються з першого коректного після некоректного префікса", () => {
  const result = analyze("[141,-1,90,65,130]");
  assert.equal(result.statistics.minimum, 65);
  assert.equal(result.statistics.maximum, 130);
  assert.equal(result.statistics.average, 95);
  assert.deepEqual(result.firstValid, { value: 90, position: 3 });
  assert.deepEqual(result.firstCritical, { value: 90, position: 3 });
});

test("Високий некоректний запис не стає першим критичним", () => {
  const result = analyze("[141,85,91,95]");
  assert.deepEqual(result.firstCritical, { value: 91, position: 3 });
  assert.deepEqual(result.firstValid, { value: 85, position: 2 });
});

test("Пороги і допустимі межі беруться з аргументів, а не глобальних констант", () => {
  const result = snapshot("analyzeMeasurements([5,10,15],8,12,0,20,summarizeLevels)");
  assert.equal(result.statistics.validCount, 3);
  assert.equal(result.statistics.safeCount, 1);
  assert.equal(result.statistics.warningCount, 1);
  assert.equal(result.statistics.criticalCount, 1);
  assert.deepEqual(result.firstCritical, { value: 15, position: 3 });
});

test("Function Expression передається як синхронний callback і викликається один раз", () => {
  const result = snapshot(`(() => {
    let calls = 0;
    const callback = function (data, warning, critical, min, max) {
      calls++;
      return summarizeLevels(data, warning, critical, min, max);
    };
    const result = analyzeMeasurements([70,85,86],70,85,30,130,callback);
    return { calls: calls, criticalCount: result.statistics.criticalCount };
  })()`);
  assert.deepEqual(result, { calls: 1, criticalCount: 1 });
});

test("Обчислювальні функції нічого не друкують і не змінюють дані", () => {
  const messageCount = messages.length;
  assert.equal(run(`(() => {
    const data = [91,50,60,-1,55,60,70];
    const before = JSON.stringify(data);
    analyzeMeasurements(data,70,85,30,130,summarizeLevels);
    return JSON.stringify(data) === before;
  })()`), true);
  assert.deepEqual(snapshot("noiseLevels"), original);
  assert.equal(messages.length, messageCount);
});

test("Фінальний запуск друкує одну групу, точні результати й жодної фіктивної помилки", () => {
  assert.equal(messages.filter(message => message.method === "group").length, 1);
  assert.equal(messages.filter(message => message.method === "groupEnd").length, 1);
  assert.equal(messages.filter(message => message.method === "error").length, 0);
  const text = messages.map(message => message.argumentsList.join(" ")).join("\n");
  assert.match(text, /Середній рівень: 68\.38 dB/);
  assert.match(text, /Перше критичне вимірювання: 91 dB, позиція 9/);
  assert.match(text, /Поріг 70 dB перевищено у 13 вимірюваннях/);
  assert.match(text, /Костюк Артем, група КН-42/);
  assert.match(text, /позиція 22 \(-1\); позиція 27 \(141\)/);
});

test("Висновки розрізняють відсутні дані, безпечні, попередження та відновлення", () => {
  assert.match(run("createConclusion(analyzeMeasurements([],70,85,30,130,summarizeLevels))"), /Немає коректних/);
  assert.match(run("createConclusion(analyzeMeasurements([50,60],70,85,30,130,summarizeLevels))"), /не перевищують/);
  assert.match(run("createConclusion(analyzeMeasurements([70,85],70,85,30,130,summarizeLevels))"), /Критичних вимірювань немає/);
  assert.match(run("createConclusion(analyzeMeasurements([91,50,60,70],70,85,30,130,summarizeLevels))"), /позиції 4/);
});

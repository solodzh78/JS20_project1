/* 
1) Функцию showTypeof и вызов функции удаляем 
2) В объект appData добавить свойство budget которое будет принимать значение money
3) В объект appData добавить свойства budgetDay, budgetMonth и expensesMonth, изначально равные нулю
4) Функции getExpensesMonth, getAccumulatedMonth, getTargetMonth, getStatusIncome - сделать методами объекта AppData
5) После этого поправить весь проект, чтобы он работал, а именно
Везде где вызывались наши функции поправить обращение через объект, например
let expensesMonth = appData.getExpensesMonth(); 
6) Сразу после объекта выполните вызов appData.asking();
7) Перенести цикл из метода getExpensesMonth в метод asking, 
и переписать цикл таким образом чтобы результат записывался в объект  appData.expenses
в формате:
expenses: {
    “ответ на первый вопрос” : “ответ на второй вопрос”,
    “ответ на первый вопрос” : “ответ на второй вопрос”
}
временные условия которые мы писали
if (i === 0) {
    expenses1 = prompt('Введите обязательную статью расходов?', 'Кварплата');
} else {
    expenses2 = prompt('Введите обязательную статью расходов?', 'Бензин');
}
уже не нужны, вопрос задается каждый цикл
Обратите внимание Если на вопрос "Введите обязательную статью расходов?" ответить 2 раза одинаково, 
значения свойства просто будут перезаписаны, для проверки отвечайте всегда по разному. (очень частая ошибка)
Проследите чтобы тип данных значения свойств были числом!
Пример результата:
expenses: {
    “Квартплата” : 5000,
    “Детский сад” : 2000
}
8) Переписать метод getExpensesMonth: 
с помощью цикла считаем сумму всех обязательных расходов 
и сохраняем результат в свойство expensesMonth нашего объекта для того, 
чтобы посчитать сумму используйте цикл for in
9) getAccumulatedMonth переименовать в getBudget. 
Этот метод будет высчитывать значения свойств budgetMonth и budgetDay, 
чтобы вычислить значения используем только свойства объекта (никаких внешних переменных)
10) В методах getTargetMonth и getStatusIncome исправить переменные, все значения получаем от нашего объекта appData
11) Вызвать все необходимые методы после объекта, чтобы корректно считались все данные (порядок очень важен).
12) В консоль вывести: 
    — Расходы за месяц
    — За какой период будет достигнута цель (в месяцах)
    — Уровень дохода
Все остальное почистить в программе у нас всего две переменных money и appData
И две функции start и возможно isNumber
13) Используя цикл for in для объекта (appData), 
вывести в консоль сообщение "Наша программа включает в себя данные: " (вывести все свойства и значения)
14) Проверить, чтобы все работало и не было ошибок в консоли
15) Добавить папку с уроком в свой репозиторий на GitHub
*/

'use strict';

// ==============================================Объявление функций=========================
// Объявить функцию isNumber
let isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);

// Переписать функцию start циклом do while
const start = function(title, defaultValue = '') {
  let tempVar;
  do {
    tempVar = prompt(title, defaultValue);
  } while (!isNumber(tempVar));
  return +tempVar;
};

// ============================================Тело===========================================
// =====================================Объявление переменных=================================
let money = start('Ваш месячный доход?', '60000');
let appData = {
  budget: '', // Доход в месяц
  income: {}, // Дополнительный доход в месяц
  addincome: [], 
  expenses: {}, // Обязательные расходы
  addExpenses: [], // Дополнительные расходы
  deposit: false, // Депозит
  mission: 1000000, // Цель
  period: 12, // Период, месяцев
  budgetDay: 0, // Доходы минус расходы в день
  budgetMonth: 0, // Доходы минус расходы в месяц
  expensesMonth: 0, // Сумма обязательных расходов в месяц
  asking: function() {
    // Обязательные расходы
    let key, value;
    for (let i = 0; i < 2; i++) {
      key = prompt('Введите обязательную статью расходов?').trim();
      value = start('Во сколько это обойдется?', '10000');
      appData.expenses[key] = value;
    }
    // Депозит
    appData.deposit = confirm('Есть ли у вас депозит в банке?');
    // Дополнительные расходы
    appData.addExpenses = prompt(
      'Перечислите возможные расходы за рассчитываемый период через запятую',
      'интернет, такси, коммуналка, курсы повышения квалификации'
    ).toLowerCase().split(',').map((item)=>item.trim());
  },
  // Сумма обязательных расходов в месяц
  getExpensesMonth: function() {
    let sum = 0;
    for (let key in appData.expenses) {
      sum += appData.expenses[key];
    }
    appData.expensesMonth = sum;
  }, 
  // Доходы минус расходы в месяц и в день
  getBudget: function() {
    appData.budgetMonth = appData.budget - appData.expensesMonth;
    appData.budgetDay = Math.floor(appData.budgetMonth/30);
  }, 
  // Время достижения цели, месяцев
  getTargetMonth: function() {
      return Math.ceil(appData.mission/appData.budgetMonth);
  },
  // Уровень доходов в месяц
  getStatusIncome: function() {
  
    if (appData.budgetDay < 0) {
      return 'Что то пошло не так';
    } else if (appData.budgetDay > 1200) {
      return 'У вас высокий уровень дохода';
    } else if (appData.budgetDay > 600) {
      return 'У вас средний уровень дохода';
    } else {
      return 'К сожалению у вас уровень дохода ниже среднего';
    }
  },
};

// ============================================Расчеты====================================

appData.budget = money;

// Запрос у пользователя обязательных и дополнительных расходов, наличие депозита
appData.asking();

// Сумма обязательных расходов вызов метода getExpensesMonth
appData.getExpensesMonth();

// Доходы минус расходы в месяц и в день вызов метода getBudget
appData.getBudget();

// Расходы за месяц 
console.log('Обязательные расходы за месяц: ' + appData.expensesMonth);

// Cрок достижения цели в месяцах (результат вызова ьетода getTargetMonth)
console.log(appData.budgetMonth > 0 
  ? `Цель будет достигнута за ${appData.getTargetMonth()} месяцев` 
  : 'С таким бюджетом цель недостижима'
);

// Уровень доходов в день, вызов метода getStatusIncome
console.log('Ваш уровень доходов в день:', appData.budgetDay);
console.log(appData.getStatusIncome());

// Вывод в консоль объекта appData
console.log('================================================================');
console.log('Наша программа включает в себя данные:');
for (let key in appData) {
  console.log(key, ':', appData[key]);
}
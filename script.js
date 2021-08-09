/* 
получить каждый элемент в отдельную переменную:
  Кнопку "Рассчитать" через id
  Кнопки “+” (плюс) через Tag, каждую в своей переменной. 
  Чекбокс по id через querySelector
  Поля для ввода возможных доходов (additional_income-item) при помощи querySelectorAll
  Каждый элемент в правой части программы через класс(не через querySelector), 
  которые имеют в имени класса "-value", начиная с class="budget_day-value" и заканчивая class="target_month-value">
  Оставшиеся поля через querySelector каждый в отдельную переменную:
  поля ввода (input) с левой стороны и не забудьте про range.
*/

'use strict';

// ==============================================Объявление функций=========================
// Объявить функцию isNumber
const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);

// Функция проверки isText
const isText = (n) => {
  if (typeof n !== 'string') {
    return false;
} else if (parseFloat(n)) {
    return false;
} else if (n.trim() === '') {
    return false;
} else {return true;}
};

// Переписать функцию start циклом do while
const start = function(title, defaultValue = '', callback = isNumber) {
  let tempVar;
  do {
    tempVar = prompt(title, defaultValue);
  } while (!callback(tempVar));
  return tempVar;
};

// ============================================Тело===========================================
// =====================================Объявление переменных=================================

const startButton = document.getElementById('start');
console.log('startButton: ', startButton);
const buttons = document.getElementsByTagName('button');
console.log('buttons: ', buttons);
const incomePlusButton = buttons[0];
const expensesPlusButton = buttons[1];
const depositCheckBox = document.querySelector('#deposit-check');
console.log('depositCheckBox: ', depositCheckBox);

const resultRight = document.querySelectorAll('[class$=-value]');
console.log('resultRight: ', resultRight);

const budgetMonth = document.getElementsByClassName('budget_month-value')[0];
const budgetDay = document.getElementsByClassName('budget_day-value')[0];
const expensesMonth = document.getElementsByClassName('expenses_month-value')[0];
const addIncome = document.getElementsByClassName('additional_income-value')[0];
const addExpenses = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriod = document.getElementsByClassName('income_period-value')[0];
const targetMonth = document.getElementsByClassName('target_month-value')[0];

const dataLeft = document.querySelector("body > section > div > div.data");
console.log('dataLeft: ', dataLeft);
const salaryAmount = dataLeft.querySelector('.salary-amount');
const incomeTitle = dataLeft.querySelector('.income-title');
const incomeAmount = dataLeft.querySelector('.income-amount');
const additionalIncomeItem1 = dataLeft.querySelectorAll('.additional_income-item')[0];
const additionalIncomeItem2 = dataLeft.querySelector('.additional_income-item')[1];
const expensesTitle = dataLeft.querySelector('.expenses-title');
const expensesAmount = dataLeft.querySelector('.expenses-amount');
const additionalExpensesItem = dataLeft.querySelector('.additional_expenses-item');
const targetAmount = dataLeft.querySelector('.target-amount');
const periodSelect = dataLeft.querySelector('.period-select');
console.log('periodSelect: ', periodSelect);

const periodAmount = dataLeft.querySelector('.period-amount');
console.log('periodAmount: ', periodAmount);







/* let money = +start('Ваш месячный доход?', '60000');
let appData = {
  budget: '', // Доход в месяц
  income: {}, // Дополнительный доход в месяц
  addincome: [], 
  expenses: {}, // Обязательные расходы
  addExpenses: [], // Дополнительные расходы
  deposit: false, // Депозит
  percentDeposit: 0,
  moneyDeposit: 0,
  mission: 1000000, // Цель
  period: 12, // Период, месяцев
  budgetDay: 0, // Доходы минус расходы в день
  budgetMonth: 0, // Доходы минус расходы в месяц
  expensesMonth: 0, // Сумма обязательных расходов в месяц
  asking: function() {
    // Дополнительный доход в месяц
    if ( confirm('Есть ли у вас доплнительный источник дохода?') ) {
      let itemIncome = start('Какой у вас есть дополнительный заработок?', 'Администрирование', isText).trim();
      let moneyIncome = +start('Сколько вы зарабатываете на этом в месяц', '10000');
      appData.income[itemIncome] = moneyIncome;
    }
    // Обязательные расходы
    for (let i = 0; i < 2; i++) {
      let key = start('Введите обязательную статью расходов?', '', isText).trim();
      let value = +start('Во сколько это обойдется?', '10000');
      appData.expenses[key] = value;
    }
    // Депозит
    appData.getDepositInfo();
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

    appData.budgetMonth = (
      appData.budget - appData.expensesMonth + 
      (Object.values(appData.income)[0] ? Object.values(appData.income)[0] : 0) + 
      (appData.deposit ? Math.floor(appData.moneyDeposit * appData.percentDeposit / 100 / 12) : 0)
    );
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
  // Запрос данных по депозиту
  getDepositInfo: function() {
    appData.deposit = confirm('Есть ли у вас депозит в банке?');
    if (appData.deposit) {
      appData.moneyDeposit = +start('Какая сумма у вас находится на депозите?', '100000');
      appData.percentDeposit = +start('Под какой процент?', '10');
    }
  },
  // Сколько денег можно накопить за период
  calcSavedMoney: () => appData.budgetMonth * appData.period,
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

// Возможные расходы (addExpenses) вывести строкой в консоль каждое слово 
// с большой буквы слова разделены запятой и пробелом
// Пример (Интернет, Такси, Коммунальные расходы)

const printAddExpenses = () => {
  let sum = '';
  appData.addExpenses.forEach((value, index) => {
    sum += value.substring(0, 1).toUpperCase() + value.substring(1, value.length);

    if (index !== appData.addExpenses.length - 1) {
      sum += ', ';
    }
  });
  
  console.log('Дополнительные расходы:', sum);
};
printAddExpenses(); */
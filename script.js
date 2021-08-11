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
const getItem = function(title, defaultValue = '', callback = isNumber) {
  let tempVar;
  do {
    tempVar = prompt(title, defaultValue);
  } while (!callback(tempVar));
  return tempVar;
};

// ============================================Тело===========================================
// =====================================Объявление переменных=================================

let startButton = document.getElementById('start'),
      buttons = document.getElementsByTagName('button'),
      incomePlusButton = buttons[0],
      expensesPlusButton = buttons[1],
      depositCheckBox = document.querySelector('#deposit-check'),
      resultRight = document.querySelectorAll('[class$=-value]'),
      budgetMonth = document.getElementsByClassName('budget_month-value')[0],
      budgetDay = document.getElementsByClassName('budget_day-value')[0],
      expensesMonth = document.getElementsByClassName('expenses_month-value')[0],
      additionalIncome = document.getElementsByClassName('additional_income-value')[0],
      addExpenses = document.getElementsByClassName('additional_expenses-value')[0],
      incomePeriod = document.getElementsByClassName('income_period-value')[0],
      targetMonth = document.getElementsByClassName('target_month-value')[0],
      dataLeft = document.querySelector("body > section > div > div.data"),
      salaryAmount = dataLeft.querySelector('.salary-amount'),
      // incomeTitle = dataLeft.querySelector('.income-title'),
      // incomeAmount = dataLeft.querySelector('.income-amount'),
      additionalIncomeItems = dataLeft.querySelectorAll('.additional_income-item'),
      expensesTitle = dataLeft.querySelector('.expenses-title'),
      expensesAmount = dataLeft.querySelector('.expenses-amount'),
      expensesItems = document.querySelectorAll('.expenses-items'),
      additionalExpensesItem = dataLeft.querySelector('.additional_expenses-item'),
      targetAmount = dataLeft.querySelector('.target-amount'),
      periodSelect = dataLeft.querySelector('.period-select'),
      periodAmount = dataLeft.querySelector('.period-amount'),
      incomeItems = document.querySelector('.income-items');







let appData = {
  budget: '', // Доход в месяц
  income: {}, // Дополнительный доход в месяц
  addIncome: [], 
  expenses: {}, // Обязательные расходы
  addExpenses: [], // Дополнительные расходы
  deposit: false, // Депозит
  percentDeposit: 0,
  moneyDeposit: 0,
  budgetDay: 0, // Доходы минус расходы в день
  budgetMonth: 0, // Доходы минус расходы в месяц
  expensesMonth: 0, // Сумма обязательных расходов в месяц

  // =========================================== start ===================================

  start: function() {
    //appData.money = +getItem('Ваш месячный доход?', '60000');

    if (salaryAmount.value === '') {
      alert('Ошибка! Поле "Месячный доход" должно быть заплнено!');
      return;
    }
    appData.budget = salaryAmount.value;

    appData.getExpenses();
    appData.getIncome();
    appData.getExpensesMonth();
    appData.getAddExpenses();
    appData.getAddIncome();
    appData.getBudget();

    appData.showResult();

  },
  showResult: function() {
    budgetMonth.value = appData.budgetMonth;
    budgetDay.value = appData.budgetDay;
    expensesMonth.value = appData.expensesMonth;
    addExpenses.value = appData.addExpenses.join(', ');
    additionalIncome.value = appData.addIncome.join(', ');
    targetMonth.value = appData.getTargetMonth();
    periodSelect.value = appData.calcSavedMoney();
  },
  addExpensesBlock: function() {

    const cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlusButton);
    expensesItems = document.querySelectorAll('.expenses-items');

    if (expensesItems.length === 3) {
      expensesPlusButton.style.display = 'none';
    }
  },
  getExpenses: function() {
    expensesItems.forEach(function(item) {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;

      if (itemExpenses !== '' && cashExpenses !== '') {
        appData.expenses[itemExpenses] = cashExpenses;
      }

    });
  },
  getIncome: function() {
    incomeItems.forEach(function(item) {
      let incomeTitle = item.querySelector('.income-title').value;
      let incomeAmount = item.querySelector('.income-amount').value;

      if (incomeTitle !== '' && incomeAmount !== '') {
        appData.expenses[incomeAmount] = incomeAmount;
      }
    });
    
    for (let key in appData.income) {
      appData.incomeMonth += +appData.income[key];
    }

  },
  getAddExpenses: function() {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();

      if (item !== '') {
        appData.addExpenses.push(item);
      }
    });
  },
  getAddIncome: function() {
    additionalIncomeItems.forEach(function(item) {
      const itemValue = item.value.trim();

      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    });
  },
  asking: function() {
    // Дополнительный доход в месяц
    if ( confirm('Есть ли у вас доплнительный источник дохода?') ) {
      let itemIncome = getItem('Какой у вас есть дополнительный заработок?', 'Администрирование', isText).trim();
      let moneyIncome = +getItem('Сколько вы зарабатываете на этом в месяц', '10000');
      appData.income[itemIncome] = moneyIncome;
    }
    // Обязательные расходы

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
      return Math.ceil(targetAmount.value / appData.budgetMonth);
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
      appData.moneyDeposit = +getItem('Какая сумма у вас находится на депозите?', '100000');
      appData.percentDeposit = +getItem('Под какой процент?', '10');
    }
  },
  // Сколько денег можно накопить за период
  calcSavedMoney: () => appData.budgetMonth * periodSelect.value,
};
// =========================================== appData ===================================

// let money = +getItem('Ваш месячный доход?', '60000');

startButton.addEventListener('click', appData.start);
expensesPlusButton.addEventListener('click', appData.addExpensesBlock);


// ============================================Расчеты====================================

// Запрос у пользователя обязательных и дополнительных расходов, наличие депозита
// appData.asking();

// Сумма обязательных расходов вызов метода getExpensesMonth
// appData.getExpensesMonth();

// Доходы минус расходы в месяц и в день вызов метода getBudget
// appData.getBudget();

// Расходы за месяц 
// console.log('Обязательные расходы за месяц: ' + appData.expensesMonth);

// Cрок достижения цели в месяцах (результат вызова ьетода getTargetMonth)
// console.log(appData.budgetMonth > 0 
//   ? `Цель будет достигнута за ${appData.getTargetMonth()} месяцев` 
//   : 'С таким бюджетом цель недостижима'
// );

// Уровень доходов в день, вызов метода getStatusIncome
// console.log('Ваш уровень доходов в день:', appData.budgetDay);
// console.log(appData.getStatusIncome());

// // Вывод в консоль объекта appData
// console.log('================================================================');
// console.log('Наша программа включает в себя данные:');
// for (let key in appData) {
//   console.log(key, ':', appData[key]);
// }

// // Возможные расходы (addExpenses) вывести строкой в консоль каждое слово 
// // с большой буквы слова разделены запятой и пробелом
// // Пример (Интернет, Такси, Коммунальные расходы)

// const printAddExpenses = () => {
//   let sum = '';
//   appData.addExpenses.forEach((value, index) => {
//     sum += value.substring(0, 1).toUpperCase() + value.substring(1, value.length);

//     if (index !== appData.addExpenses.length - 1) {
//       sum += ', ';
//     }
//   });
  
//   console.log('Дополнительные расходы:', sum);
// };
// printAddExpenses();
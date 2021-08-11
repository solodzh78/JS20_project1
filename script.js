'use strict';

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
      additionalIncomeItems = dataLeft.querySelectorAll('.additional_income-item'),
      expensesTitle = dataLeft.querySelector('.expenses-title'),
      expensesAmount = dataLeft.querySelector('.expenses-amount'),
      expensesItems = document.querySelectorAll('.expenses-items'),
      additionalExpensesItem = dataLeft.querySelector('.additional_expenses-item'),
      targetAmount = dataLeft.querySelector('.target-amount'),
      periodSelect = dataLeft.querySelector('.period-select'),
      periodAmount = dataLeft.querySelector('.period-amount'),
      incomeItems = document.querySelectorAll('.income-items');
const inputText = document.querySelectorAll('[placeholder="Наименование"]');
const inputNumber = document.querySelectorAll('[placeholder="Сумма"]');

// =========================== appData ================================
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
  incomeMonth: 0, // Сумма дополнительных доходов в месяц

  // =========================================== start ===================================
  start: function() {
    appData.budget = +salaryAmount.value;
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
    incomePeriod.value = appData.calcSavedMoney();

    periodSelect.addEventListener('input', () => {
      incomePeriod.value = appData.calcSavedMoney();
    });
  },
  addExpensesBlock: function() {
    const cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.children[0].value = '';
    cloneExpensesItem.children[1].value = '';
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
        appData.expenses[itemExpenses] = +cashExpenses;
      }
    });
  },
  addIncomeBlock: function () {
    const cloneIncomeItem = incomeItems[0].cloneNode(true);
    cloneIncomeItem.children[0].value = '';
    cloneIncomeItem.children[1].value = '';
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlusButton);
    incomeItems = document.querySelectorAll('.income-items');

    if (incomeItems.length === 3) {
      incomePlusButton.style.display = 'none';
    }
  },
  getIncome: function() {
    incomeItems.forEach(function(item) {
      let incomeTitle = item.querySelector('.income-title').value;
      let incomeAmount = item.querySelector('.income-amount').value;

      if (incomeTitle !== '' && incomeAmount !== '') {
        appData.income[incomeTitle] = +incomeAmount;
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
      appData.budget + appData.incomeMonth - appData.expensesMonth + 
      (appData.deposit ? Math.floor(appData.moneyDeposit * 
                          appData.percentDeposit / 100 / 12) : 0)
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
  // getDepositInfo: function() {
  //   appData.deposit = confirm('Есть ли у вас депозит в банке?');
  //   if (appData.deposit) {
  //     appData.moneyDeposit = +getItem('Какая сумма у вас находится на депозите?', '100000');
  //     appData.percentDeposit = +getItem('Под какой процент?', '10');
  //   }
  // },
  // Сколько денег можно накопить за период
  calcSavedMoney: () => appData.budgetMonth * periodSelect.value,
};
// ===================== конец appData ================================
// ======================== События ===================================

salaryAmount.addEventListener('input', () => {

  if (salaryAmount.value === '') {
    startButton.removeEventListener('click', appData.start);
  } else {
    startButton.addEventListener('click', appData.start);
  }
});

expensesPlusButton.addEventListener('click', appData.addExpensesBlock);
incomePlusButton.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('input', () => {
  periodAmount.textContent = periodSelect.value;
});
inputText.forEach(item => {
  item.addEventListener('input', () => {
    item.value = item.value.replace(/[^ а-яёъА-ЯЁЪ]/, '');
  });
});
inputNumber.forEach(item => {
  item.addEventListener('input', () => {
    item.value = item.value.replace(/[^0-9]/, '');
  });
});
'use strict';

// ============================================Тело===========================================
// =====================================Объявление переменных=================================

let startButton = document.getElementById('start'),
      resetButton = document.getElementById('cancel'),
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

// =========================== appData ================================

const AppData = function() {

  this.budget = '';         // Доход в месяц
  this.income = {};         // Дополнительный доход в месяц
  this.addIncome = [];      // Возможные доходы 
  this.expenses = {};       // Обязательные расходы
  this.addExpenses = [];    // Дополнительные расходы
  this.deposit = false;     // Депозит
  this.percentDeposit = 0;  // Проценты по депозит    
  this.moneyDeposit = 0;    // Сумма депозита  
  this.budgetDay = 0;       // Доходы минус расходы в день
  this.budgetMonth = 0;     // Доходы минус расходы в месяц
  this.expensesMonth = 0;   // Сумма обязательных расходов в месяц
  this.incomeMonth = 0;     // Сумма дополнительных доходов в месяц
};

AppData.prototype.check = () => {
  if (salaryAmount.value === '') {
    startButton.setAttribute('disabled', true);
    return;
  } else {
    startButton.removeAttribute('disabled');
  }
};
AppData.prototype.start = function() {
  let textFields = document.querySelectorAll('.data input[type="text"]');
  textFields.forEach(item => { item.setAttribute('disabled', true); });
  depositCheckBox.setAttribute('disabled', true);
  expensesPlusButton.setAttribute('disabled', true);
  incomePlusButton.setAttribute('disabled', true);

  startButton.style.display = 'none';
  resetButton.style.display = 'inline-block';

  this.budget = +salaryAmount.value;
  this.getExpenses();
  this.getIncome();
  this.getExpensesMonth();
  this.getAddExpenses();
  this.getAddIncome();
  this.getDepositInfo();
  this.getBudget();

  this.showResult();
};
AppData.prototype.reset = function() {
  this.clearAppData();
  this.clearFormFilds();
  this.removeExpensesBlock();
  this.removeIncomeBlock();
  this.removeRangeListener();
  this.resetAddPlusBtn();
};
AppData.prototype.clearAppData = function() {
    this.budget = '';
    this.income = {};
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.incomeMonth = 0;
};
AppData.prototype.clearFormFilds = () => {
  document.querySelectorAll('.result-total').forEach(item => { item.value = ''; });
  dataLeft = document.querySelector('div.data');
  let textFields = dataLeft.querySelectorAll('input[type="text"]');
  textFields.forEach(item => {
    item.removeAttribute('disabled');
    item.value = '';
  });
  depositCheckBox.removeAttribute('disabled');
  periodSelect.value = 1;
  periodAmount.textContent = 1;
  depositCheckBox.checked = false;
};
AppData.prototype.removeRangeListener = function() {
  periodSelect.removeEventListener('input', () => {
    incomePeriod.value = this.calcSavedMoney();
  });
};
AppData.prototype.resetAddPlusBtn = function() {
  expensesPlusButton.style.display = 'inline-block';
  expensesPlusButton.removeAttribute('disabled');
  incomePlusButton.style.display = 'inline-block';
  incomePlusButton.removeAttribute('disabled');
};
// =============================== ShowResult=====================
AppData.prototype.showResult = function() {
  budgetMonth.value = this.budgetMonth;
  budgetDay.value = this.budgetDay;
  expensesMonth.value = this.expensesMonth;
  addExpenses.value = this.addExpenses.join(', ');
  additionalIncome.value = this.addIncome.join(', ');
  targetMonth.value = this.getTargetMonth();
  incomePeriod.value = this.calcSavedMoney();

  periodSelect.addEventListener('input', () => {
    incomePeriod.value = this.calcSavedMoney();
  });
};
AppData.prototype.addExpensesBlock = function() {
  const cloneExpensesItem = expensesItems[0].cloneNode(true);
  this.inputFilter(cloneExpensesItem);
  cloneExpensesItem.children[0].value = '';
  cloneExpensesItem.children[1].value = '';
  expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlusButton);
  expensesItems = document.querySelectorAll('.expenses-items');

  if (expensesItems.length === 3) {
    expensesPlusButton.style.display = 'none';
  }
};
AppData.prototype.removeExpensesBlock = function () {
  const expensesItems = document.querySelectorAll('.expenses-items');
  for (let i = 1; i < expensesItems.length; i++) {
    expensesItems[i].remove();
  }
};
AppData.prototype.getExpenses = function() {
  const expensesItems = document.querySelectorAll('.expenses-items');
  expensesItems.forEach(item => {
    let itemExpenses = item.querySelector('.expenses-title').value;
    let cashExpenses = item.querySelector('.expenses-amount').value;
    if (itemExpenses !== '' && cashExpenses !== '') {
      this.expenses[itemExpenses] = +cashExpenses;
    }
  });
};
AppData.prototype.addIncomeBlock = function () {
  const cloneIncomeItem = incomeItems[0].cloneNode(true);
  this.inputFilter(cloneIncomeItem);
  cloneIncomeItem.children[0].value = '';
  cloneIncomeItem.children[1].value = '';
  incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlusButton);
  incomeItems = document.querySelectorAll('.income-items');

  if (incomeItems.length === 3) {
    incomePlusButton.style.display = 'none';
  }
};
AppData.prototype.removeIncomeBlock = () => {
  const incomeItems = document.querySelectorAll('.income-items');
  for (let i = 1; i < incomeItems.length; i++) {
    incomeItems[i].remove();
  }
};
AppData.prototype.getIncome = function() {
  const incomeItems = document.querySelectorAll('.income-items');
  incomeItems.forEach(item => {
    let incomeTitle = item.querySelector('.income-title').value;
    let incomeAmount = item.querySelector('.income-amount').value;

    if (incomeTitle !== '' && incomeAmount !== '') {
      this.income[incomeTitle] = +incomeAmount;
    }
  });
  
  for (let key in this.income) {
    this.incomeMonth += +this.income[key];
  }
};
AppData.prototype.getAddExpenses = function() {
  let addExpenses = additionalExpensesItem.value.split(',');
  addExpenses.forEach(item => {
    item = item.trim();

    if (item !== '') {
      this.addExpenses.push(item);
    }
  });
};
AppData.prototype.getAddIncome = function() {
  additionalIncomeItems.forEach(item => {
    const itemValue = item.value.trim();

    if (itemValue !== '') {
      this.addIncome.push(itemValue);
    }
  });
};
// Сумма обязательных расходов в месяц
AppData.prototype.getExpensesMonth = function() {
  let sum = 0;
  for (let key in this.expenses) {
    sum += this.expenses[key];
  }
  this.expensesMonth = sum;
}; 
// Доходы минус расходы в месяц и в день
AppData.prototype.getBudget = function() {
  this.budgetMonth = (
    this.budget + this.incomeMonth - this.expensesMonth + 
    (this.deposit ? Math.floor(this.moneyDeposit * this.percentDeposit / 100 / 12) : 0)
  );
  this.budgetDay = Math.floor(this.budgetMonth/30);
}; 
// Время достижения цели, месяцев
AppData.prototype.getTargetMonth = function() {
  return Math.ceil(targetAmount.value / this.budgetMonth);
};
// Уровень доходов в месяц
AppData.prototype.getStatusIncome = function() {

  if (this.budgetDay < 0) {
    return 'Что то пошло не так';
  } else if (this.budgetDay > 1200) {
    return 'У вас высокий уровень дохода';
  } else if (this.budgetDay > 600) {
    return 'У вас средний уровень дохода';
  } else {
    return 'К сожалению у вас уровень дохода ниже среднего';
  }
};
// Депозит
AppData.prototype.getDepositInfo = function() {
  if (this.deposit) {
    do {
      this.percentDeposit = prompt('Какой процент?', '10');
    } while (isNaN(this.percentDeposit) || this.percentDeposit === ' ' || 
                    this.percentDeposit === '' || this.percentDeposit === null);
    do {
      this.moneyDeposit = prompt('Какая сумма у вас находится на депозите?', '100000');
    } while (isNaN(this.moneyDeposit) || this.moneyDeposit === ' ' || 
                    this.moneyDeposit === '' || this.moneyDeposit === null);
  }
};
// Сколько денег можно накопить за период
AppData.prototype.calcSavedMoney = function () { 
  return this.budgetMonth * periodSelect.value;
};
AppData.prototype.inputFilter = elem => {
  const inputText = elem.querySelectorAll('[placeholder="Наименование"]');
  const inputNumber = elem.querySelectorAll('[placeholder="Сумма"]');
  // Только текст кириллица
  inputText.forEach(item => {
    item.addEventListener('input', () => {
      item.value = item.value.replace(/[^ а-яёъА-ЯЁЪ]/, '');
    });
  });
  // Только цифры
  inputNumber.forEach(item => {
    item.addEventListener('input', () => {
      item.value = item.value.replace(/[^0-9]/, '');
    });
  });
};
AppData.prototype.addEventListeners = function() {
  // ======================== События ===================================
  // Кнопка Расчитать
  startButton.addEventListener('click', () => {this.start();});
  // Кнопка Сбросить
  resetButton.addEventListener('click', () => {
    resetButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    this.reset();
  });
  // Кнопка +расходы
  expensesPlusButton.addEventListener('click', () => {this.addExpensesBlock();});
  // Кнопка +доходы
  incomePlusButton.addEventListener('click', () => {this.addIncomeBlock();});
  // Input range
  periodSelect.addEventListener('input', () => {
    periodAmount.textContent = periodSelect.value;
  });
  salaryAmount.addEventListener('input', () => {this.check();});
};
AppData.prototype.init = function() {
  this.addEventListeners();
  this.inputFilter(document);
  this.check();
};

const appData = new AppData();
console.log(appData);
appData.init();
// ===================== конец appData ================================
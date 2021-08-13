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

AppData.prototype.check = function() {
  if (salaryAmount.value !== '') {
    startButton.removeAttribute('disabled');
  }
};
AppData.prototype.startBind = function() {
  appData.start();
  startButton.style.display = 'none';
  resetButton.style.display = 'inline-block';
  dataLeft = document.querySelector('div.data');
  let textFields = dataLeft.querySelectorAll('input[type="text"]');
  textFields.forEach(function(item) { item.setAttribute('disabled', true); });
  depositCheckBox.setAttribute('disabled', true);
};
AppData.prototype.start = function() {

  if (salaryAmount.value === '') {
    startButton.setAttribute('disabled', true);
    return;
  }
  let textFields = document.querySelectorAll('input[type="text"]');
  textFields.forEach(function(item) { item.setAttribute('disabled', true); });
  depositCheckBox.setAttribute('disabled', true);
  expensesPlusButton.removeEventListener('click', this.addExpensesBlock);
  incomePlusButton.removeEventListener('click', this.addIncomeBlock);

  startButton.style.display = 'none';
  resetButton.style.display = 'inline-block';

  this.budget = +salaryAmount.value;
  this.getExpenses();
  this.getIncome();
  this.getExpensesMonth();
  this.getAddExpenses();
  this.getAddIncome();
  this.getBudget();

  this.showResult();
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
      incomePeriod.value = appData.calcSavedMoney();
    });
  };
  AppData.prototype.addExpensesBlock = function() {
    const cloneExpensesItem = expensesItems[0].cloneNode(true);
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
    expensesItems.forEach(function(item) {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        this.expenses[itemExpenses] = +cashExpenses;
      }
    }.bind(this));
  };
  AppData.prototype.addIncomeBlock = function () {
    const cloneIncomeItem = incomeItems[0].cloneNode(true);
    cloneIncomeItem.children[0].value = '';
    cloneIncomeItem.children[1].value = '';
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlusButton);
    incomeItems = document.querySelectorAll('.income-items');

    if (incomeItems.length === 3) {
      incomePlusButton.style.display = 'none';
    }
  };
  AppData.prototype.removeIncomeBlock = function () {
    const incomeItems = document.querySelectorAll('.income-items');
    for (let i = 1; i < incomeItems.length; i++) {
      incomeItems[i].remove();
    }
  };
  AppData.prototype.getIncome = function() {
    const incomeItems = document.querySelectorAll('.income-items');
    incomeItems.forEach(function(item) {
      let incomeTitle = item.querySelector('.income-title').value;
      let incomeAmount = item.querySelector('.income-amount').value;

      if (incomeTitle !== '' && incomeAmount !== '') {
        this.income[incomeTitle] = +incomeAmount;
      }
    }.bind(this));
    
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  };
  AppData.prototype.getAddExpenses = function() {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();

      if (item !== '') {
        this.addExpenses.push(item);
      }
    }.bind(this));
  };
  AppData.prototype.getAddIncome = function() {
    additionalIncomeItems.forEach(function(item) {
      const itemValue = item.value.trim();

      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    }.bind(this));
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
      (this.deposit ? Math.floor(this.moneyDeposit * 
                          this.percentDeposit / 100 / 12) : 0)
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
  // Запрос данных по депозиту
  // getDepositInfo: function() {
  //   appData.deposit = confirm('Есть ли у вас депозит в банке?');
  //   if (appData.deposit) {
  //     appData.moneyDeposit = +getItem('Какая сумма у вас находится на депозите?', '100000');
  //     appData.percentDeposit = +getItem('Под какой процент?', '10');
  //   }
  // },
  // Сколько денег можно накопить за период
  AppData.prototype.calcSavedMoney = function () { 
    return this.budgetMonth * periodSelect.value;
  };




const appData = new AppData();
console.log(appData);





// ===================== конец appData ================================
// ======================== События ===================================
// Кнопка Расчитать
/* salaryAmount.addEventListener('input', () => {

  if (salaryAmount.value === '') {
    startButton.removeEventListener('click', appData.startBind);
  } else {
    startButton.addEventListener('click', appData.startBind);
  }
});
// Кнопка Сбросить
resetButton.addEventListener('click', function() {
  resetButton.style.display = 'none';
  startButton.style.display = 'inline-block';
  appData.reset();
});

// Кнопка +расходы
expensesPlusButton.addEventListener('click', appData.addExpensesBlock);
// Кнопка +доходы
incomePlusButton.addEventListener('click', appData.addIncomeBlock);
// Input range
periodSelect.addEventListener('input', () => {
  periodAmount.textContent = periodSelect.value;
});
function inputFilter(elem){
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
}
inputFilter(document); */
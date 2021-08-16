'use strict';

// ============================================Тело===========================================
// =====================================Объявление переменных=================================
let   dataLeft = document.querySelector("body > section > div > div.data");

const startButton = document.getElementById('start'),
      resetButton = document.getElementById('cancel'),
      incomePlusButton = document.getElementsByTagName('button')[0],
      expensesPlusButton = document.getElementsByTagName('button')[1],
      depositCheckBox = document.querySelector('#deposit-check'),
      budgetMonth = document.getElementsByClassName('budget_month-value')[0],
      budgetDay = document.getElementsByClassName('budget_day-value')[0],
      expensesMonth = document.getElementsByClassName('expenses_month-value')[0],
      additionalIncome = document.getElementsByClassName('additional_income-value')[0],
      addExpenses = document.getElementsByClassName('additional_expenses-value')[0],
      incomePeriod = document.getElementsByClassName('income_period-value')[0],
      targetMonth = document.getElementsByClassName('target_month-value')[0],
      salaryAmount = dataLeft.querySelector('.salary-amount'),
      additionalIncomeItems = dataLeft.querySelectorAll('.additional_income-item'),
      expensesItems = document.querySelectorAll('.expenses-items'),
      additionalExpensesItem = dataLeft.querySelector('.additional_expenses-item'),
      targetAmount = dataLeft.querySelector('.target-amount'),
      periodSelect = dataLeft.querySelector('.period-select'),
      periodAmount = dataLeft.querySelector('.period-amount'),
      incomeItems = document.querySelectorAll('.income-items');

// =========================== appData ================================

class AppData {
  constructor() {
    this.budget = ''; // Доход в месяц
    this.income = {}; // Дополнительный доход в месяц
    this.addIncome = []; // Возможные доходы 
    this.expenses = {}; // Обязательные расходы
    this.addExpenses = []; // Дополнительные расходы
    this.deposit = false; // Депозит
    this.percentDeposit = 0; // Проценты по депозит    
    this.moneyDeposit = 0; // Сумма депозита  
    this.budgetDay = 0; // Доходы минус расходы в день
    this.budgetMonth = 0; // Доходы минус расходы в месяц
    this.expensesMonth = 0; // Сумма обязательных расходов в месяц
    this.incomeMonth = 0; // Сумма дополнительных доходов в месяц
  }
  check() {
    if (salaryAmount.value === '') {
      startButton.setAttribute('disabled', true);
      return;
    } else {
      startButton.removeAttribute('disabled');
    }
  }
  start() {
    const textFields = document.querySelectorAll('.data input[type="text"]');
    textFields.forEach(item => { item.setAttribute('disabled', true); });
    depositCheckBox.setAttribute('disabled', true);
    expensesPlusButton.setAttribute('disabled', true);
    incomePlusButton.setAttribute('disabled', true);
    startButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
    this.budget = +salaryAmount.value;
    this.getIncExp('expenses');
    this.getIncExp('income');
    this.getExpensesMonth();
    this.getAddIncExp('expenses');
    this.getAddIncExp('income');
    this.getDepositInfo();
    this.getBudget();
    this.showResult();
  }
  reset() {
    this.clearAppData();
    this.clearFormFilds();
    this.removeIncExpBlock('expenses');
    this.removeIncExpBlock('income');
    this.removeRangeListener();
    this.resetAddPlusBtn();
  }
  clearAppData() {
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
  }
  clearFormFilds() {
    document.querySelectorAll('.result-total').forEach(item => { item.value = ''; });
    dataLeft = document.querySelector('div.data');
    const textFields = dataLeft.querySelectorAll('input[type="text"]');
    textFields.forEach(item => {
      item.removeAttribute('disabled');
      item.value = '';
    });
    depositCheckBox.removeAttribute('disabled');
    periodSelect.value = 1;
    periodAmount.textContent = 1;
    depositCheckBox.checked = false;
  }
  removeRangeListener() {
    periodSelect.removeEventListener('input', () => {
      incomePeriod.value = this.calcSavedMoney();
    });
  }
  resetAddPlusBtn() {
    expensesPlusButton.style.display = 'inline-block';
    expensesPlusButton.removeAttribute('disabled');
    incomePlusButton.style.display = 'inline-block';
    incomePlusButton.removeAttribute('disabled');
  }
  // =============================== ShowResult=====================
  showResult() {
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
  }
  addIncExpBlock(mode) {
    let items,
        plusButton;
    if (mode === 'income') {
      items = incomeItems;
      plusButton = incomePlusButton;
    } else if (mode === 'expenses') {
      items = expensesItems;
      plusButton = expensesPlusButton;
    } else {return;}

    const cloneItem = items[0].cloneNode(true);
    cloneItem.children[0].value = '';
    cloneItem.children[1].value = '';

    items[0].parentNode.insertBefore(cloneItem, plusButton);
    items = document.querySelectorAll(`.${mode}-items`);

    if (items.length === 3) {
      plusButton.style.display = 'none';
    }
  }

  removeIncExpBlock(mode) {
    const items = document.querySelectorAll(`.${mode}-items`);
    for (let i = 1; i < items.length; i++) {
      items[i].remove();
    }
  }

  getIncExp(mode) {
    const items = document.querySelectorAll(`.${mode}-items`);
    items.forEach(item => {
      let itemTitle = item.querySelector(`.${mode}-title`).value;
      let itemCash = item.querySelector(`.${mode}-amount`).value;

      if (itemTitle !== '' && itemCash !== '') {
        
        if (mode === 'income') {
          console.log(this.income[itemTitle]);
          console.log(itemTitle);
          console.log(this);
          this.income[itemTitle] = +itemCash;
        } else if (mode === 'expenses') {
          this.expenses[itemTitle] = +itemCash;
        }
      }
    });
  }

  getAddIncExp(mode) {
    let addItems,
        out;

    if (mode === 'expenses') {
      addItems = additionalExpensesItem.value.split(',');
      out = this.addExpenses;
    } else if (mode === 'income') {
      addItems = [].map.call(additionalIncomeItems, function(obj) {
        return obj.value;
      });
      out = this.addIncome;
    }    
    addItems.forEach(item => {
      item = item.trim();

      if (item !== '') {
        out.push(item);
      }
    });
  }

  // Сумма обязательных расходов в месяц
  getExpensesMonth() {
    let sum = 0;
    for (let key in this.expenses) {
      sum += this.expenses[key];
    }
    this.expensesMonth = sum;
  }
  // Доходы минус расходы в месяц и в день
  getBudget() {
    this.budgetMonth = (
      this.budget + this.incomeMonth - this.expensesMonth +
      (this.deposit ? Math.floor(this.moneyDeposit * this.percentDeposit / 100 / 12) : 0)
    );
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }
  // Время достижения цели, месяцев
  getTargetMonth() {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  }
  // Уровень доходов в месяц
  getStatusIncome() {

    if (this.budgetDay < 0) {
      return 'Что то пошло не так';
    } else if (this.budgetDay > 1200) {
      return 'У вас высокий уровень дохода';
    } else if (this.budgetDay > 600) {
      return 'У вас средний уровень дохода';
    } else {
      return 'К сожалению у вас уровень дохода ниже среднего';
    }
  }
  // Депозит
  getDepositInfo() {
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
  }
  // Сколько денег можно накопить за период
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }
  inputFilter(elem) {
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
  addEventListeners() {
    // ======================== События ===================================
    // Кнопка Расчитать
    startButton.addEventListener('click', () => { this.start(); });
    // Кнопка Сбросить
    resetButton.addEventListener('click', () => {
      resetButton.style.display = 'none';
      startButton.style.display = 'inline-block';
      this.reset();
    });
    // Кнопка +расходы
    expensesPlusButton.addEventListener('click', () => { this.addIncExpBlock('expenses'); });
    // Кнопка +доходы
    incomePlusButton.addEventListener('click', () => { this.addIncExpBlock('income'); });
    // Input range
    periodSelect.addEventListener('input', () => {
      periodAmount.textContent = periodSelect.value;
    });
    salaryAmount.addEventListener('input', () => { this.check(); });
  }
  init() {
    this.addEventListeners();
    this.inputFilter(document);
    this.check();
  }
}

const appData = new AppData();
console.log(appData);
appData.init();
// ===================== конец appData ================================
'use strict';

// ============================================Тело===========================================
// =====================================Объявление переменных=================================
// var targetMonthValue = document.getElementsByClassName('target_month-value')[0];
const startButton = document.getElementById('start'),
      resetButton = document.getElementById('cancel'),
      incomePlusButton = document.getElementsByTagName('button')[0],
      expensesPlusButton = document.getElementsByTagName('button')[1],
      depositCheckBox = document.querySelector('#deposit-check'),
      budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
      budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
      expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
      additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
      additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
      targetMonthValue = document.getElementsByClassName('target_month-value')[0],
      incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
      dataLeft = document.querySelector("body > section > div > div.data"),
      salaryAmount = dataLeft.querySelector('.salary-amount'),
      additionalIncomeItems = dataLeft.querySelectorAll('.additional_income-item'),
      additionalExpensesItem = dataLeft.querySelector('.additional_expenses-item'),
      targetAmount = dataLeft.querySelector('.target-amount'),
      periodSelect = dataLeft.querySelector('.period-select'),
      periodAmount = dataLeft.querySelector('.period-amount'),
      dataRigth = document.querySelectorAll('.result-total'),
      depositBank = document.querySelector('.deposit-bank'),
      depositAmount = document.querySelector('.deposit-amount'),
      depositPercent = document.querySelector('.deposit-percent');

// =========================== appData ================================

class AppData {
  constructor() {  
    this.budgetMonthValue = budgetMonthValue;
    this.budgetDayValue = budgetDayValue;
    this.expensesMonthValue = expensesMonthValue;
    this.additionalIncomeValue = additionalIncomeValue;
    this.additionalExpensesValue = additionalExpensesValue;
    this.targetMonthValue = targetMonthValue;
    this.budgetMonthValue = budgetMonthValue;

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
      startButton.disabled = true;
      return;
    } else {
      startButton.disabled = false;
    }
  }
  inProcessing() {
    const textFields = document.querySelectorAll('.data input[type="text"]');
    textFields.forEach(item => { item.disabled = true; });
    depositCheckBox.disabled = true;
    depositBank.disabled = true;
    expensesPlusButton.disabled = true;
    incomePlusButton.disabled = true;
    startButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
  }
  start() {
    this.inProcessing();
    this.budget = +salaryAmount.value;
    this.getIncExp('expenses');
    this.getIncExp('income');
    this.getAddIncExp('expenses');
    this.getAddIncExp('income');
    this.getDepositInfo();
    this.getBudget();
    this.showResult();
    this.setLocalStorage();
  }
  // =====================================================================================
  setLocalStorage() {
    dataRigth.forEach(item => {
      const record = item.classList[1].split('-')[0].split('_');
      const record1 = record[0] + record[1][0].toUpperCase() + record[1].slice(1) + 'Value';
      localStorage[record1] = item.value;
    });
    localStorage.isLoaded = true;
  }
  clearLocalStorage() {
    dataRigth.forEach(item => {
      const record = item.classList[1].split('-')[0].split('_');
      const record1 = record[0] + record[1][0].toUpperCase() + record[1].slice(1) + 'Value';
      localStorage.removeItem(record1);
    });
    localStorage.removeItem('isLoaded');
  }
  reset() {
    this.clearAppData();
    this.clearFormFilds();
    this.removeIncExpBlock('expenses');
    this.removeIncExpBlock('income');
    this.removeRangeListener();
    this.resetAddPlusBtn();
    this.clearLocalStorage();
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
    dataRigth.forEach(item => { item.value = ''; });
    const textFields = document.querySelectorAll('div.data input[type="text"]');
    textFields.forEach(item => {
      item.disabled = false;
      item.value = '';
    });
    depositCheckBox.disabled = false;
    depositBank.disabled = false;
    periodSelect.value = 1;
    periodAmount.textContent = 1;
    depositCheckBox.checked = false;
    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    depositPercent.style.display = 'none';
  }
  removeRangeListener() {
    periodSelect.removeEventListener('input', () => {
      incomePeriodValue.value = this.calcSavedMoney();
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
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();

    periodSelect.addEventListener('input', () => {
      incomePeriodValue.value = this.calcSavedMoney();
    });
  }
  addIncExpBlock(mode) {
    let items,
        plusButton;
    if (mode === 'income') {
      items = document.querySelectorAll('.income-items');
      plusButton = incomePlusButton;
    } else if (mode === 'expenses') {
      items = document.querySelectorAll('.expenses-items');
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
    let sum = 0;
    items.forEach(item => {
      let itemTitle = item.querySelector(`.${mode}-title`).value;
      let itemCash = item.querySelector(`.${mode}-amount`).value;

      if (itemTitle !== '' && itemCash !== '') {
        
        if (mode === 'income') {
          this.income[itemTitle] = +itemCash;
        } else if (mode === 'expenses') {
          this.expenses[itemTitle] = +itemCash;
        }
        sum += +itemCash;
      }
    });
    if (mode === 'income') {
      this.incomeMonth = sum;
    } else if (mode === 'expenses') {
      this.expensesMonth = sum;
    }
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
  depositHandler() {
    if (depositCheckBox.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);

    }
  }
  changePercent() {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      // Home
      depositPercent.style.display = 'inline-block';
      depositPercent.value = '';

    } else {
      depositPercent.value = valueSelect;
      depositPercent.style.display = 'none';

    }
  }
  getDepositInfo() {
    if (this.deposit === true) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;

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
    // Чекбокс депозит
    depositCheckBox.addEventListener('change', () => {this.depositHandler();});
    depositPercent.addEventListener('input', () => {
      depositPercent.value = depositPercent.value.replace(/[^0-9]/, '');
      if (depositPercent.value < 0 || depositPercent.value > 100) {
        alert('Введите корректное значение в поле проценты');
        depositPercent.value = 0;
      }
    });
  }
  init() {
    this.addEventListeners();
    this.inputFilter(document);
    console.log(localStorage.isLoaded);
    
    if (localStorage.isLoaded === 'true') {
      budgetMonthValue.value = localStorage.budgetMonthValue;      
      budgetDayValue.value = localStorage.budgetDayValue;
      expensesMonthValue.value = localStorage.expensesMonthValue;
      additionalExpensesValue.value = localStorage.additionalExpensesValue;
      additionalIncomeValue.value = localStorage.additionalIncomeValue;
      targetMonthValue.value = localStorage.targetMonthValue;
      incomePeriodValue.value = localStorage.incomePeriodValue;
      this.inProcessing();
    } else {
      this.check();
      depositCheckBox.checked = false;
      depositBank.value = '';
      depositAmount.value = '';
    }

    }
}

const appData = new AppData();
console.log(appData);
appData.init();
// ===================== конец appData ================================

// console.dir(appData['targetMonthValue']);

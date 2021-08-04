/* 
1) Переписать функцию start циклом do while
2) Добавить проверку что введённые данные являются числом, 
которые мы получаем на вопрос 'Во сколько это обойдется?’ в функции  getExpensesMonth
3) Если getTargetMonth возвращает нам отрицательное значение, 
то вместо “Цель будет достигнута” необходимо выводить “Цель не будет достигнута”
4) Проверить, чтобы все работало и не было ошибок в консоли
5) Добавить папку с уроком в свой репозиторий на GitHub
*/
'use strict';

// Объявить функцию getAccumulatedMonth
const getAccumulatedMonth = function (income, expenses) {
  return income - expenses;
};
// Объявить функцию getTargetMonth
const getTargetMonth = function (target, time) {
  return Math.ceil(target/time);
};
// Объявить функцию showTypeOf
const showTypeOf = function (x) {
  return typeof x;
};
// Объявить функцию getStatusIncome
const getStatusIncome = function (income) {
  
  if (income < 0) {
    return 'Что то пошло не так';
  } else if (income > 1200) {
    return 'У вас высокий уровень дохода';
  } else if (income > 600) {
    return 'У вас средний уровень дохода';
  } else {
    return 'К сожалению у вас уровень дохода ниже среднего';
  }
};
// Объявить функцию isNumber
let isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// Переписать функцию start циклом do while
const start = function (title, defaultValue = '') {
  let variable1;
  do {
    variable1 = prompt(title, defaultValue);
  } while (!isNumber(variable1));
  return variable1;
};

// Объявить функцию getExpensesMonth
// n - количество статей расходов
const getExpensesMonth = function (n) {
  let arr = [
    [0, 0], 
    [0, 0]
  ];
  // for (let i = 0; i < n; i++) {
    arr[0][0] = 'кино';
    // prompt('Введите обязательную статью расходов?');
    arr[1][1] = start('Во сколько это обойдется?');
  // }
  return arr;
};


// Объявление переменных
let money = start('Ваш месячный доход?', '60000');
let income = 'Администрирование';
let addExpenses = prompt(
    'Перечислите возможные расходы за рассчитываемый период через запятую',
    'интернет, такси, коммуналка, курсы повышения квалификации');
let deposit = confirm('Есть ли у вас депозит в банке?'); 
let mission = 1000000, period = 12;

let expensesMonth = getExpensesMonth(2);
console.log('expensesMonth: ', expensesMonth);

// let expenses1 = prompt('Введите обязательную статью расходов?', 'кофе');
// let amount1 = Number(prompt('Во сколько это обойдется?', 10000)) || 0;
// let expenses2 = prompt('Введите обязательную статью расходов?', 'пончик');
// let amount2 = Number(prompt('Во сколько это обойдется?', 20000)) || 0;

// Объявить переменную accumulatedMonth и присвоить ей результат вызова функции getAccumulatedMonth
let accumulatedMonth = getAccumulatedMonth(money, 2000);

// budgetDay высчитываем исходя из значения месячного накопления (accumulatedMonth)
let budgetDay = Math.floor(accumulatedMonth/30);

// вызовы функции showTypeOf
console.log('typeof money: ', showTypeOf(money));
console.log('typeof income: ', showTypeOf(income));
console.log('typeof deposit: ', showTypeOf(deposit));
console.log('typeof accumulatedMonth: ', showTypeOf(accumulatedMonth));

// Расходы за месяц вызов getExpensesMonth
// console.log('Расходы за месяц: ' + getExpensesMonth(amount1, amount2));

// Вывод возможных расходов в виде массива (addExpenses)
addExpenses = addExpenses.toLowerCase().split(',').map((item)=>item.trim());
console.log('Дополнительные расходы: ', addExpenses);

// Cрок достижения цели в месяцах (результат вызова функции getTargetMonth)
console.log(accumulatedMonth > 0 ? `Цель будет достигнута за ${getTargetMonth(mission, accumulatedMonth)} месяцев` 
                            : 'С таким бюджетом цель недостижима');

// Бюджет на день (budgetDay)
console.log('Бюджет на день: ', budgetDay);

// вызов функции getStatusIncome
console.log(getStatusIncome(budgetDay));
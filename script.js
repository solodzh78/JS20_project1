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

// ==============================================Объявление функций=========================
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
  let tempVariable;
  do {
    tempVariable = prompt(title, defaultValue);
  } while (!isNumber(tempVariable));
  return +tempVariable;
};

// Объявить функцию getExpensesMonth
// n - количество статей расходов
const getExpensesMonth = function (n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push([]);
    arr[i][0] = prompt('Введите обязательную статью расходов?');
    arr[i][1] = start('Во сколько это обойдется?');
  }
  return arr;
};

// Функция расчета суммы обязательных расходов
let getExpensesMonthSum = function (arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i][1];
  }
  return sum;
};

// ============================================Тело==================================
// Объявление переменных
let money = start('Ваш месячный доход?', '60000');
let income = 'Администрирование';
let addExpenses = prompt(
    'Перечислите возможные расходы за рассчитываемый период через запятую',
    'интернет, такси, коммуналка, курсы повышения квалификации');
let deposit = confirm('Есть ли у вас депозит в банке?'); 
let mission = 1000000, period = 12;

// Массив обязательных расходов
let expensesMonth = getExpensesMonth(2);
// Сумма обязательных расходов вызов getExpensesMonthSum
let expensesMonthSum = getExpensesMonthSum(expensesMonth);

// Объявить переменную accumulatedMonth и присвоить ей результат вызова функции getAccumulatedMonth
let accumulatedMonth = getAccumulatedMonth(money, expensesMonthSum);

// budgetDay высчитываем исходя из значения месячного накопления (accumulatedMonth)
let budgetDay = Math.floor(accumulatedMonth/30);

// вызовы функции showTypeOf
console.log('typeof money: ', showTypeOf(money));
console.log('typeof income: ', showTypeOf(income));
console.log('typeof deposit: ', showTypeOf(deposit));
console.log('typeof accumulatedMonth: ', showTypeOf(accumulatedMonth));

// Расходы за месяц 
console.log('Обязательные расходы за месяц: ' + expensesMonthSum);

// Вывод возможных расходов в виде массива (addExpenses)
addExpenses = addExpenses.toLowerCase().split(',').map((item)=>item.trim());
console.log('Дополнительные расходы: ', addExpenses);

// Бюджет на день (budgetDay)
console.log('Бюджет на день: ', budgetDay);

// Cрок достижения цели в месяцах (результат вызова функции getTargetMonth)
console.log(accumulatedMonth > 0 ? `Цель будет достигнута за ${getTargetMonth(mission, accumulatedMonth)} месяцев` 
                            : 'С таким бюджетом цель недостижима');

// вызов функции getStatusIncome
console.log(getStatusIncome(budgetDay));
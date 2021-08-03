/* 
1) Объявить функцию getExpensesMonth. Функция возвращает сумму всех обязательных расходов за месяц
2) Объявить функцию getAccumulatedMonth. Функция возвращает Накопления за месяц (Доходы минус расходы)
3) Объявить переменную accumulatedMonth и присвоить ей результат вызова функции getAccumulatedMonth 
4) Объявить функцию getTargetMonth. Подсчитывает за какой период будет достигнута цель, 
    зная результат месячного накопления (accumulatedMonth) и возвращает результат
5) Удалить из кода переменную budgetMonth
6) budgetDay высчитываем исходя из значения месячного накопления (accumulatedMonth)
7) Почистить консоль логи и добавить недостающие, должны остаться:
- вызовы функции showTypeOf
- Расходы за месяц вызов getExpensesMonth
- Вывод возможных расходов в виде массива (addExpenses)
- Cрок достижения цели в месяцах (результат вызова функции getTargetMonth) 
- Бюджет на день (budgetDay)
- вызов функции getStatusIncome
8) Проверить, чтобы все работало и не было ошибок в консоли
9) Добавить папку с четвертым уроком в свой репозиторий на GitHub
*/
'use strict';

// Объявить функцию getExpensesMonth
const getExpensesMonth = function (am1, am2) {
  return am1 + am2;
};
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

// Объявление переменных
let money = Number(prompt('Ваш месячный доход?', '60000')) || 0;
let income = 'Администрирование';
let addExpenses = prompt(
    'Перечислите возможные расходы за рассчитываемый период через запятую',
    'интернет, такси, коммуналка, курсы повышения квалификации');
let deposit = confirm('Есть ли у вас депозит в банке?'); 
let expenses1 = prompt('Введите обязательную статью расходов?', 'кофе');
let amount1 = Number(prompt('Во сколько это обойдется?', 10000)) || 0;
let expenses2 = prompt('Введите обязательную статью расходов?', 'пончик');
let amount2 = Number(prompt('Во сколько это обойдется?', 20000)) || 0;
let mission = 1000000, period = 12;

// Объявить переменную accumulatedMonth и присвоить ей результат вызова функции getAccumulatedMonth
let accumulatedMonth = getAccumulatedMonth(money, getExpensesMonth(amount1, amount2));

// budgetDay высчитываем исходя из значения месячного накопления (accumulatedMonth)
let budgetDay = Math.floor(accumulatedMonth/30);

// вызовы функции showTypeOf
console.log('typeof money: ', showTypeOf(money));
console.log('typeof income: ', showTypeOf(income));
console.log('typeof deposit: ', showTypeOf(deposit));
console.log('typeof accumulatedMonth: ', showTypeOf(accumulatedMonth));

// Расходы за месяц вызов getExpensesMonth
console.log('Расходы за месяц: ' + getExpensesMonth(amount1, amount2));

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
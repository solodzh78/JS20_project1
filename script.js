/* 
1) Следующим переменным присвоить значения
- money - любое число “Доход за месяц”,
- income - строка с дополнительными доходом (например: фриланс),
- addExpenses - строка с перечислением дополнительных расходов через запятую (например: интернет, такси, коммуналка),
- deposit - любое булево значение,
- mission - любое число (Какую сумму хотите накопить),
- period - число от 1 до 12 (месяцев)
2) Используя методы и свойства:
*- Вывести в консоль тип данных значений переменных money, income, deposit;
*- Вывести в консоль длину строки addExpenses
*- Вывести в консоль “Период равен (period) месяцев” и “Цель заработать (mission) рублей/долларов/гривен/юани”
*- Привести строку addExpenses к нижнему регистру и разбить строку на массив, вывести массив в консоль
*- Объявить переменную budgetDay и присвоить дневной бюджет (доход за месяц / 30)
*- Вывести в консоль budgetDay
3) Проверить, чтобы все работало и не было ошибок в консоли
4) Добавить папку или ветку со вторым уроком в свой репозиторий на GitHub
*/

let money = prompt('Ваш месячный доход?', '60000');
let income = 'Администрирование';
let addExpenses = prompt(
    'Перечислите возможные расходы за рассчитываемый период через запятую',
    'интернет, такси, коммуналка, курсы повышения квалификации');
let deposit = confirm('Есть ли у вас депозит в банке?'); 
let expenses1 = prompt('Введите обязательную статью расходов?');
let amount1 = prompt('Во сколько это обойдется?');
let expenses2 = prompt('Введите обязательную статью расходов?');
let amount2 = prompt('Во сколько это обойдется?');
let budgetMonth = money - amount1 - amount2;
let mission = 1000000, period = 12;
console.log('budgetMonth: ', budgetMonth);
console.log(`Цель будет достигнута за ${Math.ceil(mission/budgetMonth)} месяцев`);

console.log('typeof money: ', typeof money);
console.log('typeof income: ', typeof income);
console.log('typeof deposit: ', typeof deposit);
console.log('addExpenses.length: ', addExpenses.length);
console.log(`Период равен ${period} месяцев`);
console.log(`Цель заработать ${mission} рублей`);
addExpenses = addExpenses.toLowerCase().split(', ');
console.log('addExpenses: ', addExpenses);
let budgetDay = Math.floor(budgetMonth/30);
console.log('budgetDay: ', budgetDay);
// Задание 2 принято
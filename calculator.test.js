import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from './calculator.js';

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('Конструктор и начальное состояние', () => {
        it('должен инициализироваться с currentInput = "0"', () => {
            expect(calculator.getCurrentInput()).toBe('0');
        });

        it('должен инициализироваться с shouldResetDisplay = false', () => {
            expect(calculator.shouldResetDisplay).toBe(false);
        });
    });

    describe('appendNumber', () => {
        it('должен заменить "0" на переданное число', () => {
            calculator.appendNumber('5');
            expect(calculator.getCurrentInput()).toBe('5');
        });

        it('должен добавить число к существующему вводу', () => {
            calculator.appendNumber('5');
            calculator.appendNumber('3');
            expect(calculator.getCurrentInput()).toBe('53');
        });

        it('должен сбросить ввод, если shouldResetDisplay = true', () => {
            calculator.currentInput = '10';
            calculator.shouldResetDisplay = true;
            calculator.appendNumber('7');
            expect(calculator.getCurrentInput()).toBe('7');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен обрабатывать несколько цифр подряд', () => {
            calculator.appendNumber('1');
            calculator.appendNumber('2');
            calculator.appendNumber('3');
            calculator.appendNumber('4');
            expect(calculator.getCurrentInput()).toBe('1234');
        });
    });

    describe('appendDecimal', () => {
        it('должен добавить точку к числу', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('5.');
        });

        it('не должен добавлять вторую точку', () => {
            calculator.appendNumber('5');
            calculator.appendDecimal();
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('5.');
        });

        it('должен добавить точку к "0"', () => {
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('0.');
        });

        it('должен сбросить ввод, если shouldResetDisplay = true', () => {
            calculator.currentInput = '10';
            calculator.shouldResetDisplay = true;
            calculator.appendDecimal();
            expect(calculator.getCurrentInput()).toBe('0.');
            expect(calculator.shouldResetDisplay).toBe(false);
        });
    });

    describe('appendOperator', () => {
        it('должен добавить оператор к числу', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            expect(calculator.getCurrentInput()).toBe('5+');
        });

        it('должен заменить существующий оператор новым', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.appendOperator('-');
            expect(calculator.getCurrentInput()).toBe('5-');
        });

        it('должен обрабатывать все операторы', () => {
            const operators = ['+', '-', '*', '/'];
            calculator.appendNumber('5');
            
            operators.forEach(op => {
                calculator.appendOperator(op);
                expect(calculator.getCurrentInput()).toContain(op);
            });
        });

        it('должен сбросить shouldResetDisplay при добавлении оператора', () => {
            calculator.shouldResetDisplay = true;
            calculator.appendOperator('+');
            expect(calculator.shouldResetDisplay).toBe(false);
        });
    });

    describe('calculate', () => {
        describe('Положительные сценарии', () => {
            it('должен выполнить простое сложение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('8');
                expect(calculator.getCurrentInput()).toBe('8');
            });

            it('должен выполнить вычитание', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('-');
                calculator.appendNumber('3');
                const result = calculator.calculate();
                expect(result).toBe('7');
            });

            it('должен выполнить умножение', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('4');
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен выполнить деление', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('5');
            });

            it('должен обработать умножение с символом ×', () => {
                calculator.currentInput = '5×4';
                const result = calculator.calculate();
                expect(result).toBe('20');
            });

            it('должен выполнить сложные вычисления', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('+');
                calculator.appendNumber('5');
                calculator.appendOperator('*');
                calculator.appendNumber('2');
                const result = calculator.calculate();
                expect(result).toBe('20'); // 10 + 5 * 2 = 20
            });

            it('должен обработать десятичные числа', () => {
                calculator.appendNumber('5');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('2');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(result).toBe('8');
            });

            it('должен обработать отрицательные числа', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('-');
                calculator.appendNumber('10');
                const result = calculator.calculate();
                expect(result).toBe('-5');
            });

            it('должен установить shouldResetDisplay в true после вычисления', () => {
                calculator.appendNumber('5');
                calculator.appendOperator('+');
                calculator.appendNumber('3');
                calculator.calculate();
                expect(calculator.shouldResetDisplay).toBe(true);
            });
        });

        describe('Отрицательные сценарии', () => {
            it('должен вернуть "Ошибка" при делении на ноль', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
                expect(calculator.getCurrentInput()).toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при делении на ноль в сложном выражении', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('+');
                calculator.appendNumber('5');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('не должен считать деление на 0.0 как ошибку', () => {
                calculator.appendNumber('10');
                calculator.appendOperator('/');
                calculator.appendNumber('0');
                calculator.appendDecimal();
                calculator.appendNumber('5');
                const result = calculator.calculate();
                expect(result).not.toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при невалидном выражении', () => {
                calculator.currentInput = '5++3';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при пустом выражении', () => {
                calculator.currentInput = '';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен вернуть "Ошибка" при выражении только с оператором', () => {
                calculator.currentInput = '+';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обработать Infinity как ошибку', () => {
                calculator.currentInput = '1/0';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });

            it('должен обработать NaN как ошибку', () => {
                calculator.currentInput = 'undefined + 5';
                const result = calculator.calculate();
                expect(result).toBe('Ошибка');
            });
        });
    });

    describe('clearDisplay', () => {
        it('должен сбросить currentInput на "0"', () => {
            calculator.appendNumber('123');
            calculator.clearDisplay();
            expect(calculator.getCurrentInput()).toBe('0');
        });

        it('должен установить shouldResetDisplay в false', () => {
            calculator.shouldResetDisplay = true;
            calculator.clearDisplay();
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен очистить любое значение', () => {
            calculator.currentInput = '999.999';
            calculator.clearDisplay();
            expect(calculator.getCurrentInput()).toBe('0');
        });
    });

    describe('deleteLast', () => {
        it('должен удалить последний символ', () => {
            calculator.appendNumber('123');
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('12');
        });

        it('должен установить "0", если остался один символ', () => {
            calculator.appendNumber('5');
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('0');
        });

        it('должен вызвать clearDisplay, если shouldResetDisplay = true', () => {
            calculator.currentInput = '10';
            calculator.shouldResetDisplay = true;
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('0');
            expect(calculator.shouldResetDisplay).toBe(false);
        });

        it('должен удалить оператор', () => {
            calculator.appendNumber('5');
            calculator.appendOperator('+');
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('5');
        });

        it('должен обработать удаление из "0"', () => {
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('0');
        });
    });

    describe('add', () => {
        it('должен сложить два положительных числа', () => {
            expect(calculator.add(5, 3)).toBe(8);
        });

        it('должен сложить положительное и отрицательное число', () => {
            expect(calculator.add(5, -3)).toBe(2);
        });

        it('должен сложить два отрицательных числа', () => {
            expect(calculator.add(-5, -3)).toBe(-8);
        });

        it('должен сложить ноль с числом', () => {
            expect(calculator.add(5, 0)).toBe(5);
        });

        it('должен обработать десятичные числа', () => {
            expect(calculator.add(5.5, 2.3)).toBeCloseTo(7.8);
        });
    });

    describe('subtract', () => {
        it('должен вычесть два положительных числа', () => {
            expect(calculator.subtract(5, 3)).toBe(2);
        });

        it('должен вычесть отрицательное число', () => {
            expect(calculator.subtract(5, -3)).toBe(8);
        });

        it('должен вычесть из отрицательного числа', () => {
            expect(calculator.subtract(-5, 3)).toBe(-8);
        });

        it('должен вычесть ноль', () => {
            expect(calculator.subtract(5, 0)).toBe(5);
        });

        it('должен обработать десятичные числа', () => {
            expect(calculator.subtract(5.5, 2.3)).toBeCloseTo(3.2);
        });

        it('должен вернуть отрицательный результат', () => {
            expect(calculator.subtract(3, 5)).toBe(-2);
        });
    });

    describe('multiply', () => {
        it('должен умножить два положительных числа', () => {
            expect(calculator.multiply(5, 3)).toBe(15);
        });

        it('должен умножить положительное и отрицательное число', () => {
            expect(calculator.multiply(5, -3)).toBe(-15);
        });

        it('должен умножить два отрицательных числа', () => {
            expect(calculator.multiply(-5, -3)).toBe(15);
        });

        it('должен умножить на ноль', () => {
            expect(calculator.multiply(5, 0)).toBe(0);
        });

        it('должен обработать десятичные числа', () => {
            expect(calculator.multiply(5.5, 2)).toBeCloseTo(11);
        });
    });

    describe('divide', () => {
        describe('Положительные сценарии', () => {
            it('должен разделить два положительных числа', () => {
                expect(calculator.divide(10, 2)).toBe(5);
            });

            it('должен разделить положительное на отрицательное', () => {
                expect(calculator.divide(10, -2)).toBe(-5);
            });

            it('должен разделить отрицательное на положительное', () => {
                expect(calculator.divide(-10, 2)).toBe(-5);
            });

            it('должен разделить два отрицательных числа', () => {
                expect(calculator.divide(-10, -2)).toBe(5);
            });

            it('должен обработать десятичные числа', () => {
                expect(calculator.divide(10.5, 2.5)).toBeCloseTo(4.2);
            });

            it('должен вернуть результат меньше единицы', () => {
                expect(calculator.divide(1, 2)).toBe(0.5);
            });
        });

        describe('Отрицательные сценарии - деление на ноль', () => {
            it('должен выбросить ошибку при делении на ноль', () => {
                expect(() => calculator.divide(10, 0)).toThrow('Деление на ноль невозможно');
            });

            it('должен выбросить ошибку при делении отрицательного числа на ноль', () => {
                expect(() => calculator.divide(-10, 0)).toThrow('Деление на ноль невозможно');
            });

            it('должен выбросить ошибку при делении нуля на ноль', () => {
                expect(() => calculator.divide(0, 0)).toThrow('Деление на ноль невозможно');
            });
        });
    });

    describe('Интеграционные тесты', () => {
        it('должен выполнить последовательность операций', () => {
            calculator.appendNumber('10');
            calculator.appendOperator('+');
            calculator.appendNumber('5');
            calculator.calculate();
            expect(calculator.getCurrentInput()).toBe('15');
            
            calculator.appendOperator('*');
            calculator.appendNumber('2');
            calculator.calculate();
            expect(calculator.getCurrentInput()).toBe('30');
        });

        it('должен обработать очистку после вычисления', () => {
            calculator.appendNumber('10');
            calculator.appendOperator('+');
            calculator.appendNumber('5');
            calculator.calculate();
            calculator.clearDisplay();
            expect(calculator.getCurrentInput()).toBe('0');
        });

        it('должен обработать удаление после вычисления', () => {
            calculator.appendNumber('123');
            calculator.calculate();
            calculator.deleteLast();
            expect(calculator.getCurrentInput()).toBe('0');
        });
    });
});


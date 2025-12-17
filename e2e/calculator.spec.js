import { test, expect } from '@playwright/test';

test.describe('Калькулятор - E2E тесты', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator.html');
  });

  test.describe('Начальное состояние', () => {
    test('должен отображать "0" на дисплее при загрузке', async ({ page }) => {
      const display = page.locator('#display');
      await expect(display).toHaveText('0');
    });

    test('должен отображать все кнопки', async ({ page }) => {
      // Проверяем наличие основных кнопок
      await expect(page.getByRole('button', { name: 'C' })).toBeVisible();
      await expect(page.getByRole('button', { name: '=' })).toBeVisible();
      await expect(page.getByRole('button', { name: '0' })).toBeVisible();
      await expect(page.getByRole('button', { name: '.' })).toBeVisible();
      
      // Проверяем цифры
      for (let i = 0; i <= 9; i++) {
        await expect(page.getByRole('button', { name: i.toString() })).toBeVisible();
      }
      
      // Проверяем операторы
      await expect(page.getByRole('button', { name: '+' })).toBeVisible();
      await expect(page.getByRole('button', { name: '-' })).toBeVisible();
      await expect(page.getByRole('button', { name: '×' })).toBeVisible();
      await expect(page.getByRole('button', { name: '/' })).toBeVisible();
    });
  });

  test.describe('Ввод чисел', () => {
    test('должен вводить одиночные цифры', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await expect(display).toHaveText('5');
      
      await page.getByRole('button', { name: 'C' }).click();
      
      await page.getByRole('button', { name: '9' }).click();
      await expect(display).toHaveText('9');
    });

    test('должен вводить многозначные числа', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '2' }).click();
      await page.getByRole('button', { name: '3' }).click();
      await expect(display).toHaveText('123');
    });

    test('должен заменять "0" на первую цифру', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '7' }).click();
      await expect(display).toHaveText('7');
      await expect(display).not.toHaveText('07');
    });

    test('должен обрабатывать ноль', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '0' }).click();
      await expect(display).toHaveText('0');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await expect(display).toHaveText('10');
    });

    test('должен вводить десятичные числа', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '.' }).click();
      await page.getByRole('button', { name: '5' }).click();
      await expect(display).toHaveText('5.5');
    });

    test('не должен добавлять вторую точку', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '3' }).click();
      await page.getByRole('button', { name: '.' }).click();
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '.' }).click();
      await expect(display).toHaveText('3.5');
    });
  });

  test.describe('Математические операции', () => {
    test('должен выполнять сложение', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await page.getByRole('button', { name: '3' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('8');
    });

    test('должен выполнять вычитание', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '-' }).click();
      await page.getByRole('button', { name: '3' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('7');
    });

    test('должен выполнять умножение', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '×' }).click();
      await page.getByRole('button', { name: '4' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('20');
    });

    test('должен выполнять деление', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '/' }).click();
      await page.getByRole('button', { name: '2' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('5');
    });

    test('должен выполнять сложные вычисления', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '×' }).click();
      await page.getByRole('button', { name: '2' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('20');
    });

    test('должен обрабатывать отрицательные результаты', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '-' }).click();
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('-5');
    });

    test('должен обрабатывать десятичные результаты', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '/' }).click();
      await page.getByRole('button', { name: '2' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('0.5');
    });
  });

  test.describe('Операторы', () => {
    test('должен заменять оператор при повторном нажатии', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await expect(display).toHaveText('5+');
      
      await page.getByRole('button', { name: '-' }).click();
      await expect(display).toHaveText('5-');
    });

    test('должен добавлять оператор к числу', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '8' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await expect(display).toHaveText('8+');
    });
  });

  test.describe('Деление на ноль и ошибки', () => {
    test('должен показывать "Ошибка" при делении на ноль', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '/' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('Ошибка');
    });

    test('должен показывать "Ошибка" при делении на ноль в сложном выражении', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '/' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('Ошибка');
    });

    test('не должен считать деление на 0.5 как ошибку', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '/' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '.' }).click();
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).not.toHaveText('Ошибка');
      await expect(display).toHaveText('20');
    });
  });

  test.describe('Очистка и удаление', () => {
    test('должен очищать дисплей при нажатии C', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '2' }).click();
      await page.getByRole('button', { name: '3' }).click();
      await expect(display).toHaveText('123');
      
      await page.getByRole('button', { name: 'C' }).click();
      await expect(display).toHaveText('0');
    });

    test('должен удалять последний символ при нажатии ⌫', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '2' }).click();
      await page.getByRole('button', { name: '3' }).click();
      await expect(display).toHaveText('123');
      
      await page.getByRole('button', { name: '⌫' }).click();
      await expect(display).toHaveText('12');
      
      await page.getByRole('button', { name: '⌫' }).click();
      await expect(display).toHaveText('1');
      
      await page.getByRole('button', { name: '⌫' }).click();
      await expect(display).toHaveText('0');
    });

    test('должен удалять оператор при нажатии ⌫', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await expect(display).toHaveText('5+');
      
      await page.getByRole('button', { name: '⌫' }).click();
      await expect(display).toHaveText('5');
    });
  });

  test.describe('Клавиатурный ввод', () => {
    test('должен вводить числа с клавиатуры', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('5');
      await expect(display).toHaveText('5');
      
      await page.keyboard.press('3');
      await expect(display).toHaveText('53');
    });

    test('должен выполнять операции с клавиатуры', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('1');
      await page.keyboard.press('0');
      await page.keyboard.press('+');
      await page.keyboard.press('5');
      await page.keyboard.press('Enter');
      
      await expect(display).toHaveText('15');
    });

    test('должен использовать клавишу = для вычисления', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('8');
      await page.keyboard.press('-');
      await page.keyboard.press('3');
      await page.keyboard.press('=');
      
      await expect(display).toHaveText('5');
    });

    test('должен очищать дисплей по Escape', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('1');
      await page.keyboard.press('2');
      await page.keyboard.press('3');
      await expect(display).toHaveText('123');
      
      await page.keyboard.press('Escape');
      await expect(display).toHaveText('0');
    });

    test('должен очищать дисплей по клавише C', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('9');
      await page.keyboard.press('9');
      await expect(display).toHaveText('99');
      
      await page.keyboard.press('c');
      await expect(display).toHaveText('0');
    });

    test('должен удалять символ по Backspace', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('4');
      await page.keyboard.press('5');
      await page.keyboard.press('6');
      await expect(display).toHaveText('456');
      
      await page.keyboard.press('Backspace');
      await expect(display).toHaveText('45');
    });

    test('должен вводить десятичную точку с клавиатуры', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('5');
      await page.keyboard.press('.');
      await page.keyboard.press('5');
      await expect(display).toHaveText('5.5');
    });

    test('должен обрабатывать все операторы с клавиатуры', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.keyboard.press('1');
      await page.keyboard.press('0');
      await page.keyboard.press('*');
      await page.keyboard.press('2');
      await page.keyboard.press('Enter');
      await expect(display).toHaveText('20');
      
      await page.keyboard.press('Escape');
      
      await page.keyboard.press('1');
      await page.keyboard.press('5');
      await page.keyboard.press('/');
      await page.keyboard.press('3');
      await page.keyboard.press('Enter');
      await expect(display).toHaveText('5');
    });
  });

  test.describe('Интеграционные сценарии', () => {
    test('должен выполнять последовательность операций', async ({ page }) => {
      const display = page.locator('#display');
      
      // Первая операция
      await page.getByRole('button', { name: '1' }).click();
      await page.getByRole('button', { name: '0' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '=' }).click();
      await expect(display).toHaveText('15');
      
      // Продолжение с результатом
      await page.getByRole('button', { name: '×' }).click();
      await page.getByRole('button', { name: '2' }).click();
      await page.getByRole('button', { name: '=' }).click();
      await expect(display).toHaveText('30');
    });

    test('должен сбрасывать ввод после вычисления', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '5' }).click();
      await page.getByRole('button', { name: '+' }).click();
      await page.getByRole('button', { name: '3' }).click();
      await page.getByRole('button', { name: '=' }).click();
      await expect(display).toHaveText('8');
      
      // После вычисления следующая цифра должна заменить результат
      await page.getByRole('button', { name: '7' }).click();
      await expect(display).toHaveText('7');
    });

    test('должен обрабатывать смешанный ввод (мышь и клавиатура)', async ({ page }) => {
      const display = page.locator('#display');
      
      await page.getByRole('button', { name: '1' }).click();
      await page.keyboard.press('0');
      await page.getByRole('button', { name: '+' }).click();
      await page.keyboard.press('5');
      await page.getByRole('button', { name: '=' }).click();
      
      await expect(display).toHaveText('15');
    });
  });
});

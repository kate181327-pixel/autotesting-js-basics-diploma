const { By, until} = require("selenium-webdriver")
const fs = require("fs").promises;//утилита для работы со скриншотами
const { expect } = require("chai");

//функция для ожидания того что url изменился
const waitForUrl= async(url, timeout=5000) => {
    await driver.wait(async () => {
        //return (await driver.getCurrentUrl()=== url)
        return (await driver.getCurrentUrl()).includes(url);
    },timeout)
}
//функция скриншота
async function takeScreenshot(fileName="failedTest"){
    const image =  await driver.takeScreenshot();
    await fs.writeFile(`${fileName}.png`,image, "base64");//writeFile() записывет что то из памяти на диск

}

// //функция получения текста элемента
async function getElementText(locator, timeout = 5000) {
    const element = await driver.wait(
        until.elementLocated(locator),
        timeout
    );

    await driver.wait(
        until.elementIsVisible(element),
        timeout
    );

    return (await element.getText()).trim();
}

//Функция проверки совпадения текста
async function assertElementContainsText(locator, expectedText, timeout = 5000) {
try {
    const element = await driver.wait(until.elementLocated(locator),timeout);
    await driver.wait(until.elementIsVisible(element),timeout);
    
    //await driver.wait(until.elementTextContains(element, expectedText),timeout);
    await driver.wait(async () => {
        const actualText = (await element.getText()).trim();

        return actualText
            .toLowerCase()
            .includes(expectedText.toLowerCase());
    }, timeout);

    const actualText = (await element.getText()).trim();
    
    expect(actualText.toLowerCase())
        .to.contain(expectedText.toLowerCase());
    } catch (error) {
        throw new Error(
            `Не удалось проверить текст элемента.\n` +
            `Локатор: ${locator}\n` +
            `Ожидался текст: "${expectedText}"\n` +
            `Таймаут ожидания: ${timeout} мс.\n` +
            `Исходная ошибка: ${error.message}`
        );
    }
}

// Проверка точного совпадения текста элемента
async function assertElementTextEquals(
    locator,
    expectedText,
    timeout = 5000
) {
    try {
        const element = await driver.wait(until.elementLocated(locator),timeout);
        await driver.wait(until.elementIsVisible(element),timeout);

        const actualText = (await element.getText()).trim();

        expect(actualText).to.equal(expectedText);

    } catch (error) {
        throw new Error(
            `Текст элемента не совпал с ожидаемым.\n` +
            `Локатор: ${locator}\n` +
            `Ожидалось: "${expectedText}"\n` +
            `Таймаут: ${timeout} мс.\n` +
            `Исходная ошибка: ${error.message}`
        );
    }
}

//функция проверки наличия значка
async function checkBadgesInCards(productCards, badgeSelector, expectedText) {
    for (const card of productCards) {
        const badge = await card.findElements(By.css(badgeSelector));
        // Проверяем, что значок есть
        expect(badge.length).to.be.greaterThan(0, "В карточке отсутствует значок");
        const badgeText = await badge[0].getAttribute("textContent");
        expect(badgeText.trim()).to.equal(expectedText, `Текст значка должен быть '${expectedText}'`);
    }
}

module.exports  = { 
        waitForUrl, 
        getElementText,
        assertElementContainsText, 
        checkBadgesInCards, 
        takeScreenshot, 
        assertElementTextEquals
    }
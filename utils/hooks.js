const {Builder} = require("selenium-webdriver")
const {takeScreenshot} = require("./helpers")
require("chromedriver");

exports.mochaHooks = {
    beforeEach: async function(){
        global.driver = await new Builder().forBrowser("chrome").build()//Объявляем драйвер через переменную (запуск браузера)
        await driver.manage().setTimeouts({ implicit: 5000})//неявное ожидание
    },

    afterEach: async function(){
        //проверяем что если упал тест то создаем скриншот ошибки
        if (this.currentTest.state === "failed"){
          await takeScreenshot(this.currentTest.title);//описали как мы хотим делать скриншок и где
        }

        await driver.quit();///закрыть браузер      
     },
};


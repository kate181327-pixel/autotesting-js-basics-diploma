const { By, until} = require("selenium-webdriver")
const { expect } = require("chai")
const { waitForUrl, getElementText, assertElementContainsText} = require("../utils/helpers")
const { addFirstProductToCart } = require("../utils/common");



describe("Тесты для страницы 'Корзина' когда корзина пуста",  function (){

 const testUrl = "https://intershop5.skillbox.ru/cart/"
    beforeEach(async function () {
        await driver.get(testUrl);
    });
   
    
    it("Отображение сообщения о пустой корзине", async function (){
        //test data
        const emptyCartMessageLocator = By.css(".cart-empty.woocommerce-info");//локатор сообщения
        
        
        ///make assertions
        await assertElementContainsText(emptyCartMessageLocator, "Корзина пуста."); //проверка что текст верный
        
    });

    it("Переход из пустой корзины по ссылке 'Назад в магазин'", async function (){
        //test data
        const returnToShopButtonLocator = By.css(".return-to-shop a" );
        
        //make actions
        const returnToShopButton = await driver.findElement(returnToShopButtonLocator);
        ///make assertions
        await assertElementContainsText(returnToShopButtonLocator, "Назад в магазин"); //проверка что текст верный
        await returnToShopButton.click();
        // проверяем, что открылась страница магазина
        await waitForUrl("/shop/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageUR = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pageUR).contain("shop");
        
    });

});

describe("Тесты для страницы 'Корзина' когда в корзине есть товар",  function (){

    beforeEach(async function () {
        await addFirstProductToCart();
    });
    const inputCodeLocator = By.css("#coupon_code");//локатор строки промокода
    const buttonCodeLocator = By.css(".coupon .button");//локатор кнопки применение промокода
       
    it("Удаление и восстановление товара из корзины", async function (){
        //test data
        const cartItemLocator = By.css(".cart_item");//локатор строки товара
        const removeButtonLocator  = By.css(".product-remove a" );//локатор крестика
        const nameProductLocator  = By.css(".product-name a" );//локатор названия товара
        const messageDeleteLocator  = By.css(".woocommerce-message" );//локатор сообщение об удалении
        const returnButtonLocator  = By.css(".woocommerce-message a.restore-item" );//локатор кнопки вернуть
        //make actions
        // Сохраняем строку товара до удаления
        const cartItem = await driver.findElement(cartItemLocator);

        // Сохраняем название товара
        const nameProduct = (await getElementText(nameProductLocator)).trim();

        // Удаляем товар
        await driver.findElement(removeButtonLocator).click();

        // Ждём, пока прежняя строка товара исчезнет из DOM
        await driver.wait(until.stalenessOf(cartItem),5000,"Товар не был удалён из корзины");
                 
        // Ждём сообщение
        await driver.wait(until.elementLocated(messageDeleteLocator),5000,"Не появилось сообщение об удалении товара");
        // Ждём кнопку «Вернуть?»
        const returnButton = await driver.wait(until.elementLocated(returnButtonLocator),5000,"Не появилась кнопка 'Вернуть?'");
     
        //make assertions    
       await assertElementContainsText(messageDeleteLocator, nameProduct);//проверить что сообщение содержит название
       await assertElementContainsText(returnButtonLocator, "Вернуть?");//проверить что ссылка называется 'Вернуть?'
       await returnButton.click();// восстанавливаем товар
       
        //проверка что товар восстановлен
        const restoredProduct = await driver.wait(until.elementLocated(nameProductLocator),5000,"Товар не был возвращён в корзину");
        const restoredProductName = (await restoredProduct.getText()).trim();
        expect(restoredProductName).to.equal(nameProduct);
         });

    it("Переход к оформлению заказа", async function () {
        // test data
        const checkoutButtonLocator = By.css(".checkout-button");

        // actions
        const checkoutButton = await driver.wait(until.elementLocated(checkoutButtonLocator),5000,"Не найдена кнопка оформления заказа");

        await checkoutButton.click();

        // assertions
        await waitForUrl("/checkout/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageURL = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pageURL).contain("checkout");
    });

    it("Применение промокода 'sert500'", async function () {
        // test data
        
        const messageAddDiscountLocator = By.css(".woocommerce-message");//локатор сообщение о применение промокода
        const discountTitleLocator = By.css(".cart-discount.coupon-sert500 th");//локатор поля скидки
        const discountAmountLocator = By.css(".cart-discount.coupon-sert500 td .woocommerce-Price-amount");//локатор значения скидки
        const code = "sert500"

        // actions
        await driver.findElement(inputCodeLocator).sendKeys(code); //вводим промокод
        await driver.findElement(buttonCodeLocator).click();

        // assertions
        
        await assertElementContainsText(messageAddDiscountLocator, "Купон успешно добавлен."); //промеряем текст сообщение о применении промокода
        await assertElementContainsText(discountTitleLocator, "Скидка: SERT500"); //промеряем текст поля скидки
        await assertElementContainsText(discountAmountLocator, "500,00"); //промеряем значение  скидки
    });

    it("Применение несуществующего промокода ", async function () {
        // test data
        const messageErrorLocator = By.css(".woocommerce-error li");//локатор поля скидки
        const code = "sert"
        // actions
        await driver.findElement(inputCodeLocator).sendKeys(code); //вводим промокод
        await driver.findElement(buttonCodeLocator).click();

        //assertions
        await assertElementContainsText(messageErrorLocator, "Неверный купон."); //промеряем значение  скидки
    });

    it("Удаление примененного промокода 'sert500'", async function () {
        // test data
        const messageDiscountLocator = By.css(".woocommerce-message");//локатор сообщение о применение промокода
        const deleteButtonLocator = By.css(".woocommerce-remove-coupon");//кнопка удаления промокода
        const code = "sert500"
              
        // actions
        await driver.findElement(inputCodeLocator).sendKeys(code); //вводим промокод
        await driver.findElement(buttonCodeLocator).click();
        // Ждём применение скидки
        await driver.wait(until.elementLocated(messageDiscountLocator),5000,"Промокод не был применён");
             
        await driver.findElement(deleteButtonLocator).click();//удаляем скидку
        // Ждём изменения текста сообщения
        await driver.wait(
            async function () {
            const messageText = (
                await getElementText(messageDiscountLocator)
            ).trim();

            return messageText
                .toLowerCase()
                .includes("купон удален.");
            },
            5000,
            "Не появилось сообщение об удалении купона"
        );
                    
        //assertions
        await assertElementContainsText(messageDiscountLocator,"Купон удален.");//проверяем содержание сообщения об удалении
    });
    it("Применение промокода 'EXPIRED123' с истёкшим сроком действия", async function () {
        // test data
        const messageErrorLocator = By.css(".woocommerce-error li");//локатор поля скидки
        const code = "EXPIRED123"
        // actions
        await driver.findElement(inputCodeLocator).sendKeys(code); //вводим промокод
        await driver.findElement(buttonCodeLocator).click();

        // assertions
        await assertElementContainsText(messageErrorLocator, "Неверный купон."); //промеряем значение  скидки
    });

   });
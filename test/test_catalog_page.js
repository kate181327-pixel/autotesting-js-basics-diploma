const { By, until} = require("selenium-webdriver")
const { expect } = require("chai")
const { waitForUrl, getElementText, assertElementContainsText} = require("../utils/helpers")
const { clickForSection } = require("../utils/common");


describe("Тесты для страницы 'Каталог товаров' сайта интернет-магазина Intershop",  function (){

 const testUrl = "https://intershop5.skillbox.ru/product-category/catalog/"
    beforeEach(async function () {
        await driver.get(testUrl);
    });
    const sectionLocator = By.linkText("Телевизоры");//локатор ссылки раздела
    
    it("Переход в раздел 'телевизоры' в каталоге", async function (){
        //test data
        const titlePageLocator =By.css(".entry-title.ak-container");//локатор заголовка
        
        //make actions
       const textSection = (await getElementText(sectionLocator)).trim();//получаем текс ссылки
       await clickForSection(sectionLocator);//клик по разделу
        
        ///make assertions
        await waitForUrl("/tv/", 5000)//вызываем функцию ожидания что адрес изменился
        const currentUrl = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (currentUrl).contain("tv");
        await assertElementContainsText(titlePageLocator, textSection);//Проверяем заголовок
        
    });

    it("После добавления товара в корзину, появляется ссылка 'Подробнее'", async function (){
        //test data
        const addButtonLocator = By.css(".products .product:first-child .add_to_cart_button");//локатор кнопки "в корзину" первой карточки
        const detailsButtonLocator =By.css(".products .product:first-child .added_to_cart");//локатор кнопки "подробнее"
        
        //make actions
        await clickForSection(sectionLocator);//клик по разделу
        const addButton = await driver.findElement(addButtonLocator);
        // Получаем исходный текст кнопки
        const originalButtonText = (await addButton.getText()).trim();
        // Добавляем товар
        await addButton.click();
        const detailsButton = await driver.wait(
        until.elementLocated(detailsButtonLocator, "ПОДРОБНЕЕ"),5000, 
        "После добавления товара не появилась ссылка 'Подробнее'");

        await driver.wait(
        until.elementIsVisible(detailsButton),
        5000);
        const newButtonText =(await detailsButton.getText()).trim();// Получаем новый текст
        
        ///make assertions
        expect(newButtonText).to.not.equal(originalButtonText);//проверяем что тексты не совпадают 
        expect(newButtonText).to.equal("ПОДРОБНЕЕ");
    });

    it("Переход в корзину по ссылке 'Подробнее' после добавления товара", async function (){
        //test data
        const addButtonLocator = By.css(".products .product:first-child .add_to_cart_button");//локатор кнопки "в корзину" первой карточки
        const detailsButtonLocator =By.css(".products .product:first-child .added_to_cart");//локатор кнопки "подробнее"
        const nameProductCartLocator =By.css(".product-name a");//локатор названия товара в корзине
        
        //make actions
        await clickForSection(sectionLocator);//клик по разделу
        const addButton = await driver.findElement(addButtonLocator);
        // получаем название товара
        const productName = (await driver.findElement(By.css(".products .product:first-child h3")).getText()).trim();

        // Добавляем товар
        await addButton.click();
        //ждем появления ссылки подробнее
        const detailsButton = await driver.wait(
        until.elementLocated(detailsButtonLocator, "ПОДРОБНЕЕ"),5000, 
        "После добавления товара не появилась ссылка 'Подробнее'");

        // переходим по ссылке
        await detailsButton.click();
        
        ///make assertions
        // проверяем, что открылась корзина
        await waitForUrl("/cart/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageCartURL = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pageCartURL).contain("cart");

        await assertElementContainsText(nameProductCartLocator, productName);//Проверяем название      
    });

    it("Переход на страницу описания товара по клику на карточку в каталоге", async function (){
        //test data
        const sectionLocator = By.linkText("Телефоны");//локатор ссылки раздела
        const cardButtonLocator = By.css(".products .product:first-child .inner-img a");//локатор карточки товара
        const nameCardLocator = By.css(".products .product:first-child h3");//локатор названия карточки товара
        const productTitleLocator = By.css(".product_title.entry-title");//локатор названия карточки товара  на странице описания
        
        //make actions
        await clickForSection(sectionLocator);//клик по разделу
        const nameCard = await getElementText(nameCardLocator);//получаем название карточк товара
        await driver.findElement(cardButtonLocator).click();//клик по карточке товара
       
        ///make assertions
        // проверяем, что открылась описание товара
        await waitForUrl("/product/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageURL = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pageURL).contain("product");

        await assertElementContainsText(productTitleLocator, nameCard);//Проверяем совпадают ли названия
    });


});
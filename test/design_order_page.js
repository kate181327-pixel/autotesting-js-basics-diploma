const { By, until} = require("selenium-webdriver")
const { expect } = require("chai")
const { waitForUrl,  assertElementContainsText} = require("../utils/helpers")
const { addFirstProductToCart,  login, goToCheckout, fillCheckoutForm } = require("../utils/common");


describe("Тестирование страницы оформления заказа пользователь не авторизован",  function (){

    const testUrl = "https://intershop5.skillbox.ru/"
       beforeEach(async function () {
           await driver.get(testUrl);      
           await addFirstProductToCart(); 
           await goToCheckout();    
       });
      
    
    it("Переход на страницу оформления заказа неавторизованного пользователя", async function (){
        //test data
        const registeredTextLocator =By.css(".woocommerce-form-login-toggle .woocommerce-info");//локатор текста о регистрации на странице оформления  
        const authorizationLinkLocator =By.css(".showlogin"); //локатор ссылки авторизации        
        //make actions
        
        ///make assertions
        const currentUrl =await driver.getCurrentUrl();
        expect(currentUrl).to.contain("/checkout/");
        await assertElementContainsText(registeredTextLocator,"Зарегистрированы на сайте?");
        const authorizationLink =await driver.findElement(authorizationLinkLocator);
        expect(await authorizationLink.isDisplayed()).to.equal(true);
        expect(await authorizationLink.getText()).to.equal("Авторизуйтесь");
        
    });
   
   
   });


describe("Тестирование страницы оформления заказа пользователь авторизован",  function (){

    const placeOrderButtonLocator =By.css("#place_order");//лоатор кнопки оформить заказ
    const testUrl = "https://intershop5.skillbox.ru/"
    beforeEach(async function () {
        await driver.get(testUrl);

        await login(
            "nefasu@maior.com",
            "123456"
        );
        await addFirstProductToCart();
        await goToCheckout();
        
    });
   
    
    it("Позитивный тест оформления заказа", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "Иванова",
            "ул. Ленина, 10",
            "Москва",
            "Брянская",
            "101000",
            "+79991234567",
            "nefasu@maior.com"
        );
        
        const titleOrderSuccessful = By.css(".woocommerce-notice--success");//локатор заголовка успешного оформления
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();


        ///make assertions
        await waitForUrl("/order-received/", 5000)//вызываем функцию ожидания что адрес изменился
        const currentUrl = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (currentUrl).contain("/order-received/");
        await assertElementContainsText(titleOrderSuccessful, "Спасибо! Ваш заказ был получен.");  
    });

    it("Отображается сообщение об ошибке при отправке пустой формы", async function (){
        //test data
        await fillCheckoutForm(
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        );
        const checkoutErrorsLocator = By.css(".woocommerce-error"); //локатор сообщения об ошибке                
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();
        
        //make assertions
        const checkoutErrors = await driver.wait(until.elementLocated(checkoutErrorsLocator), 5000);
        await driver.wait(until.elementIsVisible(checkoutErrors),5000);
        expect(await checkoutErrors.isDisplayed()).to.equal(true);       
    });

    it("Ошибка при пустом поле имени", async function (){
        //test data
        await fillCheckoutForm(
            "",
            "Иванова",
            "ул. Ленина, 10",
            "Москва",
            "Брянская",
            "101000",
            "+79991234567",
            "nefasu@maior.com"
        );
        
        const errorMessageFirstNameInput = By.css("[data-id = 'billing_first_name']");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
        await assertElementContainsText(errorMessageFirstNameInput, "Имя для выставления счета обязательное поле.");
    });

    it("Ошибка при пустом поле фамилия", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "",
            "ул. Ленина, 10",
            "Москва",
            "Брянская",
            "101000",
            "+79991234567",
            "nefasu@maior.com"
        );
        
        const errorMessageLastNameInput = By.css("[data-id = 'billing_last_name']");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
        await assertElementContainsText(errorMessageLastNameInput, "Фамилия для выставления счета обязательное поле.");
    });

    it("Ошибка при пустом поле адрес", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "Иванова",
            "",
            "Москва",
            "Брянская",
            "101000",
            "+79991234567",
            "nefasu@maior.com"
        );
        
        const errorMessageAddressInput = By.css("[data-id = 'billing_address_1']");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
        await assertElementContainsText(errorMessageAddressInput, "Адрес для выставления счета обязательное поле.");
    });

    it("Ошибка при пустом поле город", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "Иванова",
            "ул. Ленина, 10",
            "",
            "Брянская",
            "101000",
            "+79991234567",
            "nefasu@maior.com"
        );
        
        const errorMessageCityInput = By.css("[data-id = 'billing_city']");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
        await assertElementContainsText(errorMessageCityInput, "Город / Населенный пункт для выставления счета обязательное поле.");
    });

    it("Ошибка при пустом поле область", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "Иванова",
            "ул. Ленина, 10",
            "Москва",
            "",
            "101000",
            "+79991234567",
            "nefasu@maior.com"
        );
        
        const errorMessageStateInput = By.css("[data-id = 'billing_state']");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
        await assertElementContainsText(errorMessageStateInput, "Область для выставления счета обязательное поле.");
    });

    it("Ошибка при пустом поле Почтовый индекс", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "Иванова",
            "ул. Ленина, 10",
            "Москва",
            "Брянская",
            "",
            "+79991234567",
            "nefasu@maior.com"
        );
        
        const errorMessagePostcodeInput = By.css("[data-id = 'billing_postcode']");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
        await assertElementContainsText(errorMessagePostcodeInput, "Почтовый индекс для выставления счета обязательное поле.");
    });

    it("Ошибка при пустом поле Телефон ", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "Иванова",
            "ул. Ленина, 10",
            "Москва",
            "Брянская",
            "101000",
            "",
            "nefasu@maior.com"
        );
        
        const errorMessagePhoneInput =By.xpath("//ul[contains(@class,'woocommerce-error')]/li[@data-id='billing_phone'][2]");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
        await assertElementContainsText(errorMessagePhoneInput, "Телефон для выставления счета обязательное поле.");
    });

    it("Ошибка при пустом поле почта ", async function (){
        //test data
        await fillCheckoutForm(
            "Екатерина",
            "Иванова",
            "ул. Ленина, 10",
            "Москва",
            "Брянская",
            "101000",
            "79991234567",
            ""
        );
        const errorMessageEmailInput = By.css("[data-id='billing_email']");//локатор ошибки
            
        //make actions
        await driver.findElement(placeOrderButtonLocator).click();

        ///make assertions
       await assertElementContainsText(errorMessageEmailInput, "Адрес почты для выставления счета обязательное поле.");
    });

    
});
const { By, until} = require("selenium-webdriver")
const { expect } = require("chai")
const { waitForUrl,  assertElementContainsText} = require("../utils/helpers")
const { fillLoginForm, fillRegistrationForm } = require("../utils/common");
const {testUser, registeredUser} = require("../config/testData");



describe("Проверки перехода на страницу регистрации и авторизации",  function (){

 const testUrl = "https://intershop5.skillbox.ru/"
    beforeEach(async function () {
        await driver.get(testUrl);
    });
   
    
    it("Переход на страницу регистрации", async function (){
        //test data
        const enterButtonLocator = By.css(".login-woocommerce a");//локатор кнопки входа
        const registrationButtonLocator =By.css(".custom-register-button");//локатор кнопки регистрации
        const titlePageRegistrationLocator =By.css(".post-title");//локатор заголовка
        
        //make actions
       
        await driver.findElement(enterButtonLocator).click();//клик по кнопке войти
        await waitForUrl("/my-account/",5000);
        await driver.findElement(registrationButtonLocator).click();//клик по кнопке зарегистрироваться
        
        ///make assertions
        await waitForUrl("/register/", 5000)//вызываем функцию ожидания что адрес изменился
        const currentUrl = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (currentUrl).contain("register");
        await assertElementContainsText(titlePageRegistrationLocator, "Регистрация");//Проверяем заголовок
        
    });

    it("Переход на страницу авторизации", async function (){
        //test data
        const enterButtonLocator = By.css(".login-woocommerce a");//локатор кнопки входа
        const titlePageAuthorizationLocator =By.css(".post-title");//локатор заголовка
        
        //make actions
       
        await driver.findElement(enterButtonLocator).click();//клик по кнопке войти
                
        ///make assertions
        await waitForUrl("/my-account/", 5000)//вызываем функцию ожидания что адрес изменился
        const currentUrl = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (currentUrl).contain("my-account");
        await assertElementContainsText(titlePageAuthorizationLocator, "Мой аккаунт");//Проверяем заголовок
        
    });

});

describe("Тесты для формы регистрации",  function (){

    const testUrl = "https://intershop5.skillbox.ru/register/"
       beforeEach(async function () {
           await driver.get(testUrl);
       });
    
       const buttonRegistrationLocator =By.css("button[name='register']");//локатор кнопки регистрации
      
       
    it("Успешная регистрация нового пользователя", async function (){
        //test data
         const messageRegistrationLocator = By.css(".content-page div");
    
        const uniqueValue = Date.now();
        const username =`F${uniqueValue}`;
        const email =`${uniqueValue}@g.c`;
        const password ="5466sd";
                            
        //make actions
        await fillRegistrationForm(username, email, password);
        await driver.findElement(buttonRegistrationLocator).click();//клик по кнопке зарегистрироваться
       
        ///make assertions
        await assertElementContainsText(messageRegistrationLocator, "Регистрация завершена"); //промеряем содержание сообщения
           
       });

    it("Регистрация с пустыми полями", async function (){
        //test data
        const messageErrorLocator = By.css(".woocommerce-error li");
                               
        //make actions
        await driver.findElement(buttonRegistrationLocator).click();//клик по кнопке зарегистрироваться
                  
        ///make assertions
        await assertElementContainsText(messageErrorLocator, "Пожалуйста, введите корректный email."); //промеряем содержание сообщения
    });

    it("Регистрация уже зарегистрированного пользователя", async function (){
        //test data
        const messageRegistrationLocator = By.css(".woocommerce-error li");//локатор сообщения 
        const linkAutorizationLocator =By.css(".showlogin");//локатор ссылки авторизации
                                
        //make actions
        await fillRegistrationForm(
            registeredUser.username,
            registeredUser.email,
            registeredUser.password
        );
        await driver.findElement(buttonRegistrationLocator).click();//клик по кнопке зарегистрироваться
                    
        ///make assertions
        await assertElementContainsText(messageRegistrationLocator, "Учетная запись с такой почтой уже зарегистировавана."); //промеряем содержание сообщения
        const isDisplayed = await driver.findElement(linkAutorizationLocator).isDisplayed();
        expect(isDisplayed).to.equal(true);
       });

    it("Регистрация с некорректным форматом email", async function () {

        // test data
        const uniqueValue =Date.now();
        const username =`F${uniqueValue}`;
        const invalidEmail ="invalid-email";
        const password ="5466sd";
        const emailInputRegistrationLocator = By.css("#reg_email");
        
        // make actions
        await fillRegistrationForm(
            username,
            invalidEmail,
            password
        );
        await driver.findElement(buttonRegistrationLocator).click();
    
        // assertions
        const emailInput = await driver.findElement(emailInputRegistrationLocator);
        const isEmailValid = await driver.executeScript("return arguments[0].checkValidity();",emailInput);
        expect(isEmailValid).to.equal(false);
        
    });

    it("Успешная регистрация с паролем минимальной длины", async function () {

        // test data
        const messageRegistrationLocator =By.css(".content-page div");
        const uniqueValue =Date.now();
        const username =`F${uniqueValue}`;
        const email =`${uniqueValue}@e.c`;
        const shortPassword ="12345";
    
        // make actions
        await fillRegistrationForm(
            username,
            email,
            shortPassword
        );
        await driver.findElement(buttonRegistrationLocator).click();
    
        // assertions
        await assertElementContainsText(messageRegistrationLocator, "Регистрация завершена");
    });
});

describe("Тесты для формы авторизации",  function (){

    const testUrl = "https://intershop5.skillbox.ru/my-account/"
    beforeEach(async function () {
        await driver.get(testUrl);
    });
    const errorMessageAuthorizationLocator =By.css(".woocommerce-error li");//локатор заголовка

    it("Успешный вход по email", async function (){
        //test data
        const messageAuthorizationLocator =By.css(".woocommerce-MyAccount-content p:nth-of-type(1)");//локатор заголовка
        //make actions
        await fillLoginForm( testUser.email, testUser.password)
        
        ///make assertions
        await waitForUrl("/my-account/", 5000)//вызываем функцию ожидания что адрес изменился
        const currentUrl = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (currentUrl).contain("my-account");
        await assertElementContainsText(messageAuthorizationLocator, testUser.username);
      
    });

    it("Авторизация с несуществующим именем пользователя", async function (){
        //test data
        const invalidUsername =`R${Date.now()}`;
        //make actions
        await fillLoginForm(invalidUsername, testUser.password);
        
        ///make assertions
        await assertElementContainsText(errorMessageAuthorizationLocator, "Неизвестное имя пользователя");
      
    });

    it("Авторизация с неверным паролем", async function (){
        //test data
        const invalidPassword ="zxc1234565";
        //make actions
        await fillLoginForm(testUser.email, invalidPassword);
        
        ///make assertions
        await assertElementContainsText(errorMessageAuthorizationLocator,`Введенный пароль для почты ${testUser.email} неверный`);
      
    });

    it("Авторизация с незарегистрированным email", async function (){
        //test data
        const invalidEmail =`un${Date.now()}@gmail.com`;
        //make actions
        await fillLoginForm(invalidEmail, testUser.password);
        
        ///make assertions
        await assertElementContainsText(errorMessageAuthorizationLocator, "Неизвестный адрес почты. Попробуйте еще раз или введите имя пользователя.");
      
    });

    it("Авторизация с незаполненными полями", async function (){
        
        //make actions
        await fillLoginForm("", "");
        
        ///make assertions
        await assertElementContainsText(errorMessageAuthorizationLocator,"Имя пользователя обязательно.");  
    });
    
    

});

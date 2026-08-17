const { By, until} = require("selenium-webdriver")

//локаторы для формы авторизация
const nameOrEmailInputAuthorizationLocator = By.css("#username");//локатор поля почта/имя
const passwordInputAuthorizationLocator = By.css("#password");//локатор поля пароль
const enterButtonAuthorizationLocator = By.css("button[name='login']");//локатор кнопки войти при авторизации

// локаторы формы оформления заказа
const firstNameInputLocator = By.css("#billing_first_name");
const lastNameInputLocator = By.css("#billing_last_name");
const addressInputLocator = By.css("#billing_address_1");
const cityInputLocator = By.css("#billing_city");
const stateInputLocator = By.css("#billing_state");
const postcodeInputLocator = By.css("#billing_postcode");
const phoneInputLocator = By.css("#billing_phone");
const emailInputLocator = By.css("#billing_email");


//функция клик по разделу
const  clickForSection = async (sectionLocator) =>{
    const sectionElement = await driver.findElement(sectionLocator);
     await sectionElement.click();
}

// Функция добавления первого товара в корзину
// После выполнения пользователь находится на странице корзины
const addFirstProductToCart = async (timeout = 5000) => {
    // test data
    const categoryUrl =
        "https://intershop5.skillbox.ru/product-category/catalog/electronics/tv/";

    const addButtonLocator = By.css(".products .product:first-child .add_to_cart_button");

    const detailsButtonLocator = By.css(".products .product:first-child .added_to_cart");

    // actions
    await driver.get(categoryUrl);

    const addButton = await driver.wait(until.elementLocated(addButtonLocator),timeout,"Не найдена кнопка 'В корзину'");
    await addButton.click();
    const detailsButton = await driver.wait(until.elementLocated(detailsButtonLocator),timeout,"После добавления товара не появилась ссылка 'Подробнее'");
    await detailsButton.click();
    await driver.wait(until.urlContains("/cart/"),timeout,"Не открылась страница корзины");
};

//функция заполнения формы авторизации
async function fillLoginForm(username, password) {
    // Очищаем поля перед вводом (на случай, если там что-то есть)
    const nameField = await driver.findElement(nameOrEmailInputAuthorizationLocator);
    await nameField.clear();
    await nameField.sendKeys(username);
    
    const passwordField = await driver.findElement(passwordInputAuthorizationLocator);
    await passwordField.clear();
    await passwordField.sendKeys(password);
    
    await driver.findElement(enterButtonAuthorizationLocator).click();
}

//авторизация для страницы оформления заказа
const login = async (
    loginValue,
    password,
    timeout = 5000) => {

    // test data
    const accountUrl ="https://intershop5.skillbox.ru/my-account/";
    
    // actions
    await driver.get(accountUrl);
    await driver.findElement(nameOrEmailInputAuthorizationLocator).sendKeys(loginValue);
    await driver.findElement(passwordInputAuthorizationLocator).sendKeys(password);
    await driver.findElement(enterButtonAuthorizationLocator).click();
    await driver.wait(until.urlContains("/my-account/"),timeout);
};

///переход на страницу оформления заказа
const goToCheckout = async (timeout = 5000) => {

    // test data
    const checkoutButtonLocator =By.css("a.checkout-button");

    // actions
    const checkoutButton = await driver.wait(until.elementLocated(checkoutButtonLocator), timeout);
    await checkoutButton.click();

    await driver.wait(until.urlContains("/checkout/"),timeout);
};

//функция заполнения формы оформления заказа
const fillCheckoutForm = async (
    firstName,
    lastName,
    address,
    city,
    state,
    postcode,
    phone,
    email
) => {
  
    const firstNameField = await driver.findElement(firstNameInputLocator)
    await firstNameField.clear();
    await firstNameField.sendKeys(firstName);
    
    const lastNameField = await driver.findElement(lastNameInputLocator)
    await lastNameField.clear();
    await lastNameField.sendKeys(lastName);
    
    
    const addressField = await driver.findElement(addressInputLocator)
    await addressField.clear();
    await addressField.sendKeys(address);

    const cityInputField = await driver.findElement(cityInputLocator)
    await cityInputField.clear();
    await cityInputField.sendKeys(city);

    const stateInputField = await driver.findElement(stateInputLocator)
    await stateInputField.clear();
    await stateInputField.sendKeys(state);
    
    const postcodeInputField = await driver.findElement(postcodeInputLocator)
    await postcodeInputField.clear();
    await postcodeInputField.sendKeys(postcode);

    const phoneField = await driver.findElement(phoneInputLocator)
    await phoneField.clear();
    await phoneField.sendKeys(phone);

    const emailField = await driver.findElement(emailInputLocator)
    await emailField.clear();
    await emailField.sendKeys(email);
};

//функция для заполнения формы регистрации
const fillRegistrationForm = async (username, email, password) => {

    const usernameInputRegistrationLocator = By.css("#reg_username");
    const emailInputRegistrationLocator = By.css("#reg_email");
    const passwordInputRegistrationLocator = By.css("#reg_password");

    await driver.findElement(usernameInputRegistrationLocator).sendKeys(username);
    await driver.findElement(emailInputRegistrationLocator).sendKeys(email);
    await driver.findElement(passwordInputRegistrationLocator).sendKeys(password);
};


module.exports = {
        clickForSection, 
        addFirstProductToCart, 
        fillLoginForm, 
        login, 
        goToCheckout, 
        fillCheckoutForm,
        fillRegistrationForm
    }
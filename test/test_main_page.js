const { By, until} = require("selenium-webdriver")
const { expect } = require("chai")
const { waitForUrl, getElementText, assertElementContainsText, checkBadgesInCards, assertElementTextEquals} = require("../utils/helpers")



describe ("Тесты для главной страницы сайта интернет-магазина Intershop",  function (){

 const testUrl = "https://intershop5.skillbox.ru/"
    beforeEach(async function () {
        await driver.get(testUrl);
    });
    
    it("Клик по блоку 'КНИГИ' должен открывать страницу с книгами", async function (){
        //test data
        const booksBlockLocator = By.css("#accesspress_storemo-2");//локатор блока книги
        const titleBooksBlockLocator =  By.css("#accesspress_storemo-2 h4.widget-title:nth-of-type(1)");// локатор заголовка "книги"
        const titleNewPageBooksLocator = By.css(".entry-title.ak-container")  //локатор для заголовка на новой странице

        //make actions
        
        const titleBooksBlock = await getElementText(titleBooksBlockLocator);    
        await driver.findElement(booksBlockLocator).click();

        ///make assertions
        await waitForUrl("/books/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageBookURL = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pageBookURL).contain("books");
       
        await assertElementTextEquals(titleNewPageBooksLocator, titleBooksBlock);//Проверяем заголовок

    });

    it("Клик по блоку 'планшеты' должен открывать страницу с планшетами", async function (){
        //test data
        const padBlockLocator = By.css("#accesspress_storemo-3");//локатор блока книги
        const titlePadBlockLocator =  By.css("#accesspress_storemo-3 h4.widget-title:nth-of-type(1)");// локатор заголовка "планшеты"
        const titleNewPagePadLocator = By.css(".entry-title.ak-container")  //локатор для заголовка на новой странице

        //make actions
           
       const titlePadBlock = await getElementText(titlePadBlockLocator);    
        await driver.findElement(padBlockLocator).click();

        //make assertions
        await waitForUrl("/pad/", 5000)//вызываем функцию ожидания что адрес изменился
        const pagePadURL = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pagePadURL).contain("pad");
               
        await assertElementTextEquals(titleNewPagePadLocator, titlePadBlock);//Проверяем заголовок

    });

    // BUG: Заголовок страницы "Фото/Видео" не совпадает с названием блока "Фотоаппараты".
    it.skip ("Клик по блоку 'фотоаппараты' должен открывать страницу с фото/видео", async function (){
        //test data
        const photoBlockLocator = By.css("#accesspress_storemo-4");//локатор блока книги
        const titlePhotoBlockLocator =  By.css("#accesspress_storemo-4 h4.widget-title:nth-of-type(1)");// локатор заголовка "фотоаппараты"
        const titleNewPagePhotoLocator = By.css(".entry-title.ak-container")  //локатор для заголовка на новой странице

        //make actions
        const titlePhotoBlock = await getElementText(titlePhotoBlockLocator);
        await driver.findElement(photoBlockLocator).click();

        //make assertions
        await waitForUrl("/photo_video/", 5000)//вызываем функцию ожидания что адрес изменился
        const pagePhotoURL = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pagePhotoURL).contain("photo_video");
       
        await assertElementTextEquals(titleNewPagePhotoLocator, titlePhotoBlock);//Проверяем заголовок

    });



    it("тестирование строки поиска", async function (){
    
        //test data
        const stringSearchLocator = By.className("search-field");//локатор строки поиска
        const valueSearch = "телефон";
        const buttonSearchLocator = By.className("searchsubmit");//локатор кнопки поиска
        const titleResultSearchLocator = By.css(".entry-title.ak-container");//локатор заголовка найденной страницы
        
        //make actions
        await driver.findElement(stringSearchLocator).sendKeys(valueSearch); //вводим критерий поиска
        await driver.findElement(buttonSearchLocator).click();        
       
        ///make assertions
        await waitForUrl("post_type=product", 5000)//вызываем функцию ожидания что адрес изменился
        const pageBookUR = await driver.getCurrentUrl() //получим значение текущего адреса 
        const decodedUrl = decodeURIComponent(pageBookUR);
        expect (decodedUrl).contain(valueSearch);
       
        await assertElementContainsText(titleResultSearchLocator, valueSearch);//Проверяем заголовок
    });

    it("Поиск по спецсимволам", async function () {

        // test data
        const stringSearchLocator = By.className("search-field");
        const buttonSearchLocator = By.className("searchsubmit");
        const titleResultSearchLocator = By.css(".entry-title.ak-container");
        const messageNoResultsLocator = By.css(".woocommerce-info");
        const valueSearch = "!@#$%^&*";
    
        // make actions
        await driver.findElement(stringSearchLocator).sendKeys(valueSearch);
        await driver.findElement(buttonSearchLocator).click();
    
        // assertions
        await waitForUrl("post_type=product", 5000);
        const currentUrl = await driver.getCurrentUrl();
        const decodedUrl = decodeURIComponent(currentUrl);
        
        expect(decodedUrl).to.contain(valueSearch);
        await assertElementContainsText(titleResultSearchLocator, valueSearch);
        await assertElementContainsText(messageNoResultsLocator, "По вашему запросу товары не найдены.");
    });

    it("Переход на страницу 'каталог' из меню главной страницы", async function (){
    
        //test data
        const buttonCatalogLocator = By.css("[href$='catalog/']");
        const titlePageCatalogLocator = By.css(".entry-title.ak-container");
             
        //make actions
        const nameButtonCatalog = await getElementText(buttonCatalogLocator);
        await driver.findElement(buttonCatalogLocator).click();      
       
        ///make assertions
        await waitForUrl("/catalog/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageCatalogURL = await driver.getCurrentUrl() //получим значение текущего адреса 
        expect (pageCatalogURL).contain("catalog");
        await assertElementTextEquals(titlePageCatalogLocator, nameButtonCatalog);//Проверяем заголовок
    });

    it("Переход на страницу 'мой аккаунт' из меню главной страницы", async function (){
        //test data
        const buttonMyAccountLocator = By.linkText("Мой аккаунт");
        const breadcrumbsLocator = By.css(".post-title");
       
        //make actions
        const nameButtonMyAccount = await getElementText(buttonMyAccountLocator);
                    
        await driver.findElement(buttonMyAccountLocator).click();      
    
        //make assertions
        await waitForUrl("/my-account/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageMyAccountURL = await driver.getCurrentUrl() //получим значение текушего адреса 
        expect (pageMyAccountURL).contain("my-account");

        await assertElementTextEquals(breadcrumbsLocator, nameButtonMyAccount);//проверяем заголовок 

        });

    it("Переход на страницу 'корзина' из меню главной страницы", async function (){
        //test data
        const buttonCartLocator = By.linkText("Корзина");
        const titlePageCartLocator = By.css(".current");
            
        //make actions
        const nameButtonCart = await getElementText(buttonCartLocator);
        await driver.findElement(buttonCartLocator).click();      
    
        ///make assertions
        await waitForUrl("/cart/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageCartURL = await driver.getCurrentUrl() //получим значение текушего адреса 
        expect (pageCartURL).contain("cart");
        await assertElementTextEquals(titlePageCartLocator, nameButtonCart);//проверяем заголовок 
        });
          
    it("Проверка перехода по клику на ссылку 'Оформит заказ' из меню страницы на страницу корзины (корзина пуста)", async function (){
        //test data
        const buttonDesignOrdersLocator = By.partialLinkText("Оформление");
                    
        //make actions
        await driver.findElement(buttonDesignOrdersLocator).click();      
    
        //make assertions
        await waitForUrl("/cart/", 5000)//вызываем функцию ожидания что адрес изменился
        const pageDesignOrdersURL = await driver.getCurrentUrl() //получим значение текушего адреса 
        expect (pageDesignOrdersURL).contain("cart");
        });   
        
    it("В разделе 'распродажа' на каждой карточке товара есть значок 'Скидка!'", async function (){
        //test data
        const blockSaleLocator = By.css("#accesspress_store_product-2");//локатор блока распродажи
        const titleBlockSaleLocator = By.css("#accesspress_store_product-2 h2");//локатор заголовка блока 
        const cardLocator = By.css("#accesspress_store_product-2 ul.new-prod-slide li.span3");//локатор карточки блока
                   
        //make actions
        const displayedblockSale = await driver.findElement(blockSaleLocator);
           
        ///make assertions
        expect(await displayedblockSale.isDisplayed(), "Блок распродажи отсутствует").to.be.true;//проверяем что блок существует 
        await assertElementContainsText(titleBlockSaleLocator, "распродажа")//проверяем заголовок
        
        //найдем все карточки в разделе
        const productSaleCards = await driver.findElements(cardLocator);//находим все карточки
        expect(productSaleCards.length).to.be.greaterThan(0);//проверяем что есть хотябы одна карточка

        // Проверяем значок "Скидка!" в каждой карточке
        await checkBadgesInCards(productSaleCards, ".onsale", "Скидка!");
        }); 
        

    it("В разделе 'новые поступления' на каждой карточке товара есть значок 'Новый!'", async function (){
        //test data
        const blockNewLocator = By.css("#accesspress_store_product-3");//локатор блока распродажи
        const titleBlockNewLocator = By.css("#accesspress_store_product-3 h2");//локатор заголовка блока 
        const cardNewBlockLocator = By.css("#accesspress_store_product-3 ul.new-prod-slide li.span3");//локатор карточки блока
                
        //make actions
        const displayedblockNew = await driver.findElement(blockNewLocator);
        
        ///make assertions
        expect(await displayedblockNew.isDisplayed(), "Блок 'новые поступления' отсутствует").to.be.true;//проверяем что блок существует 
        await assertElementContainsText(titleBlockNewLocator, "новые поступления")//проверяем заголовок
        
        //найдем все карточки в разделе
        const productNewCards = await driver.findElements(cardNewBlockLocator);//находим все карточки
        expect(productNewCards.length).to.be.greaterThan(0);//проверяем что есть хотя бы одна карточка

        // Проверяем значок 'Новый!' в каждой карточке
        await checkBadgesInCards(productNewCards, ".label-new", "Новый!");

        }); 
        
    it("Проверка присутствия контактной информации в футере страницы", async function (){
        //test data
        const blockContactsLocator = By.css(".cta-banner.clearfix");//локатор блока контактная информация
        const titleBlockContactsLocator = By.css(".cta-banner.clearfix h1");//локатор заголовка блока 
        const phoneContactsLocator = By.xpath("//p[contains(text(), '+7-999-123-12-12')]");//локатор телефона в блоке 
        const emailContactsLocator = By.xpath("//p[contains(text(), 'skillbox@skillbox.ru')]");//локатор email в блоке 

        //make actions
        const blockContacts = await driver.findElement(blockContactsLocator);
        await driver.executeScript("arguments[0].scrollIntoView(true)",blockContacts);
        
        ///make assertions
        expect(await blockContacts.isDisplayed(), "Блок 'Контактная информация' отсутствует").to.be.true;//проверяем что блок существует 
        await assertElementContainsText(titleBlockContactsLocator, "Контактная информация");//проверяем заголовок

        //проверка телефона
        await assertElementContainsText(phoneContactsLocator, "+7-999-123-12-12");
        //проверка email
        await assertElementContainsText(emailContactsLocator, "skillbox@skillbox.ru");
    });
    
});
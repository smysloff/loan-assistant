/* v.0.2 */

window.addEventListener('load', () => {

    /* common functions */

    function getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function spliceRandom(array){
        return array.splice(getRandomInt(0, array.length - 1), 1);
    }

    function getRandom(array){
        return array[getRandomInt(0, array.length - 1)];
    }

    function delay(ms){
        return new Promise(r => setTimeout(() => r(), ms));
    }

    function contains(array, element){
        return array.indexOf(element) != -1;
    }

    /* initialization */
    const chat = document.getElementById('chat'),
          yesNoMessage1 = document.getElementById('yesNoMessage'),
          yesNoMessage2 = yesNoMessage1.cloneNode(true),
          offers = document.getElementById('offerList'),
          moreOffersButton = document.getElementById('moreOffersButton'),
          botName = document.getElementById('botName'),
          botStatus = document.getElementById('botStatus'),
          userInput = document.getElementById('userInput'),
          userSendButton = document.getElementById('userSend'),
          minAmount = 1000, maxAmount = 2000000,
          minAge = 18, maxAge = 60;

    const allOffers = offers.querySelectorAll('.offer-item'),
          offersPerPage = 2,
          offersArray = [];

    let currentOfferPage = 0;

    for (let i = 0, j = 0; i < allOffers.length; i++){
        if (i % offersPerPage == 0) {
            offersArray[j++] = [];
        }
        offersArray[j - 1].push(allOffers[i]);
        if (i < offersPerPage) {
            allOffers[i].style.display = 'flex';
        }
    }

    moreOffersButton.addEventListener('click', function() {
        if (currentOfferPage < offersArray.length - 1) {

            offersArray[++currentOfferPage].forEach(offer => {
                 offer.style.display = 'flex';
            });

            if (currentOfferPage == offersArray.length - 1) {
                chat.removeChild(moreOffersButton);
            }
        }
        chat.scrollBy({top: 235, behavior: 'smooth'});
    });

    const regNums = /^\d+$/,
          regMail = /.+@.+\..+/i;

    let userMessage,
        amount,
        age,
        email,
        yesNo;

    const botMessages = {
        hello : [
            'Привет!',
            'привет',
            'Здравствуй!',
            'Привет! Это твой персональный ассистент по займам',
            'Здравствуй! Это твой персональный ассистент по займам',
            'Я рад тебя видеть!',
        ],
        amountQuestion : [
            'Напиши, какое количество денег ты хочешь?',
            'Какое количество денег тебе нужно?',
            'Займ на какую сумму ты хочешь?',
            'Займ на какую сумму тебе нужен?',
            'Напиши, сколько бы ты хотел получить денег?',
            'Сколько денег тебе нужно?',
            'Нужен займ? Сколько денег ты хочешь?',
        ],
        validateAmount : [
            `Введи цифрами число от ${minAmount} до ${maxAmount}`,
            `Используй только цифры и введи число от ${minAmount} до ${maxAmount}`,
        ],
        confirm : [
            'Хорошо',
            'хорошо',
            'Отлично!',
            'отлично',
            'Супер!',
            'супер',
            'Ок',
            'ок',
            'Превосходно!',
            'превосходно',
            'чудесно',
        ],
        ageQuestion : [
            'Сколько тебе лет?',
            'Какой у тебя возраст?',
            'Сколько тебе полных лет?',
        ],
        validateAge : [
            `Введи цифрами число от ${minAge} до ${maxAge}`,
            `Введи число от ${minAge} до ${maxAge}, используя только цифры`,
            `Используй только цифры и введи число от ${minAge} до ${maxAge}`,
        ],
        offers : [
            'Я подобрал предложения специально для тебя, смотри:',
            'Лови предложения, которые я подобрал специально для тебя',
            'Я подобрал для тебя самые лучшие предложения',
        ],
        preEmailQuestion : [
            'Хочешь получать больше предложений себе на почту?',
            'Хочешь еще больше предложений на свой email?',
        ],
        emailQuestion : [
            'Тогда напиши мне свой email',
            'Тогда просто напиши мне свою почту',
        ],
        validateEmail : [
            'Неверный формат email. Попробуйте еще раз',
            'Это не очень похоже на адрес электронной почты',
            'Это не очень похоже на email. Попробуйте еще раз',
        ],
        returnToOffers : [
            'Вернуться к списку предложений?',
            'Вернуться к таблице с предложениями?',
        ],
        goodbye : [
            'Хорошо. Тогда пока! Заходи еще ;)',
            'Ну ладно. Заходи еще ;)',
            'Пока! Заходи еще ;)',
        ],
    };

    const placeholders = {
      amount : 'Введи сумму...',
      age    : 'Введи возраст...',
      email  : 'Введи email...',
    };


    /* script functions */

    function init(){
        chat.removeChild(offers);
        chat.removeChild(moreOffersButton);
        chat.removeChild(yesNoMessage1);
        offers.style.display = 'flex';
        moreOffersButton.style.display = 'inline-block';
        yesNoMessage1.style.display = 'flex';
        yesNoMessage2.style.display = 'flex';
        closeUserInput();
    }

    function sendOffers(){
        chat.append(offers);
        chat.append(moreOffersButton);
        botStatus.innerHTML = 'online';
        chat.scrollTo({behavior: 'smooth', top: chat.scrollHeight});
    }

    function openUserInput(){
        userInput.disabled = false;
    }

    function closeUserInput(){
        userInput.placeholder = '';
        userInput.disabled = true;
    }

    function botIsTyping(){
        botStatus.innerHTML = '<span class="dots"><i></i><i></i><i></i></span> typing';
    }

    function addNewMessage(text){
        const div = document.createElement('div');
        div.classList.add('message');
        div.textContent = text;
        chat.append(div);
        chat.scrollTo({behavior: 'smooth', top: chat.scrollHeight});
        return div;
    };

    function addBotMessage(text){
        const div = addNewMessage(text);
        div.classList.add('bot-message');
        botStatus.innerHTML = 'online';
    }

    function addUserMessage(text){
        const div = addNewMessage(text);
        div.classList.add('user-message');
    }

    function userInputHandlersOn(){
        userSendButton.addEventListener('click', userSendButtonHandler);
        userInput.addEventListener('keypress', userPressEnterHandler);
    }

    function userInputHandlersOff(){
        userSendButton.removeEventListener('click', userSendButtonHandler);
        userInput.removeEventListener('keypress', userPressEnterHandler);
        userInput.value = '';
    }

    function userSendButtonHandler(){
        let answer = userInput.value.trim();
        if (answer.length) {
            userMessage = answer;
            addUserMessage(userMessage);
            userInputHandlersOff();
        }
    }

    function userPressEnterHandler(e){
        let answer = userInput.value.trim();
        if (e.keyCode == 13 && answer.length){
            userMessage = answer;
            addUserMessage(userMessage);
            userInputHandlersOff();
        }
    }

    function validateAmount(){
        return new Promise((resolve) => {
            let counter = setInterval(function(){
                if (userMessage !== undefined) {
                    if (regNums.test(userMessage)){
                        if (parseInt(userMessage) >= 0) {
                            userMessage = parseInt(userMessage);
                            if (userMessage >= minAmount && userMessage <= maxAmount) {
                                amount = userMessage;
                                closeUserInput();
                            }
                        }
                    }
                    clearInterval(counter);
                    userMessage = undefined;
                    resolve();
                }
            }, 50);
        });
    }

    function validateAge(){
        return new Promise((resolve) => {
            let counter = setInterval(function(){
                if (userMessage !== undefined) {
                    if (regNums.test(userMessage)){
                        if (parseInt(userMessage) >= 0) {
                            userMessage = parseInt(userMessage);
                            if (userMessage >= minAge && userMessage <= maxAge) {
                                age = userMessage;
                                closeUserInput();
                            }
                        }
                    }
                    clearInterval(counter);
                    userMessage = undefined;
                    resolve();
                }
            }, 50);
        });
    }

    function validateEmail(){
        return new Promise((resolve) => {
            let counter = setInterval(function(){
                if (userMessage !== undefined) {
                    if (regMail.test(userMessage)){
                        if (userMessage.length) {
                            email = userMessage;
                            closeUserInput();
                        }
                    }
                    clearInterval(counter);
                    userMessage = undefined;
                    resolve();
                }
            }, 50);
        });
    }

    function yesNoHandlersOn(yesNoMessageContainer){
        const yesButton = yesNoMessageContainer.querySelector('.yes_item'),
              noButton  = yesNoMessageContainer.querySelector('.no_item');
        chat.append(yesNoMessageContainer);
        yesButton.addEventListener('click', userAnswerIsYes);
        noButton.addEventListener('click', userAnswerIsNo);
        chat.scrollTo({behavior: 'smooth', top: chat.scrollHeight});
    }

    function userAnswerIsYes(){
        this.classList.add('active');
        this.removeEventListener('click', userAnswerIsYes);
        this.nextElementSibling.removeEventListener('click', userAnswerIsNo);
        yesNo = 'yes';
    }

    function userAnswerIsNo(button){
        this.classList.add('active');
        this.removeEventListener('click', userAnswerIsNo);
        this.previousElementSibling.removeEventListener('click', userAnswerIsYes);
        yesNo = 'no';
    }

    function validateYesNo(){
        return new Promise((resolve) => {
            let counter = setInterval(function(){
                if (yesNo !== undefined) {
                    clearInterval(counter);
                    resolve();
                }
            }, 50);
        });
    }


    /* script logic */

    (async function() {

        init();

        await delay(500).then(() => botIsTyping());
        await delay(1000).then(() => addBotMessage(getRandom(botMessages.hello)));


        // 1 step (amount)
        await delay(500).then(() => botIsTyping());
        await delay(1000).then(() => addBotMessage(getRandom(botMessages.amountQuestion)));

        userInput.placeholder = placeholders.amount;
        openUserInput();
        userInput.focus();

        while (amount === undefined) {
            userInputHandlersOn();
            await validateAmount();

            if (amount === undefined) {
                await delay(500).then(() => botIsTyping());
                await delay(1000).then(() => addBotMessage(getRandom(botMessages.validateAmount)));
            } else {
                await delay(500).then(() => botIsTyping());
                await delay(1000).then(() => addBotMessage(getRandom(botMessages.confirm)));
            }
        }


        // 2 step (age)
        await delay(500).then(() => botIsTyping());
        await delay(1000).then(() => addBotMessage(getRandom(botMessages.ageQuestion)));

        userInput.placeholder = placeholders.age;
        openUserInput();
        if (chat.clientWidth >= 638) {
            userInput.focus();
        }

        while (age === undefined) {
            userInputHandlersOn();
            await validateAge();

            if (age === undefined) {
                await delay(500).then(() => botIsTyping());
                await delay(1000).then(() => addBotMessage(getRandom(botMessages.validateAge)));
            } else {
                await delay(500).then(() => botIsTyping());
                await delay(1000).then(() => addBotMessage(getRandom(botMessages.confirm)));
            }
        }


        // 3 step (offers)
        await delay(1000).then(() => botIsTyping());
        await delay(2000).then(() => addBotMessage(getRandom(botMessages.offers)));

        await delay(500).then(() => botIsTyping());
        await delay(2000).then(() => sendOffers());


        // step 4 (pre-email)
        await delay(1000).then(() => botIsTyping());
        await delay(2000).then(() => addBotMessage(getRandom(botMessages.preEmailQuestion)));

        await delay(1000).then(() => yesNoHandlersOn(yesNoMessage1));
        await validateYesNo();


        // step 5 (email)
        if (yesNo == 'yes') {

            await delay(250).then(() => botIsTyping());
            await delay(500).then(() => addBotMessage(getRandom(botMessages.confirm)));

            await delay(1000).then(() => botIsTyping());
            await delay(2000).then(() => addBotMessage(getRandom(botMessages.emailQuestion)));

            userInput.type = 'text';
            userInput.placeholder = placeholders.email;
            openUserInput();
            if (chat.clientWidth >= 638) {
                userInput.focus();
            }

            while (email === undefined) {
                userInputHandlersOn();
                await validateEmail();

                if (email === undefined) {
                    await delay(500).then(() => botIsTyping());
                    await delay(1000).then(() => addBotMessage(getRandom(botMessages.validateEmail)));
                } else {
                    await delay(500).then(() => botIsTyping());
                    await delay(1000).then(() => addBotMessage(getRandom(botMessages.confirm)));
                }
            }

        }
        yesNo = undefined;


        // step 6 (end)
        await delay(1000).then(() => botIsTyping());
        await delay(2000).then(() => addBotMessage(getRandom(botMessages.returnToOffers)));

        await delay(1000).then(() => yesNoHandlersOn(yesNoMessage2));
        await validateYesNo();

        if (yesNo == 'yes') {
            chat.scrollTo({top: offers.offsetTop - 160, behavior : 'smooth'});
        } else {
            await delay(500).then(() => botIsTyping());
            await delay(1000).then(() => addBotMessage(getRandom(botMessages.goodbye)));
        }
        yesNo = undefined;

    })();
});
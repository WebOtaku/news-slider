// Возращает ширину видимой части страницы
function getWindowWidth() {
    return window.innerWidth;
}

function getCurVisible(curWindowWidth, breakPoints, maxVisible, visibleElements = []) {
    let curVisible = 0;

    let breakPointIndex = breakPoints.findIndex(breakPoint => curWindowWidth <= breakPoint);

    if (breakPointIndex !== - 1) {
        if (breakPointIndex === 0) {
            curVisible = 1;
        } else {
            curVisible = breakPointIndex + 1;
        }
    } else {
        curVisible = maxVisible;
        /*if (!visibleElements.length)
            curVisible = maxVisible;
        else
            curVisible = visibleElements[1] - visibleElements[2] + 1;*/
    }
    return curVisible;
}

function getNumGroupsVisibleElements(numElements, curVisible) {
    let numGroupsVisibleElements = ~~(numElements / curVisible);

    if (numElements % curVisible !== 0)
        numGroupsVisibleElements++;

    return numGroupsVisibleElements;
}

function getVisibleElements(curGroupVisibleElements, curVisible, numElements) {
    let toElement = curGroupVisibleElements * curVisible - 1;
    let fromElement = toElement - curVisible + 1;
    if (toElement > (numElements - 1)) toElement = numElements - 1;
    return [fromElement, toElement];
}

function setVisibleClass(domElements, visibleElements, visibleClass = 'visible') {
    let fromElement = visibleElements[0];
    let toElement = visibleElements[1];

    domElements.forEach((el) => {
        el.classList.remove(visibleClass);
    });

    for (let i = fromElement; i <= toElement; i++) {
        domElements[i].classList.add(visibleClass);
    }
}

function changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements, direction = 'right') {
    if (direction === 'left') {
        if (curGroupVisibleElements === 1)
            curGroupVisibleElements = numGroupsVisibleElements;
        else if (curGroupVisibleElements > 1)
            curGroupVisibleElements--;
    }

    if (direction === 'right') {
        if (curGroupVisibleElements === numGroupsVisibleElements)
            curGroupVisibleElements = 1;
        else if (curGroupVisibleElements < numGroupsVisibleElements)
            curGroupVisibleElements++;
    }

    return curGroupVisibleElements;
}

function setCSSSlidesNum(curVisible) {
    document.documentElement.style.setProperty('--slide__item-num', curVisible + '');
}

function removeLastSlideMargin(domElements, visibleElements, slideBetweenMargin) {
    domElements.forEach((el) => {
        el.style.setProperty('margin-right', slideBetweenMargin + 'px');
    });
    domElements[visibleElements[1]].style.setProperty('margin-right', 0 + '');
}

function updateSliderCSS(domElements, visibleElements, curVisible, slideBetweenMargin) {
    setCSSSlidesNum(curVisible);
    removeLastSlideMargin(domElements, visibleElements, slideBetweenMargin);
}

function getSlideDomWidth() {
    const docStyles = getComputedStyle(document.documentElement);
    return parseInt(docStyles.getPropertyValue('--slide__item-max-w'));
}

function getSlideBetweenMargin() {
    const docStyles = getComputedStyle(document.documentElement);
    return parseInt(docStyles.getPropertyValue('--slide__item-between-margin'));
}

function getBreakPoints(slideDomWidth, slideBetweenMargin, maxVisible) {
    let breakPoints = [];
    for (let i = 0; i < maxVisible; i++) {
        if (!i)
            breakPoints[i] = slideDomWidth * 2 + slideBetweenMargin * 2;
        else
            breakPoints[i] = breakPoints[i - 1] + slideDomWidth + slideBetweenMargin;
    }

    return breakPoints;
}

/*function getCurGroupsVisibleElements(breakPoints) {
    [1, 1, 1] // [1, 1, 1,] - для каждого брейкпоинта
    [2, 2, 4]
    [3, 4, 7]
    [4, 6, 10] // [3, 5, 10]
}*/

// Список новостей (DOM элементы)
let newsDom = document.querySelectorAll('.news__item');
let numElements = newsDom.length;

let newsDomWidth = getSlideDomWidth();
let newsBetweenMargin = getSlideBetweenMargin();

let maxVisible = 3;

// Ширины при которых происходит изменение кол-ва элементов в слайдере (px)
let breakPoints = getBreakPoints(newsDomWidth, newsBetweenMargin, maxVisible);

let curVisible = getCurVisible(getWindowWidth(), breakPoints, maxVisible);
let numGroupsVisibleElements = getNumGroupsVisibleElements(numElements, curVisible);
let curGroupVisibleElements = 1;
let visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);

let visibleClass = 'visible';
setVisibleClass(newsDom, visibleElements, visibleClass);
updateSliderCSS(newsDom, visibleElements, curVisible);

window.addEventListener(`resize`, (e) => {
    curVisible = getCurVisible(getWindowWidth(), breakPoints, maxVisible);
    numGroupsVisibleElements = getNumGroupsVisibleElements(numElements, curVisible);
    curGroupVisibleElements = 1;
    visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);
    setVisibleClass(newsDom, visibleElements, visibleClass);
    updateSliderCSS(newsDom, visibleElements, curVisible, newsBetweenMargin);
}, false);

let leftArrow = document.querySelector('.controls__button--arrow-left');
let rightArrow = document.querySelector('.controls__button--arrow-right');

leftArrow.addEventListener(`click`, (e) => {
    curGroupVisibleElements = changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements, 'left');
    visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);
    curVisible = getCurVisible(getWindowWidth(), breakPoints, maxVisible, visibleElements);
    setVisibleClass(newsDom, visibleElements, visibleClass);
    updateSliderCSS(newsDom, visibleElements, curVisible, newsBetweenMargin);
}, false);

rightArrow.addEventListener(`click`, (e) => {
    curGroupVisibleElements = changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements, 'right');
    visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);
    curVisible = getCurVisible(getWindowWidth(), breakPoints, maxVisible, visibleElements);
    setVisibleClass(newsDom, visibleElements, visibleClass);
    updateSliderCSS(newsDom, visibleElements, curVisible, newsBetweenMargin);
}, false);

// Возращает ширину элемента
function getElementWidth(domElement) {
    return domElement.clientWidth;
}

function getCurVisible(curElementWidth, breakPoints, maxVisible) {
    let curVisible = 0;

    let breakPointIndex = breakPoints.findIndex(breakPoint => curElementWidth <= breakPoint);

    if (breakPointIndex !== - 1) {
        if (breakPointIndex === 0) {
            curVisible = 1;
        } else {
            curVisible = breakPointIndex + 1;
        }
    } else {
        curVisible = maxVisible;
    }

    return curVisible;
}

function getNumGroupsVisibleElements(numElements, curVisible) {
    let numGroupsVisibleElements = ~~(numElements / curVisible);

    if (numElements % curVisible !== 0)
        numGroupsVisibleElements++;

    return numGroupsVisibleElements;
}

function getVisibleElements(curGroupVisibleElements, curVisible,
                            numElements) {
    let toElement = curGroupVisibleElements * curVisible - 1;
    let fromElement = toElement - curVisible + 1;
    if (toElement > (numElements - 1)) toElement = numElements - 1;
    return [fromElement, toElement];
}

function setVisibleClass(domElements, visibleElements,
                         visibleClass = "visible") {
    let fromElement = visibleElements[0];
    let toElement = visibleElements[1];

    domElements.forEach((el) => {
        el.classList.remove(visibleClass);
    });

    for (let i = fromElement; i <= toElement; i++) {
        domElements[i].classList.add(visibleClass);
    }
}

function changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements,
                                    direction = "right") {
    if (direction === "left") {
        if (curGroupVisibleElements === 1)
            curGroupVisibleElements = numGroupsVisibleElements;
        else if (curGroupVisibleElements > 1)
            curGroupVisibleElements--;
    }

    if (direction === "right") {
        if (curGroupVisibleElements === numGroupsVisibleElements)
            curGroupVisibleElements = 1;
        else if (curGroupVisibleElements < numGroupsVisibleElements)
            curGroupVisibleElements++;
    }

    return curGroupVisibleElements;
}

function setCSSSlidesNum(curVisible, slideNumProp = "--slide__item-num") {
    document.documentElement.style.setProperty(slideNumProp, curVisible + "");
}

function removeLastSlideMargin(domElements, visibleElements, slideBetweenMargin) {
    domElements.forEach((el) => {
        el.style.setProperty("margin-right", slideBetweenMargin + "px");
    });
    domElements[visibleElements[1]].style.setProperty("margin-right", 0 + "");
}

function updateSliderCSS(domElements, visibleElements, curVisible, slideBetweenMargin,
                         slideNumProp = "--slide__item-num") {
    setCSSSlidesNum(curVisible, slideNumProp);
    removeLastSlideMargin(domElements, visibleElements, slideBetweenMargin);
}

function getSlideDomWidth(slideDomWidthProp = "--slide__item-max-w") {
    const docStyles = getComputedStyle(document.documentElement);
    return parseInt(docStyles.getPropertyValue(slideDomWidthProp));
}

function getSlideBetweenMargin(slideBetweenMarginProp = "--slide__item-between-margin") {
    const docStyles = getComputedStyle(document.documentElement);
    return parseInt(docStyles.getPropertyValue(slideBetweenMarginProp));
}

function getBreakPoints(slideDomWidth, slideBetweenMargin, maxVisible) {
    let breakPoints = [];
    for (let i = 0; i < maxVisible - 1; i++) {
        if (!i)
            breakPoints[i] = slideDomWidth * 2 + slideBetweenMargin * 2;
        else
            breakPoints[i] = breakPoints[i - 1] + slideDomWidth + slideBetweenMargin;
    }

    return breakPoints;
}

function checkCurVisibleChange(curVisible, prevVisible) {
    return curVisible !== prevVisible;
}

function resetCurGroupVisibleElements(reset = false, defValue) {
    if (reset) curGroupVisibleElements = defValue;
    return curGroupVisibleElements;
}

// Список новостей (DOM элементы)
let newsDom = document.querySelectorAll(".news__item");

let newsDomWidth = getSlideDomWidth();
let newsBetweenMargin = getSlideBetweenMargin();

let slider_wrapper = document.querySelector(".slider-wrapper");

let numElements = newsDom.length;
let maxVisible = 4;

// Ширины при которых происходит изменение кол-ва элементов в слайдере (px)
let breakPoints = getBreakPoints(newsDomWidth, newsBetweenMargin, maxVisible);

let prevVisible = maxVisible;
let curVisible = getCurVisible(getElementWidth(slider_wrapper), breakPoints, maxVisible);
let numGroupsVisibleElements = getNumGroupsVisibleElements(numElements, curVisible);
let defCurGroupVisibleElements = 1;
let curGroupVisibleElements = defCurGroupVisibleElements;
let visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);

let visibleClass = "visible";
setVisibleClass(newsDom, visibleElements, visibleClass);
updateSliderCSS(newsDom, visibleElements, curVisible);

function checkWrapperSize() {
    requestAnimationFrame(() => {
        prevVisible = curVisible;
        curVisible = getCurVisible(getElementWidth(slider_wrapper), breakPoints, maxVisible);
        curGroupVisibleElements = resetCurGroupVisibleElements(
            checkCurVisibleChange(curVisible, prevVisible),
            defCurGroupVisibleElements
        );
        numGroupsVisibleElements = getNumGroupsVisibleElements(numElements, curVisible);
        visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);
        setVisibleClass(newsDom, visibleElements, visibleClass);
        updateSliderCSS(newsDom, visibleElements, curVisible, newsBetweenMargin);

        checkWrapperSize(slider_wrapper);
    });
}

checkWrapperSize();

let leftArrow = document.querySelector(".controls__button--arrow-left");
let rightArrow = document.querySelector(".controls__button--arrow-right");

leftArrow.addEventListener("click", (e) => {
    curGroupVisibleElements = changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements, "left");
    visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);
    curVisible = getCurVisible(getElementWidth(slider_wrapper), breakPoints, maxVisible, visibleElements);
    setVisibleClass(newsDom, visibleElements, visibleClass);
    updateSliderCSS(newsDom, visibleElements, curVisible, newsBetweenMargin);
}, false);

rightArrow.addEventListener("click", (e) => {
    curGroupVisibleElements = changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements, "right");
    visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numElements);
    curVisible = getCurVisible(getElementWidth(slider_wrapper), breakPoints, maxVisible, visibleElements);
    setVisibleClass(newsDom, visibleElements, visibleClass);
    updateSliderCSS(newsDom, visibleElements, curVisible, newsBetweenMargin);
}, false);

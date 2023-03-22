// Получение одного элемента по селектору (классу, идентификатору, т.д.)
const qs = (selector) => {
    return document.querySelector(selector);
}

// Получение нескольких элементов по селектору (классу, идентификатору, т.д.)
const qsAll = (selector) => {
    return document.querySelectorAll(selector);
}
// Возвращает значение CSS переменной
function getCSSProp(propName) {
    const docStyles = getComputedStyle(document.documentElement);
    return docStyles.getPropertyValue(propName);
}

//Задаёт значение CSS переменной
function setCSSProp(propName, value) {
    document.documentElement.style.setProperty(propName, value + "");
}

// Возвращает ширину DOM-элемента
function getElementWidth(domElement)
{
    return domElement.clientWidth;
}

// Возвращает число элементов слайдера, которое можно отобразить при текущем разрешении
function getCurVisible(curElementWidth, breakPoints, maxVisible)
{
    let curVisible = 0;

    let breakPointIndex = breakPoints.findIndex(breakPoint => curElementWidth <= breakPoint);

    if (breakPointIndex !== - 1)
        curVisible = breakPointIndex + 1;
    else
        curVisible = maxVisible;

    return curVisible;
}

// Рассчитывает и возвращает число групп элементов слайдера
function getNumGroupsVisibleElements(numElements, curVisible)
{
    let numGroupsVisibleElements = ~~(numElements / curVisible);

    if (numElements % curVisible !== 0)
        numGroupsVisibleElements++;

    return numGroupsVisibleElements;
}

// Рассчитывает и возвращает индексы элементов слайдера (в виде диапазона), которые будут отображены
function getVisibleElements(curGroupVisibleElements, curVisible, numElements)
{
    let toElement = curGroupVisibleElements * curVisible - 1;
    let fromElement = toElement - curVisible + 1;
    if (toElement > (numElements - 1)) toElement = numElements - 1;
    return [fromElement, toElement];
}
// Добавляет класс видимости элементам из диапазона visibleElements
function setVisibleClass(domElements, visibleElements, visibleClass)
{
    let fromElement = visibleElements[0];
    let toElement = visibleElements[1];

    // Два цикла можно объеденить в один с помощью условия в цикле foreach
    domElements.forEach((el) => {
        el.classList.remove(visibleClass);
    });

    for (let i = fromElement; i <= toElement; i++) {
        domElements[i].classList.add(visibleClass);
    }
}

// Уменьшает или увеличивает значение текущей группы элементов
function changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements, direction = "right")
{
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

// Удаляет отступ у последнего элемента из диапазона индексов
function removeLastSlideMargin(domElements, visibleElements, slideBetweenMargin)
{
    domElements.forEach((el) => {
        el.style.setProperty("margin-right", slideBetweenMargin + "px");
    });
    domElements[visibleElements[1]].style.setProperty("margin-right", 0 + "");
}

// Функция-обёртка над функциями setCSSProp() и removeLastSlideMargin()
function updateSliderCSS(domElements, visibleElements, curVisible, slideBetweenMargin, slideNumProp)
{
    setCSSProp(slideNumProp, curVisible);
    removeLastSlideMargin(domElements, visibleElements, slideBetweenMargin);
}

// Рассчитывает ширины (breakPoints), при которых происходит изменение кол-ва элементов в слайдере
function getBreakPoints(slideDomWidth, slideBetweenMargin, maxVisible)
{
    let breakPoints = [];
    for (let i = 0; i < maxVisible - 1; i++) {
        if (!i)
            breakPoints[i] = slideDomWidth * 2 + slideBetweenMargin * 2;
        else
            breakPoints[i] = breakPoints[i - 1] + slideDomWidth + slideBetweenMargin;
    }

    return breakPoints;
}

// Проверяет, изменилось ли число элементов слайдера или нет
function checkCurVisibleChange(curVisible, prevVisible)
{
    return curVisible !== prevVisible;
}

// Сбрасывает к базовому значению текущую группу элементов слайдера или нет
function resetCurGroupVisibleElements(curGroupVisibleElements, defValue, reset = false)
{
    if (reset) curGroupVisibleElements = defValue;
    return curGroupVisibleElements;
}

// Корректирует значение максимального числа одновременно отображаемых элементов слайдера
function correctMaxVisible(maxVisible, numElements)
{
    if (maxVisible > numElements)
        maxVisible = numElements;
    else if (maxVisible < 1)
        maxVisible = 1;

    return maxVisible;
}

// Дефолтные значения
const defCurGroupVisibleElements = 1; // текущая группа элементов

// Классы элементов
const slideClass = ".slider__item"; // класс контейнера для элемента слайдера
const sliderWrapperClass = ".slider-wrapper"; // класс обёртки для слайдера
const leftArrowClass = ".controls__button--arrow-left"; // класс элемента управленя "стрелка налево"
const rightArrowClass = ".controls__button--arrow-right"; // класс элемента управленя "стрелка направо"

const visibleClass = "visible"; // класс отвечающий за то отображается элемент слайдера или нет (без точки)

// Используемые CSS переменные
const slideNumProp = "--slide__item-num"; // св-во хранящее текущее кол-во элементов слайдера
const slideDomWidthProp = "--slide__item-max-w"; // св-во хранящее ширину одного элемента слайдера
const slideBetweenMarginProp = "--slide__item-between-margin"; // св-во хранящее отступ между элементами слайдера

// DOM элементы
const sliderElements = qsAll(slideClass); // список элементов слайдера
const sliderWrapper = qs(sliderWrapperClass); // обёртка для слайдера
const leftArrow = qs(leftArrowClass); // элемент управленя "стрелка налево"
const rightArrow = qs(rightArrowClass); // элемент управленя "стрелка направо"

// Значения CSS переменных
const slideDomWidth = parseInt(getCSSProp(slideDomWidthProp)); // ширина одного элемента слайдера
const slideBetweenMargin = parseInt(getCSSProp(slideBetweenMarginProp)); // отступ между элементами слайдера

let maxVisible = 3; // максимальное число одновременно отображаемых элементов слайдера
const numSliderElements = sliderElements.length; // число элементов слайдера

maxVisible = correctMaxVisible(maxVisible, numSliderElements);

// Список ширин при которых происходит изменение кол-ва элементов в слайдере (px)
const breakPoints = getBreakPoints(slideDomWidth, slideBetweenMargin, maxVisible);

// Предыдущее и текущее число элементов слайдера,
// которое можно отобразить при данном разрешении
let prevVisible = maxVisible;
let curVisible = getCurVisible(getElementWidth(sliderWrapper), breakPoints, maxVisible);

// Кол-во групп элементов слайдера (размер каждой группы равен curVisible)
// и текущая группа элементов
let numGroupsVisibleElements = getNumGroupsVisibleElements(numSliderElements, curVisible);
let curGroupVisibleElements = defCurGroupVisibleElements;

// Диапазон индексов текущих отображаемых элементов
let visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numSliderElements);

setVisibleClass(sliderElements, visibleElements, visibleClass);
updateSliderCSS(sliderElements, visibleElements, curVisible, slideBetweenMargin, slideNumProp);

// Обработчик нажатия на элементы управления (стрелки) слайдера
const arrrowClick = (direction) => {
    curGroupVisibleElements = changeGroupVisibleElements(curGroupVisibleElements, numGroupsVisibleElements, direction);
    visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numSliderElements);
    curVisible = getCurVisible(getElementWidth(sliderWrapper), breakPoints, maxVisible);
    setVisibleClass(sliderElements, visibleElements, visibleClass);
    updateSliderCSS(sliderElements, visibleElements, curVisible, slideBetweenMargin, slideNumProp);
}

// Обрабатываемые события
leftArrow.addEventListener("click", arrrowClick.bind(this, "left"), false);
rightArrow.addEventListener("click", arrrowClick.bind(this, "right"), false);

// Функция отвечающая за отслеживания ширины обёртки слайдера
(function checkWrapperSize() {
    requestAnimationFrame(() => {
        prevVisible = curVisible;
        curVisible = getCurVisible(getElementWidth(sliderWrapper), breakPoints, maxVisible);

        let isCurVisibleChange = checkCurVisibleChange(curVisible, prevVisible);

        if (isCurVisibleChange) {
            curGroupVisibleElements = resetCurGroupVisibleElements(
                curGroupVisibleElements,
                defCurGroupVisibleElements,
                isCurVisibleChange
            );
            numGroupsVisibleElements = getNumGroupsVisibleElements(numSliderElements, curVisible);
            visibleElements = getVisibleElements(curGroupVisibleElements, curVisible, numSliderElements);
            setVisibleClass(sliderElements, visibleElements, visibleClass);
            updateSliderCSS(sliderElements, visibleElements, curVisible, slideBetweenMargin, slideNumProp);
        }

        checkWrapperSize(sliderWrapper);
    });
})();

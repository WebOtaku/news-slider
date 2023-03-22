<?php
function getSliderNewsHTML() {
    $xml = file_get_contents('https://marsu.ru/rss/');
    $parsed_xml = new SimpleXMLElement($xml);
    $news_xml = $parsed_xml->channel->item;
    $news = [];

    $news_num = count($news_xml) - 8; //12

    $months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    for ($i = 0; $i < $news_num; $i++) {
        $news[$i]['title'] = $news_xml[$i]->title;
        $news[$i]['description'] = $news_xml[$i]->description;
        $news[$i]['link'] = $news_xml[$i]->link;
        $news[$i]['image_link'] = $news_xml[$i]->enclosure->attributes()->url;
        $date_arr = date_parse($news_xml[$i]->pubDate);
        $date = $date_arr['day'] . ' ' . $months[$date_arr['month'] - 1] . ' ' . $date_arr['year'];
        $news[$i]['date'] = $date;
    }

    $pageHTML = '';

    $pageHTML .= '<div class="slider-wrapper">';
    $pageHTML .= '<div class="slider">';
    $pageHTML .= '
        <style type="text/css">
            :root {
                --slide__item-bg-color: #fff;
                --slide__item-max-w: 224px;
                --slide__item-max-h: 310px;
                --slide__item-between-margin: 15px;
                --slide__item-num: 3;
            }

            .slider-wrapper {
                display: flex;
                justify-content: center;
            }

            .slider {
                max-width: calc(var(--slide__item-max-w) * var(--slide__item-num) + var(--slide__item-between-margin) * (var(--slide__item-num) - 1));
            }

            .slider, .slider * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                text-decoration: none;
            }

            .slider__container {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
            }

            .news__item {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                width: var(--slide__item-max-w);
                height: var(--slide__item-max-h);
                background-color: var(--slide__item-bg-color);
            }

            .news__images-wrapper {
                position: absolute;
                top: 0;
                display: flex;
                align-items: flex-start;
                width: 100%;
                overflow: hidden;
                height: calc(var(--slide__item-max-h) / 1.6);
            }

            .news__image {
                width: 100%;
            }

            .news__date {
                position: absolute;
                bottom: 0;
                display: flex;
                align-items: center;
                padding: 0 15px;
                width: 100%;
                font-size: 14px;
                color: #999;
                background-color: #fff;
                height: calc(var(--slide__item-max-h) / 9);
                font-family: "Glober regular", sans-serif;
            }

            .news__title {
                display: flex;
                width: 100%;
                padding: 0 15px;
                font-size: 14px;
                color: #4f4f4f;
                font-family: "Glober regular", sans-serif;

            }

            .news__content {
                position: absolute;
                bottom: 0;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                padding: 15px 0 0;
                background-color: #fff;
                height: calc(var(--slide__item-max-h) / 2.4);
                overflow: hidden;
                transition: height .25s ease-in-out;;
            }

            .news__content:hover {
                height: calc(var(--slide__item-max-h) / 1.5);
            }

            .news__link:link,
            .news__link:visited {
                color: #000;
            }

            .slider__item {
                display: none;
                border: 1px solid #d7d7d7;
                margin-bottom: var(--slide__item-between-margin);
                margin-right: var(--slide__item-between-margin);
            }

            .visible {
                display: flex;
            }

            .slider__controls {
                display: flex;
                justify-content: center;
            }

            .controls__button--arrow-left,
            .controls__button--arrow-right {
                background-color: #fff;
                border: 1px solid #d7d7d7;
                color: #4f4f4f;
                font-size: 20px;
                padding: 5px 20px;
                cursor: pointer;
            }

            .controls__button--arrow-left {
                margin-right: var(--slide__item-between-margin);
            }
        </style>
    ';

    $pageHTML .= '<div class="slider__container news">';

    foreach ($news as $item) {
        $pageHTML .= '
            <section class="news__item slider__item">
                <div class="news__images-wrapper">
                    <img class="news__image" src="'.$item['image_link'].'"
                         alt="Новость" loading="lazy" decoding="async">
                </div>
                <div class="news__content">
                    <a class="news__link" href="'.$item['link'].'"><p class="news__title">'.$item['title'].'</p></a>
                    <p class="news__date">'.$item['date'].'</p>
                </div>
            </section>';

    }

    $pageHTML .= '</div>';

    $pageHTML .= '
        <div class="slider__controls controls">
            <button id="controls__button--arrow-left" class="controls__button controls__button--arrow-left" type="button"><</button>
            <button id="controls__button--arrow-right" class="controls__button controls__button--arrow-right" type="button">></button>
        </div>
    ';

    $pageHTML .= '
        <script type="text/javascript">
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
        </script>
    ';

    $pageHTML .= '</div>';
    $pageHTML .= '</div>';

    return $pageHTML;
}

echo getSliderNewsHTML();

?>



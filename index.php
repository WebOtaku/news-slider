<?php
    $xml = file_get_contents('https://marsu.ru/rss/');
    $parsed_xml = new SimpleXMLElement($xml);
    $news_xml = $parsed_xml->channel->item;
    $news = [];

    $news_num = count($news_xml) - 8; // 20 - 8 = 12

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
?>

<!doctype html>
<html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Новости</title>
    </head>
    <body>
        <div class="slider-wrapper">
            <link rel="stylesheet" href="main.css">
            <div class="slider">
                <div class="slider__container news">
                    <?php foreach ($news as $item): ?>
                    <section class="news__item slider__item">
                        <div class="news__images-wrapper">
                            <img class="news__image" src="<?=$item['image_link']?>"
                                 alt="Новость" loading="lazy" decoding="async">
                        </div>
                        <div class="news__content">
                            <a class="news__link" href="<?=$item['link']?>"><p class="news__title"><?=$item['title']?></p></a>
                            <p class="news__date"><?=$item['date']?></p>
                        </div>
                    </section>
                    <?php endforeach;?>
                </div>

                <div class="slider__controls controls">
                    <button id="controls__button--arrow-left" class="controls__button controls__button--arrow-left" type="button"><</button>
                    <button id="controls__button--arrow-right" class="controls__button controls__button--arrow-right" type="button">></button>
                </div>
            </div>
            <script src="app.js"></script>
        </div>
    </body>
</html>

/* Bulgarian initialisation for the jQuery UI date picker plugin. */
/* Written by Stoyan Kyosev (http://svest.org). */
jQuery(function($){
    $.datepicker.regional['bg'] = {clearText: 'изчисти', clearStatus: 'изчисти актуалната дата',
        closeText: 'затвори', closeStatus: 'затвори без промени',
        prevText: '&#x3c;назад', prevStatus: 'покажи последния месец',
        nextText: 'напред&#x3e;', nextStatus: 'покажи следващия месец',
        currentText: 'днес', currentStatus: '',
        monthNames: ['Януари','Февруари','Март','Април','Май','Юни',
        'Юли','Август','Септември','Октомври','Ноември','Декември'],
        monthNamesShort: ['Яну','Фев','Мар','Апр','Май','Юни',
        'Юли','Авг','Сеп','Окт','Нов','Дек'],
        monthStatus: 'покажи друг месец', yearStatus: 'покажи друга година',
        weekHeader: 'Wk', weekStatus: 'седмица от месеца',
        dayNames: ['Неделя','Понеделник','Вторник','Сряда','Четвъртък','Петък','Събота'],
        dayNamesShort: ['Нед','Пон','Вто','Сря','Чет','Пет','Съб'],
        dayNamesMin: ['Не','По','Вт','Ср','Че','Пе','Съ'],
        dayStatus: 'Сложи DD като първи ден от седмицата', dateStatus: 'Избери D, M d',
        dateFormat: 'dd.mm.yy', firstDay: 1,
        initStatus: 'Избери дата', isRTL: false};
    $.datepicker.setDefaults($.datepicker.regional['bg']);
});

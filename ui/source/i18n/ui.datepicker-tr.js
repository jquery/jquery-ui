/* Turkish initialisation for the jQuery UI date picker plugin. */
/* Written by Izzet Emre Erkan (kara@karalamalar.net). */
jQuery(function($){
	$.datepicker.regional['tr'] = {clearText: 'temizle', clearStatus: 'geçerli tarihi temizler',
		closeText: 'kapat', closeStatus: 'sadece göstergeyi kapat',
		prevText: '&#x3c;geri', prevStatus: 'önceki ayı göster',
		nextText: 'ileri&#x3e', nextStatus: 'sonraki ayı göster',
		currentText: 'bugün', currentStatus: '',
		monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
		'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
		monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz',
		'Tem','Ağu','Eyl','Eki','Kas','Ara'],
		monthStatus: 'başka ay', yearStatus: 'başka yıl',
		weekHeader: 'Hf', weekStatus: 'Ayın haftaları',
		dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
		dayNamesShort: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
		dayNamesMin: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
		dayStatus: 'Haftanın ilk gününü belirleyin', dateStatus: 'D, M d seçiniz',
		dateFormat: 'dd.mm.yy', firstDay: 1, 
		initStatus: 'Bir tarih seçiniz', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['tr']);
});
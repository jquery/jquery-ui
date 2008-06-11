/* Indonesian initialisation for the jQuery UI date picker plugin. */
/* Written by Deden Fathurahman (dedenf@gmail.com). */
jQuery(function($){
	$.datepicker.regional['id'] = {clearText: 'kosongkan', clearStatus: 'bersihkan tanggal yang sekarang',
		closeText: 'Tutup', closeStatus: 'Tutup tanpa mengubah',
		prevText: '&lt;mundur', prevStatus: 'Tampilkan bulan sebelumnya',
		nextText: 'maju&gt;', nextStatus: 'Tampilkan bulan berikutnya',
		currentText: 'hari ini', currentStatus: 'Tampilkan bulan sekarang',
		monthNames: ['Januari','Februari','Maret','April','Mei','Juni',
		'Juli','Agustus','September','Oktober','Nopember','Desember'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun',
		'Jul','Agus','Sep','Okt','Nop','Des'],
		monthStatus: 'Tampilkan bulan yang berbeda', yearStatus: 'Tampilkan tahun yang berbeda',
		weekHeader: 'Mg', weekStatus: 'Minggu dalam tahun',
		dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
		dayNamesShort: ['Min','Sen','Sel','Rab','kam','Jum','Sab'],
		dayNamesMin: ['Mg','Sn','Sl','Rb','Km','jm','Sb'],
		dayStatus: 'gunakan DD sebagai awal hari dalam minggu', dateStatus: 'pilih le DD, MM d',
		dateFormat: 'dd/mm/yy', firstDay: 0, 
		initStatus: 'Pilih Tanggal', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['id']);
});
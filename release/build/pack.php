<?php

if ($argc >= 3) {
	$src = $argv[1];
	$out = $argv[2];
} else {
	echo 'you must specify  a source file and a result filename',"\n";
	echo 'example :', "\n", 'php pack.php myScript-src.js myPackedScript.js',"\n";
	return;
}

require 'class.JavaScriptPacker.php';

$script = file_get_contents($src);

$packer = new JavaScriptPacker($script, 'Normal', true, false);
$packed = $packer->pack();

file_put_contents($out, $packed);
?>

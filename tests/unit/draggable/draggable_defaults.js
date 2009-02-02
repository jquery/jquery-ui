/*
 * draggable_defaults.js
 */

var draggable_defaults = {
	addClasses: true,
	appendTo: "parent",
	axis: false,
	cancel: ":input,option",
	connectToSortable: false,
	containment: false,
	cursor: "auto",
	cursorAt: false,
	delay: 0,
	disabled: false,
	distance: 1,
	grid: false,
	handle: false,
	helper: "original",
	iframeFix: false,
	opacity: false,
	refreshPositions: false,
	revert: false,
	revertDuration: 500,
	scroll: true,
	scrollSensitivity: 20,
	scrollSpeed: 20,
	scope: "default",
	snap: false,
	snapMode: "both",
	snapTolerance: 20,
	stack: false,
	zIndex: false
};

commonWidgetTests('draggable', { defaults: draggable_defaults });

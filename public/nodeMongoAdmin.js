$(function() {

	function init(table) {
		var nbCols = table.find("th").length;
		return {
			row: 1,
			col: 0,
			elem: null,
			prev: {},
			_updateElem: function(newElem) {
				$(this.elem).removeClass("sel");
				for (var i in this)
					this.prev[i] = this[i];
				this.elem = newElem.addClass("sel");
			},
			selectByRowCol: function(row, col) {
				this.row = row;
				this.col = col;
				this._updateElem($('tr:eq('+row+')').find('td:eq('+col+')'));
			},
			selectByElem: function(elem) {
				var index = $("td").index(elem)
				this.col = index % nbCols;
				this.row = 1+ Math.floor(index / nbCols);
				console.log(this.row, this.col);
				this._updateElem(elem);
			}
		};
	}
	
	var cursor = init($("table"));
	
	$("td").click(function(){
		cursor.selectByElem($(this));
	});
});

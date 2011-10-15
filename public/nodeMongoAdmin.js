$(function() {

	function message(msg) {
		var $box = $("#msgBox");
		$box.html(msg).fadeIn("fast");
		setTimeout(function(){$box.fadeOut("slow");}, 5000);
	}
	
	function Cursor($table) {
		var $cols = $table.find("th");
		var $rows = $table.find("tr");
		var nbCols = $cols.length;
		var nbRows = $rows.length;
		var handlers = {};
		//console.log("nbCols, nbRows", nbCols, nbRows);
		return {
			row: 1,
			col: 0,
			elem: null,
			prev: {},
			addHandler: function(eventName, handler) {
				handlers[eventName] = handler;
			},
			triggerEvent: function (eventName, params) {
				var handler = handlers[eventName];
				if (handler) handler(this, params);
			},
			_updateElem: function(newElem) {
				$(this.elem).removeClass("sel");
				for (var i in this)
					this.prev[i] = this[i];
				this.elem = newElem.addClass("sel");
				this.triggerEvent("onCellSelection");
			},
			selectByRowCol: function(row, col) {
				//console.log("new", row, col);
				if (row <= 0 || row >= nbRows || col < 0 || col >= nbCols)
					return;
				this.row = row;
				this.col = col;
				this._updateElem($('tr:eq('+row+')').find('td:eq('+col+')'));
			},
			selectByIncr: function (rowIncr, colIncr) {
				var newRow = this.row + (rowIncr || 0);
				var newCol = this.col + (colIncr || 0);
				this.selectByRowCol(newRow, newCol);
			},
			selectByElem: function(elem) {
				var index = $("td").index(elem)
				this.col = index % nbCols;
				this.row = 1+ Math.floor(index / nbCols);
				this._updateElem(elem);
			},
			val: function (newVal){
				if (newVal)
					return this.elem.html(newVal);
				return this.elem.html();
			},
			getColumnName: function(col) {
				return $cols.eq(col || this.col).html();
			},
			getRowId: function() {
				return this.elem.closest("tr").find("td").first().html();
			}
		};
	};

	function CellEditor ($editor) {
		var $field = $editor.find("textarea");
		var $saveButton = $editor.find("button");
		var cursor = null;
		var cellEditor = {
			onCellSelection: function (newCursor) {
				cursor = newCursor;
				$field.val(newCursor.val());
			}
		};
		$saveButton.click(function() {
			var reqData = {
				action: "update",
				_id: cursor.getRowId()
			};
			var newVal = $field.val();
			reqData[cursor.getColumnName()] = newVal;
			console.log("update", reqData);
			$.ajax({
				data: reqData,
				success: function (r) {
					cursor.val(newVal);
					message("Successfully saved");
				}
			});
		});
		return cellEditor;
	}
	
	var cellEditor = new CellEditor($("#editor"));
	
	var cursor = new Cursor($("table"));
	cursor.addHandler("onCellSelection", cellEditor.onCellSelection);
	
	$("td").click(function(){
		cursor.selectByElem($(this));
	});
	
	$(window).keyup(function(e) {
		var keyCode = e.keyCode
		if (keyCode == 38) // up
			cursor.selectByIncr(-1, 0);
		else if (keyCode == 40) // down
			cursor.selectByIncr(1, 0);
		else if (keyCode == 37) // left
			cursor.selectByIncr(0, -1);
		else if (keyCode == 39) // right
			cursor.selectByIncr(0, 1);
	});
});

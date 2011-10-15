$(function() {

	function message(msg) {
		var $box = $("#msgBox");
		$box.html(msg).fadeIn("fast");
		setTimeout(function(){$box.fadeOut("slow");}, 5000);
	}
	
	function Cursor($table) {
		var $cols, $rows, nbCols, nbRows;
		var handlers = {};
		var cursor = {
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
				if (row > 0 && row < nbRows)
					this.row = row;
				if (col >= 0 && col < nbCols)
					this.col = col;
				this._updateElem($('tr:eq('+this.row+')').find('td:eq('+this.col+')'));
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
			getRowId: function($tr) {
				return ($tr || this.elem.closest("tr")).find("td").first().html();
			},
			reindexTable: function() {
				$cols = $table.find("th");
				$rows = $table.find("tr");
				nbCols = $cols.length -1;
				nbRows = $rows.length;
				//console.log("nbCols, nbRows", nbCols, nbRows);
			}
		};
		cursor.reindexTable();
		return cursor;
	};

	function CellEditor ($editor) {
		var $field = $editor.find("textarea");
		var $saveButton = $editor.find("button");
		var cursor = null;
		var cellEditor = {
			onCellSelection: function (newCursor) {
				cursor = newCursor;
				$field.val(newCursor.val());
				$field.attr("placeholder", "enter a value for " + newCursor.getColumnName());
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
	
	function initRow() {
		var $row = $(this);
		var $cells = $row.find("td").click(function(){
			var $cell = $(this);
			if (!$cell.hasClass("actions"))
				cursor.selectByElem($cell);
		});
		var $del = $('<div class="del">x</div>').click(function() {
			confirm("delete id=" + cursor.getRowId($row));
		});
		$cells.last().append($del);
	}
	
	var $editor = $("#editor");
	var $table = $("table");
	
	var cellEditor = new CellEditor($editor);
	
	var cursor = new Cursor($table);
	cursor.addHandler("onCellSelection", cellEditor.onCellSelection);
	
	$("tr").each(initRow);
	
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
	
	var $btnCreate = $("#createRow");
	$btnCreate.click(function() {
		var rowHtml = '';
		for (var i=0; i<$("th").length; ++i)
			rowHtml += "<td></td>";
		rowHtml = $('<tr class="newRow">'+rowHtml+'</tr>');
		rowHtml.each(initRow);
		$table.append(rowHtml);
		cursor.reindexTable();
		var lastRow = $("tr").length -1;
		cursor.selectByRowCol(lastRow, 1);
	});
});

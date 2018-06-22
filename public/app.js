$("#scrape").on("click", function(){
	$.ajax({
		method: "GET",
		url: "/scrape",
	}).then(function(data){
		window.location = "/"
	});
});

$(document).on("click", "h3", function(){
	$("#notes").empty();
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	.then(function(data){
		console.log(data);
		$("#note").html(`
			<h5>${data.title}</h5>
			<input id="titleinput" name="title">
			<textarea id="bodyinput" name="body"></textarea><br>
			<button class="btn btn-primary" data-id="${data._id}" id="savenote">Save Note</button>
			`)
	if (data.note){
		$("#titleinput").val(data.note.title);
		$("#bodyinput").val(data.note.body);
	}
	});
});

$(document).on("click", "#savenote", function(){
	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	})
	.then(function(data){
		console.log(data);
		$("#note").empty();
	});

	$("#titleinput").val("");
	$("#bodyinput").val("");
});

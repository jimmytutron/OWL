$("#scrape").on("click", function(){
	$.ajax({
		method: "GET",
		url: "/scrape",
	}).then(function(data){
		window.location = "/"
	});
});

$(".save").on("click", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/save/" + thisId
	}).then(function(data){
		console.log("saved!");
	});
});

$(".delete").on("click", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/remove/" + thisId
	}).then(function(data){
		console.log("removed");
		location.reload();
	});
});

$(".view-note").on("click", function(){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "GET",
		url: "/saved-posts/" + thisId
	}).then(function(data){
		console.log(data.notes);
		$(".note").text(data.notes.body);
	});
});

$(".save-note").on("click", function(){
	var thisId = $(this).attr("data-id");
	if(!$("#bodyinput").val()){
		$(".no-text").html(`<br><p class="text-muted">You didn't type anything...</p>`);
	}
	else{
		$.ajax({
			method: "POST",
			url: "/saved-posts/" + thisId,
			data: {
				body: $("#bodyinput").val()
			}
		}).then(function(data){
			console.log(data);
			location.reload();
		});
	}
});


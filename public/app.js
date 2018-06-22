$.getJSON("/articles", function(data){
	for (var i = 0; i < data.length; i++){
		$("#articles").append(`
 	<div class="row justify-content-center">
		<div class="col-12">
			<h1 data-id="${data[i]._id}">${data[i].title}</h1>
			<a href="${data[i].link}">View Post</a>
		</div>
	</div>
	`)
	}
});


<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Chat</title>
	<link rel="stylesheet" href="/private/css/main.css">
    <link rel="stylesheet" href="/private/css/but.css">
</head>
<body>

<h1 style="color:white;"> HL Demo PHP APP </h1>
<div class="form-group">

<style>
.form-group {
  max-width: 600px;
  margin: auto;
}
</style>

	<style>
		body {
			background-image : url("https://auth.ost-dc.hacking-lab.com/auth/resources/998e9/login/hacking-lab/img/bg.jpg");
		},
	</style>

    <img src="https://auth.ost-dc.hacking-lab.com/auth/resources/998e9/login/hacking-lab/img/logo.svg" alt="Hacking Lab Logo" width="500" height="200">
	<br>

	<label for="name" style="color:white;">Enter Your Name</label>

	

	<input type="text" class="form-control" id="name" placeholder="Enter name" style="width: 120px; height: 20px; background-color: #f2f2f2;">


    <button type="submit" class="btn btn-primary" id="send" onclick="alert('Hello ' + document.getElementById('name').value + '!')">Submit</button>

	<div id="messages"></div>
   
	

	<script src="/private/js/jquery-3.3.1.min.js"></script>


    <script>
		$(function() {
			var socket = io();
			$('form').submit(function(){
				socket.emit('chat message', $('#name').val() + ': ' + $('#message').val());
				$('#message').val('');
				return false;
			});
			socket.on('chat message', function(msg){
				$('#messages').append($('<li>').text(msg));
			});
		});

	</script>
	
</div>


</body>
</html>


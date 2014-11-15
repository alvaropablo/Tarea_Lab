$(function($) {
	// vemos el evento de teclado sobre el campo de texto nickname y verificamos si el usuario a presionado ENTER
	//y que no este vacio 
	var socket=io();
	$("#nickname").keydown(function(event) {
		if(event.keyCode==13 && $(this).val()!="")
		{
			socket.emit("setnickname",{"nick":$(this).val()});
			//socket.emit("getlista",{});
		}
	});
	socket.on('setnickname', function(response) {
		if(response.server===true)
		{
			loadhtml("/saladechat/");
			$("#nickname").attr('disabled','true');
			//socket.emit("getlista",{});
		}else{
			alert(response.server);
		}
	});
	socket.on('mensajes', function(response) {
		console.log(response);
		$("#mensajes").append("<li>"+response.nick+">"+response.msn+"</li>");
	});
	socket.on('getlista', function(response) {
		console.log(response);
		console.log(response.lista);
		html="";
		for(var i=0;i<response.lista.length;i++)
		{
			html=html+("<li>"+response.lista[i].nick+"</li>");
		}
		console.log(html);
		$("#usuarios").html(html);
	});
	var loadhtml=function(url)
	{
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			data: {},
		})
		.done(function(html) {
			//alert(html);
			$("#content").html(html);
			enabledchat();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
		});
		
	};
	var enabledchat=function()
	{
		$("#menvio").keydown(function(event) {
			if(event.keyCode==13)
			{
				socket.emit("mensajes",{"nick":$("#nickname").val(),"msn":$(this).val()});
				$(this).val("");
			}
		});
	};
});
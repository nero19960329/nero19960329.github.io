$(document).bind({
	ready: function() {
		setDynamicWidgets();
		setStaticWidgets();
	}
});

// 确定昵称
function confirmNick() {
	var nickname = $('#chat_nickname input').attr('value');
	if (nickname === 'Enter your nickname...') {
		nickname = "";
	}
	if (nickname.length > 8) {
		alert("昵称长度不能大于8！");
		return;
	}

	if (nickname == "") {
		$('#chat_nickname input').replaceWith('<span id="chat_confirmedNick">anonymous</span>');
	} else {
		// 考虑重名的情况
		usersRef.once('value', function(snapshot) {
			var sameFlag = false;
			var userlist = snapshot.val();
			for (var p in userlist) {
				if (userlist[p].username === nickname) {
					sameFlag = true;
					break;
				}
			}
			if (sameFlag === true) {
				alert("您的昵称与聊天室内其他用户冲突！请更换");
			} else {
				$('#chat_nickname input').replaceWith('<span id="chat_confirmedNick">' + nickname + '</span>');
				// 把用户名上传至服务器
				var nicknameRef = usersRef.push({username: nickname});
				nicknameRef.onDisconnect().remove();
				$('#chat_nickOKButton').remove();
			}
		});
	}
}

// 清空昵称输入框的文字
function clearNick() {
	if ($('#chat_nickname input').attr('value') === 'Enter your nickname...') {
		$('#chat_nickname input').attr('value', '');
	}
}

// 昵称输入框失去焦点时，设置其样式
function handleNick() {
	var nicknameInput = $('#chat_nickname input');
	var nickname = nicknameInput.attr('value');
	if (nickname === 'Enter your nickname...' || nickname === '') {
		nicknameInput.attr('value', 'Enter your nickname...');
		nicknameInput.css('color', '#888');
	} else {
		nicknameInput.css('color', '#000');
	}
}

// 昵称输入框得到焦点时，改变字体颜色
function colorChangeNick() {
	$('#chat_nickname input').css('color', '#000');
}

function clearInput() {
	if ($('#chat_inputArea').attr('value') === 'Type something...') {
		$('#chat_inputArea').attr('value', '');
		$('#chat_inputArea').css('color', '#000');
	}
}

function colorChangeInput() {
	$('#chat_inputArea').css('color', '#000');
}

function setDynamicWidgets() {
	$('#chat_roomArea').css('width', $('#chat_allArea').width() * 0.25 - 20);
	$('#chat_mainArea').css('width', $('#chat_allArea').width() * 0.75 - 20);
	$('#chat_leftArea').css('width', $('#chat_mainArea').width() * 0.75 - 15);
	$('#chat_rightArea').css('width', $('#chat_mainArea').width() * 0.25 - 15);

	$('#chat_inputArea').css('width', $('#chat_leftArea').width() - 5);
}

function setStaticWidgets() {
	$('#chat_closeButton').hover(
		function(e) {
			$(this).attr('src', 'src/closebutton_hover.png');
		},

		function(e) {
			$(this).attr('src', 'src/closebutton_normal.png')
		}
	);

	$('#chat_closeButton').bind({
		mousedown: function(e) {
			$(this).attr('src', 'src/closebutton_down.png');
		},

		mouseup: function(e) {
			$(this).attr('src', 'src/closebutton_hover.png');
		}
	});

	$('#chat_sendButton').hover(
		function(e) {
			$(this).css('background-color', '#f2ca57');
		},

		function(e) {
			$(this).css('background-color', '#e6ddc3');
		}
	);

	$('#chat_sendButton').bind({
		mousedown: function(e) {
			$(this).css('background-color', '#c8a92b');
		},

		mouseup: function(e) {
			$(this).css('background-color', '#f2ca57');
			sendMessage();
		}
	});
}

function sendMessage() {
	var nickname;
	// 昵称已经确认
	if ($('#chat_confirmedNick').length != 0) {
		nickname = $('#chat_confirmedNick').html();
	} else {
		alert("请输入昵称！");
		return;
	}

	var message = messageField.attr('value');
	if (message === 'Type something...') {
		message = '';
	}
	if (message === '') {
		alert('发送内容不能为空！');
		return;
	}

	messagesRef.push({name: nickname, text: message});
	messageField.val('');
	messageField.attr('value', '');
}

var usersRef = new Firebase('https://nicochatroom.firebaseio.com/room0/users');
var messagesRef = new Firebase('https://nicochatroom.firebaseio.com/room0/messages');
var messageField = $('#chat_inputArea');
var nameField = $('#chat_nickname input');
var messageList = $('#chat_chatArea');

usersRef.on('child_added', function(snapshot) {
	console.log("child_added: " + snapshot.val().username);
	var newuser = $('<li>' + snapshot.val().username + '</li>');
	$('#chat_list').append(newuser);
});

usersRef.on('child_removed', function(snapshot) {
	console.log("removed: " + snapshot.val().username);
	var outuser = $('#chat_list li:contains(' + snapshot.val().username + ')');
	outuser.remove();
});

messageField.keypress(function(e) {
	if (e.keyCode == 13) {
		sendMessage();
		return false;
	}
});

messagesRef.limitToLast(15).on('child_added', function(snapshot) {
	var data = snapshot.val();
	var username = data.name || "anonymous";
	username = username + "："
	var message = data.text;

	var messageElement = $('<div id="chat_message">');
	var nameElement = $('<strong id="chat_username"></strong>');
	nameElement.text(username);
	messageElement.text(message).prepend(nameElement);
	messageList.append(messageElement);
	messageList[0].scrollTop = messageList[0].scrollHeight;
});
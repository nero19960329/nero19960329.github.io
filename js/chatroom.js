var roomNumber = -1;

var usersRef;
var messagesRef;
var nicknameRef;
var messageField;
var nameField;
var messageList;

var userAdded;
var userRemoved;
var messageAdded;

function setAllthings(roomNum) {
	generateMainArea(roomNum);
	setDynamicWidgets();
	setStaticWidgets();
	setReference(roomNum);
	if ($('#chat_confirmedNick').length != 0) {
		var nickname = $('#chat_confirmedNick').html();
		handleSameNick(nickname);
		nicknameRef.remove();
	}
	setDataInteract();
}

function reDeploy(roomNum) {
	if (roomNumber == roomNum) {
		return;
	}
	try {
		usersRef.off('child_added', userAdded);
		usersRef.off('child_removed', userRemoved);
		messagesRef.off('child_added', messageAdded);
	} catch(e) {
		//console.log(e);
	}
	if ($('#chat_mainArea').length == 0) {
		setAllthings(roomNum);
	} else {
		$('#chat_mainArea').animate({
			width: 0,
			height: 0
		}, 150, function() {
			$('#chat_mainArea').remove();
			setAllthings(roomNum);
		});
	}
}

function toRoom1() {
	reDeploy(0);
}

function toRoom2() {
	reDeploy(1);
}

$(document).bind({
	ready: function() {
		setDynamicWidgets();
		setStaticWidgets();
	}
});

function generateMainArea(roomNum) {
	var mainArea = $('<div id="chat_mainArea"></div>');
	mainArea.animate({
		width: $('#chat_allArea').width() * 0.75 - 20,
		height: 500
	}, 150);
	var leftArea = $('<div id="chat_leftArea"></div>');
	var roomNum = $('<div id="chat_roomNum">房间' + (roomNum + 1) + '</div>');
	var chatArea = $('<div id="chat_chatArea"></div>');
	var inputArea = $('<textarea id="chat_inputArea" spellcheck="false" onclick="clearInput()">Type something...</textarea>');
	var sendButton = $('<div id="chat_sendButton">发送</div>');
	leftArea.append(roomNum);
	leftArea.append(chatArea);
	leftArea.append(inputArea);
	leftArea.append(sendButton);
	var rightArea = $('<div id="chat_rightArea"></div>');
	var closeArea = $('<div id="chat_closeArea"></div>');
	var closeButton = $('<img id="chat_closeButton" src="src/closebutton_normal.png" onclick="closeMainwindow()" />');
	var chat_userlist = $('<div id="chat_userlist"></div>');
	var listtitle = $('<div id="chat_listtitle">当前用户列表</div>');
	var chat_list = $('<ul id="chat_list"></ul>');
	chat_userlist.append(listtitle);
	chat_userlist.append(chat_list);
	rightArea.append(closeArea);
	rightArea.append(chat_userlist);
	closeArea.append(closeButton);
	mainArea.append(leftArea);
	mainArea.append(rightArea);
	$('#chat_allArea').append(mainArea);

	messageField = $('#chat_inputArea');
	nameField = $('#chat_nickname input');
	messageList = $('#chat_chatArea');

	messageField.keypress(function(e) {
		if (e.keyCode == 13) {
			sendMessage();
			return false;
		}
	});

	nameField.keypress(function(e) {
		if (e.keyCode == 13) {
			confirmNick();
		}
	});
}

function closeMainwindow() {
	$('#chat_mainArea').animate({
		width: 0,
		height: 0
	}, 150, function() {
		$('#chat_mainArea').remove();
		nicknameRef.remove();
	});
}

function setReference(num) {
	usersRef = new Firebase('https://nicochatroom.firebaseio.com/room' + num + '/users');
	messagesRef = new Firebase('https://nicochatroom.firebaseio.com/room' + num + '/messages');
}

function setDataInteract() {
	userAdded = usersRef.on('child_added', function(snapshot) {
		var newuser = $('<li>' + snapshot.val().username + '</li>');
		$('#chat_list').append(newuser);
	});

	userRemoved = usersRef.on('child_removed', function(snapshot) {
		var outuser = $('#chat_list li:contains(' + snapshot.val().username + ')');
		outuser.remove();
	});

	messageAdded = messagesRef.limitToLast(15).on('child_added', function(snapshot) {
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
}

function handleSameNick(nickname) {
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

			if ($('#chat_confirmedNick').length != 0) {
				$('#chat_confirmedNick').remove();
				$('#chat_nickname').append($('<input type="text" spellcheck="false" value="Enter your nickname..." onclick="clearNick()" onblur="handleNick()" onfocus="colorChangeNick()" />'));
				$('#chat_nickname').append($('<span id="chat_nickOKButton" onclick="confirmNick()">确  认</span>'));
			}
		} else {
			$('#chat_nickname input').replaceWith('<span id="chat_confirmedNick">' + nickname + '</span>');
			// 把用户名上传至服务器
			nicknameRef = usersRef.push({username: nickname});
			nicknameRef.onDisconnect().remove();
			$('#chat_nickOKButton').remove();
		}
	});
}

// 确定昵称
function confirmNick() {
	if (typeof(usersRef) === 'undefined') {
		alert("您还未进入任何聊天室！请进入聊天室后设置昵称");
		return;
	}

	var nickname = $('#chat_nickname input').attr('value');
	if (nickname === 'Enter your nickname...') {
		nickname = "";
	}
	if (nickname.length > 8) {
		alert("昵称长度不能大于8！");
		return;
	}

	if (nickname == "") {
		alert("请输入昵称！");
	} else {
		// 考虑重名的情况
		handleSameNick(nickname);
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
var fso = new ActiveXObject("Scripting.FileSystemObject");
var f1 = fso.createtextfile("d:\\test.txt", true);
f1.WriteLine("Testing 1, 2, 3");
f1.Close();
alert("success");
var xmlHttp;
if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest;
} else {
    // 在IE5、IE6之前使用的是 ActiveXObject
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
}

xmlHttp.open('get', 'deom_get.json', 'true');
xmlHttp.send();

xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        console.log(xmlHttp.responseText);
    } else if (xmlHttp.status == 404) {
        console.log('找不到页面');
    }
}
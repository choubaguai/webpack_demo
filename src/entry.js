import css from './css/index.css';//引入被打包的文件
import less from './css/black.less';//引入被打包的文件
import sass from './css/nav.scss';//引入被打包的文件

{
    let jschao = "hello webpack"
    document.getElementById("title").innerHTML = jschao;
}
$('#title').html('大吉大利，晚上吃鸡');

let json = require("../config.json");

document.getElementById("json").innerHTML = json.name + ":webstie:" + json.webSite;
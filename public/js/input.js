$(document).ready(function () {
    var flipsnap = Flipsnap('.flipsnap');
})





$(document).ready(function () {
    var swiper = new Swiper('.swiper-container', {
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false
        },
    });

})




var canvas = document.getElementById(rect);

var name_form;//商品の名前保存用
var category_form;//カテゴリ保存用
var place_form;//保存場所保存用
var memo_form;//メモ欄保存用



/*
var flipsnap = Flipsnap('.flipsnap', {distance:230});
var $num = $('input.num');
$('button.go').click(function(){
	flipsnap.moveToPoint($sum.val() - 1);
});
*/


function Sample() {

    alert("icon!!");
}

function OKButton() {
    name_form = document.getElementById('nameTxt').value;//商品の名前取得
	/*category_form = document.getElementById('categoryForm').value;//カテゴリ取得
	place_form = document.getElementById('placeForm').value;//保存場所取得
	memo_form = document.getElementById('memoTxt').value;//メモ取得
	*/
	/*nameArray[count] = name_form;//名前の配列に格納
	categoryArray[count] = category_form;//カテゴリの配列に格納
	placeArray[count] = place_form;//保存場所の配列に格納
	memoArray[count] = memo_form;//メモの配列に格納
*/
    alert(name_form);
/*	alert(categoryArray[count]);
	alert(placeArray[count]);
	alert(memoArray[count]);
	
	count++;//商品番号を増やす
	
*/}
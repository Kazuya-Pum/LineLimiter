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

var name_form;//���i�̖��O�ۑ��p
var category_form;//�J�e�S���ۑ��p
var place_form;//�ۑ��ꏊ�ۑ��p
var memo_form;//�������ۑ��p



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
    name_form = document.getElementById('nameTxt').value;//���i�̖��O�擾
	/*category_form = document.getElementById('categoryForm').value;//�J�e�S���擾
	place_form = document.getElementById('placeForm').value;//�ۑ��ꏊ�擾
	memo_form = document.getElementById('memoTxt').value;//�����擾
	*/
	/*nameArray[count] = name_form;//���O�̔z��Ɋi�[
	categoryArray[count] = category_form;//�J�e�S���̔z��Ɋi�[
	placeArray[count] = place_form;//�ۑ��ꏊ�̔z��Ɋi�[
	memoArray[count] = memo_form;//�����̔z��Ɋi�[
*/
    alert(name_form);
/*	alert(categoryArray[count]);
	alert(placeArray[count]);
	alert(memoArray[count]);
	
	count++;//���i�ԍ��𑝂₷
	
*/}
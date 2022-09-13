// ボタンクリック時の動作
let btns = document.getElementsByClassName("run_script_btn");
for (i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        const cmd = this.innerText;
        console.log(cmd);
        const res = window.api.run_script(cmd);
    });
}
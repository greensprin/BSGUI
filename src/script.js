// main-process側からconfig.jsonの情報をもらい、HTMLの要素を追加する
window.api.on("get_label_btn_name", (event, config) => {
    const parent = document.getElementsByTagName("main")[0]

    for (var label_text in config) {
        const container = document.createElement("div");

        // titleを追加
        const label_div = document.createElement("div");
        label_div.className = "row-title";

        const label = document.createElement("p");
        label.textContent = label_text;

        label_div.appendChild(label);
        container.appendChild(label_div);

        // ボタンを追加
        const row_div = document.createElement("div");
        row_div.className = "row";
        for (var btn_name in config[label_text]) {
            const col_div = document.createElement("div");
            col_div.className = "col";

            const btn = document.createElement("button");
            btn.className   = "btn btn-primary run_script_btn";
            btn.textContent = btn_name;           

            col_div.appendChild(btn);
            row_div.appendChild(col_div);
        }
        container.appendChild(row_div);
        parent.appendChild(container);
    }
})

// ページ読み込まれた後にボタンの動作を設定する
window.onload = function() {
    // ボタンクリック時の動作
    let btns = document.getElementsByClassName("run_script_btn");
    for (i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            // label名取得
            const label    = this.parentElement.parentElement.parentElement.getElementsByClassName("row-title")[0].getElementsByTagName("p")[0].innerText;
            // ボタンテキスト
            const btn_name = this.innerText;
            // コマンド実行
            const res = window.api.run_script([label, btn_name]);
        });
    }
}
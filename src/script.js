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

    // ボタン表示非表示のトグル動作
    let title_text = document.getElementsByClassName("row-title");
    for (i = 0; i < title_text.length; i++) {
        title_text[i].addEventListener("click", function() {
            const SHOW = 1;
            const HIDE = 0;
            col_elems = this.parentElement.getElementsByClassName("col");
            btn_elems = this.parentElement.getElementsByClassName("run_script_btn");

            this.classList.toggle("toggle-on")
            if (this.classList.contains("toggle-on")) {
                for (let i = 0; i < col_elems.length; i++) {
                    col_elems[i].style.opacity = 1;
                    col_elems[i].style.height  = "4rem"; // btn height = 3rem + btn margin-bottom = 1rem -> 4rem
                }
                for (let i = 0; i < btn_elems.length; i++) {
                    btn_elems[i].style.opacity = 1;
                    btn_elems[i].style.height  = "3rem";
                    btn_elems[i].style.pointerEvents = "auto";
                }
            } else {
                for (let i = 0; i < col_elems.length; i++) {
                    col_elems[i].style.opacity = 0;
                    col_elems[i].style.height  = 0;
                }
                for (let i = 0; i < btn_elems.length; i++) {
                    btn_elems[i].style.opacity = 0;
                    btn_elems[i].style.height  = 0;
                    btn_elems[i].style.pointerEvents = "none";
                }
            }
        })
    }

    // キーボードショートカット
    document.addEventListener("keypress", keypress_event);
    function keypress_event(e) {
        let title_text = document.getElementsByClassName("row-title");
        // Aを押したときは、すべてを表示する
        if (e.code === "KeyA") {
            for (let i = 0; i < title_text.length; i++) {
                // 今非表示のものだけをクリックする -> 表示する
                if (title_text[i].classList.contains("toggle-on") === false) {
                    title_text[i].click();
                }
            }
        }
        // Cを押したときは、すべてを非表示にする
        if (e.code === "KeyC") {
            for (let i = 0; i < title_text.length; i++) {
                // 今表示しているものだけをクリックする -> 非表示にする
                if (title_text[i].classList.contains("toggle-on") === true) {
                    title_text[i].click();
                }
            }
        }
        return false;
    }
})
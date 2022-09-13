'use strict'

const { ipcMain } = require('electron');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const childProcess = require("child_process");
const fs = require("fs");

console.log(process.cwd()); // 実行したフォルダ場所
console.log(__dirname);     // index.htmlが入っているフォルダ場所
const json_file_path = "./setting/config.json";
let process_state = 0;

let mainWindow = null;
app.on('ready', () => {
  let win_option = {
    width    : 400,
    height   : 500,
    minWidth :  200,
    minHeight:  300,
    autoHideMenuBar: true,
    webPreferences: {
      experimentalFeatures: false,
      nodeIntegration     : false,
      contextIsolation    : true,
      preload: __dirname + "/preload.js",
    }
  }

  // mainWindowを作成（windowの大きさや、Kioskモードにするかどうかなどもここで定義できる）
  mainWindow = new BrowserWindow(win_option);

  // Electronに表示するhtmlを絶対パスで指定（相対パスだと動かない）
  mainWindow.loadURL(path.join("file:", __dirname, 'index.html'));

  mainWindow.webContents.on("did-finish-load", () => {
    // jsonの内容をrendererに送信する
    const config = JSON.parse(fs.readFileSync(json_file_path, "utf8"));
    mainWindow.webContents.send("get_label_btn_name", config);
  })

  // ChromiumのDevツールを開く
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipcMain.handle("run_script", (e, arg) => {
  if (process_state === 1) {
    console.log("other process is already running.");
    return;
  } else {
    process_state = 1;
  }

  // JSONファイルを開く
  const config = JSON.parse(fs.readFileSync(json_file_path, "utf8"));

  if (arg[0] in config && arg[1] in config[arg[0]]) { // コマンドが設定されていたらコマンドを実行
    const label    = arg[0]; // label名
    const btn_name = arg[1]; // ボタンテキスト

    // JSONからコマンドを取得
    const cmd = config[`${label}`][`${btn_name}`].split(" ");  // コマンド文字列を取得し、スペースで分離しておく
    // コマンド実行
    const cmd_first = cmd.shift();                        // spawn関数に合わせて、先頭のコマンドとそれ以外の要素を分離
    const child     = childProcess.spawn(cmd_first, cmd); // 実行

    // 標準出力を表示
    child.stdout.on("data", (data) => {
      console.log(data.toString());
    })
    child.stderr.on("data", (data) => {
      console.log(data.toString());
    })
    child.on("close", (code) => {
      process_state = 0;
    })

  } else { // コマンドが設定されていなかったらコマンドは実行されない(設定をしてくださいというメッセージを出す)
    console.log(`${arg} is not find in config.json. Please set you want to execute command.`)
    process_state = 0;
  }
})
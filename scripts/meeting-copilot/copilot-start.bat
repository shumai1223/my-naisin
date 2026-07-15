@echo off
rem 商談副操縦士: サーバー起動 + ブラウザを開く
cd /d %~dp0
start "" http://localhost:3456
node server.mjs
pause

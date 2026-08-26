@echo off
rem Meeting copilot: start server and open browser.
rem ASCII only - cmd.exe reads this file as Shift-JIS and Japanese comments have broken parsing before.
cd /d %~dp0
start "" http://localhost:3456
node server.mjs
pause

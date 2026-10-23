@echo off
rem ============================================================
rem  hub-watch-daily.bat - T-PV2 A-5 daily hub watcher
rem  Runs scripts\bairitsu-ingest\watch-hubs.mjs once a day so that new
rem  R9 (reiwa 9) links on prefecture exam hub pages are noticed.
rem  Output: ops\state\hub-events.json (new links), hub-links\<pref>.json.
rem  Log:    %USERPROFILE%\hub-watch.log
rem  ASCII only: cmd.exe reads this file as Shift-JIS.
rem  NODE_TLS_REJECT_UNAUTHORIZED=0 works around school-network TLS inspection.
rem  Register (the owner does this, once): see ops\runbooks\hub-watch-schedule.md
rem ============================================================
cd /d "%~dp0..\.."
set "NODE_TLS_REJECT_UNAUTHORIZED=0"
echo [%date% %time%] hub-watch start >>"%USERPROFILE%\hub-watch.log"
node scripts\bairitsu-ingest\watch-hubs.mjs>>"%USERPROFILE%\hub-watch.log" 2>&1
echo [%date% %time%] hub-watch exit=%errorlevel% >>"%USERPROFILE%\hub-watch.log"

@echo off
title Moonshine - Gestión de Producción e Inventario
echo Iniciando Sistema Moonshine Kaizen...

:: Abrir index.html en el navegador predeterminado
start "" "%~dp0index.html"

echo Aplicación abierta en su navegador predeterminado.
echo Si prefiere ejecutar un servidor web local, ejecute: powershell -ExecutionPolicy Bypass -File server.ps1
pause

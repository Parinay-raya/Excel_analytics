@echo off
echo Installing chart export dependencies...

cd frontend
npm install html2canvas jspdf --save

echo Chart export dependencies installed successfully!
pause
@echo off
echo Fixing Vite configuration...

cd frontend

echo Cleaning node_modules...
rmdir /s /q node_modules

echo Cleaning package-lock.json...
del package-lock.json

echo Reinstalling dependencies...
npm install

echo Running Vite dev server...
npm run dev

echo Done!
pause
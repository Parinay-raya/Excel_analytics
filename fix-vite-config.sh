#!/bin/bash

echo "Fixing Vite configuration..."

cd frontend

echo "Cleaning node_modules..."
rm -rf node_modules

echo "Cleaning package-lock.json..."
rm -f package-lock.json

echo "Reinstalling dependencies..."
npm install

echo "Running Vite dev server..."
npm run dev

echo "Done!"
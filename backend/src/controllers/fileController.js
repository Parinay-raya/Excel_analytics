const ExcelFile = require('../models/ExcelFile');
const Activity = require('../models/Activity');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

// For demonstration, assume file is already uploaded and info is in req.body
// In production, use multer or similar middleware for file uploads

// POST /api/files/upload
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { originalname, filename, path: filePath, size, mimetype } = req.file;
    const userId = req.user._id;

    // Parse the Excel file to get data and columns
    let columns = [];
    let jsonData = [];
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
      if (jsonData.length > 0) {
        columns = Object.keys(jsonData[0]);
      }
    } catch (parseErr) {
      console.error('Excel parse error:', parseErr);
      // Continue, but columns/data will be empty
    }

    const rowCount = jsonData.length;

    const file = new ExcelFile({
      filename,
      originalName: originalname,
      path: filePath,
      size,
      mimetype,
      user: userId,
      columns,
      rowCount
    });
    await file.save();

    // Log activity
    await Activity.create({
      user: userId,
      type: 'upload',
      description: `Uploaded file: ${originalname}`
    });

    // Return file info, columns, and data
    res.status(201).json({
      message: 'File uploaded',
      file,
      columns,
      data: jsonData
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/files
const listFiles = async (req, res) => {
  try {
    let userId = req.user._id;
    // If admin and userId query param is provided, fetch for that user
    if (req.user.role === 'admin' && req.query.userId) {
      userId = req.query.userId;
    }
    const files = await ExcelFile.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/files/:id
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await ExcelFile.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    // Only allow owner or admin to delete
    if (file.user.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }
    // Remove file from disk
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (err) {
      // Ignore disk errors
    }
    await file.deleteOne();
    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'delete',
      description: `Deleted file: ${file.originalName}`
    });
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/files/:id/download
const downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await ExcelFile.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    // Only allow owner or admin to download
    if (file.user.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to download this file' });
    }
    if (file.path && fs.existsSync(file.path)) {
      return res.download(file.path, file.originalName);
    } else {
      return res.status(404).json({ error: 'File not found on disk' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/files/:id/data
const getFileData = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await ExcelFile.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    // Only allow owner or admin to view data
    if (file.user.toString() !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this file' });
    }
    if (!file.path) return res.status(404).json({ error: 'File path not found' });
    // Read and parse Excel file
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    res.json({ data: jsonData });
  } catch (err) {
    console.error('Error reading Excel file:', err);
    res.status(500).json({ error: 'Failed to parse Excel file' });
  }
};

module.exports = { uploadFile, listFiles, deleteFile, downloadFile, getFileData }; 
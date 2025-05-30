import mongoose, { Document, Schema } from 'mongoose';

export interface IExcelFile extends Document {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  user: mongoose.Types.ObjectId;
  columns: string[];
  rowCount: number;
}

const excelFileSchema = new Schema<IExcelFile>({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  columns: [{
    type: String
  }],
  rowCount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export const ExcelFile = mongoose.model<IExcelFile>('ExcelFile', excelFileSchema); 
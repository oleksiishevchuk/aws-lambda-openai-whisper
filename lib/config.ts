import * as dotenv from 'dotenv';
import path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export type ConfigProps = {
  REGION: string;
  LAMBDA_ENV: string;
  OPENAI_API_KEY: string;
  OPENAI_API_RESPONSE_FORMAT: string;
  INPUT_TRANSCRIPTION_BUCKET_NAME: string;
  OUTPUT_TRANSCRIPTION_BUCKET_NAME: string;
  INPUT_TRANSLATION_BUCKET_NAME: string;
  OUTPUT_TRANSLATION_BUCKET_NAME: string;
};

export const getConfig = (): ConfigProps => ({
  REGION: process.env.REGION || 'us-east-1',
  LAMBDA_ENV: process.env.LAMBDA_ENV || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_API_RESPONSE_FORMAT: process.env.OPENAI_API_RESPONSE_FORMAT || '',
  INPUT_TRANSCRIPTION_BUCKET_NAME: process.env.INPUT_TRANSCRIPTION_BUCKET_NAME || '',
  OUTPUT_TRANSCRIPTION_BUCKET_NAME: process.env.OUTPUT_TRANSCRIPTION_BUCKET_NAME || '',
  INPUT_TRANSLATION_BUCKET_NAME: process.env.INPUT_TRANSLATION_BUCKET_NAME || '',
  OUTPUT_TRANSLATION_BUCKET_NAME: process.env.OUTPUT_TRANSLATION_BUCKET_NAME || '',
});
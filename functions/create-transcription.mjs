import { speechToText } from './speech-to-text.mjs';

export const handler = async (event) => {
  try {
    await speechToText({
      endpoint: 'transcriptions',
      inputFileName: event.Records[0].s3.object.key,
      inputBucket: event.Records[0].s3.bucket.name,
      outputBucket: process.env.OUTPUT_BUCKET_NAME,
      apiResponseFormat: process.env.OPENAI_API_RESPONSE_FORMAT,
      apiKey: process.env.OPENAI_API_KEY,
      region: process.env.REGION,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
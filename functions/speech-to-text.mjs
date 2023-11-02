import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export const speechToText = async ({
  endpoint,
  inputFileName,
  inputBucket,
  outputBucket,
  apiResponseFormat,
  apiKey,
  region,
}) => {
  const getObjectInput = {
    Bucket: inputBucket,
    Key: inputFileName,
  };
  const client = new S3Client({ region });
  const getObjectCommand = new GetObjectCommand(getObjectInput);
  const { Body } = await client.send(getObjectCommand);

  const response = await openApiCall(apiKey, endpoint, inputFileName, Body, apiResponseFormat)
  
  const putInput = {
    Bucket: outputBucket,
    Key: generateOutputFileName(inputFileName),
    Body: response,
  };
  const putCommand = new PutObjectCommand(putInput);
  await client.send(putCommand);
};

const openApiCall = async (apiKey, endpoint, inputFileName, objectBody, apiResponseFormat) => {
  const formData = new FormData();
  formData.append('model', 'whisper-1');
  formData.append('file', await toFileBlob(objectBody), inputFileName);
  formData.append('response_format', apiResponseFormat);

  const response = await fetch(`https://api.openai.com/v1/audio/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });
  return await response.text();
};

const toFileBlob = async (body) => {
  const chunks = [];

  for await (const chunk of body) {
    chunks.push(chunk);
  }
  return new Blob(chunks);
}

const generateOutputFileName = (inputFileName) => {
  const randomStr = Math.random().toString(36).substring(2, 6);
  const inputFileExtension = inputFileName.split('.').pop();
  return `${inputFileName.replace(`.${inputFileExtension}`, '')}-${randomStr}.txt`;
};
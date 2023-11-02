# AWS S3/Lambda integaration with Open AI API (Whisper) and AWS CDK
This solution demonstrates AWS S3/Lambda integration with Open AI speech to text API (Whisper model) to transcribe/translate audio files to the text format. AWS resources are deployed using AWS CDK infrastructure as code.

## Architecture
![Architecture](/docs/architecture.png)

## Demo (audio transcription)
1. Upload audio file to the S3 bucket.
![upload_audio_transcription](/docs/upload_audio_transcription.png)
2. Lambda function sends file to the Open AI API (Whisper) to create a transcription and uploads it as a text file to output S3 bucket.
![result_transcription_text](/docs/result_transcription_text.png)
3. Transcription result:
```json
{
   "text" : "He doesn't belong to you, and I don't see how you have anything to do with what is be his power yet. He's heaped us all in that from the stage to you. Be fine."
}
```

## Demo (audio translation)
1. Upload audio file to the S3 bucket.
![upload_audio_transcription](/docs/upload_audio_translation.png)
2. Lambda function sends file to the Open AI API (Whisper) to create a translation and uploads it as a text file to output S3 bucket.
![result_transcription_text](/docs/result_translation_text.png)
3. Translation result:
```json
{
   "text" : "Hi, I'm Ramón Langa, and I'm a beautiful person. In fact, I bring home everything I win. Besides, I'm the best speaker in the world. That's it."
}
```

## Environment variables

This solution has the following configurable variables (in .env file). Update them according to your needs.


| Name | Value | Description |
|--|--|--|
| REGION | us-east-1 | AWS region where your infrastructure is deployed |
| OPENAI_API_KEY **(required)** | your_api_key | [Open AI API key](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) to make calls to the speech to text endpoints  |
| OPENAI_API_RESPONSE_FORMAT| json | Open AI API response format. Supported values: json, text, srt, verbose_json, vtt |
| INPUT_TRANSCRIPTION_BUCKET_NAME | your-transcription-input-bucket | S3 bucket where the source audio file is uploaded |
| OUTPUT_TRANSCRIPTION_BUCKET_NAME | your-transcription-output-bucket | S3 bucket where the result transcription text file is uploaded |
| INPUT_TRANSLATION_BUCKET_NAME| your-translation-input-bucket | S3 bucket where the source audio file is uploaded |
| OUTPUT_TRANSCRIPTION_BUCKET_NAME | your-translation-output-bucket | S3 bucket where the result translation text file is uploaded |


## Deployment

Prerequisites:
- [Node.js](https://nodejs.org/en/download)
- AWS CDK CLI (run `npm install -g aws-cdk`)
- [AWS credentials](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_auth)

If you are not familiar with AWS CDK, please check the [getting started guide](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

Run the following command to deploy AWS resources:

`cdk deploy`

![CDK deployment successful](/docs/cdk_deployment.png)

## Cleanup

Run the following command to cleanup AWS resources:

`cdk destroy`

## Useful links
- [Open AI Speech to text](https://platform.openai.com/docs/guides/speech-to-text)
- [Open AI Whisper API - create transcription endpoint](https://platform.openai.com/docs/api-reference/audio/createTranscription)
- [Open AI Whisper API - create translation endpoint](https://platform.openai.com/docs/api-reference/audio/createTranslation)
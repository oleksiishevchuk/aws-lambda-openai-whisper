import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { ConfigProps } from "./config";

type AwsEnvStackProps = cdk.StackProps & {
  config: Readonly<ConfigProps>;
};

export class AwsLambdaOpenaiWhisperStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;

    const inputAudioTranscriptionBucket = new s3.Bucket(this, 'inputAudioTranscription', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: config.INPUT_TRANSCRIPTION_BUCKET_NAME,
    });

    const inputAudioTranslationBucket = new s3.Bucket(this, 'inputAudioTranslation', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: config.INPUT_TRANSLATION_BUCKET_NAME,
    });

    const outputAudioTranscriptionBucket = new s3.Bucket(this, 'outputAudioTranscription', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: config.OUTPUT_TRANSCRIPTION_BUCKET_NAME,
    });

    const outputAudioTranslationBucket = new s3.Bucket(this, 'outputAudioTranslation', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: config.OUTPUT_TRANSLATION_BUCKET_NAME,
    });

    const createTranscriptionFunction = new lambda.Function(this, 'createTranscription', {
      code: lambda.Code.fromAsset('functions'),
      handler: 'create-transcription.handler',
      functionName: 'create-transcription',
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(60),
      environment: {
        REGION: config.REGION,
        OPENAI_API_KEY: config.OPENAI_API_KEY,
        OPENAI_API_RESPONSE_FORMAT: config.OPENAI_API_RESPONSE_FORMAT,
        OUTPUT_BUCKET_NAME: config.OUTPUT_TRANSCRIPTION_BUCKET_NAME,
      }
    });

    const createTranslationFunction = new lambda.Function(this, 'createTranslation', {
      code: lambda.Code.fromAsset('functions'),
      handler: 'create-translation.handler',
      functionName: 'create-translation',
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(60),
      environment: {
        REGION: config.REGION,
        OPENAI_API_KEY: config.OPENAI_API_KEY,
        OPENAI_API_RESPONSE_FORMAT: config.OPENAI_API_RESPONSE_FORMAT,
        OUTPUT_BUCKET_NAME: config.OUTPUT_TRANSLATION_BUCKET_NAME,
      }
    });

    const s3TranscriptionPutEventSource = new lambdaEventSources.S3EventSource(inputAudioTranscriptionBucket, {
      events: [
        s3.EventType.OBJECT_CREATED_PUT
      ]
    });

    const s3TranslationPutEventSource = new lambdaEventSources.S3EventSource(inputAudioTranslationBucket, {
      events: [
        s3.EventType.OBJECT_CREATED_PUT
      ]
    });

    inputAudioTranscriptionBucket.grantRead(createTranscriptionFunction);
    outputAudioTranscriptionBucket.grantWrite(createTranscriptionFunction);
    createTranscriptionFunction.addEventSource(s3TranscriptionPutEventSource);

    inputAudioTranslationBucket.grantRead(createTranslationFunction);
    outputAudioTranslationBucket.grantWrite(createTranslationFunction);
    createTranslationFunction.addEventSource(s3TranslationPutEventSource);
  }
}

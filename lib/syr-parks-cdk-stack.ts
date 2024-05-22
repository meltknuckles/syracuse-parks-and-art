import * as cdk from 'aws-cdk-lib';
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from 'aws-cdk-lib/aws-cloudfront';
import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  CfnBucket,
  HttpMethods,
} from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export class SyracuseParksCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = new Bucket(this, 'syr-parks-bucket', {
      bucketName: 'syr-parks',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      cors: [
        {
          allowedMethods: [HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
      enforceSSL: true,
      publicReadAccess: true,
      accessControl: BucketAccessControl.PUBLIC_READ,
      blockPublicAccess: new BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
    });

    (bucket.node.defaultChild as CfnBucket).addPropertyDeletionOverride(
      'AccessControl',
    );

    const oai = new OriginAccessIdentity(this, 'syr-parks-oai', {
      comment: 'Allow CloudFront to access S3 bucket',
    });
    bucket.grantReadWrite(oai);
    bucket.grantPutAcl(oai);
    bucket.grantPublicAccess();

    const distribution = new CloudFrontWebDistribution(
      this,
      'syr-parks-web-distribution',
      {
        comment: 'syr-parks',
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
        // viewerCertificate: {
        //   aliases: [''],
        //   props: {
        //     sslSupportMethod: 'sni-only',
        //     acmCertificateArn:
        //       '',
        //   },
        // },
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: oai,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      },
    );

    new BucketDeployment(this, 'syr-parks-bucket-deployment', {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, '../build'))],
      distribution,
      accessControl: BucketAccessControl.PUBLIC_READ,
    });

    bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:*'],
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
        resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
      }),
    );

    new cdk.CfnOutput(this, 'syr-parks-distribution-url', {
      value: `https://${distribution.distributionDomainName}`,
    });
    cdk.Tags.of(this).add('project', 'syr-parks');
  }
}

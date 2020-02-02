import { route53, s3, cloudfront, iam } from '@pulumi/aws';
import { all, Output, Config } from '@pulumi/pulumi';
import path from 'path';
import { uploadToS3 } from './lib/uploadToS3';
import { GetPolicyDocumentResult } from '@pulumi/aws/iam/getPolicyDocument';

const uiDirectory = path.join(__dirname, '../packages/ui');
const config = new Config();
const certArn = config.require('certArn');
const domain = config.require('domain');

const zone = route53.getZone({
  name: domain
});

const defaultTags = {
  domain: domain,
  managedBy: 'pulumi'
};

export const contentBucket = new s3.Bucket(domain, {
  acl: 'public-read',
  bucket: domain,
  website: {
    errorDocument: 'index.html',
    indexDocument: 'index.html'
  }
});

uploadToS3(path.join(uiDirectory, 'dist'), contentBucket);

const originAccessIdentity = new cloudfront.OriginAccessIdentity(`${domain}-identity`);
const s3Policy: Output<GetPolicyDocumentResult> = all([originAccessIdentity.iamArn, contentBucket.arn]).apply(
  ([originAccessIdentityArn, contentBucketArn]): GetPolicyDocumentResult => {
    return iam.getPolicyDocument({
      statements: [
        {
          actions: [
            's3:GetObject',
            's3:ListBucket'
          ],
          principals: [{
            identifiers: [originAccessIdentityArn],
            type: 'AWS'
          }],
          resources: [
            `${contentBucketArn}`,
            `${contentBucketArn}/*`
          ]
        }
      ]
    });
  });

export const s3policyDocument = new s3.BucketPolicy(`${domain}-bucket-policy`, {
  bucket: contentBucket.id,
  policy: s3Policy.json
});

const distributionArgs: cloudfront.DistributionArgs = {
  aliases: [
    domain,
    `www.${domain}`
  ],
  tags: {
    ...defaultTags
  },
  customErrorResponses: [
    {
      errorCode: 404,
      responseCode: 200,
      responsePagePath: '/index.html'
    }
  ],
  defaultRootObject: '/index.html',
  enabled: true,
  origins: [
    {
      originId: contentBucket.arn,
      domainName: contentBucket.websiteEndpoint,
      customOriginConfig: {
        originProtocolPolicy: 'http-only',
        httpPort: 80,
        httpsPort: 443,
        originSslProtocols: ['TLSv1.2']
      }
    }
  ],
  priceClass: 'PriceClass_100',
  viewerCertificate: {
    acmCertificateArn: certArn,
    sslSupportMethod: 'sni-only'
  },
  defaultCacheBehavior: {
    targetOriginId: contentBucket.arn,

    viewerProtocolPolicy: 'redirect-to-https',
    allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
    cachedMethods: ['GET', 'HEAD', 'OPTIONS'],

    forwardedValues: {
      cookies: { forward: 'none' },
      queryString: false
    },

    minTtl: 0,
    defaultTtl: 60,
    maxTtl: 60
  },
  restrictions: {
    geoRestriction: {
      restrictionType: 'none'
    }
  }
};

export const cdn = new cloudfront.Distribution(`${domain}-cdn`, distributionArgs);
const domainAliases = [
  {
    name: cdn.domainName,
    zoneId: cdn.hostedZoneId,
    evaluateTargetHealth: true
  }
];
export const record = new route53.Record(domain, {
  name: domain,
  type: 'A',
  zoneId: zone.id,
  aliases: domainAliases
});

export const wwwRecord = new route53.Record(`www.${domain}`, {
  name: 'www',
  type: 'A',
  zoneId: record.zoneId,
  aliases: domainAliases
});

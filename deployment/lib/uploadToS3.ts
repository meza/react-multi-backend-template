import glob from 'glob';
import path from "path";
import { s3 } from '@pulumi/aws';
import mime from 'mime';
import { asset } from '@pulumi/pulumi';

export const uploadToS3 = (sourceDirectory: string, targetBucket: s3.Bucket) => {
  const files = glob.sync(sourceDirectory + '/**/*.*');
  files.forEach((file) => {
    const relative = path.relative(sourceDirectory, file);
    new s3.BucketObject(
      relative,
      {
        key: relative,
        acl: 'public-read',
        bucket: targetBucket,
        contentType: mime.getType(file) || undefined,
        source: new asset.FileAsset(file)
      });
  });
};

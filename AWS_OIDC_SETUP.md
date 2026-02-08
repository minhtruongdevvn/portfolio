# Setting up Secure AWS Deployment with GitHub Actions (OIDC)

This guide explains how to set up passwordless authentication between GitHub Actions and AWS using OpenID Connect (OIDC). This is the recommended security best practice by both GitHub and AWS.

## Prerequisites
- AWS CLI installed and configured (or use the AWS Console).
- Admin access to your AWS account.
- Your GitHub repository name (e.g., `username/repo`).

## Step 1: Create the OIDC Provider (If not exists)

If you haven't set up GitHub OIDC in your AWS account before, run this once:

```bash
aws iam create-open-id-connect-provider \
  --url "https://token.actions.githubusercontent.com" \
  --client-id-list "sts.amazonaws.com" \
  --thumbprint-list "a031c46782e6e6c662c2c87c76da9aa62ccabd8e"
```

*(If you get an error saying it already exists, that's fine, move to Step 2)*

## Step 2: Create the IAM Role for Deployment

Create a trust policy file `trust-policy.json`.Replace `YOUR_GITHUB_USER` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::754082934044:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:minhtruongdevvn/portfolio:ref:refs/heads/master"
                }
            }
        }
    ]
}
```

Create the role:

```bash
aws iam create-role --role-name GitHubActionsDeployRole --assume-role-policy-document file://trust-policy.json
```

## Step 3: Attach Permissions to the Role

Attach the S3 write policy. Replace `YOUR_BUCKET_NAME` with your actual S3 bucket name.

Create `policy.json`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": "cloudfront:CreateInvalidation",
            "Resource": "*"
        }
    ]
}
```

Attach the policy:

```bash
aws iam put-role-policy --role-name GitHubActionsDeployRole --policy-name S3DeployPolicy --policy-document file://policy.json
```

## Step 4: Configure GitHub Secrets

Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following secrets:

1.  `AWS_ROLE_ARN`: The ARN of the role created in Step 2 (e.g., `arn:aws:iam::123456789012:role/GitHubActionsDeployRole`)
2.  `AWS_S3_BUCKET`: Your S3 bucket name (e.g., `my-portfolio-bucket`)
3.  `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
4.  `CLOUDFRONT_DISTRIBUTION_ID`: (Optional) If you use CloudFront, add its ID here.

## Step 5: Push to Main

Once configured, pushing code to the `main` branch will automatically trigger the deployment!

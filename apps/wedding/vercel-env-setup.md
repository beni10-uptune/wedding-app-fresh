# Vercel Environment Variables Setup

## FIREBASE_PRIVATE_KEY Format

The Firebase private key needs special formatting in Vercel. Here are two methods:

### Method 1: Raw Format (Recommended)
In Vercel, add the private key WITHOUT quotes and with actual line breaks:

```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNSWFcTyUbdMqz
4EYZgYs1c2hyUJAVWoJEn8JG1YydLvc0DavkI2LExBzh8x5MwLGss0+qxl20zH6Q
PVru/M2xS48ITAsur61TUUJj4GnNY9Vm3CzswOOrG6JMRbdxJV5o/V7ER3DgriLy
Yq4+PzRcPkfVOWrmD2EVnv0GjRwLx2drG1ZQ80l8xXbvJYh9V+mwLF07w8SNql+D
xp3Qs1gS29wwJCWEoiMh9aO3n1L4+ZMrJ7Nko0PhmOQVfaFpD0kGPayrrvz2+OV9
nHHG04Fvl/w6z/TeTwbg/F1njD60X/AxZnAGkVFKdWjJiDyW8WDS8votyU3bsxno
XYDbEOoFAgMBAAECggEAEEjRpRevJyAq4z13ehb9YsJSpvzOjS8WldiBegp/Isni
uLmb6NdIwriW3PKi9O41OfCocXDWZpzxLkJ7t+kMbRPEFyGnIm8zpeAUjuUyp2UT
vNra4nYDqWNiCsBeBqby+AufTJ0pLl2J7qXW0h/D6MxU+Oxa10ChkCxCQJaJgsKM
ifJlH/fjY7EDtTuzPwxgGI0YieMElHi2RtkHnhXvjymH4qf/WiMre6tMXViu8EZc
FNbtXKS/QMEh0Nt0iyNPIYHh2n9y2aC6U7oCv7YDQXn0CZnfnyCy6BsB7eVMd4tN
HbW/73Nxekosur1qaV6lp1PSclu0LjQj2ecOZfJrSQKBgQDmO4ijAjEQMlKNvSW6
nXg5QZf/xvL3lPolABn49jDYKCkmumuaYc9xfKgyRRakXWN/iqcdprds9dNZzqiq
lfgyz2XXh9NceITSgr8a9zexWT+7mWOOaybGmZeiAK/FErnmH/KC+TyulJ8uTpwS
g1lR/GKo/oVv/qQtTZbBznDuqQKBgQDkQx0Bzp3Q3jGYdlDI4F9eP+mpQPwpEWTQ
SGVUfwn7y0bgoutGeQ7cykg77QXE1J597pN1pP/GjDjWl0ftCHOpdWrguvTPSHFX
6NZlqLTXj3V9VOrIXmK8v8u+8JG7SrjhCUXaNPbuMA/RFKBMdVy+fN6ZcHR0c7NE
y8b9cIXF/QKBgQCe6GRsrmyS00jrj6vk3B9I1Z9F6Vl1zRvCQgmrLrGT4FRW6MCw
M+ZsXC/zUoBIPjUYqOijrJhZ2mpgSCVeaFiBKWkPlC4sWvrCGYAx6oREIme84ig2
+novBYAFTxgCm+Q3k8Fc6Q4bKXWdDqDmnkYeMmceYV5UaJuEsVLmvchw0QKBgBWz
x9M/KMQODBsZzK58nrSgUP/1nMPu0m33JCM3fOSCvDdpZgMqSV52oQ2JiI3hRTxl
7YE28daXyGOmuIDx18VZ05KQU+xNT/FywsehlagVDK+g3j20s6CMf7uktcZf4VoL
/qczd/LHgQl485Cxa+L0jll6Vqgnw/ibg0zfYOilAoGBANtLVco9tuotAKwobNZJ
poD2IL3gMPV+sxCKiytDUjBaaPmv3IZVCfwiRSqESC53Y8E662IYIS8O3TbL/Lrt
bL1Xey6WPLH2Wj4vnqpX2HOSlwV/HkQoIPUZDKHHTt+sWfhl5/P/1vcRqxIwcgAa
BcXZktRKGj39jza3oCgmSw8+
-----END PRIVATE KEY-----
```

### Method 2: JSON String Format
If Method 1 doesn't work, try adding it as a JSON string:

```json
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNSWFcTyUbdMqz\n4EYZgYs1c2hyUJAVWoJEn8JG1YydLvc0DavkI2LExBzh8x5MwLGss0+qxl20zH6Q\nPVru/M2xS48ITAsur61TUUJj4GnNY9Vm3CzswOOrG6JMRbdxJV5o/V7ER3DgriLy\nYq4+PzRcPkfVOWrmD2EVnv0GjRwLx2drG1ZQ80l8xXbvJYh9V+mwLF07w8SNql+D\nxp3Qs1gS29wwJCWEoiMh9aO3n1L4+ZMrJ7Nko0PhmOQVfaFpD0kGPayrrvz2+OV9\nnHHG04Fvl/w6z/TeTwbg/F1njD60X/AxZnAGkVFKdWjJiDyW8WDS8votyU3bsxno\nXYDbEOoFAgMBAAECggEAEEjRpRevJyAq4z13ehb9YsJSpvzOjS8WldiBegp/Isni\nuLmb6NdIwriW3PKi9O41OfCocXDWZpzxLkJ7t+kMbRPEFyGnIm8zpeAUjuUyp2UT\nvNra4nYDqWNiCsBeBqby+AufTJ0pLl2J7qXW0h/D6MxU+Oxa10ChkCxCQJaJgsKM\nifJlH/fjY7EDtTuzPwxgGI0YieMElHi2RtkHnhXvjymH4qf/WiMre6tMXViu8EZc\nFNbtXKS/QMEh0Nt0iyNPIYHh2n9y2aC6U7oCv7YDQXn0CZnfnyCy6BsB7eVMd4tN\nHbW/73Nxekosur1qaV6lp1PSclu0LjQj2ecOZfJrSQKBgQDmO4ijAjEQMlKNvSW6\nnXg5QZf/xvL3lPolABn49jDYKCkmumuaYc9xfKgyRRakXWN/iqcdprds9dNZzqiq\nlfgyz2XXh9NceITSgr8a9zexWT+7mWOOaybGmZeiAK/FErnmH/KC+TyulJ8uTpwS\ng1lR/GKo/oVv/qQtTZbBznDuqQKBgQDkQx0Bzp3Q3jGYdlDI4F9eP+mpQPwpEWTQ\nSGVUfwn7y0bgoutGeQ7cykg77QXE1J597pN1pP/GjDjWl0ftCHOpdWrguvTPSHFX\n6NZlqLTXj3V9VOrIXmK8v8u+8JG7SrjhCUXaNPbuMA/RFKBMdVy+fN6ZcHR0c7NE\ny8b9cIXF/QKBgQCe6GRsrmyS00jrj6vk3B9I1Z9F6Vl1zRvCQgmrLrGT4FRW6MCw\nM+ZsXC/zUoBIPjUYqOijrJhZ2mpgSCVeaFiBKWkPlC4sWvrCGYAx6oREIme84ig2\n+novBYAFTxgCm+Q3k8Fc6Q4bKXWdDqDmnkYeMmceYV5UaJuEsVLmvchw0QKBgBWz\nx9M/KMQODBsZzK58nrSgUP/1nMPu0m33JCM3fOSCvDdpZgMqSV52oQ2JiI3hRTxl\n7YE28daXyGOmuIDx18VZ05KQU+xNT/FywsehlagVDK+g3j20s6CMf7uktcZf4VoL\n/qczd/LHgQl485Cxa+L0jll6Vqgnw/ibg0zfYOilAoGBANtLVco9tuotAKwobNZJ\npoD2IL3gMPV+sxCKiytDUjBaaPmv3IZVCfwiRSqESC53Y8E662IYIS8O3TbL/Lrt\nbL1Xey6WPLH2Wj4vnqpX2HOSlwV/HkQoIPUZDKHHTt+sWfhl5/P/1vcRqxIwcgAa\nBcXZktRKGj39jza3oCgmSw8+\n-----END PRIVATE KEY-----"
```

## Steps to Fix in Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Find `FIREBASE_PRIVATE_KEY`
4. Delete the current value
5. Add it using **Method 1** (raw format without quotes)
6. Redeploy your application

## Other Required Variables:
- `FIREBASE_CLIENT_EMAIL`: firebase-adminsdk-b4qko@weddings-uptune-d12fa.iam.gserviceaccount.com
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: weddings-uptune-d12fa

## Test After Deployment:
```bash
curl -X POST https://weddings.uptune.xyz/api/seed-blogs \
  -H "Content-Type: application/json" \
  -d '{"secret": "uptune-seed-2025"}'
```
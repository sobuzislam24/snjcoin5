# Premium App + Admin Panel

## User App Files
- index.html
- style.css
- script.js
- firebase.js

## Admin Panel Files
- admin.html
- admin.css
- admin.js
- firebase-admin.js

## Recommended Firestore structure

### users/{telegramId}
```text
username
telegramId
balance
status
currentPlan
adsLimit
adsRemaining
```

### depositRequests/{requestId}
```text
userId
amount
transactionId
paymentMethod
status: PENDING / APPROVED / REJECTED
createdAt
```

## Important
For real money and payment processing:
- Do not trust the frontend alone.
- Do not automatically credit a wallet simply because a user typed a transaction ID.
- Use Firebase Authentication for admin login.
- Use Firestore Security Rules.
- Use a secure backend or Firebase Cloud Function for deposit approval and balance updates.

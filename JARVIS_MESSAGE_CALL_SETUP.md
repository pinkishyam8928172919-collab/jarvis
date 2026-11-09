# Jarvis: Messaging aur Calling Starter

Yeh Android Java ke liye **user-confirmed** starter implementation hai. Jarvis recipient aur message tayyar karega, phir Android ka default SMS/Phone app kholega. User khud details check karke Send/Call dabayega. Isse background mein chupke se SMS/call nahi hoti.

> **Note:** Apne app ka `package`/namespace aur Android version ke mutabik code ko project mein fit karein. Is guide ko repository mein rakhna akela feature activate nahi karta; code ko app ke existing screen/voice flow se jodna hoga.

## 1. AndroidManifest.xml

`<manifest>` ke andar yeh permission daalein. `ACTION_DIAL` aur `ACTION_SENDTO` use karne ke liye `CALL_PHONE` ya SMS permission ki zaroorat nahi hoti.

```xml
<uses-permission android:name="android.permission.CALL_PHONE" />
```

Agar sirf neeche diye gaye safe dialer/SMS-app intents use karne hain, to `CALL_PHONE` line hata sakte hain. `CALL_PHONE` tabhi chahiye jab app seedha call kare; uske liye runtime permission, user consent, aur platform/store policy compliance zaroori hai. Starter code direct calling nahi karta.

## 2. Java helper class

`app/src/main/java/<your-package>/CommunicationHelper.java` file banayein. Pehli line mein apna actual package naam rakhein.

```java
package com.example.jarvis;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

public final class CommunicationHelper {
    private CommunicationHelper() {}

    public static void openSmsComposer(
            Activity activity,
            String phoneNumber,
            String message
    ) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            Toast.makeText(activity, "Phone number daalein", Toast.LENGTH_SHORT).show();
            return;
        }

        Uri uri = Uri.parse("smsto:" + Uri.encode(phoneNumber.trim()));
        Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
        intent.putExtra("sms_body", message == null ? "" : message);
        launch(activity, intent, "SMS app nahi mili");
    }

    public static void openDialer(Activity activity, String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            Toast.makeText(activity, "Phone number daalein", Toast.LENGTH_SHORT).show();
            return;
        }

        Uri uri = Uri.parse("tel:" + Uri.encode(phoneNumber.trim()));
        Intent intent = new Intent(Intent.ACTION_DIAL, uri);
        launch(activity, intent, "Phone app nahi mili");
    }

    private static void launch(Activity activity, Intent intent, String error) {
        try {
            activity.startActivity(intent);
        } catch (ActivityNotFoundException exception) {
            Toast.makeText(activity, error, Toast.LENGTH_LONG).show();
        }
    }
}
```

> `package com.example.jarvis;` ko apne app ke package se badlein. Agar aapke project mein `Activity` ki jagah AndroidX/Compose setup hai, to helper ko uske screen/event handler se call karein.

## 3. Button ya voice-flow se use karna

Activity ke andar, user ke confirm karne ke baad:

```java
String number = phoneNumberEditText.getText().toString();
String message = messageEditText.getText().toString();

sendButton.setOnClickListener(view ->
        CommunicationHelper.openSmsComposer(this, number, message)
);

callButton.setOnClickListener(view ->
        CommunicationHelper.openDialer(this, number)
);
```

Agar aapke UI mein EditText/button ke naam alag hain, unhe apne actual view IDs se badlein. Voice assistant ko pehle parsed number/message screen par dikhana chahiye, phir user se confirmation lena chahiye; confirmation ke baad hi upar wala function chalayein.

## 4. Zaroori checks

- SMS composer mein recipient aur message ko user ko bhejne se pehle edit/check karne dein.
- Dialer number dikhata hai; user khud Call dabata hai.
- Secrets, contact lists, ya message content ko GitHub par commit na karein.
- Real device par test karein; emulator mein SMS/phone app available na bhi ho sakti hai.
- App ka `minSdk`, Java version, package name, aur existing UI ke hisaab se integration adjust karein.

## 5. Test checklist

1. Valid number par SMS button dabayein; SMS app khulni chahiye aur draft prefill hona chahiye.
2. Call button dabayein; dialer number ke saath khulna chahiye.
3. Blank number par app crash nahi honi chahiye; validation message dikhna chahiye.
4. Device par SMS/phone handler na ho to error toast dikhna chahiye.

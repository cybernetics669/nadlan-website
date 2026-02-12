# הגדרת Cloudflare Images

מדריך קצר להפעלת העלאת תמונות דרך Cloudflare Images (נדרש להעלאת נכסים ב-Netlify).

---

## שלב 1: הרשמה והפעלת Images

1. הכנס ל-[Cloudflare Dashboard](https://dash.cloudflare.com/)
2. בחר את החשבון שלך (או צור חדש)
3. בתפריט הצדדי: **Images** → **Overview**
4. אם זה הפעם הראשונה – לחץ **Create** / **Enable Images**

---

## שלב 2: השגת Account ID

1. ב-Images Overview, תראה את ה-**Account ID** (מזהה ארוך)
2. **העתק** את ה-Account ID

אלטרנטיבה: בתפריט, תחת **Account** → **Account ID** (למטה משמאל).

---

## שלב 3: יצירת API Token

1. לך ל-[API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. לחץ **Create Token**
3. בחר **Custom token** או **Edit Cloudflare Images**
4. הגדר הרשאות:
   - **Account** → **Cloudflare Images** → **Edit**
5. לחץ **Continue to summary** ואז **Create Token**
6. **העתק את ה-Token** (מופיע פעם אחת בלבד)

---

## שלב 4: הוספת משתנים לפרויקט

### במחשב המקומי (קובץ `.env`)

הוסף את השורות הבאות (במקום הערכים הריקים):

```env
CLOUDFLARE_ACCOUNT_ID="החשבון_ID_שהעתקת"
CLOUDFLARE_IMAGES_API_TOKEN="ה-Token_שהעתקת"
```

### ב-Netlify

1. לך ל-**Project configuration** → **Environment variables**
2. לחץ **Add a variable** (או **Import from .env**)
3. הוסף:
   - **Key:** `CLOUDFLARE_ACCOUNT_ID`  
     **Value:** ה-Account ID שהעתקת
4. הוסף:
   - **Key:** `CLOUDFLARE_IMAGES_API_TOKEN`  
     **Value:** ה-API Token שהעתקת
5. לחץ **Save**
6. בצע **Trigger deploy** כדי שהאתר יעלה עם ההגדרות החדשות

---

## בדיקה

אחרי עדכון ההגדרות ועדכון האתר:

1. היכנס ל-`/admin`
2. צור נכס חדש
3. העלה תמונה

אם הכל תקין – ההעלאה תצליח והתמונה תופיע בעמוד הנכס.

# FlavorShare – Recipe Web App

FlavorShare is a web app where users can **browse and view recipes**, and (in this MS1 version) try a demo flow for **signing in and uploading recipes**.

---

## User Problem

Finding reliable recipes online is messy, and saving or sharing your own recipes often feels scattered (screenshots, notes, chats). FlavorShare aims to make it easier to **discover recipes in card form and share your own** in one simple, consistent interface.

---

## Target Users

- Home cooks looking for new recipes  
- Students / beginners learning to cook  
- Food enthusiasts who want to share their dishes  

---

## Success Metrics (for MS1)

- Landing page loads, shows hero + navigation clearly  
- Users can:
  - Go to **Browse** and view recipe cards  
  - Open a **recipe detail modal** from a card  
  - **Sign up / Sign in** using an email ending in `@gmail.com`  
  - Access the **Upload Recipe** page only when signed in  
- Forms have basic client-side validation  
- Navigation links work end-to-end for MS1 flows  
- Layout works on desktop and basic mobile sizes  

---

## In-Scope Pages / Features (MS1)

- **Landing Page** (`landing-page.html`)  
- **Browse Recipes** (`browse.html`) – cards + modal  
- **Upload Recipe** (`upload.html`) – with basic validation & login requirement  
- **Sign Up** (`sign-up.html`) – demo signup with `@gmail.com` rule  
- **Sign In** (`sign-in.html`) – demo login with `@gmail.com` rule  

(Other pages like *My Cookbook* / *Following* are planned but not fully implemented in MS1.)

---

## Sitemap

Landing Page (`landing-page.html`)  
├── Browse Recipes (`browse.html`)  
│   └── Recipe Detail (modal)  
├── Sign Up (`sign-up.html`)  
├── Sign In (`sign-in.html`)  
└── Upload Recipe (`upload.html`)  *(requires sign-in)*  

---

## Acceptance Criteria

**Landing Page**  
- Navigation links to *Home, Browse, Upload, Sign In* work.  
- Hero section is readable and visually clear.

**Browse Recipes**  
- Recipe cards are displayed.  
- Clicking a card opens a modal with recipe info.  
- Modal can be closed with a close button.

**Recipe Detail / Modal**  
- Shows recipe title and description.  
- Closes cleanly and returns focus to the page.

**Sign Up / Sign In**  
- Forms validate required fields.  
- Only emails ending in `@gmail.com` are considered valid.  
- On success, a “logged-in” state is stored (via `localStorage`) and user is redirected.

**Upload Recipe**  
- Page can only be used properly when logged in.  
- Required fields show validation errors if empty.  
- On success, a confirmation message is shown (demo behavior).

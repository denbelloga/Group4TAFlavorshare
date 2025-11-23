
# **FlavorShare – Recipe Sharing Website**

FlavorShare is a simple web-based recipe platform where users can browse dishes, save their favorites, and upload their own recipes. The website is built using HTML, CSS, and JavaScript and uses **localStorage** to simulate user accounts and data.


## **Overview**

FlavorShare includes the following core features:

### **Homepage**

* Hero banner with search
* Quick access to Explore page
* Trending recipes section
* Recipe modal that opens when a card is clicked

### **Explore Page**

* Displays multiple recipe cards
* Filter buttons (Pasta, Dessert, Asian, etc.)
* Each card can be viewed in a modal
* “Save to Cookbook” button

### **User Accounts (Simulated)**

* Sign In, Sign Up, Forgot Password, Reset Password
* Any email ending with **@gmail.com** is accepted
* Credentials are stored in localStorage

### **Protected Pages**

* **My Cookbook**
* **Following**
  Users must be signed in to access these pages; otherwise they are redirected to Sign In.

### **My Cookbook**

* Shows all recipes the user saved
* Also shows recipes the user uploads
* Stored locally in `fs_cookbook_<email>`
* Displays an empty state if no recipes are saved

### **Upload a Recipe**

* Users can upload title, description, image URL, ingredients, and steps
* Successfully uploading triggers a full-screen success animation
* Uploads are automatically added to the user’s Cookbook

### **Dark Mode**

* Full dark mode support including modal, cards, buttons, and backgrounds
* Saves theme preference in `fs_theme`

## **How It Works**

### **localStorage Keys**

* `fs_user` – stores the currently signed-in user
* `fs_theme` – stores light/dark theme
* `fs_cookbook_<email>` – stores user-specific saved recipes

### **Main Files**

index.html
browse.html
my-cookbook.html
upload.html
sign-in.html
sign-up.html
following.html
forgot-password.html
reset-new-password.html
styles.css
script.js
/images
```

## **User Flow**

1. User signs up or logs in
2. User browses recipes on the Explore page
3. Clicking a recipe opens the recipe modal
4. Saving a recipe adds it to the user’s Cookbook
5. Uploading a recipe also saves it automatically
6. User may switch between light and dark mode
7. User can log out through the dropdown menu


## **Testing Summary**

* Navigation buttons working
* Sign In / Sign Up validation works
* Protected pages redirect properly
* Saving recipes and uploading both add to Cookbook
* Dark mode works on modal and all pages
* Recipe modal fully readable in both themes


## **Notes**

* This is a **front-end–only** demo
* No backend or real database
* All stored data resets when browser storage is cleared
* Images used are sample images


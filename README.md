# InspireMe — Creativity & Locations Platform

InspireMe is a minimalistic and aesthetic web platform designed to inspire users through creativity and beautiful locations.  
The website allows people to share their creative projects, daily moments, hobbies, and favorite places they have visited.  
It combines two worlds in one: **Creativity** and **Locations**, making InspireMe a cozy space for inspiration and self-expression.

---

##  Project Description

InspireMe helps users:

- Share creative works (art, notes, research, ideas, moodboards, photos).
- Post beautiful locations they visited and recommend to others.
- Interact with posts using likes, comments, and saved pins.
- Browse through an aesthetic Pinterest-like feed.
- Discover new ideas and inspiring places every day.

The purpose of InspireMe is to create a friendly and warm atmosphere where every person can inspire others and be inspired in return.

---

## Team Members

| Full Name | Group |
|----------|--------|
| Aiymzhan Abilgazy | (SE-2423) |
| Marzhan Tulebayeva | (SE-2423) |

---

## Topic Explanation

This project is a social-inspiration platform split into two main sections:

### Creativity
A space where users can:
- Share their artwork, academic projects, ideas, and hobbies.
- Write small stories or captions.
- Interact with others through likes, comments, and saved posts.

### Locations
A gallery of atmospheric places:
- Travel photos, cafés, parks, nature, city corners.
- Recommended locations worth visiting.
- A visual diary of memories and aesthetic views.

The site is designed to be visual, warm, and calming — similar to Pinterest, but focused on creativity and personal inspiration.

---

## Installation & Run Instructions

Follow these steps to run the project locally:

1. Clone the repository:
git clone https://github.com/aiymzhanabilgazy/WebProject.git
2. Navigate into to the project folder :
- cd WebProject
3. Install dependencies and start the server:
- npm install
- node server.js
4. Open the website:
http://localhost:3000

--- 

## Project Structure
```
WEBPROJECT/
├── images/
│
├── public/
│ ├── style.css
│ ├── about.css
│ ├── creativity.css
│ └── locations.css
│
├── views/
│ ├── index.html
│ ├── about.html
│ ├── creativity.html
│ ├── contact.html
│ └── locations.html
│
├── server.js
├── package.json
└── README.md
└── data.json
```
--- 

## Future Roadmap 
Week 1 → Project Setup & Landing Page
- focuses on Express setup, structure, and landing page.

Week 2 → Forms + POST route
- Add form to create new posts
- Send form data to backend

Week 3 → Server site handling 
- add api resourses and route parameters
- Store a contact form data to the JSON.file

Week 4 → REST API
- Implement GET/POST routes for posts
- Serve posts dynamically

Week 5 → NoSQL Modelling
- Relations: users → posts → comments
- Add likes, saved pins, comments system

Week 6 → Deployment + Git
- Deploy project to Render/Heroku
- Improve Git version control

Week 7 → Authentication
- Login / Register
- User profiles

Week 8 → Security
- Sessions, cookies, password hashing
- Secure API endpoints

Week 9 → File Uploads
- Allow users to upload photos for posts

Week 10 → Final improvements
- UI polish, animations, bug fixes
- Final presentation

--- 

##  Planned Features

In the future, we plan to expand InspireMe with several new functions that will make the platform more personalized and convenient for users.

We want to add advanced sorting for both Creativity and Locations sections — for example, filtering creative posts by categories such as painting, coding, cooking, or startups, and sorting locations by distance, exact address, or by type (cafés, restaurants, parks, etc.). Users will also be able to select their current city and receive recommended places to visit.

We aim to implement user registration and login, so each person can have their own profile, save posts, like content, and customize their feed. The home feed will update based on user preferences or search history, helping users discover more relevant content.

Additional features may include a large “+ Add” button for uploading posts, new navigation pages like Settings or Privacy Policy, and improved search tools to find creativity and locations more easily.

These planned features will help InspireMe grow into a more personalized and inspiring platform for all users.

## Assignment 2 – Part 1: Server site Request Handling in Express.js
### Middleware
- `express.urlencoded({ extended: true })` is used to parse form data.
- `app.use((req, res, next) => {console.log(`${req.method} ${req.url}`); next();});` is a custom logger middleware that prints HTTP method and request URL for every request.
- A custom 404 page is implemented for unknown routes.

This project demonstrates server-side request handling using Express.js. Some routes are designed to be tested directly via the browser URL, as they illustrate the use of route parameters and API responses.

1. Home Page (/)
URL: http://localhost:3000/
Description:
Displays the main page of the website with navigation links.
Note: Not all routes are linked from the home page.  
Routes such as `/item/:id` and `/api/info` are intended to be accessed directly via the browser URL for demonstration purposes.

2.Search Route (/search)
Example URLs:
http://localhost:3000/search?q=creativity
http://localhost:3000/search?q=locations
http://localhost:3000/search?q=inspiration
Description:
This route demonstrates the use of query parameters in Express.js.
The search keyword is passed through the URL using the q parameter and is processed on the server side.
If the query parameter is missing or empty, the server returns a 400 Bad Request response.

3. Item Route (/item/:id)
Example URL:
http://localhost:3000/item/1
http://localhost:3000/item/abc
Description:
This route demonstrates the use of route parameters in Express.js.
The id value is extracted directly from the URL and displayed on the page.

4.Contact Route (/contact)
URL:
http://localhost:3000/contact
Description:
This route demonstrates handling POST requests in Express.js.
The contact page contains a form where users can submit their first name, last name, email, and message.
Submitted form data is processed using req.body and stored in a JSON file on the server.
If any required field is missing, the server returns a 400 Bad Request response.

5. API Information Route (/api/info)
URL: http://localhost:3000/api/info
Description:
This route returns project information in JSON format and demonstrates how Express.js handles API responses.

### Contact Form
The contact page contains a form with the following fields:
- Name
- Email
- Message

The form sends data to the backend using a POST request.  
Form data is processed using `req.body` and logged to the console to demonstrate correct form handling.

## Contact Page

We added a Contact page to collect feedback from users.  
The page contains a form with fields for name, email, and message.  
This allows users to send their ideas, suggestions, or feedback directly to the backend.

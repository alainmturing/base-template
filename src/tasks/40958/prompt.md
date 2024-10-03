Output a self-contained .jsx React+Tailwind+Shadcn app that accomplishes the following task:

<task>
I want to build a Book Quote Collector where I can quickly capture quotes or key points from books I'm reading and organize them by book title or genre. Each entry should allow me to add a quote, select the book title from a list (or add a new book if it’s not already in the list), and optionally categorize the quote by genre. I should be able to view all quotes organized by either book or genre, and easily search through them. Additionally, I want to be able to edit or delete any quotes if needed. The app should be simple to navigate and mobile responsive. Please make sure that I am able to add new books, new genres, new quotes. Overall make sure there is CRUD for everything, and make the design intuitive for this. Make sure my quotes are in quotes and in a text size and font different from the rest of the app to show emphasis.
</task>


Make sure to use React in your response. You may use components from Shadcn using “@/components” like so: import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; You are not allowed to use any other dependencies or external assets.
I need you to first write a plan for implementation, then output the code, then write some implementation things to note.

You can define multiple sub-components if necessary, but export the final app as a default function component (export default function App()...).
DO NOT use any other css or js libraries
Do not use external APIs, CDNs and localStorage.
Use modern React idioms like hooks.
Use Tailwind for styling.
Use prettier formatting (2-space tab width, semicolons, etc).
Ensure mobile responsiveness; the app should work with the sm breakpoint in tailwind.
Restrict your code output to around 500 lines.
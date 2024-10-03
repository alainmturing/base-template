Output a self-contained .jsx React+Tailwind+Shadcn app that accomplishes the following task:

<task>
I want to create a reading list tracker where I can log books I want to read, am currently reading, and have finished. Each book entry should include a title, author, and a percentage progress indicator (for books in the 'Currently Reading' list). The books should be organized into three sections: "To Read", "Currently Reading", and "Finished". Each section should have color-coded cards: "To Read" will be red, "Currently Reading" will be yellow, and "Finished" will be green. I want the progress for "Currently Reading" books to be displayed as a progress bar that updates in real-time when I adjust the progress (for example, via a slider or input field). I should be able to move books between sections by dragging and dropping them, with smooth animations for picking up and dropping books. Each section should be equally wide, and the book cards should be responsive, expanding vertically if needed. When I click on a book entry, I should be able to edit the book details (title, author, and progress), and I want save/discard buttons to only appear if I make changes. The save button should be green, the discard button should be red. I should not be able to edit the book details once it's been moved to completed. I can however move it back to in progress or to read in case I want to read the book again.
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

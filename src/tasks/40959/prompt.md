
Output a self-contained .jsx React+Tailwind+Shadcn app that accomplishes the following task:

<task>
I want to create a Daily Reading Goal tracker where I can track my reading progress, either by pages or minutes, each day. I should be able to set a daily goal (for example, a number of pages or minutes), and the tracker will show my progress toward that goal with visual indicators, one will be a progress bar and one will be a progress circle. It should be easy for me to log my daily reading, update my goals, and view my progress over time. I should be able to change the date using a calendar for the day that I am logging for. The app should be mobile-friendly and responsive. The app should be colorful and visually appealing. Make sure that when there are no logs yet there's some text in the container saying there are no logs yet. Make sure that my logs are sorted by newest at the top to oldest at the bottom. Newest being the latest date, oldest being the oldest date, shouldn't matter when the logs were made for the date, it just matters the date. Make sure if my goal gets updated that the old logs don't rely on this new goal but only new logs will use this new goal, old logs should use whatever goal they were created with.
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


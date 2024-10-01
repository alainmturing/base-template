Output a self-contained .jsx React+Tailwind+Shadcn app that accomplishes the following task:

<task>
Create an interactive password strength meter that beautifully shows the strength of the password typed into the visually appealing text box above the meter for a password. The progress bar states are Weak, Decent, and Strong. The progerss bar should be fully red when the password is empty and in the weak state. Once the password is not empty, the progress bar should be empty but still in the weak state. As the pasword strength increases, the progress bar moves up. If it moves up to decent the progress bar progress color should change to yellow, if it moves up to strong state, the color should change to green. It should provide details on how to make the password strong and the actual criteria that judeges the password strength will be:
- At least 8 characters
- Contains uppercase letters
- Contains lowercase letters
- Includes numbers
- Includes special characters

When a password is not met, the text color for that requirement should be red, once the requirement is met it should switch to green.
DO NOT use any other css or js libraries
Do not use external APIs, CDNs and localStorage.
</task>

Make sure to use React in your response. You may use components from Shadcn using “@/components” like so: import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; You are not allowed to use any other dependencies or external assets.

You can define multiple sub-components if necessary, but export the final app as a default function component (export default function App()...).

Use modern React idioms like hooks.
Use Tailwind for styling.
Use prettier formatting (2-space tab width, semicolons, etc).
Ensure mobile responsiveness; the app should work with the sm breakpoint in tailwind.
Restrict your output to around 500 lines.
# BabyBella

Open `index.html` in a browser to use the monthly project dashboard. Each month button opens a website page in this project: the 1st Month is `welcome.html`, and the 2nd Month is `month-2.html`. Edit these HTML pages and their assets directly in VS Code; there is no in-website month or file editor.

## Add a month

1. Create a new page in VS Code, such as `month-3.html`. You can copy `month-2.html` as a starting point, then edit its title, content, and links.
2. Add the month to the `months` list in `organizer.js`, with its sequential number and page path, for example `{ number: 3, page: 'month-3.html' }`.
3. Save the files and reload `index.html`. The dashboard builds its month links from this list.

Add or change a month's images and other website content in the project with VS Code, then link to them from that month's HTML page.

# ghostlist (vertical scroll)
Ghostlist
https://github.com/otsitron/ghostlist.git


1. To preview this ghostlist locally, please start the node server. 
Detailed instructions for the server are here in this directory: ghostlist/README.md

from ghostlist directory, run 
node bin/http-server

2. Next, preview the page in the browser:
http://localhost:8080/ghostlist.html

3. scss folder contains ghostlist.scss that is compiled into public/css/ghostlist.css 
sass --watch scss/ghostlist.scss:public/css/ghostlist.css

4. I use unsemantic for responsiveness and jQuery

5. Preview this page on my site:
http://olgatsitron.com/tumblrTst/ghostlist.html
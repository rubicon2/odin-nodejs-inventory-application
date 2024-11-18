# odin-nodejs-inventory-application

https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application

## Challenges

As per usual, I added in a bunch of extra stuff for fun and then spent lots of extra time trying to figure
stuff out and make things work.

I decided to add the ability to add a single image for each category and supplier, and multiple images for
each product. Initially I was going to upload the images directly to the database in the form of blobs,
(binary large object) but read online about how that is a bad idea, basically. So I decided to do the proper
thing and use a folder on the server itself. When the user uploads a file, it is uploaded to the uploaded
folder on the server using the multer package.

However, once I deployed this to adaptable.io, I found that it would not let me write to the server, and
even if it did the uploads would not be permanent or consistent across users, as if the app scales up and there
are multiple instances of the app running, each app might have different images uploaded, and once the app instance
gets shut down those images would be lost, and the database entries that point to the urls of the images would
point to nothing.

In conclusion: In this instance, I should have just used blobs. Currently looking at online cloud storage services...
Need to remember next time - do not try to use the server for any permanent storage.

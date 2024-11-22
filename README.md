# odin-nodejs-inventory-application

https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application

## Challenges

As per usual, I added in a bunch of extra stuff for fun and then spent lots of extra time trying to figure
stuff out and make things work.

### Images

I decided to add the ability to add a single image for each category and supplier, and multiple images for
each product. Initially I was going to upload the images directly to the database in the form of blobs,
(binary large object) but read online about how that is a bad idea, basically. So I decided to try using a
folder on the server itself. When the user uploads a file, it is uploaded to the uploaded folder on the
server using the multer package.

However, once I deployed this to adaptable.io, I found that it would not let me write to the server, and
I realised that even if it did, the uploads would not be permanent or consistent across users, as if the
app scales up and there are multiple instances of the app running, each app instance might have different
images uploaded to it, and once the app instance gets shut down those images would be lost, and the database
entries that point to the urls of the images would point to nothing.

I have determined the correct solution is to use an online content delivery service. I looked at using Amazon
Web Services S3 to host all the uploads, but decided against wasting my year long free trial on this small
project. As a result, I decided to just store the images as blobs on the database.

This is very clearly the wrong way to do it for a few reasons:

- Database operations are far slower since it has to load the whole image data instead of just a URL. When a URL
is stored, the controller method quickly loads the database row(s), then renders the view, and then the view is
showed to the user and the browser will then load all the images, with the URLs sourced from the database and
passed to the view. With the db storing the image data as blobs, all images have to be loaded from the database
before anything is rendered to the browser. This is very slow and makes the site feel very unresponsive.
- Getting ```html<img>``` tags to display the images properly requires some really wonky, unintuitive markup: ```html<img src="data:[mimetype, e.g. image/jpeg];base64,[data in base 64 format string]" />```
- Metadata about the images has to be stored, notably the mimetype, so it can be passed to the ```html <img>``` tag.
This feels a lot less efficient and intuitive and easy to use than just having a URL to an image. What if the data
and mimetype become mismatched somehow?

### Logging in

I decided to do the extra credit task by adding a password to stop any old rando from adding, editing and deleting
stuff from the database. Since I added the ability to upload images, I was envisioning some random person coming
along and uploading gigabytes of (probably hideous) images to the database...

At first there was just a super secret password in the env file, and the express-session middleware for keeping
track of whether the user is logged in or not, but in the end I added a table to the database to store user
information. I then looked at storing passwords etc. securely.

So the password is salted (salt: a suffuciently random string added to the end of the password string before the hash
is calculated, and the salt is stored alongside the hash in the users table) and also peppered (a sufficiently random string that is not stored on the database, but on the env variables).

Salting the password with a random string for each user ensures that even if two users use the same password, the hash
will be different.

The internet seems to be less sure whether peppering a password provides any benefit, but surely having part of the
password hash "secret sauce" not stored in the database would make it harder for anyone that manages to gain access
to the database to work out passwords? They would have to not only gain access to the database, but the server secrets
too.

## To do

- Replace in-built express-session store with an actual store since, as per the npmjs page: "The default server-side session storage, MemoryStore, is purposely not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing."
- Actually do whatever you are supposed to do clientside when a user logs in.
Give the client some kind of session token, that tells the server which user they are communicating with?
Currently, all the server knows is that that particular client/session is logged in - nothing about their identity.
So for instance, if I wanted to store a reference to the user id that uploaded an image in the product_images table,
that wouldn't be possible.

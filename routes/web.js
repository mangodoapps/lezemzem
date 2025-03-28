import Route from "../lib/Route.js";

// Site Controllers
import SiteController from "../app/Controllers/SiteController.js";


Route.get("/", SiteController.getHome);
Route.get("/about", SiteController.getAbout);
Route.get("/contact", SiteController.getContact);


export default null;
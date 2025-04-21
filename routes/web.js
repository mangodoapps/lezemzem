import Route from "../lib/Route.js";

// Admin Controllers
import AdminLoginController from "../app/Controllers/AdminControllers/LoginController.js";
import AdminHomeController from "../app/Controllers/AdminControllers/HomeController.js";
import AdminAdminsController from "../app/Controllers/AdminControllers/AdminsController.js";
import AdminSolutionsController from "../app/Controllers/AdminControllers/SolutionsController.js";
import AdminAboutsController from "../app/Controllers/AdminControllers/AboutsController.js";
import AdminCategoriesController from "../app/Controllers/AdminControllers/CategoriesController.js";
import AdminThemeController from "../app/Controllers/AdminControllers/ThemeController.js";
import AdminFileManagerController from "../app/Controllers/AdminControllers/FileManagerController.js";
import AdminSettingsController from "../app/Controllers/AdminControllers/SettingsController.js";
import AdminProfileController from "../app/Controllers/AdminControllers/ProfileController.js";
import AdminLanguagesController from "../app/Controllers/AdminControllers/LanguagesController.js";
import AdminNewsController from "../app/Controllers/AdminControllers/NewsController.js";
import AdminNewsSettingsController from "../app/Controllers/AdminControllers/NewsSettingsController.js";
import AdminActivitiesController from "../app/Controllers/AdminControllers/ActivitiesController.js";
import AdminActivitySettingsController from "../app/Controllers/AdminControllers/ActivitySettingsController.js";
import AdminSolutionSettingsController from "../app/Controllers/AdminControllers/SolutionSettingsController.js";
import AdminCategorySettingsController from "../app/Controllers/AdminControllers/CategorySettingsController.js";

// Site Controllers
import SiteHomeController from "../app/Controllers/SiteControllers/HomeController.js";
import SolutionsController from "../app/Controllers/SiteControllers/SolutionsController.js";
import NewsController from "../app/Controllers/SiteControllers/NewsController.js";
import ActivitiesController from "../app/Controllers/SiteControllers/ActivitiesController.js";
import AboutController from "../app/Controllers/SiteControllers/AboutController.js";
import ContactController from "../app/Controllers/SiteControllers/ContactController.js";
import IndustriesController from "../app/Controllers/SiteControllers/CategoriesController.js";


Route.get("/", SiteHomeController.getHome);

Route.get("/about", AboutController.getAbout);
Route.get("/contact", ContactController.getContact);

Route.prefix("/industries").group(function (){
    // Route.get("/", IndustriesController.getIndustries);
    Route.get("/:category_seo", IndustriesController.getIndustry);
});

Route.prefix("/solutions").group(function (){
    Route.get("/", SolutionsController.getSolutions);
    Route.get("/:solution_seo", SolutionsController.getSolution);
});

Route.prefix("/news").group(function (){
    Route.get("/", NewsController.getNews);
    Route.get("/:news_seo", NewsController.getNew);
});
Route.prefix("/activities").group(function (){
    Route.get("/", ActivitiesController.getActivities);
    Route.get("/:activity_seo", ActivitiesController.getActivity);
});

Route.prefix("/admin").group(function () {

    Route.get("/login", AdminLoginController.getLogin);
    Route.post("/login", AdminLoginController.postLogin).middleware("admin.login.form");
    Route.get("/logout", AdminLoginController.getLogout);

    Route.middleware("auth").group(function () {

        Route.get("/", AdminHomeController.getHome);

        Route.prefix("/admins").group(function () {
            Route.get("/", AdminAdminsController.getAdmins);
            Route.get("/new", AdminAdminsController.getAdminsNew);
            Route.get("/edit", AdminAdminsController.getAdminsEdit);
            Route.post("/edit", AdminAdminsController.postAdminsEdit).middleware("admin.admin.form");
            Route.get("/delete", AdminAdminsController.getAdminsDelete);
        });

        Route.prefix("/news").group(function () {
            Route.get("/", AdminNewsController.getNews);
            Route.get("/new", AdminNewsController.getNewsNew);
            Route.get("/edit", AdminNewsController.getNewsEdit);
            Route.post("/edit", AdminNewsController.postNewsEdit).middleware("admin.news.form");
            Route.get("/delete", AdminNewsController.getNewsDelete);

            Route.get("/settings", AdminNewsSettingsController.getNewsSettingsEdit);
            Route.post("/settings", AdminNewsSettingsController.postNewsSettingsEdit).middleware("admin.news-settings.form");
        });

        Route.prefix("/activities").group(function () {
            Route.get("/", AdminActivitiesController.getActivities);
            Route.get("/new", AdminActivitiesController.getActivitiesNew);
            Route.get("/edit", AdminActivitiesController.getActivitiesEdit);
            Route.post("/edit", AdminActivitiesController.postActivitiesEdit).middleware("admin.activity.form");
            Route.get("/delete", AdminActivitiesController.getActivitiesDelete);

            Route.get("/settings", AdminActivitySettingsController.getActivitiesSettingsEdit);
            Route.post("/settings", AdminActivitySettingsController.postActivitiesSettingsEdit).middleware("admin.activity-settings.form");
        });

        Route.prefix("/solutions").group(function () {
            Route.get("/", AdminSolutionsController.getSolutions);
            Route.get("/new", AdminSolutionsController.getSolutionsNew);
            Route.get("/edit", AdminSolutionsController.getSolutionsEdit);
            Route.post("/edit", AdminSolutionsController.postSolutionsEdit).middleware("admin.solution.form");
            Route.get("/delete", AdminSolutionsController.getSolutionsDelete);

            Route.get("/settings", AdminSolutionSettingsController.getSolutionsSettingsEdit);
            Route.post("/settings", AdminSolutionSettingsController.postSolutionsSettingsEdit).middleware("admin.solutions-settings.form");
        });

        Route.prefix("/abouts").group(function () {
            Route.get("/edit", AdminAboutsController.getAboutsEdit);
            Route.post("/edit", AdminAboutsController.postAboutsEdit).middleware("admin.about.form");
        });

        Route.prefix("/categories").group(function () {
            Route.get("/", AdminCategoriesController.getCategories);
            Route.get("/new", AdminCategoriesController.getCategoriesNew);
            Route.get("/edit", AdminCategoriesController.getCategoriesEdit);
            Route.post("/edit", AdminCategoriesController.postCategoriesEdit).middleware("admin.category.form");
            Route.post("/order", AdminCategoriesController.postCategoriesOrder);
            Route.post("/pageOrder", AdminCategoriesController.postCategoriesPageOrder);
            Route.post("/pages", AdminCategoriesController.postCategoriesPagesOrders);
            Route.get("/delete", AdminCategoriesController.getCategoriesDelete);

            Route.get("/settings", AdminCategorySettingsController.getCategorySettingsEdit);
            Route.post("/settings", AdminCategorySettingsController.postCategorySettingsEdit).middleware("admin.category-settings.form");
        });


        Route.prefix("/theme").group(function () {
            Route.get("/", AdminThemeController.getTheme);
            Route.post("/home", AdminThemeController.postThemeHome).middleware("admin.theme.home.form");
        });

        Route.prefix("/languages").group(function () {
            Route.get("/", AdminLanguagesController.getLanguages);
            Route.get("/new", AdminLanguagesController.getLanguagesNew);
            Route.get("/edit", AdminLanguagesController.getLanguagesEdit);
            Route.post("/edit", AdminLanguagesController.postLanguagesEdit).middleware("admin.language.form");
            Route.get("/delete", AdminLanguagesController.getLanguagesDelete);
        });
        
        Route.prefix("/file-manager").group(function () {
            Route.get("/get-folders", AdminFileManagerController.getFileManagerGetFolders);
            Route.post("/get-files", AdminFileManagerController.postFileManagerGetFiles);
            Route.get("/get-file", AdminFileManagerController.getFileManagerGetFile);
            Route.post("/new-folder", AdminFileManagerController.postFileManagerNewFolder);
            Route.post("/upload-file", AdminFileManagerController.postFileManagerUploadFile);
            Route.post("/delete-file", AdminFileManagerController.postFileManagerDeleteFile);
            Route.post("/update", AdminFileManagerController.postFileManagerUpdate);
        });

        Route.prefix("/settings").group(function () {
            Route.get("/", AdminSettingsController.getSettings);
            Route.post("/general-settings", AdminSettingsController.postSettingsGeneralSettings).middleware("admin.setting.general-settings.form");
            Route.post("/email-settings", AdminSettingsController.postSettingsEMailSettings).middleware("admin.setting.email-settings.form");
            Route.post("/social-media", AdminSettingsController.postSettingsSocialMedia).middleware("admin.setting.social-media.form");
            Route.post("/contact", AdminSettingsController.postSettingsContact).middleware("admin.setting.contact.form");
            Route.post("/integrations", AdminSettingsController.postSettingsIntegrations).middleware("admin.setting.integrations.form");
        });

        Route.prefix("/profile").group(function () {
            Route.get("/", AdminProfileController.getHome);
            Route.post("/account", AdminProfileController.postAccount).middleware("admin.profile.account.form");
            Route.post("/change-password", AdminProfileController.postChangePassword).middleware("admin.profile.change-password.form");
        });

    });

});


export default null;
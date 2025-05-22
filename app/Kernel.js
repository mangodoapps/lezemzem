import Authentication from "./Middlewares/Authentication.js";
import Guest from "./Middlewares/Guest.js";

// Admin Middlewares
import AdminLoginFormMiddleware from "./Middlewares/AdminMiddlewares/Login_Form.js";
import AdminAdminsFormMiddleware from "./Middlewares/AdminMiddlewares/Admin_Form.js";
import AdminSolutionFormMiddleware from "./Middlewares/AdminMiddlewares/Solution_Form.js";
import AdminAboutFormMiddleware from "./Middlewares/AdminMiddlewares/About_Form.js";
import AdminCategoryFormMiddleware from "./Middlewares/AdminMiddlewares/Category_Form.js";
import AdminThemeFormMiddleware from "./Middlewares/AdminMiddlewares/Theme_Home_Form.js";
import AdminSettingsGeneralFormMiddleware from "./Middlewares/AdminMiddlewares/Setting_General_Settings_Form.js";
import AdminSettingsEmailFormMiddleware from "./Middlewares/AdminMiddlewares/Setting_EMail_Settings_Form.js";
import AdminSettingsSocialMediaFormMiddleware from "./Middlewares/AdminMiddlewares/Setting_Social_Media_Form.js";
import AdminSettingsContactFormMiddleware from "./Middlewares/AdminMiddlewares/Setting_Contact_Form.js";
import AdminSettingsIntegrationsFormMiddleware from "./Middlewares/AdminMiddlewares/Setting_Integrations_Form.js";
import AdminProfileAccountFormMiddleware from "./Middlewares/AdminMiddlewares/Profile_Account_Form.js";
import AdminProfileChangePasswordFormMiddleware from "./Middlewares/AdminMiddlewares/Profile_Change_Password_Form.js";
import AdminLanguageFormMiddleware from "./Middlewares/AdminMiddlewares/Language_Form.js";
import AdminNewsFormMiddleware from "./Middlewares/AdminMiddlewares/News_Form.js";
import AdminNewsSettingsFormMiddleware from "./Middlewares/AdminMiddlewares/News_Settings_Form.js";
import AdminActivityFormMiddleware from "./Middlewares/AdminMiddlewares/Activity_Form.js";
import AdminActivitySettingsFormMiddleware from "./Middlewares/AdminMiddlewares/Activity_Settings_Form.js";
import AdminSolutionsSettingsFormMiddleware from "./Middlewares/AdminMiddlewares/Solutions_Settings_Form.js";
import AdminCategorySettingsFormMiddleware from "./Middlewares/AdminMiddlewares/Category_Settings_Form.js";

// Site Middlewares
import CreateContactFormMiddleware from "./Middlewares/SiteMiddlewares/Create_Contact_Form.js";


export default {

    // Route Middlewares
    routeMiddlewares: {
        "guest": Guest,
        "auth": Authentication,


        // Admin Middlewares
        "admin.login.form": AdminLoginFormMiddleware,
        "admin.admin.form": AdminAdminsFormMiddleware,
        "admin.solution.form": AdminSolutionFormMiddleware,
        "admin.about.form": AdminAboutFormMiddleware,
        "admin.category.form": AdminCategoryFormMiddleware,
        "admin.theme.home.form": AdminThemeFormMiddleware,
        "admin.setting.general-settings.form": AdminSettingsGeneralFormMiddleware,
        "admin.setting.email-settings.form": AdminSettingsEmailFormMiddleware,
        "admin.setting.social-media.form": AdminSettingsSocialMediaFormMiddleware,
        "admin.setting.contact.form": AdminSettingsContactFormMiddleware,
        "admin.setting.integrations.form": AdminSettingsIntegrationsFormMiddleware,
        "admin.profile.account.form": AdminProfileAccountFormMiddleware,
        "admin.profile.change-password.form": AdminProfileChangePasswordFormMiddleware,
        "admin.language.form": AdminLanguageFormMiddleware,
        "admin.news.form": AdminNewsFormMiddleware,
        "admin.news-settings.form": AdminNewsSettingsFormMiddleware,
        "admin.activity.form": AdminActivityFormMiddleware,
        "admin.activity-settings.form": AdminActivitySettingsFormMiddleware,
        "admin.solutions-settings.form": AdminSolutionsSettingsFormMiddleware,
        "admin.category-settings.form": AdminCategorySettingsFormMiddleware,

        // Site Middlewares
        "site.contact.form": CreateContactFormMiddleware,
    }

}
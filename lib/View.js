import Template from "art-template";
import path from "path";

class View {
    
    constructor (res, viewName, data = null) {
        viewName = viewName.replaceAll(".", "/");
        return res.view(viewName + ".art", data);
    }

    static renderFile(page, data) {
        page = page.replaceAll(".", "/");
        const templatePath = path.join(process.cwd(), "/resources/views", page);
        const html = Template(templatePath + ".art", data);
        return html;
    }
    
}

function view (res, viewName, data = null) {
    return new View(res, viewName, data);
}

export default view;
export { View };
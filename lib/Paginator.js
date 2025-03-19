class Paginator {

    constructor (req, data, count) {
        this.req = req;
        this.data = Object.entries(data).filter(([key, value]) => {
            if (count > key) {
                return true;
            }
        }).map(([key, value]) => {
            return value;
        });
        this.fullData = data;
        this.count = count;
    }

    links () {
        if (this.data.length === 0) {
            return;
        }
        else {
            if (this.req.query.page && this.req.query.page >= 1) {
                return `
                    <nav role='navigation'>
                        ${this.req.query.page > 1 ? `<a href='?page=${parseInt(this.req.query.page) - 1}'>Back</a>` : "<span>Back</span>"}
                        ${Object.values(this.fullData).length > this.count ? `<a href='?page=${parseInt(this.req.query.page) + 1}'>Next</a>` : "<span>Next</span>"}
                    </nav>
                `;
            }
            else {
                return `
                    <nav role='navigation'>
                        <span>Back</span>
                        ${Object.values(this.fullData).length > this.count ? `<a href='?page=2'>Next</a>` : "<span>Next</span>"}
                    </nav>
                `;
            }
        }
    }

}

export default Paginator;
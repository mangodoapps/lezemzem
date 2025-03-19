class Static {
    static asset(res, fileName) {
        return res.sendFile(fileName)
    }
}

export default Static;
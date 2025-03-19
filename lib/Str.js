class Str {

    static random(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static slug(text) {
      const normalizedInput = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
      const slug = normalizedInput
          .replace(/ /g, '-')
          .replace(/ı/g, 'i')
          .replace(/[^\w-]+/g, '');
      return slug;
    }

}

export default Str;
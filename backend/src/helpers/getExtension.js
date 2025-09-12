const getExtension = (filename) => {
    const splitedName = filename.split(".");
    return "." + splitedName[splitedName.length - 1];
};
module.exports = getExtension
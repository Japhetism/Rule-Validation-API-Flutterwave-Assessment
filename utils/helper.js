exports.getKeyValue = (object, key) => {
    const helper = new Helper();
    return helper.hasKeyValue(object, key)
}

class Helper {
    
    hasKeyValue (object, key) {
        const keysArray = key.split(".");
        let splittedObject = object;
        for(let i = 0; i < keysArray.length; i++) {
            const value = keysArray[i]
            splittedObject = splittedObject[value];
        }
        return splittedObject
    }

}
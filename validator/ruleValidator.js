exports.validateRequest = req => {
    let error = null;
    const requiredRuleFields = ["field", "condition", "condition_value"];
    
    const ruleValidator = new RuleValidator()

    if(!ruleValidator.hasDataField(req)) {
        error = "data is required.";
    }else if(!ruleValidator.isArray(req.data) && !ruleValidator.isString(req.data) && !ruleValidator.isObject(req.data)) {
        error = "data should be either object, array or string";
    }else if(ruleValidator.isNull(req.data) || ruleValidator.isEmptyArray(req.data) || ruleValidator.isEmptyObject(req.data)) {
        error = "data should not be empty";
    }

    if(!ruleValidator.hasRuleField(req)) {
        error = "rule is required.";
    }else if(!ruleValidator.isObject(req.rule)) {
        error = "rule should be an object.";
    }else if(ruleValidator.isEmptyObject(req.rule)) {
        error = "rule should not be empty";
    }else if(ruleValidator.hasRequiredFields(req.rule, 'rule', requiredRuleFields)) {
        error = ruleValidator.hasRequiredFields(req.rule, 'rule', requiredRuleFields);
    }
    
    return error;
}

class RuleValidator {
    
    hasDataField (req) {
        return req.data !== undefined;
    }

    hasRuleField (req) {
        return req.rule !== undefined;
    }

    isObject (req) {
        const isArray = req instanceof Array;
        const isObject =  req instanceof Object;
        return isObject && !isArray;
    }

    isArray (req) {
        console.log(req)
        console.log(req instanceof Array)
        return req instanceof Array;
    }

    isString (req) {
        return typeof req === "string";
    }

    isEmptyObject (req) {
        return Object.getOwnPropertyNames(req).length === 0;
    }

    isEmptyArray (req) {
        return req.length === 0;
    }

    isNull (req) {
        return req === null || req === "";
    }

    hasRequiredFields (req, reqType, requiredFields) {
        let error = null;
        for(let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i]
            if (!req.hasOwnProperty(field)) { 
                error = `${field} is missing from ${reqType}`
            }
        }
        return error;
        
    }

}
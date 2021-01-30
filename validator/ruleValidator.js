exports.validateRequest = req => {
    let error = null;
    let errorDetails = [];
    let showData = false;
    const requiredRuleFields = ["field", "condition", "condition_value"];
    
    const ruleValidator = new RuleValidator()

    if(!ruleValidator.isObject(req)) {
        error = "Invalid JSON payload passed."
    }

    if(!error) {
        if(!ruleValidator.hasRuleField(req)) {
            error = "rule is required.";
        }
        else if(!ruleValidator.isObject(req.rule)) {
            error = "rule should be an object.";
        }else if(ruleValidator.isEmptyObject(req.rule)) {
            error = "rule should not be empty.";
        }else if(ruleValidator.hasRequiredFields(req.rule, 'rule', requiredRuleFields)) {
            error = ruleValidator.hasRequiredFields(req.rule, 'rule', requiredRuleFields);
        }

        if(!ruleValidator.hasDataField(req)) {
            error = "data is required.";
        }else if(!ruleValidator.isArray(req.data) && !ruleValidator.isString(req.data) && !ruleValidator.isObject(req.data)) {
            error = "data should be either object, array or string.";
        }else if(ruleValidator.isNull(req.data) || ruleValidator.isEmptyArray(req.data) || ruleValidator.isEmptyObject(req.data)) {
            error = "data should not be empty.";
        }
    }

    if(!error) {
        if(!ruleValidator.hasDataRuleField(req)) {
            const value = ruleValidator.hasDataRuleField(req);
            error = value === undefined ? `field ${req.rule.field} is missing from data.` : null
        }
        else if(!ruleValidator.ruleDataValidation(req)) {
            const { rule: { field } } = req;
            error = `field ${field} failed validation.`;
            showData = true;
        }
    }
    
    errorDetails.message = error;
    errorDetails.hasError = error ? true : false;
    errorDetails.showData = showData;

    return errorDetails;

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
                error = `${field} is missing from ${reqType}.`
            }
        }
        return error;
        
    }

    hasDataRuleField (req) {
        let { rule: { field }, data } = req;
        const fieldArray = field.split(".");
        let indexes = "";
        let splittedData = data;
        for(let i = 0; i < fieldArray.length; i++) {
            const fieldRule = fieldArray[i]
            const value = splittedData[fieldRule];
            splittedData = value
        }
        return splittedData
    }

    ruleDataValidation (req) {
        const { rule: { field, condition, condition_value }, data } = req;
        const fieldRuleDataValue = this.hasDataRuleField(req)
        let error = false;
        
        if(condition === "eq") {
            error =  fieldRuleDataValue === condition_value
        }else if(condition === "neq") {
            error = fieldRuleDataValue !== condition_value
        }else if(condition === "gt") {
            error = fieldRuleDataValue > condition_value
        }else if(condition === "gte") {
            error = fieldRuleDataValue >= condition_value
        }else if(condition === "contains") {
            error =  fieldRuleDataValue.includes(condition_value)
        }
        return error
    }

}
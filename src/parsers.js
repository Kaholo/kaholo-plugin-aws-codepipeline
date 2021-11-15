const fs = require('fs');

function parseArray(value){
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof(value) === "string") return value.split("\n").map(line=>line.trim()).filter(line=>line);
    return [value];
}

function parseTags(value){
    if (!value) return undefined;
    if (Array.isArray(value)){
        if (!value.every(tag => tag.key)){
            throw "Bad AWS Tags Format";
        }
        return value;
    }
    if (typeof(value) === "string"){
        value = value.split("\n").map(line=>line.trim()).filter(line=>line);
        return value.map((line) => {
            let [key, ...val] = line.split("=");
            if (!val.length) return { key }
            val = val.join("=");
            return { key, value: val };
        });
    }
    if (typeof(value) === "object"){
        return Object.entries(value).map(([key, val]) =>
             val ? { key, value: val } : { key });
    }
    throw "Unsupported tags format!";
}

module.exports = {
    boolean : (value) =>{
        if (value === undefined || value === null || value === '') return undefined;
        return !!(value && value !=="false")
    },
    text : (value) =>{
        if (value)
            return value.split('\n');
        return undefined;
    },
    number: (value)=>{
        if (!value) return undefined;
        const parsed = parseInt(value);
        if (parsed === NaN) {
            throw `value ${value} is not a valid number`
        }
        return parsed;
    },
    autocomplete: (value)=>{
        if (!value) return undefined;
        if (value.id) return value.id;
        return value;
    },
    string: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "string") return value.trim();
        throw `value ${value} is not a valid string`;
    },
    objectOrFromPath: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "string"){
            if (!fs.existsSync(value)) throw `Couldn't find file '${value}'.`;
            const fileContent = fs.readFileSync(value, 'utf8');
            try {
                const obj = JSON.parse(fileContent);
                return obj;
            }
            catch {
                throw `The file '${value}' doesn't contain a valid JSON.`
            }
        }
        if (typeof(value) === "object") return value;
        throw `value ${value} is not a valid object or a file path`;
    },
    stages: (value)=>{
        if (!value) return undefined;
        var stages;
        if (typeof(value) === "string"){
            try {
                stages = JSON.parse(value);
            }
            catch {
                throw `Couldn't parse provided stages parameter.`
            }
        }
        if (typeof(value) === "object") stages = value;
        else throw `value ${value} is not a valid stages parameter.`;
        if (!Array.isArray(stages)) throw `Must provide stages as an array of objects`;
        if (!stages.length) throw `Must provide at least one stage`;
        if (!stages.every(stage => stage.actions && stage.actions.length > 0 && stage.name)){
            throw `One of the stages provided doesn't contain all required fields. Each stage must contain at least one action and have a name.`;
        }
        return stages;
    },
    array: parseArray,
    tags: parseTags
}
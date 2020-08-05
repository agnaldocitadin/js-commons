interface FNumberConf {
    decimalScale?: number 
    useCommaDecimalSeparator?: boolean
    showSignal?: boolean
}

interface FCurrencyConf extends FNumberConf {
    prefix: string
}

const TIMEOUT = 10000

export const utils = {

    /**
     *
     *
     * @param {number} value
     * @param {FNumberConf} [conf]
     * @returns {string}
     */
    formatNumber: (value: number, conf?: FNumberConf): string => {
        let _conf: FNumberConf = {
            decimalScale: 2,
            useCommaDecimalSeparator: true,
            showSignal: false,
            ...conf
        }
        
        let signal = _conf.showSignal && value > 0 ? "+" : ""
        let formated = value.toFixed(_conf.decimalScale)
        if (_conf.useCommaDecimalSeparator) formated = formated.replace(".", ",")
        return `${signal}${formated.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    },

    /**
     *
     *
     * @param {number} value
     * @param {FCurrencyConf} [conf]
     * @returns {string}
     */
    formatCurrency: (value: number, conf?: FCurrencyConf): string => {
        const _conf: FCurrencyConf = { prefix: "$", ...conf }
        const formattedValue = utils.formatNumber(value, _conf)
        return `${_conf.prefix} ${formattedValue}`
    },

    /**
     *
     *
     * @param {*} cpf
     * @returns {string}
     */
    formatCPF: (cpf: any): string => {
        return String(cpf)
            .slice(0, 11)
            .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    },

    /**
     *
     *
     * @param {number} startValue
     * @param {number} finalValue
     * @returns {number}
     */
    percentVariation: (startValue: number, finalValue: number): number => {
        return startValue && finalValue && ((finalValue - startValue) / startValue) * 100 || 0
    },

    /**
     *
     *
     * @param {any[]} first
     * @param {any[]} second
     * @param {("begin" | "end")} position
     * @returns
     */
    joinArrays: (first: any[], second: any[], position: "begin" | "end") => {
        if (position === "begin") {
            return [...second, ...first]
        }
        return [...first, ...second]
    },
    
    /**
     *
     *
     * @param {Promise<any>} promise
     * @param {object} error
     * @param {number} [timeout=TIMEOUT]
     * @returns {Promise<any>}
     */
    timedPromise: async (promise: Promise<any>, error: object, timeout: number = TIMEOUT): Promise<any> => {
        return Promise.race([
            promise,
            new Promise<any>((_, reject) => setTimeout(() => reject(error), timeout))
        ])
    },

    /**
     *
     *
     * @param {number} value
     * @param {number} fractionDigits
     * @returns {number}
     */
    toFixed: (value: number, fractionDigits: number): number => {
        return Number(value.toFixed(fractionDigits))
    },

    /**
     *
     *
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    minMaxScalar: (value: number, min: number, max: number): number => {
        if (max - min === 0) return 1
        return (value - min) / (max - min)
    },

    /**
     *
     *
     * @param {number} ms
     * @returns
     */
    sleep: (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    /**
     *
     *
     * @param {string} field
     * @param {*} [value]
     * @returns
     */
    nonNull: (field: string, value?: any) => {
        return { ...value && { [field]: value } }
    },

    /**
     *
     *
     * @param {*} obj
     * @param {string} [lastProperty=""]
     * @param {*} [serialization={}]
     * @returns
     */
    flatObject: (obj: any, lastProperty: string = "", serialization: any = {}) => {
        Object.keys(obj).forEach(field => {
            let value = (<any>obj)[field]
            if (value === undefined) return
    
            let property = (lastProperty !== "") ? `${lastProperty}.${field}` : `${field}`
            if (value === null) {
                serialization[property] = value
                return
            }
    
            let toSerialize = typeof value === "object"
            toSerialize ? utils.flatObject(value, property, serialization) : serialization[property] = (<any>obj)[field]
        })
    
        return serialization
    },
    
    
    /**
     *
     *
     * @template T
     * @param {...object[]} objects
     * @returns {T}
     */
    mergeObjects: <T>(...objects: object[]): T => {
        const isObject = (obj: any) => obj && typeof obj === 'object'
        
        const deepMergeInner = (target: object, source: object) => {
            Object.keys(source).forEach((key: string) => {
                const targetValue = (<any>target)[key]
                const sourceValue = (<any>source)[key]
    
                if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                    (<any>target)[key] = targetValue.concat(sourceValue)
                }
                else if (isObject(targetValue) && isObject(sourceValue)) {
                    (<any>target)[key] = deepMergeInner(Object.assign({}, targetValue), sourceValue)
                }
                else {
                    (<any>target)[key] = sourceValue
                }
            })
            return target
        }
    
        if (objects.length < 2) {
            throw new Error('deepMerge: this function expects at least 2 objects to be provided')
        }
    
        if (objects.some(object => !isObject(object))) {
            throw new Error('deepMerge: all values should be of type "object"')
        }
    
        const target: any = objects.shift()
        let source: any
    
        while (source = objects.shift()) {
            deepMergeInner(target, source)
        }
    
        return target as any
    }

}
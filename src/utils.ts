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
     * @param {string} error
     * @param {number} [timeout=TIMEOUT]
     * @returns {Promise<any>}
     */
    timedPromise: async (promise: Promise<any>, error: string, timeout: number = TIMEOUT): Promise<any> => {
        return Promise.race([
            promise,
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error(error)), timeout))
        ])
    }

}
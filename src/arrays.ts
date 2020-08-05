
export const arrays = {
    lastElements: <T> (array: Array<T>, length: number): Array<T> => {
        return array.slice(array.length - length, array.length)
    },

    lastElement: <T> (array: Array<T>): T => {
        return arrays.lastElements(array, 1)[0]
    },

    firstElements: <T> (array: Array<T>, length: number): Array<T> => {
        return array.slice(0, length)
    },

    firstElement: <T> (array: Array<T>): T => {
        return array.slice(0, 1)[0]
    },

    groupBy: <T, K>(list: T[], keyExtractor: (item: T) => K) => {
        const map = new Map<K, T[]>()
        list.forEach((item) => {
             const key = keyExtractor(item)
             const collection = map.get(key)
             if (!collection) {
                 map.set(key, [item])
             } 
             else {
                 collection.push(item)
             }
        });
        return map
    },

    sum: <T>(list: T[], keyExtractor: (item: T) => number) => {
        return list.reduce((_sum, item) => _sum += keyExtractor(item), 0)
    }
}
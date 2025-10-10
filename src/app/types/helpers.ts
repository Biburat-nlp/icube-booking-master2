// export type ObjectValues<T extends object> = T[keyof T]
//
// export function exhaustiveCheck (checkingValue: never): checkingValue is never {
//   return checkingValue
// }
//
// export const exhaustiveKeysCheck = <T extends string>() => <L extends AtLeastOne<T>>(
//   ...x: L extends any
//     ? (
//       Exclude<T, L[number]> extends never
//         ? L
//         : Exclude<T, L[number]>[]
//     )
//     : never
// ) => x;
//
// export type Nullable<T> = {
//   [K in keyof T]: T[K] | null
// }
//
// export type EndsWith<T extends string, S extends string> = T extends `${infer _}${S}` ? true : false
//
// export type NotEmptyArray<T> = readonly [T, ...T[]] | readonly [...T[], T] | readonly [T, ...T[], T]
//
// export type PredicateTestedType<P extends (...args: any[]) => any> =
//   P extends ((anything: any) => anything is infer R)
//     ? R
//     : any
//
// export type AtLeastOne<T> = readonly [T, ...T[]]
//
// export type ConstructorType<T extends ((abstract new (...args: any[]) => any) | (new (...args: any[]) => any))> = new (...args: ConstructorParameters<T>) => InstanceType<T>

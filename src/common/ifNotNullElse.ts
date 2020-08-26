
export function ifNotNullElse<V>(
  value: V | null | undefined,
  notNull: (v: V) => void,
  isNull: () => void) {
  if (value != null) {
    notNull(value);
  } else {
    isNull();
  }
}

import { ImageRecord } from "./types";

const store = new Map<string, ImageRecord>();

export function saveRecord(record: ImageRecord): void {
  store.set(record.id, record);
  console.log(`[Metadata] Saved record: ${record.id}`);
}

export function getRecord(id: string): ImageRecord | undefined {
  return store.get(id);
}

export function deleteRecord(id: string): boolean {
  const existed = store.delete(id);
  if (existed) {
    console.log(`[Metadata] Deleted record: ${id}`);
  }
  return existed;
}

export function getAllRecords(): ImageRecord[] {
  return Array.from(store.values());
}

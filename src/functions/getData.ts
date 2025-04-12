import { Institutions } from "../shared/classes/institutions";

export async function getData<T>(fetchFn: (institution: Institutions) => Promise<{ items: T[]; error: string[] } | undefined>, setListFn: React.Dispatch<React.SetStateAction<T[]>>, selectedinstitution: Institutions): Promise<void> {
    const result = await fetchFn(selectedinstitution);
    if (result) {
        const { items, error } = result;
        error.forEach(err => error.push(err));
        setListFn(items.sort((a: any, b: any) => a.getName().localeCompare(b.getName())));
    } else { }
}
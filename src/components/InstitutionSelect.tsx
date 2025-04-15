import { Institutions } from "../shared/classes/institutions";

interface Props {
    institutions: Institutions[];
    selectedInstitution: Institutions | null;
    handleMainInstitutionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function InstitutionSelect(props: Props) {
    return (
        <select onChange={props.handleMainInstitutionChange} value={props.selectedInstitution?.getId() || 'default'}>
            <option value={"default"} disabled>Institutions</option>
            {props.institutions.map((institution: Institutions) => (
                <option key={institution.getId()} value={institution.getId()}>{institution.getName()}</option>
            ))}
        </select>
    );
}
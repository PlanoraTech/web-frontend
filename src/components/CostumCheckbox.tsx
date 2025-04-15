interface Props {
    where: "top" | "bottom";
    labelText: string;
    onChange: () => void;
    checked: boolean;
    style?: React.CSSProperties;
    id?: string;
}

export function CostumCheckbox(props: Props) {
    return (
        <div className="costum_checkbox_container" style={props.style!}>
            {props.where === "top" ? <label>{props.labelText}</label> : null}
            <input id={props.id!} style={props.where == 'top' ? { marginLeft: '0.5vw' } : { marginLeft: '0' }} onChange={() => props.onChange()} type="checkbox" className="costum_checkbox" checked={props.checked} />
            {props.where === "bottom" ? <label>{props.labelText}</label> : null}
        </div>
    )
}
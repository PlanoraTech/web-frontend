export function getTokenUrl() {
    return `?token=${localStorage.getItem('token')}`;
}
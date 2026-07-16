export function base64decode(value) {
    let pattern = /^(?:[A-Za-z0-9+/]{4}){4,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    let check_printable = /^[\x20-\x7E\t\n\r]*$/;

    if (pattern.test(value)) {

        let decoded_value = Buffer.from(value, 'base64').toString('utf-8');

        if (check_printable.test(decoded_value)) {
            return decoded_value;
        }
    }
}
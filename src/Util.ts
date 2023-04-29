export function merge(...strings: any[]) {
	return strings.filter(Boolean).join(' ');
}

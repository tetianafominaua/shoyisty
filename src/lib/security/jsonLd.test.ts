import { describe, it, expect } from 'vitest';
import { jsonLdScript } from './jsonLd';

describe('JSON-LD XSS Escaping (SECURITY-v10 § 5.3)', () => {
	it('екранує небезпечні символи <, >, &, Unicode separators', () => {
		const malicious = {
			name: 'Test</script><script>alert("XSS")</script>',
			desc: 'A & B > C < D'
		};

		const scriptTag = jsonLdScript(malicious);
		expect(scriptTag).not.toContain('</script><script>');
		expect(scriptTag).toContain('\\u003c/script\\u003e');
		expect(scriptTag).toContain('\\u0026');
		expect(scriptTag).toContain('\\u003e');
	});
});

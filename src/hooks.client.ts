export const handleError = ({
	error,
	event,
	status,
	message
}: {
	error: unknown;
	event: { route: { id: string | null }; url: URL };
	status: number;
	message: string;
}) => {
	console.error('[shoyisty] Client error:', { status, message, route: event.route.id, error });

	if (
		typeof window !== 'undefined' &&
		error instanceof Error &&
		(error.message.includes('dynamically imported module') ||
			error.message.includes('Failed to fetch dynamically imported module') ||
			error.message.includes('Importing a module script failed'))
	) {
		const key = 'shoyisty_chunk_reload';
		if (!sessionStorage.getItem(key)) {
			sessionStorage.setItem(key, '1');
			window.location.reload();
			return;
		}
	}

	return {
		message: status === 404 ? 'Сторінку не знайдено' : 'Неочікувана помилка застосунку'
	};
};

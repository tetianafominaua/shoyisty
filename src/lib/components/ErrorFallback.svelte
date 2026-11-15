<script lang="ts">
	let { error, reset }: { error: unknown; reset: () => void } = $props();
</script>

<div class="error-fallback p-6 text-center my-8 rounded-2xl bg-amber-50 border border-amber-200">
	<div class="text-3xl mb-3">⚠️</div>
	<h2 class="text-xl font-bold text-gray-900 mb-2">Сталася неочікувана помилка</h2>
	<p class="text-sm text-gray-600 mb-4 max-w-md mx-auto">
		{error instanceof Error ? error.message : 'Не вдалося завантажити інтерфейс'}
	</p>
	<button
		type="button"
		class="px-5 py-2.5 rounded-xl bg-[#18432f] text-white font-medium hover:bg-[#123324] transition-colors"
		onclick={reset}
	>
		Спробувати знову
	</button>
</div>

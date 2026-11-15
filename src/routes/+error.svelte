<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="min-h-screen flex items-center justify-center p-6 bg-[#f8f6f0] text-[#1a2e22]">
	<div
		class="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-emerald-900/10 text-center"
	>
		<div class="text-6xl font-black text-[#18432f] mb-3">{page.status}</div>
		<h1 class="text-2xl font-bold mb-2">
			{page.status === 404 ? 'Сторінку не знайдено' : 'Щось пішло не так'}
		</h1>
		<p class="text-gray-600 mb-6 text-sm">
			{page.error?.message || 'Будь ласка, поверніться на головну сторінку планувальника меню.'}
		</p>
		<a
			href="/"
			class="inline-block px-6 py-3 rounded-2xl bg-[#18432f] text-white font-medium hover:bg-[#123324] transition-colors"
		>
			Повернутися до меню
		</a>
	</div>
</div>

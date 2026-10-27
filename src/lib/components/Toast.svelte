<script lang="ts">
	import { planner } from '#lib/stores/planner.svelte';
</script>

{#if planner.toastMessage}
	<div class="toast-wrapper animate-slide-up" role="status" aria-live="polite">
		<div class="toast-card">
			<span class="toast-text">{planner.toastMessage}</span>
		</div>
	</div>
{/if}

<style>
	.toast-wrapper {
		position: fixed;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		pointer-events: none;
		width: 90%;
		max-width: 420px;
	}

	.toast-card {
		background: #182620;
		color: #ffffff;
		padding: 12px 20px;
		border-radius: var(--radius-full);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
		text-align: center;
		font-size: 13px;
		font-weight: 700;
		border: 1px solid rgba(255, 255, 255, 0.15);
		letter-spacing: 0.01em;
	}
</style>

type ToastType = "Success" | "Warning" | "Failure" | "Info";

export abstract class ToastBox {
	private static readonly TOAST_DURATION = 5000; // miliseconds
	private static toastBox: HTMLDivElement | null = null;

	/**
	 * Function to retrieve the singleton box to contain all toast messages
	 *
	 * @returns the toast container box
	 */
	private static getToastContainer(): HTMLDivElement {
		if (!this.toastBox) {
			this.toastBox = document.createElement("div");
			this.toastBox.className = "toast-container";
			document.body.append(this.toastBox);
		}
		return this.toastBox;
	}

	/**
	 * Remove a toast from the list of visible messages. Animates out.
	 *
	 * @param toast The toast element to remove
	 */
	private static removeToast(toast: HTMLDivElement) {
		toast.classList.remove("toast--visible");
		toast.classList.add("toast--leaving");
		toast.addEventListener("transitionend", () => toast.remove(), { once: true });
	}

	/**
	 * Display a new toast message on the screen
	 *
	 * @param toastMessage The message to display on the toast
	 * @param toastType The type of message; determines decorations
	 */
	public static showToast(toastMessage: string, toastType: ToastType) {
		/* -------------------- Get the container to hold toasts -------------------- */
		const toastContainer = ToastBox.getToastContainer();

		/* ---------------------------- Add our new toast --------------------------- */
		const toast = document.createElement("div");
		toast.className = `toast toast--${toastType}`;
		toast.textContent = toastMessage;
		toastContainer.append(toast);

		/* ----------------------- Animate the toast coming in ---------------------- */
		requestAnimationFrame(() => toast.classList.add("toast--visible"));

		/* ----------------------- Animate the toast aging out ---------------------- */
		setTimeout(() => ToastBox.removeToast(toast), ToastBox.TOAST_DURATION);
	}
}

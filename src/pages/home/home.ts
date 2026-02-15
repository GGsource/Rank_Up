addEventListener("DOMContentLoaded", () => {
	const newRankUpBtn = document.getElementById("create-new-rankup-card");
	if (newRankUpBtn) {
		newRankUpBtn.addEventListener("click", (event) => {
			window.location.href = "/src/pages/rankup/rankup.html";
		});
	}
});

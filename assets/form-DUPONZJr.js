import{n as e,t}from"./index-C8CnH6fE.js";import{n}from"./UserData-BtkTIZNg.js";var r=`<form id="form-view" class="page-view form-view">
	<!-- ------------------------------- Header -------------------------------- -->
	<div id="form-header">RankUp Creation Form</div>
	<!-- ----------------------------- Input Title ----------------------------- -->
	<label for="form-title-input" class="form-label">RankUp Title:</label>
	<input id="form-title-input" class="form-input" placeholder="Title here..." required />
	<!-- -------------------------- Input Description -------------------------- -->
	<label for="form-desc-input" class="form-label">RankUp Description</label>
	<textarea id="form-desc-input" class="form-input" placeholder="Description here..." maxlength="330" rows="3"></textarea>
	<!-- ---------------------------- Input Images ----------------------------- -->
	<label class="form-label">RankUp Images</label>
	<input type="file" id="form-file-input" name="files input" accept="image/*" hidden multiple />
	<div id="form-upload-area">
		<div id="upload-indicators">
			Drag images here or click to browse
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-upload-icon lucide-upload"
			>
				<path d="M12 3v12" />
				<path d="m17 8-5-5-5 5" />
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			</svg>
		</div>
		<div id="upload-image-container" hidden></div>
	</div>
	<button id="clear-uploads" class="form-button" type="button" disabled>Clear All</button>
	<!-- ----------------------------- Submission ------------------------------ -->
	<button id="form-submit" class="form-button" type="submit">Submit RankUp</button>
</form>
`,i=class{getEl(e){let t=document.getElementById(e);if(!t)throw Error(`Fatal Error: Failed to locate #${e}`);return t}},a=class e{static{this.TOAST_DURATION=5e3}static{this.toastBox=null}static getToastContainer(){return this.toastBox||(this.toastBox=document.createElement(`div`),this.toastBox.className=`toast-container`,document.body.append(this.toastBox)),this.toastBox}static removeToast(e){e.classList.remove(`toast--visible`),e.classList.add(`toast--leaving`),e.addEventListener(`transitionend`,()=>e.remove(),{once:!0})}static showToast(t,n){let r=e.getToastContainer(),i=document.createElement(`div`);i.className=`toast toast--${n}`,i.textContent=t,r.append(i),requestAnimationFrame(()=>i.classList.add(`toast--visible`)),setTimeout(()=>e.removeToast(i),e.TOAST_DURATION)}},o=class extends i{constructor(){super(),this.formFileInput=this.getEl(`form-file-input`),this.formUploadContainer=this.getEl(`form-upload-area`),this.clearUploadsButton=this.getEl(`clear-uploads`),this.uploadsContainer=this.getEl(`upload-image-container`),this.uploadIndicators=this.getEl(`upload-indicators`),this.formView=this.getEl(`form-view`),this.titleInput=this.getEl(`form-title-input`),this.descInput=this.getEl(`form-desc-input`),this.collectedURLs=[],this.toggleablePlaceHolders=!0,this.enablePlaceHolders=!1,window.addEventListener(`keydown`,e=>{this.toggleablePlaceHolders&&e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()===`p`&&(this.enablePlaceHolders=!this.enablePlaceHolders,a.showToast(`Placeholders ${this.enablePlaceHolders?`enabled`:`disabled`}!`,this.enablePlaceHolders?`Success`:`Warning`),this.formUploadContainer.inert=this.enablePlaceHolders,this.formUploadContainer.style.opacity=this.enablePlaceHolders?`0.2`:``,this.enablePlaceHolders&&this.clearUploadsButton.click())}),this.descInput.addEventListener(`keydown`,e=>{e.key===`Enter`&&e.ctrlKey&&(e.preventDefault(),this.formView.requestSubmit())}),this.formFileInput.addEventListener(`change`,()=>this.handleFiles(this.formFileInput.files)),this.formUploadContainer.addEventListener(`click`,()=>this.formFileInput.click()),this.formUploadContainer.addEventListener(`dragover`,e=>{e.preventDefault(),this.formUploadContainer.classList.add(`drag-active`)}),this.formUploadContainer.addEventListener(`dragleave`,()=>this.formUploadContainer.classList.remove(`drag-active`)),this.formUploadContainer.addEventListener(`drop`,e=>{e.preventDefault(),this.formUploadContainer.classList.remove(`drag-active`),this.handleFiles(e.dataTransfer?.files)}),this.clearUploadsButton.addEventListener(`click`,()=>{Array.from(this.uploadsContainer.getElementsByClassName(`delete-button`)).forEach(e=>e.click())}),this.formView.addEventListener(`submit`,t=>{t.preventDefault(),!this.enablePlaceHolders&&this.collectedURLs.length<2?(a.showToast(`At least 2 images must be selected!`,`Failure`),this.formUploadContainer.classList.add(`input--errored`),setTimeout(()=>this.formUploadContainer.classList.remove(`input--errored`),800)):(this.toggleablePlaceHolders=!1,n(this.titleInput.value,this.descInput.value,this.collectedURLs),e(`rankup`))}),this.titleInput.addEventListener(`invalid`,e=>{this.titleInput.classList.add(`input--errored`),setTimeout(()=>this.titleInput.classList.remove(`input--errored`),800),a.showToast(`Title is required for a new RankUp!`,`Failure`)})}handleFiles(e){if(!e)throw Error(`Fatal Error: #form-file-input's FileList object was invalid.`);if(e.length<1){console.warn(`Dragged in non-file, likely from a webpage. This is not currently supported.`);return}for(let t of e){if(!t.type.startsWith(`image/`)){console.warn(`Tried to upload non-image: ${t.name}`);continue}let e=document.createElement(`div`);e.className=`image-wrapper`,this.uploadsContainer.append(e);let n=document.createElement(`img`);n.className=`uploaded-image`;let r=URL.createObjectURL(t);n.src=r,this.collectedURLs.push(r),e.append(n);let i=document.createElement(`div`);i.className=`delete-button`,i.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,i.addEventListener(`click`,t=>{t.stopPropagation(),e.remove(),URL.revokeObjectURL(n.src);let i=this.collectedURLs.indexOf(r);i!==-1&&this.collectedURLs.splice(i,1),this.uploadsContainer.hasChildNodes()||this.hideIndicators(!1)}),e.append(i)}this.uploadsContainer.hasChildNodes()&&this.hideIndicators(!0)}hideIndicators(e){this.uploadIndicators.hidden=e,this.uploadsContainer.hidden=!e,this.clearUploadsButton.disabled=!e}};async function s(e){e.innerHTML=r,new o}t(`form`,s);
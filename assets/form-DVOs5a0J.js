import{n as e,t}from"./index-o7KH8RWi.js";import{n}from"./UserData-BtkTIZNg.js";var r=`<form id="form-view" class="page-view form-view">
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
	<button id="clear-uploads" type="button" disabled>Clear All</button>
	<!-- ----------------------------- Submission ------------------------------ -->
	<button id="form-submit" type="submit">Submit RankUp</button>
</form>
`,i=class{getEl(e){let t=document.getElementById(e);if(!t)throw Error(`Fatal Error: Failed to locate #${e}`);return t}},a=class extends i{constructor(){super(),this.formFileInput=this.getEl(`form-file-input`),this.formUploadContainer=this.getEl(`form-upload-area`),this.clearUploadsButton=this.getEl(`clear-uploads`),this.uploadsContainer=this.getEl(`upload-image-container`),this.uploadIndicators=this.getEl(`upload-indicators`),this.formView=this.getEl(`form-view`),this.titleInput=this.getEl(`form-title-input`),this.descInput=this.getEl(`form-desc-input`),this.collectedURLs=[],this.descInput.addEventListener(`keydown`,e=>{e.key===`Enter`&&e.ctrlKey&&(e.preventDefault(),this.formView.requestSubmit())}),this.formFileInput.addEventListener(`change`,()=>this.handleFiles(this.formFileInput.files)),this.formUploadContainer.addEventListener(`click`,()=>this.formFileInput.click()),this.formUploadContainer.addEventListener(`dragover`,e=>{e.preventDefault(),this.formUploadContainer.classList.add(`drag-active`)}),this.formUploadContainer.addEventListener(`dragleave`,()=>this.formUploadContainer.classList.remove(`drag-active`)),this.formUploadContainer.addEventListener(`drop`,e=>{e.preventDefault(),this.formUploadContainer.classList.remove(`drag-active`),this.handleFiles(e.dataTransfer?.files)}),this.clearUploadsButton.addEventListener(`click`,()=>{this.uploadsContainer.querySelectorAll(`img.uploaded-image`).forEach(e=>URL.revokeObjectURL(e.src)),this.uploadsContainer.hidden=!0,this.uploadIndicators.hidden=!1,this.clearUploadsButton.disabled=!0}),this.formView.addEventListener(`submit`,t=>{t.preventDefault(),n(this.titleInput.value,this.descInput.value,this.collectedURLs),e(`rankup`)})}handleFiles(e){if(!e)throw Error(`Fatal Error: #form-file-input's FileList object was invalid.`);if(e.length<1){console.warn(`Dragged in non-file, likely from a webpage. This is not currently supported.`);return}for(let t of e){if(!t.type.startsWith(`image/`)){console.warn(`Tried to upload non-image: ${t.name}`);continue}let e=document.createElement(`div`);e.className=`image-wrapper`,this.uploadsContainer.append(e);let n=document.createElement(`img`);n.className=`uploaded-image`;let r=URL.createObjectURL(t);n.src=r,this.collectedURLs.push(r),e.append(n);let i=document.createElement(`button`);i.className=`delete-button`,i.type=`button`,i.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,i.addEventListener(`click`,t=>{t.stopPropagation(),e.remove(),URL.revokeObjectURL(n.src);let i=this.collectedURLs.indexOf(r);i!==-1&&this.collectedURLs.splice(i,1),this.uploadsContainer.hasChildNodes()||this.hideIndicators(!1)}),e.append(i)}this.uploadsContainer.hasChildNodes()&&this.hideIndicators(!0)}hideIndicators(e){this.uploadIndicators.hidden=e,this.uploadsContainer.hidden=!e,this.clearUploadsButton.disabled=!e}};async function o(e){e.innerHTML=r,new a}t(`form`,o);
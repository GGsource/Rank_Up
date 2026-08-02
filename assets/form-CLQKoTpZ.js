import{n as e,t}from"./index-qBi4YmN3.js";import{n}from"./UserData-BtkTIZNg.js";var r=`<form id="form-view" class="page-view form-view">
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
`,i=[];async function a(t){t.innerHTML=r;let a=document.getElementById(`form-file-input`);if(!a)throw Error(`Fatal Error: Failed to locate #form-file-input`);a.addEventListener(`change`,e=>{let t=e.target;o(t.files)});let s=document.getElementById(`form-upload-area`);if(!s)throw Error(`Fatal Error: Failed to locate #form-file-container`);s.addEventListener(`click`,()=>a.click()),s.addEventListener(`dragover`,e=>{e.preventDefault(),s.classList.add(`drag-active`)}),s.addEventListener(`dragleave`,()=>s.classList.remove(`drag-active`)),s.addEventListener(`drop`,e=>{e.preventDefault(),s.classList.remove(`drag-active`),o(e.dataTransfer?.files)});let c=document.getElementById(`clear-uploads`);if(!c)throw Error(`Fatal Error: Failed to locate #clear-uploads`);c.addEventListener(`click`,e=>{console.log(`clicked clear button...`);let t=document.getElementById(`upload-image-container`);if(!t)throw Error(`Fatal Error: Failed to locate #upload-image-container`);t.querySelectorAll(`img.uploaded-image`).forEach(e=>URL.revokeObjectURL(e.src)),t.hidden=!0;let n=document.getElementById(`upload-indicators`);if(!n)throw Error(`Fatal Error: Failed to locate #upload-indicators`);n.hidden=!1,c.disabled=!0});let l=document.getElementById(`form-view`);if(!l)throw Error(`Fatal Error: Failed to locate #form-view`);l.addEventListener(`submit`,t=>{t.preventDefault();let r=document.getElementById(`form-title-input`);if(!r)throw Error(`Fatal Error: Failed to locate #form-title-input`);let a=document.getElementById(`form-desc-input`);if(!a)throw Error(`Fatal Error: Failed to locate #form-desc-input`);n(r.value,a.value,i),e(`rankup`)})}t(`form`,a);function o(e){if(!e)throw Error(`Fatal Error: Files object was invalid, associated elements must be missing`);if(e.length<1){console.warn(`Dragged in non-file, likely from a webpage. This is not currently supported.`);return}let t=document.getElementById(`upload-indicators`);if(!t)throw Error(`Fatal Error: Failed to locate #upload-indicators`);let n=document.getElementById(`upload-image-container`);if(!n)throw Error(`Fatal Error: Failed to locate #upload-image-container`);for(let r of e){if(!r.type.startsWith(`image/`)){console.warn(`Tried to upload non-image: ${r.name}`);continue}let e=document.createElement(`div`);e.className=`image-wrapper`,n.append(e);let a=document.createElement(`img`);a.className=`uploaded-image`;let o=URL.createObjectURL(r);a.src=o,i.push(o),e.append(a);let c=document.createElement(`button`);c.className=`delete-button`,c.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,c.addEventListener(`click`,r=>{r.stopPropagation(),e.remove(),URL.revokeObjectURL(a.src);let c=i.indexOf(o);c!==-1&&i.splice(c,1),n.hasChildNodes()||s(t,n)}),e.append(c)}if(n.hasChildNodes()){t.hidden=!0,n.hidden=!1;let e=document.getElementById(`clear-uploads`);if(!e)throw Error(`Fatal Error: Failed to locate #clear-uploads`);e.disabled=!1}}function s(e,t){e.hidden=!e.hidden,t.hidden=!t.hidden;let n=document.getElementById(`clear-uploads`);if(!n)throw Error(`Fatal Error: Failed to locate #clear-uploads`);n.disabled=!n.disabled}
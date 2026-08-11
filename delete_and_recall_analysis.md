## Recalled Transaction Resubmission & Referral Number Lifecycle Rule

> [!IMPORTANT]
> **Business Requirement:**
> When a Maker recalls a transaction in `Pending Authorization` status (`businessStatus === 'RA'`), modifies it, and resubmits it:
> 1. **Original Transaction Status:** The existing transaction record (holding the original referral number) status is updated to `DELETED` / `REVOKED`.
> 2. **New Referral Number Generation:** The resubmitted transaction is created as a **brand-new transaction** with a **new referral number**.

## Files Copy-Pasted / Ported from NBFUI to UI

The following files were directly created, copy-pasted, or integrated from `C:\Users\gopi.bharat\Downloads\NBFUI` into `D:\K4(13-07)\K4_NBF_CP-tradeservices\dtbwebapp\UI` to support the Delete and Recall functionality:

### 1. Brand New Components & Assets (Directly Copy-Pasted Files)
- `src/app/common-components/delete-success-page/delete-success-page.component.ts`
- `src/app/common-components/delete-success-page/delete-success-page.component.html`
- `src/app/common-components/delete-success-page/delete-success-page.component.scss`
- `src/app/common-components/trade-clear-cancel/trade-clear-cancel.component.ts`
- `src/app/common-components/trade-clear-cancel/trade-clear-cancel.component.html`
- `src/app/common-components/trade-clear-cancel/trade-clear-cancel.component.scss`
- `src/assets/images/trade/CloseIconIssuance.svg`
- `src/assets/images/trade/MessageIcon.svg`

### 2. Core Shared Components & Utilities Modified/Ported from NBFUI
- `src/app/common-components/common-components.module.ts`
- `src/app/trade/trade-routing.module.ts`
- `src/app/trade/trade.module.ts`
- `src/app/common-components/trade-data-table/trade-data-table.component.ts`
- `src/app/common-components/trade-data-table/trade-data-table.component.html`
- `src/app/common-components/trade-data-table/trade-data-table.component.scss`
- `src/app/common-components/trade-more-action/trade-more-action.component.ts`
- `src/app/common-components/trade-more-action/trade-more-action.component.html`
- `src/app/my-task/accept-reject/accept-reject.component.ts`
- `src/app/my-task/accept-reject/accept-reject.component.html`

### 3. Services Modified/Ported from NBFUI
- `src/app/dtbm/cloudDashboard/service/trade/save-as/save-as.service.ts`
- `src/app/dtbm/cloudDashboard/service/my-task/my-task.service.ts`
- `src/app/dtbm/cloudDashboard/service/trade/common-services/common-service.service.ts`
- `src/app/dtbm/cloudDashboard/service/trade/shared-trade/shared-trade.service.ts`
- `src/app/dtbm/cloudDashboard/utility/rest-api.service.ts`
- `src/app/dtbm/cloudDashboard/utility/contextaction.ts`

### 4. Trade Module In-Progress Summary Components Integrated with Recall
- `src/app/trade/importlc/ilc-in-progress/ilc-in-progress.component.ts`
- `src/app/trade/guarantees/outward-in-progress/outward-in-progress.component.ts`
- `src/app/trade/shipping-guarantee/guarantees-shipping-in-progress/guarantees-shipping-in-progress.component.ts`
- `src/app/trade/transfer-lc/transfer-lc-in-progress/transfer-lc-in-progress.component.ts`
- `src/app/trade/back-to-back-lc/back-to-back-progress/back-to-back-progress.component.ts`
- `src/app/trade/bills/import-bills/in-progress/in-progress.component.ts`
- `src/app/trade/bills/transfer-bills/transfer-bills-in-progress/transfer-bills-in-progress.component.ts`
- `src/app/trade/export-bills/export-bill-progress/export-bill-progress.component.ts`
- `src/app/trade/export-collections/export-collection-inprogress/export-collection-inprogress.component.ts`
- `src/app/trade/export-finance/export-finance-progress/export-finance-progress.component.ts`
- `src/app/trade/export-lc/export-lc-in-progress/export-lc-in-progress.component.ts`
- `src/app/trade/import-finance/import-finance-in-progress/import-finance-in-progress.component.ts`
- `src/app/trade/inward-collections/inward-collection-summary-inprogress/inward-collection-summary-inprogress.component.ts`
- `src/app/trade/inward-guarantee/inward-guarantee-summary/inward-guarantee-summary.component.ts`

---

## Detailed Line-by-Line Explanations

### 🔴 Lines 276 & 278: trade-data-table.component.html
```html
[class.red-button]="... || element[subColumn]==='Deleted'"
[class.red-dot]="... || element[subColumn]==='Deleted'"
```
- 🎯 **What it does:** Colors the status badge RED (red pill background + red circle dot) when a row's status is `'Deleted'`.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Did not check `|| element[subColumn]==='Deleted'`.
  - **Why Added:** Active transactions show a green dot by default. Adding `|| element[subColumn]==='Deleted'` highlights deleted items with a RED badge so users instantly notice them.
- ⏮️ **Before:** Checks if the column renders a status badge.
- ⏭️ **After:** Renders the status badge in RED with the text `"Deleted"`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO DELETE.
- ⚠️ **Revert Impact:** VISUAL ONLY (NO FUNCTIONAL BREAK). Deletion API logic will still work normally. However, deleted rows will display a GREEN dot next to `"Deleted"` instead of a RED badge.

---

### ✏️ Lines 482–492: trade-data-table.component.html (`Edit Icon Entitlement Check`)
```html
<div class="edit-icon" [hidden]="!isEditAndDeleteRequired"
    *ngIf="(getTransactionStatusValue(element) === 'AR') 
    || (getTransactionStatusValue(element) === 'BULKPAY') 
    || (getTransactionStatusValue(element) === 'QR') 
    || (getTransactionStatusValue(element) === 'R')
    || (getTransactionStatusValue(element) === 'RE') 
    || (getTransactionStatusValue(element) === 'RH') 
    || (getTransactionStatusValue(element) === 'RN') 
    || (getTransactionStatusValue(element) === 'RO') 
    || (getTransactionStatusValue(element) === 'RS')
    || (getTransactionStatusValue(element) === 'TR')
    || isReferredToCorporate(element) ..."
    (click)="actionOnRecord('edit' , element)">
</div>
```
- 🎯 **What it does:** Renders the edit pencil icon in summary table rows for transactions in editable states (such as Drafts, Recalled, or Rejected).
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Evaluated status by checking `element[businessStatus]`.
  - **New Code:** Resolves status using the helper function `getTransactionStatusValue(element)`.
  - **Reason for Change:** Several modules (such as Transfer LC, Bills, and Collections) do not have a `businessStatus` property (they use `lcStatus`, `billStatus`, or `status`). By using the `getTransactionStatusValue(element)` helper, we dynamically extract the correct status string across all modules, ensuring the Edit button displays for Maker resubmission.
- 🔗 **Delete / Recall Relation:** **DIRECT.** Once a transaction is recalled by a Maker, its status is changed to `TR` or `RH`. This check ensures the Maker is allowed to click the Edit icon to modify and resubmit the recalled transaction.
- ⚠️ **Revert Impact:** **YES.** Reverting to `element[businessStatus]` will hide the edit button for all recalled transactions on Transfer LC, Bills, and Collections summary pages.

---

### 🗑️ Lines 497–499: trade-data-table.component.html
```html
<div class="delete-icon in-progress-delete"
    *ngIf="(isDeleteEnabled && (element?.transactionStatus !== 'Pending for Acceptance') && ((getTransactionStatusValue(element) === 'RH') || (getTransactionStatusValue(element) === 'RO') || (getTransactionStatusValue(element) === 'TR')))"
    (click)="openDeleteInProgressRecord(element)" [hidden]="!isEditAndDeleteRequired">
</div>
```
- 🎯 **What it does:** Renders the Delete Trash Icon in table rows for in-progress transactions in `'RH'`, `'RO'`, or `'TR'` status (Returned to Maker / Rejected / Recalled).
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing in-progress delete icon block.
  - **Why Added:** Allows Makers to permanently delete draft or recalled in-progress transactions that they no longer want to process.
- ⏮️ **Before:** Checks `isDeleteEnabled`, transaction status, and entitlements.
- ⏭️ **After:** Renders the trash icon. Clicking it calls `openDeleteInProgressRecord(element)` which opens the `<trade-clear-cancel>` confirmation modal.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO DELETE. Primary UI button triggering the in-progress transaction deletion flow.
- ⚠️ **Revert Impact:** YES, IT WILL BREAK DELETE FROM TABLES! Removing or reverting this block will hide the Delete trash icon, preventing users from deleting in-progress transactions.

---

### ⚙️ Lines 505–520: trade-data-table.component.html
```html
<app-trade-more-action ...
    [businessStatus]="getTransactionStatusValue(element)"
    [moduleType]="moduleType"
    (entitledUser)="entitledUserMakerOrChecker($event)"
    [summaryRecords]="dataSource.data"
    [isPendingRecord]="element?.isPendingRecord || false"
    (onMenuClick)="$event === 'Recall' ? recallInProgressRecord(element) : selectedActionMenu.emit({$event, element})"
    (delete)="deleteActionOnRecord(element)">
</app-trade-more-action>
```
- **Line 505 (`[businessStatus]`):**
  - 🎯 **What it does:** Passes the normalized status string into `<app-trade-more-action>`.
  - 🔄 **Why Modified:** Evaluated to `undefined` for Transfer LC (`lcStatus`) and Bills (`billStatus`). Changing to `getTransactionStatusValue(element)` ensures status is properly passed so `TradeMoreActionComponent` displays the "Recall" option across all modules.
  - ⚠️ **Revert Impact:** Hides "Recall" menu item on Transfer LC and Bills.
- **Lines 510–511 (`[moduleType]` & `(entitledUser)`):**
  - 🎯 **What it does:** Dynamically manages Maker/Checker permission state for row action buttons.
  - 🔄 **Why Modified:** Evaluates Maker/Checker role permissions and passes `(entitledUser)` event to toggle `isEditAndDeleteRequired` (showing/hiding Edit & Delete icons).
  - ⚠️ **Revert Impact:** Role permission check fails; non-entitled users could see Edit/Delete buttons or Makers could lose access.
- **Lines 515–516 (`[summaryRecords]` & `[isPendingRecord]`):**
  - 🎯 **What it does:** Provides table context for library item entitlement checks.
  - 🔄 **Why Modified:** Passes dataset so action menu can check if library items (Beneficiaries, Clauses) have pending items in authorization.
  - ⚠️ **Revert Impact:** Minor visual context loss for library items.
- **Line 518 (`(onMenuClick)`):**
  - 🎯 **What it does:** Triggers the Recall routing workflow when user selects "Recall" from the dropdown.
  - 🔄 **Why Modified:** Intercepts `$event === 'Recall'` directly to invoke `recallInProgressRecord(element)` and navigate to the Accept/Reject screen.
  - ⚠️ **Revert Impact:** BREAKS RECALL ROUTING! Clicking "Recall" will do nothing.
- **Line 520 (`(delete)`):**
  - 🎯 **What it does:** Routes the Delete action click. For processed Import LCs, it routes to `importLcDeleteAction(element)`. For all other records, it calls `deleteActionOnRecord(element)`.
  - 🔄 **Why Modified:** Removed the unused legacy `#deleteRow` parameter so template/draft deletions cleanly route to `deleteActionOnRecord(element)` and open the `<trade-clear-cancel>` modal, while keeping the custom processed Import LC deletion flow (`importLcDeleteAction`) intact.
  - ⚠️ **Revert Impact:** Deletions from action menus will fail to open the confirmation popup due to signature mismatch, and Import LC processed cancellations will not route correctly.

---

### 🪟 Lines 621 & 651–655: trade-data-table.component.html
- **Line 621 (`(deleteActionRecord)`):**
  - 🎯 **What it does:** Handles deletion events triggered from accordion/grouped data tables.
  - 🔄 **Why Modified:** Removed unused `#deleteRow` parameter so accordion table deletions cleanly trigger `deleteActionOnRecord($event)` and open the `<trade-clear-cancel>` modal.
  - ⚠️ **Revert Impact:** Accordion table deletion will fail due to method signature mismatch.
- **Lines 651–655 (`<trade-clear-cancel>` popup markup):**
  - 🎯 **What it does:** Renders the Yes/No confirmation dialog when a user clicks the Delete trash icon.
  - 🔄 **Why Modified:** Added `<trade-clear-cancel *ngIf="isClosePopup">` overlay modal to host confirmation dialog for in-progress deletions.
  - ⚠️ **Revert Impact:** BREAKS DELETE CONFIRMATION DIALOG! Confirmation popups will fail to display on screen.

---

### 📦 Lines 3–5: trade-data-table.component.ts
```typescript
import { Router } from '@angular/router';
import { SaveAsService } from 'src/app/dtbm/cloudDashboard/service/trade/save-as/save-as.service';
import { MyTaskService } from 'src/app/dtbm/cloudDashboard/service/my-task/my-task.service';
```
- 🎯 **What it does:** Imports Angular `Router`, `SaveAsService`, and `MyTaskService` into `TradeDataTableComponent`.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** These 3 imports were not present in `TradeDataTableComponent`.
  - **Why Added:**
    1. `Router`: Navigates to `/trade/delete/success-page` after deletion, and to `my-task/accept-reject` for Recall.
    2. `SaveAsService`: Invokes the `deleteInProgressTransaction()` API.
    3. `MyTaskService`: Sets `setActionInfoAndRowInfoData` when a user clicks Recall.
- ⏮️ **Before:** Declares imports at the top of the file.
- ⏭️ **After:** Allows dependency injection of `router`, `saveAsService`, and `myTaskService` in the component constructor.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO BOTH DELETE & RECALL.
- ⚠️ **Revert Impact:** YES, IT WILL CAUSE COMPILATION & RUNTIME CRASHES! Removing these imports will throw TypeScript `Cannot find name` errors and break both Delete and Recall actions.

---

### 🔄 Lines 689–695: my-task.service.ts (`revokeTransaction`)
```typescript
public revokeTransaction(reqData:any){
  if (environment.localURL) {
    return this.restApiService.getJSON('assets/simulateAPI/trade-revoke-auth.json', reqData);
  } else {
    return this.restApiService.post('revokeOrDeleteTxn', reqData);
  }
}
```
- 🎯 **What it does:** Sends an HTTP POST request to backend API `'revokeOrDeleteTxn'` (or local mock JSON) with transaction reference and recall reason payload.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** `revokeTransaction` was not present in `MyTaskService` in K4.
  - **Why Added:** Primary backend service method invoked by `AcceptRejectComponent` when a Maker submits a Recall request.
- ⏮️ **Before:** User submits Recall form on the Accept/Reject screen.
- ⏭️ **After:** Sends POST request to `'revokeOrDeleteTxn'` to pull the transaction out of Checker authorization queue and return it to Maker draft list.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Core Backend Service Method).
- ⚠️ **Revert Impact:** YES! Reverting will completely break Recall submission on `AcceptRejectComponent`.

---

### 🎨 Lines 230–243 & 393–405: trade-report-data-table.component.scss
```scss
.icons-aligment {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .edit-icon,
    .delete-icon,
    .accept-icon,
    .reject-icon,
    .inline-block,
    .summary-inline-block {
        top: 0 !important;
    }
}

.mat-column-summaryActions,
.mat-column-actions,
...
td:has(.icons-aligment),
td:has(app-trade-more-action),
td:has(app-more-action) {
    vertical-align: middle !important;
}
```
- 🎯 **What it does:** Styling rules in `trade-report-data-table.component.scss` providing vertical and horizontal centering for action column icons (`.delete-icon`) and `<app-trade-more-action>`.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Icons used baseline alignment and relative offsets, causing the Delete icon and 3-dots dropdown menu to look misaligned relative to row text.
  - **Why Added:** Uses Flexbox centering (`align-items: center`), `top: 0 !important`, and `vertical-align: middle !important` on table cells to keep `.delete-icon` and `<app-trade-more-action>` vertically centered.
- ⏮️ **Before:** Action icons appear offset or misaligned in report table rows.
- ⏭️ **After:** Action icons (`.delete-icon`) and `<app-trade-more-action>` render cleanly centered in table cells.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO UI VISUAL STYLING FOR DELETE AND RECALL.
- ⚠️ **Revert Impact:** VISUAL STYLING ONLY. Removing these rules will cause the Delete trash icon and 3-dots Recall menu button to appear misaligned inside table cells.

---

### 🗑️ Lines 116–122: save-as.service.ts (`deleteInProgressTransaction`)
```typescript
public deleteInProgressTransaction(reqData: any): Observable<any> {
  if (environment.localURL) {
    return this.restApiService.getJSON('assets/simulateAPI/save-as-templates-and-drafts/save-as-transaction-response.json');
  } else {
    return this.restApiService.post('revokeOrDeleteTxn', reqData);
  }
}
```
- 🎯 **What it does:** Sends an HTTP POST request to backend API `'revokeOrDeleteTxn'` with `MODULE_ID: DELETETXN` and reference number payload to delete an in-progress transaction.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Method was missing in `SaveAsService` in K4.
  - **Why Added:** Primary backend service call invoked by `TradeDataTableComponent.deleteInProgressRecord()` when a user confirms in-progress transaction deletion inside the `<trade-clear-cancel>` popup.
- ⏮️ **Before:** User clicks "Yes" in the deletion confirmation modal dialog.
- ⏭️ **After:** Sends POST request to `'revokeOrDeleteTxn'`, returns SUCCESS/FAILED status, and navigates to `/trade/delete/success-page`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO DELETE (Core Backend Service API Method).
- ⚠️ **Revert Impact:** YES! Reverting will completely break in-progress transaction deletion across all 14 trade modules, throwing `TypeError: this.saveAsService.deleteInProgressTransaction is not a function`.

---

### 📄 Lines 36 & 84: transfer-lc.service.ts (`isTransferLcFromExportLC`)
```typescript
public isTransferLcFromExportLC: boolean;
// In constructor:
this.isTransferLcFromExportLC = false;
```
- 🎯 **What it does:** Service state flag in `TransferLcService` indicating if the active Transfer LC was initiated from an Export LC record.
- 🔄 **Why We Added/Modified It (Old vs New Code):**
  - **Old Code:** Declared and initialized in `TransferLcService`.
  - **Why Included:** Checked by `TradeMoreActionComponent.removeInTransactionListAction()` to filter out the "Amendment" option from 3-dots action menus for Transfer LCs linked to Export LCs.
- ⏮️ **Before:** Constructor initializes `this.isTransferLcFromExportLC = false`.
- ⏭️ **After:** Evaluated by `TradeMoreActionComponent` when building row action menus.
- 🔗 **Delete / Recall Relation:** INDIRECT (Row action menu entitlement state).
- ⚠️ **Revert Impact:** NO IMPACT ON DELETE OR RECALL. Modifying or removing this flag will only alter whether the Amendment option is filtered out on Export LC-linked Transfer LCs. Delete and Recall will continue working 100% normally.

---

### 📋 Lines 25 & 77–350: contextaction.ts (`actionMenuForProduct`)
```typescript
export function actionMenuForProduct(filterCifRecords: any, productInfo: any, businessStatus?: any, currentRecord?: any, sblcStatus?: string, isMakerUser?: boolean) {
    ...
    if (businessStatus === 'RA' && isMakerUser) {
        menuList.push({ 'displayName': 'APP_LABELS.LBL_RECALL_ENTITLE', 'value': 'Recall' });
    }
}
```
- 🎯 **What it does:** Builds the array of 3-dots dropdown menu items (`moreActionList`) for each trade module. Checks if a transaction is in `'RA'` (Ready for Authorization) status and if the logged-in user is a Maker (`isMakerUser === true`). If so, appends `{ displayName: 'APP_LABELS.LBL_RECALL_ENTITLE', value: 'Recall' }`.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing `isMakerUser` parameter and `businessStatus === 'RA'` Recall menu item push.
  - **Why Added:** Enables the **"Recall"** menu option in 3-dots action dropdown menus across all 14 trade in-progress summary views for Makers viewing submitted transactions.
- ⏮️ **Before:** Evaluates trade product and entitlement mappings.
- ⏭️ **After:** Includes the `'Recall'` option in the 3-dots dropdown menu when `businessStatus === 'RA'` and `isMakerUser === true`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Core Dropdown Menu Generator Helper).
- ⚠️ **Revert Impact:** YES! Reverting will hide the "Recall" option from 3-dots dropdown menus across all trade summary tables.

---

### 🔑 Lines 712–753: fieldValidation.ts (`isMakerEntitlementForRecord`)
```typescript
export function isMakerEntitlementForRecord(contextActionList: any[], recordCif: any, productType: string): boolean {
  ...
  const makerFunctionCodesByProduct: { [key: string]: string[] } = {
    'importLC': ['CLCISR', 'CLCAMR', 'DRAFTLC', 'CANLC'],
    'backToBack': ['B2BISSUE', 'B2BAMEND', 'B2BCANCEL'],
    ...
  };
  ...
  return contextActionList.some((item: any) =>
    makerFunctionCodes.includes(item?.function?.toUpperCase()) &&
    (!recordCif || item?.entitledCrtCif === recordCif)
  );
}
```
- 🎯 **What it does:** Utility function that cross-references user entitlement function codes (`contextActionList`) with the record's CIF number (`entitledCrtCif`) and product type to determine if the logged-in user has Maker privileges for that specific record.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Function was missing in `fieldValidation.ts` in K4.
  - **Why Added:** Called by `TradeDataTableComponent.getRecordEntitlements()` to compute `this.isMakerUser`. That flag directly controls visibility of the **Delete trash icon** in table cells AND determines if the **Recall option** appears in 3-dots action dropdown menus.
- ⏮️ **Before:** No per-record Maker entitlement check helper was available.
- ⏭️ **After:** Returns `true` if user is an entitled Maker for that product and CIF; otherwise `false`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO BOTH DELETE & RECALL (Core Entitlement Evaluator).
- ⚠️ **Revert Impact:** YES! Reverting or deleting this function will break `isMakerUser` evaluation, causing both the **Delete trash icon** and **Recall menu option** to disappear across all 14 trade in-progress summary tables.

---

### 💬 Lines 116 & 126: accept-reject.component.html (`Recall Reason Labels`)
```html
<!-- Line 116: Label -->
<label class="reject-reason" translate>
  {{acceptRejectActions?.actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'? ('APP_LABELS.LBL_RECALL_REASON' | translate) : ('APP_LABELS.LBL_RJCT_RSN' | translate)}}
</label>

<!-- Line 126: Validation Error -->
<small class="reject-reason-error" *ngIf="isSubmitted && rejectFormGroup.controls.rejectReasonField.errors?.required" translate>
  {{acceptRejectActions?.actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'? ('APP_LABELS.LBL_SELECT_DEFINED_RECALL_REASON' | translate):('APP_LABELS.LBL_SELECT_DEFINED_REJECT_REASON' | translate)}}
</small>
```
- 🎯 **What it does:** Dynamically renders the modal field label and validation error message inside the `<app-accept-reject>` right-side drawer component based on whether the action is a **Recall** (`actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'`) or a **Reject**.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** `<app-accept-reject>` modal only supported Reject/Approve operations, with hardcoded "Reject Reason *" text.
  - **Why Added:** Enables reusing `<app-accept-reject>` for **Recall** operations. When a Maker clicks "Recall" on a submitted transaction, this modal opens and prompts the user to enter a required Recall Reason.
- ⏮️ **Before:** Modal label statically rendered "Reject Reason *".
- ⏭️ **After:** Renders "Recall Reason *" and "Please enter a recall reason" validation message when `actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (UI Modal Template for Recall Reason Input).
- ⚠️ **Revert Impact:** YES! Reverting will cause the Recall modal drawer to display misleading "Reject Reason *" text and reject validation messages when recalling transactions.

---

### 🔘 Lines 142–147: accept-reject.component.html (`Confirm Button for Recall`)
```html
<div class="trade-text-align-center">
  <!-- Approve / Reject Confirm Button -->
  <button class="buttonPrimary" translate *ngIf="acceptRejectActions?.actionOnRecord !== 'APP_LABELS.LBL_RECALL_ENTITLE'"
          (click)="approveOrRejectPayment(acceptRejectActions.otherTitle ? acceptRejectActions.otherTitle : acceptRejectActions?.actionOnRecord)">
    APP_LABELS.LBL_CONFIRM_TEXT
  </button>
  
  <!-- Recall Confirm Button -->
  <button class="buttonPrimary" translate *ngIf="acceptRejectActions?.actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'" (click)="recallSubmitApi()">
    APP_LABELS.LBL_CONFIRM_TEXT
  </button>
</div>
```
- 🎯 **What it does:** Renders a dedicated "Confirm" button (`APP_LABELS.LBL_CONFIRM_TEXT`) when performing a Recall (`actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'`) that invokes **`recallSubmitApi()`** upon click.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Single Confirm button always called `approveOrRejectPayment()`.
  - **Why Added:** Routes the Recall modal form submission to `recallSubmitApi()`, which constructs the recall payload carrying `MODULE_ID: RECALLTXN` and the entered `rejectReasonField`.
- ⏮️ **Before:** Confirm button called `approveOrRejectPayment()`.
- ⏭️ **After:** Confirm button calls `recallSubmitApi()` when performing a Recall.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Core UI Event Trigger for Submitting Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break the Confirm button in the Recall drawer, preventing `recallSubmitApi()` from executing and leaving submitted transactions unable to be recalled.

---

### ⚙️ Lines 82 & 231–233: accept-reject.component.ts (`Recall Setup & Imports`)
```typescript
// Line 82: HTTP Imports
import { HttpBackend, HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

// Lines 231–233: routerCancelPath Initialization in ngOnInit()
if (this.acceptRejectActions?.actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE') {
  this.routerCancelPath = this.myTaskRowInfo.cancelRouterPath;
}
```
- 🎯 **What it does:**
  1. **Line 82:** Imports Angular HTTP modules required by `recallSubmitApi()` to construct HTTP request headers/payloads for the backend `'revokeOrDeleteTxn'` API.
  2. **Lines 231–233:** In `ngOnInit()`, checks if the action is a **Recall** (`actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'`). If so, sets `routerCancelPath` from `myTaskRowInfo.cancelRouterPath` so clicking "Cancel" in the drawer returns the user back to the trade summary page.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing HTTP imports and Recall router path setup in `AcceptRejectComponent`.
  - **Why Added:** Enables HTTP backend communication for transaction Recall, and ensures the Cancel button inside the Recall drawer navigates back to the originating trade summary screen.
- ⏮️ **Before:** Component had no HTTP helpers and Cancel button redirected to `/my-task`.
- ⏭️ **After:** HTTP helpers available for `recallSubmitApi()`, and Cancel button returns to trade summary route.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Header & Navigation Setup).
- ⚠️ **Revert Impact:** YES! Reverting will cause missing dependency compilation errors in `recallSubmitApi()` and cause the Recall drawer's Cancel button to navigate to the wrong route (`/my-task`).

---

### 🧹 Lines 1515–1517: accept-reject.component.ts (`cancel()` State Cleanup)
```typescript
public cancel() {
  this.commonService.selectedRowInfo = null;
  this.commonService.isMultiSelectEnable = false;
  if (this.acceptRejectActions?.actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE') {
    this.myTaskService.setActionInfoAndRowInfoData = null;
  }
}
```
- 🎯 **What it does:** Inside `cancel()` (executed when clicking "Cancel" in the side drawer), checks if the action was a **Recall** (`actionOnRecord === 'APP_LABELS.LBL_RECALL_ENTITLE'`) and resets `this.myTaskService.setActionInfoAndRowInfoData = null` to clean up shared service state.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** `cancel()` only cleared `commonService.selectedRowInfo` and `isMultiSelectEnable`.
  - **Why Added:** Prevents stale state leakage when a Maker closes or cancels the Recall modal drawer.
- ⏮️ **Before:** Cancelling a Recall drawer left `setActionInfoAndRowInfoData` populated in `MyTaskService`.
- ⏭️ **After:** Clears `setActionInfoAndRowInfoData` upon closing the Recall drawer.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (State Cleanup on Modal Cancellation).
- ⚠️ **Revert Impact:** YES! Reverting will leave stale transaction data in `MyTaskService` when cancelling a Recall action.

---

### 🔄 Lines 1700–1754: accept-reject.component.ts (`recallSubmitApi`)
```typescript
public recallSubmitApi() {
  this.isSubmitted = true;
  if (this.rejectFormGroup.valid) {
    this.isLoadingComplete = false;
    let reqData = {
      "MODULE_ID": "TRXRECALL",
      "INPUT_REFERENCE_NO": this.acceptRejectActions?.referenceNumber ? this.acceptRejectActions?.referenceNumber : '',
      "recallComment": this.rejectFormGroup.controls.rejectReasonField.value ? this.rejectFormGroup.controls.rejectReasonField.value : '',
      "userNo": this.rootScopeData.userInfo?.userNo,
      "gcif": this.rootScopeData.userInfo?.sCustNo
    };
    this.myTaskService.revokeTransaction(reqData).subscribe((res: any) => {
      this.isLoadingComplete = true;
      let singleMultiRecordCndCheck = {
        fieldDetails: [
          {
            dispKey: 'APP_LABELS.LBL_CHANNEL_REF_NO',
            dataKey: this.acceptRejectActions?.referenceNumber,
          },
        ],
      };
      if (res?.DATA?.INPUT_TXN_STATUS === 'SUCCESS') {
        this.receiptData = {
          msg1: 'APP_LABELS.LBL_SUCCESS',
          msg2: 'APP_LABELS.LBL_RECALL_SUCCESS_MSG',
          isSuccess: true,
          receiptDetails: [singleMultiRecordCndCheck],
          finishButton: {
            buttonLabel: 'APP_LABELS.LBL_GO_TO_INQUIRY_SUMMARY',
            buttonPath: this.myTaskService.getActionInfoAndRowInfoData?.cancelRouterPath,
          },
        };
        this.isShowSuccessPopup = true;
      } else {
        ...
      }
    });
  }
}
```
- 🎯 **What it does:** Core component method executed when a user clicks "Confirm" in the Recall side drawer. Validates the recall reason, packages payload with `MODULE_ID: "TRXRECALL"`, calls `MyTaskService.revokeTransaction()`, and presents the Recall Success receipt popup with a button redirecting back to the trade summary page.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Method was missing in `AcceptRejectComponent` in K4.
  - **Why Added:** Primary component handler for processing transaction Recall requests submitted by Makers.
- ⏮️ **Before:** `AcceptRejectComponent` could only process Approve/Reject payment actions.
- ⏭️ **After:** Sends `TRXRECALL` payload via `revokeTransaction()`, shows `LBL_RECALL_SUCCESS_MSG`, and redirects user to `cancelRouterPath`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Core Component Method for Recall Submission).
- ⚠️ **Revert Impact:** YES! Reverting or deleting this method will completely break transaction Recall from the UI drawer.

---

### 🛣️ trade-routing.module.ts & trade.module.ts (`DeleteSuccessPageComponent Routing`)
```typescript
// trade-routing.module.ts:
import { DeleteSuccessPageComponent } from '../common-components/delete-success-page/delete-success-page.component';
{ path: 'delete/success-page', component: DeleteSuccessPageComponent }

// trade.module.ts:
import { DeleteSuccessPageComponent } from '../common-components/delete-success-page/delete-success-page.component';
@NgModule({
  declarations: [
    DeleteSuccessPageComponent
  ]
})
```
- 🎯 **What it does:** Declares `DeleteSuccessPageComponent` in `TradeModule` and registers its Angular route `{ path: 'delete/success-page', component: DeleteSuccessPageComponent }`.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Route `'delete/success-page'` and `DeleteSuccessPageComponent` declaration were missing in K4.
  - **Why Added:** Required so `TradeDataTableComponent.deleteInProgressRecord()` can navigate users to `['/trade/delete/success-page']` upon successful in-progress transaction deletion.
- ⏮️ **Before:** Navigating to `/trade/delete/success-page` threw an unhandled Angular routing error.
- ⏭️ **After:** Renders the transaction deletion success receipt screen upon deleting an in-progress row.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO DELETE (Module Route & Component Registration for Delete Receipt Page).
- ⚠️ **Revert Impact:** YES! Reverting will break in-progress transaction deletion redirect, throwing `Error: Cannot match any routes. URL Segment: 'trade/delete/success-page'`.

---

### 🔄 Lines 17–18, 56 & 235–248: back-to-back-progress.component.ts (`Recall Navigation`)
```typescript
// Lines 17–18: Imports
import { MyTaskService } from 'src/app/dtbm/cloudDashboard/service/my-task/my-task.service';
import { getRouterUrl } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';

// Line 56: Constructor Injection
private myTaskService: MyTaskService

// Lines 235–248: recallNavigate() Method
public recallNavigate(event: any) {
  this.myTaskService.setActionInfoAndRowInfoData = {
    title: 'APP_LABELS.LBL_BACK_TO_BACK_LC',
    subtitle: 'APP_LABELS.LBL_RECALL_ENTITLE',
    rowInfo: event?.element,
    makerEntitled: event?.element.makerEntitled,
    referenceNumber: event?.element.externalRefNo,
    cancelRouterPath: getRouterUrl('b2bLc-progress'),
    AVPList: [],
    seniorManager: [],
    isRightSidePannelEnable: true,
  };
  this.router.navigate(['my-task/accept-reject']);
}
```
- 🎯 **What it does:** Imports `MyTaskService` and `getRouterUrl`, injects `myTaskService`, and uses `recallNavigate()` to launch the Recall modal drawer whenever a Maker selects "Recall" from a Back-to-Back LC row's 3-dots action menu.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Imports and `myTaskService` injection were missing in `BackToBackProgressComponent`.
  - **Why Added:** Powers the Recall flow for Back-to-Back LC in-progress transactions, populating `setActionInfoAndRowInfoData` and navigating to `my-task/accept-reject`.
- ⏮️ **Before:** Back-to-Back LC in-progress table could not perform transaction Recall.
- ⏭️ **After:** Clicking "Recall" in 3-dots dropdown menu opens the Recall side drawer.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Navigation Setup for Back-to-Back LC Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break Back-to-Back LC transaction Recall, throwing compilation and runtime errors when selecting "Recall".

---

### 🔄 Lines 28, 402–404 & 407–424: import-bills/in-progress.component.ts (`Recall Navigation`)
```typescript
// Line 28: Import
import { getRouterUrl } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';

// Lines 402–404: Action Interceptor
if(actionType?.$event === 'Recall') {
  this.recallNavigate(actionType);
} else { ... }

// Lines 407–424: recallNavigate() Method
public recallNavigate(event: any) {
  this.myTaskService.setActionInfoAndRowInfoData = {
    title: 'APP_LABELS.LBL_IMPORT_LC_BILLS',
    subtitle: 'APP_LABELS.LBL_RECALL_ENTITLE',
    rowInfo: event?.element,
    statusCode: event?.element.businessStatusdescription,
    makerEntitled: event?.element.makerEntitled,
    referenceNumber: event?.element.externalRefNo,
    redirectFrom: 'my-task',
    cancelRouterPath: getRouterUrl('import-bills-progress'),
    AVPList: [],
    seniorManager: [],
    isRightSidePannelEnable: true,
  }
  this.route.navigate(['my-task/accept-reject']);
}
```
- 🎯 **What it does:** Imports `getRouterUrl`, intercepts "Recall" selections from the 3-dots dropdown menu, and executes `recallNavigate()` to launch the Recall side drawer for Import Bills.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing Recall handler and `recallNavigate()` method in Import Bills `InProgressComponent`.
  - **Why Added:** Enables Makers to recall submitted Import Bills from the in-progress summary view.
- ⏮️ **Before:** "Recall" menu selection was ignored on Import Bills.
- ⏭️ **After:** Opens the Recall side drawer with `cancelRouterPath: getRouterUrl('import-bills-progress')`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Setup for Launching Import Bills Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break Import Bills transaction Recall execution.

---

### 🔄 Lines 28–29, 65, 229–231 & 234–251: transfer-bills-in-progress.component.ts (`Recall Navigation`)
```typescript
// Lines 28–29: Imports
import { MyTaskService } from 'src/app/dtbm/cloudDashboard/service/my-task/my-task.service';
import { getRouterUrl } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';

// Line 65: Constructor Injection
private myTaskService: MyTaskService

// Lines 229–231: Action Interceptor
if(actionType?.$event === 'Recall') {
  this.recallNavigate(actionType);
} else { ... }

// Lines 234–251: recallNavigate() Method
public recallNavigate(event: any) {
  this.myTaskService.setActionInfoAndRowInfoData = {
    title: 'APP_LABELS.LBL_TRANSFER_BILLS',
    subtitle: 'APP_LABELS.LBL_RECALL_ENTITLE',
    rowInfo: event?.element,
    statusCode: event?.element.businessStatusdescription,
    makerEntitled: event?.element.makerEntitled,
    referenceNumber: event?.element.externalRefNo,
    redirectFrom: 'my-task',
    cancelRouterPath: getRouterUrl('transfer-bills-progress'),
    AVPList: [],
    seniorManager: [],
    isRightSidePannelEnable: true,
  }
  this.route.navigate(['my-task/accept-reject']);
}
```
- 🎯 **What it does:** Imports `MyTaskService` and `getRouterUrl`, injects `myTaskService`, intercepts "Recall" menu selections, and executes `recallNavigate()` to launch the Recall side drawer for Transfer Bills.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing `MyTaskService` injection, `getRouterUrl` import, and `recallNavigate()` method in Transfer Bills `TransferBillsInProgressComponent`.
  - **Why Added:** Enables Makers to recall submitted Transfer Bills from the in-progress summary view.
- ⏮️ **Before:** "Recall" menu selection was ignored on Transfer Bills.
- ⏭️ **After:** Opens the Recall side drawer with `cancelRouterPath: getRouterUrl('transfer-bills-progress')`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Setup for Launching Transfer Bills Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break Transfer Bills transaction Recall execution.

---

### 🔄 Lines 14–15, 52–61, 180–182 & 185–199: export-bill-progress.component.ts (`Recall Navigation`)
```typescript
// Lines 14–15: Imports
import { MyTaskService } from 'src/app/dtbm/cloudDashboard/service/my-task/my-task.service';
import { getRouterUrl } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';

// Lines 52–61: Constructor Injection
private myTaskService: MyTaskService

// Lines 180–182: Action Interceptor
if(res?.$event === 'Recall') {
  this.recallNavigate(res);
} else { ... }

// Lines 185–199: recallNavigate() Method
public recallNavigate(actionInfo: any) {
  this.myTaskService.setActionInfoAndRowInfoData = {
    title: 'APP_LABELS.LBL_EXPORT_LC_BILLS',
    subtitle: 'APP_LABELS.LBL_RECALL_ENTITLE',
    rowInfo: actionInfo?.element ? actionInfo?.element : actionInfo,
    cancelRouterPath: getRouterUrl('export-bills-progress'),
    AVPList: [],
    seniorManager: [],
    isRightSidePannelEnable: true,
    referenceNumber: actionInfo?.element?.externalRefNo ? actionInfo?.element?.externalRefNo : actionInfo?.externalRefNo
  }
  this.router.navigate(['my-task/accept-reject']);
}
```
- 🎯 **What it does:** Imports `MyTaskService` and `getRouterUrl`, injects `myTaskService`, intercepts "Recall" menu selections, and executes `recallNavigate()` to launch the Recall side drawer for Export Bills.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing `MyTaskService` injection, `getRouterUrl` import, and `recallNavigate()` method in Export Bills `ExportBillProgressComponent`.
  - **Why Added:** Enables Makers to recall submitted Export Bills from the in-progress summary view.
- ⏮️ **Before:** "Recall" menu selection was ignored on Export Bills.
- ⏭️ **After:** Opens the Recall side drawer with `cancelRouterPath: getRouterUrl('export-bills-progress')`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Setup for Launching Export Bills Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break Export Bills transaction Recall execution.

---

### 🔄 Lines 25–26, 59, 172–174 & 177–191: export-collection-inprogress.component.ts (`Recall Navigation`)
```typescript
// Lines 25–26: Imports
import { MyTaskService } from 'src/app/dtbm/cloudDashboard/service/my-task/my-task.service';
import { getRouterUrl } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';

// Line 59: Constructor Injection
private myTaskService: MyTaskService

// Lines 172–174: Action Interceptor
if(res?.$event === 'Recall') {
  this.recallNavigate(res);
} else { ... }

// Lines 177–191: recallNavigate() Method
public recallNavigate(actionInfo: any) {
  this.myTaskService.setActionInfoAndRowInfoData = {
    title: 'APP_LABELS.LBL_EXPORT_COLLECTION_BILLS',
    subtitle: 'APP_LABELS.LBL_RECALL_ENTITLE',
    rowInfo: actionInfo?.element,
    cancelRouterPath: getRouterUrl('export-collections-progress'),
    AVPList: [],
    seniorManager: [],
    isRightSidePannelEnable: true,
    referenceNumber: actionInfo?.element.externalRefNo
  }
  this.router.navigate(['my-task/accept-reject']);
}
```
- 🎯 **What it does:** Imports `MyTaskService` and `getRouterUrl`, injects `myTaskService`, intercepts "Recall" menu selections, and executes `recallNavigate()` to launch the Recall side drawer for Export Collections.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing `MyTaskService` injection, `getRouterUrl` import, and `recallNavigate()` method in Export Collection `ExportCollectionInprogressComponent`.
  - **Why Added:** Enables Makers to recall submitted Export Collections from the in-progress summary view.
- ⏮️ **Before:** "Recall" menu selection was ignored on Export Collections.
- ⏭️ **After:** Opens the Recall side drawer with `cancelRouterPath: getRouterUrl('export-collections-progress')`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Setup for Launching Export Collection Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break Export Collection transaction Recall execution.

---

### 🔄 Lines 28–29, 67, 138–140 & 150–168: export-finance-progress.component.ts (`Recall Navigation`)
```typescript
// Lines 28–29: Imports
import { MyTaskService } from 'src/app/dtbm/cloudDashboard/service/my-task/my-task.service';
import { getRouterUrl } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';

// Line 67: Constructor Injection
private myTaskService: MyTaskService

// Lines 138–140: Action Interceptor
if(res?.$event === 'Recall') {
  this.recallNavigate(res);
} else { ... }

// Lines 150–168: recallNavigate() Method
public recallNavigate(actionInfo: any) {
  let type = actionInfo?.element?.typeOfLoan;
  this.myTaskService.setActionInfoAndRowInfoData = {
    title: type === 'Export Pre-shipment' ? 'APP_LABELS.LBL_EXPORT_BILL_PRE_SHIPMENT' : type === 'Pre-shipment Finance-i' ? 'Pre-shipment Finance-i' :
      type === 'Export Negotiation' ? 'APP_LABELS.LBL_FINANCE_EXPORT_NEGOTIATION' : type === 'Bill of Exchange Purchase-i Authority to Purchase' ? 'Bill of Exchange Purchase-i Authority to Purchase' :
        'APP_LABELS.LBL_EXPORT_FINANCE_TRADE',
    subtitle: 'APP_LABELS.LBL_RECALL_ENTITLE',
    rowInfo: actionInfo?.element,
    cancelRouterPath: getRouterUrl('export-finance-progress'),
    AVPList: [],
    seniorManager: [],
    isRightSidePannelEnable: true,
    referenceNumber: actionInfo?.element.externalRefNo,
    statusCode: actionInfo?.element?.transactionStatus
  }
  this.router.navigate(['my-task/accept-reject']);
}
```
- 🎯 **What it does:** Imports `MyTaskService` and `getRouterUrl`, injects `myTaskService`, intercepts "Recall" menu selections, dynamically computes title from `typeOfLoan`, and executes `recallNavigate()` to launch the Recall side drawer for Export Finance.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing `MyTaskService` injection, `getRouterUrl` import, and `recallNavigate()` method in Export Finance `ExportFinanceProgressComponent`.
  - **Why Added:** Enables Makers to recall submitted Export Finance transactions from the in-progress summary view.
- ⏮️ **Before:** "Recall" menu selection was ignored on Export Finance.
- ⏭️ **After:** Opens the Recall side drawer with `cancelRouterPath: getRouterUrl('export-finance-progress')`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Setup for Launching Export Finance Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break Export Finance transaction Recall execution.

---

### 🔄 Lines 20–21, 62, 167–170 & 173–188: export-lc-in-progress.component.ts (`Recall Navigation`)
```typescript
// Lines 20–21: Imports
import { MyTaskService } from 'src/app/dtbm/cloudDashboard/service/my-task/my-task.service';
import { getRouterUrl } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';

// Line 62: Constructor Injection
private myTaskService: MyTaskService

// Lines 167–170: Action Interceptor
public selectedActionMenu(actionType: any): void {
  if (actionType?.$event === 'Recall') {
    this.recallNavigate(actionType);
  } else { ... }

// Lines 173–188: recallNavigate() Method
public recallNavigate(event: any) {
  this.myTaskService.setActionInfoAndRowInfoData = {
    title: 'APP_LABELS.LBL_EXPORT_LC',
    subtitle: 'APP_LABELS.LBL_RECALL_ENTITLE',
    rowInfo: event?.element,
    makerEntitled: event?.element.makerEntitled,
    referenceNumber: event?.element.externalRefNo,
    cancelRouterPath: getRouterUrl('export-lc-progress'),
    AVPList: [],
    seniorManager: [],
    isRightSidePannelEnable: true,
  };
  this.router.navigate(['my-task/accept-reject']);
}
```
- 🎯 **What it does:** Imports `MyTaskService` and `getRouterUrl`, injects `myTaskService`, intercepts "Recall" menu selections, and executes `recallNavigate()` to launch the Recall side drawer for Export LC.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing `MyTaskService` injection, `getRouterUrl` import, and `recallNavigate()` method in Export LC `ExportLcInProgressComponent`.
  - **Why Added:** Enables Makers to recall submitted Export LCs from the in-progress summary view.
- ⏮️ **Before:** "Recall" menu selection was ignored on Export LC.
- ⏭️ **After:** Opens the Recall side drawer with `cancelRouterPath: getRouterUrl('export-lc-progress')`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component Setup for Launching Export LC Recall).
- ⚠️ **Revert Impact:** YES! Reverting will break Export LC transaction Recall execution.

---

### 🗑️ REVERTED: outward-guarantee.component.ts & ilc-issuance.component.ts
- 🎯 **Status:** **REVERTED TO BASELINE.**
- 💡 **Reason:** Audited and confirmed to be 100% unrelated to Delete or Recall functionality (Trade AI / Issuance Form wizard logic). Reverted to keep workspace changes strictly minimal and focused only on Delete & Recall features.

---

### ⚙️ trade-more-action.component.html (`Row Action Icons & 3-Dots Dropdown Overlay`)
```html
<div class="display-flex-more-action">
    ...
    <div class="delete-icon"
        *ngIf="(menuAactionValues.includes('cancel') && (productInfo.product === 'beneficiary') && ...) || (productInfo.product === 'saveAs')"
        (click)="delete.emit('')"></div>
    <div class="more-icon-container">
        <div class="{{iconName}}" (click)="showMenuList($event)" cdkOverlayOrigin #trigger="cdkOverlayOrigin">
            ...
        </div>
        <ng-template cdkConnectedOverlay ...>
            <div class="moreAction-popup">
                <ul>
                    <ng-container *ngFor="let dropValue of moreActionList">
                        <li (click)="menuClick(dropValue)" translate>
                            {{dropValue.displayName}}
                        </li>
                    </ng-container>
                </ul>
            </div>
        </ng-template>
    </div>
</div>
```
- 🎯 **What it does:** Component template rendering table row action icons (Edit, Pay, Accept, Reject, View, Delete) and the 3-dots "More Actions" dropdown overlay container.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Line 1 contained restrictive `*ngIf` blocking action icons on certain discrepant bills, and 3-dots list lacked flexible `<ng-container>` rendering.
  - **Why Modified:** Ensures action icons and 3-dots dropdown menu items (including **"Recall"** generated by `contextaction.ts` and **"Delete"** for `saveAs` records) render reliably across all product modules.
- ⏮️ **Before:** Action menu container had hardcoded status filters blocking options on specific bill statuses.
- ⏭️ **After:** Container and dropdown overlay display all applicable actions (Pay, Accept, Reject, View, Recall, Delete).
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO DELETE & RECALL (Action Menu UI Rendering for Recall & SaveAs Draft Delete).
- ⚠️ **Revert Impact:** YES! Reverting will break the 3-dots action menu overlay structure and disable draft deletion on `saveAs` views.

---

### 🗑️ Lines 67–72: trade-more-action.component.html (`SaveAs & Maintenance Delete Icon`)
```html
<div class="delete-icon"
    *ngIf="(menuAactionValues.includes('cancel') && (productInfo.product === 'beneficiary') && (currentRecord.businessStatus === 'Active' && !sameBeneHasReadyForAuthRecord))  || 
    (menuAactionValues.includes('cancel') && (productInfo.product === 'bank') && (currentRecord.businessStatus === 'Active' && !sameBeneHasReadyForAuthRecord))  || 
    (menuAactionValues.includes('cancel') && (productInfo.product === 'clause') && (currentRecord?.maintncetype !== 'BANK') && (currentRecord.businessStatus === 'Active' && !sameBeneHasReadyForAuthRecord)) ||
    (productInfo.product === 'saveAs')"
    (click)="delete.emit('')">
</div>
```
- 🎯 **What it does:** Renders the Trash/Delete icon for table rows when viewing draft/SaveAs records (`productInfo.product === 'saveAs'`) or active corporate maintenance items (Beneficiary/Bank/Clause). Clicking it emits `delete.emit('')`.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Evaluated legacy status fields (`status !== 'M' && status !== 'D'`).
  - **Why Modified:** Explicitly enables draft deletion for `productInfo.product === 'saveAs'` records and aligns maintenance record checks with `businessStatus === 'Active' && !sameBeneHasReadyForAuthRecord`.
- ⏮️ **Before:** Checked legacy status codes `M` and `D`.
- ⏭️ **After:** Enables trash icon for SaveAs draft deletion and active maintenance records.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO DELETE (Draft Row Deletion Trigger).
- ⚠️ **Revert Impact:** YES! Reverting `productInfo.product === 'saveAs'` will break the Delete icon on SaveAs draft summary tables.

---

### ⚙️ Lines 3–4: trade-more-action.component.ts (`Header Imports for Recall Entitlements`)
```typescript
import { contextMenu, actionMenuForProduct, allActionMenuForProduct } from 'src/app/dtbm/cloudDashboard/utility/contextaction';
import { isMakerEntitlementForRecord } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';
```
- 🎯 **What it does:** Imports `actionMenuForProduct` (3-dots action menu builder) and `isMakerEntitlementForRecord` (Maker role entitlement evaluator) into `TradeMoreActionComponent`.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Imported `SharedTradeService` and basic `contextaction` helpers, lacking `isMakerEntitlementForRecord`.
  - **Why Modified:** `ngOnInit()` requires `isMakerEntitlementForRecord` to evaluate whether the logged-in user is a Maker for the current row (`isMakerUser = isMakerEntitlementForRecord(...)`) and pass `isMakerUser` into `actionMenuForProduct()`.
- ⏮️ **Before:** Header lacked entitlement helpers required for Recall menu generation.
- ⏭️ **After:** Imports available for generating the 3-dots Recall action menu item.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Header Imports for Recall Entitlement Evaluation).
- ⚠️ **Revert Impact:** YES! Reverting `isMakerEntitlementForRecord` will cause compilation errors in `ngOnInit()`.

---

### ⚙️ Lines 21, 23, 32, 34, 41–42, 44: trade-more-action.component.ts (`Inputs, Outputs & Constructor`)
```typescript
@Input() moduleType: any;
@Input() summaryRecords: any[] = [];
@Output() entitledUser = new EventEmitter();
@Input() isPendingRecord: boolean = false;
public isMakerUser: boolean = true;
public disableActionFlag: boolean = false;
constructor(public commonService: CommonServiceService) { ... }
```
- 🎯 **What it does:** Defines Component Input/Output property bindings (`moduleType`, `summaryRecords`, `isPendingRecord`, `entitledUser`), declares state variables (`isMakerUser`, `disableActionFlag`), and injects `CommonServiceService`.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Missing `moduleType`, `summaryRecords`, `entitledUser`, `isPendingRecord`, and `isMakerUser`. Injected `SharedTradeService`.
  - **Why Modified:** Connects `TradeMoreActionComponent` to `TradeDataTableComponent` to pass pending status (`isPendingRecord`) and summary metadata, allowing `ngOnInit()` to compute `isMakerUser` and render the **"Recall"** 3-dots dropdown menu item.
- ⏮️ **Before:** Component lacked I/O bindings and Maker state variable needed for Recall.
- ⏭️ **After:** Property bindings enable dynamic Maker entitlement checks and Recall menu generation.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component I/O Contract & Maker Entitlement State).
- ⚠️ **Revert Impact:** YES! Reverting will break Angular template bindings in `trade-data-table.component.html` (`[isPendingRecord]="..."`), causing compilation and runtime errors.

---

### ⚙️ Lines 53–65: trade-more-action.component.ts (`ngOnInit()` Maker Entitlement Evaluation)
```typescript
if (this.productInfo.product && (this.cifNumber || this.productInfo.product === 'saveAs') && this.contextRecordInfo) {
  this.isMakerUser = isMakerEntitlementForRecord(
    this.contextRecordInfo,
    this.cifNumber,
    this.productInfo.product
  );
}
if (this.productInfo.product === 'standalone-tr' || this.productInfo.product === 'invoice-discounting') {
  this.entitledUser.emit(true);
} else {
  this.entitledUser.emit(this.isMakerUser);
}
```
- 🎯 **What it does:** Evaluates if the logged-in user is a Maker for the current row using `isMakerEntitlementForRecord()`, assigns the boolean result to `this.isMakerUser`, and emits `this.entitledUser.emit(this.isMakerUser)` to the parent table.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** `ngOnInit()` did not calculate `isMakerUser` or call `isMakerEntitlementForRecord()`.
  - **Why Added:** Required so `contextMenuList()` can pass `isMakerUser` into `actionMenuForProduct()`. If the user is a Maker (`isMakerUser = true`) and the row status is `RA`, the 3-dots dropdown menu displays **"Recall"**.
- ⏮️ **Before:** `isMakerUser` was un-evaluated in `ngOnInit()`.
- ⏭️ **After:** Evaluates `isMakerUser` on init and emits `entitledUser`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Core Component Initializer for Maker Recall Entitlement).
- ⚠️ **Revert Impact:** YES! Reverting will prevent `isMakerUser` from being evaluated, hiding the Recall action menu option on all summary tables.

---

### ⚙️ Lines 66–77: trade-more-action.component.ts (`ngOnInit()` Routing to `contextMenuList()`)
```typescript
if (this.notEntitled) {
  this.moreActionList = this.contextRecordInfo;
} else {
  if (this.productInfo?.subProduct === 'OBGCLAIM') {
    this.moreActionList = [
      { displayName: 'APP_LABELS.LBL_VIEW_DETAIL', value: 'View Details' },
    ];
  } else {
    this.contextactionList = this.contextRecordInfo;
    this.contextMenuList();
  }
}
```
- 🎯 **What it does:** Routes all standard Trade Services summary table records to `contextMenuList()` to construct the 3-dots action menu list.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Included extra inline branches for OBG Claim payment extensions.
  - **Why Modified:** Ensures all standard Trade Services records execute `contextMenuList()`, which passes `isMakerUser` into `actionMenuForProduct()` to render the **"Recall"** menu option.
- ⏮️ **Before:** Evaluated extra inline OBG Claim sub-product conditions.
- ⏭️ **After:** Directs standard summary table records to `contextMenuList()`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Routes Summary Table Records to `contextMenuList()` to Build 'Recall').
- ⚠️ **Revert Impact:** YES! Bypassing `contextMenuList()` would prevent the 3-dots dropdown menu from populating the **"Recall"** item.

---

### ⚙️ Lines 79–100: trade-more-action.component.ts (`contextMenuList()` Entitlement Checks)
```typescript
contextMenuList() {
  let contextMenuAction: Array<any> = contextMenu(this.cifNumber, this.contextactionList, this.productInfo);

  if (contextMenuAction.length > 0) {
    contextMenuAction.forEach((actions: any) => {
      this.contextMenuFunction.push(actions.function);
    });
  }
  this.billAndCollectionActions = [];
  if (this.contextMenuFunction.includes('CRSETBIL') || this.contextMenuFunction.includes('CRSETCOL') || this.contextMenuFunction.includes('TBSETBIL') || this.contextMenuFunction.includes('FRREPAY')) {
    this.billAndCollectionActions.push('pay');
  }
  if (this.contextMenuFunction.includes('TBACCBIL')) {
    this.billAndCollectionActions.push('accept');
  }
  if (this.contextMenuFunction.includes('TBREJECT')) {
    this.billAndCollectionActions.push('reject');
  }
```
- 🎯 **What it does:** Calls `contextMenu()` to retrieve permitted backend entitlement functions, then populates `billAndCollectionActions` array with `'pay'`, `'accept'`, and `'reject'`.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Grouped `accept` and `reject` under `BILLACTRJT` / `COLACTRJT`.
  - **Why Modified:** Separated entitlement checks so `accept` maps to `TBACCBIL` and `reject` maps to `TBREJECT`.
- ⏮️ **Before:** Grouped accept and reject under legacy function codes.
- ⏭️ **After:** Maps individual action strings (`'pay'`, `'accept'`, `'reject'`) to specific entitlement function codes.
- 🔗 **Delete / Recall Relation:** INDIRECT / UNRELATED TO DELETE OR RECALL (Bills Settlement Inline Action Entitlements).
- ⚠️ **Revert Impact:** NO IMPACT ON DELETE OR RECALL. Reverted back to K4 baseline (`BILLACTRJT` / `COLACTRJT`).

---

### 🌐 rest-api.service.ts (Resubmission Automagic Status Conversion)
```typescript
if (isRecalledOrResubmitted && oldRefNo) {
  let revokeReqData = {
    "MODULE_ID": "DELETETXN",
    "INPUT_REFERENCE_NO": oldRefNo,
    "userNo": RootScopeData.userInfo?.userNo,
    "gcif": RootScopeData.userInfo?.sCustNo,
    "isIslamicTxn": this.rootScopeData.tradeIslamic ? 'Y' : 'N'
  };
  const targetUrl = environment.tradeServletAPI ? environment.traderestAPI : `${environment.mockRestApi}/revokeOrDeleteTxn`;
  this.http.post<any>(targetUrl, revokeReqData, { headers: this.httpOptionsJSON }).subscribe(() => {
    if (this.sharedTrade) {
      this.sharedTrade.isResubmission = false;
      this.sharedTrade.rowInfo = null;
    }
  });
}
```
- 🎯 **What it does:** Automatically soft-deletes the old recalled transaction in the database by sending a flat `DELETETXN` payload to `/revokeOrDeleteTxn`.
- 🔄 **Why We Added It:** The K4 java backend handler (`revokeOrDeleteTransaction`) processes requests by extracting flat root-level keys (`MODULE_ID`, `INPUT_REFERENCE_NO`) directly from the request parameter body. A nested payload causes values to evaluate as null. Sending a flat object ensures status updates to `Deleted` execute successfully.
- 🔗 **Delete / Recall Relation:** DIRECT. Ensure the old recalled transaction is converted to `Deleted` status when resubmitted.

---


### 📋 Lines 98–99: trade-more-action.component.ts (`actionMenuForProduct()` with `isMakerUser`)
```typescript
this.moreActionList = actionMenuForProduct(
  contextMenuAction,
  this.productInfo,
  this.businessStatus,
  this.currentRecord,
  this.sblcStatus,
  this.isMakerUser
);
let allactionMenu = allActionMenuForProduct(contextMenuAction, this.productInfo, this.businessStatus);
```
- 🎯 **What it does:** Calls `actionMenuForProduct()` with `this.isMakerUser` as the 6th argument to construct the 3-dots action menu items array (`moreActionList`).
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Signature passed `currentRecord?.transferLc`, `sblcStatus`, `currentRecord?.confirmed`, `currentRecord`.
  - **Why Modified:** Aligns with updated `contextaction.ts` signature which takes `isMakerUser?: boolean`. When `businessStatus === 'RA'` and `isMakerUser === true`, `actionMenuForProduct()` pushes `{ displayName: 'APP_LABELS.LBL_RECALL', value: 'Recall' }` into `moreActionList`.
- ⏮️ **Before:** `actionMenuForProduct()` lacked `isMakerUser` parameter, failing to render "Recall".
- ⏭️ **After:** Injects **"Recall"** into the 3-dots dropdown menu when a Maker views a transaction pending authorization (`RA`).
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Core Function Call Populating 'Recall' Menu Item).
- ⚠️ **Revert Impact:** YES! Reverting will prevent `isMakerUser` from being passed, hiding the **"Recall"** menu item on all summary tables.

---

### ⚙️ Line 104: trade-more-action.component.ts (`menuAactionValues.push(element.value)`)
```typescript
this.menuAactionValues = [];
if (allactionMenu.length > 0) {
  allactionMenu.forEach((element: any) => {
    this.menuAactionValues.push(element.value);
  });
}
```
- 🎯 **What it does:** Populates `menuAactionValues` array with action value strings from `allActionMenuForProduct()`.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Used `element.value.toLowerCase()`.
  - **Why Modified:** Retains exact string values returned by `allActionMenuForProduct()` in `contextaction.ts`.
- ⏮️ **Before:** Pushed lowercased action strings.
- ⏭️ **After:** Pushes exact action strings.
- 🔗 **Delete / Recall Relation:** INDIRECT / UNRELATED TO DELETE OR RECALL (Used by Inline Template Checks).
- ⚠️ **Revert Impact:** NO IMPACT ON DELETE OR RECALL.

---

### ⚙️ Lines 110–122: trade-more-action.component.ts (`showMenuList` & `menuClick`)
```typescript
showMenuList(event: any) {
  event?.stopPropagation();
  this.isOpen = !this.isOpen;
}

menuClick(clickedMenu: any) {
  this.onMenuClick.emit(clickedMenu.value);
  this.isOpen = false;
}
```
- 🎯 **What it does:** Standard event handlers for the 3-dots action menu overlay:
  - `showMenuList()`: Toggles overlay visibility (`isOpen`) and stops event propagation.
  - `menuClick()`: Emits selected menu item string (`'Recall'`, `'Copy LC'`, `'View Details'`) to `TradeDataTableComponent` via `onMenuClick.emit()`.
- 🔄 **Why We Modified It (Old vs New Code):** Standard event handler setup for the overlay menu.
- ⏮️ **Before:** Handled menu overlay toggle and item click emit.
- ⏭️ **After:** Emits `onMenuClick` event with selected action name.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Fires the 'Recall' menu click event to `TradeDataTableComponent`).
- ⚠️ **Revert Impact:** YES! Reverting will break opening the 3-dots dropdown menu and emitting the 'Recall' selection.

---










### 📋 Lines 83–87: trade-more-action.component.html (`3-Dots Dropdown Overlay Menu List`)
```html
<ng-container *ngFor="let dropValue of moreActionList">
    <li (click)="menuClick(dropValue)" translate>
        {{dropValue.displayName}}
    </li>
</ng-container>
```
- 🎯 **What it does:** Iterates through `moreActionList` using `<ng-container>` to render each item (including **"Recall"**, **"Copy LC"**, **"View Details"**) in the 3-dots action menu overlay popup.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** `<li *ngFor="let dropValue of moreActionList" ...>` placed `*ngFor` directly on the `<li>` element.
  - **Why Modified:** Separates structural iteration into `<ng-container>`, allowing clean DOM rendering for dynamically generated menu items like **"Recall"** from `contextaction.ts`.
- ⏮️ **Before:** Structural directive `*ngFor` placed directly on `<li>`.
- ⏭️ **After:** Structural directive `*ngFor` placed on `<ng-container>` wrapping `<li>`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Renders the 'Recall' dropdown option).
- ⚠️ **Revert Impact:** NO FUNCTIONAL BREAK (Structural cleanliness & Angular best practice).

---

### ⚙️ Lines 3–6: trade-more-action.component.ts (`Header Imports for Recall & Entitlements`)
```typescript
import { TransferLcService } from 'src/app/dtbm/cloudDashboard/service/trade/transfer-lc/transfer-lc.service';
import { contextMenu, actionMenuForProduct, allActionMenuForProduct } from 'src/app/dtbm/cloudDashboard/utility/contextaction';
import { isMakerEntitlementForRecord } from 'src/app/dtbm/cloudDashboard/utility/fieldValidation';
import { ddMMyyyyStringToDateObject } from 'src/app/dtbm/cloudDashboard/utility/tableFilter';
```
- 🎯 **What it does:** Imports `actionMenuForProduct` (action menu builder), `isMakerEntitlementForRecord` (Maker entitlement check), and `TransferLcService` into `TradeMoreActionComponent`.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Missing `isMakerEntitlementForRecord` and `TransferLcService` imports.
  - **Why Modified:** Required by `showMenuList()` to evaluate if the logged-in user is a Maker entitled to recall the selected row (`isMakerUser = isMakerEntitlementForRecord(...)`) and pass `isMakerUser` into `actionMenuForProduct()`.
- ⏮️ **Before:** Header lacked entitlement helpers for Recall menu generation.
- ⏭️ **After:** Imports available for generating the 3-dots Recall action menu item.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Header Imports for Recall Entitlement Evaluation).
- ⚠️ **Revert Impact:** YES! Reverting will cause compilation errors in `showMenuList()`.

---

### ⚙️ Lines 23, 25, 34 & 36: trade-more-action.component.ts (`Recall & Entitlement Component Inputs/Outputs`)
```typescript
@Input() moduleType: any;
@Input() summaryRecords: any[] = [];
@Output() entitledUser = new EventEmitter();
@Input() isPendingRecord: boolean = false;
```
- 🎯 **What it does:** Defines Component Input/Output bindings to receive module type (`moduleType`), summary rows (`summaryRecords`), pending status flag (`isPendingRecord`), and emit Maker entitlement status (`entitledUser`).
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** Missing these `@Input()` and `@Output()` property bindings in `TradeMoreActionComponent`.
  - **Why Added:** Enables `TradeDataTableComponent` to pass pending state (`isPendingRecord`) and module metadata down to `TradeMoreActionComponent` so `showMenuList()` can evaluate `isMakerUser` and build the **"Recall"** menu option.
- ⏮️ **Before:** Component could not receive `isPendingRecord` or emit `entitledUser`.
- ⏭️ **After:** Property bindings enable dynamic Maker entitlement checks and Recall menu generation.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Component I/O Contract for Recall Entitlement Evaluation).
- ⚠️ **Revert Impact:** YES! Reverting will break template binding in `trade-data-table.component.html` (`[isPendingRecord]="..."`), throwing Angular binding errors.

---

### ⚙️ Lines 43–54: trade-more-action.component.ts (`Component Properties & Constructor Injection`)
```typescript
public isBillMatured: boolean = false; 
public isNotRequired: boolean = false;
isAcceptRequired: boolean = false;
public isImportBillPayIconEnabled: boolean = false;
public isImportBillAcceptIconEnabled: boolean = false;
public isImportBillRejectIconEnabled: boolean = false;
public isInwardCollectionPayIconEnabled: boolean = false;
public isInwardCollectionAcceptIconEnabled: boolean = false;
public isInwardCollectionRejectIconEnabled: boolean = false;
public isMakerUser: boolean = true;

constructor(public commonService: CommonServiceService, public transferLcService: TransferLcService) {
```
- 🎯 **What it does:** Declares state properties (including `isMakerUser`) and injects `TransferLcService` into `TradeMoreActionComponent`.
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Injected `SharedTradeService` and declared `disableActionFlag`.
  - **Why Modified:** `isMakerUser` is populated during `showMenuList()` to determine if the logged-in user has Maker entitlement for the row. If `isMakerUser === true` and `businessStatus === 'RA'`, `actionMenuForProduct()` renders the **"Recall"** menu item.
- ⏮️ **Before:** Component lacked `isMakerUser` state and `TransferLcService` injection.
- ⏭️ **After:** `isMakerUser` available to drive Recall entitlement logic.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (`isMakerUser` State Property for Recall Menu Item).
- ⚠️ **Revert Impact:** YES! Reverting `isMakerUser` or `TransferLcService` will break `showMenuList()`, preventing the Recall menu option from appearing.

---

### ⚙️ Lines 64–76: trade-more-action.component.ts (`ngOnInit()` Maker Entitlement Evaluation)
```typescript
ngOnInit(): void {
  this.checkBillMaturity();
  if (this.productInfo.product && (this.cifNumber || this.productInfo.product === 'saveAs') && this.contextRecordInfo) {
    this.isMakerUser = isMakerEntitlementForRecord(
      this.contextRecordInfo,
      this.cifNumber,
      this.productInfo.product
    );
  }
  if (this.productInfo.product === 'standalone-tr' || this.productInfo.product === 'invoice-discounting') {
    this.entitledUser.emit(true);
  } else {
    this.entitledUser.emit(this.isMakerUser);
  }
  ...
}
```
- 🎯 **What it does:** In `ngOnInit()`, evaluates if the logged-in user is a Maker for the current row using `isMakerEntitlementForRecord()`, assigns the boolean result to `this.isMakerUser`, and emits `this.entitledUser.emit(this.isMakerUser)` to the parent table.
- 🔄 **Why We Added It (Old vs New Code):**
  - **Old Code:** `ngOnInit()` did not calculate `isMakerUser` or call `isMakerEntitlementForRecord()`.
  - **Why Added:** Required so `showMenuList()` can pass `isMakerUser` into `actionMenuForProduct()`. If the user is a Maker (`isMakerUser = true`) and the row status is `RA`, the 3-dots dropdown menu displays **"Recall"**.
- ⏮️ **Before:** `isMakerUser` was un-evaluated in `ngOnInit()`.
- ⏭️ **After:** Evaluates `isMakerUser` on init and emits `entitledUser`.
- 🔗 **Delete / Recall Relation:** DIRECTLY RELATED TO RECALL (Core Component Initializer for Maker Recall Entitlement).
- ⚠️ **Revert Impact:** YES! Reverting will prevent `isMakerUser` from being evaluated, hiding the Recall action menu option on all summary tables.

---

### ⚙️ Lines 107–121: trade-more-action.component.ts (`checkBillMaturity` & `checkBusinessStatusdescription`)
```typescript
public checkBillMaturity(): void {
  if (this.productInfo?.product === 'lcBills' && this.currentRecord?.billMaturityDate) {
    const maturityDate = ddMMyyyyStringToDateObject(this.currentRecord?.billMaturityDate);
    const currentDate = new Date();
    this.isNotRequired = maturityDate < currentDate;
  }
}
public checkBusinessStatusdescription() {
  if (this.productInfo?.product === 'lcBills') {
    if (this.currentRecord?.billStatus === "Pending for Payment" && this.currentRecord?.productSubType === 'Usance' && this.currentRecord?.discrepancyFlag === 'N') {
      this.isAcceptRequired = true;
    }
  }
}
```
- 🎯 **What it does:** Calculates `isNotRequired` (if bill maturity date has passed) and `isAcceptRequired` (if usance bill requires acceptance) for Import Bills (`lcBills`).
- 🔄 **Why We Modified It (Old vs New Code):**
  - **Old Code:** Missing proper DD/MM/YYYY date parsing and acceptance requirement checks.
  - **Why Added:** Drives inline action icon visibility for Import Bills payment and acceptance.
- ⏮️ **Before:** Lacked maturity date parsing and acceptance check helpers.
- ⏭️ **After:** Computes `isNotRequired` and `isAcceptRequired` flags.
- 🔗 **Delete / Recall Relation:** INDIRECT / UNRELATED TO DELETE OR RECALL (Bills Settlement Helper Methods).
- ⚠️ **Revert Impact:** NO IMPACT ON DELETE OR RECALL. Reverting will only affect Import Bills settlement button logic.

---






























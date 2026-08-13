import React from "react";
import styles from "../../../page.module.css";

export default function AdminModals(props: any) {
  const {
    allCategories,
    assignLoading,
    availableProducts,
    btnColor,
    category,
    categoryModalError,
    categoryModalLoading,
    cats,
    customAlert,
    data,
    deleteCategoryLoading,
    deleteCategoryTarget,
    deleteCustomerTargetId,
    deleteReviewTarget,
    deleteTargetId,
    description,
    editReviewTarget,
    error,
    executeReturnStatusUpdate,
    existingProductIdsToAssign,
    file,
    files,
    handleAddCategorySubmit,
    handleAssignExistingToCategory,
    handleDelete,
    handleDeleteAdminReviewConfirm,
    handleDeleteCategoryConfirm,
    handleDeleteCustomer,
    handleEditReviewSubmit,
    handleMultipleFilesUpload,
    handleRemoveImage,
    handleRenameCategorySubmit,
    handleResetToDefaults,
    handleSubmit,
    handleUpdateOrderStatus,
    handleUpdateRefundStatus,
    heroBackup,
    heroBgColor,
    heroBgImage,
    heroBgType,
    heroBgVideo,
    heroButtonColor,
    heroButtonSize,
    heroButtonStyle,
    heroButtonText,
    heroButtonTextColor,
    heroManifesto,
    heroManifestoFontAlignment,
    heroManifestoFontColor,
    heroManifestoFontSize,
    heroManifestoFontType,
    heroManifestoFontWeight,
    heroTemplate,
    heroTitle,
    heroTitleFontAlignment,
    heroTitleFontColor,
    heroTitleFontSize,
    heroTitleFontType,
    heroTitleFontWeight,
    hoveredFontSize,
    hoveredFontType,
    hoveredFontWeight,
    imageFront,
    images,
    isChecked,
    isCover,
    isDeletingCustomer,
    isDeletingProduct,
    isDeletingReview,
    isEditing,
    isEditingReview,
    isFontDropdownOpen,
    isFontSizeDropdownOpen,
    isFontWeightDropdownOpen,
    isOutline,
    isRenamingCategory,
    isSelected,
    isSolid,
    link,
    makingPrice,
    name,
    newCategoryName,
    next,
    openCategoryIndex,
    options,
    orders,
    price,
    primaryColor,
    products,
    quantity,
    renameCategoryNewName,
    renameCategoryTarget,
    resetForm,
    returnStatusAction,
    returnStatusModalOpen,
    returnStatusNotes,
    saveSettingsSilent,
    selectedCategoryView,
    selectedCustomer,
    selectedElement,
    selectedOrder,
    selectedProductIds,
    setCategory,
    setCustomAlert,
    setDeleteCategoryTarget,
    setDeleteCustomerTargetId,
    setDeleteReviewTarget,
    setDeleteTargetId,
    setDescription,
    setEditReviewTarget,
    setExistingProductIdsToAssign,
    setHeroButtonColor,
    setHeroButtonSize,
    setHeroButtonStyle,
    setHeroButtonText,
    setHeroButtonTextColor,
    setHeroManifesto,
    setHeroManifestoFontAlignment,
    setHeroManifestoFontColor,
    setHeroManifestoFontSize,
    setHeroManifestoFontType,
    setHeroManifestoFontWeight,
    setHeroTemplate,
    setHeroTitle,
    setHeroTitleFontAlignment,
    setHeroTitleFontColor,
    setHeroTitleFontSize,
    setHeroTitleFontType,
    setHeroTitleFontWeight,
    setHoveredFontSize,
    setHoveredFontType,
    setHoveredFontWeight,
    setImageFront,
    setIsDeletingProduct,
    setIsEditing,
    setIsFontDropdownOpen,
    setIsFontSizeDropdownOpen,
    setIsFontWeightDropdownOpen,
    setName,
    setNewCategoryName,
    setOpenCategoryIndex,
    setOptions,
    setRenameCategoryNewName,
    setRenameCategoryTarget,
    setReturnStatusModalOpen,
    setReturnStatusNotes,
    setSelectedCustomer,
    setSelectedElement,
    setSelectedOrder,
    setSelectedProductIds,
    setShowAddCategoryModal,
    setShowAddExistingToCategoryModal,
    setShowCategoryAddOptionsModal,
    setShowCrudModal,
    setShowHeroButton,
    setShowHeroManifesto,
    setShowHeroTitle,
    setShowHeroTitleFontOptions,
    setShowResetConfirmModal,
    showAddCategoryModal,
    showAddExistingToCategoryModal,
    showCategoryAddOptionsModal,
    showCrudModal,
    showHeroButton,
    showHeroManifesto,
    showHeroTitle,
    showHeroTitleFontOptions,
    showResetConfirmModal,
    successMessage,
    updated,
    uploading,
    url,
    val,
  } = props;

  return (
    <>
      {/* CRUD Product Modal Overlay */}
      {showCrudModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "800px", maxHeight: "90vh", display: "flex", flexDirection: "column", padding: "24px 24px 20px 24px", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "14px", marginBottom: "14px", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "22px", height: "22px", color: "#111827" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#111827" }}>
                  {isEditing ? "Edit Product Details" : "Add new product to Catalog"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setShowCrudModal(false); resetForm(); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px", display: "inline-flex", alignItems: "center", borderRadius: "50%", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#000"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#9ca3af"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px", marginBottom: "14px" }}>
                {error && showCrudModal && (
                  <div className={styles.errorBanner} style={{ marginBottom: "14px", padding: "12px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "0.85rem", borderLeft: "4px solid #ef4444" }}>
                    {error}
                  </div>
                )}

                {/* Card 1: Product details */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product details</h4>

                  <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                    <label className={styles.inputLabel}>PerfumeName *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.textInput}
                      style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={styles.textareaInput}
                      style={{ padding: "10px 12px", fontSize: "0.85rem" }}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Card 2: Product Variants & Sizing Table */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Variants & Sizing</h4>

                  <div style={{ overflow: "visible" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Size*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Quantity*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Price*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563" }}>Making Price*</th>
                          <th style={{ padding: "8px 6px", fontSize: "0.8rem", fontWeight: 600, color: "#4b5563", minWidth: "180px" }}>Category*</th>
                          <th style={{ padding: "8px 6px", width: "40px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {options.map((opt: any, index: number) => (
                          <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="text"
                                value={opt.size}
                                placeholder="e.g. 50ml"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].size = e.target.value;
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.quantity}
                                min="0"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].quantity = e.target.value === "" ? "" : (parseInt(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.price}
                                min="1"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].price = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px" }}>
                              <input
                                type="number"
                                value={opt.makingPrice}
                                min="0"
                                onChange={(e) => {
                                  const updated = [...options];
                                  updated[index].makingPrice = e.target.value === "" ? "" : (parseFloat(e.target.value) || 0);
                                  setOptions(updated);
                                }}
                                required
                                className={styles.textInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", boxSizing: "border-box" }}
                              />
                            </td>
                            <td style={{ padding: "8px 4px", position: "relative" }}>
                              <div
                                className={styles.selectInput}
                                style={{ padding: "6px 8px", fontSize: "0.8rem", width: "100%", height: "34px", boxSizing: "border-box", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                                onClick={() => setOpenCategoryIndex(openCategoryIndex === index ? null : index)}
                              >
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {opt.category && opt.category.length > 0 ? opt.category.join(", ") : "Select..."}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "12px", height: "12px", flexShrink: 0 }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                              </div>
                              {openCategoryIndex === index && (
                                <>
                                  <div
                                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenCategoryIndex(null);
                                    }}
                                  />
                                  <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: "4px",
                                    right: "4px",
                                    zIndex: 50,
                                    backgroundColor: "#fff",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                    maxHeight: "250px",
                                    overflowY: "auto",
                                    marginTop: "4px"
                                  }}>
                                    {allCategories.map((cat: string) => {
                                      const isSelected = opt.category && opt.category.includes(cat);
                                      return (
                                        <div
                                          key={cat}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const updated = [...options];
                                            if (!updated[index].category) updated[index].category = [];
                                            if (isSelected) {
                                              updated[index].category = updated[index].category.filter((c: any) => c !== cat);
                                            } else {
                                              updated[index].category.push(cat);
                                            }
                                            setOptions(updated);
                                          }}
                                          style={{
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                            backgroundColor: isSelected ? "#4b5563" : "#fff",
                                            color: isSelected ? "#fff" : "#374151",
                                            fontSize: "0.8rem",
                                            transition: "background-color 0.2s, color 0.2s"
                                          }}
                                          onMouseEnter={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = "#f3f4f6";
                                          }}
                                          onMouseLeave={(e) => {
                                            if (!isSelected) e.currentTarget.style.backgroundColor = "#fff";
                                          }}
                                        >
                                          {cat}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </td>
                            <td style={{ padding: "8px 4px", textAlign: "center" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (options.length > 1) {
                                    setOptions(options.filter((_: any, idx: number) => idx !== index));
                                  }
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: options.length <= 1 ? "#fca5a5" : "#ef4444",
                                  cursor: options.length <= 1 ? "not-allowed" : "pointer",
                                  fontSize: "1rem",
                                  padding: "4px"
                                }}
                                title="Remove Variant"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOptions([...options, { size: "", quantity: "", price: "", makingPrice: "", category: [] }]);
                    }}
                    style={{
                      marginTop: "12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#000000",
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                  >
                    + Add Variant
                  </button>
                </div>

                {/* Card 3: Perfume Images */}
                <div style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "18px", marginBottom: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 14px 0" }}>Product Images</h4>

                  <div className={styles.inputGroup} style={{ marginBottom: "14px" }}>
                    <label className={styles.inputLabel} style={{ marginBottom: "6px" }}>Perfume Images (Upload 3 to 6 images) *</label>
                    <label style={{ display: "block" }}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleMultipleFilesUpload}
                        disabled={uploading}
                      />
                      <div style={{
                        border: "2px dashed #d1d5db",
                        borderRadius: "8px",
                        padding: "16px 12px",
                        textAlign: "center",
                        backgroundColor: "#fafafa",
                        cursor: uploading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                      }}
                        onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.backgroundColor = "#f3f4f6"; } }}
                        onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.backgroundColor = "#fafafa"; } }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "24px", height: "24px", color: "#9ca3af", margin: "0 auto 4px auto" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                        <span style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>
                          {uploading ? "Uploading Images..." : "Choose Image Files to Upload"}
                        </span>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "#6b7280", marginTop: "2px" }}>
                          JPG or PNG files • 3 to 6 images • Minimum 3 required
                        </span>
                      </div>
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "0.72rem", color: images.length >= 3 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                        {images.length >= 3 ? `✓ Met requirement (${images.length} uploaded)` : `✗ Need ${3 - images.length} more image(s)`}
                      </span>
                      <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                        Max limit: 6 images
                      </span>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div style={{ backgroundColor: "#f9fafb", padding: "10px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                      <label className={styles.inputLabel} style={{ marginBottom: "6px", display: "block", fontSize: "0.68rem", color: "#4b5563" }}>
                        Tap an image to set as FRONT COVER (★ indicates Cover)
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))", gap: "8px" }}>
                        {images.map((url: string, index: number) => {
                          const isCover = imageFront === url;
                          return (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                borderRadius: "8px",
                                border: isCover ? "2px solid #000000" : "1px solid #e5e7eb",
                                padding: "3px",
                                backgroundColor: "#ffffff",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: isCover ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"
                              }}
                              onClick={() => setImageFront(url)}
                              onMouseEnter={(e) => { if (!isCover) e.currentTarget.style.borderColor = "#9ca3af"; }}
                              onMouseLeave={(e) => { if (!isCover) e.currentTarget.style.borderColor = "#e5e7eb"; }}
                            >
                              <img
                                src={url}
                                alt={`Uploaded perfume ${index + 1}`}
                                style={{ width: "100%", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                              />

                              <span style={{
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                color: isCover ? "#000000" : "#9ca3af",
                                textTransform: "uppercase",
                                letterSpacing: "0.02em",
                                marginTop: "4px",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px"
                              }}>
                                {isCover ? "★ Cover" : "Set Cover"}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(index);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "-5px",
                                  right: "-5px",
                                  backgroundColor: "#ef4444",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)"
                                }}
                                title="Remove Image"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "14px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0, backgroundColor: "#f3f4f6" }}>
                <button
                  type="button"
                  onClick={() => { setShowCrudModal(false); resetForm(); }}
                  className={styles.secondaryActionBtn}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  disabled={!name.trim() || images.length < 3 || images.length > 6 || !imageFront || options.length === 0 || options.some((opt: any) => !opt.size.trim() || opt.quantity === "" || opt.price === "" || !opt.category || opt.category.length === 0)}
                >
                  {isEditing ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Add Category Modal Overlay */}
      {showAddCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "580px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                Add New Category
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddCategoryModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingRight: "10px", marginBottom: "15px" }}>
                {categoryModalError && (
                  <div className={styles.errorBanner} style={{ marginBottom: "15px", padding: "10px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "0.85rem", flexShrink: 0 }}>
                    {categoryModalError}
                  </div>
                )}

                <div className={styles.inputGroup} style={{ marginBottom: "15px", flexShrink: 0 }}>
                  <label className={styles.inputLabel}>Category Name *</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Exclusive Series"
                    className={styles.textInput}
                    required
                  />
                </div>

                <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                  <label className={styles.inputLabel} style={{ marginBottom: "8px", flexShrink: 0 }}>Select Products to Add to this Category</label>
                  <div style={{ overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px", height: "175px", flexShrink: 0 }}>
                    {products.length === 0 ? (
                      <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>No products available.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {products.map((product: any) => {
                          const isChecked = selectedProductIds.includes(product._id!);
                          return (
                            <label
                              key={product._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "8px",
                                border: "1px solid #f3f4f6",
                                borderRadius: "6px",
                                cursor: "pointer",
                                backgroundColor: isChecked ? "#fafafa" : "#fff",
                                transition: "background-color 0.2s"
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProductIds([...selectedProductIds, product._id!]);
                                  } else {
                                    setSelectedProductIds(selectedProductIds.filter((id: any) => id !== product._id));
                                  }
                                }}
                                style={{ cursor: "pointer", width: "16px", height: "16px" }}
                              />
                              {product.imageFront && (
                                <img
                                  src={product.imageFront}
                                  alt={product.name}
                                  style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }}
                                />
                              )}
                              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#000" }}>{product.name}</span>
                                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Current Categories: {Array.isArray(product.category) ? product.category.join(", ") : (product.category || "None")}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddCategoryModal(false); }}
                  className={styles.secondaryActionBtn}
                  disabled={categoryModalLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  disabled={categoryModalLoading || !newCategoryName.trim()}
                >
                  {categoryModalLoading ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Category Product Add Option Selector Modal Overlay */}
      {showCategoryAddOptionsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "480px", display: "flex", flexDirection: "column", padding: "24px" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                Add Product to Category
              </h3>
              <button
                type="button"
                onClick={() => { setShowCategoryAddOptionsModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "12px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.5 }}>
                Choose how you want to add a product to the <strong>{selectedCategoryView}</strong> collection:
              </p>

              {/* Option 1: Create New Product */}
              <div
                onClick={() => {
                  setShowCategoryAddOptionsModal(false);
                  setIsEditing(false);
                  resetForm();
                  setCategory(selectedCategoryView ? [selectedCategoryView] : []);
                  setShowCrudModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: "#fff"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#f3f4f6", borderRadius: "50%", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#000" }}>Create New Product</span>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Create a brand new perfume catalog listing from scratch.</span>
                </div>
              </div>

              {/* Option 2: Add Existing Product */}
              <div
                onClick={() => {
                  setShowCategoryAddOptionsModal(false);
                  setExistingProductIdsToAssign([]);
                  setShowAddExistingToCategoryModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backgroundColor: "#fff"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fff"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#f3f4f6", borderRadius: "50%", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.75 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#000" }}>Add Existing Products</span>
                  <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Select and link existing products from your catalog here.</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => { setShowCategoryAddOptionsModal(false); }}
                className={styles.secondaryActionBtn}
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Existing Product to Category Modal Overlay */}
      {showAddExistingToCategoryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "580px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px", flexShrink: 0 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                Add Products to {selectedCategoryView}
              </h3>
              <button
                type="button"
                onClick={() => { setShowAddExistingToCategoryModal(false); }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAssignExistingToCategory} style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingRight: "10px", marginBottom: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflow: "hidden" }}>
                  <label className={styles.inputLabel} style={{ marginBottom: "2px" }}>
                    Select Products to Associate (Displaying max 3 at a time, scrollable)
                  </label>

                  <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {(() => {
                      const availableProducts = products.filter((p: any) => {
                        const cats = Array.isArray(p.category) ? p.category : [p.category].filter((c): c is string => typeof c === 'string');
                        return selectedCategoryView ? !cats.includes(selectedCategoryView) : false;
                      });

                      if (availableProducts.length === 0) {
                        return (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", border: "1px dashed #d1d5db", borderRadius: "6px", backgroundColor: "#fafafa" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "32px", height: "32px", color: "#9ca3af", marginBottom: "10px" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span style={{ fontSize: "0.85rem", color: "#6b7280", textAlign: "center" }}>All existing products are already assigned to this category.</span>
                          </div>
                        );
                      }

                      return (
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          overflowY: "auto",
                          padding: "4px",
                          height: "175px"
                        }}>
                          {availableProducts.map((product: any) => {
                            const isChecked = existingProductIdsToAssign.includes(product._id!);
                            return (
                              <label
                                key={product._id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  padding: "8px",
                                  border: "1px solid #f3f4f6",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  backgroundColor: isChecked ? "#fafafa" : "#fff",
                                  transition: "background-color 0.2s"
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setExistingProductIdsToAssign([...existingProductIdsToAssign, product._id!]);
                                    } else {
                                      setExistingProductIdsToAssign(existingProductIdsToAssign.filter((id: any) => id !== product._id));
                                    }
                                  }}
                                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                />
                                {product.imageFront && (
                                  <img
                                    src={product.imageFront}
                                    alt={product.name}
                                    style={{ width: "32px", height: "32px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }}
                                  />
                                )}
                                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#000" }}>{product.name}</span>
                                  <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Current Categories: {Array.isArray(product.category) ? product.category.join(", ") : (product.category || "None")}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className={styles.modalActionRow} style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px", display: "flex", justifyContent: "flex-end", gap: "10px", flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => { setShowAddExistingToCategoryModal(false); }}
                  className={styles.secondaryActionBtn}
                  disabled={assignLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryActionBtn}
                  disabled={assignLoading || existingProductIdsToAssign.length === 0}
                >
                  {assignLoading ? "Saving..." : "Add to Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Category Confirmation Modal */}
      {deleteCategoryTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Delete Category?</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteCategoryTarget(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className={styles.modalDescription} style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: "1.5", margin: "15px 0" }}>
              Are you sure you want to delete the category <strong>&quot;{deleteCategoryTarget}&quot;</strong>? All products currently in this category will have their category cleared, but they will not be deleted and can still be found in <strong>&quot;All Products&quot;</strong>.
            </p>

            <div className={styles.modalActionRow} style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => setDeleteCategoryTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={deleteCategoryLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategoryConfirm}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                disabled={deleteCategoryLoading}
              >
                {deleteCategoryLoading ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <h3>Delete Perfume?</h3>
            </div>

            <p className={styles.modalDescription}>
              Are you sure you want to delete this perfume from your inventory catalog? This action is permanent and cannot be undone.
            </p>

            <div className={styles.modalActionRow}>
              <button
                onClick={async () => {
                  if (deleteTargetId) {
                    setIsDeletingProduct(true);
                    await handleDelete(deleteTargetId);
                    setDeleteTargetId(null);
                    setIsDeletingProduct(false);
                  }
                }}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingProduct ? 0.7 : 1 }}
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteTargetId(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingProduct}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Overlay Modal */}
      {customAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <h3>{customAlert.title}</h3>
            </div>

            <p className={styles.modalDescription}>
              {customAlert.message}
            </p>

            <div className={styles.modalActionRow}>
              <button
                onClick={() => setCustomAlert(null)}
                className={styles.primaryActionBtn}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <h3>Reset Customize Settings?</h3>
            </div>

            <p className={styles.modalDescription}>
              Are you sure you want to reset all storefront layout options, text copies, theme color, and banner configurations back to factory system defaults?
            </p>

            <div className={styles.modalActionRow}>
              <button
                onClick={handleResetToDefaults}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className={styles.secondaryActionBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification for Success Messages */}
      {successMessage && (
        <div className={styles.toastNotification}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#10b981" style={{ width: "20px", height: "20px", marginRight: "10px", flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Selected Customer Detail Modal */}
      {selectedCustomer && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCustomer(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000, padding: "20px" }} data-lenis-prevent="true">
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", background: "#fff", borderRadius: "8px", padding: "30px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "12px", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#111827" }}>Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Name</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827", fontWeight: 600 }}>{selectedCustomer.name}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Email Address</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827" }}>{selectedCustomer.email}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Phone Number</p>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827" }}>{selectedCustomer.phone}</p>
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Shipping Address (Latest)</p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "#111827", lineHeight: "1.4" }}>{selectedCustomer.address}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px", padding: "15px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Total Orders</p>
                  <p style={{ margin: 0, fontSize: "1.2rem", color: "#111827", fontWeight: 700 }}>{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.75rem", color: "#6b7280", textTransform: "uppercase", fontWeight: 600 }}>Total Spend</p>
                  <p style={{ margin: 0, fontSize: "1.2rem", color: "#10b981", fontWeight: 700 }}>₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}.00</p>
                </div>
              </div>

              {/* Order History Table */}
              <div style={{ marginTop: "10px" }}>
                <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "#111827", textTransform: "uppercase", fontWeight: 700, borderBottom: "1px solid #eaeaea", paddingBottom: "5px" }}>Order History</p>
                <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #eaeaea", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                    <thead style={{ position: "sticky", top: 0, backgroundColor: "#f9fafb", zIndex: 1 }}>
                      <tr>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Order ID</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Date</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Amount</th>
                        <th style={{ padding: "8px 12px", borderBottom: "1px solid #eaeaea", fontWeight: 600, color: "#6b7280" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter((o: any) => o.customerEmail === selectedCustomer.email).length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "20px", textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}>No orders found for this customer.</td>
                        </tr>
                      ) : (
                        orders
                          .filter((o: any) => o.customerEmail === selectedCustomer.email)
                          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((order: any) => (
                            <tr key={order._id} style={{ borderBottom: "1px solid #eaeaea" }}>
                              <td style={{ padding: "8px 12px", color: "#111827", fontWeight: 500 }}>{order.orderId}</td>
                              <td style={{ padding: "8px 12px", color: "#6b7280" }}>
                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td style={{ padding: "8px 12px", color: "#111827", fontWeight: 600 }}>₹{order.totalAmount.toLocaleString("en-IN")}.00</td>
                              <td style={{ padding: "8px 12px" }}>
                                <span style={{
                                  display: "inline-block",
                                  padding: "2px 6px",
                                  borderRadius: "12px",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  backgroundColor: order.status === "Delivered" ? "#eaf7ee" : order.status === "Shipped" ? "#eff6ff" : "#fef3c7",
                                  color: order.status === "Delivered" ? "#15803d" : order.status === "Shipped" ? "#1d4ed8" : "#b45309"
                                }}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setDeleteCustomerTargetId(selectedCustomer._id)} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#dc2626"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}>Delete Customer</button>
              <button onClick={() => setSelectedCustomer(null)} className={styles.secondaryActionBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteCustomerTargetId && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <h3>Confirm Delete Customer</h3>
            </div>
            <p className={styles.modalDescription}>
              Are you sure you want to remove this customer from the directory? Historical orders will not be deleted.
            </p>
            <div className={styles.modalActionRow}>
              <button
                onClick={() => handleDeleteCustomer(deleteCustomerTargetId)}
                disabled={isDeletingCustomer}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingCustomer ? 0.7 : 1 }}
              >
                {isDeletingCustomer ? "Deleting..." : "Delete Customer"}
              </button>
              <button
                onClick={() => setDeleteCustomerTargetId(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingCustomer}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000, padding: "20px" }}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "600px", background: "#fff", borderRadius: "8px", padding: "30px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eaeaea", paddingBottom: "12px", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#111827" }}>Order Details: <span style={{ fontFamily: "monospace", color: "#4f46e5" }}>{selectedOrder.orderId}</span></h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Customer Information</h3>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                <p style={{ margin: "4px 0", fontSize: "0.88rem", color: "#111827" }}><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
              </div>

              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Fulfillment status</h3>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    backgroundColor: selectedOrder.status === "Delivered" ? "#eaf7ee" : selectedOrder.status === "Shipped" ? "#eff6ff" : selectedOrder.status === "Cancelled" ? "#fee2e2" : "#fef3c7",
                    color: selectedOrder.status === "Delivered" ? "#15803d" : selectedOrder.status === "Shipped" ? "#1d4ed8" : selectedOrder.status === "Cancelled" ? "#ef4444" : "#b45309"
                  }}>
                    {selectedOrder.status}
                  </span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    style={{ padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.8rem", background: "#fff", cursor: "pointer", color: "#000" }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Return Requested">Return Requested</option>
                    <option value="Returned">Returned</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {selectedOrder.paymentMethod !== "COD" && (
                <div>
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0", color: "#888" }}>Refund Status</h3>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      backgroundColor: selectedOrder.refundStatus === "Refunded" ? "#eaf7ee" : "#fef3c7",
                      color: selectedOrder.refundStatus === "Refunded" ? "#15803d" : "#b45309"
                    }}>
                      {selectedOrder.refundStatus || "Not Refunded"}
                    </span>
                    <select
                      value={selectedOrder.refundStatus || "Not Refunded"}
                      onChange={(e) => handleUpdateRefundStatus(selectedOrder._id, e.target.value)}
                      style={{ padding: "4px 8px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.8rem", background: "#fff", cursor: "pointer", color: "#000" }}
                    >
                      <option value="Not Refunded">Not Refunded</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0", color: "#888" }}>Items Purchased</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedOrder.cartItems.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "15px", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>
                      {item.image && (
                        <img src={item.image} alt={item.name} style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eaeaea" }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#111" }}>{item.name}</h4>
                        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Volume: {item.size} | Qty: {item.quantity}</span>
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #eaeaea", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>Total Amount Due (COD)</span>
                <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "#4f46e5" }}>₹{selectedOrder.totalAmount.toLocaleString("en-IN")}.00</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Brand Header Title Font Customizer Pop-up Modal */}
      {showHeroTitleFontOptions && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15000,
            padding: "20px"
          }}
          onClick={() => {
            // Restore from backup on clicking backdrop
            if (heroBackup) {
              setHeroTitle(heroBackup.heroTitle);
              setHeroManifesto(heroBackup.heroManifesto);
              setHeroTemplate(heroBackup.heroTemplate);
              setShowHeroTitle(heroBackup.showHeroTitle);
              setShowHeroManifesto(heroBackup.showHeroManifesto);
              setShowHeroButton(heroBackup.showHeroButton);
              setHeroButtonText(heroBackup.heroButtonText);
              setHeroButtonStyle(heroBackup.heroButtonStyle);
              setHeroButtonSize(heroBackup.heroButtonSize);
              setHeroButtonColor(heroBackup.heroButtonColor);
              setHeroButtonTextColor(heroBackup.heroButtonTextColor);
              setHeroTitleFontType(heroBackup.heroTitleFontType);
              setHeroTitleFontColor(heroBackup.heroTitleFontColor);
              setHeroTitleFontSize(heroBackup.heroTitleFontSize);
              setHeroTitleFontAlignment(heroBackup.heroTitleFontAlignment);
              setHeroTitleFontWeight(heroBackup.heroTitleFontWeight);
              setHeroManifestoFontType(heroBackup.heroManifestoFontType);
              setHeroManifestoFontColor(heroBackup.heroManifestoFontColor);
              setHeroManifestoFontSize(heroBackup.heroManifestoFontSize);
              setHeroManifestoFontAlignment(heroBackup.heroManifestoFontAlignment);
              setHeroManifestoFontWeight(heroBackup.heroManifestoFontWeight);
            }
            setShowHeroTitleFontOptions(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              width: "95vw",
              maxWidth: "1280px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "95vh",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 30px",
              borderBottom: "1px solid #f3f4f6",
              backgroundColor: "#fafafa"
            }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#111827", fontFamily: "Outfit, sans-serif" }}>
                  Customize Landing Page Hero Section
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                  Select a layout template structure, and click on any text box or button in the live preview to edit its content or toggle its visibility.
                </p>
              </div>
              <button
                onClick={() => {
                  // Restore from backup on click close
                  if (heroBackup) {
                    setHeroTitle(heroBackup.heroTitle);
                    setHeroManifesto(heroBackup.heroManifesto);
                    setHeroTemplate(heroBackup.heroTemplate);
                    setShowHeroTitle(heroBackup.showHeroTitle);
                    setShowHeroManifesto(heroBackup.showHeroManifesto);
                    setShowHeroButton(heroBackup.showHeroButton);
                    setHeroButtonText(heroBackup.heroButtonText);
                    setHeroButtonStyle(heroBackup.heroButtonStyle);
                    setHeroButtonSize(heroBackup.heroButtonSize);
                    setHeroButtonColor(heroBackup.heroButtonColor);
                    setHeroButtonTextColor(heroBackup.heroButtonTextColor);
                    setHeroTitleFontType(heroBackup.heroTitleFontType);
                    setHeroTitleFontColor(heroBackup.heroTitleFontColor);
                    setHeroTitleFontSize(heroBackup.heroTitleFontSize);
                    setHeroTitleFontAlignment(heroBackup.heroTitleFontAlignment);
                    setHeroTitleFontWeight(heroBackup.heroTitleFontWeight);
                    setHeroManifestoFontType(heroBackup.heroManifestoFontType);
                    setHeroManifestoFontColor(heroBackup.heroManifestoFontColor);
                    setHeroManifestoFontSize(heroBackup.heroManifestoFontSize);
                    setHeroManifestoFontAlignment(heroBackup.heroManifestoFontAlignment);
                    setHeroManifestoFontWeight(heroBackup.heroManifestoFontWeight);
                  }
                  setShowHeroTitleFontOptions(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#9ca3af",
                  lineHeight: 1,
                  padding: "8px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Split layout for settings and preview */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: "65vh" }}>
              
              {/* Left sidebar: Templates and Active component settings */}
              <div style={{
                width: "420px",
                borderRight: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                backgroundColor: "#ffffff",
                padding: "24px",
                boxSizing: "border-box"
              }}>
                {/* 1. Visual Layout Templates Selector */}
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                  1. Page Structure Layout Template
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "30px" }}>
                  {[
                    {
                      id: "center",
                      label: "Classic Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="15" x2="75" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="23" x2="65" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "top-center",
                      label: "Top Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="10" x2="75" y2="10" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="17" x2="65" y2="17" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="24" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "bottom-center",
                      label: "Bottom Center",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="25" y1="22" x2="75" y2="22" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="35" y1="29" x2="65" y2="29" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="40" y="36" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "left",
                      label: "Left Centered",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="15" x2="55" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="23" x2="60" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "bottom-left",
                      label: "Bottom Left",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="23" x2="50" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="31" x2="60" y2="31" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="38" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "top-left",
                      label: "Top Left",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="12" y1="12" x2="50" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="12" y1="20" x2="60" y2="20" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="12" y="28" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right",
                      label: "Right Centered",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="15" x2="88" y2="15" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="23" x2="88" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="32" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right-top",
                      label: "Right Top",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="12" x2="88" y2="12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="20" x2="88" y2="20" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="28" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    },
                    {
                      id: "right-bottom",
                      label: "Right Bottom",
                      icon: (
                        <svg width="100%" height="45" viewBox="0 0 100 50">
                          <rect width="100%" height="50" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
                          <line x1="45" y1="23" x2="88" y2="23" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="40" y1="31" x2="88" y2="31" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="68" y="38" width="20" height="6" fill="#3b82f6" rx="2" />
                        </svg>
                      )
                    }
                  ].map((t) => {
                    const isSelected = heroTemplate === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setHeroTemplate(t.id)}
                        style={{
                          flex: 1,
                          background: "none",
                          border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          alignItems: "center",
                          outline: "none",
                          transition: "all 0.2s"
                        }}
                      >
                        {t.icon}
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isSelected ? "#3b82f6" : "#475569" }}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 2. Component Customizer */}
                <h4 style={{ fontSize: "0.88rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", margin: "0 0 12px 0" }}>
                  2. Component Editor
                </h4>

                {selectedElement ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                    <div style={{ backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #eff6ff" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#2563eb" }}>
                        Selected Element
                      </span>
                      <h5 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "2px 0 0 0", color: "#0f172a", textTransform: "capitalize" }}>
                        {selectedElement === "title" ? "Hero Title" : selectedElement === "manifesto" ? "Hero Manifesto" : "CTA Button"}
                      </h5>
                    </div>

                    {/* Visibility Switch */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>
                        Enable Element Visibility
                      </span>
                      <input
                        type="checkbox"
                        checked={
                          selectedElement === "title" ? showHeroTitle :
                          selectedElement === "manifesto" ? showHeroManifesto :
                          showHeroButton
                        }
                        onChange={(e) => {
                          const val = e.target.checked;
                          if (selectedElement === "title") setShowHeroTitle(val);
                          else if (selectedElement === "manifesto") setShowHeroManifesto(val);
                          else setShowHeroButton(val);
                        }}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                      />
                    </div>

                    {/* Text Field Inputs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                        Content / Label Text
                      </label>
                      {selectedElement === "manifesto" ? (
                        <textarea
                          value={heroManifesto}
                          onChange={(e) => setHeroManifesto(e.target.value)}
                          disabled={!showHeroManifesto}
                          rows={4}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.88rem",
                            width: "100%",
                            resize: "vertical",
                            boxSizing: "border-box",
                            color: "#000",
                            opacity: showHeroManifesto ? 1 : 0.5
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={selectedElement === "title" ? heroTitle : heroButtonText}
                          onChange={(e) => {
                            if (selectedElement === "title") setHeroTitle(e.target.value);
                            else setHeroButtonText(e.target.value);
                          }}
                          disabled={selectedElement === "title" ? !showHeroTitle : !showHeroButton}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.88rem",
                            width: "100%",
                            boxSizing: "border-box",
                            color: "#000",
                            opacity: (selectedElement === "title" ? showHeroTitle : showHeroButton) ? 1 : 0.5
                          }}
                        />
                      )}
                    </div>

                    {/* Font & Style options - Only for text elements */}
                    {selectedElement !== "button" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                        
                        {/* Font Type Selection (Custom Dropdown with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Family</label>
                          
                          {/* Trigger element */}
                          <div
                            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600,
                              fontFamily: selectedElement === "title" ? `"${heroTitleFontType}", sans-serif` : `"${heroManifestoFontType}", sans-serif`
                            }}
                          >
                            <span>
                              {selectedElement === "title" ? heroTitleFontType : heroManifestoFontType}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover overlay */}
                          {isFontDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontDropdownOpen(false); setHoveredFontType(null); }} />
                              <div style={{
                                position: "absolute",
                                top: "68px",
                                left: 0,
                                width: "100%",
                                minWidth: "280px",
                                maxHeight: "320px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 16100,
                                boxSizing: "border-box"
                              }}>
                                {[
                                  { category: "Elegant Serif (Luxury & Heritage)", fonts: [
                                    { name: "Cinzel", label: "Cinzel (Luxury Capital)" },
                                    { name: "Cinzel Decorative", label: "Cinzel Decorative (Ornate)" },
                                    { name: "Cormorant Garamond", label: "Cormorant Garamond (Editorial)" },
                                    { name: "Playfair Display", label: "Playfair Display (Classic)" },
                                    { name: "Prata", label: "Prata (High-Contrast)" },
                                    { name: "Italiana", label: "Italiana (Minimalist)" },
                                    { name: "Bodoni Moda", label: "Bodoni Moda (Modern)" },
                                    { name: "DM Serif Display", label: "DM Serif (Bold Editorial)" },
                                    { name: "EB Garamond", label: "EB Garamond (Luxury Antique)" },
                                    { name: "Spectral", label: "Spectral (Editorial Serif)" },
                                    { name: "Fraunces", label: "Fraunces (Warm & Organic)" }
                                  ]},
                                  { category: "Modern Sans-Serif (Clean & Premium)", fonts: [
                                    { name: "Outfit", label: "Outfit (Modern & Trendy)" },
                                    { name: "Montserrat", label: "Montserrat (Geometric)" },
                                    { name: "Inter", label: "Inter (Technical)" },
                                    { name: "Tenor Sans", label: "Tenor Sans (Clean Chic)" },
                                    { name: "Space Grotesk", label: "Space Grotesk (Tech)" },
                                    { name: "Lora", label: "Lora (Contemporary)" },
                                    { name: "Cabinet Grotesk", label: "Cabinet Grotesk (Luxury Geometric)" }
                                  ]}
                                ].map((cat, catIdx) => (
                                  <div key={catIdx}>
                                    <div style={{
                                      padding: "6px 12px",
                                      fontSize: "0.68rem",
                                      fontWeight: 800,
                                      color: "#94a3b8",
                                      backgroundColor: "#f8fafc",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.05em",
                                      borderBottom: "1px solid #f1f5f9"
                                    }}>
                                      {cat.category}
                                    </div>
                                    {cat.fonts.map((f) => {
                                      const isSelected = (selectedElement === "title" ? heroTitleFontType : heroManifestoFontType) === f.name;
                                      return (
                                        <div
                                          key={f.name}
                                          onClick={() => {
                                            if (selectedElement === "title") setHeroTitleFontType(f.name);
                                            else setHeroManifestoFontType(f.name);
                                            setIsFontDropdownOpen(false);
                                            setHoveredFontType(null);
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                                            setHoveredFontType(f.name);
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = isSelected ? '#eff6ff' : 'transparent';
                                            setHoveredFontType(null);
                                          }}
                                          style={{
                                            padding: "8px 12px",
                                            fontSize: "0.85rem",
                                            cursor: "pointer",
                                            fontFamily: `"${f.name}", sans-serif`,
                                            backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                            color: isSelected ? "#2563eb" : "#334155",
                                            fontWeight: isSelected ? 700 : 500,
                                            borderBottom: "1px solid #f8fafc",
                                            transition: "background-color 0.15s"
                                          }}
                                        >
                                          {f.label}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Font Size Selection (Custom Popover with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Size</label>
                          
                          {/* Trigger */}
                          <div
                            onClick={() => setIsFontSizeDropdownOpen(!isFontSizeDropdownOpen)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600
                            }}
                          >
                            <span>
                              {selectedElement === "title" ? heroTitleFontSize : heroManifestoFontSize}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontSizeDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover list */}
                          {isFontSizeDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontSizeDropdownOpen(false); setHoveredFontSize(null); }} />
                              <div style={{
                                position: "absolute",
                                top: "68px",
                                left: 0,
                                width: "100%",
                                minWidth: "200px",
                                maxHeight: "280px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 16100,
                                boxSizing: "border-box"
                              }}>
                                {(selectedElement === "title"
                                  ? ["1.5rem", "2.0rem", "2.5rem", "3.0rem", "3.5rem", "4.0rem", "4.5rem", "5.0rem", "5.5rem", "6.0rem", "6.5rem", "7.0rem", "7.5rem", "8.0rem", "9.0rem", "10.0rem"]
                                  : ["0.6rem", "0.7rem", "0.8rem", "0.9rem", "1.0rem", "1.1rem", "1.2rem", "1.3rem", "1.4rem", "1.5rem", "1.6rem", "1.8rem", "2.0rem"]
                                ).map((size) => {
                                  const isSelected = (selectedElement === "title" ? heroTitleFontSize : heroManifestoFontSize) === size;
                                  return (
                                    <div
                                      key={size}
                                      onClick={() => {
                                        if (selectedElement === "title") setHeroTitleFontSize(size);
                                        else setHeroManifestoFontSize(size);
                                        setIsFontSizeDropdownOpen(false);
                                        setHoveredFontSize(null);
                                      }}
                                      onMouseEnter={() => setHoveredFontSize(size)}
                                      onMouseLeave={() => setHoveredFontSize(null)}
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                        color: isSelected ? "#2563eb" : "#334155",
                                        fontWeight: isSelected ? 700 : 500,
                                        borderBottom: "1px solid #f8fafc",
                                        transition: "background-color 0.15s"
                                      }}
                                    >
                                      {size}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Font Color Picker */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={selectedElement === "title" ? heroTitleFontColor : heroManifestoFontColor}
                              onChange={(e) => {
                                if (selectedElement === "title") setHeroTitleFontColor(e.target.value);
                                else setHeroManifestoFontColor(e.target.value);
                              }}
                              style={{
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: "transparent"
                              }}
                            />
                            <input
                              type="text"
                              value={selectedElement === "title" ? heroTitleFontColor : heroManifestoFontColor}
                              onChange={(e) => {
                                if (selectedElement === "title") setHeroTitleFontColor(e.target.value);
                                else setHeroManifestoFontColor(e.target.value);
                              }}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                        {/* Font Weight (Custom Popover with hover preview) */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", position: "relative" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Font Weight</label>
                          
                          {/* Trigger */}
                          <div
                            onClick={() => setIsFontWeightDropdownOpen(!isFontWeightDropdownOpen)}
                            style={{
                              padding: "10px 14px",
                              borderRadius: "8px",
                              border: "1px solid #cbd5e1",
                              fontSize: "0.88rem",
                              backgroundColor: "#ffffff",
                              color: "#000000",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: 600
                            }}
                          >
                            <span>
                              {selectedElement === "title" 
                                ? { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[heroTitleFontWeight as "300" | "400" | "500" | "600" | "700" | "800" | "900"] || heroTitleFontWeight
                                : { "300": "Light (300)", "400": "Regular (400)", "500": "Medium (500)", "600": "Semi Bold (600)", "700": "Bold (700)", "800": "Extra Bold (800)", "900": "Black (900)" }[heroManifestoFontWeight as "300" | "400" | "500" | "600" | "700" | "800" | "900"] || heroManifestoFontWeight
                              }
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#64748b" style={{ width: "12px", height: "12px", transform: isFontWeightDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>

                          {/* Popover list */}
                          {isFontWeightDropdownOpen && (
                            <>
                              <div style={{ position: "fixed", inset: 0, zIndex: 16000 }} onClick={() => { setIsFontWeightDropdownOpen(false); setHoveredFontWeight(null); }} />
                              <div style={{
                                position: "absolute",
                                top: "68px",
                                left: 0,
                                width: "100%",
                                minWidth: "200px",
                                maxHeight: "280px",
                                overflowY: "auto",
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "8px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                                zIndex: 16100,
                                boxSizing: "border-box"
                              }}>
                                {[
                                  { value: "300", label: "Light (300)" },
                                  { value: "400", label: "Regular (400)" },
                                  { value: "500", label: "Medium (500)" },
                                  { value: "600", label: "Semi Bold (600)" },
                                  { value: "700", label: "Bold (700)" },
                                  { value: "800", label: "Extra Bold (800)" },
                                  { value: "900", label: "Black (900)" }
                                ].map((w) => {
                                  const isSelected = (selectedElement === "title" ? heroTitleFontWeight : heroManifestoFontWeight) === w.value;
                                  return (
                                    <div
                                      key={w.value}
                                      onClick={() => {
                                        if (selectedElement === "title") setHeroTitleFontWeight(w.value);
                                        else setHeroManifestoFontWeight(w.value);
                                        setIsFontWeightDropdownOpen(false);
                                        setHoveredFontWeight(null);
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                                        setHoveredFontWeight(w.value);
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = isSelected ? '#eff6ff' : 'transparent';
                                        setHoveredFontWeight(null);
                                      }}
                                      style={{
                                        padding: "8px 12px",
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                        color: isSelected ? "#2563eb" : "#334155",
                                        fontWeight: isSelected ? 700 : 500,
                                        borderBottom: "1px solid #f8fafc",
                                        transition: "background-color 0.15s"
                                      }}
                                    >
                                      {w.label}
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>

                      </div>
                    )}

                    {/* Button Styling Options - Only for button element */}
                    {selectedElement === "button" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                        
                        {/* Button Style selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Style</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {["solid", "outline", "minimal"].map((style) => (
                              <button
                                key={style}
                                type="button"
                                onClick={() => setHeroButtonStyle(style)}
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  backgroundColor: heroButtonStyle === style ? "#111827" : "#ffffff",
                                  color: heroButtonStyle === style ? "#ffffff" : "#374151",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  textTransform: "capitalize"
                                }}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Size selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Size</label>
                          <div style={{ display: "flex", gap: "8px" }}>
                            {["sm", "md", "lg"].map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setHeroButtonSize(size)}
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #cbd5e1",
                                  backgroundColor: heroButtonSize === size ? "#111827" : "#ffffff",
                                  color: heroButtonSize === size ? "#ffffff" : "#374151",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  textTransform: "uppercase"
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Button Color selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Theme Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={heroButtonColor || "#000000"}
                              onChange={(e) => setHeroButtonColor(e.target.value)}
                              style={{
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: "transparent"
                              }}
                            />
                            <input
                              type="text"
                              placeholder="e.g. #ff0000 (falls back to brand primary color if empty)"
                              value={heroButtonColor}
                              onChange={(e) => setHeroButtonColor(e.target.value)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                boxSizing: "border-box",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                        {/* Button Text Color selector */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>Button Text Color</label>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="color"
                              value={heroButtonTextColor || "#ffffff"}
                              onChange={(e) => setHeroButtonTextColor(e.target.value)}
                              style={{
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                cursor: "pointer",
                                backgroundColor: "transparent"
                              }}
                            />
                            <input
                              type="text"
                              value={heroButtonTextColor}
                              onChange={(e) => setHeroButtonTextColor(e.target.value)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "0.88rem",
                                width: "100%",
                                boxSizing: "border-box",
                                color: "#000",
                                fontFamily: "monospace"
                              }}
                            />
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: "30px 10px", textAlign: "center", color: "#64748b", border: "1px dashed #e2e8f0", borderRadius: "8px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#94a3b8" style={{ width: "32px", height: "32px", margin: "0 auto 8px auto" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-1.676-1.345c-.528-.407-1.094-.82-1.676-1.228m1.676 1.228a17.382 17.382 0 0 0-3.352-2.528m3.352 2.528c.582.448 1.148.89 1.676 1.345M12 3v18M3 12h18" />
                    </svg>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      Select a component on the live preview to begin customizing it.
                    </span>
                  </div>
                )}

              </div>


              {/* Right panel: Live Interactive Preview */}
              <div style={{
                flex: 1,
                backgroundColor: "#f1f5f9",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
                position: "relative"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", zIndex: 10 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.1em" }}>
                    Live Preview Screen (Visual Layout & Toggles)
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#2563eb", backgroundColor: "#dbeafe", padding: "4px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      Interactive Elements Enable Click to Select
                    </span>
                  </div>
                </div>

                {/* Scaled Desktop Mock Canvas Wrapper */}
                <div style={{ 
                  width: "100%", 
                  height: "100%", 
                  position: "relative", 
                  overflow: "hidden", 
                  backgroundColor: "#e2e8f0", 
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1"
                }}>
                  {/* Styled Desktop Viewport Scaled Down */}
                  <div
                    onClick={() => setSelectedElement(null)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "1280px",
                      height: "800px",
                      transform: "translate(-50%, -50%) scale(0.55)",
                      transformOrigin: "center center",
                      backgroundColor: heroBgType === "color" ? (heroBgColor || "var(--primary-brand-color, #57bc74)") : "#121212",
                      backgroundImage: heroBgType === "image" && heroBgImage ? `url("${heroBgImage}")` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: 
                        heroTemplate === "top-left" || heroTemplate === "right-top" || heroTemplate === "top-center" ? "flex-start" : 
                        heroTemplate === "bottom-left" || heroTemplate === "right-bottom" || heroTemplate === "bottom-center" ? "flex-end" : "center",
                      alignItems: 
                        heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
                        heroTemplate.startsWith("right") ? "flex-end" : "flex-start",
                      padding: 
                        heroTemplate === "bottom-left" || heroTemplate === "right-bottom" || heroTemplate === "bottom-center" ? "80px 5%" : 
                        heroTemplate === "top-left" || heroTemplate === "right-top" || heroTemplate === "top-center" ? "80px 5%" : "0 5%",
                      textAlign: 
                        heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
                        heroTemplate.startsWith("right") ? "right" : "left",
                      transition: "all 0.3s ease",
                      boxSizing: "border-box"
                    }}
                  >
                    {heroBgType === "video" && heroBgVideo && (
                      <video src={heroBgVideo} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
                    )}
                    {heroBgType !== "color" && <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1 }} />}

                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "20px", maxWidth: "800px", width: "100%" }}>
                      
                      {/* 1. Hero Title Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("title");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "title" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showHeroTitle ? 1 : 0.45,
                          backgroundColor: selectedElement === "title" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative"
                        }}
                      >
                        {selectedElement === "title" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Title
                          </div>
                        )}
                        {showHeroTitle ? (
                          <h1 style={{
                            fontFamily: selectedElement === "title" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${heroTitleFontType}", sans-serif`,
                            color: heroTitleFontColor,
                            fontSize: selectedElement === "title" && hoveredFontSize ? hoveredFontSize : heroTitleFontSize,
                            fontWeight: Number(selectedElement === "title" && hoveredFontWeight ? hoveredFontWeight : heroTitleFontWeight),
                            margin: 0,
                            lineHeight: "1.1"
                          }}>
                            {heroTitle || ""}
                          </h1>
                        ) : (
                          <span style={{ fontSize: "0.95rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [Title Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                      {/* 2. Hero Manifesto Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("manifesto");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "manifesto" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showHeroManifesto ? 1 : 0.45,
                          backgroundColor: selectedElement === "manifesto" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative"
                        }}
                      >
                        {selectedElement === "manifesto" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Manifesto
                          </div>
                        )}
                        {showHeroManifesto ? (
                          <p style={{
                            fontFamily: selectedElement === "manifesto" && hoveredFontType ? `"${hoveredFontType}", sans-serif` : `"${heroManifestoFontType}", sans-serif`,
                            color: heroManifestoFontColor,
                            fontSize: selectedElement === "manifesto" && hoveredFontSize ? hoveredFontSize : heroManifestoFontSize,
                            fontWeight: Number(selectedElement === "manifesto" && hoveredFontWeight ? hoveredFontWeight : heroManifestoFontWeight),
                            margin: 0,
                            lineHeight: "1.6",
                            textTransform: "uppercase",
                            letterSpacing: "0.03em"
                          }}>
                            {heroManifesto || ""}
                          </p>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [Manifesto Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                      {/* 3. Hero Button Element */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement("button");
                        }}
                        style={{
                          cursor: "pointer",
                          border: selectedElement === "button" ? "2px dashed #2563eb" : "1px dashed transparent",
                          padding: "8px",
                          borderRadius: "6px",
                          transition: "all 0.2s",
                          opacity: showHeroButton ? 1 : 0.45,
                          backgroundColor: selectedElement === "button" ? "rgba(37, 99, 235, 0.08)" : "transparent",
                          position: "relative",
                          display: "inline-block",
                          alignSelf: 
                            heroTemplate === "center" || heroTemplate.endsWith("center") ? "center" : 
                            heroTemplate.startsWith("right") ? "flex-end" : "flex-start"
                        }}
                      >
                        {selectedElement === "button" && (
                          <div style={{ position: "absolute", top: "-18px", left: "0", fontSize: "0.6rem", fontWeight: 800, backgroundColor: "#2563eb", color: "#fff", padding: "2px 6px", borderRadius: "3px", textTransform: "uppercase" }}>
                            Active Button
                          </div>
                        )}
                        {showHeroButton ? (() => {
                          const btnColor = heroButtonColor ? heroButtonColor : (primaryColor || "#000");
                          const isSolid = heroButtonStyle === "solid";
                          const isOutline = heroButtonStyle === "outline";
                          
                          const paddings: Record<string, string> = { sm: "10px 24px", md: "14px 36px", lg: "18px 48px" };
                          const fontSizes: Record<string, string> = { sm: "0.75rem", md: "0.85rem", lg: "0.95rem" };
                          
                          return (
                            <div style={{
                              display: "inline-block",
                              padding: paddings[heroButtonSize] || paddings.md,
                              fontSize: fontSizes[heroButtonSize] || fontSizes.md,
                              backgroundColor: isSolid ? btnColor : "transparent",
                              color: isSolid ? (heroButtonTextColor || "#ffffff") : (heroButtonTextColor || btnColor),
                              border: isSolid || isOutline ? `2px solid ${btnColor}` : "none",
                              textDecoration: heroButtonStyle === "minimal" ? "underline" : "none",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              textAlign: "center"
                            }}>
                              {heroButtonText || "Shop Now"}
                            </div>
                          );
                        })()
                        : (
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: 600 }}>
                            [CTA Button Element Hidden - Click to edit & enable]
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              padding: "16px 30px",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#fafafa"
            }}>
              <button
                type="button"
                onClick={() => {
                  // Restore from backup on click cancel
                  if (heroBackup) {
                    setHeroTitle(heroBackup.heroTitle);
                    setHeroManifesto(heroBackup.heroManifesto);
                    setHeroTemplate(heroBackup.heroTemplate);
                    setShowHeroTitle(heroBackup.showHeroTitle);
                    setShowHeroManifesto(heroBackup.showHeroManifesto);
                    setShowHeroButton(heroBackup.showHeroButton);
                    setHeroButtonText(heroBackup.heroButtonText);
                    setHeroButtonStyle(heroBackup.heroButtonStyle);
                    setHeroButtonSize(heroBackup.heroButtonSize);
                    setHeroButtonColor(heroBackup.heroButtonColor);
                    setHeroButtonTextColor(heroBackup.heroButtonTextColor);
                    setHeroTitleFontType(heroBackup.heroTitleFontType);
                    setHeroTitleFontColor(heroBackup.heroTitleFontColor);
                    setHeroTitleFontSize(heroBackup.heroTitleFontSize);
                    setHeroTitleFontAlignment(heroBackup.heroTitleFontAlignment);
                    setHeroTitleFontWeight(heroBackup.heroTitleFontWeight);
                    setHeroManifestoFontType(heroBackup.heroManifestoFontType);
                    setHeroManifestoFontColor(heroBackup.heroManifestoFontColor);
                    setHeroManifestoFontSize(heroBackup.heroManifestoFontSize);
                    setHeroManifestoFontAlignment(heroBackup.heroManifestoFontAlignment);
                    setHeroManifestoFontWeight(heroBackup.heroManifestoFontWeight);
                  }
                  setShowHeroTitleFontOptions(false);
                }}
                className={styles.secondaryActionBtn}
                style={{ padding: "10px 24px", fontSize: "0.88rem", fontWeight: 600 }}
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={async () => {
                  await saveSettingsSilent();
                  setShowHeroTitleFontOptions(false);
                }}
                className={styles.primaryActionBtn}
                style={{ padding: "10px 24px", fontSize: "0.88rem", fontWeight: 600 }}
              >
                Apply Customization
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Rename Category Modal */}
      {renameCategoryTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <h3>Rename Category</h3>
            </div>
            <div style={{ marginTop: "15px", marginBottom: "15px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>New Category Name</label>
              <input
                type="text"
                value={renameCategoryNewName}
                onChange={(e) => setRenameCategoryNewName(e.target.value)}
                placeholder="Enter new category name..."
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
              />
            </div>
            <div className={styles.modalActionRow}>
              <button
                onClick={handleRenameCategorySubmit}
                disabled={isRenamingCategory || !renameCategoryNewName.trim() || renameCategoryNewName.trim() === renameCategoryTarget}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#4f46e5", borderColor: "#4f46e5", opacity: (isRenamingCategory || !renameCategoryNewName.trim() || renameCategoryNewName.trim() === renameCategoryTarget) ? 0.7 : 1 }}
              >
                {isRenamingCategory ? "Saving..." : "Rename Category"}
              </button>
              <button
                onClick={() => { setRenameCategoryTarget(null); setRenameCategoryNewName(""); }}
                className={styles.secondaryActionBtn}
                disabled={isRenamingCategory}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {deleteReviewTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ef4444" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3>Confirm Deletion</h3>
            </div>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", marginTop: "10px", marginBottom: "20px" }}>
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>
            <div className={styles.modalActionRow}>
              <button
                onClick={handleDeleteAdminReviewConfirm}
                disabled={isDeletingReview}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", opacity: isDeletingReview ? 0.7 : 1 }}
              >
                {isDeletingReview ? "Deleting..." : "Delete Review"}
              </button>
              <button
                onClick={() => setDeleteReviewTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={isDeletingReview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editReviewTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.unsavedModal} style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className={styles.modalHeader}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#000" style={{ width: "24px", height: "24px", marginRight: "10px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 21.75a.75.75 0 0 1-.322.206l-4 1a.75.75 0 0 1-.905-.905l1-4a.75.75 0 0 1 .206-.322l15.118-15.118L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <h3>Edit Review</h3>
            </div>

            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Author</label>
                <input
                  type="text"
                  value={editReviewTarget.author || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, author: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Location</label>
                <input
                  type="text"
                  value={editReviewTarget.location || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, location: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editReviewTarget.rating || 5}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, rating: Number(e.target.value) })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Title</label>
                <input
                  type="text"
                  value={editReviewTarget.title || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, title: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px", color: "#374151" }}>Comment</label>
                <textarea
                  value={editReviewTarget.comment || ""}
                  onChange={(e) => setEditReviewTarget({ ...editReviewTarget, comment: e.target.value })}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "0.95rem", minHeight: "100px", resize: "vertical" }}
                />
              </div>
            </div>

            <div className={styles.modalActionRow} style={{ marginTop: "20px" }}>
              <button
                onClick={handleEditReviewSubmit}
                disabled={isEditingReview || !editReviewTarget.comment?.trim() || !editReviewTarget.author?.trim()}
                className={styles.primaryActionBtn}
                style={{ backgroundColor: "#3b82f6", borderColor: "#3b82f6", opacity: (isEditingReview || !editReviewTarget.comment?.trim() || !editReviewTarget.author?.trim()) ? 0.7 : 1 }}
              >
                {isEditingReview ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditReviewTarget(null)}
                className={styles.secondaryActionBtn}
                disabled={isEditingReview}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Status Update Modal */}
      {returnStatusModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderBottom: "1px solid #f1f5f9"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                {returnStatusAction.newStatus === "Approved" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#10b981" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" style={{ width: "20px", height: "20px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {returnStatusAction.newStatus === "Approved" ? "Approve Return" : "Reject Return"}
              </h3>
              <button
                type="button"
                onClick={() => setReturnStatusModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 0,
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
                {returnStatusAction.newStatus === "Approved" 
                  ? "You are approving this return request. Optionally, provide a note to the customer with instructions on what to do next (e.g. tracking info, timeline)."
                  : "You are rejecting this return request. Please provide a reason to the customer explaining why the claim was denied."
                }
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                  {returnStatusAction.newStatus === "Approved" ? "Note to Customer (Optional)" : "Reason for Rejection (Required)"}
                </label>
                <textarea
                  value={returnStatusNotes}
                  onChange={(e) => setReturnStatusNotes(e.target.value)}
                  placeholder={returnStatusAction.newStatus === "Approved" ? "e.g. A replacement has been dispatched and will arrive in 3-5 days." : "e.g. The damage shown is not covered by transit damage policy."}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.88rem",
                    color: "#0f172a",
                    minHeight: "100px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#94a3b8")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              padding: "16px 24px",
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #f1f5f9"
            }}>
              <button
                type="button"
                onClick={() => setReturnStatusModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: "#ffffff",
                  color: "#475569",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={returnStatusAction.newStatus === "Rejected" && !returnStatusNotes.trim()}
                onClick={() => executeReturnStatusUpdate(returnStatusAction.orderId, returnStatusAction.newStatus, returnStatusNotes)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  backgroundColor: returnStatusAction.newStatus === "Approved" ? "#10b981" : "#ef4444",
                  color: "#ffffff",
                  cursor: (returnStatusAction.newStatus === "Rejected" && !returnStatusNotes.trim()) ? "not-allowed" : "pointer",
                  opacity: (returnStatusAction.newStatus === "Rejected" && !returnStatusNotes.trim()) ? 0.5 : 1
                }}
              >
                Confirm {returnStatusAction.newStatus}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsBtn = document.getElementById('productsBtn');
    const addNewProductBtn = document.getElementById('addNewProductBtn');
    const addProductModal = document.getElementById('addProductModal');
    const editProductModal = document.getElementById('editProductModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const addProductForm = document.getElementById('addProductForm');
    const editProductForm = document.getElementById('editProductForm');
    const cancelAddProductBtn = document.getElementById('cancelAddProduct');
    const cancelEditProductBtn = document.getElementById('cancelEditProduct');
    const productDetailsModal = document.getElementById('productDetailsModal');
    const deleteProductBtn = document.getElementById('deleteProductBtn');
    const closeDetailsBtn = document.getElementById('closeDetailsBtn');

    // State variables
    let currentProductId = null;
    let mainImageFile = null;
    let galleryImageFiles = [];
    let editMainImageFile = null;
    let editGalleryImageFiles = [];

    // Initialize the dashboard
    loadProducts();

    // Event Listeners
    addNewProductBtn.addEventListener('click', () => {
        addProductModal.style.display = 'block';
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addProductModal.style.display = 'none';
            editProductModal.style.display = 'none';
            productDetailsModal.style.display = 'none';
        });
    });

    cancelAddProductBtn.addEventListener('click', () => {
        addProductModal.style.display = 'none';
        resetAddProductForm();
    });

    cancelEditProductBtn.addEventListener('click', () => {
        editProductModal.style.display = 'none';
        resetEditProductForm();
    });

    closeDetailsBtn.addEventListener('click', () => {
        productDetailsModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addProductModal || e.target === editProductModal || e.target === productDetailsModal) {
            addProductModal.style.display = 'none';
            editProductModal.style.display = 'none';
            productDetailsModal.style.display = 'none';
        }
    });

    // Main image upload (Add Product)
    document.getElementById('mainImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            mainImageFile = file;
            document.getElementById('mainImageFileName').textContent = file.name;
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('mainImagePreview').innerHTML = `
                    <img src="${event.target.result}" alt="Main Image Preview">
                `;
            };
            reader.readAsDataURL(file);
        }
    });

    // Gallery images upload (Add Product)
    document.getElementById('galleryImages').addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        galleryImageFiles = [...galleryImageFiles, ...files];
        document.getElementById('galleryImagesFileName').textContent = `${galleryImageFiles.length} files selected`;
        updateGalleryPreview();
    });

    // Main image upload (Edit Product)
    document.getElementById('editMainImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            editMainImageFile = file;
            document.getElementById('editMainImageFileName').textContent = file.name;
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('editMainImagePreview').innerHTML = `
                    <img src="${event.target.result}" alt="Main Image Preview">
                    <p class="current-image-note">New Image</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    });

    // Gallery images upload (Edit Product)
    document.getElementById('editGalleryImages').addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        editGalleryImageFiles = [...editGalleryImageFiles, ...files];
        document.getElementById('editGalleryImagesFileName').textContent = `${editGalleryImageFiles.length} files selected`;
        updateEditGalleryPreview();
    });

    // Form submission (Add Product)
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const productType = document.getElementById('productType').value;
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;

        if (!productType || !productName || !productDescription || !mainImageFile) {
            alert('Please fill in all required fields and upload a main image');
            return;
        }

        const formData = new FormData();
        formData.append('type', productType);
        formData.append('name', productName);
        formData.append('description', productDescription);
        formData.append('mainImage', mainImageFile);

        // Append gallery images
        galleryImageFiles.forEach((file, index) => {
            formData.append(`galleryImages`, file);
        });

        // Send to backend
        fetch('/api/products', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Product added successfully!');
                    resetAddProductForm();
                    addProductModal.style.display = 'none';
                    loadProducts();
                } else {
                    alert('Error adding product: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding product');
            });
    });

    // Form submission (Edit Product)
    editProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = document.getElementById('editProductId').value;
        const formData = new FormData();
        
        // Add all fields to formData
        formData.append('type', document.getElementById('editProductType').value);
        formData.append('name', document.getElementById('editProductName').value);
        formData.append('description', document.getElementById('editProductDescription').value);
        
        // Add new main image if selected
        if (editMainImageFile) {
            formData.append('mainImage', editMainImageFile);
        }
        
        // Add new gallery images if selected
        if (editGalleryImageFiles.length > 0) {
            editGalleryImageFiles.forEach(file => {
                formData.append('galleryImages', file);
            });
        }
        
        // Get images to remove
        const imagesToRemove = [];
        document.querySelectorAll('.remove-existing-image').forEach(btn => {
            imagesToRemove.push(btn.getAttribute('data-image'));
        });
        
        if (imagesToRemove.length > 0) {
            formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
        }
        
        // Send to backend
        fetch(`/api/products/${productId}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Product updated successfully');
                editProductModal.style.display = 'none';
                loadProducts();
            } else {
                alert('Error updating product: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating product:', error);
            alert('Error updating product');
        });
    });

    // Delete product from details modal
    deleteProductBtn.addEventListener('click', function() {
        if (!currentProductId) return;

        if (confirm('Are you sure you want to delete this product?')) {
            fetch(`/api/products/${currentProductId}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Product deleted successfully!');
                        productDetailsModal.style.display = 'none';
                        loadProducts();
                    } else {
                        alert('Error deleting product: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error deleting product');
                });
        }
    });

    // Functions
    function loadProducts() {
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                displayProductsByCategory(products);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                document.querySelector('.product-categories').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error loading products. Please try again later.</p>
                    </div>
                `;
            });
    }

    function displayProductsByCategory(products) {
        const productCategoriesContainer = document.querySelector('.product-categories');
        productCategoriesContainer.innerHTML = '';

        if (!products || products.length === 0) {
            productCategoriesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>No products found. Add your first product to get started.</p>
                </div>
            `;
            return;
        }

        // Group products by type
        const productsByType = {};
        products.forEach(product => {
            if (!productsByType[product.type]) {
                productsByType[product.type] = [];
            }
            productsByType[product.type].push(product);
        });

        // Create a section for each product type
        for (const type in productsByType) {
            const categorySection = document.createElement('div');
            categorySection.className = 'product-category';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = type;

            const productsGrid = document.createElement('div');
            productsGrid.className = 'products-grid';

            productsByType[type].forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                productCard.innerHTML = `
                    <img src="/uploads/${product.mainImage}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-actions">
                            <button class="view-btn view-details-btn" data-id="${product._id}">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="edit-btn edit-product-btn" data-id="${product._id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="delete-btn delete-product-btn" data-id="${product._id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;

                productsGrid.appendChild(productCard);
            });

            categorySection.appendChild(categoryTitle);
            categorySection.appendChild(productsGrid);
            productCategoriesContainer.appendChild(categorySection);
        }

        // Add event listeners to view details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                showProductDetails(productId);
            });
        });

        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-product-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                openEditProductModal(productId);
            });
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-product-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this product?')) {
                    deleteProduct(productId);
                }
            });
        });
    }

    function showProductDetails(productId) {
        fetch(`/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                currentProductId = product._id;

                // Populate modal with product data
                document.getElementById('modalProductName').textContent = product.name;
                document.getElementById('modalProductType').textContent = `Type: ${product.type}`;
                document.getElementById('modalProductDescription').textContent = product.description;

                // Set main image
                const mainImage = document.getElementById('modalMainImage');
                mainImage.src = `/uploads/${product.mainImage}`;
                mainImage.alt = product.name;

                // Set gallery images
                const galleryContainer = document.getElementById('modalGallery');
                galleryContainer.innerHTML = '';

                if (product.galleryImages && product.galleryImages.length > 0) {
                    product.galleryImages.forEach(image => {
                        const img = document.createElement('img');
                        img.src = `/uploads/${image}`;
                        img.alt = `${product.name} gallery image`;
                        galleryContainer.appendChild(img);
                    });
                } else {
                    galleryContainer.innerHTML = '<p>No gallery images available</p>';
                }

                // Show modal
                productDetailsModal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error loading product details:', error);
                alert('Error loading product details');
            });
    }

    function openEditProductModal(productId) {
        fetch(`/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                currentProductId = product._id;

                // Populate the edit form
                document.getElementById('editProductId').value = product._id;
                document.getElementById('editProductType').value = product.type;
                document.getElementById('editProductName').value = product.name;
                document.getElementById('editProductDescription').value = product.description;
                
                // Show current main image
                const mainImagePreview = document.getElementById('editMainImagePreview');
                mainImagePreview.innerHTML = `
                    <img src="/uploads/${product.mainImage}" alt="Current Main Image">
                    <p class="current-image-note">Current Image</p>
                `;
                
                // Show current gallery images
                const currentGalleryPreview = document.getElementById('currentGalleryPreview');
                currentGalleryPreview.innerHTML = '';
                if (product.galleryImages && product.galleryImages.length > 0) {
                    product.galleryImages.forEach(image => {
                        const thumb = document.createElement('div');
                        thumb.className = 'gallery-thumb';
                        thumb.innerHTML = `
                            <img src="/uploads/${image}" alt="Gallery Image">
                            <button class="remove-existing-image" data-image="${image}">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        currentGalleryPreview.appendChild(thumb);
                    });
                }
                
                // Add event listeners to remove existing image buttons
                document.querySelectorAll('.remove-existing-image').forEach(button => {
                    button.addEventListener('click', function() {
                        this.closest('.gallery-thumb').remove();
                    });
                });
                
                // Reset edit image files
                editMainImageFile = null;
                editGalleryImageFiles = [];
                document.getElementById('editMainImageFileName').textContent = 'No file chosen';
                document.getElementById('editGalleryImagesFileName').textContent = 'No files chosen';
                
                // Open the modal
                editProductModal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error loading product for edit:', error);
                alert('Error loading product details for editing');
            });
    }

    function deleteProduct(productId) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Product deleted successfully');
                loadProducts(); // Refresh the product list
            } else {
                alert('Error deleting product: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        });
    }

    function updateGalleryPreview() {
        const galleryPreview = document.getElementById('galleryPreview');
        galleryPreview.innerHTML = '';

        galleryImageFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'gallery-thumbnail';
                thumbnail.innerHTML = `
                    <img src="${event.target.result}" alt="Gallery Image ${index + 1}">
                    <button class="remove-gallery-image" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                galleryPreview.appendChild(thumbnail);

                // Add event listener to remove button
                thumbnail.querySelector('.remove-gallery-image').addEventListener('click', function() {
                    removeGalleryImage(index);
                });
            };
            reader.readAsDataURL(file);
        });
    }

    function updateEditGalleryPreview() {
        const galleryPreview = document.getElementById('editGalleryPreview');
        galleryPreview.innerHTML = '';

        editGalleryImageFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'gallery-thumbnail';
                thumbnail.innerHTML = `
                    <img src="${event.target.result}" alt="Gallery Image ${index + 1}">
                    <button class="remove-gallery-image" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                galleryPreview.appendChild(thumbnail);

                // Add event listener to remove button
                thumbnail.querySelector('.remove-gallery-image').addEventListener('click', function() {
                    removeEditGalleryImage(index);
                });
            };
            reader.readAsDataURL(file);
        });
    }

    function removeGalleryImage(index) {
        galleryImageFiles.splice(index, 1);
        document.getElementById('galleryImagesFileName').textContent =
            galleryImageFiles.length > 0 ? `${galleryImageFiles.length} files selected` : 'No files chosen';
        updateGalleryPreview();
    }

    function removeEditGalleryImage(index) {
        editGalleryImageFiles.splice(index, 1);
        document.getElementById('editGalleryImagesFileName').textContent =
            editGalleryImageFiles.length > 0 ? `${editGalleryImageFiles.length} files selected` : 'No files chosen';
        updateEditGalleryPreview();
    }

    function resetAddProductForm() {
        addProductForm.reset();
        document.getElementById('mainImagePreview').innerHTML = '';
        document.getElementById('galleryPreview').innerHTML = '';
        document.getElementById('mainImageFileName').textContent = 'No file chosen';
        document.getElementById('galleryImagesFileName').textContent = 'No files chosen';
        mainImageFile = null;
        galleryImageFiles = [];
    }

    function resetEditProductForm() {
        editProductForm.reset();
        document.getElementById('editMainImagePreview').innerHTML = '';
        document.getElementById('editGalleryPreview').innerHTML = '';
        document.getElementById('currentGalleryPreview').innerHTML = '';
        document.getElementById('editMainImageFileName').textContent = 'No file chosen';
        document.getElementById('editGalleryImagesFileName').textContent = 'No files chosen';
        editMainImageFile = null;
        editGalleryImageFiles = [];
    }
});
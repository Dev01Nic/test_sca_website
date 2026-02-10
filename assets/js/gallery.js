let currentEvent = '';
let currentImgIdx = 1;
let totalImgs = 0;
let eventTitle = ''; // New variable to store the title

window.openGallery = function(folderName, count, element) {
    currentEvent = folderName;
    totalImgs = parseInt(count); 
    currentImgIdx = 1;
    
    // Grab the title from the specific card that was clicked
    // It looks for the closest .card and finds the .album-title inside it
    eventTitle = $(element).closest('.card').find('.album-title').text();
    
    updateModalImage();
    $('#galleryModal').modal('show');
}

function updateModalImage() {
    const imagePath = `assets/gallery/photos/${currentEvent}/${currentImgIdx}.jpg`;
    $('#galleryImage').attr('src', imagePath);
    
    // Update both Title and Counter
    $('#modalTitle').text(eventTitle);
    $('#imageCounter').text(`Image ${currentImgIdx} of ${totalImgs}`);
}

window.changeImage = function(step) {
    currentImgIdx += step;
    if (currentImgIdx > totalImgs) currentImgIdx = 1;
    if (currentImgIdx < 1) currentImgIdx = totalImgs;
    updateModalImage();
}

$(document).keydown(function(e) {
    if ($('#galleryModal').is(':visible')) {
        if (e.keyCode == 37) changeImage(-1);
        if (e.keyCode == 39) changeImage(1);
    }
});

// --- SEARCH & PAGINATION LOGIC ---
$(document).ready(function() {
    const itemsPerPage = 9;
    const $grid = $('#gallery-grid');
    const $pagination = $('#gallery-pagination');

    function refreshGallery() {
        // Get items that aren't hidden by search
        const $visibleItems = $('.gallery-item:not(.d-none)');
        const totalVisible = $visibleItems.length;
        const totalPages = Math.ceil(totalVisible / itemsPerPage);

        $pagination.empty();
        
        if (totalVisible === 0) {
            if (!$('#no-results').length) {
                $grid.append('<div id="no-results" class="col-12 text-center py-5"><p class="text-muted">No albums found matching your search.</p></div>');
            }
        } else {
            $('#no-results').remove();
        }

        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                $pagination.append(`<li class="page-item" data-page="${i}"><a class="page-link shadow-sm mx-1" href="javascript:void(0)">${i}</a></li>`);
            }
            showPage(1, $visibleItems);
        } else {
            $visibleItems.fadeIn();
        }
    }

    function showPage(page, items) {
        $('.gallery-item').hide(); // Hide all first
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        items.slice(start, end).fadeIn(400);

        $pagination.find('.page-item').removeClass('active');
        $pagination.find(`[data-page="${page}"]`).addClass('active');
    }

    // Live Search
    $('#gallerySearch').on('keyup', function() {
        const val = $(this).val().toLowerCase();
        $('.gallery-item').each(function() {
            const text = $(this).find('.album-title').text().toLowerCase();
            // Toggle d-none based on search match
            if (text.indexOf(val) > -1) {
                $(this).removeClass('d-none');
            } else {
                $(this).addClass('d-none');
            }
        });
        refreshGallery();
    });

    // Pagination Click
    $(document).on('click', '#gallery-pagination .page-item', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        const $visibleItems = $('.gallery-item:not(.d-none)');
        showPage(page, $visibleItems);
        $('html, body').animate({ scrollTop: $grid.offset().top - 100 }, 300);
    });

    // Initialize the gallery
    refreshGallery();
});
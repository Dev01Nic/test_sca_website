let currentEvent = '';
let currentImgIdx = 1;
let totalImgs = 0;

function openGallery(folderName, count) {
    currentEvent = folderName;
    totalImgs = count; // Tell the script how many images are in the folder
    currentImgIdx = 1;
    updateModalImage();
    $('#galleryModal').modal('show');
}

function updateModalImage() {
    // Path structure: assets/photos/event_name/1.jpg
    const imagePath = `assets/gallery/photos/${currentEvent}/${currentImgIdx}.jpg`;
    $('#galleryImage').attr('src', imagePath);
    $('#imageCounter').text(`Image ${currentImgIdx} of ${totalImgs}`);
}

function changeImage(step) {
    currentImgIdx += step;
    
    // Loop back logic
    if (currentImgIdx > totalImgs) currentImgIdx = 1;
    if (currentImgIdx < 1) currentImgIdx = totalImgs;
    
    updateModalImage();
}

// Keyboard support (Left/Right arrows)
$(document).keydown(function(e) {
    if ($('#galleryModal').is(':visible')) {
        if (e.keyCode == 37) changeImage(-1); // Left arrow
        if (e.keyCode == 39) changeImage(1);  // Right arrow
    }
});

$(document).ready(function() {
    const eventsPerPage = 8;
    const $events = $('.event-item');
    const totalEvents = $events.length;
    const totalPages = Math.ceil(totalEvents / eventsPerPage);

    function showEventPage(page) {
        $events.hide();
        const start = (page - 1) * eventsPerPage;
        const end = start + eventsPerPage;
        
        $events.slice(start, end).fadeIn(500);

        // Update pagination UI
        $('#event-pagination .page-item').removeClass('active');
        $(`#event-pagination [data-page="${page}"]`).addClass('active');
    }

    // Build Pagination Buttons
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            $('#event-pagination').append(`
                <li class="page-item" data-page="${i}">
                    <a class="page-link border-0 shadow-sm mx-1 text-dark" href="javascript:void(0)">${i}</a>
                </li>
            `);
        }
    }

    $(document).on('click', '#event-pagination .page-item', function() {
        const page = $(this).data('page');
        showEventPage(page);
        $('html, body').animate({ scrollTop: $('#events-list').offset().top - 100 }, 300);
    });

    // Initialize Page 1
    showEventPage(1);

    // Search Logic
    $('#eventsSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        
        $('.event-item').filter(function() {
            // This searches through the title, sub-header, and date
            $(this).toggleClass('d-none', $(this).text().toLowerCase().indexOf(value) === -1);
        });

        updateView();
    });
});
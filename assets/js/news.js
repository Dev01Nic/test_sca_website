$(document).ready(function() {
    const itemsPerPage = 5;
    const $newsContainer = $('#news-container');
    const $pagination = $('#pagination');

    function updateView() {
        const $visibleItems = $('.news-item:not(.d-none)');
        const totalVisible = $visibleItems.length;
        const totalPages = Math.ceil(totalVisible / itemsPerPage);

        // Handle Pagination Visibility
        $pagination.empty();
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                $pagination.append(`<li class="page-item" data-page="${i}"><a class="page-link" href="#">${i}</a></li>`);
            }
            showPage(1, $visibleItems);
        } else {
            $visibleItems.fadeIn();
        }
        
        // Show "No Results" message
        if (totalVisible === 0) {
            if ($('#no-results').length === 0) {
                $newsContainer.append('<div id="no-results" class="col-12 text-center py-5"><i class="fas fa-search-minus fa-3x text-muted mb-3"></i><p class="text-muted">No matching news found. Try a different keyword.</p></div>');
            }
        } else {
            $('#no-results').remove();
        }
    }

    function showPage(page, items) {
        items.hide();
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        items.slice(start, end).fadeIn();
        $pagination.find('.page-item').removeClass('active');
        $pagination.find(`[data-page="${page}"]`).addClass('active');
    }

    // Search Logic
    $('#newsSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        
        $('.news-item').filter(function() {
            // This searches through the title, sub-header, and date
            $(this).toggleClass('d-none', $(this).text().toLowerCase().indexOf(value) === -1);
        });

        updateView();
    });

    // Pagination Click
    $(document).on('click', '.page-item', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        const $visibleItems = $('.news-item:not(.d-none)');
        showPage(page, $visibleItems);
        $('html, body').animate({ scrollTop: $newsContainer.offset().top - 100 }, 200);
    });

    // Initial Load
    updateView();
});

/* Initialization */
$(function() {
    initSubHeader();
    initSidebarNav();
    initScrollMenu();
    fixEncoding();
    $('body').show();
});

$( window ).load(function() {
    initFancyBox();
});


function initFancyBox () {

    $(document).bind('page:change', function(){
        $('.fancybox').fancybox({ parent: "body"})
    });

    $(".article-content span.image").each(function(index, value) {
        var natImgWidth = $(this).find('img').get(0).naturalWidth;
        if ( natImgWidth > 500 ) {
            var imgSrc = $(this).find('img').attr('src');
            $(this).replaceWith('<span class="image"><a class="fancybox" href="'+imgSrc+'"><img src="'+imgSrc+'"/></a></span>');
        }
    });
    $(".fancybox").fancybox();
}

function initSubHeader(){

    //Fixed subheader
    $(window).resize(function(){
        $('.sub-header').css('width', $('.container').css('width'));
        scrollbarAdjusting();
    });

    $(window).scroll(function () {
        var y = $(this).scrollTop();

        if (y>=$('.header').height()) {
            $('.sub-header').css({
                'position': 'fixed',
                'z-index': '999',
                'top': '0',
                'width': $('.container').css('width')
            });

        }
        else {
            $('.sub-header').css('position', 'static');
            $('.tree-icon').css('display', 'inline-block');

        }

    });


    //Avoid Bootstrap dropdown auto-close when clicking
    $('.toolbar-dropdown ul.dropdown-menu').on('click', function(event) {
        event.stopPropagation();
    });

    //Tree Toggle button
    $('.tree-icon').unbind('click').click(function(e){
        e.preventDefault();
        $(this).toggleClass('tree-closed');
        $('.version-selector').toggleClass('hidecontent');
        $('.sidebar-nav').animate({width: "toggle"}, 150, function(){
            if($('.article-content').hasClass('col-md-7')){
                $('.article-content').removeClass('col-md-7').addClass('col-md-10');
            }
            else {
                $('.article-content').removeClass('col-md-10').addClass('col-md-7');
            }
        });
    });

    //Remove Search input box placeholder on focus
    $('.search-field').focus(function(){
        $(this).data('placeholder',$(this).attr('placeholder'))
        $(this).attr('placeholder','');
    });
    $('.search-field').blur(function(){
        $(this).attr('placeholder',$(this).data('placeholder'));
    });
}

/*
function scrollbarAdjusting(){
    $('.scroll-menu').css('max-height',$(window).height() * .8 + 'px');
    var y = $(this).scrollTop();


    var collapse = y + $('.scroll-menu').height() > $('.footer').offset().top - 180;
    if(!collapse){
        $('.scroll-menu').css('top', y + 'px');
    }
    else {
        $('.scroll-menu').css('top', $('.footer').offset().top -  $('.scroll-menu').height() - 180 + 'px');
    }
}
*/

function scrollbarAdjusting(){
    $('.scroll-menu').css('max-height',$(window).height() * .8 + 'px');
    var y = $(this).scrollTop();
    var collapse = y + $('.scroll-menu').height() > $('.footer').offset().top - 190;
    if(collapse){
        $('.scroll-menu').css('position','absolute');
        $('.scroll-menu').css('top', $('.footer').offset().top -  $('.scroll-menu').height() - 190 + 'px');
    }
    else {
        $('.scroll-menu').css('position','fixed');
        $('.scroll-menu').css('top', '120px');
    }
}

function initScrollMenu(){

    scrollbarAdjusting();

    //Scroll-menu active links
    $(window).scroll(function () {

        scrollbarAdjusting();
        var y = $(this).scrollTop();

        $('.scroll-menu-link').each(function (event) {
            if (y < $($(this).attr('href')).offset().top) {
                var prev = $(this).prev();
                var activeElement =  prev.length == 0? $(this) : prev;
                $('.scroll-menu-link').removeClass('active');
                activeElement.addClass('active');
                return false;
            }
        });

    });


    //Scroll-menu smooth scroll
    $('.scroll-menu a[href*=#]:not([href=#])').click(function (e) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var nameVal = this.hash.slice(1);
            target = target.length ? target : $('[name=' + nameVal + ']');

            if (target.length) {
                $('html,body').animate({
                    scrollTop: (target.offset().top - 150)
                }, 300);
                history.pushState({}, null,'#' + nameVal);
                return false;
            }
        }


    });
}

/* Setting sidebar tree nav */
function initSidebarNav(){


    //Collapse all lists
    $('.sidebar-nav nav li:has(ul)').addClass('parent_li');
    openExpandedSubtree();


    //Active item
    var activeItem = $('.sidebar-nav nav li.active');

    if(activeItem.length > 0){
        place_scroll_marker(activeItem, 'active-marker');
    }




    $('.sidebar-nav nav li.parent_li > i').on('click', function (e) {


        var parent = $(this).parent('li.parent_li'),
            children = parent.find('> ul');

        // Set active category
        if(parent.parent().hasClass('tree')) {
            collapseLists('fast');

        }

        place_scroll_marker(parent, 'marker');

        // Show/hide a sublist
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');


            /* Remove active trail from the node to the childrens */
            parent.removeClass('expanded');
            parent.find('li.expanded').removeClass('expanded');

            //Hide active-marker
            if(children.find('.active'))
                $('.active-marker').hide('fast');


        } else {
            children.show(); // it was 'fast' before
            $(this).addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right');
            parent.addClass('expanded');

            if(children.find('.active').is(':visible')){
                $('.active-marker').show('fast');
            }
        }
        //resizeArticleContent();
        e.stopPropagation();
    });

    $('.sidebar-nav nav li').hover(function() {
        $('.marker').show();
        place_scroll_marker($(this), "marker");
    },function() {
        if(!$('.tree').is(':hover'))
            $('.marker').hide();
    });

    function collapseLists(speed) {
        $('.sidebar-nav nav li.parent_li').removeClass('expanded');
        $('.sidebar-nav nav li.parent_li > ul').hide(speed);
        $('.sidebar-nav nav li.parent_li > i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
    }


    function openExpandedSubtree(){
        $('.sidebar-nav nav li.parent_li > ul').hide();
        $('.sidebar-nav nav li.parent_li > i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
        $('.sidebar-nav nav li.parent_li.expanded > ul').show();
        $('.sidebar-nav nav li.parent_li.expanded > i').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right');
    }

    function place_scroll_marker(elem, markerClass) {
        var offsetTop = elem.offset().top,
            offsetLeft = $(".tree").left,
            link = elem.find('> a'),
            linkHeight = link.height() + parseInt(elem.css('padding-top')) + parseInt(elem.css('padding-bottom')) + parseInt(link.css('padding-bottom')) + parseInt(link.css('padding-bottom'));
            //linkHeight = link.height() + parseInt(link.css('padding-bottom')) + parseInt(link.css('padding-bottom'));
        $(".sidebar-nav ." + markerClass).show();
        $(".sidebar-nav ." + markerClass).offset({top: offsetTop, left: offsetLeft});
        $(".sidebar-nav ." + markerClass).height(linkHeight);
    }

}



function fixEncoding(){
    $('.article-content .listingblock .CodeRay .entity').each(function(){
        var curCont = $(this).text();
        $(this).html(curCont.replace('&amp;', '&'));
    });
}

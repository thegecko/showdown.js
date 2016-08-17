"use strict";

// https://github.com/umdjs/umd
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS
        module.exports = factory;
    } else {
        // Browser globals with support for web workers (root is window)

        root.document.addEventListener("DOMContentLoaded", function() {

            function getFile(query) {
                var file = query.substr(1);

                if (!file.startsWith("http")) {
                    file = "https://gist.githubusercontent.com/" + file + "/raw";
                }

                return file;
            }

            var options = {
                elementName: "showdown",
                file: "/README.md",
                slide: 1
            };

            if (root.options) {
                for (var key in root.options) options[key] = root.options[key];
            }

            if (root.document.location.search.length > 1) options.file = getFile(root.document.location.search);
            else if (root.document.location.pathname.length > 1) options.file = getFile(root.document.location.pathname);

            if (root.document.location.hash) {
                options.slide = parseInt(root.document.location.hash.substr(1));
            }

            var element = root.document.getElementById(options.elementName);

            fetch(options.file)
            .then(response => response.text())
            .then(function(markdown) {
                var title = factory(root, element, markdown, options.slide);
                if (title) root.document.title = title;
            });
        });
    }
}(this, function(context, element, markdown, slide) {
    slide = slide || 1;

    function parseMarkdown() {
        var parsed = [];

        var markers = {
            "h": /^#{1,6}/,
            "ul": /^\s{0,2}\*/,
            "ol": /^\s{0,2}\d{1,3}\./,
            "blockquote": /^>/,
            "code": /^```/
        };
        var html = "";
        var inQoute = false;
        var inCode = false;
        var listMarkers = [];

        function formatLine(value) {
            // Images
            value = value.replace(/!\[(.+?)\]\((.+?)\)/g, function(match, title, src) {
                return "<img title='" + title + "' src='" + src + "'/>";
            });

            // Links
            value = value.replace(/\[(.+?)\]\((.+?)\)/g, function(match, link, url) {
                return "<a target='_blank' href='" + url + "'>" + link + "</a>";
            });

            // Bold
            value = value.replace(/__(.+?)__|\*\*(.+?)\*\*/g, function(match, text1, text2) {
                return "<strong>" + (text1 || text2) + "</strong>";
            });

            // Italic
            value = value.replace(/_(.+?)_|\*(.+?)\*/g, function(match, text1, text2) {
                return "<em>" + (text1 || text2) + "</em>";
            });

            // Inline Code
            value = value.replace(/```(.+?)```|`([^`]+?)`/g, function(match, text1, text2) {
                return "<code>" + (text1 || text2) + "</code>";
            });

            return value;
        }

        function completeParse(html) {
            if (inQoute) html += '</blockquote>';
            if (inCode) html += '</code>';

            if (listMarkers) {
                html += "</" + listMarkers.join("></") + ">";
                listMarkers = [];
            }

            if (html) parsed.push(html);
        }

        var lines = markdown.split("\n");
        lines.forEach(function(line) {

            var value = formatLine(line);
            var element = "p";
            var length = 0;

            Object.keys(markers).some(function(marker) {
                var regex = markers[marker];
                var match = value.match(regex);

                if (match) {
                    length = match[0].length;
                    value = value.substr(length).trim();
                    element = marker;

                    return true;
                }

                return false;
            });

            if (element === "blockquote") {
                if (!inQoute) {
                    html += "<blockquote>";
                    inQoute = true;
                }
                element = "p";
            } else if (inQoute) {
                html += "</blockquote>";
                inQoute = false;
            }

            if (element === "code") {
                html += inCode ? "</code>" : "<code>";
                inCode = !inCode;
                element = "p";
            }

            if (element === "h") {
                element = "h" + length;
                if (element === "h1") {
                    if (!title) title = value;
                    if (html) {
                        completeParse(html);
                        html = "";
                    }
                }
            }

            var level = 0;
            if (element === "ul" || element === "ol") {
                level = (element === "ul") ? length : length - 1;

                while (listMarkers.length < level) {
                    html += "<" + element + ">";
                    listMarkers.push(element);
                }

                element = "li";
            }

            while (listMarkers.length > level) {
                html += "</" + listMarkers.pop() + ">";
            }

            html += "<" + element + ">" + value + "</" + element + ">";
        });

        completeParse(html);
        return parsed;
    }

    function renderSlides(html) {
        var slides = [];

        for (var i = 0; i < html.length; i++) {
            var slide = context.document.createElement("div");
            slide.id = "slide-" + i;
            slide.className = "slide after scalerContainer";
            slide.innerHTML = "<div class='scaler'><div class='content'>" + html[i] + "</div></div><div class='number'>" + (i + 1) + "</div>";
            element.appendChild(slide);
            slides.push(slide);
        }

        return slides;
    }

    function showSlide(count) {
        slide += count;
        for (var i = 0; i < slides.length; i++) {
            slides[i].classList.toggle("before", i < (slide-1));
            slides[i].classList.toggle("after", i > (slide-1));
        }
    }

    function scale() {
        for (var i = elements.length -1 ; i >= 0; i--) {
            var element = elements[i];
            var scaleW = element.parentElement.clientWidth / element.scrollWidth;
            var scaleH = element.parentElement.clientHeight / element.scrollHeight;
            var scale = Math.min(scaleW, scaleH);
            element.style.transform = "scale(" + scale + ", " + scale + ")";
        }
    }

    function prev() {
        if (slide > 1) showSlide(-1);
        history.pushState({ slide: slide }, null, "#" + slide);
    }

    function next() {
        if (context.document.body.webkitRequestFullscreen && !context.document.webkitFullscreenElement) {
            context.document.body.webkitRequestFullscreen();
            return;
        }

        if (context.document.body.mozRequestFullScreen && !context.document.mozFullScreenElement) {
            context.document.body.mozRequestFullScreen();
            return;
        }

        if (slide < slides.length) showSlide(1);
        history.pushState({ slide: slide }, null, "#" + slide);
    }

    context.addEventListener("resize", scale);
    context.addEventListener("keydown", function(e) {
        if (e.which === 8) prev(); // backspace
        if (e.which === 37) prev(); // left
        if (e.which === 38) prev(); // up
        if (e.which === 39) next(); // right
        if (e.which === 40) next(); // down
        if (e.which === 32) next(); // space
        if (e.which === 13) next(); // return
        return false;
    });

    context.document.onclick = function(e) {
        if (e.target.nodeName.toUpperCase() === "A") return;
        next();
    };

    var touchX = 0;
    context.document.addEventListener('touchstart', function(e) {
        touchX = e.changedTouches[0].screenX;
    }, false);

    context.document.addEventListener('touchend', function(e) {
        if (e.changedTouches[0].screenX > touchX) prev();
        if (e.changedTouches[0].screenX < touchX) next();
    }, false);

    context.onpopstate = function(e) {
        slide = e.state.slide;
        showSlide(0);
    };

    var title = null;
    var parsed = parseMarkdown();
    var slides = renderSlides(parsed);
    var elements = context.document.getElementsByClassName("scaler");

    history.replaceState({ slide: slide }, null, "#" + slide);
    showSlide(0);
    scale();
    setTimeout(scale, 10); // eugh

    return title;
}));

const header  = document.querySelector('.header')

document.addEventListener('click', function () {
    console.log('Вы кликнули по странице!')
  })
            // Задание 1
            const question = document.getElementsByClassName('question-1');

            function isElementInElement(element1, element2) {
                let c1 = element2.getBoundingClientRect();
                let c2 = element1.getBoundingClientRect();
                return c1.top < c2.top && c1.bottom > c2.bottom && c1.left < c2.left && c1.right > c2.right;
            }

            function cursorChaser(element) {
                let cursorChaserEvent = function (mouse) {
                    element.style.top = mouse.clientY;
                    element.style.left = mouse.clientX;
                }
                if (element.classList.contains('cur-move')) {
                    element.classList.remove('cur-move');
                    element.removeEventListener('mousemove', element, false)
                } else {
                    element.classList.add('cur-move');
                    element.style.display = 'inlineblock';
                    element.addEventListener('click', isCursourDroppable, false);
                    document.addEventListener('mousemove', cursorChaserEvent, false);
                }
            }

            function isCursourDroppable() {
                let cursorElement = document.querySelector('.cur-move');
                for (let element of document.querySelectorAll('.droppable')) {
                    if (isElementInElement(cursorElement, element)) {
                        let container = element.querySelector('.card-title');
                        // for (let c of container.getElementsByTagName(cursorElement.tagName))
                        //     if (c.innerText == cursorElement.innerText)
                        //         return undefined;
                        var cloneCursorElement = cursorElement.cloneNode(true);
                        cloneCursorElement.classList.remove('cur-move');
                        cloneCursorElement.style = "cursor: grab;"
                        cloneCursorElement.onclick = function (e) {
                            setTimeout(function () {
                                e.target.remove();
                            }, 130);
                            e.target.animate([
                                { opacity: 1, cursor: 'grabbing' },
                                { opacity: 0, transform: 'translateY(-100%)' }
                            ], 150);
                        };
                        element.appendChild(cloneCursorElement);
                    }
                }
                cursorElement.remove();
                for (let i of document.querySelectorAll('.btn-sm'))
                    i.disabled = false;
            }

            for (let button of document.querySelectorAll('.btn-sm')) {
                button.addEventListener("click", function () {
                    console.log("buttons_click");
                    for (let i of document.querySelectorAll('.btn-sm'))
                        i.disabled = true;
                    let bange = document.createElement('span');
                    bange.classList.add('badge');
                    bange.classList.add('badge-primary');
                    bange.innerText = button.innerText;
                    cursorChaser(bange);
                    document.body.appendChild(bange);
                    let c = button.getBoundingClientRect();
                    bange.style.top = (c.bottom - c.top) / 2 + c.top;
                    bange.style.left = (c.right - c.left) / 2 + c.left;
                });
            }